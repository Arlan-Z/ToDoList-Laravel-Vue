import axios from 'axios';
import { createStore } from 'vuex';

const store = createStore({
  state: {
    tasks: [],
    token: localStorage.getItem('token') || null,
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    clearTasks(state) {
      state.tasks = [];
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  actions: {
    async fetchTasks({ commit, state }) {
      try {
        if (!state.token) return;

        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        commit('setTasks', response.data.data);
      } catch (error) {
        console.error('Ошибка при получении задач:', error);
      }
    },
    clearTasks({ commit }) {
      commit('clearTasks');
    },
    setToken({ commit }, token) {
      commit('setToken', token);
    },
    clearToken({ commit }) {
      commit('clearToken');
    },
  },
  getters: {
    tasks: (state) => state.tasks,
    token: (state) => state.token,
  },
});

export default store;
