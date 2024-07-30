<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/course'
import KanjivgAnimate from '../assets/js/KanjivgAnimate.min.js'
import FlashcardIcon from '../components/Icons/flashcard.vue'
import NextHeliumIcon from '../components/Icons/next_helium.vue'
import BackIcon from '../components/Icons/back.vue'
import FlipCard from '../base_components/Card/FlipCard.vue'
import BaseCard from '../base_components/Card/BaseCard.vue'
import ListIcon from '../components/Icons/list.vue'
import FormInput from '../base_components/Form/FormInput.vue'
import AddIcon from '../components/Icons/add.vue'
import CancelIcon from '../components/Icons/cancel.vue'
import ListAddIcon from '../components/Icons/list_add.vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    course_id: {
        type: String,
        required: true,
    },
})

const grammars = ref(null)
const vocabs = ref(null)
const kaiwas = ref(null)
const isLoading = ref(true)
const svgContent = ref([])
const elSvg = ref(null)
const elSvg1 = ref(null)
const isVisible = ref(false)
const currentCardIndex = ref(0)
const end = ref(false)
const isShowFlc = ref(false)
const currentContent = ref('')
const isShowCreateList = ref(false)
const nameDeck = ref('')
const listDeck = ref(null)
const textErrCheckDeck = ref('')
const isLoadingList = ref(false)
const listTitle = ref([])
const isShowCheckAddList = ref(false)
const isCheckAdd = ref(false)
const listChecked = ref({})

const authStore = useAuthStore()
const user = authStore.user

const progress = computed(() => {
    return (currentCardIndex.value / wordList.value.length) * 100
})

const currentCard = computed(() => {
    return vocabs.value[currentCardIndex.value]
})

