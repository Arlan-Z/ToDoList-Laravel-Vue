<template>
  <v-dialog :value="dialog" @input="$emit('update:dialog', $event)" persistent max-width="600px">
    <v-card>
      <v-card-title>{{ isEdit ? 'Edit Task' : 'Add Task' }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="localTask.title" label="Title" required></v-text-field>
          <v-textarea v-model="localTask.description" label="Description" required></v-textarea>
          <v-select v-model="localTask.priority" :items="['Low', 'Medium', 'High']" label="Priority" required></v-select>
          <v-select v-model="localTask.status" :items="['To Do', 'In Progress', 'Done']" label="Status" required></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-btn @click="saveTask">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'TaskForm',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const form = ref(null);
    const localTask = ref({ ...props.task });

    watch(() => props.task, (newTask) => {
      localTask.value = { ...newTask };
    });

    const saveTask = () => {
      if (form.value.validate()) {
        emit('save-task', localTask.value);
      }
    };

    return { form, localTask, saveTask };
  },
});
</script>
