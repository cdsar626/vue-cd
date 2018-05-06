import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(NProgress)


const Redes1 = () => import('./components/Redes1.vue') //Carga on-demand (lazy load)
const Upload = () => import('./components/Upload.vue')

const router = new VueRouter({
  routes: [
    {path: '/', template: ''},
    {path: '/redes1', component: Redes1},
    {path: '/upload', component: Upload},
  ],
  mode: 'hash'
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  NProgress.set(0.1)
  next()
})

router.afterEach(() => {
  setTimeout(() => NProgress.done(), 500)
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
