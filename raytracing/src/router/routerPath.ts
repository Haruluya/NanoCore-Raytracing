export const routes = [
    {
        path: '/',
        component: () => import('../pages/RayTracing.vue'),
    },
    {
        path: '/BeginCanvas',
        component: () => import('../pages/BeginCanvas/BeginCanvas.vue'),
    },
    {
        path: '/HitObjects',
        component: () => import('../pages/HitObjects/HitObjects.vue'),
    },
    {
        path: '/Normal',
        component: () => import('../pages/Normal/Normal.vue'),
    },
    {
        path: '/Antialiasing',
        component: () => import('../pages/Antialiasing/Antialiasing.vue'),
    },
    {
        path: '/DiffuseMT',
        component: () => import('../pages/DiffuseMT/DiffuseMT.vue'),
    },
    {
        path: '/MentalMT',
        component: () => import('../pages/MentalMT/MentalMT.vue'),
    },
    {
        path: '/DielectricsMT',
        component: () => import('../pages/DielectricsMT/DielectricsMT.vue'),
    }
    
]