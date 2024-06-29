<template>
  <div class="task-form">
    <input v-model="taskData.title" placeholder="Title" />
    <textarea v-model="taskData.descr" placeholder="Description"></textarea>
    <select v-model="taskData.status">
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
    <select v-model="taskData.prior">
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    <button @click="submitForm">Save</button>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, toRefs, watch } from 'vue';

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Object,
      default: () => ({
        title: '',
        descr: '',
        status: 'To Do',
        prior: 'Low',
      }),
    },
    status: {
      type: String,
      required: true,
    },
    updateTasks: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:isVisible', 'task-created', 'task-updated'],
  setup(props, { emit }) {
    const { task, status, updateTasks } = toRefs(props);

    const taskData = ref({
      title: task.value.title,
      descr: task.value.descr,
      status: task.value.status || status.value,
      prior: task.value.prior,
    });

    watch(
      () => props.isVisible,
      (newVal) => {
        if (newVal) {
          taskData.value = {
            title: task.value.title,
            descr: task.value.descr,
            status: task.value.status || status.value,
            prior: task.value.prior,
          };
        }
      }
    );

    const submitForm = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        if (task.value.id) {
          await axios.patch(`/api/tasks/${task.value.id}`, taskData.value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          emit('task-updated');
        } else {
          await axios.post('/api/tasks', taskData.value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          emit('task-created');
        }
        emit('update:isVisible', false);
        updateTasks.value();
      } catch (error) {
        console.error('Ошибка при сохранении задачи:', error);
      }
    };

    return {
      taskData,
      submitForm,
    };
  },
};
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}

.task-form input[type='text'],
.task-form textarea,
.task-form select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.task-form button[type='submit'] {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.task-form button[type='submit']:hover {
  background-color: #45a049;
}
</style>
