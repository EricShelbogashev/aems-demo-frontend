<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          label="Search Reagents"
          variant="outlined"
          clearable
          @click:clear="onClear"
          @focus="isFocused = true"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="shouldShowList">
      <v-col>
        <v-list>
          <v-list-item
            v-for="reagent in filteredReagents"
            :key="reagent.id"
            @click="selectReagent(reagent)"
          >
            <v-list-item-title>{{ reagent.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="js">
import {ref, computed, onMounted} from 'vue';
import {VRow, VCol, VTextField, VList, VListItem, VListItemTitle} from 'vuetify/components';
import {getAllReagents} from "@/WebClient";

const reagents = ref([]);
let search = ref('');
let selectedReagent = ref(null);
const isFocused = ref(false);

const filteredReagents = computed(() => {
  if (!search.value && !isFocused.value) {
    return [];
  }
  return reagents.value.filter((reagent) =>
    reagent.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const shouldShowList = computed(() => isFocused.value);
const emit = defineEmits(['update-reagent-id']); // Define the emit function

const selectReagent = (reagent) => {
  selectedReagent.value = reagent.id;
  search.value = reagent.name;
  isFocused.value = false;
  emit('update-reagent-id', reagent.id); // Emit the selected reagent's ID
};

// Function to fetch reagents from the API
const fetchReagents = async () => {
  try {
    const response = await getAllReagents(); // Assuming getAllReagents is defined
    reagents.value = response.data; // Populate the reagents ref with the fetched data
  } catch (error) {
    console.error('Error fetching reagents:', error);
  }
};

// Fetch reagents when the component is mounted
onMounted(() => {
  fetchReagents();
});
const onClear = () => {
  search = ref('');
  selectedReagent = ref(null);
}
</script>
