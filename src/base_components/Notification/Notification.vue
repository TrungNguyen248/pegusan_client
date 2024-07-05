<script setup>
import { ref, onMounted, inject } from 'vue'
import { init, reInit } from './notification'
import Toastify from 'toastify-js'

// Props
const props = defineProps({
    options: Object,
    refKey: String,
})

// Refs
const toastifyRef = ref({
    toastify: Toastify,
    showToast: () => {},
    hideToast: () => {},
})

const bindInstance = (el) => {
    if (props.refKey) {
        const bind = inject(`bind[${props.refKey}]`)
        if (bind) {
            bind(el)
        }
    }
}

const vNotificationDirective = {
    mounted(el) {
        init(el, props)
    },
    updated(el) {
        reInit(el)
    },
}

onMounted(() => {
    if (toastifyRef.value) {
        bindInstance(toastifyRef.value)
    }
})
</script>

<template>
    <div
        class="hidden py-5 pl-5 bg-white border rounded-lg shadow-xl pr-14 border-slate-200/60 dark:bg-darkmode-600 dark:text-slate-300 dark:border-darkmode-600"
        v-notification-directive
        ref="toastifyRef"
    >
        <slot></slot>
    </div>
</template>
