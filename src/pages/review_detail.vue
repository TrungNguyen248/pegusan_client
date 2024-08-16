<script setup>
import moment from 'moment'
import 'moment/locale/vi'
moment.locale('vi')
import { useAuthStore } from '../stores/auth'
import { onMounted, ref, computed, watch } from 'vue'
import axios from 'axios'
import FlipCard from '../base_components/Card/FlipCard.vue'
import NextHeliumIcon from '../components/Icons/next_helium.vue'
import BackIcon from '../components/Icons/back.vue'

const props = defineProps({
    id: {
        type: String,
    },
})

const isLoading = ref(true)
const end = ref(false)

const level = ref([
    { 0: 'Đã thuộc', color: 'hover:bg-green-600/80' },
    { 1: '1 Ngày', color: 'hover:bg-red-600/80' },
    { 2: '3 Ngày', color: 'hover:bg-red-500/80' },
    { 3: '7 Ngày', color: 'hover:bg-red-400/80' },
    { 4: '14 Ngày', color: 'hover:bg-yellow-600/80' },
    { 5: '30 Ngày', color: 'hover:bg-green-500/80' },
])
const listFlcards = ref({})
const deckTitle = ref('')
const currentCardIndex = ref(0)
const isShowListWord = ref(false)

const authStore = useAuthStore()
const user = authStore.user

async function fetchFlashCardByDeckId() {
    try {
        const res = await axios.post(
            'http://localhost:5000/v1/api/flashcard/all_by_deck',
            { deck_id: props.id },
            {
                headers: {
                    'x-api-key':
                        'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61',
                    'x-client-id': user._id,
                    authorization: authStore.accessToken,
                },
            },
        )
        isLoading.value = false
        listFlcards.value = res.data.metadata.flashcard
        deckTitle.value = res.data.metadata.deck_title
        console.log(moment().week())
    } catch (error) {}
}

async function updateFlCard(fl_id, level) {
    await axios.patch(
        `http://localhost:5000/v1/api/flashcard/${fl_id}`,
        {
            level: level,
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
    nextCard()
}
const currentCard = computed(() => {
    return listFlcards.value[currentCardIndex.value]
})

function showListWord() {
    isShowListWord.value = !isShowListWord.value
}

function nextCard() {
    if (currentCardIndex.value < listFlcards.value.length - 1) {
        currentCardIndex.value++
    } else {
        end.value = true
    }
}

function backCard() {
    if (currentCardIndex.value > 0) {
        currentCardIndex.value--
    }
}

onMounted(async () => {
    await fetchFlashCardByDeckId()
})
</script>

<template>
    <div v-if="isLoading"></div>
    <div v-else>
        <div class="container mx-auto max-w-7xl py-10 mt-[72px] min-h-[100svh]">
            <p class="text-2xl text-black font-bold px-10 py-4">
                {{ deckTitle }}
            </p>
            <div class="mt-10 flex">
                <div class="flex lg:w-[70%] w-full">
                    <div class="w-full">
                        <div class="w-full">
                            <div class="px-4 flex justify-end">
                                <button
                                    v-if="!isShowListWord"
                                    @click="showListWord()"
                                    class="text-black py-2 px-3 rounded-xl hover:bg-[#153448] hover:text-white transition-all border-2 font-bold"
                                >
                                    Danh sách từ
                                </button>
                                <button v-else @click="showListWord()">
                                    <BackIcon
                                        class="w-10 h-[40px]"
                                        color="#000000"
                                    />
                                </button>
                            </div>
                            <div v-if="isShowListWord">
                                <div class="w-full p-10">
                                    <table class="table-auto w-full">
                                        <thead>
                                            <tr
                                                class="*:text-black *:pl-3 *:text-lg border-2 border-black *:py-2"
                                            >
                                                <th class="text-left">Thẻ</th>
                                                <th class="text-left">
                                                    Ngày ôn tập
                                                </th>
                                                <th class="text-left"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                class="transition-all *:text-lg *:pl-3 *:py-2 border-2 *:text-black border-black hover:bg-[#153448] *:hover:text-white"
                                                v-for="(
                                                    word, idx
                                                ) in listFlcards"
                                                :key="idx"
                                            >
                                                <td>
                                                    {{ word.vocab.word }}
                                                </td>
                                                <td class="font-medium">
                                                    {{
                                                        moment(
                                                            word.reviewDate,
                                                        ).format('L')
                                                    }}
                                                </td>
                                                <td
                                                    class="flex justify-center font-medium"
                                                >
                                                    <button
                                                        class="hover:text-red-400"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-else>
                                <p
                                    class="p-2 text-center font-bold text-sm text-red-400"
                                >
                                    Lưu ý: Phải chọn số ngày sẽ học lại để
                                    chuyển đến thẻ tiếp theo!
                                </p>
                                <div class="flex justify-center py-4">
                                    <div
                                        class="px-2 text-black flex-wrap w-full sm:w-1/2 flex"
                                    >
                                        <div
                                            v-for="(lv, idx) in level"
                                            :key="idx"
                                            class="cursor-pointer select-none w-1/3 text-sm flex py-1 px-1 justify-center font-medium"
                                            @click="
                                                updateFlCard(
                                                    currentCard._id,
                                                    idx,
                                                )
                                            "
                                        >
                                            <div
                                                :class="lv.color"
                                                class="transition-all rounded-lg border-2 border-black py-2 w-full text-center"
                                            >
                                                <button class="">
                                                    {{ lv[idx] }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="relative w-full flex h-[470px]">
                                    <div
                                        class="h-[40px] left-5 top-2 sm:flex absolute z-10 sm:h-[100%] items-center sm:left-[18%]"
                                    >
                                        <button @click="backCard()">
                                            <NextHeliumIcon
                                                class="w-9 h-[36px] rotate-180"
                                            />
                                        </button>
                                    </div>
                                    <div
                                        v-for="(fl, idx) in listFlcards"
                                        :key="idx"
                                        class="w-full absolute flex justify-center"
                                    >
                                        <FlipCard
                                            v-if="currentCardIndex == idx"
                                            class=""
                                        >
                                            <template #front>
                                                <div
                                                    class="cursor-pointer flex text-white flex-col items-center h-[100%] justify-center"
                                                >
                                                    <p
                                                        class="px-3 text-xl sm:text-2xl font-medium text-center mb-2"
                                                    >
                                                        {{ fl.vocab.kanji }}
                                                    </p>
                                                    <p
                                                        class="px-3 text-xl font-medium text-center"
                                                    >
                                                        {{ fl.vocab.word }}
                                                    </p>
                                                    <p
                                                        class="absolute bottom-20 px-3 text-sm font-medium"
                                                    >
                                                        Romanji:
                                                        {{ fl.vocab.kana }}
                                                    </p>
                                                </div>
                                            </template>
                                            <template #back>
                                                <div
                                                    class="cursor-pointer flex justify-center items-center h-[100%]"
                                                >
                                                    <p
                                                        class="font-medium text-xl px-2 text-center"
                                                    >
                                                        {{ fl.vocab.meaning }}
                                                    </p>
                                                </div>
                                            </template>
                                        </FlipCard>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hidden lg:block lg:w-[30%]"></div>
            </div>
            <div class="h-[500px]"></div>
        </div>
    </div>
</template>
