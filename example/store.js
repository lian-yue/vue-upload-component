import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


const state = {
  files: [],
}

const mutations = {
  addFile (state, file) {
    state.files.push(file)
  },
  updateFile (state, {oldFile, newFile}) {
    var index = state.files.indexOf(oldFile)
    if (index == -1) {
      return
    }
    state.files.splice(index, 1, newFile);
  },
  removeFile(state, file) {
    var index = state.files.indexOf(file)
    if (index != -1) {
      state.files.splice(index, 1);
    }
  },
}

const actions = {

}

const getters = {

}


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations
})
