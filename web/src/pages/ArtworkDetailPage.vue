<template>
  <div class="min-h-screen bg-nature-canvas">
    <!-- 返回按钮和操作按钮 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div class="flex items-center justify-between">
        <!-- 左上角 Logo -->
        <router-link 
          to="/" 
          class="flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
        >
          <img 
            src="/img/Jeffry Art Logo.png" 
            alt="Jeffry Goh Art Logo" 
            class="h-12 md:h-16 w-auto object-contain"
          />
        </router-link>
        
        <button
          @click="goBack"
          class="inline-flex items-center space-x-2 text-nature-forest hover:text-nature-dark transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Back to Gallery</span>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-forest mx-auto mb-4"></div>
                 <p class="text-nature-dark">Loading artwork details...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          <p class="mb-3">{{ error }}</p>
                       <button @click="retryLoad" class="btn-primary">
               Retry
             </button>
        </div>
      </div>
    </div>

    <!-- 作品详情 -->
    <div v-else-if="artwork" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 作品标题和基本信息 -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-serif text-nature-forest mb-4">
          {{ artwork.title }}
        </h1>
        <div class="flex items-center justify-center space-x-6 text-nature-sky">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>{{ formatCreationDate(artwork.creationDate) }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
                         <span>{{ artwork.images.length }} images</span>
          </div>
        </div>
      </div>

      <!-- 图片轮播 -->
      <div class="mb-12">
        <div class="relative bg-white rounded-xl shadow-frame overflow-hidden">
          <!-- 主图展示 -->
          <div class="relative aspect-[16/9] bg-nature-warm">
            <img
              :src="currentImage.url"
              :alt="`${artwork.title} - 图片 ${currentImageIndex + 1}`"
              class="w-full h-full object-contain cursor-pointer"
              @click="openLightbox"
            />
            
            <!-- 图片导航 -->
            <div v-if="artwork.images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div class="flex space-x-2">
                <button
                  v-for="(image, index) in artwork.images"
                  :key="index"
                  @click="setCurrentImage(index)"
                  class="w-3 h-3 rounded-full transition-all duration-200"
                  :class="index === currentImageIndex 
                    ? 'bg-nature-forest' 
                    : 'bg-white bg-opacity-60 hover:bg-opacity-80'"
                ></button>
              </div>
            </div>
          </div>
          
          <!-- 左右切换按钮 -->
          <div v-if="artwork.images.length > 1" class="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4">
            <button
              @click="previousImage"
              class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              @click="nextImage"
              class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 缩略图列表 -->
        <div v-if="artwork.images.length > 1" class="mt-6 flex justify-center space-x-4 overflow-x-auto">
          <button
            v-for="(image, index) in artwork.images"
            :key="index"
            @click="setCurrentImage(index)"
            class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200"
            :class="index === currentImageIndex 
              ? 'border-nature-forest' 
              : 'border-nature-warm hover:border-nature-sky'"
          >
            <img
              :src="image.thumbnailUrl"
              :alt="`${artwork.title} - 缩略图 ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <!-- 作品简介 -->
      <div class="bg-white rounded-xl shadow-frame p-8 mb-12">
                 <h2 class="text-2xl font-serif text-nature-forest mb-6">Artwork Description</h2>
        <div class="prose prose-lg max-w-none text-nature-dark leading-relaxed">
          <p class="whitespace-pre-wrap">{{ artwork.description }}</p>
        </div>
      </div>

      <!-- 相关作品 -->
      <div v-if="relatedArtworks && relatedArtworks.length > 0" class="mb-12">
                 <h2 class="text-2xl font-serif text-nature-forest mb-6 text-center">Related Artworks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="related in relatedArtworks"
            :key="related._id"
            @click="navigateToArtwork(related._id)"
            class="card-frame overflow-hidden cursor-pointer group"
          >
            <div class="aspect-[4/3] overflow-hidden bg-nature-warm">
              <img
                :src="related.coverImage.thumbnailUrl"
                :alt="`${related.title} - 封面图片`"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div class="p-4">
              <h3 class="font-serif text-nature-forest mb-2 line-clamp-2">{{ related.title }}</h3>
              <p class="text-sm text-nature-sky">{{ formatCreationDate(related.creationDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 灯箱组件 -->
    <Lightbox
      v-if="showLightbox"
      :images="artwork.images"
      :current-index="currentImageIndex"
      :artwork-title="artwork.title"
      @close="closeLightbox"
      @navigate="setCurrentImage"
    />
    
    
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGalleryStore } from '../stores/gallery'


import Lightbox from '../components/Lightbox.vue'

export default {
  name: 'ArtworkDetailPage',
  components: {
    Lightbox
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const galleryStore = useGalleryStore()
    
    
    const artwork = ref(null)
    const relatedArtworks = ref([])
    const currentImageIndex = ref(0)
         const showLightbox = ref(false)
    
    // 从store获取状态
    const { loading, error } = galleryStore
    
    
    
    // 计算当前图片
    const currentImage = computed(() => {
      if (!artwork.value || !artwork.value.images) return null
      return artwork.value.images[currentImageIndex.value] || artwork.value.images[0]
    })
    
    // 格式化创作时间
    const formatCreationDate = (dateString) => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      return `${year} 年 ${month.toString().padStart(2, '0')} 月 ${day.toString().padStart(2, '0')} 日`
    }
    
    // 设置当前图片
    const setCurrentImage = (index) => {
      if (index >= 0 && index < artwork.value.images.length) {
        currentImageIndex.value = index
      }
    }
    
    // 上一张图片
    const previousImage = () => {
      const newIndex = currentImageIndex.value > 0 
        ? currentImageIndex.value - 1 
        : artwork.value.images.length - 1
      setCurrentImage(newIndex)
    }
    
    // 下一张图片
    const nextImage = () => {
      const newIndex = currentImageIndex.value < artwork.value.images.length - 1 
        ? currentImageIndex.value + 1 
        : 0
      setCurrentImage(newIndex)
    }
    
    // 打开灯箱
    const openLightbox = () => {
      showLightbox.value = true
    }
    
    // 关闭灯箱
    const closeLightbox = () => {
      showLightbox.value = false
    }
    
    // 返回画廊
    const goBack = () => {
      router.back()
    }
    
    // 导航到其他作品
    const navigateToArtwork = (id) => {
      router.push(`/artwork/${id}`)
    }
    
    // 重试加载
    const retryLoad = async () => {
      await loadArtwork()
    }
    
    // 加载作品详情
    const loadArtwork = async () => {
      try {
        const result = await galleryStore.fetchArtwork(route.params.id)
        if (result.success) {
          artwork.value = result.data.artwork
          relatedArtworks.value = result.data.relatedArtworks || []
        }
      } catch (error) {
        console.error('加载作品详情失败:', error)
      }
    }
    
    
    
    // 组件挂载时加载数据
    onMounted(() => {
      loadArtwork()
    })
    
    return {
             // 状态
       artwork,
       relatedArtworks,
       currentImageIndex,
       showLightbox,
       loading,
       error,
      
             // 计算属性
       currentImage,
      
             // 方法
       formatCreationDate,
       setCurrentImage,
       previousImage,
       nextImage,
       openLightbox,
       closeLightbox,
       goBack,
       navigateToArtwork,
       retryLoad
    }
  }
}
</script>

<style scoped>
/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 图片轮播动画 */
.aspect-\[16\/9\] img {
  transition: transform 0.3s ease;
}

/* 缩略图悬停效果 */
.aspect-\[4\/3\] img {
  transition: transform 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .prose {
    font-size: 1rem;
  }
}
</style>
