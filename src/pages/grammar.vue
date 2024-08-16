<script setup>
import { defineProps, watch, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import NextPageIcon from '../components/Icons/next_page.vue'
import LoaderGif from '../base_components/Loader/Loader.vue'

const props = defineProps({
    level: {
        type: String,
        default: 'N5',
    },
    page: {
        type: String,
    },
})

const isLoading = ref(true)
const listGrammar = ref([])
const isVisible = ref(false)
const currentGrammarIndex = ref(0)
const totalGrammar = ref(0)
const textOption = ref('N5')
const listLevel = ref(['N5', 'N4', 'N3', 'N2', 'N1'])

const router = useRouter()
const authStore = useAuthStore()
const user = authStore.user

async function fetchGrammarByLevel(level = 'N5', page = 1) {
    try {
        const res = await axios.post(
            `http://localhost:5000/v1/api/grammar/${props.level ? props.level : level}/${props.page ? props.page : page}`,
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
        totalGrammar.value = res.data.metadata.count
        setTimeout(() => {
            isLoading.value = false
        }, 1700)
        listGrammar.value = res.data.metadata.grammars
    } catch (error) {
        console.log(error)
    }
}

const pagePagi = computed(() => {
    const arr = []
    const skip = 5
    if (totalPage.value < skip) {
        for (let i = 1; i <= totalPage.value; i++) {
            arr.push(i)
        }
    } else {
        if (props.page != null && props.page != '') {
            if (props.page / skip < totalListCount.value) {
                const start = Math.ceil(props.page / 5)
                if (start * skip < totalPage.value) {
                    for (let i = (start - 1) * skip; i < start * skip; i++) {
                        arr.push(i + 1)
                    }
                } else {
                    for (let i = (start - 1) * skip; i < totalPage.value; i++) {
                        arr.push(i + 1)
                    }
                }
            }
        } else {
            for (let i = 1; i <= 5; i++) {
                arr.push(i)
            }
        }
    }
    return arr
})

function nextPageList() {
    const numPage = Number.parseInt(props.page) || 1
    if (numPage < totalPage.value) {
        router.push({
            name: 'Grammar',
            params: {
                level: props.level || 'N5',
                page: numPage + 1,
            },
        })
    }
}

function previousPageList() {
    const numPage = Number.parseInt(props.page) || 1
    if (numPage > 1) {
        router.push({
            name: 'Grammar',
            params: {
                level: props.level || 'N5',
                page: numPage - 1,
            },
        })
    }
}

const currentGrammar = computed(
    () => listGrammar.value[currentGrammarIndex.value],
)

const totalPage = computed(() => Math.floor(totalGrammar.value / 12) + 1)

const totalListCount = computed(() => Math.ceil(totalPage.value / 5))

function showGrammar(index) {
    currentGrammarIndex.value = index
    isVisible.value = true
}

function closeGrammar() {
    isVisible.value = false
}

watch(
    () => props.level,
    async (newLv, oldLv) => {
        if (newLv !== oldLv) {
            await fetchGrammarByLevel()
            textOption.value = props.level == '' ? 'N5' : props.level
        }
    },
)

watch(
    () => props.page,
    async (newP, oldP) => {
        if (newP !== oldP) {
            await fetchGrammarByLevel()
        }
    },
)

onMounted(async () => {
    await fetchGrammarByLevel()
    textOption.value = props.level == '' ? 'N5' : props.level
})
</script>

<template>
    <div
        v-if="isLoading"
        class="relative h-[100svh] flex justify-center bg-[#BED1CF] items-center z-[100]"
    >
        <LoaderGif class="w-56 h-[104px]" />
    </div>
    <div v-else>
        <div
            v-if="isVisible"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
            @click.self="closeGrammar()"
        >
            <div
                class="customs_scroll overflow-y-auto bg-white h-[100%] sm:h-[90%] sm:w-full sm:max-w-3xl shadow-xl transform transition-all"
            >
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="">
                        <div
                            class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                        >
                            <div
                                class="border-2 rounded-2xl flex flex-col justify-center items-center py-4"
                            >
                                <h3
                                    class="text-xl text-center px-4 font-medium text-red-600"
                                >
                                    {{ currentGrammar.title }}
                                </h3>
                                <p class="text-lg font-medium text-[#153448]">
                                    {{ currentGrammar.mean }}
                                </p>
                            </div>
                            <div
                                class="px-2 py-4 my-2 bg-[#e8c9af] border-l-4 border-l-[#153448]"
                            >
                                <p class="text-lg text-justify">
                                    <span class="text-[#153448] font-bold mr-2"
                                        >Cấu trúc:
                                    </span>
                                    <span class="font-medium">{{
                                        currentGrammar.structure
                                    }}</span>
                                </p>
                            </div>
                            <div
                                class="px-2 py-4 my-2 flex text-justify border-l-4 border-l-[#153448] bg-[#e9d7c7]"
                            >
                                <p class="text-lg">
                                    <span class="text-[#153448] font-bold mr-2"
                                        >Giải thích:</span
                                    ><span class="font-[500]">{{
                                        currentGrammar.explain
                                    }}</span>
                                </p>
                            </div>
                            <div class="p-4">
                                <p
                                    class="py-2 text-lg font-bold text-[#153448]"
                                >
                                    Ví dụ:
                                </p>
                                <div
                                    v-for="(
                                        example, index
                                    ) in currentGrammar.examples"
                                    :key="index"
                                    class="py-2 text-xl sm:text-2xl text-justify"
                                >
                                    <span
                                        class="text-lg text-[#153448] font-medium mr-2"
                                        >{{ index + 1 }}.
                                    </span>
                                    <ruby v-html="example.ja"></ruby>
                                    <p class="text-lg px-4 py-1">
                                        -> {{ example.vi }}
                                    </p>
                                </div>
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
                        Đóng
                    </button>
                </div>
            </div>
        </div>
        <div class="container mx-auto max-w-7xl py-10 mt-[72px] min-h-[100svh]">
            <p class="text-2xl text-black font-bold px-10 py-4">
                Tổng hợp ngữ pháp
            </p>
            <div class="relative inline-block text-left ml-10">
                <div class="group inline-block">
                    <button
                        type="button"
                        class="w-20 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    >
                        {{ textOption }}
                        <svg
                            class="-mr-1 ml-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                    <div
                        class="hidden group-hover:block origin-top-right absolute w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                    >
                        <div
                            class="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            <router-link
                                v-for="op in listLevel"
                                :key="op"
                                :to="{
                                    name: 'Grammar',
                                    params: {
                                        level: op,
                                    },
                                }"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                role="menuitem"
                                >{{ op }}</router-link
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="flex flex-col w-full sm:w-[70%]">
                    <div class="px-10 py-5">
                        <div class="flex flex-wrap lg:h-[420px]">
                            <div
                                v-for="(grammar, index) in listGrammar"
                                :key="index"
                                class="w-full sm:w-1/2 lg:w-1/3 p-2"
                            >
                                <div
                                    class="bg-[#153448] transition-all hover:bg-[#153448]/40 hover:border-[#d18242] py-4 rounded-xl border-2 border-white/60 text-center cursor-pointer"
                                    @click="showGrammar(index)"
                                >
                                    <p class="text-white text-lg truncate px-3">
                                        {{ grammar.title }}
                                    </p>
                                    <p
                                        class="text-white text-base truncate px-3"
                                    >
                                        {{ grammar.mean }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <button
                            class="text-black py-2 px-3 rotate-180"
                            @click="previousPageList()"
                        >
                            <NextPageIcon class="w-8 h-[32px]" />
                        </button>
                        <ul class="flex justify-end *:font-bold *:mx-1">
                            <router-link
                                v-for="it in pagePagi"
                                :key="it"
                                :to="{
                                    name: 'Grammar',
                                    params: {
                                        level: props.level || 'N5',
                                        page: it,
                                    },
                                }"
                            >
                                <li
                                    class="flex items-center border-2 border-black justify-center w-7 h-[28px] rounded-full"
                                    :class="
                                        props.page === '' && it == 1
                                            ? 'bg-white text-[#153448]'
                                            : props.page === it.toString()
                                              ? 'bg-white text-[#153448]'
                                              : 'bg-[#153448] text-white'
                                    "
                                >
                                    {{ it }}
                                </li>
                            </router-link>
                        </ul>
                        <button
                            class="text-black py-2 px-3"
                            @click="nextPageList()"
                        >
                            <NextPageIcon class="w-8 h-[32px]" />
                        </button>
                    </div>
                </div>
                <div
                    class="hidden sm:block w-[30%] bg-slate-400 rounded-xl"
                ></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.customs_scroll::-webkit-scrollbar {
    width: 6px;
}

.customs_scroll::-webkit-scrollbar-track {
    background-color: #ffffff;
}
.customs_scroll::-webkit-scrollbar-thumb {
    background-image: linear-gradient(-45deg, #153448, #153448);
    border-radius: 50px;
}
</style>
