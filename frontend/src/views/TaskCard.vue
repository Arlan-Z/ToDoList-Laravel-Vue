// TaskCard.vue

<template>
  <v-card>
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-text>{{ task.descr }}</v-card-text>
    <v-card-subtitle>Status: {{ task.status }}</v-card-subtitle>
    <v-card-subtitle>Priority: {{ task.prior }}</v-card-subtitle>
    <v-card-subtitle>Created At: {{ formatCreatedAt(task.createdAt) }}</v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatCreatedAt(createdAt) {
      // Format createdAt as needed, assuming it's in "DD-MM-YYYY HH:mm:ss"
      const [date, time] = createdAt.split(' ');
      const [day, month, year] = date.split('-');
      return `${day}-${month}-${year} ${time}`;
    },
  },
};
</script>
