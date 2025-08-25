const express = require('express');
const Artwork = require('../models/Artwork');
const auth = require('../middleware/auth');
const { upload, processImages, deleteImageFiles } = require('../middleware/upload');

const router = express.Router();

// 获取作品列表（分页 + 搜索）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const searchQuery = req.query.q || '';
    
    // 构建查询条件
    const query = {};
    if (searchQuery.trim()) {
      query.$text = { $search: searchQuery };
    }
    
    // 计算跳过的文档数量
    const skip = (page - 1) * limit;
    
    // 执行查询
    const [artworks, total] = await Promise.all([
      Artwork.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Artwork.countDocuments(query)
    ]);
    
    // 计算总页数
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      items: artworks,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
    
  } catch (error) {
    console.error('获取作品列表错误:', error);
    res.status(500).json({
      error: '获取作品列表失败',
      message: '服务器内部错误'
    });
  }
});

// 获取单个作品详情
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).lean();
    
    if (!artwork) {
      return res.status(404).json({
        error: '作品不存在',
        message: '未找到指定的艺术作品'
      });
    }
    
    // 获取相关作品（同年或相近时间）
    const relatedArtworks = await Artwork.find({
      _id: { $ne: artwork._id },
      creationDate: {
        $gte: new Date(artwork.creationDate.getFullYear(), 0, 1),
        $lte: new Date(artwork.creationDate.getFullYear(), 11, 31)
      }
    })
    .sort({ creationDate: -1 })
    .limit(3)
    .lean();
    
    res.json({
      artwork,
      relatedArtworks
    });
    
  } catch (error) {
    console.error('获取作品详情错误:', error);
    res.status(500).json({
      error: '获取作品详情失败',
      message: '服务器内部错误'
    });
  }
});

// 创建新作品（需要认证）
router.post('/', auth, upload.array('images', 12), async (req, res) => {
  try {
    const { title, creationDate, description, height, width, depth, material, withFrame, coverIndex } = req.body;
    
    // 验证必填字段
    if (!title || !creationDate || !description || !height || !width || !material) {
      return res.status(400).json({
        error: '输入不完整',
        message: '请提供作品标题、创作时间、简介、高度、宽度和画布材质'
      });
    }
    
    // 验证图片
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: '缺少图片',
        message: '请至少上传一张图片'
      });
    }
    
    // 处理图片
    const processedImages = await processImages(req.files);
    
    // 确定封面图片
    let coverImage;
    if (coverIndex && parseInt(coverIndex) < processedImages.length) {
      coverImage = processedImages[parseInt(coverIndex)];
    } else {
      coverImage = processedImages[0]; // 默认第一张
    }
    
    // 创建作品
    const artwork = new Artwork({
      title: title.trim(),
      creationDate: new Date(creationDate),
      description: description.trim(),
      height: parseFloat(height),
      width: parseFloat(width),
      depth: depth ? parseFloat(depth) : undefined,
      material: material.trim(),
      withFrame: withFrame === 'true' || withFrame === true,
      coverImage,
      images: processedImages
    });
    
    await artwork.save();
    
    res.status(201).json({
      message: '作品创建成功',
      artwork
    });
    
  } catch (error) {
    console.error('创建作品错误:', error);
    
    // 如果创建失败，清理已上传的图片
    if (req.files) {
      await deleteImageFiles(req.files.map(f => f.path));
    }
    
    res.status(500).json({
      error: '创建作品失败',
      message: error.message || '服务器内部错误'
    });
  }
});

// 向已有作品追加图片（需要认证）
router.post('/:id/images', auth, upload.array('images', 12), async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找作品
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({
        error: '作品不存在',
        message: '未找到指定的艺术作品'
      });
    }
    
    // 验证图片
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: '缺少图片',
        message: '请至少上传一张图片'
      });
    }
    
    // 处理新图片
    const newImages = await processImages(req.files);
    
    // 追加到现有图片数组
    artwork.images.push(...newImages);
    
    await artwork.save();
    
    res.json({
      message: '图片追加成功',
      artwork
    });
    
  } catch (error) {
    console.error('追加图片错误:', error);
    
    // 如果追加失败，清理已上传的图片
    if (req.files) {
      await deleteImageFiles(req.files.map(f => f.path));
    }
    
    res.status(500).json({
      error: '追加图片失败',
      message: error.message || '服务器内部错误'
    });
  }
});

// 更新作品信息（需要认证）
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, creationDate, description, coverImageUrl } = req.body;
    
    // 查找作品
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({
        error: '作品不存在',
        message: '未找到指定的艺术作品'
      });
    }
    
    // 更新字段
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (creationDate !== undefined) updateData.creationDate = new Date(creationDate);
    if (description !== undefined) updateData.description = description.trim();
    
    // 如果指定了新的封面图片
    if (coverImageUrl) {
      const coverImage = artwork.images.find(img => img.url === coverImageUrl);
      if (coverImage) {
        updateData.coverImage = {
          url: coverImage.url,
          width: coverImage.width,
          height: coverImage.height,
          thumbnailUrl: coverImage.thumbnailUrl
        };
      }
    }
    
    // 更新作品
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      message: '作品更新成功',
      artwork: updatedArtwork
    });
    
  } catch (error) {
    console.error('更新作品错误:', error);
    res.status(500).json({
      error: '更新作品失败',
      message: error.message || '服务器内部错误'
    });
  }
});

// 删除作品（需要认证）
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找作品
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({
        error: '作品不存在',
        message: '未找到指定的艺术作品'
      });
    }
    
    // 收集所有图片URL用于删除文件
    const imageUrls = [
      artwork.coverImage.url,
      ...artwork.images.map(img => img.url)
    ];
    
    // 删除作品
    await Artwork.findByIdAndDelete(id);
    
    // 删除图片文件
    await deleteImageFiles(imageUrls);
    
    res.json({
      message: '作品删除成功'
    });
    
  } catch (error) {
    console.error('删除作品错误:', error);
    res.status(500).json({
      error: '删除作品失败',
      message: '服务器内部错误'
    });
  }
});

// 删除指定图片（需要认证）
router.delete('/:id/images', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        error: '缺少参数',
        message: '请提供要删除的图片URL'
      });
    }
    
    // 查找作品
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({
        error: '作品不存在',
        message: '未找到指定的艺术作品'
      });
    }
    
    // 检查是否为封面图片
    if (artwork.coverImage.url === imageUrl) {
      return res.status(400).json({
        error: '无法删除封面图片',
        message: '请先选择其他图片作为封面，或删除整个作品'
      });
    }
    
    // 从图片数组中移除
    const imageIndex = artwork.images.findIndex(img => img.url === imageUrl);
    if (imageIndex === -1) {
      return res.status(404).json({
        error: '图片不存在',
        message: '未找到指定的图片'
      });
    }
    
    // 删除图片文件
    await deleteImageFiles([imageUrl]);
    
    // 从数组中移除图片
    artwork.images.splice(imageIndex, 1);
    
    // 如果删除后没有图片了，删除整个作品
    if (artwork.images.length === 0) {
      await Artwork.findByIdAndDelete(id);
      return res.json({
        message: '作品已删除（无剩余图片）'
      });
    }
    
    await artwork.save();
    
    res.json({
      message: '图片删除成功',
      artwork
    });
    
  } catch (error) {
    console.error('删除图片错误:', error);
    res.status(500).json({
      error: '删除图片失败',
      message: '服务器内部错误'
    });
  }
});

module.exports = router;
