<template>
  <div>
    <h2>Мои Задачи</h2>
    <TaskFilter @update:sort="updateSortOrder" />
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else class="task-board">
      <div v-for="status in statuses" :key="status" class="column">
        <h3>{{ status }}</h3>
        <button @click="toggleTaskForm(status)">
          {{ showTaskForm[status] ? "Закрыть форму" : "Добавить задачу" }}
        </button>
        <TaskForm
          v-if="showTaskForm[status]"
          :status="status"
          @task-created="handleTaskCreated"
          @task-updated="handleTaskUpdated"
          :updateTasks="fetchTasks"
          v-model:isVisible="showTaskForm[status]"
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
import TaskCard from "./TaskCard.vue";
import TaskFilter from "./TaskFilter.vue";
import TaskForm from "./TaskForm.vue";
import { ref, computed } from "vue";

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
    const sortOrder = ref("asc");
    const isLoading = ref(false);
    const showTaskForm = ref({
      "To Do": false,
      "In Progress": false,
      Done: false,
    });
    const statuses = ["To Do", "In Progress", "Done"];

    const sortTasks = (tasks, order) => {
      const priorityOrder = {
        Low: 1,
        Medium: 2,
        High: 3,
      };

      return [...tasks].sort((a, b) => {
        const priorityA = priorityOrder[a.prior] || 0;
        const priorityB = priorityOrder[b.prior] || 0;

        if (order === "asc") {
          return priorityA - priorityB;
        } else {
          return priorityB - priorityA;
        }
      });
    };

    const sortedTasksByStatus = computed(() => (status) => {
      return sortTasks(
        props.tasks.filter((task) => task.status === status),
        sortOrder.value
      );
    });

    const updateSortOrder = (order) => {
      sortOrder.value = order;
    };

    return {
      isLoading,
      sortOrder,
      showTaskForm,
      statuses,
      sortedTasksByStatus,
      updateSortOrder,
    };
  },
  methods: {
    handleTaskCreated() {
      this.fetchTasks();
    },
    handleTaskUpdated() {
      this.fetchTasks();
    },
    toggleTaskForm(status) {
      this.showTaskForm[status] = !this.showTaskForm[status];
    },
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
