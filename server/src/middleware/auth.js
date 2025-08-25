const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: '访问被拒绝',
        message: '请提供有效的认证令牌' 
      });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: '访问被拒绝',
        message: '用户不存在或令牌无效' 
      });
    }

    // 检查用户角色
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        error: '权限不足',
        message: '需要管理员权限' 
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: '无效令牌',
        message: '请重新登录' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: '令牌已过期',
        message: '请重新登录' 
      });
    }
    
    console.error('认证中间件错误:', error);
    res.status(500).json({ 
      error: '认证失败',
      message: '服务器内部错误' 
    });
  }
};

module.exports = auth;
