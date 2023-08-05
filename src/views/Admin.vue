<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="fill-height" v-if="isLoading">
    <div class="align-center text-center">
      <v-progress-circular indeterminate></v-progress-circular>
      <p>Loading...</p>
    </div>
  </div>
  <div v-if="isLoggedIn" style="margin: 30px;">
    <h2>Welcome back, {{ username }}!</h2>
    <v-card style="min-width: 300px; margin-bottom: 30px;">
      <template #title>Account</template>
      <template #subtitle>Manage your account</template>
      <template #actions>
        <v-btn>Update Password</v-btn>
      </template>
    </v-card>
    <v-card style="min-width: 300px;">
      <template #title>Create a new link</template>
      <template #text>
        <v-text-field v-model="targetLink" label="The target link"></v-text-field>
        <v-text-field v-model="customLink" label="Custom link (leave blank to be random)"></v-text-field>
      </template>
      <template #actions>
        <v-btn @click="newLink" :loading="isSubmitting">Submit</v-btn>
      </template>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { api } from '../api'
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const isLoggedIn = ref(false);
const username = ref('');
const customLink = ref(''), targetLink = ref('');
const isSubmitting = ref(false);

api.get('/user/me').then((response) => {
  isLoggedIn.value = true;
  isLoading.value = false;
  username.value = response.data.username
}).catch(() => {
  router.push('/login');
})

const newLink = () => {
  isSubmitting.value = true;
  api.post('/link/add', {
    shorten_link: customLink.value,
    target_link: targetLink.value,
  }).then((response) => {
    customLink.value = response.data;
    isSubmitting.value = false;
  }).catch((exception) => {
    customLink.value += ('Error: ' + exception.message);
    isSubmitting.value = false;
  })
}
</script>
  