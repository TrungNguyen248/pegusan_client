<script setup>
import { ref, provide } from 'vue'
import axios from 'axios'
import FormInput from '../base_components/Form/FormInput.vue'
import FormCheck from '../base_components/Form/FormCheck'
import Button from '../base_components/Button'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const form = ref({
    name: '',
    email: '',
    password: '',
})
const authStore = useAuthStore()
const user = ref({})
const error = ref(null) // error validation ==> :valid
const router = useRouter()

async function signup() {
    //axios call login api
    try {
        const res = await axios.post(
            'http://localhost:5000/v1/api/signup',
            {
                ...form.value,
            },
            {
                headers: {
                    'x-api-key':
                        'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
                    'Access-Control-Allow-Origin': '*',
                },
            },
        )

        authStore.setTokens(res.data.metadata)
        user.value = res.data.metadata
        error.value = null
        router.push({ name: 'Course' })
    } catch (err) {
        error.value = err.response?.data.message
        toast(error.value, {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
            toastClassName: '',
        }) // ToastOptions
    }
}
</script>

<template>
    <!-- BEGIN: Sign up Form -->
    <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
        <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
        >
            <h2
                class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left"
            >
                Đăng ký
            </h2>
            <div
                class="mt-2 text-center intro-x text-slate-400 xl:hidden"
            ></div>
            <form @submit.prevent="signup">
                <div class="mt-8 intro-x">
                    <FormInput
                        type="text"
                        class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                        placeholder="Tên tài khoản"
                        required
                        v-model="form.name"
                    />
                    <FormInput
                        type="text"
                        class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                        placeholder="Email"
                        required
                        v-model="form.email"
                    />
                    <FormInput
                        type="password"
                        class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                        placeholder="Mật khẩu"
                        required
                        v-model="form.password"
                    />
                </div>
                <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                    <router-link to="login" class="mr-3">
                        <Button
                            variant="'outline-primary'"
                            class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0 hover:bg-primary hover:text-white"
                        >
                            Đăng nhập
                        </Button>
                    </router-link>

                    <Button
                        type="submit"
                        variant="'outline-secondary'"
                        class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0 hover:bg-primary hover:text-white"
                    >
                        Đăng ký
                    </Button>
                </div>
            </form>
            <div
                class="mt-10 text-sm text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left"
            >
                Bằng cách bấm vào nút đăng ký, bạn đồng ý với chúng tôi
                <a class="text-primary dark:text-slate-200 font-medium" href="">
                    Điều khoản và Điều kiện
                </a>
                &
                <a class="text-primary dark:text-slate-200 font-medium" href="">
                    Chính sách bảo mật
                </a>
            </div>
        </div>
    </div>
    <!-- END: Sign up Form -->
</template>
