import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/profile',
        name: 'Profile',
        meta: {
            layout: 'default',
            requiresAuth: true,
        },
        component: () => import('../pages/profile.vue'),
    },
    {
        path: '/course/:course_id/mina/:id',
        name: 'LessonMina',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/lesson_mina.vue'),
        props: true,
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            layout: 'auth',
        },
        component: () => import('../pages/login.vue'),
    },
    {
        path: '/dict',
        name: 'Dict',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/dict.vue'),
    },
    {
        path: '/grammar/:level?/:page?',
        name: 'Grammar',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/grammar.vue'),
        props: true,
    },
    {
        path: '/exams/result/:id',
        name: 'ExamsResult',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/exams_result.vue'),
        props: true,
    },
    {
        path: '/exams/run/:id',
        name: 'ExamsRun',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/exams_run.vue'),
        props: true,
    },
    {
        path: '/exams/:tags?/:level?',
        name: 'Exams',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/exams.vue'),
        props: true,
    },
    {
        path: '/kanji/:level?/:page?',
        name: 'Kanji',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/kanji.vue'),
        props: true,
    },
    {
        path: '/course/:course_id/hina/:id',
        name: 'LessonHina',
        meta: {
            layout: 'lesson',
            requiresAuth: true,
        },
        component: () => import('../pages/lesson_hina.vue'),
        props: true,
    },
    {
        path: '/course/:id',
        name: 'CourseDetail',
        meta: {
            layout: 'default',
        },
        component: () => import('../pages/course_detail.vue'),
        props: true,
    },
    {
        path: '/course',
        name: 'Course',
        meta: {
            layout: 'default',
            requiresAuth: true,
        },
        component: () => import('../pages/courses.vue'),
        children: {},
    },
    {
        path: '/',
        name: 'Home',
        meta: {
            layout: 'start',
        },
        component: () => import('../pages/home.vue'),
    },
    {
        path: '/signup',
        name: 'Singup',
        meta: {
            layout: 'auth',
        },
        component: () => import('../pages/signup.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        meta: {
            layout: 'start',
        },
        component: () => import('../pages/notfound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const isLoggedIn = !!authStore.accessToken

    if (requiresAuth && !isLoggedIn) {
        next({ name: 'Login' })
    } else if (to.name === 'Login' && isLoggedIn) {
        next(from.path)
    } else {
        next()
    }
})

export default router
