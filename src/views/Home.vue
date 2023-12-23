<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list dense>
        <v-list-item @click="navigateTo('/')">
          <v-list-item-content>
            <v-list-item-title>Journals</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="navigateTo('/reagent-grid')">
          <v-list-item-content>
            <v-list-item-title>Reagents</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <component :is="defaultComponent" v-bind:journalId="journalId" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import JournalGrid from '@/components/JournalGrid.vue';
import ReagentGrid from '@/components/ReagentGrid.vue';
import JournalEdit from "@/components/JournalEdit.vue";

export default defineComponent({
  components: {
    JournalGrid,
    JournalEdit,
    ReagentGrid,
  },
  props: {
    defaultComponent: {
      type: String,
      required: true,
    },
    journalId: Number,
  },
  methods: {
    navigateTo(path: string) {
      this.$router.push(path);
    },
  }
});
</script>
