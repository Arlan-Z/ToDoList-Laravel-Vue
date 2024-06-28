<template>
  <div class="task-card">
    <h4>{{ task.title }}</h4>
    <p>{{ task.descr }}</p>
    <p>Status: {{ task.status }}</p>
    <p>Priority: {{ task.prior }}</p>
    <button @click="toggleEditing">{{ isEditing ? 'Cancel' : 'Edit' }}</button>
    <div v-if="isEditing">
      <TaskForm
        :task="task"
        :updateTasks="updateTasks"
        @task-updated="toggleEditing"
      />
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
    updateTasks: {
      // Добавляем пропс updateTasks
      type: Function,
      required: true,
    },
  },
  setup() {
    const isEditing = ref(false);

    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
    };

    return {
      isEditing,
      toggleEditing,
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
