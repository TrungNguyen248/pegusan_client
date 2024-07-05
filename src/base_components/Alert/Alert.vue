<script>
export default {
    inheritAttrs: false,
}
</script>

<script setup>
import _ from 'lodash'
import { twMerge } from 'tailwind-merge'
import { TransitionRoot } from '@headlessui/vue'
import { computed, ref, useAttrs } from 'vue'

const props = defineProps({
    as: {
        type: String || Object,
        default: 'div',
    },
    dismissible: Boolean,
    onShow: () => {},
    onShown: () => {},
    onHide: () => {},
    onHidden: () => {},
    variant: {
        type: String,
        enum: [
            'primary',
            'secondary',
            'success',
            'warning',
            'pending',
            'danger',
            'dark',
            'outline-primary',
            'outline-secondary',
            'outline-success',
            'outline-warning',
            'outline-pending',
            'outline-danger',
            'outline-dark',
            'soft-primary',
            'soft-secondary',
            'soft-success',
            'soft-warning',
            'soft-pending',
            'soft-danger',
            'soft-dark',
        ],
    },
})

const attrs = useAttrs()
const show = ref(true)

// Main Colors
const primary = [
    'bg-primary border-primary text-white', // Default
    'dark:border-primary', // Dark
]
const secondary = [
    'bg-secondary/70 border-secondary/70 text-slate-500', // Default
    'dark:border-darkmode-400 dark:bg-darkmode-400 dark:text-slate-300', // Dark mode
]
const success = [
    'bg-success border-success text-slate-900', // Default
    'dark:border-success', // Dark mode
]
const warning = [
    'bg-warning border-warning text-slate-900', // Default
    'dark:border-warning', // Dark mode
]
const pending = [
    'bg-pending border-pending text-white', // Default
    'dark:border-pending', // Dark mode
]
const danger = [
    'bg-danger border-danger text-white', // Default
    'dark:border-danger', // Dark mode
]
const dark = [
    'bg-dark border-dark text-white', // Default
    'dark:bg-darkmode-800 dark:border-transparent dark:text-slate-300', // Dark mode
]

// Outline
const outlinePrimary = [
    'border-primary text-primary', // Default
    'dark:border-primary', // Dark mode
]
const outlineSecondary = [
    'border-secondary text-slate-500', // Default
    'dark:border-darkmode-100/40 dark:text-slate-300', // Dark mode
]
const outlineSuccess = [
    'border-success text-success dark:border-success', // Default
    'dark:border-success', // Dark mode
]
const outlineWarning = [
    'border-warning text-warning', // Default
    'dark:border-warning', // Dark mode
]
const outlinePending = [
    'border-pending text-pending', // Default
    'dark:border-pending', // Dark mode
]
const outlineDanger = [
    'border-danger text-danger', // Default
    'dark:border-danger', // Dark mode
]
const outlineDark = [
    'border-dark text-dark', // Default
    'dark:border-darkmode-800 dark:text-slate-300', // Dark mode
]

// Soft Color
const softPrimary = [
    'bg-primary border-primary bg-opacity-20 border-opacity-5 text-primary', // Default
    'dark:border-opacity-100 dark:bg-opacity-20 dark:border-primary', // Dark mode
]
const softSecondary = [
    'bg-slate-300 border-secondary bg-opacity-10 text-slate-500', // Default
    'dark:bg-darkmode-100/20 dark:border-darkmode-100/30 dark:text-slate-300', // Dark mode
]
const softSuccess = [
    'bg-success border-success bg-opacity-20 border-opacity-5 text-success', // Default
    'dark:border-success dark:border-opacity-20', // Dark mode
]
const softWarning = [
    'bg-warning border-warning bg-opacity-20 border-opacity-5 text-warning', // Default
    'dark:border-warning dark:border-opacity-20', // Dark mode
]
const softPending = [
    'bg-pending border-pending bg-opacity-20 border-opacity-5 text-pending', // Default
    'dark:border-pending dark:border-opacity-20', // Dark mode
]
const softDanger = [
    'bg-danger border-danger bg-opacity-20 border-opacity-5 text-danger', // Default
    'dark:border-danger dark:border-opacity-20', // Dark mode
]
const softDark = [
    'bg-dark border-dark bg-opacity-20 border-opacity-5 text-dark', // Default
    'dark:bg-darkmode-800/30 dark:border-darkmode-800/60 dark:text-slate-300', // Dark mode
]

const computedClass = computed(() =>
    twMerge([
        'relative border rounded-md px-5 py-4',
        props.variant == 'primary' && primary,
        props.variant == 'secondary' && secondary,
        props.variant == 'success' && success,
        props.variant == 'warning' && warning,
        props.variant == 'pending' && pending,
        props.variant == 'danger' && danger,
        props.variant == 'dark' && dark,
        props.variant == 'outline-primary' && outlinePrimary,
        props.variant == 'outline-secondary' && outlineSecondary,
        props.variant == 'outline-success' && outlineSuccess,
        props.variant == 'outline-warning' && outlineWarning,
        props.variant == 'outline-pending' && outlinePending,
        props.variant == 'outline-danger' && outlineDanger,
        props.variant == 'outline-dark' && outlineDark,
        props.variant == 'soft-primary' && softPrimary,
        props.variant == 'soft-secondary' && softSecondary,
        props.variant == 'soft-success' && softSuccess,
        props.variant == 'soft-warning' && softWarning,
        props.variant == 'soft-pending' && softPending,
        props.variant == 'soft-danger' && softDanger,
        props.variant == 'soft-dark' && softDark,
        props.dismissible && 'pl-5 pr-16',
        typeof attrs.class === 'string' && attrs.class,
    ]),
)
</script>

<template>
    <TransitionRoot
        as="template"
        :show="show"
        enter="transition-all ease-linear duration-150"
        enterFrom="invisible opacity-0 translate-y-1"
        enterTo="visible opacity-100 translate-y-0"
        leave="transition-all ease-linear duration-150"
        leaveFrom="visible opacity-100 translate-y-0"
        leaveTo="invisible opacity-0 translate-y-1"
    >
        <component
            :is="props.as"
            role="alert"
            :class="computedClass"
            v-bind="_.omit(attrs, 'class')"
        >
            <slot
                :dismiss="
                    () => {
                        show = false
                    }
                "
            ></slot>
        </component>
    </TransitionRoot>
</template>
