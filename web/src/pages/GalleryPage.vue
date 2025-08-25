<template>
  <div class="min-h-screen bg-nature-canvas">
    <!-- 页面头部 -->
    <header class="bg-white shadow-frame border-b-2 border-nature-warm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Logo 区域 -->
        <div class="flex justify-between items-start mb-8">
          <!-- 左上角 Logo -->
          <router-link 
            to="/" 
            class="flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
          >
            <img 
              src="/img/Jeffry Art Logo.png" 
              alt="Jeffry Goh Art Logo" 
              class="h-16 md:h-20 w-auto object-contain"
            />
          </router-link>
          
          <!-- 右侧按钮组 -->
          <div class="flex items-center space-x-4">
            <!-- Contact 按钮 -->
            <button
              @click="showContact = true"
              class="btn-outline inline-flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>Contact</span>
            </button>

          </div>
        </div>
        
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-serif text-nature-forest mb-4">
            Welcome to Jeffry Goh Art
          </h1>
          <p class="text-lg text-nature-dark max-w-2xl mx-auto">
            Explore the beauty of nature, feel the rhythm of art. Each artwork is a witness of time, every stroke of color is an expression of the soul.
          </p>
        </div>
        
        <!-- 搜索栏 -->
        <div class="mt-8 max-w-md mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Search artwork titles..."
              class="input-field pr-12"
            />
            <button
              @click="performSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-nature-forest hover:text-nature-dark"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-forest mx-auto mb-4"></div>
        <p class="text-nature-dark">Loading artworks...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          <p class="mb-3">{{ error }}</p>
          <button @click="retryLoad" class="btn-primary">
            Retry
          </button>
        </div>
      </div>

      <!-- 作品网格 -->
      <div v-else-if="!isEmpty" class="space-y-12">
        <!-- 搜索结果提示 -->
        <div v-if="searchQuery" class="text-center">
          <p class="text-nature-dark">
            Search results for "{{ searchQuery }}": {{ total }} artworks found
            <button @click="clearSearch" class="ml-2 text-nature-forest hover:text-nature-dark underline">
              Clear Search
            </button>
          </p>
        </div>

        <!-- 作品网格 -->
        <GalleryGrid :artworks="items" />

        <!-- 分页组件 -->
        <Pagination
          :current-page="page"
          :total-pages="totalPages"
          :total="total"
          @page-change="handlePageChange"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <div class="bg-nature-warm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-serif text-nature-forest mb-2">No Artworks</h3>
        <p class="text-nature-dark mb-6">
          {{ searchQuery ? 'No matching artworks found' : 'No artworks in gallery yet, please come back later' }}
        </p>
        <button v-if="searchQuery" class="btn-primary">
          Back to All Artworks
        </button>
      </div>
    </main>

    <!-- Contact 弹窗 -->
    <div v-if="showContact" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-frame p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-serif text-nature-forest">Contact Information</h2>
          <button
            @click="showContact = false"
            class="text-nature-sky hover:text-nature-dark transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 联系信息 -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-serif text-nature-forest mb-4">Get in Touch</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-nature-forest bg-opacity-10 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-nature-forest">Email</p>
                    <a 
                      href="mailto:goh8370641@gmail.com" 
                      class="text-nature-sky hover:text-nature-forest transition-colors duration-200"
                    >
                      goh8370641@gmail.com
                    </a>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-nature-forest bg-opacity-10 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-nature-forest">Location</p>
                    <p class="text-nature-sky">Taiping, Perak, Malaysia</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-nature-forest bg-opacity-10 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-nature-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-nature-forest">Response Time</p>
                    <p class="text-nature-sky">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-nature-warm bg-opacity-30 p-4 rounded-lg">
              <h4 class="font-medium text-nature-forest mb-2">About Taiping</h4>
              <p class="text-sm text-nature-dark leading-relaxed">
                Taiping is a historic town in Perak, Malaysia, known for its rich cultural heritage, 
                beautiful landscapes, and vibrant art scene. It's the perfect setting for creating 
                nature-inspired oil paintings that capture the essence of Malaysian landscapes.
              </p>
            </div>
          </div>

          <!-- 地图 -->
          <div class="space-y-4">
            <h3 class="text-lg font-serif text-nature-forest">Location Map</h3>
            <div class="bg-nature-warm bg-opacity-20 rounded-lg p-4 h-80 relative">
              <!-- Google Maps 嵌入 -->
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Taiping,Perak,Malaysia&zoom=12"
                width="100%"
                height="100%"
                style="border:0; border-radius: 8px;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Taiping, Perak, Malaysia"
                class="w-full h-full rounded-lg"
              ></iframe>
              
              <!-- 地图信息覆盖层 -->
              <div class="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-nature-forest font-medium text-sm">Taiping, Perak, Malaysia</p>
                    <p class="text-nature-sky text-xs">Historic town with beautiful landscapes</p>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Taiping,Perak,Malaysia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn-primary btn-sm inline-flex items-center space-x-2 text-xs px-3 py-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    <span>Open</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGalleryStore } from '../stores/gallery'
