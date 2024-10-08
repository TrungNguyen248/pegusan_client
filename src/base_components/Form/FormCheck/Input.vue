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
    type: {
        type: String,
        enum: ['radio', 'checkbox'],
    },
    modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()

const computedClass = computed(() =>
    twMerge([
        // Default
        'transition-all duration-100 ease-in-out',

        // Input type radio
        props.type == 'radio' &&
            'shadow-sm border-slate-200 cursor-pointer focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50',

        // Input type checkbox
        props.type == 'checkbox' &&
            'shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50',

        // On checked
        "[&[type='radio']]:checked:bg-primary [&[type='radio']]:checked:border-primary [&[type='radio']]:checked:border-opacity-10",
        "[&[type='checkbox']]:checked:bg-primary [&[type='checkbox']]:checked:border-primary [&[type='checkbox']]:checked:border-opacity-10",

        // On checked and not disabled
        '[&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-800/50',

        // On checked and disabled
        '[&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-800/50',

        typeof attrs.class === 'string' && attrs.class,
    ]),
)

const localValue = computed({
    get() {
        return props.modelValue
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
