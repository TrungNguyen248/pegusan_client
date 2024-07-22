<script setup>
import { ref } from 'vue'

import cloud_1 from '../assets/images/cloud-1.png'
import cloud_2 from '../assets/images/cloud-2.png'
import cloud_3 from '../assets/images/cloud-3.png'
import cloud_4 from '../assets/images/cloud-4.png'
import cloud_5 from '../assets/images/cloud-5.png'
import cloud_6 from '../assets/images/cloud-6.png'
import cloud_7 from '../assets/images/cloud-7.png'
import cloud_8 from '../assets/images/cloud-8.png'

const clouds = ref([
    { id: 1, src: cloud_1 },
    { id: 1, src: cloud_2 },
    { id: 3, src: cloud_3 },
    { id: 4, src: cloud_4 },
    { id: 5, src: cloud_5 },
    { id: 6, src: cloud_6 },
    { id: 7, src: cloud_7 },
    { id: 8, src: cloud_8 },
])

function cloudStyle() {
    const delay = Math.random() * 5
    const duration = 15 + Math.floor(Math.random() * 10)
    const top = Math.floor(Math.random() * 80)
    const left = 100 * Math.random() * 15
    const z_idx = Math.floor(Math.random() * 20)
    return {
        idx: z_idx,
        duration: duration,
        top: `${top}%`,
        left: `${left}px`,
        animate: `cloud ${duration}s ease-in-out infinite`,
        //class: `animate-[cloud_${duration}s_ease-in-out_infinite]`,
    }
}
</script>

<template>
    <div
        :class="[
            'sm:px-8 relative min-h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
            'before:hidden before:xl:block before:content-[\'\'] before:w-[60%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
            'after:hidden after:xl:block after:content-[\'\'] after:w-[60%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
        ]"
    >
        <div class="container relative z-10 sm:px-10">
            <div class="block grid-cols-2 gap-4 xl:grid">
                <!-- BEGIN: Login Info -->
                <div class="relative flex-col hidden min-h-screen xl:flex">
                    <a href="/" class="flex items-center -intro-x">
                        <!-- <img
                            class="w-24 h-[96px]"
                            src="../assets/images/penguin-logo.svg"
                            alt="logo"
                        /> -->
                        <span
                            class="mt-[20px] flex justify-center items-center"
                        >
                            <p class="text-white text-lg font-bold">PEGUSAN</p>
                        </span>
                    </a>
                    <div class="my-auto flex flex-col items-center">
                        <div
                            class="absolute top-20 h-[300px] w-full overflow-hidden"
                        >
                            <div
                                class="w-40 absolute"
                                v-for="cloud in clouds"
                                :key="cloud.id"
                                :style="{
                                    top: cloudStyle().top,
                                    left: cloudStyle().left,
                                    animation: cloudStyle().animate,
                                    'z-index': cloudStyle().idx,
                                }"
                            >
                                <img
                                    class="w-full"
                                    :src="cloud.src"
                                    :alt="`cloud ${cloud.id}`"
                                />
                            </div>
                        </div>
                        <div class="z-10 flex flex-col items-center">
                            <img
                                alt="tori-bg"
                                class="max-w-[350px]"
                                src="../assets/images/tori-bg.png"
                            />
                            <div class="absolute w-full h-[170px]">
                                <img
                                    alt=""
                                    src="../assets/images/pegu_hello.svg"
                                    class="absolute top-full left-1/3 w-40"
                                />
                            </div>
                            <div
                                class="mt-10 text-4xl font-medium leading-tight text-white -intro-x"
                            >
                                Website học tiếng Nhật
                            </div>
                            <div
                                class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400"
                            >
                                Nền tảng học tiếng Nhật cho người Việt.
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END: Login Info -->
                <slot />
            </div>
        </div>
    </div>
</template>