import { storeToRefs } from 'pinia'
import GalleryGrid from '../components/GalleryGrid.vue'
import Pagination from '../components/Pagination.vue'

export default {
  name: 'GalleryPage',
  components: {
    GalleryGrid,
    Pagination
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const galleryStore = useGalleryStore()
    
    const searchQuery = ref('')
    const debounceTimer = ref(null)
    const showContact = ref(false)
    
    // 从store获取状态 - 使用 storeToRefs 保持响应性
    const { items, loading, error, page, total, totalPages, isEmpty } = storeToRefs(galleryStore)
    
    // 添加调试信息
    console.log('Store refs created:', {
      loading: loading.value,
      isEmpty: isEmpty.value,
      itemsLength: items.value?.length
    })
    
    // 处理搜索
    const handleSearch = () => {
      // 防抖搜索
      clearTimeout(debounceTimer.value)
      debounceTimer.value = setTimeout(() => {
        performSearch()
      }, 500)
    }
    
    const performSearch = async () => {
      if (searchQuery.value.trim()) {
        await galleryStore.search(searchQuery.value.trim())
      } else {
        await galleryStore.fetchList()
      }
      
      // 更新URL
      updateURL()
    }
    
    const clearSearch = async () => {
      searchQuery.value = ''
      await galleryStore.resetSearch()
      await galleryStore.fetchList()
      updateURL()
    }
    
    // 处理分页
    const handlePageChange = async (newPage) => {
      await galleryStore.fetchList({ page: newPage })
      updateURL()
    }
    
    // 更新URL
    const updateURL = () => {
      const query = {}
      if (page.value > 1) query.page = page.value
      if (searchQuery.value) query.q = searchQuery.value
      
      router.replace({ query })
    }
    
    // 重试加载
    const retryLoad = async () => {
      await galleryStore.fetchList()
    }
    
    // 监听路由变化
    watch(() => route.query, (query) => {
      if (query.page) {
        galleryStore.setPage(parseInt(query.page))
      }
      if (query.q) {
        searchQuery.value = query.q
      }
    }, { immediate: true })
    
         // 监听页码变化
     watch(page, () => {
       updateURL()
     })
    
    // 组件挂载时加载数据
    onMounted(async () => {
      console.log('GalleryPage mounted, starting to fetch data...')
      
      // 如果URL中有查询参数，使用它们
      if (route.query.q) {
        searchQuery.value = route.query.q
      }
      if (route.query.page) {
        galleryStore.setPage(parseInt(route.query.page))
      }
      
      // 加载作品列表
      console.log('Calling galleryStore.fetchList()...')
      const result = await galleryStore.fetchList()
      console.log('fetchList result:', result)
      console.log('Store state after fetch:', {
        items: items.value,
        loading: loading.value,
        error: error.value,
        total: total.value,
        isEmpty: isEmpty.value
      })
      
      // 直接检查 store 状态
      console.log('Direct store check:', {
        'galleryStore.loading': galleryStore.loading,
        'galleryStore.items.length': galleryStore.items.length,
        'galleryStore.total': galleryStore.total,
        'galleryStore.isEmpty': galleryStore.isEmpty
      })
      
      // 检查 computed 值
      console.log('Computed values check:', {
        'loading.value': loading.value,
        'items.value': items.value,
        'isEmpty.value': isEmpty.value
      })
    })
    
    return {
      // 状态
      items,
      loading,
      error,
      page,
      total,
      totalPages,
      isEmpty,
      searchQuery,
      showContact,
      
      // 方法
      handleSearch,
      performSearch,
      clearSearch,
      handlePageChange,
      retryLoad
    }
  }
}
</script>
