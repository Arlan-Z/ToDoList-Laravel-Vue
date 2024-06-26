<template>
  <v-card>
    <v-card-title>{{ columnName }}</v-card-title>
    <v-card-actions>
      <v-btn @click="addTask">Add Task</v-btn>
    </v-card-actions>
    <v-card-text>
      <draggable :list="tasks" @end="updateTaskStatus">
        <template v-slot:item="{ element }">
          <task-card :task="element" @view-task="viewTask" @edit-task="editTask"></task-card>
        </template>
      </draggable>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';

export default defineComponent({
  name: 'TaskColumn',
  components: {
    draggable,
    TaskCard,
  },
  props: {
    columnName: {
      type: String,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
  },
  methods: {
    addTask() {
      this.$emit('add-task');
    },
    viewTask(task) {
      this.$emit('view-task', task);
    },
    editTask(task) {
      this.$emit('edit-task', task);
    },
    updateTaskStatus(event) {
      this.$emit('update-task-status', event);
    },
  },
});
</script>
