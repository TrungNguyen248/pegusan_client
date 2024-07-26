<!-- add search kanji -->
<!-- loc kanji theo cap do -->
<!-- phan trang -->
<!-- them vao flash card -->
<script setup>
import axios from 'axios'
import { defineProps, onMounted, ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import KanjivgAnimate from '../assets/js/KanjivgAnimate.min.js'
import BackIcon from '../components/Icons/back.vue'

const props = defineProps({
    level: {
        type: String,
    },
})

const isVisible = ref(false)
const currentKanjiIndex = ref(0)
const isLoading = ref(true)
const listKanji = ref([])
const svgContent = ref(null)
const elSvg = ref(null)
const isDisable = ref(false)

const authStore = useAuthStore()
const user = authStore.user

async function fetchKanji(level = 'N5') {
    const res = await axios.get(
        `http://localhost:5000/v1/api/kanji/${props.level ? props.level : level}`,
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
    listKanji.value = res.data.metadata
}

const currentKanji = computed(() => listKanji.value[currentKanjiIndex.value])

async function showKanjiDetail(index, unicode) {
    svgContent.value = null
    isVisible.value = true
    currentKanjiIndex.value = index
    const res = await axios.post(
        'http://localhost:5000/v1/api/kanji/svg',
        {
            kanji: unicode,
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
    addIdToSvg()
}

function hanlderSvgContent(svgData) {
    const startIndex = svgData.indexOf('<svg')
    const endIndex = svgData.indexOf('</svg>') + '</svg>'.length
    const svgStr = svgData.substring(startIndex, endIndex)
    svgContent.value = svgStr //svgContent
}

function addIdToSvg() {
    const svgElement = elSvg.value.querySelector('svg')
    if (svgElement) {
        svgElement.id = 'animateMe'
        new KanjivgAnimate('.kanjivg-button', 600)
        svgElement.setAttribute('width', 230)
        svgElement.setAttribute('height', 230)
        document.querySelectorAll('#animateMe path').forEach((path) => {
            const newStrokeWidth = 4
            path.setAttribute('stroke-width', newStrokeWidth)
        })
    }
}

function waitForAnimation(stroke_num) {
    isDisable.value = true
    setTimeout(() => {
        isDisable.value = false
    }, stroke_num * 600)
}

function closeModalKanji() {
    isVisible.value = false
}

onMounted(async () => {
    await fetchKanji()
})
</script>

<template>
    <div class="mt-[72px]">
        <div
            v-if="isVisible"
            @click.self="closeModalKanji()"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
            <div
                class="customs_scroll p-4 sm:p-10 overflow-y-auto bg-white h-[100%] sm:h-[90%] sm:w-full sm:max-w-3xl shadow-xl transform transition-all"
            >
                <div class="flex justify-end">
                    <BackIcon @click="closeModalKanji()" class="w-10 h-[40px] cursor-pointer" color="#000000"/>
                </div>
                <p class="flex items-center justify-center mb-6">
                    <span class="text-3xl">{{
                        currentKanji.kanji
                    }}</span>
                    <span class="text-lg">{{
                        currentKanji.cn_vi_word
                    }}</span>
                </p>
                <div class="block sm:flex">
                    <div class="w-full sm:w-2/3">
                       

                        <p class="flex mb-2">
                            <div class="w-[20%]">
                                <span class="flex text-sm p-1 bg-gray-300 "
                                >Kunyomi:</span
                                >
                            </div>
                            <div class="w-[80%]">
                                <span
                                v-for="kun in currentKanji.kunyomi"
                                :key="kun"
                                class="bg-blue-300 ml-1 px-1 "
                                >
                                {{ kun.replace('-', '') }}
                            </span>
                        </div>
                        </p>
                        <p class="flex mb-2">
                            <div class="w-[20%]">
                                <span class="flex text-sm p-1 bg-gray-300"
                                >Onyomi:</span
                                >
                            </div>
                            <div class="w-[80%]">
                                <span
                                v-for="on in currentKanji.onyomi"
                                :key="on"
                                class="bg-red-300 ml-1 px-1"
                                >
                                {{ on }}
                            </span>
                        </div>
                        </p>
                        <p class="flex mb-2">
                            <div class="w-[20%]">
                            <span class="flex text-sm p-1 bg-gray-300"
                                >Nghĩa:
                            </span>
                            </div>
                            <div class="w-[80%]">
                                <span class="flex px-2 text-justify">{{ currentKanji.mean }}</span>
                            </div>
                        </p>
                        <p class="flex mb-2"> 
                            <div class="w-[20%]">
                                <span class="flex text-sm p-1 bg-gray-300">Giải nghĩa:</span>
                            </div>
                            <div class="w-[80%]">
                                <span class="flex px-2 text-justify">{{ currentKanji.explain }}</span>
                            </div>
                        </p>
                        <p class="flex mb-2">
                            <div class="w-[20%]">
                                <span class="flex text-sm p-1 bg-gray-300">Cấp độ: </span>
                            </div>
                            <div class="w-[80%]">
                                <span class="px-2 ">{{ currentKanji.jlpt }}</span>
                            </div>
                        </p>
                        <p class="flex mb-2" v-if="currentKanji.component.length > 0"> 
                            <div class="w-[20%]">
                                <span class="flex text-sm p-1 bg-gray-300">Bộ:</span>
                            </div>
                            <div class="w-[80%]">
                                <span
                                v-for="(cp,idx) in currentKanji.component"
                                :key="idx"
                                class=" ml-1 px-1"
                                >
                                {{ cp }}
                            </span>
                            </div>
                        </p>
                        <p class="flex mb-2">
                            <div class="w-[20%]">

                                <span class="flex text-sm p-1 bg-gray-300">Số nét: </span>
                            </div>
                            <div class="w-[75%]">
                                <span class="px-2 ">{{ currentKanji.stroke_num }}</span>

                            </div>
                        </p>
                    </div>
                    <div class="sm:w-1/3 w-full  flex justify-center">
                        <div class="flex flex-col justify-start">
                            <div
                                v-html="svgContent"
                                class="border-2 rounded-lg bg-svg-background w-[230px] h-[230px]"
                                ref="elSvg"
                            ></div>
                            <div class="flex justify-center">
                                <button
                                    class="kanjivg-button cursor-pointer my-2 px-2 py-1 text-white font-bold rounded-full" 
                                    :class="
                                        isDisable ? 'bg-slate-300' : 'bg-blue-400'
                                    "
                                    data-kanjivg-target="#animateMe"
                                    @click="
                                        waitForAnimation(currentKanji.stroke_num)
                                    "
                                    :disabled="isDisable"
                                >
                                    Vẽ lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <table class="table-auto w-full">
                    <div class="py-2 font-medium"><p>Ví dụ</p></div>    
                    <tbody>
                        <tr
                            class="*:text-base sm:*:text-lg *:border-2 *:pl-3 *:py-2"
                            v-for="(kanji, i) in currentKanji.examples"
                            :key="i"
                        >
                            <td class="w-[20%] sm:w-[15%]">{{ kanji.ja }}</td>
                            <td class="w-[30%] sm:w-[20%]">{{ kanji.hira }}</td>
                            <td>{{ kanji.vi }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="container mx-auto max-w-7xl py-10">
            <p class="text-2xl text-white font-bold px-10 py-4">
                Tổng hợp ngữ pháp
            </p>
            <div class="flex">
                <div class="w-full sm:w-3/4 p-10 flex flex-wrap *:text-center">
                    <div
                        class="w-1/3 p-2 lg:w-[20%]"
                        v-for="(kanji, i) in listKanji"
                        :key="i"
                        @click="showKanjiDetail(i, kanji.unicode)"
                    >
                        <div class="bg-[#153448] py-1 border-2 rounded-xl">
                            <p class="text-2xl text-white/95">
                                {{ kanji.kanji }}
                            </p>
                            <p class="text-base text-[#e8c9af] font-medium">
                                {{
                                    kanji.cn_vi_word
                                        .split(' ')[1]
                                        .replace(',', '')
                                }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="hidden sm:w-1/4 border-2 border-gray-400"></div>
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
