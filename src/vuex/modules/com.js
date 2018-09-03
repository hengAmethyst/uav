/**
 * Created by shenzuojun on 2017/8/1.
 * 公共
 */

import * as types from '../types'

const state = {
  token: null,
  account: null,
  userInfo: null,
  selectStore: null,
  mealPeriods: [],
  currentMerchantId: null,
  staffInfo: null,
  department: [],
  servingLength: null,
  storeList: [],
  storeListLength: null,
  dishesAttr:[],
};

const mutations = {
  [types.LOGIN]: (state, data) => {
    localStorage.token = data;
    state.token = data;
  },
  [types.LOGOUT]: (state) => {
    localStorage.removeItem('token');
    localStorage.removeItem('merchantId');
    localStorage.removeItem('account');
    localStorage.removeItem('currentMerchantId');
    state.token = null;
    state.userInfo = null;
    state.account = null;
    state.currentMerchantId = null;
  },
  ACCOUNT: (state, data) => {
    localStorage.account = data;
    state.account = data;
  },
  USERINFO: (state, data) => {
    localStorage.userInfo = data;
    state.userInfo = data;
  },
  SELECTSTORE: (state, data) => {
    state.selectStore = data;
  },
  PERIODS: (state, data) => {
    state.mealPeriods = data;
  },
  CURRENTMERCHANTID: (state, data) => {
    localStorage.currentMerchantId = data;
    state.currentMerchantId = data;
  },
  STAFFINFO: (state, data) => {
    state.staffInfo = data;
  },
  DEPARTMENT: (state, data) => {
    state.department = data
  },
  SERVING: (state, data) => {
    state.servingLength = data
  },
  STORE: (state, data) => {
    state.storeList = data
  },
  STORELISTLENGTH: (state, data) => {
    state.storeListLength = data
  },
  DISHESATTR:(state,data) => {
    state.dishesAttr  = data
  }
};

const getters = {
  token: state => state.token,
  selectStore: state => state.selectStore,
  account: state => state.account,
  periods: state => state.mealPeriods,
  currentMerchantId: state => state.currentMerchantId,
  staffInfo: state => state.staffInfo,
  department: state => state.department,
  serving: state => state.servingLength,
  store: state => state.storeList,
  storeListLength: state => state.storeListLength,
  dishesAttr:state => state.dishesAttr
};

const actions = {
  login({ commit }, token) {
    commit(types.LOGIN, token)
  },
  userInfo({ commit }, id) {
    commit('USERINFO', id)
  },
  logout({ commit }) {
    commit(types.LOGOUT)
  },
  selectStore({ commit }, obj) {
    commit('SELECTSTORE', obj)
  },
  account({ commit }, account) {
    commit('ACCOUNT', account)
  },
  mealPeriods({ commit }, data) {
    commit('PERIODS', data)
  },
  currentMerchantId({ commit }, data) {
    commit('CURRENTMERCHANTID', data)
  },
  staffInfo({ commit }, data) {
    commit('STAFFINFO', data)
  },
  department({ commit }, data) {
    commit('DEPARTMENT', data)
  },
  serving({ commit }, data) {
    commit('SERVING', data)
  },
  store({ commit }, data) {
    commit('STORE', data)
  },
  storeListLength({ commit }, data) {
    commit('STORELISTLENGTH', data)
  },
  dishesAttr({commit},data){
    commit('DISHESATTR',data)
  }
};

export default {
  state,
  mutations,
  getters,
  actions
}
