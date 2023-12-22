<template>
  <div
    class="color-block">
    <div class="element-info-text-block">
      <v-card-title class="element-title">{{ element.name }}</v-card-title>
      <v-card-text>{{ element.formula }}</v-card-text>
    </div>
    <!--    <v-img-->
    <!--      :src="''"-->
    <!--      :lazy-src="``"-->
    <!--      aspect-ratio="1"-->
    <!--      cover-->
    <!--      class="bg-grey-lighten-2"-->
    <!--    >-->
    <!--    </v-img>-->
  </div>
</template>

<script>
export default {
  name: 'ElementCard',
  props: {
    element: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.color-block {
  height: 70%;
  background-color: #1B1B1F;
  min-height: 400px;
  max-height: 200px;
  width: 100%;
  position: relative;
  border-radius: 4%;
}

.element-info-text-block {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
}

.element-title {
  color: white;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  text-align: left;
}
</style>
