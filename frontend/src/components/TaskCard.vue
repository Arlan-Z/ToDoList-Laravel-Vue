<template>
  <div class="task-card">
    <h4>{{ task.title }}</h4>
    <p>{{ task.descr }}</p>
    <p>Status: {{ task.status }}</p>
    <p>Priority: {{ task.prior }}</p>
    <button @click="toggleEditing">{{ isEditing ? 'Cancel' : 'Edit' }}</button>
    <div v-if="isEditing">
      <TaskForm :task="task" @task-updated="handleTaskUpdated" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import TaskForm from './TaskForm.vue';

export default {
  components: {
    TaskForm,
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isEditing = ref(false);

    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
    };

    const handleTaskUpdated = () => {
      isEditing.value = false;
      emit('task-updated'); // Добавляем emit для обновления задач
    };

    return {
      isEditing,
      toggleEditing,
      handleTaskUpdated,
    };
  },
};
</script>

<style scoped>
.task-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}
</style>
