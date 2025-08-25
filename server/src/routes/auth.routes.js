const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 管理员登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        error: '输入不完整',
        message: '请提供用户名和密码'
      });
    }

    // 查找用户
    const user = await User.findOne({ username: username.trim() });
    
    if (!user) {
      return res.status(401).json({
        error: '认证失败',
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: '认证失败',
        message: '用户名或密码错误'
      });
    }

    // 检查用户角色
    if (user.role !== 'admin') {
      return res.status(403).json({
        error: '权限不足',
        message: '此账户没有管理员权限'
      });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 返回用户信息和令牌
    res.json({
      message: '登录成功',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      error: '登录失败',
      message: '服务器内部错误，请稍后再试'
    });
  }
});

// 获取当前用户信息（需要认证）
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      error: '获取用户信息失败',
      message: '服务器内部错误'
    });
  }
});

// 修改密码（需要认证）
router.patch('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 验证输入
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: '输入不完整',
        message: '请提供当前密码和新密码'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: '密码太短',
        message: '新密码至少需要6个字符'
      });
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, req.user.passwordHash);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: '密码错误',
        message: '当前密码不正确'
      });
    }

    // 哈希新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // 更新密码
    await User.findByIdAndUpdate(req.user._id, {
      passwordHash: newPasswordHash
    });

    res.json({
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      error: '修改密码失败',
      message: '服务器内部错误'
    });
  }
});

// 登出（客户端删除token即可）
router.post('/logout', auth, (req, res) => {
  res.json({
    message: '登出成功'
  });
});

module.exports = router;
