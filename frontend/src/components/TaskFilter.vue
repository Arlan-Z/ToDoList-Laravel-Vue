<template>
  <v-card outlined>
    <v-card-title>
      <h3>Сортировка по приоритету:</h3>
    </v-card-title>
    <v-card-actions>
      <v-btn color="primary" @click="toggleSortOrder">
        {{ sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(props, { emit }) {
    const sortOrder = ref('asc');

    const toggleSortOrder = () => {
      console.log(sortOrder.value);
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      console.log(sortOrder.value);
      emit('update:sort', sortOrder.value);
    };

    return {
      sortOrder,
      toggleSortOrder,
    };
  },
};
</script>

<style scoped>
.task-filter {
  margin-bottom: 16px;
}
</style>
