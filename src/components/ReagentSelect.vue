<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search"
          outlined
          clearable
          @focus="isFocused = true"
          solo-inverted
          hide-details
          class="elevation-2"
        ></v-text-field>
        <transition name="fade" mode="out-in">
          <v-list v-if="shouldShowList" dense class="mt-1">
            <v-list-item
              v-for="state in filteredStates"
              :key="state"
              @click="selectState(state)"
              class="state-list-item"
            >
              <v-list-item-title>{{ state }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.state-list-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>


<script setup>
import { ref, computed } from 'vue';
import { VRow, VCol, VTextField, VList, VListItem, VListItemTitle } from 'vuetify/components';

const states = ref(['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']);
const search = ref('');
const selectedState = ref('');
const isFocused = ref(false);

const filteredStates = computed(() => {
  if (!search.value && !isFocused.value) {
    return [];
  }
  return states.value.filter((state) =>
    state.toLowerCase().includes(search.value.toLowerCase())
  );
});

const shouldShowList = computed(() => isFocused.value);

const selectState = (state) => {
  selectedState.value = state;
  search.value = state;
  isFocused.value = false;
};
</script>
