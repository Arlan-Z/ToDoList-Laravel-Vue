<template>
  <div class="task-filter">
    <h3>Сортировка по приоритету:</h3>
    <button @click="toggleSortOrder">
      {{ sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию' }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sortOrder: 'asc',
    };
  },
  watch: {
    sortOrder(newOrder) {
      this.$emit('update:sort', newOrder);
    },
  },
  methods: {
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
};
</script>
