<template>
  <div>
    <h2>Авторизация</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Войти</button>
      <button type="button" @click="handleRegister">Регистрация</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

// Устанавливаем базовый URL для Axios
axios.defaults.baseURL = 'http://127.0.0.1:8000';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post('/api/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);
        this.$router.push('/tasks');
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        // Добавьте обработку ошибок, например, вывод сообщения об ошибке
      }
    },
    async handleRegister() {
      try {
        await axios.post('/api/register');
        alert('Регистрация прошла успешно! Теперь вы можете войти.');
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        // Добавьте обработку ошибок, например, вывод сообщения об ошибке
      }
    },
  },
};
</script>
