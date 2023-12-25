<template>
  <v-container>
    <v-card class="edit-journal-card">
      <v-card-title
        class="edit-journal-title"
      >Edit journal text
      </v-card-title>
      <v-card-text>
        <v-form
          ref="journal-text-form">
          <v-text-field
            class="edit-journal-text-field"
            v-model="journalText"
            label="Journal Text"
            variant="outlined"
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
        <v-card-actions>
          <v-btn color="#718F94" @click="saveJournalText">Save journal text</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

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


    <!-- New table for displaying usages -->
    <v-card class="edit-journal-card">
      <v-row>
        <h1 class="edit-journal-title">
          Usages
        </h1>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn class="add-reagent-usage-button" @click="showAddUsageDialog = true">Add Reagent Usage</v-btn>
        </v-card-actions>
      </v-row>


      <v-data-table
        style="background-color: #141616; color: white"
        :items="usages"
        class="elevation-1">
        <template v-slot:headers>
          <tr style="font-size: 16px; color: white">
            <th>Usage ID</th>
            <th>Reagent ID</th>
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
            <td>{{ slotProps.item.usageId }}</td>
            <td>{{ slotProps.item.reagentId }}</td>
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
            <td>
              <v-btn color="#AF5D63" @click="deleteUsageEntry(slotProps.item.usageId)">Delete</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="#AF5D63" @click="confirmDelete">Delete journal</v-btn>
    </v-card-actions>

    <!-- Add Usage Dialog -->
    <v-dialog v-model="showAddUsageDialog" max-width="500px">
      <v-card class="edit-journal-card">
        <v-card-title class="edit-journal-title">Add Reagent Usage</v-card-title>
        <div class="add-usage-fields">
          <v-form ref="form">
            <ReagentSelect
              style="color: white; width: 100%; min-width: max-content"
              @update-reagent-id="newUsage.reagentId = $event"
              required/>
            <v-select
              class="edit-journal-select-field"
              v-model="newUsage.reason"
              :items="reasons"
              label="Reason"
              variant="outlined"
              :rules="[rules.required]"
              required></v-select>
            <v-text-field
              class="edit-journal-text-field"
              v-model="newUsage.quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              :rules="[rules.required, rules.lengthCheck, rules.positiveIntegerCheck]"
              required></v-text-field>
            <v-select
              class="edit-journal-select-field"
              v-model="newUsage.unit"
              :items="units"
              label="Unit"
              :rules="[rules.required]"
              variant="outlined"></v-select>
          </v-form>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#AF5D63" text="" @click="showAddUsageDialog = false">Cancel</v-btn>
          <v-btn color="#718F94" text="" @click="submitUsage">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {
  addReagentUsageEntry,
  deleteJournalEntry, deleteReagentUsageEntry,
  getAllReagents,
  getJournalContent, updateJournalText
} from "@/WebClient";
import ReagentSelect from "@/components/ReagentSelect.vue";

export default {
  name: 'JournalEdit',
  components: {ReagentSelect},
  props: {
    journalId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      rules: {
        required: v => !!v || 'Field is required',
        lengthCheck: v => (v && v.length <= 256) || 'Field must not exceed 256 characters',
        positiveIntegerCheck: v => !isNaN(parseFloat(v)) && isFinite(v) && v > 0 || 'The value must be a positive number'
      },
      newUsage: ref({
        reagentId: -1,
        reason: '',
        quantity: null,
        unit: ''
      }),
      isShowingErrorSnackbar: false,
      isShowingSuccessSnackbar: false,
      snackbarMessage: '',
      showAddUsageDialog: ref(false),
      router: useRouter(),
      journalText: ref(''),
      reagents: ref([]),
      usages: ref([]),
      searchReagentQuery: '',
      units:
        [
          'MOLE',
          'GRAM',
          'KILOGRAM',
          'LITER',
          'MILLILITER',
          'MICROLITER',
          'NANOLITER',
          'MILLIMOLE',
          'MICROMOLE',
          'NANOMOLE',
          'MOLAR',
          'MILLIGRAM',
          'MICROGRAM',
          'NANOGRAM',
          'PPM',
          'PPB',
          'PPT',
          'MOL_PER_LITER',
          'G_PER_LITER',
          'KG_PER_LITER'
        ],

      reasons:
        [
          'IMPORTED',
          'SYNTHESIZED',
          'USED_FOR_SYNTHESIS',
          'NOT_REGISTERED',
          'USED_FOR_ANALYSIS',
          'EXPIRED',
          'DAMAGED',
          'LOST',
          'STOLEN',
          'USED_FOR_TESTING',
          'USED_FOR_TEACHING',
          'RETURNED',
          'DISPOSED',
          'SAMPLE_TAKEN',
          'ACCIDENTAL_SPILL',
          'QUALITY_CHECK'
        ]
    }
  },

  async mounted() {
    await this.fetchJournalContent();
    await this.fetchReagents();
  },

  async created() {
    console.log("CREATED:" + this.journalId);
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

    async submitUsage() {
      const isValid = (await this.$refs.form.validate()).valid;
      if (this.newUsage.reagentId === -1) {
        this.showErrorSnackbar("You must select a reagent.");
        return;
      }
      if (isValid) {
        try {
          const usageData = {
            reagentId: this.newUsage.reagentId,
            // Assuming journalId is passed as a prop
            journalId: this.journalId,
            reason: this.newUsage.reason,
            quantity: this.newUsage.quantity,
            unit: this.newUsage.unit
          };
          await addReagentUsageEntry(this.journalId, usageData);
          this.showAddUsageDialog = false;
          await this.fetchJournalContent();
          this.newUsage = ref({
            reagentId: -1,
            reason: '',
            quantity: null,
            unit: ''
          });
          this.showSuccessSnackbar("New reagent usage added successfully");
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error adding reagent usage:', error);
            this.showErrorSnackbar("Failed to add reagent usage");
          }
        }
      }
    },

    async saveJournalText() {
      const isValid = (await this.$refs["journal-text-form"].validate()).valid;
      if (isValid) {
        try {
          await updateJournalText(this.journalId, this.journalText);
          this.showSuccessSnackbar("Journal saved successfully");
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error updating journal text:', error);
            this.showErrorSnackbar("Failed to update journal text");
          }
        }
      }
    },

    async confirmDelete() {
      if (confirm('Are you sure you want to delete this journal?')) {
        await this.deleteJournalEntryLocal();
      }
    },

    // Delete the journal entry
    async deleteJournalEntryLocal() {
      try {
        await deleteJournalEntry(this.journalId)
        this.showSuccessSnackbar("Journal deleted successfully");
        await this.router.push('/');
      } catch (error) {
        console.error('Failed to delete journal entry:', error);
        this.showErrorSnackbar("Failed to delete journal entry")
      }
    },

    async deleteUsageEntry(usageId: number) {
      try {
        await deleteReagentUsageEntry(this.journalId, usageId);
        await this.fetchJournalContent();
        this.showSuccessSnackbar("Usage entry deleted successfully");
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting reagent usage entry:', error);
          this.showErrorSnackbar("Failed to delete reagent usage entry");
        }
      }
    },

  }
};
</script>

<style scoped>
.edit-journal-title {
  color: white;
  margin: 25px;
}

.edit-journal-card {
  background-color: #141616;
  margin: 20px;
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
  color: #718F94;
  margin: 20px;
}

.add-usage-fields {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
