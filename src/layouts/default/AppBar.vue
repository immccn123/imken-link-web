<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-btn @click="() => { show = !show; console.log(show) }" icon="mdi-menu" />
      {{ siteName }}
    </v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer floating v-model="show">
    <v-list nav>
      <router-link to="/" style="text-decoration: none; color: unset;">
        <v-list-item prepend-icon="mdi-home" title="Home" value="/" :active="isActive['/']"></v-list-item>
      </router-link>
      <router-link to="/admin" style="text-decoration: none; color: unset;">
        <v-list-item prepend-icon="mdi-account-circle" title="Admin" value="/admin"
          :active="isActive['/admin']"></v-list-item>
      </router-link>
      <router-link to="/links" style="text-decoration: none; color: unset;">
        <v-list-item prepend-icon="mdi-link" title="Manage Links" value="/links"
          :active="isActive['/links']"></v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const siteName = import.meta.env.VITE_SITE_NAME || 'Imken-Link';
const show = ref(false);
const router = useRouter()
const isActive = {
  '/': false,
  '/admin': false,
  '/links': false,
}

watch(router.currentRoute, () => {
  const route = router.currentRoute.value.fullPath;
  for (let [key] in isActive) {
    if (key == route) isActive[key] = true;
    else isActive[key] = false;
  }
})
</script>
