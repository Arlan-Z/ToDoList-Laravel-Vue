<template>
  <div class="task-card">
    <h3 v-if="!isEditing">{{ task.title }}</h3>
    <input v-else type="text" v-model="editedTask.title" />

    <p v-if="!isEditing && task.descr">{{ task.descr }}</p>
    <textarea v-else-if="isEditing" v-model="editedTask.descr"></textarea>
    <p v-if="!isEditing">Статус: {{ task.status }}</p>
    <select v-else v-model="editedTask.status">
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>

    <p v-if="!isEditing">Приоритет: {{ task.prior }}</p>
    <select v-else v-model="editedTask.prior">
      <option value="Low">Низкий</option>
      <option value="Medium">Средний</option>
      <option value="High">Высокий</option>
    </select>

    <p v-if="!isEditing">Создано: {{ task.createdAt }}</p>

    <div v-if="!isEditing">
      <button @click="startEditing">Редактировать</button>
    </div>
    <div v-else>
      <button @click="saveTask">Сохранить</button>
      <button @click="cancelEditing">Отмена</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      editedTask: { ...this.task },
    };
  },
  methods: {
    startEditing() {
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
      this.editedTask = { ...this.task };
    },
    async saveTask() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Обработка ошибки: пользователь не авторизован
          return;
        }

        await axios.put(`/api/tasks/${this.task.id}`, this.editedTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Генерируем событие об обновлении задачи
        this.$emit('task-updated', this.editedTask);

        this.isEditing = false;
      } catch (error) {
        console.error('Ошибка при сохранении задачи:', error);
        // Обработка ошибки
      }
    },
  },
};
</script>

<style scoped>
/* Добавьте стили для карточки задачи здесь */
.task-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
