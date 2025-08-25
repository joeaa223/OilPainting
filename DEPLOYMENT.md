# 风景油画艺术馆 - 部署说明

## 系统要求

- **Node.js**: 版本 16.0.0 或更高
- **MongoDB**: 版本 4.4 或更高
- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+

## 快速启动

### Windows 用户

1. 双击运行 `start.bat` 文件
2. 脚本会自动安装依赖并启动服务
3. 等待服务启动完成

### Linux/Mac 用户

1. 给启动脚本添加执行权限：
   ```bash
   chmod +x start.sh
   ```

2. 运行启动脚本：
   ```bash
   ./start.sh
   ```

## 手动启动步骤

### 1. 环境准备

确保已安装并启动 MongoDB 服务：

```bash
# Windows (以管理员身份运行)
net start MongoDB

# macOS (使用 Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
```

### 2. 配置环境变量

复制环境变量模板并编辑：

```bash
# Windows
copy env.example .env

# Linux/Mac
cp env.example .env
```

编辑 `.env` 文件，配置以下参数：

```env
# 服务器端口
PORT=3000

# MongoDB 连接字符串
MONGODB_URI=mongodb://localhost:27017/oilpainting

# JWT 密钥 (生产环境请使用强随机密钥)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 上传目录
UPLOAD_DIR=server/uploads

# 前端开发端口
CORS_ORIGIN=http://localhost:5173
```

### 3. 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../web
npm install
```

### 4. 启动服务

#### 启动后端服务

```bash
cd server
npm run dev
```

后端服务将在 http://localhost:3000 启动

#### 启动前端服务

```bash
cd web
npm run dev
```

前端服务将在 http://localhost:5173 启动

## 访问应用

- **前端画廊**: http://localhost:5173
- **管理入口**: http://localhost:5173/admin/login
- **后端API**: http://localhost:3000/api

## 默认账户

- **用户名**: admin
- **密码**: admin123

⚠️ **重要**: 生产环境请务必修改默认密码！

## 功能特性

### 访客端
- 画廊首页：翻页式分页展示作品
- 作品详情页：多图预览、灯箱放大
- 响应式设计：桌面3列/平板2列/手机1列
- 搜索功能：按作品标题模糊搜索

### 管理端
- 管理员登录认证
- 作品管理：新建、编辑、删除
- 图片管理：上传、追加、删除
- 支持两种上传模式：新建作品或向已有作品追加图片

## 文件结构

```
oilpainting/
├── server/                 # 后端服务
│   ├── src/               # 源代码
│   │   ├── index.js       # 主入口
│   │   ├── config/        # 配置
│   │   ├── db/           # 数据库
│   │   ├── models/       # 数据模型
│   │   ├── middleware/   # 中间件
│   │   ├── routes/       # 路由
│   │   └── utils/        # 工具
│   ├── uploads/          # 图片上传目录
│   └── package.json      # 后端依赖
├── web/                  # 前端应用
│   ├── src/              # 源代码
│   │   ├── main.js       # 主入口
│   │   ├── App.vue       # 主组件
│   │   ├── router.js     # 路由配置
│   │   ├── stores/       # 状态管理
│   │   ├── pages/        # 页面组件
│   │   └── components/   # 通用组件
│   └── package.json      # 前端依赖
├── .env.example          # 环境变量模板
├── start.bat            # Windows 启动脚本
├── start.sh             # Linux/Mac 启动脚本
└── README.md            # 项目说明
```

## 生产部署

### 1. 构建前端

```bash
cd web
npm run build
```

构建后的文件在 `web/dist` 目录

### 2. 配置生产环境

修改 `.env` 文件：

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-production-secret-key
```

### 3. 启动生产服务

```bash
cd server
npm start
```

### 4. 反向代理配置 (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/oilpainting/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 图片文件
    location /uploads {
        proxy_pass http://localhost:3000;
    }
}
```

## 常见问题

### 1. MongoDB 连接失败

- 检查 MongoDB 服务是否启动
- 确认连接字符串格式正确
- 检查防火墙设置

### 2. 图片上传失败

- 确认 `server/uploads` 目录存在且有写权限
- 检查图片格式和大小限制
- 查看服务器错误日志

### 3. 前端无法访问后端

- 确认后端服务已启动
- 检查 CORS 配置
- 确认端口号配置正确

### 4. 权限问题

- Windows: 以管理员身份运行
- Linux/Mac: 检查目录权限

## 技术支持

如遇到问题，请检查：

1. 控制台错误信息
2. 网络请求状态
3. 服务器日志
4. 环境变量配置

## 更新日志

### v1.0.0
- 初始版本发布
- 完整的作品展示和管理功能
- 响应式设计支持
- 图片上传和处理
- 管理员认证系统
