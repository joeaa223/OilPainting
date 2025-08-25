<template>
  <div class="space-y-4">
    <!-- 上传区域 -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      @click="triggerFileInput"
      class="border-2 border-dashed border-nature-warm rounded-lg p-8 text-center cursor-pointer hover:border-nature-forest hover:bg-nature-warm hover:bg-opacity-10 transition-all duration-200"
      :class="{ 'border-nature-forest bg-nature-forest bg-opacity-5': isDragOver }"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/jpeg,image/png"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div class="space-y-3">
        <svg class="w-12 h-12 text-nature-forest mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        
        <div>
          <p class="text-lg font-medium text-nature-forest">
            {{ isDragOver ? 'Drop files to upload' : 'Click or drag images here' }}
          </p>
          <p class="text-sm text-nature-sky mt-1">
            Supports JPG, PNG format, max 10MB per image, max 12 images
          </p>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- 上传进度 -->
    <div v-if="uploading" class="space-y-3">
      <div class="flex items-center justify-between text-sm text-nature-dark">
        <span>Uploading...</span>
        <span>{{ uploadedCount }} / {{ totalCount }}</span>
      </div>
      <div class="w-full bg-nature-warm rounded-full h-2">
        <div
          class="bg-nature-forest h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- 图片预览列表 -->
    <div v-if="selectedFiles.length > 0" class="space-y-4">
      <h3 class="text-lg font-medium text-nature-forest">Selected Images ({{ selectedFiles.length }})</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(file, index) in selectedFiles"
          :key="index"
          class="relative group"
        >
          <!-- 图片预览 -->
          <div class="aspect-square rounded-lg overflow-hidden bg-nature-warm border-2 border-nature-warm">
            <img
              :src="file.preview"
              :alt="`Preview image ${index + 1}`"
              class="w-full h-full object-cover"
            />
            
            <!-- 删除按钮 -->
            <button
              @click="removeFile(index)"
              class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <!-- 封面选择指示器 -->
            <div
              v-if="coverIndex === index"
              class="absolute top-2 left-2 w-6 h-6 bg-nature-forest text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              Cover
            </div>
          </div>
          
          <!-- 文件信息 -->
          <div class="mt-2 text-xs text-nature-dark">
            <p class="font-medium truncate">{{ file.name }}</p>
            <p>{{ formatFileSize(file.size) }}</p>
          </div>
          
          <!-- 封面选择按钮 -->
          <button
            v-if="coverIndex !== index"
            @click="setCoverImage(index)"
            class="mt-2 w-full text-xs bg-nature-warm text-nature-forest py-1 px-2 rounded hover:bg-nature-forest hover:text-white transition-colors duration-200"
          >
            设为封面
          </button>
        </div>
      </div>
      
      <!-- 批量操作 -->
      <div class="flex space-x-3 pt-4">
        <button
          @click="clearAll"
          class="btn-outline text-sm"
        >
          清空所有
        </button>
        <button
          @click="reorderFiles"
          class="btn-secondary text-sm"
        >
          重新排序
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ImageUploader',
  props: {
    maxFiles: {
      type: Number,
      default: 12
    },
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    acceptedTypes: {
      type: Array,
      default: () => ['image/jpeg', 'image/png']
    }
  },
  emits: ['files-change', 'cover-change'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const selectedFiles = ref([])
    const coverIndex = ref(0)
    const error = ref('')
    const isDragOver = ref(false)
    const uploading = ref(false)
    const uploadedCount = ref(0)
    const totalCount = ref(0)
    
    // 计算上传进度
    const uploadProgress = computed(() => {
      if (totalCount.value === 0) return 0
      return Math.round((uploadedCount.value / totalCount.value) * 100)
    })
    
    // 触发文件选择
    const triggerFileInput = () => {
      fileInput.value?.click()
    }
    
    // 处理文件选择
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      processFiles(files)
      // 清空input值，允许重复选择相同文件
      event.target.value = ''
    }
    
    // 处理拖拽
    const handleDrop = (event) => {
      isDragOver.value = false
      const files = Array.from(event.dataTransfer.files)
      processFiles(files)
    }
    
    // 处理拖拽悬停
    const handleDragOver = (event) => {
      event.preventDefault()
      isDragOver.value = true
    }
    
    const handleDragEnter = (event) => {
      event.preventDefault()
      isDragOver.value = true
    }
    
    // 处理文件
    const processFiles = (files) => {
      error.value = ''
      
      // 检查文件数量限制
      if (selectedFiles.value.length + files.length > props.maxFiles) {
        error.value = `最多只能选择 ${props.maxFiles} 张图片`
        return
      }
      
      const validFiles = []
      
      for (const file of files) {
        // 检查文件类型
        if (!props.acceptedTypes.includes(file.type)) {
          error.value = `不支持的文件类型: ${file.name}`
          continue
        }
        
        // 检查文件大小
        if (file.size > props.maxFileSize) {
          error.value = `文件过大: ${file.name} (${formatFileSize(file.size)})`
          continue
        }
        
        // 创建预览URL
        const preview = URL.createObjectURL(file)
        validFiles.push({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview
        })
      }
      
      if (validFiles.length > 0) {
        selectedFiles.value.push(...validFiles)
        emitFilesChange()
      }
    }
    
    // 移除文件
    const removeFile = (index) => {
      // 释放预览URL
      URL.revokeObjectURL(selectedFiles.value[index].preview)
      
      selectedFiles.value.splice(index, 1)
      
      // 调整封面索引
      if (coverIndex.value >= selectedFiles.value.length) {
        coverIndex.value = Math.max(0, selectedFiles.value.length - 1)
      }
      
      emitFilesChange()
    }
    
    // 设置封面图片
    const setCoverImage = (index) => {
      coverIndex.value = index
      emit('cover-change', index)
    }
    
    // 清空所有文件
    const clearAll = () => {
      // 释放所有预览URL
      selectedFiles.value.forEach(item => {
        URL.revokeObjectURL(item.preview)
      })
      
      selectedFiles.value = []
      coverIndex.value = 0
      error.value = ''
      emitFilesChange()
    }
    
    // 重新排序文件
    const reorderFiles = () => {
      // 这里可以实现拖拽排序功能
      // 暂时只是提示
      alert('拖拽排序功能开发中...')
    }
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    // 发送文件变化事件
    const emitFilesChange = () => {
      emit('files-change', selectedFiles.value.map(item => item.file))
    }
    
    // 设置上传状态
    const setUploading = (uploading, total = 0) => {
      uploading.value = uploading
      totalCount.value = total
      uploadedCount.value = 0
    }
    
    // 更新上传进度
    const updateProgress = (count) => {
      uploadedCount.value = count
    }
    
    // 获取封面索引
    const getCoverIndex = () => coverIndex.value
    
    // 获取选中的文件
    const getSelectedFiles = () => selectedFiles.value.map(item => item.file)
    
    // 监听文件变化
    watch(selectedFiles, () => {
      emitFilesChange()
    }, { deep: true })
    
    // 组件卸载时清理预览URL
    const cleanup = () => {
      selectedFiles.value.forEach(item => {
        URL.revokeObjectURL(item.preview)
      })
    }
    
    return {
      fileInput,
      selectedFiles,
      coverIndex,
      error,
      isDragOver,
      uploading,
      uploadedCount,
      totalCount,
      uploadProgress,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragEnter,
      removeFile,
      setCoverImage,
      clearAll,
      reorderFiles,
      formatFileSize,
      setUploading,
      updateProgress,
      getCoverIndex,
      getSelectedFiles,
      cleanup
    }
  }
}
</script>

<style scoped>
/* 拖拽区域悬停效果 */
.border-dashed:hover {
  transform: scale(1.02);
}

/* 图片预览悬停效果 */
.group:hover img {
  transform: scale(1.05);
}

/* 进度条动画 */
.bg-nature-forest {
  transition: width 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
