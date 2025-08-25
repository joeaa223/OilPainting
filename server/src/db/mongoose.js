const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
    
    // 创建默认管理员账户（如果不存在）
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

// 创建默认管理员账户
const createDefaultAdmin = async () => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    
    // 检查是否已存在管理员账户
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await User.create({
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'admin'
      });
      
      console.log('👤 默认管理员账户已创建: admin / admin123');
      console.log('⚠️  请在生产环境中修改默认密码！');
    }
  } catch (error) {
    console.error('创建默认管理员账户失败:', error.message);
  }
};

module.exports = connectDB;
