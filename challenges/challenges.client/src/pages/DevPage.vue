<template>
    <section class="container-fluid">
        <div class="row justify-content-center pt-3">
            <div class="col-md-6 text-center bg-dark rounded-top">
                <h1>Leaderboards</h1>
                <h2>Our top performers!</h2>
            </div>
        </div>
        <div class="row justify-content-center bg-dark text-center rounded-top mx-3">
            <div class="col-md-6">
                <h1 class="p-3 border-bottom mb-3">Top problem solvers</h1>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
            </div>
            <div class="col-md-6">
                <h1 class="p-3 border-bottom mb-3">Top project completions</h1>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
                <p class="">Lorem Ipsum | 500 Problems | Talented</p>
            </div>
        </div>
    </section>
</template>

<script>
  import { computed, defineComponent, onMounted } from 'vue'
  import { AppState } from '../AppState'
  import Pop from "../utils/Pop.js"
  import { logger } from "../utils/Logger.js"  
  
  export default defineComponent({
    components: {
          
    },
    setup() {

    onMounted(() => {

    })
    return {
        
    } 
    }
})
  
</script>
  

<style scoped lang="scss">
</style>

  