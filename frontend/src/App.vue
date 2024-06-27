<template>
  <div id="app">
    <router-view
      :fetchTasks="fetchTasks"
      :tasks="tasks"
      @task-updated="fetchTasks"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const tasks = ref([]);
    const router = useRouter();

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push({ name: 'AuthPage' });
          return;
        }

        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        tasks.value = response.data.data;
      } catch (error) {
        console.error('Ошибка при получении задач:', error);
        // ... (обработка ошибок)
      }
    };

    onMounted(fetchTasks); // Вызываем fetchTasks при монтировании

    return {
      tasks,
      fetchTasks,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
