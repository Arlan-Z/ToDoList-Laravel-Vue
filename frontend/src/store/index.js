import { createStore } from 'vuex';
import tasksModule from '../modules/tasks';

export default createStore({
  modules: {
    tasks: tasksModule, // Регистрация модуля tasks
  }
});