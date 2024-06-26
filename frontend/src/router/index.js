import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../components/AuthPage.vue';
import TaskList from '../components/TaskList.vue'; // Не забудьте импортировать компонент!

const routes = [
  {
    path: '/',
    name: 'AuthPage',
    component: AuthPage,
  },
  {
    path: '/tasks', // Добавили маршрут для /tasks
    name: 'TaskList',
    component: TaskList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === 'TaskList' && !localStorage.getItem('token')) {
    next({ name: 'AuthPage' }); // Перенаправление на авторизацию
  } else {
    next();
  }
});

export default router;
