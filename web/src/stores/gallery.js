import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useGalleryStore = defineStore('gallery', () => {
  // 状态
  const items = ref([])
  const loading = ref(false)
  const error = ref('')
  
  // 分页状态
  const page = ref(1)
  const limit = ref(9)
  const total = ref(0)
  const totalPages = ref(0)
  
  // 搜索状态
  const searchQuery = ref('')
  
  // 计算属性
  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)
  const isEmpty = computed(() => {
    // 如果正在加载，认为是空的
    if (loading.value) return true
    // 如果items为空数组，认为是空的
    if (!items.value || items.value.length === 0) return true
    // 否则不是空的
    return false
  })
  const isFirstPage = computed(() => page.value === 1)
  const isLastPage = computed(() => page.value === totalPages.value)

  // 获取作品列表
  const fetchList = async (params = {}) => {
    try {
      loading.value = true
      error.value = ''
      
      // 构建查询参数
      const queryParams = {
        page: params.page || page.value,
        limit: params.limit || limit.value,
        q: params.q !== undefined ? params.q : searchQuery.value
      }
      
      const response = await api.get('/artworks', { params: queryParams })
      
      // 更新状态
      items.value = response.data.items
      page.value = response.data.page
      limit.value = response.data.limit
      total.value = response.data.total
      totalPages.value = response.data.totalPages
      
      return { success: true, data: response.data }
      
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch artwork list'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 设置页码
  const setPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
      return true
    }
    return false
  }

  // 下一页
  const nextPage = () => {
    if (hasNext.value) {
      page.value++
      return true
    }
    return false
  }

  // 上一页
  const prevPage = () => {
    if (hasPrev.value) {
      page.value--
      return true
    }
    return false
  }

  // 跳转到指定页
  const goToPage = (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages.value) {
      page.value = targetPage
      return true
    }
    return false
  }

  // 设置搜索查询
  const setSearchQuery = (query) => {
    searchQuery.value = query
    page.value = 1 // 重置到第一页
  }

  // 搜索作品
  const search = async (query) => {
    setSearchQuery(query)
    return await fetchList({ page: 1, q: query })
  }

  // 重置搜索
  const resetSearch = () => {
    searchQuery.value = ''
    page.value = 1
  }

  // 获取单个作品详情
  const fetchArtwork = async (id) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.get(`/artworks/${id}`)
      
      return { success: true, data: response.data }
      
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch artwork details'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = ''
  }

  // 重置状态
  const reset = () => {
    items.value = []
    loading.value = false
    error.value = ''
    page.value = 1
    limit.value = 9
    total.value = 0
    totalPages.value = 0
    searchQuery.value = ''
  }

  return {
    // 状态
    items,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    searchQuery,
    
    // 计算属性
    hasNext,
    hasPrev,
    isEmpty,
    isFirstPage,
    isLastPage,
    
    // 方法
    fetchList,
    setPage,
    nextPage,
    prevPage,
    goToPage,
    setSearchQuery,
    search,
    resetSearch,
    fetchArtwork,
    clearError,
    reset
  }
})
