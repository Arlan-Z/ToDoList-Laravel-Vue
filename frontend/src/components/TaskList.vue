<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2>Мои Задачи</h2>
          </v-card-title>
          <v-card-subtitle>
            <TaskFilter @update:sort="updateSortOrder" />
          </v-card-subtitle>
          <v-card-text>
            <div v-if="isLoading" class="loading">Загрузка...</div>
            <v-row v-else>
              <v-col v-for="status in statuses" :key="status" cols="12" md="4">
                <v-card>
                  <v-card-title>
                    <h3>{{ status }}</h3>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn color="primary" @click="toggleTaskForm(status)">
                      {{ showTaskForm[status] ? "Закрыть форму" : "Добавить задачу" }}
                    </v-btn>
                  </v-card-actions>
                  <TaskForm
                    v-if="showTaskForm[status]"
                    :status="status"
                    @task-created="handleTaskCreated"
                    @task-updated="handleTaskUpdated"
                    :updateTasks="fetchTasks"
                    v-model:isVisible="showTaskForm[status]"
                  />
                  <v-card-text>
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
                        <v-alert type="info" border="left" colored-border>
                          Перетащите задачи сюда
                        </v-alert>
                      </template>
                    </draggable>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TaskCard from "./TaskCard.vue";
import TaskFilter from "./TaskFilter.vue";
import TaskForm from "./TaskForm.vue";
import draggable from "vuedraggable";
import { useStore } from "vuex";
import { ref, computed, watchEffect, onMounted } from "vue";
import axios from "axios";

export default {
  components: {
    TaskCard,
    TaskFilter,
    TaskForm,
    draggable,
  },
  setup() {
    const store = useStore();
    const sortOrder = ref("asc");
    const isLoading = ref(true);
    const showTaskForm = ref({
      "To Do": false,
      "In Progress": false,
      Done: false,
    });
    const statuses = ["To Do", "In Progress", "Done"];
    const tasksByStatus = ref({
      "To Do": [],
      "In Progress": [],
      Done: [],
    });

    const fetchTasks = () => {
      return store.dispatch("fetchTasks");
    };

    const tasks = computed(() => store.getters.tasks);

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
      if (!tasks.value) return [];
      return sortTasks(
        tasks.value.filter((task) => task.status === status),
        sortOrder.value
      );
    });

    watchEffect(() => {
      tasksByStatus.value["To Do"] = sortedTasksByStatus.value("To Do");
      tasksByStatus.value["In Progress"] = sortedTasksByStatus.value("In Progress");
      tasksByStatus.value["Done"] = sortedTasksByStatus.value("Done");
    });

    const updateSortOrder = (order) => {
      sortOrder.value = order;
    };

    const handleTaskCreated = () => {
      fetchTasks();
    };

    const handleTaskUpdated = () => {
      fetchTasks();
    };

    const toggleTaskForm = (status) => {
      showTaskForm.value[status] = !showTaskForm.value[status];
    };

    const onEnd = async (event) => {
      const { newIndex, to } = event;
      const newStatus = to ? to.getAttribute("data-status") : null;
      if (newStatus) {
        const task = tasksByStatus.value[newStatus][newIndex];
        if (task && task.id) {
          if (task.status !== newStatus) {
            task.status = newStatus;
            try {
              const token = store.getters.token;
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
              fetchTasks();
            } catch (error) {
              console.error("Ошибка при обновлении статуса задачи:", error);
            }
          }
        }
      }
    };

    onMounted(() => {
      fetchTasks().finally(() => {
        isLoading.value = false;
      });
    });

    return {
      isLoading,
      sortOrder,
      showTaskForm,
      statuses,
      sortedTasksByStatus,
      updateSortOrder,
      tasksByStatus,
      handleTaskCreated,
      handleTaskUpdated,
      toggleTaskForm,
      onEnd,
      fetchTasks,
    };
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
  text-align: center;
  margin-top: 20px;
}
.placeholder {
  padding: 10px;
  color: #aaa;
  text-align: center;
}
</style>
