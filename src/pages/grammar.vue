<script setup>
import { defineProps, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
    level: {
        type: String,
    },
})

const isLoading = ref(true)
const listGrammar = ref([])
const isVisible = ref(false)
const currentGrammarIndex = ref(0)

const authStore = useAuthStore()
const user = authStore.user

async function fetchGrammarByLevel(level = 'N5') {
    try {
        const res = await axios.post(
            `http://localhost:5000/v1/api/grammar/${props.level ? props.level : level}`,
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
        listGrammar.value = res.data.metadata
        isLoading.value = false
    } catch (error) {
        console.log(error)
    }
}

const currentGrammar = computed(
    () => listGrammar.value[currentGrammarIndex.value],
)

function showGrammar(index) {
    currentGrammarIndex.value = index
    isVisible.value = true
}

function closeGrammar() {
    isVisible.value = false
}

onMounted(async () => {
    await fetchGrammarByLevel()
})
</script>

<template>
    <p v-if="isLoading">Loading .....</p>
    <div v-else>
        <div
            v-if="isVisible"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
            <div
                class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
            >
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                        >
                            <h3
                                class="text-lg leading-6 font-medium text-gray-900"
                            >
                                {{ currentGrammar.title }}
                            </h3>
                            <p>{{ currentGrammar.structure }}</p>
                            <p>{{ currentGrammar.mean }}</p>
                            <p>{{ currentGrammar.explain }}</p>
                            <div
                                v-for="(
                                    example, index
                                ) in currentGrammar.examples"
                                :key="index"
                            >
                                <span>{{ index + 1 }}. </span>
                                <ruby v-html="example.ja"></ruby>
                                <p>{{ example.vi }}</p>
                            </div>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Abcontinue</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="closeGrammar"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
        <div class="container mx-auto max-w-7xl flex py-10">
            <div class="grid grid-cols-3 gap-6 w-3/4 px-10">
                <div v-for="(grammar, index) in listGrammar" :key="index">
                    <div
                        class="bg-slate-400 p-3 rounded-md text-center"
                        @click="showGrammar(index)"
                    >
                        <p>{{ grammar.title }}</p>
                        <p>{{ grammar.mean }}</p>
                    </div>
                </div>
            </div>
            <div class="w-1/4 bg-slate-400 rounded-xl"></div>
        </div>
    </div>
</template>
