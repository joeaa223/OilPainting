@echo off
echo ========================================
echo 风景油画艺术馆 - 启动脚本
echo ========================================
echo.

echo 正在检查环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo 警告: 未找到 MongoDB，请确保 MongoDB 服务已启动
    echo.
)

echo 检查环境变量文件...
if not exist ".env" (
    echo 正在创建环境变量文件...
    copy "env.example" ".env"
    echo 请编辑 .env 文件配置数据库连接等信息
    echo.
)

echo 启动后端服务...
cd server
start "后端服务" cmd /k "npm install && npm run dev"

echo 等待后端服务启动...
timeout /t 5 /nobreak >nul

echo 启动前端服务...
cd ..\web
start "前端服务" cmd /k "npm install && npm run dev"

echo.
echo ========================================
echo 服务启动完成！
echo ========================================
echo 后端服务: http://localhost:3000
echo 前端服务: http://localhost:5173
echo 管理入口: http://localhost:5173/admin/login
echo 默认账户: admin / admin123
echo.
echo 按任意键退出...
pause >nul
