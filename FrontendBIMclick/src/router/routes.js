
const routes = [
  {
    path: '/Default',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '/Standard', component: () => import('pages/Index.vue') }
    ]
  },
  // Defintion einer neuen Route
  {
    path: '',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/Bauprodukte',
        name: 'Bauprodukte',
        component: () => import('pages/Baustoffe.vue')
      },
      { path: '/Bauvorschriften',
        redirect: '/Umbauarbeiten'
      },
      { path: '/',
        name: 'Baustoffe',
        component: () => import('pages/Baustoffe.vue')
      },
      { path: '/Umbauarbeiten',
        name: 'Umbauarbeiten',
        component: () => import('pages/SeiteImUmbau.vue')
      },
      { path: '/:anythingElse',
        name: 'Error',
        alias: '/Error',
        component: () => import('pages/Error404.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
