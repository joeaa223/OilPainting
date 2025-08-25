import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

// 页面组件
import GalleryPage from './pages/GalleryPage.vue'
import ArtworkDetailPage from './pages/ArtworkDetailPage.vue'
import AdminLoginPage from './pages/AdminLoginPage.vue'
import AdminDashboard from './pages/AdminDashboard.vue'
import UploadNewArtworkPage from './pages/UploadNewArtworkPage.vue'
import EditArtworkPage from './pages/EditArtworkPage.vue'

const routes = [
  {
    path: '/',
    name: 'Gallery',
    component: GalleryPage,
          meta: { title: 'Gallery - Landscape Oil Painting Gallery' }
  },
  {
    path: '/artwork/:id',
    name: 'ArtworkDetail',
    component: ArtworkDetailPage,
          meta: { title: 'Artwork Details - Landscape Oil Painting Gallery' }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLoginPage,
          meta: { title: 'Admin Login - Landscape Oil Painting Gallery' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
          meta: { 
        title: 'Admin Dashboard - Landscape Oil Painting Gallery',
        requiresAuth: true 
      }
  },
  {
    path: '/admin/artworks/new',
    name: 'UploadNewArtwork',
    component: UploadNewArtworkPage,
          meta: { 
        title: 'Upload New Artwork - Landscape Oil Painting Gallery',
        requiresAuth: true 
      }
  },
  {
    path: '/admin/artworks/append',
    name: 'AppendImages',
    component: () => import('./pages/AppendImagesPage.vue'),
          meta: { 
        title: 'Add New Images to Existing Collection - Landscape Oil Painting Gallery',
        requiresAuth: true 
      }
  },
  {
    path: '/admin/artworks/:id/edit',
    name: 'EditArtwork',
    component: EditArtworkPage,
          meta: { 
        title: 'Edit Artwork - Landscape Oil Painting Gallery',
        requiresAuth: true 
      }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Check if authentication is required
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    
    if (!authStore.isAdmin) {
      // Not admin, redirect to login page
      next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
      return
    }
  }
  
  // If logged in user visits login page, redirect to admin dashboard
  if (to.name === 'AdminLogin') {
    const authStore = useAuthStore()
    if (authStore.isAdmin) {
      next({ name: 'AdminDashboard' })
      return
    }
  }
  
  next()
})

export default router
