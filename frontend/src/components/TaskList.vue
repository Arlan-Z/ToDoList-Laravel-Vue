<template>
  <div>
    <h2>Мои Задачи</h2>
    <TaskFilter @update:sort="updateSortOrder" />
    <div v-if="isLoading.value" class="loading">Загрузка...</div>
    <div v-else class="task-board">
      <div
        v-for="status in statuses"
        :key="status"
        class="column"
      >
        <h3>{{ status }}</h3>
        <button @click="showTaskForm[status] = !showTaskForm[status]">
          {{ showTaskForm[status] ? 'Закрыть форму' : 'Добавить задачу' }}
        </button>
        <TaskForm
          v-if="showTaskForm[status]"
          :status="status"
          @task-created="handleTaskCreated(status)"
          @task-updated="handleTaskUpdated(status)"
          :updateTasks="fetchTasks"
        />
        <TaskCard
          v-for="task in sortedTasksByStatus(status)"
          :key="task.id"
          :task="task"
          :updateTasks="fetchTasks"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from './TaskCard.vue';
import TaskFilter from './TaskFilter.vue';
import TaskForm from './TaskForm.vue';
import mitt from 'mitt';
import { ref} from 'vue';

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
    const sortOrder = ref('asc');
    const isLoading = ref(false);
    const showTaskForm = ref({
      'To Do': false,
      'In Progress': false,
      Done: false,
    });
    const statuses = ['To Do', 'In Progress', 'Done'];

    // Возвращаем данные из setup()
    return {
      emitter,
      isLoading,
      sortOrder,
      showTaskForm,
      statuses,
    };
  },
  data() {
    return {};
  },
  computed: {
    sortedTasksByStatus() { 
      return (status) => {
        return this.sortTasks(
          this.tasks.filter((task) => task.status === status),
          this.sortOrder
        );
      };
    },
  },
  methods: {
    handleTaskCreated(status) {
      this.showTaskForm[status] = false; // Закрываем форму
      this.fetchTasks(); // Обновляем список задач
    },

    handleTaskUpdated(status) {
      this.showTaskForm[status] = false; // Закрываем форму после обновления
    },
    openModal(status) {
      this.showTaskForm = true;
      this.taskFormStatus = status;
    },
    closeModal() {
      this.showTaskForm = false;
    },
    updateSortOrder(order) {
      this.sortOrder.value = order; // Обновляем sortOrder.value
    },
    sortTasks(tasks, sortOrder) {
      const priorityOrder = {
        Low: 1,
        Medium: 2,
        High: 3,
      };

      return [...tasks].sort((a, b) => {
        const priorityA = priorityOrder[a.prior] || 0;
        const priorityB = priorityOrder[b.prior] || 0;

        if (sortOrder.value === 'asc') {
          return priorityA - priorityB;
        } else {
          return priorityB - priorityA;
        }
      });
    },
  },
  mounted() {
    this.emitter.on('task-updated', this.fetchTasks);
    this.emitter.on('task-created', this.fetchTasks);
    this.emitter.on('task-updated', (updatedTask) => {
      const taskIndex = this.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );

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
