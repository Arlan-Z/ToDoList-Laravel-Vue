<template>
  <div>
    <h2>Мои Задачи</h2>
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else class="task-board">
      <div class="column">
        <h3>To Do</h3>
        <TaskCard v-for="task in toDoTasks" :key="task.id" :task="task" />
      </div>

      <div class="column">
        <h3>In Progress</h3>
        <TaskCard v-for="task in inProgressTasks" :key="task.id" :task="task" />
      </div>

      <div class="column">
        <h3>Done</h3>
        <TaskCard v-for="task in doneTasks" :key="task.id" :task="task" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TaskCard from './TaskCard.vue';

export default {
  components: {
    TaskCard,
  },

  data() {
    return {
      tasks: [],
      isLoading: true,
    };
  },
  computed: {
    toDoTasks() {
      return this.tasks.filter((task) => task.status === 'To Do');
    },
    inProgressTasks() {
      return this.tasks.filter((task) => task.status === 'In Progress');
    },
    doneTasks() {
      return this.tasks.filter((task) => task.status === 'Done');
    },
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        this.$router.push('/');
        return;
      }

      const response = await axios.get('/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.tasks = response.data.data;
    } catch (error) {
      console.error('Ошибка при получении задач:', error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
.task-board {
  display: flex;
  gap: 16px;
}

.column {
  flex: 1;
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
}

.loading {
  font-style: italic;
}

.no-tasks {
  color: #888;
}
</style>
