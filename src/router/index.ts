import { createRouter, createWebHistory } from 'vue-router'
import NotesListView from '../views/NotesListView.vue'

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
    }
  ],
})

export default router
