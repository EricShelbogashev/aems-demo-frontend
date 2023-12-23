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
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import {getJournalContent, updateJournalText} from "@/WebClient";

export default {
  name: 'JournalEdit',
  props: {
    journalId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const journalText = ref('');
    const textRules = [v => !!v || 'Text is required'];

    const fetchJournalContent = async () => {
      try {
        const response = await getJournalContent(props.journalId);
        journalText.value = response.data.journalTextDto.text;
      } catch (error) {
        console.error('Error fetching journal content:', error);
      }
    };

    const saveJournalText = async () => {
      try {
        await updateJournalText(props.journalId, journalText.value);
        // Handle success (e.g., show notification, redirect, etc.)
      } catch (error) {
        console.error('Error updating journal text:', error);
      }
    };

    onMounted(fetchJournalContent);

    return {
      journalText,
      textRules,
      saveJournalText,
    };
  },
};
</script>
