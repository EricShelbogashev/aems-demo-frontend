import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'JournalGrid',
    component: Home,
    props: () => ({ defaultComponent: 'JournalGrid' }),
  },
  {
    path: '/edit-journal/:journalId',
    name: 'JournalEdit',
    component: Home,
    props: (route) => ({ defaultComponent: 'JournalEdit', journalId: route.params.journalId }),
  },
  {
    path: '/reagent-grid',
    name: 'ReagentGrid',
    component: Home,
    props: () => ({ defaultComponent: 'ReagentGrid' }),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
