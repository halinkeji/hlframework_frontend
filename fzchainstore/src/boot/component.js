import Vue from 'vue'

import { AgGridVue } from 'ag-grid-vue'
import '../../node_modules/ag-grid-community/dist/styles/ag-grid.css'
import '../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css'
Vue.component('ag-grid-vue', AgGridVue) // ag-grid表格

import Decimal from 'decimal.js'
const _ = require('lodash')

import QrcodeVue from 'qrcode.vue'
Vue.component('qrcode-vue', QrcodeVue)

import { date } from 'quasar'
Vue.prototype.$q_date = date

Vue.prototype.$q_decimal = Decimal
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

import hlSpecificationTree from '../components/hl-specification-tree/index.vue'
Vue.component('hl-specification-tree', hlSpecificationTree)

import hlCheckout from '../components/hl-checkout/index.vue'
Vue.component('hl-checkout', hlCheckout)

import hlMenuTree from '../components/hl-menu-tree/index.vue'
Vue.component('hl-menu-tree', hlMenuTree)

import uploadTableMember from '../components/upload-components/tableMember.vue'
Vue.component('upload-table-member', uploadTableMember)

import uploadTableGoods from '../components/upload-components/tableGoods.vue'
Vue.component('upload-table-goods', uploadTableGoods)

import hlChooseManager from '../components/hl-choose-manager/index.vue'
Vue.component('hl-choose-manager', hlChooseManager)

import hlSelectCountGroup from '../components/hl-select-count-group/index.vue'
Vue.component('hl-select-count-group', hlSelectCountGroup)

import hlSelectTree from '../components/hl-select-tree/index.vue'
Vue.component('hl-select-tree', hlSelectTree)

import hlQqMap from '../components/hl-qq-map/index.vue'
Vue.component('hl-qq-map', hlQqMap)

import hlChooseInvoice from '../components/hl-choose-invoice/index.vue'
Vue.component('hl-choose-invoice', hlChooseInvoice)

import hlSpecificationTreeErp from '../components/hl-specification-tree-erp/index.vue'
Vue.component('hl-specification-tree-erp', hlSpecificationTreeErp)

import hlAutoHeight from '../components/hl-auto-height/index.vue'
Vue.component('hl-auto-height', hlAutoHeight)

import hlTable from '../components/hl-table/index.vue'
Vue.component('hl-table', hlTable)

import hlKeyboard from '../components/hl-keyboard'
Vue.component('hl-keyboard', hlKeyboard)

import hlDialogCardReading from '../components/hl-dialog-card-reading/index.vue'
Vue.component('hl-dialog-card-reading', hlDialogCardReading)

import hlSelectTimeGroup from '../components/hl-select-time-group/index.vue'
Vue.component('hl-select-time-group', hlSelectTimeGroup)

import hlCheckoutPlugin from '../components/hl-checkout-plugin/index.vue'
Vue.component('hl-checkout-plugin', hlCheckoutPlugin)

import hlGoodsTable from '../components/hl-goods-table/index.vue'
Vue.component('hl-goods-table', hlGoodsTable)

import hlLocalPrinter from '../components/hl-local-printer/index.vue'
Vue.component('hl-local-printer', hlLocalPrinter)

import hlAvatar from '../components/hl-avatar/index.vue'
Vue.component('hl-avatar', hlAvatar)

import uploadTablePurchase from '../components/upload-components/tablePurchase.vue'
Vue.component('upload-table-purchase', uploadTablePurchase)

import uploadTableGoodsInfo from '../components/upload-components/tableGoodsInfo.vue'
Vue.component('upload-table-goods-info', uploadTableGoodsInfo)

import hlErpPrint from '../components/hl-erp-print/index.vue'
Vue.component('hl-erp-print', hlErpPrint)

import hlUpload from '../components/hl-upload/index.vue'
Vue.component('hl-upload', hlUpload)

import hlCloudGoodsTable from '../components/hl-cloud-goods-table/index.vue'
Vue.component('hl-cloud-goods-table', hlCloudGoodsTable)
