
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/compare', component: () => import('pages/ComparePage.vue')
      },
      {
        path: '/check', component: () => import('pages/CheckPage.vue')
      },
      {
        path: '/info', component: () => import('pages/InfoPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
