<template>
  <v-container
    class="main-container">
    <v-row class="search-and-button-row">
      <v-col cols="9">
        <v-text-field
          class="search-field"
          variant="outlined"
          clearable
          v-model="searchQuery"
          label="Search Reagent"/>
      </v-col>
      <v-col cols="3">
        <v-btn
          class="add-new-reagent-button"
          @click="openReagentDialog">Add New Reagent
        </v-btn>

      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="reagent in filteredReagents" :key="reagent.id">
        <v-card
          class="reagent-card"
          @click="openReagentDetails(reagent.id)">
          <v-card-title class="reagent-title"
          >{{ reagent.name }}
          </v-card-title>
          <v-card-text class="reagent-text">
            <!--            <div v-html="renderedLatexFormula(reagent.id)"></div>-->
            <div>Formula: {{ reagent.latexFormula }}</div>
            <div>Molar Weight: {{ reagent.molarWeight }}</div>
            <div>Description: {{ reagent.description }}</div>
            <div>Hazard Category: {{ reagent.hazardCategory }}</div>
            <div>Created: {{ formatDate(reagent.createdAt) }}</div>
            <div>Updated: {{ formatDate(reagent.updatedAt) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог для создания нового реагента -->
    <v-dialog v-model="reagentDialog" persistent="" max-width="600px">
      <v-card
      class="reagent-card">
        <v-card-title
          class="reagent-title">New Reagent</v-card-title>
        <v-card-text>
          <v-form
            ref="form">
            <v-text-field
              ref="reagentName"
              class="text-field-dialog"
              variant="outlined"
              v-model="newReagentData.name"
              label="Name"
              :rules="[rules.required, rules.lengthCheck]"
              required></v-text-field>
            <v-text-field
              ref="reagentFormula"
              class="text-field-dialog"
              variant="outlined"
              v-model="newReagentData.latexFormula"
              label="Formula"
              :rules="[rules.required, rules.lengthCheck]"
              required></v-text-field>
            <v-text-field
              ref="reagentMolarWeight"
              class="text-field-dialog"
              variant="outlined"
              v-model="newReagentData.molarWeight"
              label="Molar Weight"
              :rules="[rules.required, rules.positiveIntegerCheck, rules.lengthCheck]"
              type="number"></v-text-field>
            <v-text-field
              ref="reagentDescription"
              class="text-field-dialog"
              variant="outlined"
              v-model="newReagentData.description"
              label="Description"
              required></v-text-field>
            <v-text-field
              ref="reagentHazardCategory"
              class="text-field-dialog"
              variant="outlined"
              v-model="newReagentData.hazardCategory"
              label="Hazard Category"
              :rules="[rules.required, rules.lengthCheck]"
              required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#718F94" text="" @click="reagentDialog = false">Cancel</v-btn>
          <v-btn color="#718F94" text="" @click="submitNewReagent">Create</v-btn>
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
  </v-container>
</template>

<script>
import {getAllReagents, createReagent} from '@/WebClient';
import {VTextField} from "vuetify/components";
import katex from "katex";


export default {
  name: 'ReagentGrid',
  components: {VTextField},
  data() {
    return {
      reagents: [],
      snackbar: false,
      snackbarText: '',
      reagentDialog: false,
      searchQuery: '',
      newReagentData: {
        name: '',
        latexFormula: '',
        molarWeight: '',
        description: '',
        hazardCategory: '',
      },
      rules: {
        required: v => !!v || 'Field is required',
        lengthCheck: v => (v && v.length <= 256) || 'Field must not exceed 256 characters',
        positiveIntegerCheck: v => !isNaN(parseFloat(v)) && isFinite(v) && v > 0 || 'The value must be a positive number'
      },
      isShowingErrorSnackbar: false,
      isShowingSuccessSnackbar: false,
      snackbarMessage: '',
    };
  },

  computed: {
    filteredReagents() {
      if (!this.searchQuery) {
        return this.reagents;
      }
      return this.reagents.filter(reagent =>
        reagent.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  async created() {
    await this.fetchReagents();
  },

  methods: {
    openReagentDetails(reagentId) {
      this.$router.push({name: 'ReagentDetails', params: {reagentId}});
    },

    renderedLatexFormula(id) {
      let reagent = this.reagents.filter(reagent => reagent.id === id).at(0)
      if (reagent != null) {
        const formula = reagent.latexFormula.toString();
        console.log(katex.renderToString(formula, {
          throwOnError: false
        }))
        return katex.renderToString(formula, {
          throwOnError: false
        });
      }
    },

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

    goToTarget(reagent) {
      console.log(reagent)
      this.$router.push({
        name: 'ReagentDetail',
        query: {element: JSON.stringify(reagent)}
      });
    },

    async fetchReagents() {
      try {
        const response = await getAllReagents();
        this.reagents = response.data;
      } catch (error) {
        console.error('Error fetching reagents:', error);
        this.showErrorSnackbar('Failed to fetch reagents');
      }
    },

    openReagentDialog() {
      this.reagentDialog = true;
    },

    async submitNewReagent() {
      const isValid = (await this.$refs.form.validate()).valid;
      if (isValid) {
        await this.addReagent();
      }
    },

    async addReagent() {
      try {
        await createReagent(this.newReagentData);
        this.reagentDialog = false;
        this.newReagentData = {};
        await this.fetchReagents();
        this.showSuccessSnackbar("New reagent added successfully")
      } catch (error) {
        console.log("Error creating reagent:" + error)
        this.showErrorSnackbar('Failed to crate new reagent');
      }
    },
  },
};
</script>

<style scoped>
.main-container {
}

.reagent-card {
  background-color: #141616;
}

.search-field {
  color: white;
  background-color: #252626;
  width: 100%;
  height: 55px;
  min-width: max-content;
}

.reagent-title {
  color: white;
}

.reagent-text {
  color: #505354;
}

.add-new-reagent-button {
  background-color: #718F94;
  color: white;
  width: 100%;
  min-width: max-content;
  height: 55px;
}

.search-and-button-row {
  width: 100%;
  display: flex;
  align-items: stretch;
}

.text-field-dialog {
  color: white;
  width: 100%;
}
</style>
