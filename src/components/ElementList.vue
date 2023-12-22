<template>
  <v-container>
    <!--    <v-row>-->
    <!--      <v-col-->
    <!--        v-for="element in elements"-->
    <!--        :key="element.id"-->
    <!--        cols="12"-->
    <!--        md="4"-->
    <!--      >-->
    <!--        <ElementCard :element="element"/>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <v-row>
      <v-col
        v-for="element in elements"
        :key="element.id"
        class="d-flex child-flex"
        cols="4"
      >
        <ElementCard
          :element="element"
          @click="goToTarget(element)"
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {fetchElements} from '@/api-service';
import ElementCard from "@/components/ElementCard.vue";
import {id} from "vuetify/locale";

export default {
  name: 'ElementsList',
  computed: {
    id() {
      return id
    }
  },
  components: {
    ElementCard
  },
  data() {
    return {
      elements: [],
      resultData: null
    };
  },
  created() {
    this.getElements();
  },
  methods: {
    goToTarget(element) {
      console.log(element)
      this.$router.push({
        name: 'ElementDetail',
        query: {element: JSON.stringify(element)}
      });
    },
    async getElements() {
      this.elements = await fetchElements();
    }
  }
}
</script>
