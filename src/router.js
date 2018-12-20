import Vue from "vue";
import Router from "vue-router";
import Login from './views/Login.vue'
import Home from "./views/Home.vue";
import GroupManage from './views/GroupManage.vue'
import UserManage from './views/UserManage.vue'
import PassageManage from './views/PassageManage.vue'
import CreatePassage from './views/CreatePassage.vue'

Vue.use(Router);

export default new Router({
  mode: "history",
  base: '/admin-web',
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      children:[{
        name: 'groupManage',
        path: 'groupManage',
        component: GroupManage
      },{
        name: 'userManage',
        path: 'userManage',
        component: UserManage
      },{
        name: 'passageManage',
        path: 'passageManage',
        component: PassageManage
      },{
        name: 'createPassage',
        path: 'createPassage',
        component: CreatePassage
      }]
    }
  ]
});
