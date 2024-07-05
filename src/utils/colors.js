import { toRGB } from './helper'
import tailwindColors from 'tailwindcss/colors'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind-config'
import flatten from 'flat'

const twConfig = resolveConfig(tailwindConfig)
const colors = twConfig.theme?.colors

/** Extended colors */
const Colors = {
    ...tailwindColors,
    primary: '',
    secondary: '',
    success: '',
    info: '',
    warning: '',
    pending: '',
    danger: '',
    light: '',
    dark: '',
    darkmode: {
        50: '',
        100: '',
        200: '',
        300: '',
        400: '',
        500: '',
        600: '',
        700: '',
        800: '',
        900: '',
    },
}

/** Get a value from Tailwind colors by flatten index, if not available the value will be taken from the CSS variable with (--color-) prefix. */
const getColor = (colorKey, opacity = 1) => {
    const flattenColors = flatten(colors)

    if (flattenColors[colorKey].search('var') === -1) {
        return `rgb(${toRGB(flattenColors[colorKey])} / ${opacity})`
    } else {
        const cssVariableName = `--color-${
            flattenColors[colorKey].split('--color-')[1].split(')')[0]
        }`
        return `rgb(${getComputedStyle(document.body).getPropertyValue(
            cssVariableName,
        )} / ${opacity})`
    }
}

export { getColor }
