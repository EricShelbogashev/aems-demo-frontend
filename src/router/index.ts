import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import ElementDetail from "@/components/ElementDetail.vue";
import ElementList from "@/components/ElementList.vue";

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
    // Convert the journalId to a number here
    props: (route) => ({
      defaultComponent: 'JournalEdit',
      journalId: parseInt(route.params.journalId as string, 10),
    }),
  },
  {
    path: '/reagent-grid',
    name: 'ReagentGrid',
    component: Home,
    props: () => ({ defaultComponent: 'ReagentGrid' }),
  },
  {
    path: '/element-list',
    name: 'ElementList',
    component: ElementList,
    props: true
  },
  {
    path: '/element-detail',
    name: 'ElementDetail',
    component: ElementDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
