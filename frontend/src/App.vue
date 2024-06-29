<template>
  <div id="app">
    <router-view
      :fetchTasks="fetchTasks"
      :tasks="tasks"
      :updateTasks="fetchTasks"
      @tasks-updated="updateTasks"
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

    const updateTasks = (newTasks) => {
      tasks.value = newTasks;
    };
    onMounted(fetchTasks);
    return {
      tasks,
      fetchTasks,
      updateTasks,
    };
  },
};
</script>
