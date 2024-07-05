<!-- import exam_detail => Lam bai button ==> exam_run -->
<script setup>
import { ref, defineProps, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

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
    },
    level: String,
})

const isShowExamDetail = ref(false)
const listExams = ref([])
const isLoading = ref(true)
const selectIndex = ref(0)
const textOption = ref('N5')
const isDropdownOpen = ref(false)
const listMenu = ref({
    kanji: 'kanji',
    vocab: 'tu vung',
    grammar: 'ngu phap',
    read: 'doc hieu',
    listen: 'nghe hieu',
    all: 'tong hop',
    jlpt: 'de thi jlpt',
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
        }
    },
)

watch(
    () => props.level,
    async (newLv, oldLv) => {
        if (newLv !== oldLv) {
            await fetchExams()
        }
    },
)

onMounted(async () => {
    await fetchExams()
})
</script>

<template>
    <div class="container mx-auto max-w-7xl mt-12">
        <div class="flex py-10">
            <div class="w-1/5">
                <ul
                    class="*:p-4 hover:*:bg-slate-300 border-2 border-slate-300 rounded-2xl overflow-hidden"
                >
                    <li v-for="(li, key) in listMenu" :key="li">
                        <router-link
                            :to="{
                                name: 'Exams',
                                params: {
                                    tags: key,
                                    level: props.level,
                                },
                            }"
                            >{{ li }}</router-link
                        >
                    </li>
                </ul>
            </div>
            <div class="w-4/5">
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
                                        name: 'Exams',
                                        params: {
                                            tags: props.tags,
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
                <div class="px-10 mt-10">
                    <div v-if="isLoading">Loading Content......</div>
                    <div
                        class="grid grid-cols-3 w-full gap-10 *:bg-slate-400 text-center *:p-4 *:rounded-lg"
                    >
                        <div
                            v-for="(item, index) in listExams"
                            :key="index"
                            @click="examDetail(index)"
                        >
                            <p>{{ item.title }}</p>
                        </div>
                    </div>
                </div>
                <div
                    v-if="isShowExamDetail"
                    class="fixed inset-0 bg-opacity-75 bg-gray-500 z-50"
                >
                    <div
                        @click.self="closeExamDetail"
                        class="absolute inset-0"
                    ></div>
                    <div
                        class="absolute right-0 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full h-[100%] lg:max-w-md sm:max-w-11"
                    >
                        <button class="text-lg" @click="closeExamDetail">
                            X
                        </button>
                        <p>{{ exam.title }}</p>
                        <p>{{ listMenu[exam.tags] }}</p>
                        <p>{{ exam.level }}</p>
                        <p>{{ exam.time_limit }}</p>
                        <p>{{ exam.total_points }}</p>
                        <p>{{ exam.createdAt }}</p>
                        <button class="bg-blue-300">
                            <router-link
                                class=""
                                :to="{
                                    name: 'ExamsRun',
                                    params: {
                                        id: exam._id,
                                    },
                                }"
                                >Lam bai</router-link
                            >
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
