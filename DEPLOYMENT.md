# �� Vercel 部署指南

## 📋 前置要求

1. **GitHub 账户** - 代码已上传到 GitHub
2. **Vercel 账户** - 注册 [Vercel](https://vercel.com)
3. **MongoDB Atlas 账户** - 创建云数据库

## 🔧 设置 MongoDB Atlas

### 1. 创建集群
- 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
- 选择免费层 (M0)
- 选择云提供商和地区
- 创建集群

### 2. 配置网络访问
- 进入 "Network Access"
- 添加 IP 地址：`0.0.0.0/0` (允许所有 IP)

### 3. 创建数据库用户
- 进入 "Database Access"
- 创建用户，设置用户名和密码
- 记住这些凭据

### 4. 获取连接字符串
- 点击 "Connect"
- 选择 "Connect your application"
- 复制连接字符串

## 🚀 部署到 Vercel

### 1. 连接 GitHub 仓库
- 登录 Vercel
- 点击 "New Project"
- 选择您的 GitHub 仓库

### 2. 配置项目
- **Framework Preset**: 选择 "Other"
- **Root Directory**: 留空（使用根目录）
- **Build Command**: `npm run build`
- **Output Directory**: `web/dist`

### 3. 设置环境变量
在 Vercel 项目设置中添加：

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oilpainting
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

**注意**: 将 `username`、`password`、`cluster` 替换为实际值

### 4. 部署
- 点击 "Deploy"
- 等待构建完成

## 🔍 验证部署

### 1. 检查 API 端点
- 访问 `https://your-domain.vercel.app/api/artworks`
- 应该返回作品列表或空数组

### 2. 检查前端
- 访问 `https://your-domain.vercel.app`
- 应该显示画廊页面

## ⚠️ 重要注意事项

### 图片上传
- 当前实现使用本地处理
- 生产环境建议使用云存储（AWS S3、Cloudinary）
- 修改 `api/admin/upload.js` 中的存储逻辑

### 数据库连接
- MongoDB Atlas 免费层有连接数限制
- 监控数据库使用情况
- 考虑升级到付费计划

### 安全性
- 定期更换 JWT_SECRET
- 限制 MongoDB 网络访问
- 使用强密码

## 🐛 常见问题

### 构建失败
- 检查 Node.js 版本（需要 18+）
- 验证所有依赖已安装
- 检查环境变量设置

### API 500 错误
- 检查 MongoDB 连接字符串
- 验证数据库用户权限
- 查看 Vercel 函数日志

### 图片上传失败
- 检查文件大小限制
- 验证文件类型
- 确认管理员权限

## 📞 获取帮助

- Vercel 文档: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas 文档: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- 项目 Issues: 在 GitHub 仓库中创建 Issue
