import Vue from 'vue'

import { AgGridVue } from 'ag-grid-vue'
import '../../node_modules/ag-grid-community/dist/styles/ag-grid.css'
import '../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
Vue.component('ag-grid-vue', AgGridVue) // ag-grid表格

import Decimal from 'decimal.js'
Vue.prototype.$q_decimal = Decimal

const _ = require('lodash')
import QrcodeVue from 'qrcode.vue'
Vue.component('qrcode-vue', QrcodeVue)
import { date } from 'quasar'
Vue.prototype.$q_date = date

import localeText from '../assets/ag-grid/localeText.json'
Vue.prototype.$ag_grid_localeText = localeText

import hlPagination from '../components/hl-pagination.vue'
Vue.component('hl-pagination', hlPagination)

import uploadImg from '../components/upload-components/imgList.vue'
Vue.component('upload-img', uploadImg)

import HlCardReading from '../components/hl-card-reading/index.vue'
Vue.component('hl-card-reading', HlCardReading)

import hlEditor from '../components/hl-editor/index.vue'
Vue.component('hl-editor', hlEditor)

import hlAddress from '../components/hl-address/index.vue'
Vue.component('hl-address', hlAddress)

import hlCheckout from '../components/hl-checkout/index.vue'
Vue.component('hl-checkout', hlCheckout)

import hlMenuTree from '../components/hl-menu-tree/index.vue'
Vue.component('hl-menu-tree', hlMenuTree)

import uploadTableMember from '../components/upload-components/tableMember.vue'
Vue.component('upload-table-member', uploadTableMember)

import hlChooseManager from '../components/hl-choose-manager/index.vue'
Vue.component('hl-choose-manager', hlChooseManager)

import hlQqMap from '../components/hl-qq-map/index.vue'
Vue.component('hl-qq-map', hlQqMap)

import hlChooseInvoice from '../components/hl-choose-invoice/index.vue'
Vue.component('hl-choose-invoice', hlChooseInvoice)

import hlKeyboard from '../components/hl-keyboard'
Vue.component('hl-keyboard', hlKeyboard)

import hlDialogCardReading from '../components/hl-dialog-card-reading/index.vue'
Vue.component('hl-dialog-card-reading', hlDialogCardReading)

import hlLocalPrinter from '../components/hl-local-printer/index.vue'
Vue.component('hl-local-printer', hlLocalPrinter)

import hlFoodsList from '../components/hl-foods-list/index.vue'
Vue.component('hl-foods-list', hlFoodsList)

import hlUpload from '../components/hl-upload/index.vue'
Vue.component('hl-upload', hlUpload)
