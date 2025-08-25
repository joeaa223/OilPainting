import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)
  const error = ref('')

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // 设置认证信息
  const setAuth = (authData) => {
    token.value = authData.token
    user.value = authData.user
    
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData.user))
    
    // 设置API默认headers
    api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`
  }

  // 清除认证信息
  const clearAuth = () => {
    token.value = ''
    user.value = null
    error.value = ''
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // 清除API默认headers
    delete api.defaults.headers.common['Authorization']
  }

  // 登录
  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.token) {
        setAuth(response.data)
        return { success: true, data: response.data }
      } else {
        throw new Error('Login response format error')
      }
      
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    const router = useRouter()
    
    clearAuth()
    router.push('/admin/login')
  }

  // 验证token有效性
  const validateToken = async () => {
    if (!token.value) return false
    
    try {
      const response = await api.get('/auth/me')
      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return true
      }
    } catch (err) {
      console.error('Token validation failed:', err)
      clearAuth()
      return false
    }
    
    return false
  }

  // 初始化时验证token
  const initAuth = async () => {
    if (token.value) {
      await validateToken()
    }
  }

  // 修改密码
  const changePassword = async (passwordData) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.patch('/auth/change-password', passwordData)
      
      return { success: true, data: response.data }
      
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to change password'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    token,
    user,
    loading,
    error,
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    
    // 方法
    setAuth,
    clearAuth,
    login,
    logout,
    validateToken,
    initAuth,
    changePassword
  }
})
