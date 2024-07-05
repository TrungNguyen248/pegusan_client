// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const accessToken = ref(localStorage.getItem('accessToken') || null)
    const refreshToken = ref(localStorage.getItem('refreshToken') || null)

    function setTokens(authUserData) {
        user.value = authUserData.user
        accessToken.value = authUserData.tokens.accessToken
        refreshToken.value = authUserData.tokens.refreshToken
        localStorage.setItem('user', JSON.stringify(authUserData.user))
        localStorage.setItem('accessToken', authUserData.tokens.accessToken)
        localStorage.setItem('refreshToken', authUserData.tokens.refreshToken)
    }

    function clearTokens() {
        user.value = null
        accessToken.value = null
        refreshToken.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    return { user, accessToken, refreshToken, setTokens, clearTokens }
})
