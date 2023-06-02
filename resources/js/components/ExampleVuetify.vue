<template>
  <VApp>
    <v-app-bar>
      <v-container class="d-flex align-center py-0">
        <v-app-bar-title class="pl-0">
          <div class="d-flex align-center">
            <v-avatar
              rounded="0"
              class="mr-3"
              image="https://cdn.vuetifyjs.com/docs/images/logos/v.png"
            />
            Vuetify 3
          </div>
        </v-app-bar-title>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-sheet
        class="pa-16"
        color="#181818"
      >
        Main Content
      </v-sheet>
    </v-main>

    <v-footer>
      Copyright &copy; 2022 Vuetify, LLC
    </v-footer>
  </VApp>
</template>

