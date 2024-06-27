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
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: 60px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}
</style>
