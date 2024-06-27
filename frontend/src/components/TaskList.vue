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
import TaskCard from './TaskCard.vue';
import TaskFilter from './TaskFilter.vue';
import TaskForm from './TaskForm.vue';
import mitt from 'mitt';
import { ref } from 'vue';

export default {
  components: {
    TaskCard,
    TaskFilter,
    TaskForm,
  },
  props: {
    fetchTasks: {
      type: Function,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const emitter = mitt();
    emitter.on('taskCreated', props.fetchTasks);

    // Возвращаем данные из setup()
    return {
      emitter,
      isLoading: ref(false), // Делаем isLoading реактивным
      sortOrder: ref('asc'), // Делаем sortOrder реактивным
      showTaskFormToDo: ref(false),
      showTaskFormInProgress: ref(false),
      showTaskFormDone: ref(false),
    };
  },
  data() {
    return {};
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
  mounted() {
    this.emitter.on('task-updated', this.fetchTasks); //
    this.emitter.on('task-created', this.fetchTasks); // Обновляем задачи после создания
    this.emitter.on('task-updated', (updatedTask) => {
      // Находим индекс задачи в массиве tasks
      const taskIndex = this.tasks.findIndex(
        (task) => task.id === updatedTask.id // Исправляем форматирование
      );

      // Вместо изменения this.tasks,
      // генерируем событие и передаем обновленные данные в App.vue:
      if (taskIndex !== -1) {
        this.$emit('tasks-updated', [
          ...this.tasks.slice(0, taskIndex),
          updatedTask,
          ...this.tasks.slice(taskIndex + 1),
        ]);
      }
    });
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
