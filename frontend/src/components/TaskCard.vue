<template>
  <div class="task-card">
    <h4>{{ task.title }}</h4>
    <p>{{ task.descr }}</p>
    <p>Status: {{ task.status }}</p>
    <p>Priority: {{ task.prior }}</p>
    <button @click="toggleEditing">{{ isEditing ? 'Cancel' : 'Edit' }}</button>
    <button @click="deleteTask" class="delete-button">Удалить</button>
    <div v-if="isEditing">
      <TaskForm
        :task="task"
        :status="task.status"
        @task-updated="handleTaskUpdated"
        @close-form="toggleEditing"
      />
    </div>
    <TaskDetails
      :task="task"
      v-if="showTaskDetails"
      @close="showTaskDetails = false"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import TaskForm from './TaskForm.vue';
import TaskDetails from './TaskDetails.vue';

export default {
  components: {
    TaskForm,
    TaskDetails,
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
    const showTaskDetails = ref(false);

    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
    };

    const handleTaskUpdated = () => {
      props.updateTasks();
      toggleEditing();
    };

    const openModal = () => {
      showTaskDetails.value = true;
    };

    const deleteTask = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        await axios.delete(`/api/tasks/${props.task.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        props.updateTasks();
      } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
      }
    };

    return {
      isEditing,
      toggleEditing,
      handleTaskUpdated,
      deleteTask,
      showTaskDetails,
      openModal,
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

.delete-button {
  background-color: #f44336;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>
