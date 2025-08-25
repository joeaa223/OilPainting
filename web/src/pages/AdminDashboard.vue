<template>
  <div class="min-h-screen bg-nature-canvas">
    <!-- 页面头部 -->
    <header class="bg-white shadow-frame border-b-2 border-nature-warm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <!-- 左上角 Logo -->
          <router-link 
            to="/" 
            class="flex-shrink-0 hover:opacity-80 transition-opacity duration-200 mr-6"
          >
            <img 
              src="/img/jeffry-art-logo.png" 
              alt="Jeffry Goh Art Logo" 
              class="h-12 md:h-16 w-auto object-contain"
            />
          </router-link>
          
          <div>
            <h1 class="text-3xl font-serif text-nature-forest">Admin Dashboard</h1>
            <p class="text-nature-dark mt-1">Welcome back, {{ user?.username }}</p>
          </div>
          
          <!-- 用户菜单 -->
          <div class="flex items-center space-x-4">
            <button
              @click="showChangePassword = true"
              class="btn-outline"
            >
              Change Password
            </button>
            <button
              @click="handleLogout"
              class="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-frame p-6 border-l-4 border-nature-forest">
          <div class="flex items-center">
            <div class="p-3 bg-nature-forest bg-opacity-10 rounded-lg">
              <svg class="w-8 h-8 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-nature-sky">Total Artworks</p>
              <p class="text-2xl font-bold text-nature-forest">{{ stats.totalArtworks }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-frame p-6 border-l-4 border-nature-sky">
          <div class="flex items-center">
            <div class="p-3 bg-nature-sky bg-opacity-10 rounded-lg">
              <svg class="w-8 h-8 text-nature-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-nature-sky">Total Images</p>
              <p class="text-2xl font-bold text-nature-forest">{{ stats.totalImages }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-frame p-6 border-l-4 border-nature-warm">
          <div class="flex items-center">
            <div class="p-3 bg-nature-warm bg-opacity-10 rounded-lg">
              <svg class="w-8 h-8 text-nature-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-nature-sky">This Month</p>
              <p class="text-2xl font-bold text-nature-forest">{{ stats.thisMonth }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-frame p-6">
          <h2 class="text-xl font-serif text-nature-forest mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <router-link
              to="/admin/artworks/new"
              class="flex items-center p-3 rounded-lg border-2 border-nature-warm hover:border-nature-forest hover:bg-nature-forest hover:text-white transition-all duration-200 group"
            >
              <svg class="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="font-medium">Upload New Artwork</span>
            </router-link>
            
            <router-link
              to="/admin/artworks/append"
              class="flex items-center p-3 rounded-lg border-2 border-nature-warm hover:border-nature-forest hover:bg-nature-forest hover:text-white transition-all duration-200 group"
            >
              <svg class="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="font-medium">Add New Images to Existing Collection</span>
            </router-link>
            
            <router-link
              to="/"
              class="flex items-center p-3 rounded-lg border-2 border-nature-warm hover:border-nature-forest hover:bg-nature-forest hover:text-white transition-all duration-200 group"
            >
              <svg class="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span class="font-medium">View Gallery</span>
            </router-link>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-frame p-6">
          <h2 class="text-xl font-serif text-nature-forest mb-4">Recent Activities</h2>
          <div class="space-y-3">
                         <div v-if="recentActivities.length === 0" class="text-nature-sky text-center py-4">
               No recent activities
             </div>
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center p-3 rounded-lg bg-nature-warm bg-opacity-30"
            >
              <div class="w-2 h-2 bg-nature-forest rounded-full mr-3"></div>
              <span class="text-sm text-nature-dark">{{ activity.message }}</span>
              <span class="ml-auto text-xs text-nature-sky">{{ formatTime(activity.time) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 作品管理 -->
      <div class="bg-white rounded-xl shadow-frame p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
                     <h2 class="text-xl font-serif text-nature-forest">Artwork Management</h2>
          <router-link to="/admin/artworks/new" class="btn-primary">
                         <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
             </svg>
             Upload New Artwork
          </router-link>
        </div>
        
        <!-- 作品列表 -->
                 <div v-if="artworksLoading" class="text-center py-8">
           <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-forest mx-auto mb-4"></div>
           <p class="text-nature-dark">Loading artworks...</p>
         </div>
        
        <div v-else-if="artworksError" class="text-center py-8">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
            <p class="mb-3">{{ artworksError }}</p>
            <button @click="loadArtworks" class="btn-primary">Retry</button>
          </div>
        </div>
        
        <div v-else-if="artworks.length === 0" class="text-center py-8">
          <div class="bg-nature-warm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
                     <h3 class="text-lg font-serif text-nature-forest mb-2">No Artworks</h3>
           <p class="text-nature-dark mb-4">No artworks in the gallery yet, please create one first</p>
           <router-link to="/admin/artworks/new" class="btn-primary">
             Create First Artwork
           </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="artwork in artworks"
            :key="artwork._id"
            class="flex items-center justify-between p-4 bg-nature-warm bg-opacity-20 rounded-lg border border-nature-warm"
          >
            <div class="flex items-center space-x-4">
              <!-- 作品缩略图 -->
              <div class="w-16 h-16 rounded-lg overflow-hidden bg-white">
                <img
                  :src="artwork.coverImage.thumbnailUrl"
                  :alt="artwork.title"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- 作品信息 -->
              <div>
                <h3 class="font-serif text-nature-forest font-medium">{{ artwork.title }}</h3>
                <p class="text-sm text-nature-sky">{{ formatTime(artwork.creationDate) }}</p>
                                 <p class="text-xs text-nature-dark">{{ artwork.images.length }} images</p>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex items-center space-x-2">
              <router-link
                :to="`/artwork/${artwork._id}`"
                class="btn-outline px-3 py-2 text-sm"
              >
                                 View
              </router-link>
              <router-link
                :to="`/admin/artworks/${artwork._id}/edit`"
                class="btn-secondary px-3 py-2 text-sm"
              >
                                 Edit
              </router-link>
                             <button
                 @click="openDeleteConfirm(artwork)"
                 class="btn-danger px-3 py-2 text-sm"
               >
                                   Delete
               </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统信息 -->
      <div class="bg-white rounded-xl shadow-frame p-6">
                 <h2 class="text-xl font-serif text-nature-forest mb-4">System Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex justify-between">
                         <span class="text-nature-dark">System Version:</span>
             <span class="text-nature-forest font-medium">v1.0.0</span>
          </div>
          <div class="flex justify-between">
                         <span class="text-nature-dark">Database Status:</span>
             <span class="text-green-600 font-medium">Normal</span>
          </div>
          <div class="flex justify-between">
                         <span class="text-nature-dark">Upload Directory:</span>
             <span class="text-nature-forest font-medium">/uploads</span>
          </div>
          <div class="flex justify-between">
                         <span class="text-nature-dark">Last Update:</span>
            <span class="text-nature-forest font-medium">{{ formatTime(new Date()) }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 修改密码弹窗 -->
    <div v-if="showChangePassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-frame p-6 max-w-md w-full">
                 <h3 class="text-xl font-serif text-nature-forest mb-4">Change Password</h3>
        
        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div>
                         <label for="currentPassword" class="block text-sm font-medium text-nature-forest mb-2">
               Current Password
             </label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              class="input-field"
                             placeholder="Enter current password"
            />
          </div>
          
          <div>
                         <label for="newPassword" class="block text-sm font-medium text-nature-forest mb-2">
               New Password
             </label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              class="input-field"
                             placeholder="Enter new password"
              minlength="6"
            />
          </div>
          
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showChangePassword = false"
              class="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!passwordForm.currentPassword || !passwordForm.newPassword"
              class="btn-primary flex-1 disabled:opacity-50"
            >
              Confirm Change
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 删除作品确认弹窗 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-frame p-6 max-w-md w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-serif text-nature-forest mb-2">Confirm Delete Artwork</h3>
          <p class="text-nature-dark mb-6">
            Are you sure you want to delete the artwork "{{ artworkToDelete?.title }}"? This action cannot be undone, all images will be permanently deleted.
          </p>
          <div class="flex space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteArtwork"
              :disabled="deleting"
              class="btn-danger flex-1 disabled:opacity-50"
            >
              <div v-if="deleting" class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </div>
                              <span v-else>Confirm Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useGalleryStore } from '../stores/gallery'
import { deleteArtwork } from '../utils/api'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const galleryStore = useGalleryStore()
    
    const showChangePassword = ref(false)
    const passwordForm = ref({
      currentPassword: '',
      newPassword: ''
    })
    
    // 删除相关状态
    const showDeleteConfirm = ref(false)
    const artworkToDelete = ref(null)
    const deleting = ref(false)
    
    // 作品列表状态
    const artworks = ref([])
    const artworksLoading = ref(false)
    const artworksError = ref('')
    
    // 统计数据
    const stats = ref({
      totalArtworks: 0,
      totalImages: 0,
      thisMonth: 0
    })
    
    // 最近活动
    const recentActivities = ref([
      {
        id: 1,
        message: '系统启动完成',
        time: new Date()
      }
    ])
    
    // 从store获取用户信息
    const { user, changePassword } = authStore
    
    // 处理退出登录
    const handleLogout = () => {
      authStore.logout()
    }
    
    // 处理修改密码
    const handleChangePassword = async () => {
      try {
        const result = await changePassword({
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        })
        
        if (result.success) {
          alert('密码修改成功')
          showChangePassword.value = false
          passwordForm.value = { currentPassword: '', newPassword: '' }
        } else {
          alert(result.error || '密码修改失败')
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        alert('密码修改失败')
      }
    }
    
    // 格式化时间
    const formatTime = (time) => {
      if (typeof time === 'string') {
        time = new Date(time)
      }
      return time.toLocaleString('zh-CN')
    }
    
    // 加载作品列表
    const loadArtworks = async () => {
      try {
        artworksLoading.value = true
        artworksError.value = ''
        
        await galleryStore.fetchList({ limit: 1000 })
        artworks.value = galleryStore.items
        
      } catch (error) {
        console.error('加载作品列表失败:', error)
        artworksError.value = '加载作品列表失败'
      } finally {
        artworksLoading.value = false
      }
    }
    
    // 加载统计数据
    const loadStats = async () => {
      try {
        // 获取作品列表以计算统计
        await galleryStore.fetchList({ limit: 1000 })
        
        stats.value.totalArtworks = galleryStore.total
        stats.value.totalImages = galleryStore.items.reduce((sum, artwork) => sum + artwork.images.length, 0)
        
        // 计算本月新增（简化计算）
        const thisMonth = new Date().getMonth()
        stats.value.thisMonth = galleryStore.items.filter(artwork => {
          const artworkMonth = new Date(artwork.creationDate).getMonth()
          return artworkMonth === thisMonth
        }).length
        
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    }
    
    // 显示删除确认
    const openDeleteConfirm = (artwork) => {
      artworkToDelete.value = artwork
      showDeleteConfirm.value = true
    }
    
    // 处理删除作品
    const handleDeleteArtwork = async () => {
      if (!artworkToDelete.value) return
      
      try {
        deleting.value = true
        
        const result = await deleteArtwork(artworkToDelete.value._id)
        
        if (result.success) {
          // 删除成功，重新加载数据
          await loadArtworks()
          await loadStats()
          
          // 添加删除活动记录
          recentActivities.value.unshift({
            id: Date.now(),
            message: `删除了作品 "${artworkToDelete.value.title}"`,
            time: new Date()
          })
          
          // 关闭弹窗
          showDeleteConfirm.value = false
          artworkToDelete.value = null
        } else {
          alert(result.error || '删除作品失败')
        }
      } catch (error) {
        console.error('删除作品失败:', error)
        alert('删除作品失败，请稍后重试')
      } finally {
        deleting.value = false
      }
    }
    
    // 组件挂载时加载数据
    onMounted(() => {
      loadArtworks()
      loadStats()
    })
    
    return {
      user,
      showChangePassword,
      passwordForm,
      showDeleteConfirm,
      artworkToDelete,
      deleting,
      artworks,
      artworksLoading,
      artworksError,
      stats,
      recentActivities,
      handleLogout,
      handleChangePassword,
             loadArtworks,
       openDeleteConfirm,
       handleDeleteArtwork,
      formatTime
    }
  }
}
</script>

<style scoped>
/* 统计卡片悬停效果 */
.border-l-4 {
  transition: all 0.3s ease;
}

.border-l-4:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(36, 75, 60, 0.25);
}

/* 快速操作悬停效果 */
.group:hover svg {
  transform: scale(1.1);
}

/* 弹窗动画 */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
