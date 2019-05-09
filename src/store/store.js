import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
   username:''
}
const mutations = {
  setUsername:(state,username)=>{
      state.username=username
      localStorage.setItem('username',username)
  }
}
const getters = {
   username:(state)=>localStorage.getItem('username')
}
const actions = {

}
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})