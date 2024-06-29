<template>
  <div>
    <h2>Мои Задачи</h2>
    <TaskFilter @update:sort="updateSortOrder" />
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else class="task-board">
      <div v-for="status in statuses" :key="status" class="column" :data-status="status">
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
        <draggable
          v-model="tasksByStatus[status]"
          group="tasks"
          @end="onEnd"
          item-key="id"
          class="task-list"
          :data-status="status"
        >
          <template #item="{ element }">
            <TaskCard :task="element" :updateTasks="fetchTasks" />
          </template>
          <template #empty>
            <div class="placeholder">Перетащите задачи сюда</div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from "./TaskCard.vue";
import TaskFilter from "./TaskFilter.vue";
import TaskForm from "./TaskForm.vue";
import draggable from "vuedraggable";
import axios from "axios";
import { ref, computed, watchEffect } from "vue";

export default {
  components: {
    TaskCard,
    TaskFilter,
    TaskForm,
    draggable,
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

    const tasksByStatus = ref({
      "To Do": [],
      "In Progress": [],
      Done: [],
    });

    watchEffect(() => {
      tasksByStatus.value["To Do"] = sortedTasksByStatus.value("To Do");
      tasksByStatus.value["In Progress"] = sortedTasksByStatus.value("In Progress");
      tasksByStatus.value["Done"] = sortedTasksByStatus.value("Done");
    });

    const updateSortOrder = (order) => {
      sortOrder.value = order;
    };

    const onEnd = async (event) => {
      const { newIndex, to } = event;
      const newStatus = to ? to.getAttribute("data-status") : null;
      console.log("newIndex:", newIndex, "to:", to, "newStatus:", newStatus);

      if (newStatus) {
        const task = tasksByStatus.value[newStatus][newIndex];
        console.log("task:", task);

        if (task && task.id) {
          if (task.status !== newStatus) {
            task.status = newStatus;

            try {
              const token = localStorage.getItem("token");
              if (!token) {
                // Обработка ошибки: пользователь не авторизован
                return;
              }

              await axios.patch(
                `/api/tasks/${task.id}`,
                { status: newStatus },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              props.fetchTasks();
            } catch (error) {
              console.error("Ошибка при обновлении статуса задачи:", error);
              // Обработка ошибки
            }
          }
        } else {
          console.error("Ошибка: Не удалось получить идентификатор задачи.");
        }
      } else {
        console.error("Ошибка: Не удалось получить новый статус.");
      }
    };

    return {
      isLoading,
      sortOrder,
      showTaskForm,
      statuses,
      sortedTasksByStatus,
      updateSortOrder,
      tasksByStatus,
      onEnd,
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

.task-list {
  min-height: 50px;
}

.loading {
  font-style: italic;
}

.no-tasks {
  color: #888;
}

.placeholder {
  padding: 10px;
  color: #aaa;
  text-align: center;
}
</style>
