import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/detail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/detail/Detail'),
        name: 'Detail',
        meta: { title: '智能分析', icon: 'bug' }
      }
    ]
  },
  // {
  //   path: '/map',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/map/index'),
  //       name: 'Map',
  //       meta: { title: '地图展示', icon: 'bug' }
  //     }
  //   ]
  // },
  {
    path: '/label',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/label/index'),
        name: 'Label',
        meta: { title: '规则列表', icon: 'form' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = []

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export default router
