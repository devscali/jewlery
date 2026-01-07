import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/catalog'
    },
    {
      path: '/catalog',
      name: 'Catalog',
      component: () => import('../views/CatalogView.vue'),
      meta: { public: true }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard para proteger rutas de admin
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    // Redirigir al catálogo si no está autenticado
    next('/catalog')
  } else {
    next()
  }
})

export default router
