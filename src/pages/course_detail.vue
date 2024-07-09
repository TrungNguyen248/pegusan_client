<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/course'
import courseApi from '../api/course'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const lessonList = ref({})
const error = ref(null)
const isLoading = ref(true)

const authStore = useAuthStore()
const user = authStore.user
const courseStore = useCourseStore()

async function fetchCourseDetails() {
    isLoading.value = false
    error.value = null
    try {
        const data = await courseApi.getLessonListByIdCourse({
            courseId: props.id,
            userId: user._id,
            accessToken: authStore.accessToken,
        })

        if (data.status == 'error') {
            error.value = data.message
        } else {
            lessonList.value = data.metadata
        }
    } catch (err) {
        error.value = err.response?.data
    }
}

onMounted(async () => {
    await fetchCourseDetails()
})
</script>

<template>
    <div v-if="isLoading" class="text-3xl font-bold">Loading.......</div>
    <div v-else>
        <div v-if="error">{{ error }}</div>
        <div v-else>
            <div class="container mx-auto max-w-7xl p-4">
                <div class="">
                    <div class="w-full text-center">
                        <div class="flex justify-center">
                            <ul
                                class="text-center border-2 px-10 sm:px-40 py-4 rounded-lg"
                            >
                                <router-link
                                    v-for="(lesson, index) in lessonList"
                                    :key="lesson.lesson_id"
                                    :to="{
                                        name: 'LessonHina',
                                        params: {
                                            id: lesson.lesson_id,
                                            course_id: props.id,
                                        },
                                    }"
                                    @click="
                                        lesson._id &&
                                            courseStore.setLastLessonView(
                                                lesson._id,
                                            )
                                    "
                                    class="*:hover:cursor-pointer *:border-[1px] *:border-slate-400 hover:*:border-slate-300 *:shadow-md hover:*:shadow-slate-400 *:p-4 *:mb-4 *:rounded-full *:text-lg *:font-semibold hover:*:transition-all *:transition-all"
                                >
                                    <li
                                        :class="
                                            lesson.learnt
                                                ? 'bg-green-400 '
                                                : 'bg-[#ccc] hover:bg-[#eee]'
                                        "
                                    >
                                        Bài {{ index + 1 }}:
                                        {{ lesson.lesson_title }}
                                    </li>
                                </router-link>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
