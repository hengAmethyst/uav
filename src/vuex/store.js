import Vue from 'vue'
import Vuex from 'vuex'
import Com from './modules/com'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Com
  }
})
