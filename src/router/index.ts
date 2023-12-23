import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import JournalEdit from '@/components/JournalEdit.vue';
import Home from '@/views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/edit-journal/:journalId',
    name: 'JournalEdit',
    component: JournalEdit,
    props: true, // Allows the journalId to be passed as a prop
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
