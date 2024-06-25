<template>
    <v-container v-if="tasksLoaded">
      <v-select
        v-model="selectedPriority"
        :items="priorityOptions"
        label="Фильтр по приоритету"
        @change="filterTasksByPriority"
      ></v-select>
  
      <v-row v-once> 
        <v-col
          v-for="status in statuses"
          :key="status"
          cols="12"
          md="4"
        >
          <task-column
            :status="status"
            :tasks="tasksByStatus(status)"
            @task-updated="updateTaskInStore" 
          />
        </v-col>
      </v-row>
    </v-container>
    <div v-else>Загрузка задач...</div> 
  </template>
  
  <script>
  import { mapActions, mapGetters, mapState } from 'vuex';
  import TaskColumn from './TaskColumn.vue';
  
  export default {
    components: {
      TaskColumn,
    },
    data() {
      return {
        statuses: ['To Do', 'In Progress', 'Done'],
        priorityOptions: [
          { value: null, text: 'Все' },
          { value: 'low', text: 'Низкий' },
          { value: 'medium', text: 'Средний' },
          { value: 'high', text: 'Высокий' },
        ],
        selectedPriority: null, 
        tasksLoaded: false,
      };
    },
    computed: {
      ...mapGetters('tasks', ['filteredTasks']),
      ...mapState('tasks', ['filter']),
      tasksByStatus() { 
        return (status) => { 
          return this.filteredTasks.filter(task => task.status === status);
        };
      }, 
    },
    methods: {
      ...mapActions('tasks', ['fetchTasks', 'updateTask']), 
      filterTasksByPriority() {
        this.$store.commit('tasks/setFilterPriority', this.selectedPriority); 
      },
      updateTaskInStore(updatedTask) {
        this.updateTask(updatedTask);
      },
    },
    mounted() {
      this.$store.dispatch('tasks/fetchTasks') 
        .then(() => {
          this.tasksLoaded = true; 
        })
        .catch(error => {
          console.error('Ошибка при загрузке задач:', error);
          // Обработайте ошибку, например, покажите сообщение об ошибке
        });
    },
  };
  </script>