<template>
  <v-container>
    <v-card>
      <v-card-title>Edit Journal</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="journalText"
          label="Journal Text"
          :rules="textRules"
          outlined
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveJournalText">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="confirmDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Snackbar for success notification -->
    <v-snackbar v-model="showSuccessSnackbar">
      Journal text updated successfully.
      <v-btn color="pink" text="" @click="showSuccessSnackbar = false">Close</v-btn>
    </v-snackbar>

    <!-- Snackbar for error notification -->
    <v-snackbar v-model="showErrorSnackbar" color="error">
      Error updating journal text: {{ errorMessage }}
      <v-btn color="pink" text="" @click="showErrorSnackbar = false">Close</v-btn>
    </v-snackbar>

    <!-- New table for displaying usages -->
    <v-data-table
      :headers="headers"
      :items="usages"
      class="elevation-1"
    ></v-data-table>

    <!-- Add Usage Dialog -->
    <v-dialog v-model="showAddUsageDialog" max-width="500px">
      <v-card>
        <v-card-title>Add Reagent Usage</v-card-title>
        <v-card-text>
          <ReagentSelect @update-reagent-id="newUsage.reagentId = $event"/>
          <v-select v-model="newUsage.reason" :items="reasons" label="Reason" variant="outlined"></v-select>
          <v-text-field v-model="newUsage.quantity" label="Quantity" type="number" variant="outlined"></v-text-field>
          <v-select v-model="newUsage.unit" :items="units" label="Unit" variant="outlined"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text="" @click="showAddUsageDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text="" @click="submitUsage">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add a button to open the dialog -->
    <v-btn color="secondary" @click="showAddUsageDialog = true">Add Reagent Usage</v-btn>
  </v-container>
</template>

<script lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {
  addReagentUsageEntry,
  deleteJournalEntry,
  getAllReagents,
  getJournalContent, ReagentDataResponse,
  updateJournalText
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

  setup: function (props) {
    const router = useRouter();
    const journalText = ref('');
    const textRules = [(v: true | "Text is required") => !!v || 'Text is required'];
    const showSuccessSnackbar = ref(false);
    const showErrorSnackbar = ref(false);
    const errorMessage = ref('');

    const fetchJournalContent = async () => {
      try {
        const response = await getJournalContent(props.journalId);
        journalText.value = response.data.journalTextDto.text;
        usages.value = response.data.usages; // Assign usages data
      } catch (error) {
        console.error('Error fetching journal content:', error);
        if (error instanceof Error) {
          errorMessage.value = error.message;
          showErrorSnackbar.value = true;
        }
      }
    };

    const reagents = ref([]);

    onMounted(async () => {
      await fetchJournalContent();
      await fetchReagents();
    });

    const fetchReagents = async () => {
      try {
        const response = await getAllReagents();
        reagents.value = response.data.map((reagent: ReagentDataResponse) => ({
          text: `${reagent.name} (${reagent.latexFormula})`,
          value: reagent.id
        }));
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching reagents:', error);
          errorMessage.value = error.message;
          showErrorSnackbar.value = true;
        }
      }
    };

    const headers = [
      {text: 'Usage ID', value: 'usageId'},
      {text: 'Reagent ID', value: 'reagentId'},
      {text: 'Journal Entry Title', value: 'journalEntryResponseDto.title'},
      {text: 'Reason', value: 'reason'},
      {text: 'Quantity', value: 'quantity'},
      {text: 'Unit', value: 'unit'},
      {text: 'Created At', value: 'createdAt'},
    ];
    const usages = ref([]);

    const saveJournalText = async () => {
      try {
        await updateJournalText(props.journalId, journalText.value);
        showSuccessSnackbar.value = true;
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error updating journal text:', error);
          errorMessage.value = error.message;
          showErrorSnackbar.value = true;
        }
      }
    };

    const confirmDelete = async () => {
      if (confirm('Are you sure you want to delete this journal?')) {
        await deleteJournalEntryLocal();
      }
    };

    // Delete the journal entry
    const deleteJournalEntryLocal = async () => {
      try {
        await deleteJournalEntry(props.journalId)
        await router.push('/');
        showSuccessSnackbar.value = true;
      } catch (error) {
        showErrorSnackbar.value = true
        console.error('Failed to delete journal entry:', error);
        alert('There was an error deleting the journal.');
      }
    };

    onMounted(fetchJournalContent);

    const showAddUsageDialog = ref(false);
    const newUsage = ref({
      reagentId: -1,
      reason: '',
      quantity: null,
      unit: ''
    });
    const units = [
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
    ];

    const reasons = [
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
    ];

    const submitUsage = async () => {
      try {
        const usageData = {
          reagentId: newUsage.value.reagentId,
          journalId: props.journalId, // Assuming journalId is passed as a prop
          reason: newUsage.value.reason,
          quantity: newUsage.value.quantity,
          unit: newUsage.value.unit
        };
        await addReagentUsageEntry(props.journalId, usageData);
        showAddUsageDialog.value = false;
        await fetchJournalContent(); // Refresh content
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error adding reagent usage:', error);
          errorMessage.value = error.message;
          showErrorSnackbar.value = true;
        }
      }
    };

    return {
      journalText,
      textRules,
      showSuccessSnackbar,
      showErrorSnackbar,
      errorMessage,
      saveJournalText,
      confirmDelete,
      headers,
      usages,
      showAddUsageDialog,
      newUsage,
      units,
      reasons,
      submitUsage,
    };
  }
  ,
};
</script>
