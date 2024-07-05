<script setup>
import _ from 'lodash'
import { computed, useAttrs, inject } from 'vue'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
    type: { String, default: 'text' },
    modelValue: [String, Number],
    formInputSize: {
        type: String,
        enum: ['sm', 'lg'],
    },
    rounded: Boolean,
})

const attrs = useAttrs()

const emit = defineEmits(['update:modelValue'])

const computedClass = computed(() =>
    twMerge([
        'disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent',
        '[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent',
        'transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80',
        props.formInputSize == 'sm' && 'text-xs py-1.5 px-2',
        props.formInputSize == 'lg' && 'text-lg py-1.5 px-4',
        props.rounded && 'rounded-full',
        typeof attrs.class === 'string' && attrs.class,
    ]),
)

const localValue = computed({
    get() {
        return props.modelValue === undefined ? props.value : props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    },
})
</script>

<template>
    <input
        :class="computedClass"
        :type="props.type"
        v-bind="_.omit(attrs, 'class')"
        v-model="localValue"
    />
</template>
