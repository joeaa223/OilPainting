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
            <h1 class="text-3xl font-serif text-nature-forest">Upload New Artwork</h1>
            <p class="text-nature-dark mt-1">Create new artwork</p>
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

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 上传表单 -->
      <div class="bg-white rounded-xl shadow-frame p-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- 基本信息 -->
          <div class="space-y-6">
            <h2 class="text-2xl font-serif text-nature-forest border-b border-nature-warm pb-2">
              Basic Information
            </h2>
            
            <!-- 作品标题 -->
            <div>
              <label for="title" class="block text-sm font-medium text-nature-forest mb-2">
                Artwork Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                maxlength="100"
                class="input-field"
                placeholder="Enter artwork title"
                :disabled="submitting"
              />
              <p class="text-xs text-nature-sky mt-1">
                {{ form.title.length }}/100 characters
              </p>
            </div>
            
            <!-- 创作时间 -->
            <div>
              <label for="creationDate" class="block text-sm font-medium text-nature-forest mb-2">
                Creation Date <span class="text-red-500">*</span>
              </label>
              <input
                id="creationDate"
                v-model="form.creationDate"
                type="date"
                required
                class="input-field"
                :disabled="submitting"
              />
            </div>
            
            <!-- 作品简介 -->
            <div>
              <label for="description" class="block text-sm font-medium text-nature-forest mb-2">
                Artwork Description <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="form.description"
                required
                maxlength="1000"
                rows="6"
                class="input-field resize-none"
                placeholder="Please describe the artwork's creation background, technique features, artistic value, etc..."
                :disabled="submitting"
              ></textarea>
              <p class="text-xs text-nature-sky mt-1">
                {{ form.description.length }}/1000 characters
              </p>
            </div>
            
            <!-- 油画尺寸信息 -->
            <div class="space-y-4">
              <h3 class="text-lg font-serif text-nature-forest border-b border-nature-warm pb-2">Dimensions</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- 高度 -->
                <div>
                  <label for="height" class="block text-sm font-medium text-nature-forest mb-2">
                    Height <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center space-x-2">
                    <input
                      id="height"
                      v-model="form.height"
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      class="input-field flex-1"
                      placeholder="45"
                      :disabled="submitting"
                    />
                    <span class="text-nature-dark font-medium">cm</span>
                  </div>
                </div>
                
                <!-- 宽度 -->
                <div>
                  <label for="width" class="block text-sm font-medium text-nature-forest mb-2">
                    Width <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center space-x-2">
                    <input
                      id="width"
                      v-model="form.width"
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      class="input-field flex-1"
                      placeholder="55"
                      :disabled="submitting"
                    />
                    <span class="text-nature-dark font-medium">cm</span>
                  </div>
                </div>
                
                <!-- 厚度 -->
                <div>
                  <label for="depth" class="block text-sm font-medium text-nature-forest mb-2">
                    Depth
                  </label>
                  <div class="flex items-center space-x-2">
                    <input
                      id="depth"
                      v-model="form.depth"
                      type="number"
                      step="0.1"
                      min="0"
                      class="input-field flex-1"
                      placeholder="2.2"
                      :disabled="submitting"
                    />
                    <span class="text-nature-dark font-medium">cm</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 材质信息 -->
            <div class="space-y-4">
              <h3 class="text-lg font-serif text-nature-forest border-b border-nature-warm pb-2">Material Information</h3>
              
              <!-- 画布材质 -->
              <div>
                <label for="material" class="block text-sm font-medium text-nature-forest mb-2">
                  Canvas Material <span class="text-red-500">*</span>
                </label>
                <select
                  id="material"
                  v-model="form.material"
                  required
                  class="input-field"
                  :disabled="submitting"
                >
                  <option value="">Please select canvas material</option>
                  <option value="Oil on canvas">Oil on canvas</option>
                  <option value="Oil on linen">Oil on linen</option>
                  <option value="Oil on cotton">Oil on cotton</option>
                  <option value="Oil on board">Oil on board</option>
                  <option value="Acrylic on canvas">Acrylic on canvas</option>
                  <option value="Mixed media">Mixed media</option>
                </select>
              </div>
              
              <!-- 画框信息 -->
              <div>
                <label class="block text-sm font-medium text-nature-forest mb-2">
                  Frame
                </label>
                <div class="flex items-center space-x-4 p-3 bg-nature-warm bg-opacity-20 rounded-lg">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="form.withFrame"
                      :value="true"
                      :disabled="submitting"
                      class="text-nature-forest focus:ring-nature-forest"
                    />
                    <span class="text-nature-dark font-medium">With frame</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="form.withFrame"
                      :value="false"
                      :disabled="submitting"
                      class="text-nature-forest focus:ring-nature-forest"
                    />
                    <span class="text-nature-dark font-medium">Without frame</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 图片上传 -->
          <div class="space-y-6">
            <h2 class="text-2xl font-serif text-nature-forest border-b border-nature-warm pb-2">
              Image Upload
            </h2>
            
            <ImageUploader
              ref="imageUploader"
              :max-files="12"
              :max-file-size="10 * 1024 * 1024"
              :accepted-types="['image/jpeg', 'image/png']"
              @files-change="handleFilesChange"
              @cover-change="handleCoverChange"
            />
            
            <!-- 图片要求提示 -->
            <div class="bg-nature-warm bg-opacity-30 p-4 rounded-lg">
              <h4 class="font-medium text-nature-forest mb-2">Upload Requirements:</h4>
              <ul class="text-sm text-nature-dark space-y-1">
                <li>• Supports JPG, PNG format images</li>
                <li>• Maximum 10MB per image</li>
                <li>• Maximum 12 images can be uploaded</li>
                <li>• First image will be the cover, can be manually adjusted</li>
                <li>• Recommend uploading high-quality original images, system will automatically generate thumbnails</li>
              </ul>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-nature-warm">
            <button
              type="button"
              @click="resetForm"
              class="btn-outline"
              :disabled="submitting"
            >
              Reset Form
            </button>
            <button
              type="submit"
              :disabled="submitting || !canSubmit"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="submitting" class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </div>
                              <span v-else>Create Artwork</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 成功提示 -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-frame p-8 max-w-md w-full text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-serif text-nature-forest mb-2">Artwork Created Successfully!</h3>
          <p class="text-nature-dark mb-6">Your artwork has been successfully uploaded to the gallery</p>
          <div class="flex space-x-3">
            <button
              @click="goToGallery"
              class="btn-primary flex-1"
            >
              View Gallery
            </button>
            <button
              @click="createAnother"
              class="btn-outline flex-1"
            >
              Continue Uploading
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { createArtwork } from '../utils/api'
import ImageUploader from '../components/ImageUploader.vue'

