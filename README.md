# 风景油画展示与管理网站

一套专为个人风景油画画家设计的作品展示与管理网站，支持本地或小型服务器私有部署。

## 技术栈

- **前端**: Vue 3 + Vite + Vue Router + Pinia + Tailwind CSS
- **后端**: Node.js + Express + MongoDB + Mongoose
- **图片处理**: Multer + Sharp
- **认证**: JWT
- **语言**: JavaScript (无TypeScript)

## 快速启动

### 1. 环境准备
- 确保已安装 Node.js (>= 16) 和 MongoDB
- 启动 MongoDB 服务

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填写以下配置：
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/oilpainting
# JWT_SECRET=your-secret-key
# UPLOAD_DIR=server/uploads
```

### 3. 安装依赖并启动服务
```bash
# 安装后端依赖
cd server
npm install

# 启动后端服务 (开发模式)
npm run dev

# 新开终端，安装前端依赖
cd ../web
npm install

# 启动前端开发服务器
npm run dev
```

### 4. 访问应用
- 前端: http://localhost:5173
- 后端API: http://localhost:3000

## 功能特性

### 访客端
- 画廊首页：翻页式分页展示作品
- 作品详情页：多图预览、灯箱放大
- 响应式设计：桌面3列/平板2列/手机1列

### 管理端
- 管理员登录认证
- 作品管理：新建、编辑、删除
- 图片管理：上传、追加、删除
- 支持两种上传模式：新建作品或向已有作品追加图片

## 项目结构

```
oilpainting/
├── server/          # 后端服务
├── web/            # 前端应用
├── .env.example    # 环境变量模板
└── README.md       # 项目说明
```

## 开发脚本

### 后端 (server/)
- `npm run dev`: 开发模式 (nodemon)
- `npm start`: 生产模式

### 前端 (web/)
- `npm run dev`: 开发服务器
- `npm run build`: 生产构建
- `npm run preview`: 预览生产构建

## 部署说明

1. 生产环境建议使用 PM2 管理 Node.js 进程
2. 前端构建后的 `dist` 目录可由后端静态托管
3. 图片上传目录建议配置定期备份
4. 生产环境请修改默认的 JWT_SECRET

## 注意事项

- 图片上传限制：单张 ≤ 10MB，格式仅限 jpg/jpeg/png
- 首次上传作品必须包含：标题、创作时间、简介、至少1张图片
- 删除作品或图片时会同步清理磁盘文件
- 所有管理操作需要管理员登录认证
