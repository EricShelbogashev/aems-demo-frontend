<template>
  <v-container>
    <v-col>
      <h1 class="journal-title">{{ journalTitle }}</h1>
      <v-row>
        <v-col>
          <div class="description-title">Created at:</div>
          <div class="description-title">Last updated at:</div>
          <div class="description-title">Journal text:</div>

        </v-col>
        <v-col>
          <div class="description-value">{{ formatDate(jornalCreatedAt) }}</div>
          <div class="description-value">{{ formatDate(jornalUpdatedAt) }}</div>
          <div class="description-value">{{ journalText }}</div>
        </v-col>

      </v-row>


    </v-col>

    <!-- New table for displaying usages -->
    <v-data-table
      style="background-color: #141616; color: white"
      :items="usages"
      class="elevation-1">
      <template v-slot:headers>
        <tr style="font-size: 16px; color: white">
          <th>Reagent</th>
          <th>Usage journal title</th>
          <th>Usage journal creation date</th>
          <th>Last usage journal update</th>
          <th>Reason</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Date of use</th>
        </tr>
      </template>

      <template v-slot:item="slotProps">
        <tr style="color: lightgray">
          <td>{{ getReagentNameById(slotProps.item.reagentId) }}</td>
          <td>{{
              slotProps.item.journalEntryResponseDto ? slotProps.item.journalEntryResponseDto.title : ''
            }}
          </td>
          <td>{{
              slotProps.item.journalEntryResponseDto ? formatDate(slotProps.item.journalEntryResponseDto.createdAt) : ''
            }}
          </td>
          <td>{{
              slotProps.item.journalEntryResponseDto ? formatDate(slotProps.item.journalEntryResponseDto.updatedAt) : ''
            }}
          </td>
          <td>{{ slotProps.item.reason }}</td>
          <td>{{ slotProps.item.quantity }}</td>
          <td>{{ slotProps.item.unit }}</td>
          <td>{{ formatDate(slotProps.item.createdAt) }}</td>
        </tr>
      </template>
    </v-data-table>

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
  </v-container>
</template>

<script lang="ts">
import {ref} from 'vue';
import {
  getAllJournals,
  getAllReagents,
  getJournalContent
} from "@/WebClient";

export default {
  name: 'JournalDetails',
  props: {
    journalId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isShowingErrorSnackbar: false,
      isShowingSuccessSnackbar: false,
      snackbarMessage: '',
      journalText: ref(''),
      reagents: ref([]),
      usages: ref([]),
      journalTitle: '',
      jornalCreatedAt: '',
      jornalUpdatedAt: ''
    }
  },

  async mounted() {
    await this.fetchJournalContent();
    await this.fetchReagents();
    await this.fetchJournalInfo();
  },

  methods: {
    formatDate(dateString) {
      const dateObject = new Date(dateString);
      return dateObject.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
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

    getReagentNameById(reagentId) {
      try {
        return this.reagents.find(el => el.id === reagentId).name;
      } catch (error) {
        console.log("Error getting reagent by id: " + error);
      }
    },

    async fetchJournalContent() {
      try {
        const response = await getJournalContent(this.journalId);
        this.journalText = response.data.journalTextDto.text;
        this.usages = response.data.usages;
      } catch (error) {
        console.error('Error fetching journal content:', error);
        this.showErrorSnackbar("Error fetching journal content. Try again")
      }
    },

    async fetchJournalInfo() {
      try {
        const response = await getAllJournals();
        const currentJournal = response.data.find(el => el.id = this.journalId);
        if (currentJournal === undefined) {
          console.error('Error fetching journal info:', error);
          this.showErrorSnackbar("Failed to fetch journal info. Try again");
          return;
        }
        this.journalTitle = currentJournal.title;
        this.jornalCreatedAt = currentJournal.createdAt;
        this.jornalUpdatedAt = currentJournal.updatedAt;
      } catch (error) {
        console.error('Error fetching journals:', error);
        this.showErrorSnackbar("Failed to fetch journals. Try again");
      }
    },

    async fetchReagents() {
      try {
        const response = await getAllReagents();
        this.reagents = response.data;
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching reagents:', error);
          this.showErrorSnackbar("Error fetching reagents");
        }
      }
    },

  }
};
</script>

<style scoped>
.edit-journal-title {
  color: white;
}

.edit-journal-card {
  background-color: #141616;
}

.edit-journal-text-field {
  color: white;
  height: 57px;
  border-radius: 4%;
  margin: 30px 15px;
}

.edit-journal-select-field {
  color: white;
  margin: 30px 15px;
  height: 57px;
}

.add-reagent-usage-button {
  background-color: #718F94;
  color: white;
  width: 100%;
}

.add-reagent-usage-block {
  background-color: #01090F;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.add-usage-fields {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.journal-title {
  color: white;
}

.description-title {
  color: white;
  font-size: 18px;
  margin: 20px;
}

.description-value {
  color: gray;
  font-size: 16px;
  margin: 20px;
}

</style>
