<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/course'
import courseApi from '../api/course'
import LoaderGif from '../base_components/Loader/Loader.vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const lessonList = ref({})
const error = ref(null)
const isLoading = ref(true)
const typeLesson = ref('')
const nameCourse = ref('')

const authStore = useAuthStore()
const user = authStore.user
const courseStore = useCourseStore()

async function fetchCourseDetails() {
    typeLesson.value = ''
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
            setTimeout(() => {
                isLoading.value = false
            }, 2000)
            lessonList.value = data.metadata.listLessons
            typeLesson.value = data.metadata.type
            nameCourse.value = data.metadata.course.name
        }
    } catch (err) {
        error.value = err.response?.data
        console.log(err)
    }
}

onMounted(async () => {
    await fetchCourseDetails()
})
</script>

<template>
    <div
        v-if="isLoading"
        class="relative h-[100svh] flex justify-center bg-[#BED1CF] items-center z-[100]"
    >
        <LoaderGif class="w-56 h-[104px]" />
    </div>
    <div v-else>
        <div v-if="error">{{ error }}</div>
        <div v-if="typeLesson == 'Hina'">
            <div class="container mx-auto max-w-7xl mt-[72px]">
                <p
                    class="text-lg flex w-full lg:w-auto justify-center sm:justify-start px-5 py-3 fixed text-black sm:text-2xl max-w-7xl font-bold z-40 lg:bg-transparent bg-[#FFF7F1]"
                >
                    {{ nameCourse }}
                </p>
            </div>
            <div class="container mx-auto max-w-7xl p-4 mt-[72px]">
                <div class="py-5 sm:flex mt-10">
                    <div class="relative z-10 w-full text-center">
                        <div class="flex justify-center">
                            <ul
                                class="text-center sm:px-40 py-4 lg:py-10 rounded-lg"
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
                                    class="*:hover:cursor-pointer *:px-12 *:py-4 *:mb-4 *:rounded-2xl *:text-lg *:font-medium hover:*:transition-all *:transition-all"
                                >
                                    <li
                                        :class="
                                            lesson.learnt
                                                ? 'bg-green-400 '
                                                : 'bg-[#BED1CF] hover:bg-[#FFE4C9]'
                                        "
                                    >
                                        Bài {{ index + 1 }}:
                                        {{ lesson.lesson_title }}
                                    </li>
                                </router-link>
                            </ul>
                        </div>
                    </div>
                    <div
                        class="hidden lg:block fixed container mx-auto max-w-7xl p-4"
                    >
                        <img
                            class="absolute left-0 top-0 w-[350px] rounded-2xl border-2 border-[#BED1CF]"
                            src="https://i.pinimg.com/originals/07/bc/91/07bc918c16eec88302e32aff39b3b0a8.jpg"
                        />

                        <img
                            class="absolute right-0 top-0 w-[350px] rounded-2xl opacity-85 border-2 border-[#BED1CF]"
                            src="https://i.pinimg.com/originals/e2/a0/32/e2a0329de59d6adde61c6387e49d323e.jpg"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="typeLesson == 'Mina'">
            <div class="container mx-auto max-w-7xl mt-[72px]">
                <p
                    class="text-lg flex w-full lg:w-auto justify-center sm:justify-start px-5 py-3 fixed sm:relative text-black sm:text-2xl max-w-7xl font-bold z-40 lg:bg-transparent bg-[#FFF7F1]"
                >
                    {{ nameCourse }}
                </p>
            </div>
            <div class="container mx-auto max-w-7xl p-4">
                <div class="py-4 px-4 sm:py-8 sm:px-20 flex flex-col mt-10">
                    <div class="sm:w-1/3 text-center">
                        <router-link
                            v-for="(ls, idx) in lessonList"
                            :key="idx"
                            :to="{
                                name: 'LessonMina',
                                params: {
                                    id: ls._id,
                                    course_id: props.id,
                                },
                            }"
                            class=""
                        >
                            <div
                                class="py-3 transition-all *:hover:text-white hover:transition-all bg-[#FEFAF6] mb-4 border-2 rounded-full border-black cursor-pointer hover:bg-[#153448]"
                            >
                                <p class="text-lg font-bold text-[#0C1844]">
                                    {{ ls.lesson_title }}
                                </p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
