<template>
  <v-app class="main-container">
    <v-navigation-drawer
      class="side-panel"
      app permanent>
      <v-list dense>
        <v-list-item @click="navigateTo('/')">
          <v-list-item-content>
            <v-list-item-title
            class="navigate-title">Journals</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="navigateTo('/reagent-grid')">
          <v-list-item-content>
            <v-list-item-title
            class="navigate-title">Reagents</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <component :is="defaultComponent" v-bind:journalId="journalId"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import JournalGrid from '@/components/JournalGrid.vue';
import ReagentGrid from '@/components/ReagentGrid.vue';
import JournalEdit from "@/components/JournalEdit.vue";
import ReagentDetails from "@/components/ReagentDetails.vue";
import JournalDetails from "@/components/JournalDetails.vue";

export default defineComponent({
  components: {
    JournalGrid,
    JournalEdit,
    JournalDetails,
    ReagentGrid,
    ReagentDetails
  },
  props: {
    defaultComponent: {
      type: String,
      required: true,
    },
    journalId: Number,
    reagentId: Number
  },
  methods: {
    navigateTo(path: string) {
      this.$router.push(path);
    },
  }
});
</script>

<style scoped>
.main-container {
  background-color: #192126;
}
.side-panel {
  background-color: #01090F;
}
.navigate-title {
  color: white;
  font-size: 20px;
}
</style>
