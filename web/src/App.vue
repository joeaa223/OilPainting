<template>
  <div id="app" class="min-h-screen bg-nature-canvas">
    <!-- 路由视图 -->
    <router-view />
    
    <!-- 全局加载指示器 -->
    <div v-if="globalLoading" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-forest"></div>
        <span class="text-nature-dark font-medium">加载中...</span>
      </div>
    </div>
    
    <!-- 全局错误提示 -->
    <div v-if="globalError" 
         class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
      <div class="flex items-center justify-between">
        <span>{{ globalError }}</span>
        <button @click="clearGlobalError" 
                class="ml-4 text-red-700 hover:text-red-900">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useGalleryStore } from './stores/gallery'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    const galleryStore = useGalleryStore()
    
    const globalLoading = ref(false)
    const globalError = ref('')
    
    // Calculate global loading state
    const isLoading = computed(() => 
      authStore.loading || galleryStore.loading
    )
    
    // Calculate global error state
    const hasError = computed(() => 
      authStore.error || galleryStore.error
    )
    
    // Listen to loading state changes
    const updateGlobalLoading = () => {
      globalLoading.value = isLoading.value
    }
    
    // Listen to error state changes
    const updateGlobalError = () => {
      globalError.value = hasError.value || ''
    }
    
    // Clear global error
    const clearGlobalError = () => {
      globalError.value = ''
      authStore.clearError()
      galleryStore.clearError()
    }
    
    // Initialize application
    const initApp = async () => {
      try {
        // Initialize authentication state
        await authStore.initAuth()
        
        // If authenticated, fetch artwork list
        if (authStore.isAuthenticated) {
          await galleryStore.fetchList()
        }
      } catch (error) {
        console.error('Application initialization failed:', error)
      }
    }
    
    onMounted(() => {
      initApp()
    })
    
    // Listen to state changes
    authStore.$subscribe(updateGlobalLoading)
    galleryStore.$subscribe(updateGlobalLoading)  // Also listen to gallery store
    galleryStore.$subscribe(updateGlobalError)
    
    return {
      globalLoading,
      globalError,
      clearGlobalError
    }
  }
}
</script>

<style>
/* 全局样式 */
#app {
  font-family: 'Inter', system-ui, sans-serif;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 平滑过渡 */
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

/* 焦点样式 */
*:focus {
  outline: 2px solid #244b3c;
  outline-offset: 2px;
}

/* 图片懒加载占位符 */
img[loading="lazy"] {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
