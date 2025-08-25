<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <ArtworkCard
      v-for="artwork in artworks"
      :key="artwork._id"
      :artwork="artwork"
      class="animate-fade-in"
    />
  </div>
</template>

<script>
import ArtworkCard from './ArtworkCard.vue'

export default {
  name: 'GalleryGrid',
  components: {
    ArtworkCard
  },
  props: {
    artworks: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
/* 网格动画 */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式网格调整 */
@media (max-width: 768px) {
  .grid {
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }
}
</style>
