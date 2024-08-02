<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import LayoutFolderSvg from '../components/Icons/layout_folder.vue'

const isLoading = ref(true)

const listDeck = ref({})
const authStore = useAuthStore()
const user = authStore.user

async function fetchListName() {
    try {
        const res = await axios.post(
            'http://localhost:5000/v1/api/flashcard/all_deck',
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
        listDeck.value = res.data.metadata
        isLoading.value = false

        console.log(res.data.metadata)

        // listTitle.value = listDeck.value.map((deck) => {
        //     return deck.deck_title
        // })
    } catch (e) {
        console.log(e)
        if (e.response?.data.code === 404) {
            listDeck.value = []
            isLoading.value = false
        }
    }
}

onMounted(async () => {
    await fetchListName()
})
</script>

<template>
    <div v-if="isLoading"></div>
    <div v-else>
        <div class="container mx-auto max-w-7xl py-10 mt-[72px] min-h-[100svh]">
            <p class="text-2xl text-white font-bold px-10 py-4">
                Thư mục ôn tập của bạn
            </p>
            <div class="p-10 flex">
                <div class="flex flex-wrap lg:w-[70%] w-full">
                    <div
                        v-for="(it, idx) in listDeck"
                        :key="idx"
                        class="w-full sm:w-1/2 py-3 h-[300px]"
                    >
                        <div class="py-3 px-4 transition-all">
                            <div class="relative flex flex-col">
                                <div class="flex justify-center">
                                    <LayoutFolderSvg class="scale-[1.5]" />
                                </div>
                                <div>
                                    <p
                                        class="w-full px-10 absolute top-12 text-center text-white font-bold"
                                    >
                                        {{ it.deck_title }}
                                    </p>
                                </div>
                                <router-link
                                    :to="{
                                        name: 'ReviewDetail',
                                        params: { id: it._id },
                                    }"
                                    class="absolute bottom-5 right-12"
                                >
                                    <button
                                        class="text-white font-bold hover:text-[#e8c9af]"
                                    >
                                        Bắt đầu ôn tập
                                    </button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hidden lg:block lg:w-[30%]"></div>
            </div>
        </div>
    </div>
</template>
