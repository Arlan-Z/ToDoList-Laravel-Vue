<template>
  <div class="auth-container">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-buttons">
        <button type="submit" class="btn btn-primary">Войти</button>
        <button type="button" class="btn btn-secondary" @click="handleRegister">
          Регистрация
        </button>
      </div>
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
    goToTasks(response = null, isNew = false) {
      try {
        localStorage.setItem('token', response.data.token);
        this.$router.push('/tasks');
        if (isNew) {
          alert(
            `Ваш Логин: ${response.data.email}\nВаш Пароль:${response.data.password}`
          );
        }
      } catch (error) {
        console.error('Токен не валидный', error);
      }
    },
    async handleSubmit() {
      try {
        const response = await axios.post('/api/login', {
          email: this.email,
          password: this.password,
        });
        this.goToTasks(response);
        localStorage.setItem('token', response.data.token);
        this.$router.push('/tasks');
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        // Добавьте обработку ошибок, например, вывод сообщения об ошибке
      }
    },
    async handleRegister() {
      try {
        const response = await axios.get('/api/register');
        this.goToTasks(response, true);
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        // Добавьте обработку ошибок, например, вывод сообщения об ошибке
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.auth-form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.btn {
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
