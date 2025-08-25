const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db/mongoose');
const authRoutes = require('./routes/auth.routes');
const artworksRoutes = require('./routes/artworks.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// 连接数据库
connectDB();

// 安全中间件
app.use(helmet());

// 跨域配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// 速率限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制5次请求
  message: '登录尝试过于频繁，请稍后再试'
});

// 应用速率限制到认证路由
app.use('/api/auth', authLimiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务 - 图片上传目录
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworksRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后再试'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📁 图片上传目录: ${path.join(__dirname, '../uploads')}`);
  console.log(`🌐 前端地址: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

module.exports = app;
