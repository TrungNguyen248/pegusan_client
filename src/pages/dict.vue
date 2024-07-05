<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const searchQuery = ref('')
const results_tracau = ref(null)
const results_gg = ref(null)
const isLoading = ref(false)

const authStore = useAuthStore()
const user = authStore.user

const search = async () => {
    isLoading.value = true
    const r = await axios.post(
        `http://localhost:5000/v1/api/trans/2/`,
        {
            text: searchQuery.value,
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
    console.log(r.data)
    if (r.data.tratu.length > 0) {
        for (const i in r.data) {
            if (r.data[i] !== []) {
                results_tracau.value = r.data[i][0].fields.fulltext
                isLoading.value = false
            }
        }
    } else {
        const res = await axios.post(
            `http://localhost:5000/v1/api/trans/1/`,
            {
                text: searchQuery.value,
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
        results_gg.value = res.data
        isLoading.value = false
    }
}
</script>

<template>
    <div class="flex flex-col items-center mt-10">
        <div class="flex w-1/2 mb-4">
            <input
                v-model="searchQuery"
                @keyup.enter="search"
                type="text"
                placeholder="Search..."
                class="flex-grow p-2 border border-gray-300 rounded-md"
            />
            <button
                @click="search"
                class="ml-2 p-2 bg-blue-500 text-white rounded-md"
            >
                Search
            </button>
        </div>
        <div v-if="isLoading">Searching ....</div>
        <div v-else class="w-1/2 mt-4">
            <div v-html="results_tracau"></div>
        </div>
    </div>
</template>
