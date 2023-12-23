<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list dense>
        <v-list-item @click="currentComponent = 'JournalGrid'">
          <v-list-item-content>
            <v-list-item-title>Journals</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="currentComponent = 'ReagentGrid'">
          <v-list-item-content>
            <v-list-item-title>Reagents</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <component :is="currentComponent" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import JournalGrid from '@/components/JournalGrid.vue';
import ReagentGrid from '@/components/ReagentGrid.vue';

export default defineComponent({
  components: {
    JournalGrid,
    ReagentGrid,
  },
  data() {
    return {
      currentComponent: 'JournalGrid' as string,
    };
  },
});
</script>
