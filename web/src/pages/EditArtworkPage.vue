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
              src="/img/Jeffry Art Logo.png" 
              alt="Jeffry Goh Art Logo" 
              class="h-12 md:h-16 w-auto object-contain"
            />
          </router-link>
          
          <div>
            <h1 class="text-3xl font-serif text-nature-forest">Edit Artwork</h1>
            <p class="text-nature-dark mt-1">{{ artwork?.title || 'Loading...' }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link to="/admin" class="btn-outline">
              Back to Dashboard
            </router-link>
            <router-link to="/" class="btn-secondary">
              View Gallery
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-forest mx-auto mb-4"></div>
                 <p class="text-nature-dark">Loading artwork information...</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div v-else-if="artwork" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 模式选择 -->
      <div class="bg-white rounded-xl shadow-frame p-6 mb-8">
                 <h2 class="text-xl font-serif text-nature-forest mb-4">Operation Mode</h2>
        <div class="flex space-x-4">
          <button
            @click="mode = 'edit'"
            class="flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200"
            :class="mode === 'edit' 
              ? 'border-nature-forest bg-nature-forest text-white' 
              : 'border-nature-warm text-nature-dark hover:border-nature-forest'"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Edit Artwork Info</span>
            </div>
          </button>
          
          <button
            @click="mode = 'append'"
            class="flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200"
            :class="mode === 'append' 
              ? 'border-nature-forest bg-nature-forest text-white' 
              : 'border-nature-warm text-nature-dark hover:border-nature-forest'"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Append Images</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 编辑作品信息模式 -->
      <div v-if="mode === 'edit'" class="bg-white rounded-xl shadow-frame p-8 mb-8">
        <h2 class="text-2xl font-serif text-nature-forest border-b border-nature-warm pb-2 mb-6">
          Edit Artwork Information
        </h2>
        
        <form @submit.prevent="handleUpdateInfo" class="space-y-6">
          <!-- 作品标题 -->
          <div>
            <label for="title" class="block text-sm font-medium text-nature-forest mb-2">
              Artwork Title <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="editForm.title"
              type="text"
              required
              maxlength="100"
              class="input-field"
              placeholder="Enter artwork title"
              :disabled="submitting"
            />
            <p class="text-xs text-nature-sky mt-1">
              {{ editForm.title.length }}/100 characters
            </p>
          </div>
          
          <!-- 创作时间 -->
          <div>
            <label for="creationDate" class="block text-sm font-medium text-nature-forest mb-2">
              Creation Date <span class="text-red-500">*</span>
            </label>
            <input
              id="creationDate"
              v-model="editForm.creationDate"
              type="date"
              required
              class="input-field"
              :disabled="submitting"
            />
          </div>
          
          <!-- 作品简介 -->
          <div>
            <label for="description" class="block text-sm font-medium text-nature-forest mb-2">
              作品简介 <span class="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              v-model="editForm.description"
              required
              maxlength="1000"
              rows="6"
              class="input-field resize-none"
              placeholder="请详细描述作品的创作背景、技法特点、艺术价值等..."
              :disabled="submitting"
            ></textarea>
            <p class="text-xs text-nature-sky mt-1">
              {{ editForm.description.length }}/1000 字符
            </p>
          </div>
          
          <!-- 封面图片选择 -->
          <div>
            <label class="block text-sm font-medium text-nature-forest mb-2">
              封面图片
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in artwork.images"
                :key="index"
                @click="selectCoverImage(image)"
                class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200"
                :class="editForm.coverImageUrl === image.url 
                  ? 'border-nature-forest ring-2 ring-nature-forest' 
                  : 'border-nature-warm hover:border-nature-sky'"
              >
                <img
                  :src="image.thumbnailUrl"
                  :alt="`图片 ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                
                <!-- 封面标识 -->
                <div
                  v-if="editForm.coverImageUrl === image.url"
                  class="absolute top-2 left-2 w-6 h-6 bg-nature-forest text-white rounded-full flex items-center justify-center text-xs font-bold"
                >
                  封
                </div>
              </div>
            </div>
            <p class="text-xs text-nature-sky mt-2">点击图片选择封面</p>
          </div>
          
          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-nature-warm">
            <button
              type="button"
              @click="resetEditForm"
              class="btn-outline"
              :disabled="submitting"
            >
              重置
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="btn-primary"
            >
              <div v-if="submitting" class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>更新中...</span>
              </div>
              <span v-else>更新作品信息</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 追加图片模式 -->
      <div v-if="mode === 'append'" class="bg-white rounded-xl shadow-frame p-8 mb-8">
        <h2 class="text-2xl font-serif text-nature-forest border-b border-nature-warm pb-2 mb-6">
          向作品追加图片
        </h2>
        
        <div class="space-y-6">
          <!-- 当前图片展示 -->
          <div>
            <h3 class="text-lg font-medium text-nature-forest mb-4">当前图片 ({{ artwork.images.length }} 张)</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in artwork.images"
                :key="index"
                class="relative aspect-square rounded-lg overflow-hidden bg-nature-warm border-2 border-nature-warm"
              >
                <img
                  :src="image.thumbnailUrl"
                  :alt="`图片 ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                
                <!-- 封面标识 -->
                <div
                  v-if="artwork.coverImage.url === image.url"
                  class="absolute top-2 left-2 w-6 h-6 bg-nature-forest text-white rounded-full flex items-center justify-center text-xs font-bold"
                >
                  封
                </div>
                
                <!-- 删除按钮 -->
                <button
                  @click="deleteImage(image)"
                  class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 图片上传 -->
          <div>
            <h3 class="text-lg font-medium text-nature-forest mb-4">上传新图片</h3>
            <ImageUploader
              ref="imageUploader"
              :max-files="12"
              :max-file-size="10 * 1024 * 1024"
              :accepted-types="['image/jpeg', 'image/png']"
              @files-change="handleFilesChange"
            />
          </div>
          
          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-nature-warm">
            <button
              @click="handleAppendImages"
              :disabled="submitting || selectedFiles.length === 0"
              class="btn-primary disabled:opacity-50"
            >
              <div v-if="submitting" class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>上传中...</span>
              </div>
              <span v-else>追加图片</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 删除作品 -->
      <div class="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 class="text-xl font-serif text-red-700 mb-4">危险操作</h2>
        <p class="text-red-600 mb-4">
          删除作品将永久移除所有相关图片和数据，此操作不可恢复。
        </p>
        <button
          @click="confirmDelete"
          class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          删除作品
        </button>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-frame p-8 max-w-md w-full text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-serif text-nature-forest mb-2">操作成功！</h3>
        <p class="text-nature-dark mb-6">{{ successMessage }}</p>
        <div class="flex space-x-3">
          <button
            @click="showSuccess = false"
            class="btn-primary flex-1"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { updateArtwork, deleteArtwork, deleteImage, uploadImages } from '../utils/api'
import ImageUploader from '../components/ImageUploader.vue'

export default {
  name: 'EditArtworkPage',
  components: {
    ImageUploader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const imageUploader = ref(null)
    
    const artwork = ref(null)
    const loading = ref(false)
    const mode = ref('edit') // 'edit' 或 'append'
    const submitting = ref(false)
    const showSuccess = ref(false)
    const successMessage = ref('')
    
    // 编辑表单
    const editForm = ref({
      title: '',
      creationDate: '',
      description: '',
      coverImageUrl: ''
    })
    
    // 选择的文件
    const selectedFiles = ref([])
    
    // 加载作品信息
    const loadArtwork = async () => {
      try {
        loading.value = true
        const response = await fetch(`/api/artworks/${route.params.id}`)
        const data = await response.json()
        
        if (response.ok) {
          artwork.value = data.artwork
          // 初始化编辑表单
          editForm.value = {
            title: data.artwork.title,
            creationDate: data.artwork.creationDate.split('T')[0],
            description: data.artwork.description,
            coverImageUrl: data.artwork.coverImage.url
          }
        } else {
          alert('加载作品信息失败')
          router.push('/admin')
        }
      } catch (error) {
        console.error('加载作品信息失败:', error)
        alert('加载作品信息失败')
        router.push('/admin')
      } finally {
        loading.value = false
      }
    }
    
    // 处理更新作品信息
    const handleUpdateInfo = async () => {
      try {
        submitting.value = true
        
        const result = await updateArtwork(route.params.id, {
          title: editForm.value.title.trim(),
          creationDate: editForm.value.creationDate,
          description: editForm.value.description.trim(),
          coverImageUrl: editForm.value.coverImageUrl
        })
        
        if (result.success) {
          successMessage.value = '作品信息更新成功！'
          showSuccess.value = true
          // 重新加载作品信息
          await loadArtwork()
        } else {
          alert(result.error || '更新作品信息失败')
        }
      } catch (error) {
        console.error('更新作品信息失败:', error)
        alert('更新作品信息失败')
      } finally {
        submitting.value = false
      }
    }
    
    // 处理追加图片
    const handleAppendImages = async () => {
      if (selectedFiles.value.length === 0) return
      
      try {
        submitting.value = true
        
        const result = await uploadImages(selectedFiles.value, route.params.id)
        
        if (result.success) {
          successMessage.value = '图片追加成功！'
          showSuccess.value = true
          // 重新加载作品信息
          await loadArtwork()
          // 清空选择的文件
          selectedFiles.value = []
          if (imageUploader.value) {
            imageUploader.value.clearAll()
          }
        } else {
          alert(result.error || '追加图片失败')
        }
      } catch (error) {
        console.error('追加图片失败:', error)
        alert('追加图片失败')
      } finally {
        submitting.value = false
      }
    }
    
    // 删除图片
    const deleteImage = async (image) => {
      if (!confirm(`确定要删除这张图片吗？\n${image.url}`)) return
      
      try {
        const result = await deleteImage(route.params.id, image.url)
        
        if (result.success) {
          successMessage.value = '图片删除成功！'
          showSuccess.value = true
          // 重新加载作品信息
          await loadArtwork()
        } else {
          alert(result.error || '删除图片失败')
        }
      } catch (error) {
        console.error('删除图片失败:', error)
        alert('删除图片失败')
      }
    }
    
    // 确认删除作品
    const confirmDelete = async () => {
      if (!confirm('确定要删除这个作品吗？此操作不可恢复！')) return
      
      try {
        const result = await deleteArtwork(route.params.id)
        
        if (result.success) {
          alert('作品删除成功！')
          router.push('/admin')
        } else {
          alert(result.error || '删除作品失败')
        }
      } catch (error) {
        console.error('删除作品失败:', error)
        alert('删除作品失败')
      }
    }
    
    // 选择封面图片
    const selectCoverImage = (image) => {
      editForm.value.coverImageUrl = image.url
    }
    
    // 重置编辑表单
    const resetEditForm = () => {
      if (artwork.value) {
        editForm.value = {
          title: artwork.value.title,
          creationDate: artwork.value.creationDate.split('T')[0],
          description: artwork.value.description,
          coverImageUrl: artwork.value.coverImage.url
        }
      }
    }
    
    // 处理文件变化
    const handleFilesChange = (files) => {
      selectedFiles.value = files
    }
    
    // 组件挂载时加载数据
    onMounted(() => {
      loadArtwork()
    })
    
    // 组件卸载时清理
    onUnmounted(() => {
      if (imageUploader.value) {
        imageUploader.value.cleanup()
      }
    })
    
    return {
      artwork,
      loading,
      mode,
      submitting,
      showSuccess,
      successMessage,
      editForm,
      selectedFiles,
      imageUploader,
      handleUpdateInfo,
      handleAppendImages,
      deleteImage,
      confirmDelete,
      selectCoverImage,
      resetEditForm,
      handleFilesChange
    }
  }
}
</script>

<style scoped>
/* 模式选择按钮悬停效果 */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* 图片选择悬停效果 */
.aspect-square:hover {
  transform: scale(1.05);
}

/* 成功提示动画 */
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
