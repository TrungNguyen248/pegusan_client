import { defineAsyncComponent } from 'vue'

export function registerGlobalComponents(app) {
    app.component(
        'auth',
        defineAsyncComponent(() => import('../layouts/auth.vue')),
    )
    app.component(
        'default',
        defineAsyncComponent(() => import('../layouts/default.vue')),
    )
    app.component(
        'start',
        defineAsyncComponent(() => import('../layouts/start.vue')),
    )
    app.component(
        'lesson',
        defineAsyncComponent(() => import('../layouts/lesson.vue')),
    )
}
