<template>
  <v-container class="auth-container" style="max-width: 400px">
    <v-card>
      <v-card-title class="text-center">
        <h2>Авторизация</h2>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="errorMessage" type="error" dismissible class="error-container">
          {{ errorMessage }}
        </v-alert>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Пароль"
            type="password"
            required
            outlined
            dense
          ></v-text-field>
          <div class="form-buttons">
            <v-btn type="submit" color="primary" class="mr-2">Войти</v-btn>
            <v-btn @click="handleRegister" color="secondary">Регистрация</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

// Устанавливаем базовый URL для Axios
axios.defaults.baseURL = "http://127.0.0.1:8000";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "", // добавлено поле для сообщения об ошибке
    };
  },
  methods: {
    ...mapActions(["fetchTasks", "clearTasks", "setToken", "clearToken"]),
    async goToTasks(response = null, isNew = false) {
      try {
        const token = response.data.token;
        this.setToken(token);
        this.clearTasks();
        await this.fetchTasks();
        this.$router.push("/tasks");
        if (isNew) {
          alert(
            `Ваш Логин: ${response.data.email}\nВаш Пароль:${response.data.password}`
          );
        }
      } catch (error) {
        console.error("Ошибка при переходе к задачам:", error);
      }
    },
    async handleSubmit() {
      try {
        const response = await axios.post("/api/login", {
          email: this.email,
          password: this.password,
        });
        await this.goToTasks(response);
      } catch (error) {
        console.error("Ошибка авторизации:", error);
        this.errorMessage = "Некорректный email или пароль"; // установка сообщения об ошибке
      }
    },
    async handleRegister() {
      try {
        const response = await axios.get("/api/register");
        await this.goToTasks(response, true);
      } catch (error) {
        console.error("Ошибка регистрации:", error);
        this.errorMessage = "Ошибка регистрации. Попробуйте снова."; // установка сообщения об ошибке
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  margin-top: 50px;
}

.v-card-title {
  font-weight: bold;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.error-container {
  margin-bottom: 20px;
}
</style>
