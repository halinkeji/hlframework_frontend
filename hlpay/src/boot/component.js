import Vue from 'vue'

import { AgGridVue } from 'ag-grid-vue'
import '../../node_modules/ag-grid-community/dist/styles/ag-grid.css'
import '../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
Vue.component('ag-grid-vue', AgGridVue) // ag-grid表格

import QrcodeVue from 'qrcode.vue'
Vue.component('qrcode-vue', QrcodeVue)

const _ = require('lodash')

import { date } from 'quasar'
Vue.prototype.$q_date = date
import Decimal from 'decimal.js'
Vue.prototype.$q_decimal = Decimal

import localeText from '../assets/ag-grid/localeText.json'
Vue.prototype.$ag_grid_localeText = localeText

import hlPagination from '../components/hl-pagination.vue'
Vue.component('hl-pagination', hlPagination)

import uploadImg from '../components/upload-components/imgList.vue'
Vue.component('upload-img', uploadImg)

import fileUpload from '../components/upload-components/fileUpload.vue'
Vue.component('file-upload', fileUpload)

import hlMenuTree from '../components/hl-menu-tree/index.vue'
Vue.component('hl-menu-tree', hlMenuTree)

import JsonViewer from 'vue-json-viewer'

// Import JsonViewer as a Vue.js plugin
Vue.component('vue-json-viewer', JsonViewer)

import VueCanvasPoster from 'vue-canvas-poster'
// 注册组件库
Vue.use(VueCanvasPoster)

import hlUpload from '../components/hl-upload/index.vue'
Vue.component('hl-upload', hlUpload)
