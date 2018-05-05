import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)


const Redes1 = () => import('./components/Redes1.vue') //Carga on-demand (lazy load)
const Upload = () => import('./components/Upload.vue')

const router = new VueRouter({
  routes: [
    {path: '/', template: '<div></div>'},
    {path: '/redes1', component: Redes1},
    {path: '/upload', component: Upload},
  ],
  mode: 'hash'
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
