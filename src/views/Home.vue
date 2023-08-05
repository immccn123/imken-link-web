<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h1>Imken.Link</h1>
      <h2>A link shortening web app</h2>
      <v-btn color="indigo-darken-3" elevation="0" @click="gotoAdminPanel">Admin Panel</v-btn>
      <v-btn elevation="0" variant="tonal" style="margin-left: 10px;">View Docs</v-btn>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const gotoAdminPanel = () => router.push('/admin');
</script>
