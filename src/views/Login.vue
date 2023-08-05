<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="fill-height" v-if="isLoading">
    <div class="align-center text-center">
      <v-progress-circular indeterminate></v-progress-circular>
      <p>Loading...</p>
    </div>
  </div>
  <div v-if="!isLoading && !isLoggedIn">
    <h1 class="text-center" style="margin-bottom: 30px;">Login to {{ siteName }}</h1>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-alert icon="$error" type="error" v-if="isFailed">{{ alertText }}</v-alert>
      <v-form>
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>
        <v-text-field density="compact" placeholder="Login" prepend-inner-icon="mdi-account-circle" variant="outlined"
          v-model="username"></v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>
        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible" v-model="password"></v-text-field>
        <v-btn id="loginButton" block class="mb-8" color="blue" size="large" variant="tonal" @click="login"
          :loading="isLoggingIn">
          Log In
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { api, rebuildAPI } from '../api'
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';
const visible = ref(false);

const store = useAppStore();
const router = useRouter();
const siteName = import.meta.env.VITE_SITE_NAME || "Imken-Link";
const username = ref(""), password = ref('');
const isLoading = ref(true),
  isLoggedIn = ref(false),
  isLoggingIn = ref(false),
  isFailed = ref(false);
const alertText = ref('');

api.get('/user/me').then(() => {
  isLoggedIn.value = true;
  isLoading.value = false;
  router.push('/admin');
}).catch(() => {
  isLoading.value = false;
})

addEventListener('keyup', (event) => {
  console.log(event.key)
  if (event.key == 'Enter') {
    event.preventDefault();
    document.getElementById('loginButton').click();
  }
})

const login = () => {
  if (!username.value || !password.value) {
    isFailed.value = true;
    alertText.value = 'Username and password is required.'
    return;
  }
  isLoggingIn.value = true;
  isFailed.value = false;
  api.post('/user/login', {
    username: username.value, password: password.value
  }).then((response) => {
    store.userToken = response.data.token;
    localStorage.setItem('userToken', store.userToken)
    rebuildAPI();
    router.push('/admin');
  }).catch((exception) => {
    console.log(exception)
    isLoggingIn.value = false;
    isFailed.value = true;
    alertText.value = exception.response.data.detail ?
      exception.response.data.detail : exception.message
  })
}
</script>
