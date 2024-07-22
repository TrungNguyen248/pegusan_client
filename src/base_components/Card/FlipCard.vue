<template>
    <div class="flip-card" @click="toggleFlip">
        <div class="flip-card-inner" :class="{ flip: isFlipped }">
            <div class="flip-card-front">
                <slot name="front" />
            </div>
            <div class="flip-card-back">
                <slot name="back" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isFlipped = ref(false)

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value
}
</script>

<style scoped>
.flip-card {
    perspective: 1000px;
}

.flip-card-inner {
    position: relative;
    width: 350px;
    height: 500px;
    transition: transform 0.7s;
    transform-style: preserve-3d;
}

.flip-card-inner.flip {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.flip-card-front {
    color: black;
}

.flip-card-back {
    color: white;
    transform: rotateY(180deg);
}
</style>
