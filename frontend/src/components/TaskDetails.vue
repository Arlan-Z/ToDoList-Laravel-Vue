<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Детали Задачи</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Название"
              v-model="localTask.title"
              readonly
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Описание"
              v-model="localTask.descr"
              readonly
              outlined
              rows="4"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Приоритет"
              :items="priorities"
              v-model="localTask.prior"
              readonly
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Дата создания"
              v-model="localTask.createdAt"
              readonly
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: true,
      localTask: { ...this.task },
      priorities: ["High", "Medium", "Low"],
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: 500;
}
.v-card {
  margin: auto;
}
</style>
