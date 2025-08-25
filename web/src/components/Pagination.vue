<template>
  <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
    <!-- 总数信息 -->
    <div class="text-sm text-nature-dark">
      Total {{ total }} artworks, Page {{ currentPage }} of {{ totalPages }}
    </div>
    
    <!-- 分页控件 -->
    <div class="flex items-center space-x-2">
      <!-- 上一页 -->
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage <= 1"
        class="p-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="currentPage <= 1 
          ? 'border-nature-warm text-nature-sky' 
          : 'border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <!-- 页码 -->
      <div class="flex items-center space-x-1">
        <!-- 第一页 -->
        <button
          v-if="showFirstPage"
          @click="$emit('page-change', 1)"
          class="px-3 py-2 rounded-lg border-2 transition-all duration-200"
          :class="currentPage === 1 
            ? 'border-nature-forest bg-nature-forest text-white' 
            : 'border-nature-warm text-nature-dark hover:border-nature-forest'"
        >
          1
        </button>
        
        <!-- 省略号 -->
        <span v-if="showFirstEllipsis" class="px-2 text-nature-sky">...</span>
        
        <!-- 中间页码 -->
        <button
          v-for="pageNum in visiblePages"
          :key="pageNum"
          @click="$emit('page-change', pageNum)"
          class="px-3 py-2 rounded-lg border-2 transition-all duration-200"
          :class="currentPage === pageNum 
            ? 'border-nature-forest bg-nature-forest text-white' 
            : 'border-nature-warm text-nature-dark hover:border-nature-forest'"
        >
          {{ pageNum }}
        </button>
        
        <!-- 省略号 -->
        <span v-if="showLastEllipsis" class="px-2 text-nature-sky">...</span>
        
        <!-- 最后一页 -->
        <button
          v-if="showLastPage"
          @click="$emit('page-change', totalPages)"
          class="px-3 py-2 rounded-lg border-2 transition-all duration-200"
          :class="currentPage === totalPages 
            ? 'border-nature-forest bg-nature-forest text-white' 
            : 'border-nature-warm text-nature-dark hover:border-nature-forest'"
        >
          {{ totalPages }}
        </button>
      </div>
      
      <!-- 下一页 -->
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="p-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="currentPage >= totalPages 
          ? 'border-nature-warm text-nature-sky' 
          : 'border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
    
    <!-- 快速跳转 -->
    <div class="flex items-center space-x-2">
      <span class="text-sm text-nature-dark">Go to</span>
      <input
        v-model.number="jumpPage"
        @keyup.enter="handleJumpPage"
        type="number"
        min="1"
        :max="totalPages"
        class="w-16 px-2 py-1 text-center border border-nature-warm rounded focus:border-nature-forest focus:outline-none"
        placeholder="Page"
      />
      <button
        @click="handleJumpPage"
        class="px-3 py-1 text-sm bg-nature-forest text-white rounded hover:bg-nature-dark transition-colors duration-200"
      >
        跳转
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['page-change'],
  setup(props) {
    const jumpPage = ref('')
    
    // 计算可见页码
    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(2, props.currentPage - 1)
      const end = Math.min(props.totalPages - 1, props.currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < props.totalPages) {
          pages.push(i)
        }
      }
      
      return pages
    })
    
    // 是否显示第一页
    const showFirstPage = computed(() => {
      return props.currentPage > 3
    })
    
    // 是否显示第一页省略号
    const showFirstEllipsis = computed(() => {
      return props.currentPage > 4
    })
    
    // 是否显示最后一页
    const showLastPage = computed(() => {
      return props.currentPage < props.totalPages - 2
    })
    
    // 是否显示最后一页省略号
    const showLastEllipsis = computed(() => {
      return props.currentPage < props.totalPages - 3
    })
    
    // 处理页码跳转
    const handleJumpPage = () => {
      const page = parseInt(jumpPage.value)
      if (page && page >= 1 && page <= props.totalPages) {
        this.$emit('page-change', page)
        jumpPage.value = ''
      }
    }
    
    return {
      jumpPage,
      visiblePages,
      showFirstPage,
      showFirstEllipsis,
      showLastPage,
      showLastEllipsis,
      handleJumpPage
    }
  }
}
</script>

<style scoped>
/* 分页按钮悬停效果 */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .flex-col {
    align-items: stretch;
  }
  
  .flex-col > div {
    text-align: center;
  }
}
</style>
