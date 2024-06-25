<template>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title>{{ status }}</v-card-title>
        <v-card-text>
          <draggable
            :list="tasks"  
            group="tasks"
            @add="onTaskDrop" 
            item-key="id"
          >
            <template #item="{ element }">
              <task-card
                :task="element"
                @edit="editTask"
                @task-deleted="onTaskDeleted"
              />
            </template>
          </draggable>
  
          <v-btn @click="addTask" class="mt-4">Добавить задачу</v-btn>
        </v-card-text>
      </v-card>
  
      <!-- Модальное окно TaskForm -->
      <task-form
        :show-dialog="showTaskForm"
        :task-to-edit="taskToEdit"
        @close="showTaskForm = false"
        @task-updated="onTaskUpdated"
      />
    </v-col>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  import draggable from 'vuedraggable';
  import TaskCard from './TaskCard.vue';
  import TaskForm from './TaskForm.vue';
  
  export default {
    components: {
      TaskCard,
      TaskForm,
      draggable,
    },
    props: {
      status: {
        type: String,
        required: true,
      },
      tasks: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        showTaskForm: false,
        taskToEdit: null,
      };
    },
    methods: {
      ...mapActions('tasks', ['updateTask']),
      onTaskDrop(evt) { 
        const movedTask = evt.moved.element; 
        const newStatus = this.status;
  
        this.updateTask({ id: movedTask.id, status: newStatus })
          .then(() => {
            // Можно обновить локальный список задач или показать сообщение об успехе
          })
          .catch(error => {
            console.error('Ошибка при обновлении статуса задачи:', error);
            // Обработать ошибку (например, показать сообщение)
          });
      },
      addTask() {
        this.showTaskForm = true;
        this.taskToEdit = null;
      },
      editTask(task) {
        this.showTaskForm = true;
        this.taskToEdit = { ...task };
      },
      onTaskUpdated() {
        this.showTaskForm = false;
        // Дополнительная логика после обновления (необязательно)
      },
      onTaskDeleted() {
        // Дополнительная логика после удаления (необязательно)
      },
    },
  };
  </script>