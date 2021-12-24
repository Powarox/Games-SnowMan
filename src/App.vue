<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"/>
    <div id="app">
        <grille/>
    </div>
</template>

<script>
    import Grille from './components/Grille.vue'

    export default {
      name: 'App',
      components: {
        Grille
      }
    }
</script>

<style>
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }

    #app {
        margin: auto;
    }
</style>
