<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">×</span>
      <h2>Новая Задача</h2>
      <form @submit.prevent="createTask">
        <div class="form-group">
          <label for="title">Название:</label>
          <input type="text" id="title" v-model="newTask.title" required />
        </div>
        <div class="form-group">
          <label for="description">Описание:</label>
          <textarea id="description" v-model="newTask.descr"></textarea>
        </div>
        <div class="form-group">
          <label for="priority">Приоритет:</label>
          <select id="priority" v-model="newTask.prior">
            <option value="Low">Низкий</option>
            <option value="Medium">Средний</option>
            <option value="High">Высокий</option>
          </select>
        </div>
        <button type="submit">Создать</button>
      </form>
    </div>
  </div>
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
      showModal: false,
      newTask: {
        title: '',
        descr: '',
        prior: 'Low',
        status: this.status,
      },
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
      this.$emit('close');
    },
    async createTask() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Обработка ошибки: пользователь не авторизован
          return;
        }

        await axios.post(
          '/api/tasks',
          {
            title: this.newTask.title,
            descr: this.newTask.descr,
            prior: this.newTask.prior,
            status: this.newTask.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.$emit('taskCreated'); // Сообщаем родителю о создании задачи
        this.closeModal(); // Закрываем модальное окно
      } catch (error) {
        console.error('Ошибка при создании задачи:', error);
        // Обработка ошибки создания задачи
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
