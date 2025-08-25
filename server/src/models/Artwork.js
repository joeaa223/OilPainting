const mongoose = require('mongoose');

// 图片子文档模式
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, '图片URL是必需的']
  },
  width: {
    type: Number,
    required: [true, '图片宽度是必需的']
  },
  height: {
    type: Number,
    required: [true, '图片高度是必需的']
  },
  thumbnailUrl: {
    type: String,
    required: [true, '缩略图URL是必需的']
  },
  caption: {
    type: String,
    default: ''
  }
}, { _id: false });

// 封面图片模式
const coverImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, '封面图片URL是必需的']
  },
  width: {
    type: Number,
    required: [true, '封面图片宽度是必需的']
  },
  height: {
    type: Number,
    required: [true, '封面图片高度是必需的']
  },
  thumbnailUrl: {
    type: String,
    required: [true, '封面缩略图URL是必需的']
  }
}, { _id: false });

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '作品标题是必需的'],
    trim: true,
    maxlength: [100, '标题最多100个字符']
  },
  creationDate: {
    type: Date,
    required: [true, '创作时间是必需的']
  },
  description: {
    type: String,
    required: [true, '作品简介是必需的'],
    trim: true,
    maxlength: [1000, '简介最多1000个字符']
  },
  // 尺寸信息
  height: {
    type: Number,
    required: [true, '作品高度是必需的'],
    min: [0, '高度不能为负数']
  },
  width: {
    type: Number,
    required: [true, '作品宽度是必需的'],
    min: [0, '宽度不能为负数']
  },
  depth: {
    type: Number,
    min: [0, '厚度不能为负数'],
    default: undefined
  },
  // 材质信息
  material: {
    type: String,
    required: [true, '画布材质是必需的'],
    trim: true,
    enum: {
      values: ['Oil on canvas', 'Oil on linen', 'Oil on cotton', 'Oil on board', 'Acrylic on canvas', 'Mixed media'],
      message: '请选择有效的画布材质'
    }
  },
  withFrame: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: coverImageSchema,
    required: [true, '封面图片是必需的']
  },
  images: {
    type: [imageSchema],
    required: [true, '至少需要一张图片'],
    validate: {
      validator: function(images) {
        return images && images.length > 0;
      },
      message: '作品必须包含至少一张图片'
    }
  }
}, {
  timestamps: true
});

// 创建索引
artworkSchema.index({ title: 'text' }); // 文本搜索索引
artworkSchema.index({ updatedAt: -1 }); // 更新时间降序索引
artworkSchema.index({ creationDate: -1 }); // 创作时间降序索引

// 虚拟字段 - 创作年份
artworkSchema.virtual('creationYear').get(function() {
  return this.creationDate.getFullYear();
});

// 虚拟字段 - 创作月份
artworkSchema.virtual('creationMonth').get(function() {
  return this.creationDate.getMonth() + 1;
});

// 确保虚拟字段在JSON序列化时包含
artworkSchema.set('toJSON', { virtuals: true });
artworkSchema.set('toObject', { virtuals: true });

// 保存前验证封面图片
artworkSchema.pre('save', function(next) {
  // 如果没有指定封面图片，使用第一张图片作为封面
  if (!this.coverImage && this.images && this.images.length > 0) {
    this.coverImage = {
      url: this.images[0].url,
      width: this.images[0].width,
      height: this.images[0].height,
      thumbnailUrl: this.images[0].thumbnailUrl
    };
  }
  next();
});

module.exports = mongoose.model('Artwork', artworkSchema);
