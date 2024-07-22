<template>
    <svg
        :fill="props.color"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
            <title></title>
            <g data-name="Layer 2" id="Layer_2">
                <path
                    d="M30.87,14.23,26,22.67V8l3.77,2.18A3,3,0,0,1,30.87,14.23Z"
                ></path>
                <path d="M6,8.26V22.34l-4.6-8a3,3,0,0,1,1.1-4.1Z"></path>
                <path
                    d="M21,4H11A3,3,0,0,0,8,7V25a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V7A3,3,0,0,0,21,4ZM13,8a1,1,0,1,1-1,1A1,1,0,0,1,13,8Zm6,16a1,1,0,1,1,1-1A1,1,0,0,1,19,24Zm-3-4a4,4,0,1,1,4-4A4,4,0,0,1,16,20Z"
                ></path>
                <circle cx="16" cy="16" r="2"></circle>
            </g>
        </g>
    </svg>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: '#ffffff',
    },
})
</script>
