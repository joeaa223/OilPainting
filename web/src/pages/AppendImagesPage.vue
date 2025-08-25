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
            <h1 class="text-3xl font-serif text-nature-forest">Add New Images to Existing Collection</h1>
            <p class="text-nature-dark mt-1">Select existing artwork and add new images</p>
          </div>
          
          <!-- 返回按钮 -->
          <div class="flex items-center space-x-4">
            <router-link
              to="/admin"
              class="btn-outline"
            >
              Back to Dashboard
            </router-link>
            <router-link
              to="/"
              class="btn-secondary"
            >
              View Gallery
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 选择作品 -->
      <div class="bg-white rounded-xl shadow-frame p-6 mb-8">
                 <h2 class="text-xl font-serif text-nature-forest mb-4">Select Artwork to Add Images</h2>
        
        <!-- 搜索框 -->
        <div class="mb-6">
          <div class="relative max-w-md">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search artwork titles..."
              class="input-field pr-12"
            />
            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <!-- 作品列表 -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-forest mx-auto mb-4"></div>
          <p class="text-nature-dark">Loading artworks...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
            <p class="mb-3">{{ error }}</p>
            <button @click="loadArtworks" class="btn-primary">Retry</button>
          </div>
        </div>
        
        <div v-else-if="filteredArtworks.length === 0" class="text-center py-12">
          <div class="bg-nature-warm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-serif text-nature-forest mb-2">No Artworks</h3>
          <p class="text-nature-dark mb-6">
            {{ searchQuery ? 'No matching artworks found' : 'No artworks in gallery yet, please create one first' }}
          </p>
          <router-link v-if="!searchQuery" to="/admin/artworks/new" class="btn-primary">
            Create First Artwork
          </router-link>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="artwork in filteredArtworks"
            :key="artwork._id"
            class="artwork-card bg-white rounded-xl shadow-frame border-2 border-nature-warm hover:border-nature-forest hover:shadow-frame-hover transition-all duration-300 cursor-pointer"
            @click="selectArtwork(artwork)"
          >
            <!-- 作品图片 -->
            <div class="relative aspect-[4/3] overflow-hidden rounded-t-xl">
              <img
                :src="artwork.coverImage.thumbnailUrl"
                :alt="artwork.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full">
                {{ artwork.images.length }} images
              </div>
            </div>
            
            <!-- 作品信息 -->
            <div class="p-4">
              <h3 class="text-lg font-serif text-nature-forest mb-2 line-clamp-2">{{ artwork.title }}</h3>
              <p class="text-sm text-nature-dark line-clamp-2">{{ artwork.description }}</p>
              <div class="mt-3 text-xs text-nature-sky">
                创建时间：{{ formatDate(artwork.creationDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 选中的作品信息 -->
      <div v-if="selectedArtwork" class="bg-white rounded-xl shadow-frame p-6 mb-8">
        <h2 class="text-xl font-serif text-nature-forest mb-4">选中的作品：{{ selectedArtwork.title }}</h2>
        
        <!-- 当前图片预览 -->
        <div class="mb-6">
          <h3 class="text-lg font-serif text-nature-forest mb-3">当前图片 ({{ selectedArtwork.images.length }} 张)</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div
              v-for="(image, index) in selectedArtwork.images"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden border-2"
              :class="image.url === selectedArtwork.coverImage.url ? 'border-nature-forest' : 'border-nature-warm'"
            >
              <img
                :src="image.thumbnailUrl"
                :alt="`${selectedArtwork.title} - 图片 ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <div v-if="image.url === selectedArtwork.coverImage.url" 
                   class="absolute top-1 left-1 bg-nature-forest text-white text-xs px-1 py-0.5 rounded">
                封面
              </div>
            </div>
          </div>
        </div>
        
        <!-- 上传新图片 -->
        <div>
          <h3 class="text-lg font-serif text-nature-forest mb-3">上传新图片</h3>
          <ImageUploader
            ref="imageUploader"
            @files-change="handleFilesChange"
            :max-files="12 - selectedArtwork.images.length"
            :max-file-size="10 * 1024 * 1024"
          />
          
          <div class="mt-4 text-sm text-nature-dark">
            <p>• 最多可上传 {{ 12 - selectedArtwork.images.length }} 张新图片</p>
            <p>• 支持 JPG、PNG 格式，单张图片不超过 10MB</p>
            <p>• 新图片将添加到现有图片集的末尾</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="mt-6 flex space-x-3">
          <button
            @click="handleUploadImages"
            :disabled="!selectedFiles.length || uploading"
            class="btn-primary disabled:opacity-50"
          >
            <svg v-if="uploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ uploading ? '上传中...' : '上传新图片' }}
          </button>
          
          <button
            @click="clearSelection"
            class="btn-secondary"
          >
            重新选择作品
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGalleryStore } from '../stores/gallery'
import ImageUploader from '../components/ImageUploader.vue'
import { uploadImages } from '../utils/api'

export default {
  name: 'AppendImagesPage',
  components: {
    ImageUploader
  },
  setup() {
    const router = useRouter()
    const galleryStore = useGalleryStore()
    
    const loading = ref(false)
    const error = ref('')
    const searchQuery = ref('')
    const selectedArtwork = ref(null)
    const selectedFiles = ref([])
    const uploading = ref(false)
    
    // 过滤后的作品列表
    const filteredArtworks = computed(() => {
      if (!searchQuery.value) return galleryStore.items
      return galleryStore.items.filter(artwork => 
        artwork.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
    
    // 加载作品列表
    const loadArtworks = async () => {
      try {
        loading.value = true
        error.value = ''
        await galleryStore.fetchList({ limit: 1000 })
      } catch (err) {
        error.value = '加载作品列表失败'
        console.error('加载作品列表失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    // 处理搜索
    const handleSearch = () => {
      // 防抖搜索
      clearTimeout(searchQuery.value.debounceTimer)
      searchQuery.value.debounceTimer = setTimeout(() => {
        // 搜索逻辑已通过计算属性实现
      }, 300)
    }
    
    // 选择作品
    const selectArtwork = (artwork) => {
      selectedArtwork.value = artwork
      selectedFiles.value = []
    }
    
    // 清除选择
    const clearSelection = () => {
      selectedArtwork.value = null
      selectedFiles.value = []
    }
    
    // 处理文件选择
    const handleFilesChange = (files) => {
      selectedFiles.value = files
    }
    
    // 上传图片
    const handleUploadImages = async () => {
      if (!selectedArtwork.value || !selectedFiles.value.length) return
      
      try {
        uploading.value = true
        
        const result = await uploadImages(selectedFiles.value, selectedArtwork.value._id)
        
        if (result.success) {
          alert('图片上传成功！')
          // 重新加载作品数据
          await loadArtworks()
          // 更新选中的作品
          const updatedArtwork = galleryStore.items.find(a => a._id === selectedArtwork.value._id)
          if (updatedArtwork) {
            selectedArtwork.value = updatedArtwork
          }
          // 清空选择的文件
          selectedFiles.value = []
        } else {
          throw new Error(result.error || '上传失败')
        }
        
      } catch (err) {
        console.error('上传图片失败:', err)
        alert(err.message || '上传图片失败')
      } finally {
        uploading.value = false
      }
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }
    
    // 组件挂载时加载数据
    onMounted(() => {
      loadArtworks()
    })
    
    return {
      loading,
      error,
      searchQuery,
      selectedArtwork,
      selectedFiles,
      uploading,
      filteredArtworks,
      loadArtworks,
      handleSearch,
      selectArtwork,
      clearSelection,
      handleFilesChange,
      handleUploadImages,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 作品卡片样式 */
.artwork-card:hover {
  transform: translateY(-2px);
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 图片网格响应式 */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
