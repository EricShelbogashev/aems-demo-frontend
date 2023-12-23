<template>
  <div>
    <h1>API Test Component</h1>

    <button @click="fetchAllJournals">Get All Journals</button>
    <div v-if="journals.length">
      <h2>All Journals:</h2>
      <ul>
        <li v-for="journal in journals" :key="journal.id">{{ journal.title }}</li>
      </ul>
    </div>

    <div>
      <h2>Create a Journal Entry:</h2>
      <input v-model="newJournalTitle" placeholder="Journal Title">
      <button @click="addJournalEntry">Create Journal</button>
    </div>

    <div>
      <h2>Update a Journal Entry:</h2>
      <input v-model.number="updateJournalId" placeholder="Journal ID">
      <input v-model="updateJournalTitle" placeholder="New Journal Title">
      <button @click="updateJournalEntry">Update Journal</button>
    </div>

    <div>
      <h2>Delete a Journal Entry:</h2>
      <input v-model.number="deleteJournalId" placeholder="Journal ID">
      <button @click="deleteJournalEntry">Delete Journal</button>
    </div>

    <div>
      <h2>Update a Reagent:</h2>
      <input v-model.number="updateReagentId" placeholder="Reagent ID">
      <!-- Поля для обновления данных реагента -->
      <button @click="updateReagent">Update Reagent</button>
    </div>

    <div>
      <h2>Delete a Reagent:</h2>
      <input v-model.number="deleteReagentId" placeholder="Reagent ID">
      <button @click="deleteReagent">Delete Reagent</button>
    </div>

    <div>
      <h2>Get All Usage Stats:</h2>
      <button @click="fetchAllUsageStats">Fetch Stats</button>
      <div v-if="allUsageStats">
        <!-- Визуализация статистики использования всех реагентов -->
      </div>
    </div>

    <div>
      <h2>Get Journal Content:</h2>
      <input v-model.number="journalIdForContent" placeholder="Journal ID">
      <button @click="fetchJournalContent">Fetch Content</button>
      <div v-if="journalContent">
        <!-- Вывод содержимого журнала -->
      </div>
    </div>

    <div>
      <h2>Get Reagent Usage Stats:</h2>
      <input v-model.number="reagentId" placeholder="Reagent ID">
      <button @click="getReagentUsageStats">Get Stats</button>

      <div v-if="reagentStats && reagentStats.length">
        <h3>Usage Statistics for Reagent ID: {{ reagentId }}</h3>
        <table>
          <thead>
          <tr>
            <th>Usage ID</th>
            <th>Journal Entry ID</th>
            <th>Title</th>
            <th>Reason</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Created At</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="stat in reagentStats" :key="stat.usageId">
            <td>{{ stat.usageId }}</td>
            <td>{{ stat.journalEntryResponseDto.id }}</td>
            <td>{{ stat.journalEntryResponseDto.title }}</td>
            <td>{{ stat.reason }}</td>
            <td>{{ stat.quantity }}</td>
            <td>{{ stat.unit }}</td>
            <td>{{ stat.createdAt }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>No statistics available for this reagent.</div>
    </div>

    <div>
      <h2>Update Journal Text:</h2>
      <input v-model.number="journalIdToUpdate" placeholder="Journal ID">
      <textarea v-model="newJournalText" placeholder="New Journal Text"></textarea>
      <button @click="updateJournalContent">Update Text</button>
    </div>

    <div>
      <h2>Add Reagent Usage Entry:</h2>
      <input v-model.number="journalIdForUsage" placeholder="Journal ID">
      <!-- Поля для данных об использовании реагента (reagentId, reason, quantity, unit) -->
      <button @click="addUsageEntry">Add Usage Entry</button>
    </div>

    <div>
      <h2>Delete Reagent Usage Entry:</h2>
      <input v-model.number="journalIdForDeletingUsage" placeholder="Journal ID">
      <input v-model.number="usageIdToDelete" placeholder="Usage ID">
      <button @click="deleteUsageEntry">Delete Usage Entry</button>
    </div>

    <div>
      <h2>Delete Journal Entry:</h2>
      <input v-model.number="journalIdToDelete" placeholder="Journal ID">
      <button @click="deleteJournal">Delete Journal</button>
    </div>

    <div>
      <h2>All Reagents:</h2>
      <button @click="fetchAllReagents">Refresh Reagents</button>
      <ul>
        <li v-for="reagent in reagents" :key="reagent.id">{{ reagent.name }}</li>
      </ul>
    </div>

    <div>
      <h2>Create New Reagent:</h2>
      <!-- Поля для ввода данных нового реагента (например, name, formula, etc.) -->
      <button @click="addReagent">Create Reagent</button>
    </div>
  </div>
</template>

<script lang="js">
import {
  addReagentUsageEntry,
  createJournalEntry, createReagent,
  deleteJournalEntry, deleteReagent, deleteReagentUsageEntry,
  getAllJournals, getAllReagents, getAllUsageStats, getJournalContent,
  getReagentUsageStats,
  updateJournalEntry, updateJournalText, updateReagent
} from "@/WebClient";

export default {
  data() {
    return {
      journals: [],
      newJournalTitle: '',
      updateJournalId: null,
      updateJournalTitle: '',
      deleteJournalId: null,
      reagentId: null,
      reagentStats: null,
      updateReagentId: null,
      deleteReagentId: null,
      allUsageStats: null,
      journalIdForContent: null,
      journalContent: null,
      reagentIdForStats: null,
      reagentUsageStats: null,
      journalIdToUpdate: null,
      newJournalText: '',
      journalIdForUsage: null,
      // Данные для добавления использования реагента
      journalIdForDeletingUsage: null,
      usageIdToDelete: null,
      journalIdToDelete: null,
      reagents: [],
      newReagentData: { /* структура ReagentData */},
    };
  },
  methods: {
    async fetchAllJournals() {
      try {
        const response = await getAllJournals();
        this.journals = response.data;
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    },
    async addJournalEntry() {
      if (!this.newJournalTitle) return;
      try {
        await createJournalEntry(this.newJournalTitle);
        this.newJournalTitle = '';
        await this.fetchAllJournals(); // Обновить список журналов
      } catch (error) {
        console.error('Error creating journal entry:', error);
      }
    },
    async updateJournalEntry() {
      if (!this.updateJournalId || !this.updateJournalTitle) return;
      try {
        await updateJournalEntry(this.updateJournalId, this.updateJournalTitle);
        this.updateJournalTitle = '';
        await this.fetchAllJournals(); // Обновить список журналов
      } catch (error) {
        console.error('Error updating journal entry:', error);
      }
    },

    async deleteJournalEntry() {
      if (!this.deleteJournalId) return;
      try {
        await deleteJournalEntry(this.deleteJournalId);
        await this.fetchAllJournals(); // Обновить список журналов
      } catch (error) {
        console.error('Error deleting journal entry:', error);
      }
    },

    async getReagentUsageStats() {
      if (!this.reagentId) return;
      try {
        const response = await getReagentUsageStats(this.reagentId);
        this.reagentStats = response.data;
      } catch (error) {
        console.error('Error fetching reagent stats:', error);
      }
    },

    async updateReagent() {
      // Предполагается, что у вас есть данные для обновления реагента
      const reagentData = {
        "name": "Updated Chemical",
        "latexFormula": "C6H12O6",
        "molarWeight": 180.16,
        "description": "This is an updated chemical substance.",
        "hazardCategory": "TOXIC"
      };
      try {
        await updateReagent(this.updateReagentId, reagentData);
        // Обновить данные после успешного запроса
      } catch (error) {
        console.error('Error updating reagent:', error);
      }
    },

    async deleteReagent() {
      try {
        await deleteReagent(this.deleteReagentId);
        // Обновить данные после успешного запроса
      } catch (error) {
        console.error('Error deleting reagent:', error);
      }
    },

    async fetchAllUsageStats() {
      try {
        const response = await getAllUsageStats();
        this.allUsageStats = response.data;
      } catch (error) {
        console.error('Error fetching all usage stats:', error);
      }
    },

    async fetchJournalContent() {
      if (!this.journalIdForContent) return;
      try {
        const response = await getJournalContent(this.journalIdForContent);
        this.journalContent = response.data;
      } catch (error) {
        console.error('Error fetching journal content:', error);
      }
    },

    async updateJournalContent() {
      if (!this.journalIdToUpdate || !this.newJournalText) return;
      try {
        await updateJournalText(this.journalIdToUpdate, this.newJournalText);
        this.newJournalText = '';
        // Вы можете обновить интерфейс здесь, если необходимо
      } catch (error) {
        console.error('Error updating journal text:', error);
      }
    },
    async addUsageEntry() {
      const usageData = {
        "reagentId": 3,
        "journalId": 4,
        "reason": "DAMAGED",
        "quantity": 34.3426,
        "unit": "NANOMOLE"
      };
      try {
        await addReagentUsageEntry(this.journalIdForUsage, usageData);
        // Обновить интерфейс или выполнить другие действия после успешного добавления
      } catch (error) {
        console.error('Error adding usage entry:', error);
      }
    },

    async deleteUsageEntry() {
      try {
        await deleteReagentUsageEntry(this.journalIdForDeletingUsage, this.usageIdToDelete);
        // Обновить интерфейс или выполнить другие действия после успешного удаления
      } catch (error) {
        console.error('Error deleting usage entry:', error);
      }
    },

    async deleteJournal() {
      try {
        await deleteJournalEntry(this.journalIdToDelete);
        // Обновить интерфейс или выполнить другие действия после успешного удаления
      } catch (error) {
        console.error('Error deleting journal:', error);
      }
    },
    async fetchAllReagents() {
      try {
        const response = await getAllReagents();
        this.reagents = response.data;
      } catch (error) {
        console.error('Error fetching reagents:', error);
      }
    },

    async addReagent() {
      try {
        await createReagent(this.newReagentData);
        this.newReagentData = {
          "name": "Updated Chemical",
          "latexFormula": "C6H12O6",
          "molarWeight": 180.16,
          "description": "This is an updated chemical substance.",
          "hazardCategory": "TOXIC"
        };
        await this.fetchAllReagents(); // Обновить список реагентов
      } catch (error) {
        console.error('Error creating reagent:', error);
      }
    },
  },
};
</script>

<style scoped>
</style>
