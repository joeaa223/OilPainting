const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// 确保上传目录存在
const ensureUploadDirs = async () => {
  const uploadDir = path.join(__dirname, '../../uploads');
  const originalsDir = path.join(uploadDir, 'originals');
  const thumbsDir = path.join(uploadDir, 'thumbs');
  
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(originalsDir, { recursive: true });
    await fs.mkdir(thumbsDir, { recursive: true });
  } catch (error) {
    console.error('创建上传目录失败:', error);
  }
};

// 配置multer存储
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDirs();
    cb(null, path.join(__dirname, '../../uploads/originals'));
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名：时间戳 + 随机字符串 + 原扩展名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}_${randomString}${ext}`;
    cb(null, filename);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 检查文件类型
  if (file.mimetype.startsWith('image/')) {
    // 只允许jpeg和png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('只支持JPEG和PNG格式的图片'), false);
    }
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

// 创建multer实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: parseInt(process.env.MAX_FILES) || 12 // 最多12张图片
  }
});

// 处理图片并生成缩略图
const processImages = async (files) => {
  if (!files || files.length === 0) {
    throw new Error('没有上传任何图片');
  }

  const processedImages = [];
  
  for (const file of files) {
    try {
      const imagePath = file.path;
      const imageInfo = await sharp(imagePath).metadata();
      
      // 生成缩略图
      const thumbnailFilename = `thumb_${path.basename(file.filename)}`;
      const thumbnailPath = path.join(__dirname, '../../uploads/thumbs', thumbnailFilename);
      
      await sharp(imagePath)
        .resize(parseInt(process.env.THUMBNAIL_WIDTH) || 640, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85 })
        .toFile(thumbnailPath);
      
      // 获取缩略图尺寸
      const thumbnailInfo = await sharp(thumbnailPath).metadata();
      
      processedImages.push({
        url: `/uploads/originals/${file.filename}`,
        width: imageInfo.width,
        height: imageInfo.height,
        thumbnailUrl: `/uploads/thumbs/${thumbnailFilename}`,
        caption: ''
      });
      
    } catch (error) {
      console.error('处理图片失败:', error);
      throw new Error(`处理图片 ${file.originalname} 失败: ${error.message}`);
    }
  }
  
  return processedImages;
};

// 删除图片文件
const deleteImageFiles = async (imageUrls) => {
  if (!Array.isArray(imageUrls)) {
    imageUrls = [imageUrls];
  }
  
  for (const imageUrl of imageUrls) {
    try {
      if (imageUrl) {
        // 删除原图
        const originalPath = path.join(__dirname, '../../uploads/originals', path.basename(imageUrl));
        await fs.unlink(originalPath).catch(() => {});
        
        // 删除缩略图
        const thumbnailPath = path.join(__dirname, '../../uploads/thumbs', `thumb_${path.basename(imageUrl)}`);
        await fs.unlink(thumbnailPath).catch(() => {});
      }
    } catch (error) {
      console.error('删除图片文件失败:', error);
    }
  }
};

module.exports = {
  upload,
  processImages,
  deleteImageFiles
};
