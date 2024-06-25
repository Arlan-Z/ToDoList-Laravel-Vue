<template>
    <v-card
      class="task-card"
      :class="`priority-${task.priority}`" 
      @click="showDetails = true"
    >
      <v-card-title class="text-truncate">{{ task.title }}</v-card-title>
      <v-card-text class="text-truncate">
        {{ task.description }}
      </v-card-text>
      <v-card-actions>
        <v-btn icon @click.stop="editTask">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click.stop="deleteTask">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
  
      <!-- Диалоговое окно с деталями задачи -->
      <v-dialog v-model="showDetails" max-width="500px">
        <v-card>
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text>
            <p><strong>Описание:</strong> {{ task.description }}</p>
            <p><strong>Приоритет:</strong> {{ task.priority }}</p>
            <p><strong>Статус:</strong> {{ task.status }}</p> 
            <p><strong>Создана:</strong> {{ formatDate(task.created_at) }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="showDetails = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  import moment from 'moment'; // Если нужно форматировать дату
  
  export default {
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showDetails: false,
      };
    },
    methods: {
      ...mapActions('tasks', ['deleteTask']),
      editTask() {
        this.$emit('edit', this.task); 
      },
      deleteTask() {
        if (confirm('Вы уверены, что хотите удалить задачу?')) {
          this.deleteTask(this.task.id)
            .then(() => {
              this.$emit('task-deleted'); 
            })
            .catch(error => {
              console.error('Ошибка при удалении задачи:', error);
              // Обработать ошибку (например, показать сообщение)
            });
        }
      },
      formatDate(dateString) { // Опционально, если нужна форматированная дата
        return moment(dateString).format('DD.MM.YYYY HH:mm'); 
      },
    },
  };
  </script>
  
  <style scoped>
  .task-card {
    cursor: pointer; 
    margin-bottom: 8px;
  }
  
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .priority-low { 
    border-left: 4px solid #4CAF50; /* Зеленый */
  }
  
  .priority-medium { 
    border-left: 4px solid #FFC107; /* Оранжевый */
  }
  
  .priority-high { 
    border-left: 4px solid #F44336; /* Красный */
  }
  </style>