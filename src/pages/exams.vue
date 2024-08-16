<!-- import exam_detail => Lam bai button ==> exam_run -->
<script setup>
import { ref, defineProps, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import moment from 'moment'
import { useAuthStore } from '../stores/auth'
import BackIcon from '../components/Icons/back.vue'

const props = defineProps({
    type: String,
    tags: {
        validator: (value) => {
            return [
                'kanji',
                'vocab',
                'grammar',
                'read',
                'listen',
                'all',
                'jlpt',
            ].includes(value)
        },
        default: 'kanji',
    },
    level: String,
})

const isShowExamDetail = ref(false)
const listExams = ref([])
const isLoading = ref(true)
const selectIndex = ref(0)
const textOption = ref('N5')
const isDropdownOpen = ref(false)
const textMenuMobile = ref('Kanji (漢字)')
const listMenu = ref({
    kanji: 'Kanji (漢字)',
    vocab: 'Từ vựng (ことば)',
    grammar: 'Ngữ pháp (ぶんぽう)',
    read: 'Đọc hiểu (どっかい)',
    listen: 'Nghe hiểu (ちょうかい)',
    all: 'Tổng hợp ',
    jlpt: 'Đề thi JLPT (JPLT テスト)',
})

const listLevel = ref(['N5', 'N4', 'N3', 'N2', 'N1'])

const authStore = useAuthStore()
const user = authStore.user

async function fetchExams(tags = 'kanji', level = 'N5') {
    isShowExamDetail.value = false
    const res = await axios.get(
        `http://localhost:5000/v1/api/exams/${props.tags ? props.tags : tags}/${props.level ? props.level : level}`,
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
    listExams.value = res.data.metadata
}

const exam = computed(() => listExams.value[selectIndex.value])

function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value
}

function examDetail(index) {
    selectIndex.value = index
    isShowExamDetail.value = true
}

function closeExamDetail() {
    isShowExamDetail.value = false
}

watch(
    () => props.tags,
    async (newTag, oldTag) => {
        if (newTag !== oldTag) {
            await fetchExams()
            textMenuMobile.value = listMenu.value[props.tags]
        }
    },
)

watch(
    () => props.level,
    async (newLv, oldLv) => {
        if (newLv !== oldLv) {
            await fetchExams()
            textOption.value = props.level == '' ? 'N5' : props.level
        }
    },
)

onMounted(async () => {
    await fetchExams()
    textOption.value = props.level == '' ? 'N5' : props.level
})
</script>

<template>
    <div class="container mx-auto max-w-7xl mt-[72px]">
        <div class="flex py-10">
            <div class="hidden lg:block w-[25%]">
                <div class="w-[300px] top-0 fixed flex items-center h-[100svh]">
                    <div
                        class="border-2 rounded-xl overflow-hidden shadow-sm w-full border-black"
                    >
                        <router-link
                            v-for="(li, key) in listMenu"
                            :key="li"
                            :to="{
                                name: 'Exams',
                                params: {
                                    tags: key,
                                    level: props.level,
                                },
                            }"
                            class=""
                        >
                            <p
                                class="py-3 px-4 hover:bg-[#e8ca9f] border-b-[1px] border-black text-lg"
                            >
                                {{ li }}
                            </p></router-link
                        >
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-[75%] flex flex-col">
                <p class="p-2 text-center text-2xl font-medium">
                    {{
                        props.tags != '' ? listMenu[props.tags] : listMenu.kanji
                    }}
                </p>
                <div class="relative inline-block text-left ml-10">
                    <div class="group inline-block">
                        <button
                            type="button"
                            class="w-20 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
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
                                        name: 'Exams',
                                        params: {
                                            tags: props.tags,
                                            level: op,
                                        },
                                    }"
                                    class="block px-4 py-2 font-medium text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                    role="menuitem"
                                    >{{ op }}</router-link
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:hidden relative inline-block text-left ml-10">
                    <div class="group inline-block">
                        <button
                            type="button"
                            class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                        >
                            {{ textMenuMobile }}
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
                                    v-for="(li, key) in listMenu"
                                    :key="li"
                                    :to="{
                                        name: 'Exams',
                                        params: {
                                            tags: key,
                                            level: props.level,
                                        },
                                    }"
                                    class="block px-4 py-2 font-medium text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                    role="menuitem"
                                    >{{ listMenu[key] }}</router-link
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-4 sm:px-10 mt-10">
                    <div v-if="isLoading">Loading Content......</div>
                    <div class="flex flex-wrap w-full">
                        <div
                            v-for="(item, index) in listExams"
                            :key="index"
                            @click="examDetail(index)"
                            class="w-full sm:w-1/3 p-2"
                        >
                            <div
                                class="border-2 py-3 px-2 rounded-md cursor-pointer hover:bg-[#e8ca9f] border-black"
                            >
                                <p class="text-center font-medium">
                                    {{ item.title }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="isShowExamDetail"
                    class="fixed inset-0 h-[100%] bg-opacity-75 bg-gray-500 z-50"
                >
                    <div
                        @click.self="closeExamDetail"
                        class="absolute inset-0"
                    ></div>
                    <div
                        class="absolute overflow-y-auto px-5 right-0 bg-[#FFF7F1] overflow-hidden shadow-xl transform transition-all w-full h-[100%] lg:max-w-md sm:max-w-11"
                    >
                        <button class="text-lg" @click="closeExamDetail">
                            <BackIcon class="w-10 h-[40px]" color="#000000" />
                        </button>
                        <p class="text-center py-4 px-4 font-medium text-xl">
                            {{ exam.title }}
                        </p>
                        <p
                            class="flex justify-between text-lg mb-4 font-medium"
                        >
                            <span>Tags:</span>
                            <span>{{ listMenu[exam.tags] }}</span>
                        </p>
                        <p
                            class="flex justify-between text-lg mb-4 font-medium"
                        >
                            <span>Cấp độ: </span><span>{{ exam.level }}</span>
                        </p>
                        <p
                            v-if="exam.time_limit && exam.time_limit"
                            class="flex justify-between text-lg mb-4 font-medium"
                        >
                            <span>Thời gian: </span>
                            <span>{{ exam.time_limit }} phút</span>
                        </p>
                        <p
                            class="flex justify-between text-lg mb-4 font-medium"
                        >
                            <span>Điểm: </span>
                            <span>{{ exam.total_points }}</span>
                        </p>
                        <p
                            class="flex justify-between text-lg mb-4 font-medium"
                        >
                            <span>Ngày tạo: </span>
                            <span>
                                {{
                                    moment(exam.createdAt)
                                        .locale('vi')
                                        .format('L')
                                }}</span
                            >
                        </p>
                        <div class="w-full py-2 px-10 mt-10">
                            <router-link
                                class=""
                                :to="{
                                    name: 'ExamsRun',
                                    params: {
                                        id: exam._id,
                                    },
                                }"
                            >
                                <button
                                    class="border-black border-2 rounded-lg hover:bg-[#e8ca9f] font-medium py-2 w-full"
                                >
                                    Làm bài
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-[500px]"></div>
    </div>
</template>
