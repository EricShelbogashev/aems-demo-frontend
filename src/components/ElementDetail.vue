<template>
  <h1>{{ elementData.name }}</h1>
  <div class="container">
    <div class="inputs-container">
      <div class="input-group">
        <label for="input-name">Название</label>
        <input
          type="text"
          id="input-name"
          v-model="nameValue">
      </div>
      <div class="input-group">
        <label for="input-description">Описание</label>
        <input
          type="text"
          id="input-description"
          v-model="descriptionValue">
      </div>
      <div class="input-group">
        <label for="input-formula">Формула</label>
        <input
          type="text"
          id="input-formula"
          v-model="formulaValue">
      </div>
      <div class="input-group">
        <label for="input-molar-weight">Молярная масса</label>
        <input
          type="text"
          id="input-molar-weight"
          v-model="molarWeightValue"
        >
      </div>
      <div class="input-group">
        <label for="input-category">Категория</label>
      </div>
    </div>
    <div class="values-list">
      <ul>
        <li>Здесь будет запись журнала 1</li>
        <li>Здесь будет запись журнала 2</li>
      </ul>
    </div>
  </div>
  <v-btn
    color="primary"
    @click="updateReagent">
    Сохранить изменения
  </v-btn>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.inputs-container {
  display: flex;
  flex-direction: column;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

}

.input-group label {
  margin-right: 20px;
  width: 100%;
}

.input-group input {
  min-width: 500px;
  width: 100%
}

.values-list ul {
  list-style-type: none;
  padding: 0;
}

.values-list ul li {
  margin-bottom: 5px;
}
</style>

<script>
import {updateReagent} from "@/api-service";

export default {
  props: ['id'],
  data() {
    return {
      elementData: null,
      nameValue: null,
      descriptionValue: null,
      formulaValue: null,
      molarWeightValue: null,
      hazardCategoryValue: null
    };
  },

  created() {
    if (this.$route.query.element) {
      try {
        this.elementData = JSON.parse(this.$route.query.element);
        this.nameValue = this.elementData.name;
        this.descriptionValue = this.elementData.description;
        this.formulaValue = this.elementData.latexFormula;
        this.molarWeightValue = this.elementData.molarWeight;
        this.hazardCategoryValue = this.elementData.hazardCategory
      } catch (e) {
        console.error('Ошибка при десериализации', e);
      }
    }
  },

  methods: {
    async updateReagent() {
      this.elementData.name = this.nameValue;
      this.elementData.description = this.descriptionValue;
      this.elementData.molarWeight = this.molarWeightValue;
      this.elementData.latexFormula = this.formulaValue;
      this.elementData.hazardCategory = this.hazardCategoryValue
      await updateReagent(this.elementData.id, this.elementData);
    }
  }

};
</script>
