<!-- add search kanji -->
<!-- loc kanji theo cap do -->
<!-- phan trang -->
<!-- them vao flash card -->
<script setup>
import axios from 'axios'
import { defineProps, onMounted, ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import KanjivgAnimate from '../assets/js/KanjivgAnimate.min.js'

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
        svgElement.setAttribute('width', 265)
        svgElement.setAttribute('height', 265)
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
    <div>
        <div
            v-if="isVisible"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
            <div
                class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all lg:max-w-5xl sm:max-w-lg sm:w-full"
            >
                <button @click="closeModalKanji">Close</button>
                <div class="flex">
                    <div class="w-1/2">
                        <p>{{ currentKanji.kanji }}</p>
                        <p>{{ currentKanji.cn_vi_word }}</p>
                        <p>{{ currentKanji.explain }}</p>
                        <p>{{ currentKanji.jlpt }}</p>
                        <p>
                            <span
                                v-for="kun in currentKanji.kunyomi"
                                :key="kun"
                                class="bg-blue-300 ml-1 px-1"
                            >
                                {{ kun.replace('-', '') }}
                            </span>
                        </p>
                        <p>
                            <span
                                v-for="on in currentKanji.onyomi"
                                :key="on"
                                class="bg-red-300 ml-1 px-1"
                            >
                                {{ on }}
                            </span>
                        </p>
                        <p>{{ currentKanji.mean }}</p>
                        <p>{{ currentKanji.stroke_num }}</p>
                    </div>
                    <div class="w-1/2 flex justify-center">
                        <div>
                            <button
                                class="kanjivg-button"
                                :class="
                                    isDisable ? 'bg-slate-300' : 'bg-blue-400'
                                "
                                data-kanjivg-target="#animateMe"
                                @click="
                                    waitForAnimation(currentKanji.stroke_num)
                                "
                                :disabled="isDisable"
                            >
                                Ve lai
                            </button>
                            <div v-html="svgContent" ref="elSvg"></div>
                        </div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(kanji, i) in currentKanji.examples"
                            :key="i"
                        >
                            <td>{{ kanji.ja }}</td>
                            <td>{{ kanji.hira }}</td>
                            <td>{{ kanji.vi }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="container mx-auto max-w-7xl flex justify-between py-10">
            <div
                class="w-3/4 p-10 grid grid-cols-5 gap-4 *:border-2 *:text-center"
            >
                <div
                    v-for="(kanji, i) in listKanji"
                    :key="i"
                    @click="showKanjiDetail(i, kanji.unicode)"
                >
                    <p>{{ kanji.kanji }}</p>
                    <p>{{ kanji.cn_vi_word.split(' ')[1].replace(',', '') }}</p>
                </div>
            </div>
            <div class="w-1/4 border-2 border-gray-400"></div>
        </div>
    </div>
</template>
