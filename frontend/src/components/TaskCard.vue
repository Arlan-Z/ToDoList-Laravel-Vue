<template>
  <div class="task-card">
    <h3>{{ task.title }}</h3>
    <p v-if="task.descr">{{ task.descr }}</p>
    <p>Статус: {{ task.status }}</p>
    <p>Приоритет: {{ task.prior }}</p>
    <p>Создано: {{ task.createdAt }}</p>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Добавьте стили для карточки задачи здесь */
.task-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
