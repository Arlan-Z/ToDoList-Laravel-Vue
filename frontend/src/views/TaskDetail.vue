<template>
  <v-dialog :value="dialog" @input="$emit('update:dialog', $event)" persistent max-width="600px">
    <v-card>
      <v-card-title>{{ task.title }}</v-card-title>
      <v-card-text>
        <div>{{ task.description }}</div>
        <div>Status: {{ task.status }}</div>
        <div>Priority: {{ task.priority }}</div>
        <div>Created At: {{ task.created_at }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TaskDetail',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
  },
});
</script>
