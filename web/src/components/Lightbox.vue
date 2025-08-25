<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
    @click="closeLightbox"
    @keydown="handleKeydown"
    tabindex="0"
    ref="lightbox"
  >
    <!-- 关闭按钮 -->
    <button
      @click="closeLightbox"
      class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    
    <!-- 图片信息 -->
    <div class="absolute top-4 left-4 text-white text-sm z-10">
      <div class="bg-black bg-opacity-50 px-3 py-2 rounded-lg">
        <p class="font-medium">{{ artworkTitle }}</p>
        <p class="text-gray-300">{{ currentIndex + 1 }} / {{ images.length }}</p>
      </div>
    </div>
    
    <!-- 主图展示 -->
    <div class="relative max-w-full max-h-full p-8">
      <img
        :src="currentImage.url"
        :alt="`${artworkTitle} - Image ${currentIndex + 1}`"
        class="max-w-full max-h-full object-contain"
        @click.stop
      />
      
      <!-- 图片导航指示器 -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div class="flex space-x-2">
          <button
            v-for="(image, index) in images"
            :key="index"
            @click.stop="navigateToImage(index)"
            class="w-3 h-3 rounded-full transition-all duration-200"
            :class="index === currentIndex 
              ? 'bg-white' 
              : 'bg-white bg-opacity-40 hover:bg-opacity-60'"
          ></button>
        </div>
      </div>
    </div>
    
    <!-- 左右切换按钮 -->
    <div v-if="images.length > 1" class="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-none">
      <button
        @click.stop="previousImage"
        class="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 pointer-events-auto"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button
        @click.stop="nextImage"
        class="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 pointer-events-auto"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
    
    <!-- 键盘提示 -->
    <div class="absolute bottom-4 right-4 text-white text-xs opacity-60">
      <p>Use ← → keys to navigate, ESC to close</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Lightbox',
  props: {
    images: {
      type: Array,
      required: true
    },
    currentIndex: {
      type: Number,
      required: true
    },
    artworkTitle: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'navigate'],
  setup(props, { emit }) {
    const lightbox = ref(null)
    
    // 计算当前图片
    const currentImage = computed(() => {
      return props.images[props.currentIndex] || props.images[0]
    })
    
    // 关闭灯箱
    const closeLightbox = () => {
      emit('close')
    }
    
    // 导航到指定图片
    const navigateToImage = (index) => {
      emit('navigate', index)
    }
    
    // 上一张图片
    const previousImage = () => {
      const newIndex = props.currentIndex > 0 
        ? props.currentIndex - 1 
        : props.images.length - 1
      emit('navigate', newIndex)
    }
    
    // 下一张图片
    const nextImage = () => {
      const newIndex = props.currentIndex < props.images.length - 1 
        ? props.currentIndex + 1 
        : 0
      emit('navigate', newIndex)
    }
    
    // 处理键盘事件
    const handleKeydown = (event) => {
      switch (event.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          if (props.images.length > 1) {
            previousImage()
          }
          break
        case 'ArrowRight':
          if (props.images.length > 1) {
            nextImage()
          }
          break
      }
    }
    
    // 阻止页面滚动
    const preventScroll = (event) => {
      event.preventDefault()
    }
    
    // 组件挂载时设置焦点和阻止滚动
    onMounted(() => {
      if (lightbox.value) {
        lightbox.value.focus()
      }
      
      // 阻止背景滚动
      document.body.style.overflow = 'hidden'
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
    })
    
    // 组件卸载时恢复滚动
    onUnmounted(() => {
      document.body.style.overflow = ''
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
    })
    
    return {
      lightbox,
      currentImage,
      closeLightbox,
      navigateToImage,
      previousImage,
      nextImage,
      handleKeydown
    }
  }
}
</script>

<style scoped>
/* 灯箱动画 */
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

/* 图片悬停效果 */
img {
  transition: transform 0.2s ease;
}

img:hover {
  transform: scale(1.02);
}

/* 按钮悬停效果 */
button:hover {
  transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .p-8 {
    padding: 1rem;
  }
  
  .p-3 {
    padding: 0.5rem;
  }
  
  .w-8 {
    width: 1.5rem;
  }
  
  .h-8 {
    height: 1.5rem;
  }
}
</style>
