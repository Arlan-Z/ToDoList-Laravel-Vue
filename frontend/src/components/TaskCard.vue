/* eslint-disable */
<template>
  <v-card :class="priorityClass" class="task-card">
    <v-card-title @click="openModal">{{ task.title }}</v-card-title>
    <v-card-actions>
      <v-btn text @click="toggleEditing">
        {{ isEditing ? 'Отмена' : 'Редактировать' }}
      </v-btn>
      <v-btn text color="error" @click="deleteTask">Удалить</v-btn>
    </v-card-actions>
    <v-dialog v-model="isEditing" max-width="500px">
      <TaskForm
        :task="task"
        :status="task.status"
        @task-updated="handleTaskUpdated"
        @close-form="toggleEditing"
      />
    </v-dialog>
    <v-dialog v-model="showTaskDetails" max-width="500px">
      <TaskDetails :task="task" @close="closeModal" />
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed } from 'vue';
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

    const closeModal = () => {
      showTaskDetails.value = false;
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
    const priorityClass = computed(() => {
      switch (props.task.prior) {
        case 'High':
          return 'high-priority';
        case 'Medium':
          return 'medium-priority';
        case 'Low':
          return 'low-priority';
        default:
          return '';
      }
    });

    return {
      isEditing,
      toggleEditing,
      handleTaskUpdated,
      deleteTask,
      showTaskDetails,
      openModal,
      closeModal,
      priorityClass,
    };
  },
};
</script>

<style scoped>
.v-dialog {
  display: block !important;
}

.task-card {
  margin: 10px 0;
}

.v-card-title {
  cursor: pointer;
}

.v-btn {
  margin: 5px;
}

.high-priority {
  background-color: #f44336 !important;
  color: white;
}

.medium-priority {
  background-color: #ffeb3b !important;
  color: black;
}

.low-priority {
  background-color: #4caf50 !important;
  color: white;
}
</style>
