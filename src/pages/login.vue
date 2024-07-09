<script setup>
import { ref } from 'vue'
import axios from 'axios'
import FormInput from '../base_components/Form/FormInput.vue'
import FormCheck from '../base_components/Form/FormCheck'
import Button from '../base_components/Button'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const form = ref({
    email: '',
    password: '',
})
const authStore = useAuthStore()
const user = ref({})
const error = ref(null) // error validation ==> :valid
const router = useRouter()

async function login() {
    //axios call login api
    try {
        const res = await axios.post(
            'http://localhost:5000/v1/api/login',
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
    <!-- BEGIN: Login Form -->
    <div class="flex h-screen py-5 xl:h-auto xl:py-0 xl:my-0">
        <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
        >
            <div class="flex justify-center">
                <img
                    class="w-20 h-[80px] xl:hidden"
                    src="../assets/images/penguin-logo.svg"
                    alt="logo"
                />
            </div>
            <h2
                class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left"
            >
                Đăng nhập
            </h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
                Bắt đầu hành trình học tiếng Nhật!
            </div>
            <form @submit.prevent="login">
                <div class="mt-8 intro-x">
                    <FormInput
                        type="text"
                        class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                        placeholder="Email"
                        required
                        v-model="form.email"
                    />
                    <FormInput
                        type="password"
                        class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                        placeholder="Password"
                        required
                        v-model="form.password"
                    />
                </div>
                <div
                    class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm"
                >
                    <div class="flex items-center mr-auto">
                        <FormCheck.Input
                            id="remember-me"
                            type="checkbox"
                            class="mr-2 border"
                        />
                        <label
                            class="cursor-pointer select-none"
                            htmlFor="remember-me"
                        >
                            Ghi nhớ tài khoản
                        </label>
                    </div>
                    <a href="">Quên mật khẩu?</a>
                </div>
                <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                    <Button
                        type="submit"
                        variant="'primary'"
                        class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3 hover:bg-primary hover:text-white"
                    >
                        Đăng nhập
                    </Button>
                    <router-link to="signup">
                        <Button
                            variant="'outline-secondary'"
                            class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0 hover:bg-primary hover:text-white"
                        >
                            Đăng ký
                        </Button>
                    </router-link>
                </div>
            </form>
            <div
                class="mt-10 text-center text-sm intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left"
            >
                Bằng cách đăng nhập, bạn đồng ý với chúng tôi
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
    <!-- END: Login Form -->
</template>
