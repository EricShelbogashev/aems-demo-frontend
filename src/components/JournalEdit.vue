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
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import {deleteJournalEntry, getJournalContent, updateJournalText} from "@/WebClient";
import JournalGrid from "@/components/JournalGrid.vue";
import {tr} from "vuetify/locale";

export default {
  name: 'JournalEdit',
  props: {
    journalId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
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
      } catch (error) {
        console.error('Error fetching journal content:', error);
        errorMessage.value = error.message;
        showErrorSnackbar.value = true;
      }
    };

    const saveJournalText = async () => {
      try {
        await updateJournalText(props.journalId, journalText.value);
        showSuccessSnackbar.value = true;
      } catch (error) {
        console.error('Error updating journal text:', error);
        errorMessage.value = error.message;
        showErrorSnackbar.value = true;
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

    return {
      journalText,
      textRules,
      showSuccessSnackbar,
      showErrorSnackbar,
      errorMessage,
      saveJournalText,
      confirmDelete
    };
  },
};
</script>
