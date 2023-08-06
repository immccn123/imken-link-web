<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <h1>Manage Links</h1>
    <div class="fill-height" v-if="isLoading">
      <div class="align-center text-center">
        <v-progress-circular indeterminate></v-progress-circular>
        <p>Loading...</p>
      </div>
    </div>
    <p v-if="isContentLoading">Content Loading...</p>
    <div v-if="isLoggedIn && !isContentLoading" style="margin: 30px">
      <p v-if="linkList.length == 0">No Data.</p>
      <v-list max-width="600">
        <v-list-item
          v-for="link in linkList"
          :key="link"
          :title="host + '/' + link.shorten_link"
        >
          <template #subtitle>{{ link.target_link }}</template>
          <template #append>
            <v-btn @click="deleteLink(link.id)">Delete</v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>
    <v-pagination :length="linkCount / 20 + 1" v-model="pageId"></v-pagination>
  </v-container>
</template>
<script setup>
import { ref } from 'vue';
import { api } from '../api';
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';

const router = useRouter(),
  route = useRoute();
const username = ref('');
const isLoading = ref(true);
const isContentLoading = ref(true);
const isLoggedIn = ref(false);
const isOwn = ref(0);
const host = window.location.origin;
const linkList = ref([]);
const linkCount = ref(0);

api
  .get('/user/me')
  .then((response) => {
    isLoggedIn.value = true;
    isLoading.value = false;
    username.value = response.data.username;
  })
  .catch(() => {
    router.push('/login');
  });

const pageId = ref(route.params.pageId || 1);
if (!route.params.pageId) router.push('/links/1');

const getPage = () => {
  isContentLoading.value = true;
  api
    .get(`/link/list?page=${pageId.value - 1}&is_own=${isOwn.value}`)
    .then((response) => {
      linkList.value = response.data;
      isContentLoading.value = false;
    });
  api.get('/link/count').then((response) => {
    linkCount.value = response.data;
  });
};

const deleteLink = (linkId) => {
  api.delete(`/link/${linkId}`).finally(() => getPage());
};

watch(route, getPage);

watch(pageId, () => {
  router.push(`/links/${pageId.value}`);
});

getPage();
</script>