export default {
  name: 'UploadNewArtworkPage',
  components: {
    ImageUploader
  },
  setup() {
    const router = useRouter()
    const imageUploader = ref(null)
    
    const form = ref({
      title: '',
      creationDate: '',
      description: '',
      height: '',
      width: '',
      depth: '',
      material: '',
      withFrame: false
    })
    
    const selectedFiles = ref([])
    const coverIndex = ref(0)
    const submitting = ref(false)
    const showSuccess = ref(false)
    
    // 计算是否可以提交
    const canSubmit = computed(() => {
      return form.value.title.trim() && 
             form.value.creationDate && 
             form.value.description.trim() && 
             form.value.height && 
             form.value.width && 
             form.value.material && 
             selectedFiles.value.length > 0
    })
    
    // 处理文件变化
    const handleFilesChange = (files) => {
      selectedFiles.value = files
    }
    
    // 处理封面变化
    const handleCoverChange = (index) => {
      coverIndex.value = index
    }
    
    // 处理表单提交
    const handleSubmit = async () => {
      if (!canSubmit.value) return
      
      try {
        submitting.value = true
        
        const result = await createArtwork({
          title: form.value.title.trim(),
          creationDate: form.value.creationDate,
          description: form.value.description.trim(),
          height: parseFloat(form.value.height),
          width: parseFloat(form.value.width),
          depth: form.value.depth ? parseFloat(form.value.depth) : undefined,
          material: form.value.material,
          withFrame: form.value.withFrame,
          coverIndex: coverIndex.value
        }, selectedFiles.value)
        
        if (result.success) {
          showSuccess.value = true
        } else {
          alert(result.error || '创建作品失败')
        }
      } catch (error) {
        console.error('创建作品失败:', error)
        alert('创建作品失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }
    
    // 重置表单
    const resetForm = () => {
      if (confirm('确定要重置表单吗？所有已填写的内容将丢失。')) {
        form.value = {
          title: '',
          creationDate: '',
          description: '',
          height: '',
          width: '',
          depth: '',
          material: '',
          withFrame: false
        }
        selectedFiles.value = []
        coverIndex.value = 0
        
        // 重置图片上传器
        if (imageUploader.value) {
          imageUploader.value.clearAll()
        }
      }
    }
    
    // 查看画廊
    const goToGallery = () => {
      showSuccess.value = false
      router.push('/')
    }
    
    // 继续上传
    const createAnother = () => {
      showSuccess.value = false
      resetForm()
    }
    
    // 组件卸载时清理
    onUnmounted(() => {
      if (imageUploader.value) {
        imageUploader.value.cleanup()
      }
    })
    
    return {
      form,
      selectedFiles,
      coverIndex,
      submitting,
      showSuccess,
      canSubmit,
      imageUploader,
      handleFilesChange,
      handleCoverChange,
      handleSubmit,
      resetForm,
      goToGallery,
      createAnother
    }
  }
}
</script>

<style scoped>
/* 表单动画 */
.bg-white {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 输入框焦点效果 */
.input-field:focus {
  transform: translateY(-1px);
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
