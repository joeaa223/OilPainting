<template>
  <div class="flip-card group cursor-pointer" @click="navigateToDetail">
    <!-- Flip card container -->
    <div class="flip-card-inner group-hover:rotate-y-180">
      <!-- Front: Oil painting image -->
      <div class="flip-card-front">
        <div class="image-container relative overflow-hidden bg-gradient-to-br from-nature-warm to-nature-sky">
          <img
            :src="artwork.coverImage.thumbnailUrl"
            :alt="`${artwork.title} - Oil Painting`"
            :width="artwork.coverImage.width"
            :height="artwork.coverImage.height"
            loading="lazy"
            class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <!-- Information layer on hover -->
          <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <!-- Artwork title -->
            <h3 class="text-2xl font-serif text-white mb-3 drop-shadow-lg">
              {{ artwork.title }}
            </h3>
            
            <!-- View details button -->
            <div class="flex items-center space-x-2 text-white/90">
              <span class="text-sm font-medium">View Details</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <!-- Decorative border -->
          <div class="absolute inset-0 border-2 border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
          
          <!-- Top-right decorative elements -->
          <div class="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full group-hover:bg-white/60 transition-all duration-500"></div>
          <div class="absolute top-8 right-4 w-2 h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-all duration-500 delay-100"></div>
        </div>
        
        <!-- Bottom information bar -->
        <div class="info-bar bg-white/95 backdrop-blur-sm border-t border-white/20">
          <div class="px-4 py-3">
            <h4 class="text-lg font-serif text-nature-forest truncate">
              {{ artwork.title }}
            </h4>
          </div>
        </div>
      </div>
      
      <!-- Back: Artwork information -->
      <div class="flip-card-back">
        <div class="back-content bg-gradient-to-br from-nature-forest to-nature-dark text-white p-6 flex flex-col justify-center">
          <!-- Artwork title -->
          <h3 class="text-2xl font-serif text-center mb-4 text-white">
            {{ artwork.title }}
          </h3>
          
          <!-- Creation date -->
          <div class="text-center mb-4">
            <div class="text-nature-sky text-sm mb-2">Creation Date</div>
            <div class="text-lg">{{ formatCreationDate(artwork.creationDate) }}</div>
          </div>
          
          <!-- Artwork description -->
          <div class="text-center mb-6">
            <div class="text-nature-sky text-sm mb-2">Description</div>
            <p class="text-sm leading-relaxed opacity-90 line-clamp-3">
              {{ artwork.description }}
            </p>
          </div>
          
          <!-- Flip hint -->
          <div class="text-center text-nature-sky text-xs opacity-70">
            <div class="flex items-center justify-center space-x-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Hover to view front</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'ArtworkCard',
  props: {
    artwork: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    
    // 格式化创作时间
    const formatCreationDate = (dateString) => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      
      return `${year} 年 ${month.toString().padStart(2, '0')} 月`
    }
    
    // 导航到详情页
    const navigateToDetail = () => {
      router.push(`/artwork/${props.artwork._id}`)
    }
    
    return {
      formatCreationDate,
      navigateToDetail
    }
  }
}
</script>

<style scoped>
/* 翻页卡片基础样式 */
.flip-card {
  @apply relative w-full h-full perspective-1000;
  aspect-ratio: 4/3;
}

.flip-card-inner {
  @apply relative w-full h-full transition-transform duration-700 transform-style-preserve-3d;
}

/* 翻页效果 */
.group:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* 正面和背面共同样式 */
.flip-card-front,
.flip-card-back {
  @apply absolute inset-0 w-full h-full backface-hidden;
}

/* 背面样式 */
.flip-card-back {
  transform: rotateY(180deg);
}

/* 图片容器样式 */
.image-container {
  @apply w-full h-full relative;
  aspect-ratio: 4/3;
}

/* 悬停时的图片效果 */
.group:hover .image-container img {
  filter: brightness(1.1) contrast(1.05);
}

/* 信息条样式 */
.info-bar {
  @apply absolute bottom-0 left-0 right-0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 装饰元素动画 */
.group:hover .image-container > div:last-child,
.group:hover .image-container > div:nth-last-child(2) {
  transform: scale(1.2);
}

/* 渐变遮罩动画 */
.group:hover .image-container > div:nth-child(2) {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, transparent 100%);
}

/* 文本截断样式 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .flip-card {
    margin: 0 -0.5rem;
    border-radius: 1rem;
  }
  
  .info-bar {
    padding: 0.75rem;
  }
}

/* 高级悬停效果 */
.flip-card::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br from-nature-forest/10 to-nature-sky/10 opacity-0 transition-opacity duration-500;
  pointer-events: none;
}

.flip-card:hover::before {
  opacity: 1;
}

/* 图片加载动画 */
.image-container img {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 装饰边框动画 */
.image-container > div:nth-child(4) {
  border-radius: 1rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover .image-container > div:nth-child(4) {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* 3D 变换支持 */
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
