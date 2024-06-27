<template>
  <div>
    <h2>Мои Задачи</h2>
    <TaskFilter @update:sort="updateSortOrder" />
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else class="task-board">
      <div class="column">
        <h3>To Do</h3>
        <button @click="showTaskFormToDo = !showTaskFormToDo">
          {{ showTaskFormToDo ? 'Закрыть форму' : 'Добавить задачу' }}
        </button>
        <TaskForm
          v-if="showTaskFormToDo"
          status="To Do"
          @task-created="fetchTasks"
        />
        <TaskCard v-for="task in sortedToDoTasks" :key="task.id" :task="task" />
      </div>

      <div class="column">
        <h3>In Progress</h3>
        <button @click="showTaskFormInProgress = !showTaskFormInProgress">
          {{ showTaskFormInProgress ? 'Закрыть форму' : 'Добавить задачу' }}
        </button>
        <TaskForm
          v-if="showTaskFormInProgress"
          status="In Progress"
          @task-created="fetchTasks"
        />
        <TaskCard
          v-for="task in sortedInProgressTasks"
          :key="task.id"
          :task="task"
        />
      </div>

      <div class="column">
        <h3>Done</h3>
        <button @click="showTaskFormDone = !showTaskFormDone">
          {{ showTaskFormDone ? 'Закрыть форму' : 'Добавить задачу' }}
        </button>
        <TaskForm
          v-if="showTaskFormDone"
          status="Done"
          @task-created="fetchTasks"
        />
        <TaskCard v-for="task in sortedDoneTasks" :key="task.id" :task="task" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TaskCard from './TaskCard.vue';
import TaskFilter from './TaskFilter.vue';
import TaskForm from './TaskForm.vue';

export default {
  components: {
    TaskCard,
    TaskFilter,
    TaskForm,
  },

  data() {
    return {
      tasks: [],
      isLoading: true,
      sortOrder: 'asc',
      showTaskFormToDo: false,
      showTaskFormInProgress: false,
      showTaskFormDone: false,
    };
  },
  computed: {
    sortedToDoTasks() {
      return this.sortTasks(this.toDoTasks);
    },
    sortedInProgressTasks() {
      return this.sortTasks(this.inProgressTasks);
    },
    sortedDoneTasks() {
      return this.sortTasks(this.doneTasks);
    },
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
  methods: {
    openModal(status) {
      this.showTaskForm = true;
      this.taskFormStatus = status;
    },
    closeModal() {
      this.showTaskForm = false;
    },
    updateSortOrder(order) {
      this.sortOrder = order;
    },
    sortTasks(tasks) {
      const priorityOrder = {
        Low: 1,
        Medium: 2,
        High: 3,
      };

      return [...tasks].sort((a, b) => {
        const priorityA = priorityOrder[a.prior] || 0;
        const priorityB = priorityOrder[b.prior] || 0;

        if (this.sortOrder === 'asc') {
          return priorityA - priorityB;
        } else {
          return priorityB - priorityA;
        }
      });
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
