import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import Home from '@/views/Home.vue';
import ReagentDetail from "@/components/ReagentDetails.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'JournalGrid',
    component: Home,
    props: () => ({defaultComponent: 'JournalGrid'}),
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
    path: '/journal-details/:journalId',
    name: 'JournalDetails',
    component: Home,
    // Convert the journalId to a number here
    props: (route) => ({
      defaultComponent: 'JournalDetails',
      journalId: parseInt(route.params.journalId as string, 10),
    }),
  },
  {
    path: '/reagent-grid',
    name: 'ReagentGrid',
    component: Home,
    props: () => ({defaultComponent: 'ReagentGrid'}),
  },
  {
    path: '/reagent-details/:reagentId',
    name: 'ReagentDetails',
    component: Home,
    props: (route) => ({
      defaultComponent: 'ReagentDetails',
      reagentId: parseInt(route.params.reagentId as string, 10),
    }),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
