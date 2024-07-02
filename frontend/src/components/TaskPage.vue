<template>
  <v-app>
    <v-main>
      <TaskList :tasks="tasks" />
    </v-main>
  </v-app>
</template>

<script>
import TaskList from './TaskList.vue';
import axios from 'axios';

export default {
  components: {
    TaskList,
  },
  data() {
    return {
      tasks: [],
    };
  },
  methods: {
    async fetchTasks() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/auth');
          return;
        }

        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          this.tasks = response.data;
        } else {
          console.error(
            'Полученные данные не являются массивом:',
            response.data
          );
        }
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      }
    },
  },
  created() {
    this.fetchTasks();
  },
};
</script>

<style scoped></style>
