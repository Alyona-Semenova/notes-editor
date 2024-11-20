import { createRouter, createWebHistory } from 'vue-router'
import NotesListView from '../views/NotesListView.vue'
import NotFound from '../components/NotFound.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'notesListView',
      component: NotesListView,
    },
    {
      path: '/todo/:name',
      name: 'noteInfoView',
      component: () => import('../views/NoteInfoView.vue'),
    },
    {
      path: '/add',
      name: 'noteAddView',
      component: () => import('../views/NoteAddView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: NotFound,
    }
  ],
})

export default router
