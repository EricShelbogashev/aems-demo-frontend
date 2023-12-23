<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="dialog = true">Create New Journal Entry</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="journal in journals" :key="journal.id">
        <v-card>
          <v-card-title>{{ journal.title }}</v-card-title>
          <v-card-text>
            <div>Created: {{ journal.createdAt }}</div>
            <div>Updated: {{ journal.updatedAt }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn text="" color="primary" @click="openEditDialog(journal)">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диало для создания журнала   -->
    <v-dialog v-model="dialog" persistent="" max-width="600px">
      <v-card>
        <v-card-title class="headline">New Journal Entry</v-card-title>
        <v-card-text>
          <v-text-field v-model="newJournalTitle" label="Journal Title" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text="" @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text="" @click="createJournal">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Диалог для редактирования журнала -->
  <v-dialog v-model="editDialog" persistent="" max-width="600px">
    <v-card>
      <v-card-title class="headline">Edit Journal Entry</v-card-title>
      <v-card-text>
        <v-text-field v-model="editedJournalTitle" label="Journal Title" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text="" @click="editDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text="" @click="updateJournal">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import {createJournalEntry, getAllJournals, updateJournalEntry} from "@/WebClient";

export default {
  name: 'JournalGrid',
  data() {
    return {
      journals: [],
      dialog: false,
      newJournalTitle: '',
      editDialog: false,
      editedJournalId: null,
      editedJournalTitle: '',
    };
  },
  async created() {
    await this.fetchJournals();
  },
  methods: {
    async fetchJournals() {
      try {
        const response = await getAllJournals();
        this.journals = response.data;
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    },
    async createJournal() {
      if (!this.newJournalTitle) return;
      try {
        await createJournalEntry(this.newJournalTitle);
        this.newJournalTitle = '';
        this.dialog = false;
        await this.fetchJournals(); // Refresh the list of journals
      } catch (error) {
        console.error('Error creating journal entry:', error);
      }
    },
    openEditDialog(journal) {
      this.editedJournalId = journal.id;
      this.editedJournalTitle = journal.title;
      this.editDialog = true;
    },

    async updateJournal() {
      if (!this.editedJournalTitle) return;
      try {
        await updateJournalEntry(this.editedJournalId, this.editedJournalTitle);
        this.editDialog = false;
        await this.fetchJournals(); // Refresh the list
      } catch (error) {
        console.error('Error updating journal entry:', error);
      }
    },
  },
};
</script>
