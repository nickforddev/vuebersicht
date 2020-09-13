/* eslint-disable import/no-extraneous-dependencies, no-param-reassign */
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { ipcRenderer } from 'electron'

import { getPlace } from '@/utils'
import Place from '@/models/Place'

Vue.use(Vuex)

interface Widget {
  path: string
  visible: boolean
}

interface RootState {
  widgets: Widget[]
  place: Place
  primaryColor: string
}

const storeOptions: StoreOptions<RootState> = {
  state: {
    widgets: [],
    place: new Place(),
    primaryColor: localStorage.getItem('primaryColor') || '#ffffff',
  },
  getters: {
    isUS(state) {
      return state.place.country === 'US'
    },
    language() {
      return Intl.DateTimeFormat().resolvedOptions().locale
    },
  },
  mutations: {
    addWidget(state, widget: Widget) {
      state.widgets.push(widget)
    },
    updateWidget(state, widget: Widget) {
      const old = state.widgets.find(oldWidget => {
        return oldWidget.path === widget.path
      })
      if (old) {
        old.visible = widget.visible
      }
    },
    resetWidgets(state) {
      state.widgets = []
    },
    updateLocation(state, place: Place) {
      state.place = place
    },
    setPrimaryColor(state, color: string) {
      state.primaryColor = color
      localStorage.setItem('primaryColor', color)
      // const root = document.documentElement
      // root.style.setProperty('--primary-color', color)
    },
  },
  actions: {
    addWidget({ commit }, widget: Widget) {
      commit('addWidget', widget)
    },
    updateWidget({ commit }, widget: Widget) {
      commit('updateWidget', widget)
    },
    async getCurrentLocation({ commit }) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const {
            coords: { latitude, longitude },
          } = position
          const { city, state, country } = await getPlace(latitude, longitude)
          commit('updateLocation', {
            city,
            state,
            country,
            latitude,
            longitude,
          })
        },
        error => {
          console.error(error) // eslint-disable-line
        },
        {
          enableHighAccuracy: true,
        },
      )
    },
  },
}

const store = new Vuex.Store<RootState>(storeOptions)

ipcRenderer.on('data', (event, data) => {
  const { type, ...rest } = data
  store.dispatch(type, { ...rest })
})

export default store
