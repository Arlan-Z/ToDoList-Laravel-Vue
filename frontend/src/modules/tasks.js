import api from '../services/api';

const state = {
  tasks: [],
  filter: {
    priority: null,
  },
};

const mutations = {
  setTasks(state, tasks) {
    state.tasks = tasks;
  },
  addTask(state, task) {
    state.tasks.push(task);
  },
  updateTask(state, updatedTask) {
    const index = state.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      state.tasks[index] = updatedTask; 
    }
  },
  deleteTask(state, taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
  },
  setFilterPriority(state, priority) {
    state.filter.priority = priority;
  },
};

const actions = {
  fetchTasks({ commit }) {
    return api.getTasks()
      .then(response => {
        commit('setTasks', response.data.data || []);
      })
      .catch(error => {
        console.error('Ошибка при получении задач:', error);
        throw error; 
      });
  },
  createTask({ commit }, taskData) {
    return api.createTask(taskData)
      .then(response => {
        commit('addTask', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Ошибка при создании задачи:', error);
        throw error;
      });
  },
  updateTask({ commit }, taskData) {
    return api.updateTask(taskData.id, taskData)
      .then(response => {
        commit('updateTask', response.data); 
        return response.data;
      })
      .catch(error => {
        console.error('Ошибка при обновлении задачи:', error);
        throw error;
      });
  },
  deleteTask({ commit }, taskId) {
    return api.deleteTask(taskId)
      .then(() => {
        commit('deleteTask', taskId);
      })
      .catch(error => {
        console.error('Ошибка при удалении задачи:', error);
        throw error;
      });
  },
};

const getters = {
  filteredTasks: (state) => {
    let filteredTasks = state.tasks;
    if (state.filter.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === state.filter.priority);
    }
    return filteredTasks;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};