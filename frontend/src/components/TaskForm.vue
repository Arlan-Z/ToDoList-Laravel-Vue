<template>
  <form @submit.prevent="createTask" class="task-form">
    <input
      type="text"
      placeholder="Название задачи"
      v-model="newTask.title"
      required
    />
    <textarea placeholder="Описание задачи" v-model="newTask.descr"></textarea>
    <select v-model="newTask.prior">
      <option value="Low">Низкий</option>
      <option value="Medium">Средний</option>
      <option value="High">Высокий</option>
    </select>
    <button type="submit">Создать</button>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newTask: {
        title: '',
        descr: '',
        prior: 'Low',
        status: this.status,
      },
    };
  },
  methods: {
    async createTask() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/');
          return;
        }

        await axios.post(
          '/api/tasks',
          {
            title: this.newTask.title,
            descr: this.newTask.descr,
            prior: this.newTask.prior,
            status: this.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.$emit('task-created');

        // Очищаем форму
        this.newTask.title = '';
        this.newTask.descr = '';
        this.newTask.prior = 'Low';
      } catch (error) {
        console.error('Ошибка при создании задачи:', error);
        // Обработка ошибки
      }
    },
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
