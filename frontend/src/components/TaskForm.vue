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
import { ref } from 'vue';
// import { useRouter } from 'vue-router'; // Удалим, если не используется

export default {
  props: {
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
      default: 'To Do',
    },
  },
  setup(props, { emit }) {
    const taskData = ref({
      title: props.task.title,
      descr: props.task.descr,
      status: props.task.status || props.status,
      prior: props.task.prior,
    });

    const submitForm = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // router.push({ name: 'AuthPage' }); // Удалим, если не используется
          return;
        }

        if (props.task.id) {
          await axios.patch(`/api/tasks/${props.task.id}`, taskData.value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          emit('task-updated'); // Emit event after task is updated
        } else {
          await axios.post('/api/tasks', taskData.value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          emit('task-created');
        }
      } catch (error) {
        console.error('Ошибка при сохранении задачи:', error);
        // ... (обработка ошибок)
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
