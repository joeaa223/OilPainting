# 🚀 Vercel 部署修复指南

## 🔧 已修复的问题

### 1. **vercel.json 配置**
- ✅ 修复了构建配置
- ✅ 添加了 API 函数构建
- ✅ 修复了路由配置

### 2. **API 路由结构**
```
api/
├── test.js              # 测试 API
├── init.js              # 初始化管理员用户
├── artworks.js          # 作品列表 (GET, POST)
├── artworks/[id].js     # 单个作品 (GET, DELETE)
├── auth/
│   ├── login.js         # 管理员登录
│   └── me.js            # 获取当前用户信息
├── admin/
│   └── upload.js        # 图片上传
└── lib/
    ├── mongodb.js       # 数据库连接
    └── auth.js          # 认证中间件
```

### 3. **ES 模块支持**
- ✅ 所有 API 文件使用 ES 模块语法
- ✅ 修复了导入路径 (添加 .js 扩展名)
- ✅ 修复了认证中间件

## 🚀 重新部署步骤

### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push origin main
```

### 2. 在 Vercel 中重新部署
- 访问您的 Vercel 项目
- 点击 "Redeploy" 或等待自动部署

### 3. 设置环境变量 (如果还没有设置)
在 Vercel 项目设置中添加：
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oilpainting
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

## 🧪 测试部署

### 1. 测试 API 连接
访问：`https://your-domain.vercel.app/api/test`
应该返回：
```json
{
  "message": "API is working!",
  "method": "GET",
  "timestamp": "...",
  "env": "production"
}
```

### 2. 初始化管理员用户
POST 请求到：`https://your-domain.vercel.app/api/init`
应该创建默认管理员用户 (username: admin, password: admin123)

### 3. 测试前端
访问：`https://your-domain.vercel.app`
应该显示画廊页面

### 4. 测试管理员登录
访问：`https://your-domain.vercel.app/admin/login`
使用默认凭据登录

## 🐛 如果仍有问题

### 检查 Vercel 函数日志
1. 进入 Vercel 项目
2. 点击 "Functions" 标签
3. 查看函数执行日志

### 常见问题
- **500 错误**: 检查环境变量是否正确设置
- **404 错误**: 检查 API 路径是否正确
- **认证失败**: 确保 JWT_SECRET 已设置

## 📞 获取帮助
如果问题仍然存在，请检查：
1. Vercel 构建日志
2. 函数执行日志  
3. 浏览器开发者工具的网络请求
