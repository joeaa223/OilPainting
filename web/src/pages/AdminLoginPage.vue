<template>
  <div class="min-h-screen bg-nature-canvas flex items-center justify-center p-4">
    <!-- 左上角 Logo -->
    <router-link 
      to="/" 
      class="absolute top-6 left-6 hover:opacity-80 transition-opacity duration-200"
    >
      <img 
        src="/img/jeffry-art-logo.png" 
        alt="Jeffry Goh Art Logo" 
        class="h-12 md:h-16 w-auto object-contain"
      />
    </router-link>
    
    <div class="max-w-md w-full">
      <!-- 登录卡片 -->
      <div class="bg-white rounded-xl shadow-frame p-8">
        <!-- 标题 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-serif text-nature-forest mb-2">Admin Login</h1>
          <p class="text-nature-dark">Please enter your admin account information</p>
        </div>
        
        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 用户名 -->
          <div>
            <label for="username" class="block text-sm font-medium text-nature-forest mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input-field"
              placeholder="Enter username"
              :disabled="loading"
            />
          </div>
          
          <!-- 密码 -->
          <div>
            <label for="password" class="block text-sm font-medium text-nature-forest mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="Enter password"
              :disabled="loading"
            />
          </div>
          
          <!-- 错误提示 -->
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>
          
          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading || !form.username || !form.password"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="loading" class="flex items-center justify-center space-x-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Logging in...</span>
            </div>
            <span v-else>Login</span>
          </button>
        </form>
        
        <!-- 返回画廊 -->
        <div class="mt-6 text-center">
          <router-link
            to="/"
            class="text-nature-forest hover:text-nature-dark transition-colors duration-200"
          >
            Back to Gallery
          </router-link>
        </div>
        
        <!-- 默认账户提示 -->
        <div class="mt-6 p-4 bg-nature-warm rounded-lg">
          <div class="text-sm text-nature-dark">
            <p class="font-medium mb-2">Default Admin Account:</p>
            <p>Username: <code class="bg-white px-2 py-1 rounded">admin</code></p>
            <p>Password: <code class="bg-white px-2 py-1 rounded">admin123</code></p>
            <p class="text-xs mt-2 text-nature-sky">
              ⚠️ Please change the default password in production environment
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AdminLoginPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const form = ref({
      username: '',
      password: ''
    })
    
    // 从store获取状态
    const { loading, error } = authStore
    
    // 处理登录
    const handleLogin = async () => {
      try {
        const result = await authStore.login({
          username: form.value.username.trim(),
          password: form.value.password
        })
        
        if (result.success) {
          // 登录成功，跳转到目标页面或管理仪表盘
          const redirectPath = route.query.redirect || '/admin'
          router.push(redirectPath)
        }
      } catch (error) {
        console.error('登录失败:', error)
      }
    }
    
    // 组件挂载时检查是否已登录
    onMounted(() => {
      if (authStore.isAuthenticated) {
        const redirectPath = route.query.redirect || '/admin'
        router.push(redirectPath)
      }
    })
    
    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* 登录表单动画 */
.bg-white {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 输入框焦点效果 */
.input-field:focus {
  transform: translateY(-1px);
}

/* 按钮悬停效果 */
.btn-primary:not(:disabled):hover {
  transform: translateY(-1px);
}
</style>
