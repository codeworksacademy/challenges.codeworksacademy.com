<template>
  <p class="hero-font fs-2">
    <span :style="{ color: spans[0].color }" class="color-1">{{ spans[0].text }}</span> New Projects
  </p>
  <p class="hero-font fs-2">
    <span :style="{ color: spans[1].color }" class="color-2">{{ spans[1].text }}</span> Your Skills
  </p>
  <p class="hero-font fs-2">
    <span :style="{ color: spans[2].color }" class="color-3">{{ spans[2].text }}</span> Your Portfolio
  </p>
  <p class="hero-font fs-2">
    <span :style="{ color: spans[3].color }" class="color-4">{{ spans[3].text }}</span> with Software Development!
  </p>
</template>

<script>
import { onMounted } from 'vue';

export default {
  setup() {
    const colors = ['var(--shadow-green)', 'var(--shadow-orange)', 'var(--shadow-purple)', 'var(--shadow-blue)'];

    function getRandomColor() {
      return colors[Math.floor(Math.random() * colors.length)];
    }

    const spans = [
      { text: 'Pursue', color: getRandomColor() },
      { text: 'Showcase', color: getRandomColor() },
      { text: 'Build', color: getRandomColor() },
      { text: 'Empower Your Career', color: getRandomColor() },
    ];

    

    return {
      spans
    }
  }
}
</script>

<style scoped lang="scss">
.color-1 {
  animation: colorChange1 30s infinite;
}
.color-2 {
  animation: colorChange2 30s infinite;
}
.color-3 {
  animation: colorChange3 30s infinite;
}
.color-4 {
  animation: colorChange4 30s infinite;
}
@keyframes colorChange1 {
  0%, 100% { color: var(--shadow-green); }
  25% { color: var(--shadow-orange); }
  50% { color: var(--shadow-purple); }
  75% { color: var(--shadow-blue); }
}
@keyframes colorChange2 {
  0%, 100% { color: var(--shadow-orange); }
  25% { color: var(--shadow-purple); }
  50% { color: var(--shadow-blue); }
  75% { color: var(--shadow-green); }
}
@keyframes colorChange3 {
  0%, 100% { color: var(--shadow-purple); }
  25% { color: var(--shadow-blue); }
  50% { color: var(--shadow-green); }
  75% { color: var(--shadow-orange); }
}
@keyframes colorChange4 {
  0%, 100% { color: var(--shadow-blue); }
  25% { color: var(--shadow-green); }
  50% { color: var(--shadow-orange); }
  75% { color: var(--shadow-purple); }
}
</style>