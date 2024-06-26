// TasksPage.vue

<template>
  <div>
    <v-row>
      <v-col cols="4">
        <h2>To Do</h2>
        <v-card v-for="task in tasksToDo()" :key="task.id">
          <task-card :task="task"></task-card>
        </v-card>
      </v-col>
      <v-col cols="4">
        <h2>In Progress</h2>
        <v-card v-for="task in tasksInProgress()" :key="task.id">
          <task-card :task="task"></task-card>
        </v-card>
      </v-col>
      <v-col cols="4">
        <h2>Done</h2>
        <v-card v-for="task in tasksDone()" :key="task.id">
          <task-card :task="task"></task-card>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';
import TaskCard from './TaskCard.vue'; // Adjust the path as needed

export default {
  components: {
    TaskCard,
  },
  data() {
    return {
      tasks: [],
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.tasks = response.data.data; // Assuming response.data.data is the array of tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    tasksToDo() {
      return this.tasks.filter(task => task.status === 'To Do');
    },
    tasksInProgress() {
      return this.tasks.filter(task => task.status === 'In Progress');
    },
    tasksDone() {
      return this.tasks.filter(task => task.status === 'Done');
    },
  },
};
</script>
