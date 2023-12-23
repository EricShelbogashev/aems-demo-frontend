<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="openReagentDialog">Add New Reagent</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="reagent in reagents" :key="reagent.id">
        <v-card>
          <v-card-title>{{ reagent.name }}</v-card-title>
          <v-card-text>
            <div>Formula: {{ reagent.latexFormula }}</div>
            <div>Molar Weight: {{ reagent.molarWeight }}</div>
            <div>Description: {{ reagent.description }}</div>
            <div>Hazard Category: {{ reagent.hazardCategory }}</div>
            <div>Created: {{ reagent.createdAt }}</div>
            <div>Updated: {{ reagent.updatedAt }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог для создания нового реагента -->
    <v-dialog v-model="reagentDialog" persistent="" max-width="600px">
      <v-card>
        <v-card-title class="headline">New Reagent</v-card-title>
        <v-card-text>
          <v-alert v-if="reagentError" type="error" dense>{{ reagentError }}</v-alert>
          <v-text-field v-model="newReagentData.name" label="Name" required></v-text-field>
          <v-text-field v-model="newReagentData.latexFormula" label="Formula" required></v-text-field>
          <v-text-field v-model="newReagentData.molarWeight" label="Molar Weight" required type="number"></v-text-field>
          <v-text-field v-model="newReagentData.description" label="Description" required></v-text-field>
          <v-text-field v-model="newReagentData.hazardCategory" label="Hazard Category" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text="" @click="reagentDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text="" @click="addReagent">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {getAllReagents, createReagent} from '@/WebClient';

export default {
  data() {
    return {
      reagents: [],
      reagentDialog: false,
      newReagentData: {
        name: '',
        latexFormula: '',
        molarWeight: null,
        description: '',
        hazardCategory: '',
      },
      reagentError: '',
    };
  },
  async created() {
    await this.fetchReagents();
  },
  methods: {
    async fetchReagents() {
      try {
        const response = await getAllReagents();
        this.reagents = response.data;
      } catch (error) {
        console.error('Error fetching reagents:', error);
      }
    },
    openReagentDialog() {
      this.reagentDialog = true;
    },
    async addReagent() {
      try {
        await createReagent(this.newReagentData);
        this.reagentDialog = false;
        this.newReagentData = { /* сбросить данные */};
        await this.fetchReagents(); // Обновить список реагентов
      } catch (error) {
        console.log(error)
        this.reagentError = error.response.data.summary || 'Error creating reagent';
      }
    },
  },
};
</script>
