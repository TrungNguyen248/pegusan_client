<script setup>
import { useAuthStore } from '../stores/auth'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref({})
const error = ref(null)
const isLoading = ref(true)

const authStore = useAuthStore()
const user = authStore.user

async function fetchCourseRegistered() {}

async function registerCourse(courseId) {
    await axios.post(
        'http://localhost:5000/v1/api/course/register',
        {
            courseId: courseId,
        },
        {
            headers: {
                'x-api-key':
                    'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
                'x-client-id': user._id,
                authorization: authStore.accessToken,
            },
        },
    )
}

async function fetchCourses() {
    try {
        const res = await axios.post(
            'http://localhost:5000/v1/api/course/all',
            {},
            {
                headers: {
                    'x-api-key':
                        'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
                    'x-client-id': user._id,
                    authorization: authStore.accessToken,
                },
            },
        )
        console.log(res.data.metadata)
        isLoading.value = false
        courses.value = res.data.metadata
    } catch (err) {
        error.value = err.response?.data
    }
}

onMounted(async () => {
    await fetchCourses()
})
</script>

<template>
    <div v-if="isLoading" class="text-center text-3xl font-bold">
        Loading.........
    </div>
    <div class="hidden container mx-auto max-w-7xl mt-20">
        <div class="grid md:grid-cols-3 gap-14 grid-cols-1"></div>
    </div>

    <section class="py-32">
        <div class="container mx-auto max-w-7xl">
            <div class="flex flex-wrap justify-center sm:justify-normal">
                <div
                    class="relative xl:w-1/3 sm:w-full md:w-1/2 p-4 flex flex-col rounded-2xl"
                    v-for="course in courses"
                    :key="course._id"
                >
                    <router-link
                        :to="{
                            name: 'CourseDetail',
                            params: { id: course._id },
                        }"
                        @click="
                            !course.registered && registerCourse(course._id)
                        "
                        class="relative text-gray-800 font-bold overflow-hidden object-cover rounded-t-2xl"
                    >
                        <div class=" ">
                            <img
                                class="w-full hover:scale-104 hover:transition-all transition-all"
                                src="../assets/images/course_test.jpg"
                            />
                        </div>
                    </router-link>
                    <div class="p-4 border-2 rounded-b-2xl">
                        <div class="font-bold">
                            <router-link
                                :to="{
                                    name: 'CourseDetail',
                                    params: { id: course._id },
                                }"
                                @click="
                                    !course.registered &&
                                        registerCourse(course._id)
                                "
                            >
                                <p class="text-xl">{{ course.name }}</p>
                            </router-link>
                        </div>
                        <div class="text-sm">
                            <p class="select-none">
                                Số người đang học (icon nguoi subscribe):
                                {{ course.stu_num || 0 }}
                            </p>
                            <p v-if="course.registered">Đã đăng ký</p>
                        </div>
                    </div>
                </div>

                <!-- aks -->
            </div>
        </div>
    </section>
</template>
