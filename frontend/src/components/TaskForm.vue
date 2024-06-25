<template>
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditing ? 'Редактировать задачу' : 'Создать задачу' }}</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field v-model="taskData.title" label="Название" required :rules="[rules.required]"></v-text-field>
            <v-textarea v-model="taskData.description" label="Описание"></v-textarea>
            <v-select
              v-model="taskData.status"
              :items="statuses"
              label="Статус"
              required
              :rules="[rules.required]"
            ></v-select>
            <v-select
              v-model="taskData.priority"
              :items="priorities"
              label="Приоритет"
              required
              :rules="[rules.required]"
            ></v-select>
            <v-btn type="submit" color="primary" :loading="loading">Сохранить</v-btn>
            <v-btn @click="closeDialog" :disabled="loading">Отмена</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    props: {
      taskToEdit: {
        type: Object,
        default: null, 
      },
    },
    data() {
      return {
        showDialog: false,
        taskData: {
          title: '',
          description: '',
          status: 'To Do',
          priority: 'medium',
        },
        statuses: ['To Do', 'In Progress', 'Done'],
        priorities: ['low', 'medium', 'high'],
        isEditing: false,
        loading: false,
        rules: {
          required: value => !!value || 'Поле обязательно для заполнения',
        },
      };
    },
    computed: {
      dialogTitle() { 
        return this.isEditing ? 'Редактировать задачу' : 'Создать задачу';
      },
    },
    watch: {
      taskToEdit: {
        handler(newVal) {
          if (newVal) {
            this.isEditing = true; 
            this.taskData = { ...newVal }; 
          } else {
            this.isEditing = false;
            this.resetTaskData();
          }
        },
        immediate: true, 
      },
    },
    mounted() {
      this.showDialog = !!this.taskToEdit; 
    },
    methods: {
      ...mapActions('tasks', ['createTask', 'updateTask']),
      handleSubmit() {
        this.loading = true;
        const action = this.isEditing ? this.updateTask : this.createTask; 
  
        action(this.isEditing ?  { id: this.taskData.id, ...this.taskData } : { ...this.taskData }) 
          .then(() => {
            this.closeDialog();
            // Показать сообщение об успехе
          })
          .catch(error => {
            console.error('Ошибка при сохранении задачи:', error);
            // Обработать ошибку, показать сообщение об ошибке
          })
          .finally(() => {
            this.loading = false;
          });
      },
      resetTaskData() {
        this.taskData = {
          title: '',
          description: '',
          status: 'To Do',
          priority: 'medium',
        };
      },
      closeDialog() {
        this.$emit('close'); 
        this.resetTaskData();
        this.showDialog = false;
      },
    },
  };
  </script>