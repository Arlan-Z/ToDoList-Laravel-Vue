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
        :status="task.status"
        @task-updated="handleTaskUpdated"
        @close-form="toggleEditing"
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
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const isEditing = ref(false);

    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
    };

    const handleTaskUpdated = () => {
      props.updateTasks();
      toggleEditing();
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
