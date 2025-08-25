import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 处理401未授权错误
    if (error.response?.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // 如果不是在登录页，重定向到登录页
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    
    return Promise.reject(error)
  }
)

// 图片上传专用方法
export const uploadImages = async (images, artworkId = null) => {
  const formData = new FormData()
  
  // 添加图片文件
  images.forEach((image, index) => {
    formData.append('images', image)
  })
  
  // 根据是否有artworkId决定是新建还是追加
  const url = artworkId ? `/artworks/${artworkId}/images` : '/artworks'
  
  try {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Upload failed' 
    }
  }
}

// 创建新作品
export const createArtwork = async (artworkData, images) => {
  const formData = new FormData()
  
  // 添加作品信息
  formData.append('title', artworkData.title)
  formData.append('creationDate', artworkData.creationDate)
  formData.append('description', artworkData.description)
  
  // 添加尺寸信息
  formData.append('height', artworkData.height)
  formData.append('width', artworkData.width)
  if (artworkData.depth !== undefined) {
    formData.append('depth', artworkData.depth)
  }
  
  // 添加材质信息
  formData.append('material', artworkData.material)
  formData.append('withFrame', artworkData.withFrame)
  
  if (artworkData.coverIndex !== undefined) {
    formData.append('coverIndex', artworkData.coverIndex)
  }
  
  // 添加图片文件
  images.forEach((image, index) => {
    formData.append('images', image)
  })
  
  try {
    const response = await api.post('/artworks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to create artwork' 
    }
  }
}

// 更新作品信息
export const updateArtwork = async (artworkId, updateData) => {
  try {
    const response = await api.patch(`/artworks/${artworkId}`, updateData)
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to update artwork' 
    }
  }
}

// 删除作品
export const deleteArtwork = async (artworkId) => {
  try {
    const response = await api.delete(`/artworks/${artworkId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to delete artwork' 
    }
  }
}

// 删除图片
export const deleteImage = async (artworkId, imageUrl) => {
  try {
    const response = await api.delete(`/artworks/${artworkId}/images`, {
      data: { imageUrl }
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to delete image' 
    }
  }
}

export default api
