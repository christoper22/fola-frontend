import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import DashboardView from '../views/DashboardView.vue'
import ContactView from '../views/ContactView.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminManageProfileView from '../views/admin/AdminManageProfileView.vue'
import AdminManageProductsView from '../views/admin/AdminManageProductsView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue' // Import AdminLayout
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
    },
    {
      path: '/admin', // Parent route for admin section
      name: 'admin',
      component: AdminLayout, // Use AdminLayout for admin routes
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboardView,
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: AdminManageProfileView,
        },
        {
          path: 'products',
          name: 'admin-products',
          component: AdminManageProductsView,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/admin/login');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/'); // Redirect to home if not admin
  } else {
    next();
  }
});

export default router