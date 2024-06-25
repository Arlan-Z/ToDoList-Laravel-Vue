<template>
    <v-container>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
        <v-text-field v-model="password" label="Пароль" type="password" required></v-text-field>
        <v-btn type="submit" :loading="loading">Войти</v-btn>
        <v-btn @click="handleRegister" :loading="loading">Регистрация</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import api from '../services/api'; 
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        loading: false, 
      };
    },
    methods: {
      async handleSubmit() {
        this.loading = true; 
        try {
          const response = await api.login({ email: this.email, password: this.password });
          localStorage.setItem('token', response.data.token);
          this.$router.push('/tasks');
        } catch (error) {
          console.error('Ошибка авторизации:', error);
          // Обработать ошибку
        } finally {
          this.loading = false; 
        }
      },
      async handleRegister() {
        this.loading = true;
        try {
          const response = await api.register(); 
          console.log('Данные нового пользователя:', response.data);
          await this.handleSubmit(); 
        } catch (error) {
          console.error('Ошибка регистрации:', error);
          // Обработать ошибку
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>