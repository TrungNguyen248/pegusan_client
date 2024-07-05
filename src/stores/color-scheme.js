import { defineStore } from 'pinia'

const colorSchemes = ['default', 'theme-1', 'theme-2', 'theme-3', 'theme-4']

const getColorScheme = () => {
    const colorScheme = localStorage.getItem('colorScheme')
    return colorSchemes.find((item) => item === colorScheme) || 'default'
}

export const useColorSchemeStore = defineStore('colorScheme', {
    state: () => ({
        colorSchemeValue:
            localStorage.getItem('colorScheme') === null
                ? 'default'
                : getColorScheme(),
    }),
    getters: {
        colorScheme(state) {
            if (localStorage.getItem('colorScheme') === null) {
                localStorage.setItem('colorScheme', 'default')
            }

            return state.colorSchemeValue
        },
    },
    actions: {
        setColorScheme(colorScheme) {
            localStorage.setItem('colorScheme', colorScheme)
            this.colorSchemeValue = colorScheme
        },
    },
})
