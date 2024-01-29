<template>
    <router-link :to="{ name: 'Challenges.browse' }">
      <button type="button" class="btn blue-button p-2 mt-4">
        <span>{{ buttonContent }}</span>
      </button>
    </router-link>
</template>

<script>
export default {
  props: {
    buttonContent: { type: String, required: true }
  }
}
</script>

<style scoped lang="scss">
.blue-button {
  height: 50px;
  font-family: 'Raleway', sans-serif;
  background-color: transparent;
  outline: 2px double var(--shadow-blue);
  color: var(--shadow-blue);
  font-weight: bold;
  border: none;
  border-radius: 5px;
  letter-spacing: 4px;
  overflow: hidden;
  transition: 0.5s;
  cursor: pointer;
}
.blue-button:hover {
  background: var(--shadow-blue);
  color: var(--bg-sub);
  box-shadow: 0 0 5px var(--shadow-blue),
              0 0 10px var(--shadow-blue),
              0 0 20px var(--shadow-blue),
              0 0 50px var(--shadow-blue);
  -webkit-box-reflect:below 1px linear-gradient(transparent, #00000025);
}
</style>