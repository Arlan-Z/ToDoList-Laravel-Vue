import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../components/AuthPage.vue';
import TaskList from '../components/TaskList.vue';

const routes = [
  {
    path: '/',
    name: 'AuthPage',
    component: AuthPage,
  },
  {
    path: '/tasks',
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
    next({ name: 'AuthPage' });
  } else {
    next();
  }
});

export default router;
