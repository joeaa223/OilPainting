#!/bin/bash

echo "========================================"
echo "风景油画艺术馆 - 启动脚本"
echo "========================================"
echo

echo "正在检查环境..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "警告: 未找到 MongoDB，请确保 MongoDB 服务已启动"
    echo
fi

echo "检查环境变量文件..."
if [ ! -f ".env" ]; then
    echo "正在创建环境变量文件..."
    cp "env.example" ".env"
    echo "请编辑 .env 文件配置数据库连接等信息"
    echo
fi

echo "启动后端服务..."
cd server
npm install
npm run dev &
BACKEND_PID=$!

echo "等待后端服务启动..."
sleep 5

echo "启动前端服务..."
cd ../web
npm install
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "服务启动完成！"
echo "========================================"
echo "后端服务: http://localhost:3000"
echo "前端服务: http://localhost:5173"
echo "管理入口: http://localhost:5173/admin/login"
echo "默认账户: admin / admin123"
echo
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
