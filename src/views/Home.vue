<script setup lang="ts"></script>

<template>
  <div class= "container">
    <h1>Day 1 Workshop MONOGRID!</h1>
    <p> clicca <a href="/three"> pagina test</a> day 1 (setup di una scena threeJS + import .glb)</p>
    <div class="card">
      <img class= "logo" src="/logo.png" alt="Logo Aziendale"></img>
      <p>SCORRI</p>
    </div>
    <div class="minor-card" style="background-color:black;">
      <h1>ciao</h1>
    </div>
  </div>
</template>

<style scoped>
  .container {
    border: 1px solid white;
  }
  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
  }
  .minor-card {
    display: flex;
    justify-content: left;
    align-items: left;
    height: auto;
  }
  .logo {
    margin-top: 20%;
    margin-bottom: 20%;
    width: 400px;
    height: auto;
    object-fit: contain;
  }
  .minor-card h1{
    font-size: 40px;
    display: flex;
    justify-content: left;
    align-items: left;
  }
</style>
