<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <h1>Admin Dashboard</h1>
    <div class="fill-height" v-if="isLoading">
      <div class="align-center text-center">
        <v-progress-circular indeterminate></v-progress-circular>
        <p>Loading...</p>
      </div>
    </div>
    <div v-if="isLoggedIn" style="margin-top: 30px">
      <h2>Welcome back, {{ username }}!</h2>
      <v-card style="min-width: 300px; margin-bottom: 30px">
        <template #title>Account</template>
        <template #subtitle>Manage your account</template>
        <template #actions>
          <v-btn @click="dialog = !dialog">Update Password</v-btn>
        </template>
      </v-card>
      <v-dialog v-model="dialog" width="auto" persistent>
        <v-card width="400">
          <template #title>Update Password</template>
          <template #text>
            <v-container>
              <v-text-field
                label="Old Password"
                type="password"
                v-model="passwordForm.oldPassword"
              ></v-text-field>
              <v-text-field
                label="New Password"
                type="password"
                v-model="passwordForm.newPassword"
              ></v-text-field>
              <v-text-field
                label="Retype New Password"
                type="password"
                v-model="passwordForm.retypeNewPassword"
              ></v-text-field>
              <v-alert v-if="alertText != ''" type="error">{{
                alertText
              }}</v-alert>
            </v-container>
          </template>
          <template #actions>
            <v-container>
              <v-btn :loading="isUpdatingPassword" @click="updatePassword()"
                >Update</v-btn
              >
              <v-btn :loading="isUpdatingPassword" @click="dialog = !dialog"
                >Close</v-btn
              >
            </v-container>
          </template>
        </v-card>
      </v-dialog>
      <v-card style="min-width: 300px; margin-bottom: 30px">
        <template #title>Create a new link</template>
        <template #text>
          <v-text-field
            v-model="targetLink"
            label="The target link"
          ></v-text-field>
          <v-text-field
            v-model="customLink"
            label="Custom link (leave blank to be random)"
          ></v-text-field>
        </template>
        <template #actions>
          <v-btn @click="newLink" :loading="isSubmitting">Submit</v-btn>
        </template>
      </v-card>
    </div>
  </v-container>
</template>
<script setup>
import { ref } from 'vue';
import { api } from '../api';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const isLoading = ref(true);
const isLoggedIn = ref(false);
const isSubmitting = ref(false);
const isUpdatingPassword = ref(false);
const customLink = ref(''),
  targetLink = ref('https://');
const newLinkText = ref(''),
  alertText = ref('');
const dialog = ref(false);
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  retypeNewPassword: '',
});

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

const updatePassword = () => {
  if (passwordForm.value.newPassword != passwordForm.value.retypeNewPassword) {
    alertText.value = 'The passwords entered twice are inconsistent';
    return;
  }
  isUpdatingPassword.value = true;
  api
    .post('/user/password', {
      // prettier-ignore
      'old_password': passwordForm.value.oldPassword,
      // prettier-ignore
      'new_password': passwordForm.value.newPassword,
    })
    .then(() => {
      isUpdatingPassword.value = false;
      dialog.value = false;
    })
    .catch((exception) => {
      alertText.value = exception.response.data.detail
        ? exception.response.data.detail
        : exception.message;
      isUpdatingPassword.value = false;
    });
};

const newLink = () => {
  isSubmitting.value = true;
  newLinkText.value = '';
  api
    .post('/link/add', {
      // prettier-ignore
      'shorten_link': customLink.value,
      // prettier-ignore
      'target_link': targetLink.value,
    })
    .then((response) => {
      newLinkText.value = response.data.shorten_link;
      customLink.value = window.location.origin + '/' + newLinkText.value;
      isSubmitting.value = false;
    })
    .catch((exception) => {
      customLink.value =
        'Error: ' + exception.response.data || exception.message;
      isSubmitting.value = false;
    });
};
</script>
