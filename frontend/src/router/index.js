import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import TaskBoard from '../components/TaskBoard.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm, 
  },
  {
    path: '/tasks',
    name: 'TaskBoard',
    component: TaskBoard,
    meta: { requiresAuth: true }, // Добавляем мета-поле для защиты маршрута
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/', 
  }, 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Защита маршрута /tasks
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/'); // Перенаправляем на страницу входа, если нет токена
  } else {
    next();
  }
});

export default router;