function nextCard() {
    if (currentCardIndex.value < vocabs.value.length - 1) {
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

async function showKanji(arrHex) {
    svgContent.value = []
    isVisible.value = true
    Promise.all(
        arrHex.map(async (h) => {
            try {
                const res = await axios.post(
                    'http://localhost:5000/v1/api/kanji/svg',
                    {
                        kanji: h,
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
                hanlderSvgContent(res.data.metadata)
                await nextTick()
                addClassSvg()
            } catch (error) {}
        }),
    )
}

function hanlderSvgContent(svgData) {
    const startIndex = svgData.indexOf('<svg')
    const endIndex = svgData.indexOf('</svg>') + '</svg>'.length
    const svgStr = svgData.substring(startIndex, endIndex)
    svgContent.value.push(svgStr) //svgContent
}

function addClassSvg() {
    let els = elSvg.value.querySelectorAll('svg')
    let els1 = elSvg1.value.querySelectorAll('svg')
    els1.forEach((el) => {
        el.classList = ['kanjiVG']
        new KanjivgAnimate('.kanjiVG', 600)
        el.setAttribute('width', 230)
        el.setAttribute('height', 230)
        document.querySelectorAll('.kanjiVG path').forEach((path) => {
            const newStrokeWidth = 4
            path.setAttribute('stroke-width', newStrokeWidth)
        })
    })
    els.forEach((el) => {
        el.classList = ['kanjiVG']
        new KanjivgAnimate('.kanjiVG', 600)
        el.setAttribute('width', 230)
        el.setAttribute('height', 230)
        document.querySelectorAll('.kanjiVG path').forEach((path) => {
            const newStrokeWidth = 4
            path.setAttribute('stroke-width', newStrokeWidth)
        })
    })
}

async function fetchLessonContent() {
    try {
        const res = await axios.post(
            `http://localhost:5000/v1/api/lesson/${props.id}`,
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

        isLoading.value = false
        nameDeck.value = `${res.data.metadata.lesson_title} - ${res.data.metadata.course.name}`
        grammars.value = res.data.metadata.contents.grammar
        kaiwas.value = res.data.metadata.contents.kaiwa
        vocabs.value = res.data.metadata.contents.vocabulary
    } catch (error) {
        console.log(error)
    }
}

function closeKjModal() {
    svgContent.value = []
    isVisible.value = false
}

function showFlc() {
    isShowFlc.value = true
}

function handleKeyUp(event) {
    if (event.key === 'ArrowRight') {
        nextCard()
    } else if (event.key === 'ArrowLeft') {
        backCard()
    }
}

function backToList() {
    isShowFlc.value = false
}

function currContent(value) {
    if (value === 'vc' || value === 'gr' || value === 'kw') {
        currentContent.value = value
    } else {
        console.log('Error')
    }
}

function showCreateList() {
    isShowCreateList.value = true
}

function closeCreateModal() {
    isShowCreateList.value = false
}

function showCheckAddList() {
    isShowCheckAddList.value = !isShowCheckAddList.value
}

function handleCheckAdd(current_id, idx) {
    listChecked.value[idx] = current_id
}

function removeFromCheckList(idx) {
    delete listChecked.value[idx]
}

async function addListName() {
    try {
        const res = await axios.post(
            'http://localhost:5000/v1/api/flashcard/',
            {
                deck_title: nameDeck.value.trim(),
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
        closeCreateModal()
        await fetchListName()
    } catch (e) {
        console.log(e)
    }
}

async function fetchListName() {
    try {
        isLoadingList.value = true
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
        isLoadingList.value = false
        for (let i = 0; i < listDeck.value.length; i++) {
            if (nameDeck.value.trim() === listDeck.value[i].deck_title.trim()) {
                textErrCheckDeck.value = 'Thư mục đã tồn tại!'
            }
        }

        listTitle.value = listDeck.value.map((deck) => {
            return deck.deck_title
        })
    } catch (e) {
        console.log(e)
        if (e.response?.data.code === 404) {
            listDeck.value = []
            isLoadingList.value = false
        }
    }
}

// const titleList = computed(() => {
//     console.log(listDeck.value)
//     return listDeck.value.map((deck) => {
//         return deck.deck_title
//     })
// })

onMounted(async () => {
    await fetchLessonContent()
    await fetchListName()
    currentContent.value = 'vc' //Tag từ vựng
    window.addEventListener('keyup', handleKeyUp)
})
watch(
    () => nameDeck.value,
    (newNameDeck, oldNameDeck) => {
        if (listTitle.value.length > 0) {
            if (listTitle.value.includes(newNameDeck)) {
                textErrCheckDeck.value = 'Thư mục đã tồn tại!'
            } else {
                textErrCheckDeck.value = ''
            }
        }
    },
)
onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
    <div v-if="isLoading">
        <p>Loading..........</p>
    </div>
    <div v-else>
        <div class="container mx-auto max-w-7xl mt-[72px]">
            <div class="flex">
                <div class="lg:w-[70%] w-full px-2 sm:pl-20 flex flex-col">
                    <div class="flex justify-between mt-10 border-b-2 w-full">
                        <div
                            @click="currContent('vc')"
                            :class="
                                currentContent === 'vc'
                                    ? 'bg-[#3c5b6f] h-[108%] sm:h-[103%]'
                                    : 'bg-[#153448]'
                            "
                            class="border-t-2 border-l-2 border-r-2 rounded-t-lg p-1 sm:p-3 w-1/3 hover:cursor-pointer transition-colors"
                        >
                            <p
                                class="text-center font-medium text-white text-base sm:text-lg"
                            >
                                Từ vựng
                            </p>
                        </div>
                        <div
                            :class="
                                currentContent === 'gr'
                                    ? 'bg-[#3c5b6f] h-[108%] sm:h-[103%]'
                                    : 'bg-[#153448]'
                            "
                            @click="currContent('gr')"
                            class="border-t-2 border-l-2 border-r-2 mx-2 p-1 sm:p-3 rounded-t-lg w-1/3 hover:cursor-pointer transition-colors"
                        >
                            <p
                                class="text-center font-medium text-white text-base sm:text-lg"
                            >
                                Ngữ pháp
                            </p>
                        </div>
                        <div
                            :class="
                                currentContent === 'kw'
                                    ? 'bg-[#3c5b6f] h-[108%] sm:h-[103%] '
                                    : 'bg-[#153448]'
                            "
                            @click="currContent('kw')"
                            class="border-t-2 border-l-2 border-r-2 rounded-t-lg p-1 sm:p-3 w-1/3 hover:cursor-pointer transition-colors"
                        >
                            <p
                                class="text-center font-medium text-white text-base sm:text-lg"
                            >
                                Kaiwa
                            </p>
                        </div>
                    </div>
                    <div
                        v-if="currentContent === 'vc'"
                        class="lg:p-4 lg:border-b-2 lg:border-x-2"
                    >
                        <div
                            v-if="isShowCreateList"
                            class="fixed p-4 left-1/2 rounded-b-xl -translate-x-[50%] h-[200px] w-full sm:w-[480px] animate-transform-top flex flex-col items-center inset-0 bg-white z-50"
                        >
                            <p
                                class="px-3 py-1 text-left w-full text-[#153448] font-medium"
                            >
                                Tên thư mục ôn tập:
                            </p>
                            <form @submit.prevent="addListName">
                                <FormInput
                                    type="text"
                                    class="block text-[#153448] text-base font-medium px-4 py-3 min-w-[350px]"
                                    placeholder="Nhập tên danh sách"
                                    required
                                    v-model="nameDeck"
                                />
                                <div
                                    v-if="textErrCheckDeck !== ''"
                                    class="w-full text-center"
                                >
                                    <p class="text-red-400 font-bold">
                                        {{ textErrCheckDeck }}
                                    </p>
                                </div>
                                <div class="flex justify-end">
                                    <button
                                        :disabled="
                                            textErrCheckDeck !== ''
                                                ? true
                                                : false
                                        "
                                        :class="
                                            textErrCheckDeck !== ''
                                                ? 'bg-gray-400/40 cursor-not-allowed'
                                                : 'bg-[#e8c9af]'
                                        "                                                   
                                        type="submit"
                                        class="mt-5 text-[#153448] px-5 py-2 rounded-full cursor-pointer font-medium"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </form>
                            <div
                                class="absolute top-0 right-0 hover:cursor-pointer"
                                @click="closeCreateModal()"
                            >
                                <BackIcon
                                    class="w-10 h-[40px]"
                                    color="#153448"
                                />
                            </div>
                        </div>
                        <div class="flex w-full justify-end p-4">
                            <div
                                v-if="!isShowFlc"
                                class="lg:hidden hover:cursor-pointer flex flex-col justify-center items-center"
                                title="List từ ôn tập"
                                @click="showCreateList()"
                            >
                                <ListIcon
                                    class="w-8 h-[32px]"
                                    color="#e8c9af"
                                />
                                <p
                                    class="select-none font-medium text-sm text-[#e8c9af]"
                                >
                                    Từ ôn tập
                                </p>
                            </div>
                            <div
                                v-if="!isShowFlc"
                                class="hover:cursor-pointer flex flex-col justify-center items-center ml-4"
                                title="Flashcard"
                                @click="showFlc()"
                            >
                                <FlashcardIcon
                                    class="w-8 h-[32px]"
                                    color="#e8c9af"
                                />
                                <p
                                    class="select-none font-medium text-sm text-[#e8c9af]"
                                >
                                    Flashcard
                                </p>
                            </div>
                            <div
                                v-else
                                class="hover:cursor-pointer flex flex-col justify-center items-center"
                                title="Trở về"
                                @click="backToList()"
                            >
                                <BackIcon class="w-10" color="#153448" />
                            </div>
                            <div
                                v-if="!isShowFlc"
                                class="flex flex-col items-center ml-4"
                                @click="showCheckAddList()"
                            >
                                <ListAddIcon
                                    class="w-8 h-[32px]"
                                    color="#e8c9af"
                                />
                                <p
                                    class="select-none font-medium text-sm text-[#e8c9af]"
                                >
                                    Lưu từ
                                </p>
                            </div>
                        </div>
                        <div v-if="isShowFlc" class="w-full lg:px-10">
                            <p
                                v-if="currentCardIndex == 0"
                                class="hidden sm:block text-white text-center font-medium"
                            >
                                "Có thể chuyển thẻ bằng cách ấn -> hoặc <-"
                            </p>
                            <div
                                v-touch:swipe.right="backCard"
                                v-touch:swipe.left="nextCard"
                                class="flex items-center justify-center h-[100%] lg:p-10"
                            >
                                <div
                                    class="hidden lg:block hover:cursor-pointer cursor-pointer rotate-180"
                                    @click="backCard()"
                                >
                                    <NextHeliumIcon class="w-8 h-[32px]" />
                                </div>

                                <BaseCard class="relative">
                                    <div
                                        class="flex flex-col items-center *:text-white"
                                    >
                                        <h2
                                            class="text-3xl sm:text-6xl px-3 text-center"
                                        >
                                            {{ currentCard?.kanji }}
                                        </h2>
                                        <h3
                                            class="text-xl sm:text-2xl mt-10 px-3 text-center"
                                        >
                                            {{ currentCard.word }}
                                        </h3>
                                        <h3
                                            class="px-3 text-center text-xl mt-3"
                                        >
                                            {{ currentCard.meaning }}
                                        </h3>
                                        <p
                                            v-if="currentCard.kana"
                                            class="absolute bottom-10 text-sm"
                                        >
                                            Romanji: {{ currentCard.kana }}
                                        </p>
                                    </div>
                                    <p
                                        v-if="currentCardIndex == 0"
                                        class="sm:hidden absolute bottom-0 text-white text-medium text-sm"
                                    >
                                        <<< Vuốt sang trái để tiếp tục
                                    </p>
                                </BaseCard>

                                <div
                                    class="hidden lg:block hover:cursor-pointer cursor-pointer"
                                    @click="nextCard()"
                                    @keyup.right="nextCard"
                                >
                                    <NextHeliumIcon class="w-8 h-[32px]" />
                                </div>
                            </div>
                        </div>

                        <table
                            v-if="!isShowFlc"
                            class="hidden sm:block table-auto"
                        >
                            <thead>
                                <tr
                                    class="*:text-white *:pl-3 *:text-lg border-2 border-[#ccc]/30 *:py-2"
                                >
                                    <th class="text-left">Từ vựng</th>
                                    <th class="text-left">Kanji</th>
                                    <th class="text-left">Nghĩa</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    class="*:text-lg *:pl-3 *:py-2 border-2 *:text-white border-[#ccc]/30 hover:bg-[#0C1844]/70"
                                    v-for="(item, idx) in vocabs"
                                    :key="idx"
                                >
                                    <td>
                                        {{ item.word }}
                                    </td>
                                    <td>
                                        <button
                                            class="hover:underline hover:text-green-400"
                                            @click="showKanji(item.hex_string)"
                                        >
                                            {{ item.kanji }}
                                        </button>
                                    </td>
                                    <td>{{ item.meaning }}</td>
                                    <td v-if="isShowCheckAddList">
                                        <div
                                            class="hover:cursor-pointer cursor-pointer"
                                        >
                                            <AddIcon
                                                @click="
                                                    handleCheckAdd(
                                                        item._id,
                                                        idx,
                                                    )
                                                "
                                                v-if="!listChecked[idx]"
                                                color="#33d17a"
                                                class="w-8 h-[32px]"
                                            />
                                            <CancelIcon
                                                v-if="listChecked[idx]"
                                                color="#e01b24"
                                                class="w-8 h-[32px]"
                                                @click="
                                                    removeFromCheckList(idx)
                                                "
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="!isShowFlc" class="sm:hidden">
                            <div
                                v-for="(item, idx) in vocabs"
                                :key="idx"
                                class="border-2 bg-[#153448] rounded-lg *:text-white mb-4 px-2 py-4"
                            >
                                <div class="text-center text-xl">
                                    <p>{{ item.word }}</p>
                                    <div
                                        v-if="item.kana"
                                        class="mt-1 text-sm item-center"
                                    >
                                        <p>({{ item.kana }})</p>
                                    </div>
                                </div>
                                <div
                                    v-if="item.kanji"
                                    class="flex mt-1 text-lg"
                                >
                                    <span class="mr-2 font-medium">Kanji:</span>
                                    <button
                                        class="hover:underline hover:text-green-400"
                                        @click="showKanji(item.hex_string)"
                                    >
                                        {{ item.kanji }}
                                    </button>
                                </div>
                                <div class="flex mt-1 items-center text-lg">
                                    <span class="mr-2 font-medium"
                                        >Nghĩa:
                                    </span>
                                    <span>{{ item.meaning }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="currentContent === 'gr'" class="lg:p-4">
                        <p>Hiện chưa có nội dung cho ngữ pháp</p>
                    </div>
                    <div v-if="currentContent === 'kw'" class="lg:p-4">
                        <p>Hiện chưa có nội dung cho kaiwa</p>
                    </div>
                </div>
                <div class="hidden mt-16 lg:block lg:w-[30%]">
                    <div
                        v-if="isVisible"
                        class="customs_scroll top-[72px] fixed overflow-auto w-[30%] h-[600px] bg-[#3c5b6f]"
                    >
                        <div class="fixed right-3 mt-10 p-2">
                            <button
                                @click="closeKjModal()"
                                class="w-8 h-[32px] bg-[#e8c9af] rounded-full font-bold"
                            >
                                X
                            </button>
                        </div>
                        <div
                            v-if="!isShowFlc && currentContent === 'vc'"
                            class="lg:flex flex-col pt-32 items-center"
                            ref="elSvg"
                        >
                            <div
                                v-for="(svg, i) in svgContent"
                                :key="i"
                                class="mb-10"
                            >
                                <div
                                    class="cursor-pointer *:select-none hover:cursor-pointer bg-svg-background bg-cover border-2 rounded-2xl bg-white font-bold mb-4"
                                    v-html="svg"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div class="px-4">
                        <div
                            class="border-2 py-2 flex items-center justify-between"
                        >
                            <div class="flex">
                                <span class="px-2">
                                    <ListIcon class="w-6 h-[24px]" />
                                </span>
                                <p class="text-base font-medium text-white">
                                    Thư mục ôn tập từ của bạn
                                </p>
                            </div>
                            <div @click="showCreateList()" class="p-2 bg-white">
                                +
                            </div>
                        </div>
                        <div v-if="isLoadingList">Loading.....</div>
                        <div v-else>
                            <div
                                v-if="listDeck == null || listDeck.length == 0"
                            >
                                <p class="text-white text-sm mt-6">
                                    Bạn chưa có thư mục nào.
                                    <span
                                        @click="showCreateList()"
                                        class="underline font-bold cursor-pointer hover:text-[#e8c9af]"
                                        >-> Thêm mới <-</span
                                    >
                                </p>
                            </div>

                            <div v-else>
                                <div v-for="(deck, idx) in listDeck" :key="idx">
                                    <div
                                        class="transition-all hover:transition-all rounded-lg hover:cursor-pointer hover:border-[#fff] border-[#153448] border-2 hover:text-white hover:bg-[#153448]/80 px-2 py-3 text-[#e8c9af] bg-[#153448] mt-2 font-medium flex justify-between"
                                    >
                                        <p>{{ deck.deck_title }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="currentContent === 'vc'"
                    class="overflow-x-scroll lg:hidden fixed flex flex-col items-center inset-0 bg-opacity-75 bg-gray-500/40 z-50"
                    @click.self="closeKjModal()"
                    :class="!isVisible ? 'hidden' : ''"
                    ref="elSvg1"
                >
                    <div
                        v-for="(svg, i) in svgContent"
                        :key="i"
                        class="mt-4 mb-5"
                    >
                        <div
                            class="cursor-pointer *:select-none hover:cursor-pointer bg-svg-background bg-cover w-[230px] h-[230px] border-2 rounded-2xl bg-white font-bold ml-4"
                            v-html="svg"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.customs_scroll::-webkit-scrollbar {
    width: 6px;
}

.customs_scroll::-webkit-scrollbar-track {
    background-color: #e8c9af;
}
.customs_scroll::-webkit-scrollbar-thumb {
    background-image: linear-gradient(-45deg, #153448, #153448);
    border-radius: 50px;
}
</style>
