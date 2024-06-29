<template>
  <div class="task-filter">
    <h3>Сортировка по приоритету:</h3>
    <button @click="toggleSortOrder">
      {{ sortOrder.value === "asc" ? "По возрастанию" : "По убыванию" }}
    </button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup(props, { emit }) {
    const sortOrder = ref("asc");

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      emit("update:sort", sortOrder.value);
    };

    return {
      sortOrder,
      toggleSortOrder,
    };
  },
};
</script>
