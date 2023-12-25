<template>
  <v-container class="main-container">
    <v-row class="search-and-button-row">
      <v-col cols="9">
        <v-text-field
          class="search-field"
          v-model="searchQuery"
          variant="outlined"
          clearable
          label="Search Reagent"/>
      </v-col>
      <v-col cols="3">
        <v-btn
          class="add-new-journal-button"
          height="55px"
          @click="dialog = true">Add New Journal Entry
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="journal in filteredJournals" :key="journal.id">
        <v-card
          class="journal-card">
          <v-card
            class="journal-card"
            @click="openJournalDetails(journal.id)"
          >
            <v-card-title class="journal-title">{{ journal.title }}</v-card-title>
            <v-card-text class="journal-text">
              <div>Created: {{ formatDate(journal.createdAt) }}</div>
              <div>Updated: {{ formatDate(journal.updatedAt) }}</div>
            </v-card-text>
          </v-card>
          <v-card-actions>
            <v-btn text="" color="#718F94" @click="openEditDialog(journal)">Edit title</v-btn>
            <v-spacer></v-spacer>
            <v-btn text="" color="#718F94" @click="editJournal(journal.id)">Edit journal</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диало для создания журнала   -->
    <v-dialog
      v-model="dialog"
      persistent=""
      max-width="600px">
      <v-card
        class="journal-card">
        <v-card-title
          class="journal-title">New Journal Entry
        </v-card-title>
        <v-card-text>
          <v-text-field
            class="edit-title-dialog-name"
            v-model="newJournalTitle"
            label="Journal Title"
            variant="outlined"
            required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#718F94" text="" @click="dialog = false">Cancel</v-btn>
          <v-btn color="#718F94" text="" @click="createJournal">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Диалог для редактирования журнала -->
  <v-dialog
    v-model="editDialog"
    persistent=""
    max-width="600px">
    <v-card
      class="edit-title-dialog">
      <v-card-title class="headline" style="color: white">Edit Journal Entry</v-card-title>
      <v-card-text>
        <v-text-field
          class="edit-title-dialog-name"
          variant="outlined"
          v-model="editedJournalTitle"
          label="Journal Title"
          required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#718F94" text="" @click="editDialog = false">Cancel</v-btn>
        <v-btn color="#718F94" text="" @click="updateJournal">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="isShowingSuccessSnackbar"
    :timeout="2000"
  >
    <div class="snackbar-content">
      <span class="snackbar-message-text">{{ snackbarMessage }}</span>
      <v-btn class="snackbar-success-button" snackbarText @click="isShowingSuccessSnackbar = false">Ok</v-btn>
    </div>
  </v-snackbar>
  <v-snackbar
    v-model="isShowingErrorSnackbar"
    :timeout="2000"
  >
    <div class="snackbar-content">
      <span class="snackbar-message-text">{{ snackbarMessage }}</span>
      <v-btn class="snackbar-error-button" snackbarText @click="isShowingErrorSnackbar = false">Close</v-btn>
    </div>
  </v-snackbar>
</template>

<script>

import {createJournalEntry, getAllJournals, updateJournalEntry} from "@/WebClient";

export default {
  name: 'JournalGrid',
  data() {
    return {
      searchQuery: '',
      journals: [],
      dialog: false,
      newJournalTitle: '',
      editDialog: false,
      editedJournalId: null,
      editedJournalTitle: '',
      snackbarMessage: '',
      isShowingSuccessSnackbar: false,
      isShowingErrorSnackbar: false
    };
  },

  computed: {
    filteredJournals() {
      if (!this.searchQuery) {
        return this.journals;
      }
      return this.journals.filter(journal =>
        journal.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  async created() {
    await this.fetchJournals();
  },

  methods: {
    formatDate(dateString) {
      const dateObject = new Date(dateString);
      return dateObject.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    showSuccessSnackbar(message) {
      this.snackbarMessage = message;
      this.isShowingSuccessSnackbar = true;
    },

    showErrorSnackbar(message) {
      this.snackbarMessage = message;
      this.isShowingErrorSnackbar = true;
    },

    editJournal(journalId) {
      this.$router.push({name: 'JournalEdit', params: {journalId}});
    },

    openJournalDetails(journalId) {
      console.log(journalId);
      this.$router.push({name: 'JournalDetails', params: {journalId}});
    },

    async fetchJournals() {
      try {
        const response = await getAllJournals();
        this.journals = response.data;
      } catch (error) {
        console.error('Error fetching journals:', error);
        this.showErrorSnackbar("Failed to fetch journals. Try again");
      }
    },

    async createJournal() {
      if (!this.newJournalTitle) return;
      try {
        await createJournalEntry(this.newJournalTitle);
        this.newJournalTitle = '';
        this.dialog = false;
        await this.fetchJournals(); // Refresh the list of journals
        this.showSuccessSnackbar("New journal created successfully");
      } catch (error) {
        console.error('Error creating journal:', error);
        this.showErrorSnackbar("Failed to create journal");
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
        this.showSuccessSnackbar("Journal updated successfully");
      } catch (error) {
        console.error('Error updating journal entry:', error);
        this.showErrorSnackbar("Failed to update journal");
      }
    },
  },
};
</script>

<style scoped>
.main-container {
}

.edit-title-dialog {
  background-color: #191B1C;
}

.edit-title-dialog-name {
  color: white;
  width: 100%;
}

.journal-card {
  background-color: #141616;
}

.search-field {
  color: white;
  background-color: #252626;
  width: 100%;
  height: 55px;
  min-width: max-content;
}

.journal-title {
  color: white;
}

.journal-text {
  color: #505354;
}

.add-new-journal-button {
  background-color: #718F94;
  height: 55px;
  color: white;
  width: 100%;
  min-width: max-content;
}


.search-and-button-row {
  width: 100%;
  display: flex;
  align-items: stretch;
}
</style>
