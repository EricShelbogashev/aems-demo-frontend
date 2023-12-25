<template>
  <v-container
  >
    <v-row>
      <h1 class="reagent-title">{{ nameValue }}</h1>
    </v-row>
    <v-row>
      <v-col>
        <div class="inputs-container">
          <div class="input-group">
            <label for="input-name">Name</label>
            <v-text-field
              variant="outlined"
              class="text-field"
              type="text"
              id="input-name"
              v-model="nameValue"/>
          </div>
          <div class="input-group">
            <label for="input-description">Description</label>
            <v-text-field
              class="text-field"
              variant="outlined"
              type="text"
              id="input-description"
              v-model="descriptionValue"/>
          </div>
          <div class="input-group">
            <label for="input-formula">LaTeX formula</label>
            <v-text-field
              class="text-field"
              variant="outlined"
              type="text"
              id="input-formula"
              v-model="formulaValue"/>
          </div>
          <div class="input-group">
            <label for="input-molar-weight">Molar weight</label>
            <v-text-field
              class="text-field"
              variant="outlined"
              type="text"
              id="input-molar-weight"
              v-model="molarWeightValue"/>
          </div>
          <div class="input-group">
            <label for="input-category">Hazard category</label>
            <v-text-field
              class="text-field"
              variant="outlined"
              type="text"
              id="input-molar-weight"
              v-model="hazardCategoryValue"/>
          </div>
        </div>
        <v-card-actions>
          <!--          <v-btn color="#AF5D63" @click="confirmDelete">Delete reagent</v-btn>-->
          <v-spacer></v-spacer>
          <v-btn
            color="#718F94"
            width="100%"
            @click="updateReagent">
            Save
          </v-btn>
        </v-card-actions>

      </v-col>
      <v-col>
        <v-row v-for="usage in usages" :key="usage.usageId">
          <v-card
            class="usage-card">
            <v-card-title class="usage-title"
            >{{ formatJournalInfo(usage.journalEntryResponseDto.title) }}
            </v-card-title>
            <v-card-text
              class="usage-text">
              <div>Reason: {{ usage.reason }}</div>
              <div>Quantity: {{ usage.quantity }} [{{ usage.unit }}]</div>
              <div>Date: {{ formatDate(usage.createdAt) }}</div>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-row>

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


<script>
import {deleteJournalEntry, deleteReagent, getAllReagents, getReagentUsageStats, updateReagent} from "@/WebClient";
import {ref} from "vue";

export default {
  name: "ReagentDetails",
  props: {
    reagentId: {
      type: Number,
      required: true,
    },
    journalId: {
      type: Number,
      required: true,
    }
  },

  data() {
    return {
      elementData: ref(),
      nameValue: null,
      descriptionValue: null,
      formulaValue: null,
      molarWeightValue: null,
      hazardCategoryValue: null,
      usages: [],
      isShowingSuccessSnackbar: false,
      isShowingErrorSnackbar: false,
      snackbarMessage: '',
    };
  },

  async created() {
    await this.fetchReagentInfo();
  },

  async mounted() {
    await this.fetchReagentInfo();
  },

  methods: {
    async confirmDelete() {
      if (confirm('Are you sure you want to delete this reagent?')) {
        await this.deleteReagent();
      }
    },
    async deleteReagent() {
      try {
        await deleteReagent(this.reagentId)
        this.showSuccessSnackbar("Reagent deleted successfully");
        await this.router.push('/');
      } catch (error) {
        console.error('Failed to delete reagent:', error);
        this.showErrorSnackbar("Failed to delete reagent")
      }
    },
    showSuccessSnackbar(message) {
      this.snackbarMessage = message;
      this.isShowingSuccessSnackbar = true;
    },

    showErrorSnackbar(message) {
      this.snackbarMessage = message;
      this.isShowingErrorSnackbar = true;
    },

    formatDate(dateString) {
      const dateObject = new Date(dateString);
      return dateObject.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },

    formatJournalInfo(journalName) {
      if (journalName === null) {
        return "Usage without a jornal";
      } else {
        return journalName;
      }
    },

    async fetchReagentInfo() {
      try {
        const response = await getAllReagents();
        console.log(response.data);
        console.log(this.$route.params.reagentId);
        let element = response.data.find(el => el.id == this.$route.params.reagentId);
        if (element === undefined) {
          console.error('Error fetching reagent info');
          this.showErrorSnackbar('Failed to fetch reagent info');
          return;
        }
        this.elementData = element;
        console.log(element);
        console.log(this.elementData);
        this.nameValue = this.elementData.name;
        this.descriptionValue = this.elementData.description;
        this.formulaValue = this.elementData.latexFormula;
        this.molarWeightValue = this.elementData.molarWeight;
        this.hazardCategoryValue = this.elementData.hazardCategory
        await this.fetchUsages(element.id);
      } catch (error) {
        console.error('Error fetching reagent info:', error);
        this.showErrorSnackbar('Failed to fetch reagent info');
      }
    },

    async fetchUsages(reagentId) {
      try {
        const response = await getReagentUsageStats(reagentId);
        this.usages = response.data;
      } catch (error) {
        console.error('Error fetching usages:', error);
        this.showErrorSnackbar("Failed to fetch usages");
      }
    },

    async updateReagent() {
      try {
        this.elementData.name = this.nameValue;
        this.elementData.description = this.descriptionValue;
        this.elementData.molarWeight = this.molarWeightValue;
        this.elementData.latexFormula = this.formulaValue;
        this.elementData.hazardCategory = this.hazardCategoryValue
        await updateReagent(this.elementData.id, this.elementData);
        this.showSuccessSnackbar("Updated reagent successfully");
      } catch (error) {
        console.log("Error updating reagent:", error);
        this.showErrorSnackbar("Failed to update reagent");
      }

    }
  }

};

</script>

<style scoped>
.reagent-title {
  color: white;
}

.inputs-container {
  display: flex;
  flex-direction: column;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  outline: white;
}

.input-group label {
  margin-right: 20px;
  width: 100%;
  color: white;
}

.input-group input {
  min-width: 500px;
  width: 100%
}

.text-field {
  color: white;
  width: 100%;
  min-width: max-content;
  background-color: #191B1C;
  height: 56px;
  border-radius: 4%;
}

.usage-title {
  color: white;
}

.usage-card {
  background-color: #191B1C;
  width: 100%;
}

.usage-text {
  color: #505354;
}
</style>
