<script>
export default {
    inheritAttrs: false,
}
</script>

<script setup>
import _ from 'lodash'
import { twMerge } from 'tailwind-merge'
import { computed, useAttrs } from 'vue'

const props = defineProps({
    as: {
        type: String || Object,
        default: 'button',
    },
})

const attrs = useAttrs()

const computedClass = computed(() =>
    twMerge([
        'text-slate-800 py-2 px-3 absolute right-0 my-auto mr-2',
        typeof attrs.class === 'string' && attrs.class,
    ]),
)
</script>

<template>
    <component
        :is="props.as"
        type="button"
        aria-label="Close"
        :class="computedClass"
        v-bind="_.omit(attrs, 'class')"
    >
        <slot></slot>
    </component>
</template>
