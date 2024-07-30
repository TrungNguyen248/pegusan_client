<script setup>
import { useAuthStore } from '../stores/auth'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import GroupUserIcon from '../components/Icons/group_user.vue'
import TickIcon from '../components/Icons/tick.vue'
import LoaderGif from '../base_components/Loader/Loader.vue'

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
        setTimeout(() => {
            isLoading.value = false
        }, 2000)
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
    <div
        v-if="isLoading"
        class="relative h-[100svh] flex justify-center bg-[#3C5B6F] items-center z-[100]"
    >
        <LoaderGif class="w-56 h-[104px]" />
    </div>
    <div v-else>
        <div class="container mx-auto max-w-7xl mt-[72px]">
            <div class="py-5 px-2 sm:py-10 lg:px-5 lg:ml-5">
                <p class="text-lg text-white font-bold">Danh sách khóa học</p>
            </div>
        </div>
        <div class="">
            <div class="container mx-auto max-w-7xl">
                <div class="flex flex-wrap justify-center sm:justify-normal">
                    <div
                        class="relative xl:w-1/3 w-full md:w-1/2 p-4 flex flex-col rounded-2xl"
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
                            <div class="w-full">
                                <img
                                    class="w-full max-h-[320px] object-cover hover:scale-104 hover:transition-all transition-all"
                                    :src="course.thumb"
                                />
                            </div>
                        </router-link>
                        <div
                            class="p-4 border-2 rounded-b-2xl border-[#fff5e1] bg-[#153448]"
                        >
                            <div class="text-white font-bold">
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
                                    <p class="text-lg">{{ course.name }}</p>
                                </router-link>
                            </div>
                            <div class="absolute py-4 top-1 right-[7%]">
                                <div
                                    class="flex justify-center items-center bg-white border-[1px] border-black rounded-full"
                                >
                                    <div class="mr-2 pl-2">
                                        <span>
                                            <GroupUserIcon
                                                class="w-7 h-[28px]"
                                            />
                                        </span>
                                    </div>
                                    <p class="text-sm pr-2 font-medium">
                                        {{ course.stu_num || 0 }}
                                    </p>
                                </div>
                            </div>
                            <div class="absolute p-5 top-0 left-0">
                                <p
                                    class="flex items-center border-2 border-black text-sm px-2 py-1 rounded-full bg-white"
                                    v-if="course.registered"
                                >
                                    <span class="mr-2">
                                        <TickIcon class="w-6 h-[24px]" />
                                    </span>
                                    <span class="text-black font-medium"
                                        >Đã đăng ký</span
                                    >
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- aks -->
                </div>
            </div>
        </div>
    </div>
</template>
