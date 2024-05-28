<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-btn unelevated color="primary" label="选择菜品" @click="openSelectFoodDialog" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="materialLists"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <q-card bordered flat class="q-pa-lg">
          <div class="row justify-end">
            <div class="text-subtitle1 col-2">
              账单小计:<span class="text-red text-h5">{{ invoiceData.fei_subtotal_amount }}</span>
            </div>
            <div class="text-subtitle1 col-2">
              总数量:<span class="text-red text-h5">{{ invoiceData.fei_total_number }}</span>
            </div>
            <q-btn unelevated color="primary" label="确认入库" :disable="(invoiceData.fei_total_number > 0 && !addButtonDisabled) ? false : true " @click="setData" />
          </div>
        </q-card>
      </div>
    </div>
   <hl-material-list ref="materialListDialogRef" v-if="showFoodsList" @getSelectedData="getSelectedData" @closeDialog="showFoodsList = false" />

  </q-page>
</template>
<script>
import HlMaterialList from '../hl-material-list'
import AgOperate from './components/AgOperate'
import AgExp from './components/AgExp'

import { date } from 'quasar'
export default {
  name: 'addFoodErpIn',
  components: { AgOperate, HlMaterialList, AgExp },
  data () {
    return {
      listsPoppupStatus: false,
      addButtonDisabled: false,
      invoiceData: {
        fei_subtotal_amount: '0.00',
        fei_total_number: '0.00'
      },

      context: '',
      materialLists: [],
      foodsIdLists: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '批次号',
          field: 'cms_batch_no',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '名称',
          field: 'cms_material_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '单位',
          field: 'cms_material_unit',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '入库价',
          field: 'cms_in_depot_price',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changePrice,
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '数量',
          field: 'cms_quantity',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '保质期',
          field: 'cms_batach_exp',
          cellRendererFramework: 'AgExp',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '小计',
          field: 'cms_subtotal_amount',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '备注',
          field: 'cms_note',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgOperate',
          width: this.nowpx(0.09) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      showFoodsList: false
    }
  },
  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 256
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    setData () {
      this.addButtonDisabled = true
      this.$q
        .dialog({
          title: '是否确定',
          message: '确定入库吗',
          cancel: true
        })
        .onOk(() => {
          const params = {
            materialLists: this.materialLists
          }
          this.$store
            .dispatch('materialManage/setInDepotData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '入库成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({ name: 'materialInIndex' })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
            })
        })
        .onCancel(() => {
          this.addButtonDisabled = false
        })
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^(\d+|\d+\.\d{1,2})$/
      if (!regu.test(data.cms_quantity)) {
        data.cms_quantity = 0
        data.cms_subtotal_amount = 0
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.foodsTotal()
        this.$q.notify({
          message: '注意',
          caption: '请输入正确的数量！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      } else {
        data.cms_subtotal_amount = this.formatAmount(this.formatAmount(data.cms_in_depot_price) * this.formatAmount(data.cms_quantity))
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.foodsTotal()
      }
    },
    changePrice (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^(\d+|\d+\.\d{1,2})$/
      if (!regu.test(data.cms_in_depot_price)) {
        data.cms_in_depot_price = 0
        data.cms_subtotal_amount = 0
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.foodsTotal()
        this.$q.notify({
          message: '注意',
          caption: '请输入正确的单价！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      } else {
        data.cms_subtotal_amount = (this.formatAmount(data.cms_in_depot_price) * this.formatAmount(data.cms_quantity)).toFixed(2)
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.foodsTotal()
      }
    },
    foodsTotal () {
      let totalAmount = 0
      let totalNumber = 0
      const that = this
      if (this.materialLists.length > 0) {
        this.materialLists.forEach(function (value, index, array) {
          totalAmount += that.formatAmount(value.cms_subtotal_amount)
          totalNumber = totalNumber + that.formatAmount(value.cms_quantity)
        })
      } else {
        totalAmount = 0
        totalNumber = 0
      }
      this.invoiceData.fei_subtotal_amount = totalAmount.toFixed(2)
      this.invoiceData.fei_total_number = totalNumber
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    openSelectFoodDialog () {
      this.showFoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.materialListDialogRef.getList()
        }, 500)
      })
    },
    getSelectedData (value) {
      if (value && value.length > 0) {
        const that = this
        value.forEach(function (item, key) {
          that.materialLists.push({
            cms_batch_no: 'RK' + date.formatDate(new Date(), 'x'),
            cms_change_mode: 1,
            cms_material_name: item.cm_name,
            cms_material_unit: item.cm_unit,
            cms_material_id: item.id,
            cms_quantity: 0,
            cms_batach_residue_quantity: 0,
            cms_batach_exp: item.cm_exp_day ? date.formatDate(date.addToDate(new Date(), { days: parseInt(item.cm_exp_day) }), 'YYYY-MM-DD') : date.formatDate(new Date(), 'YYYY-MM-DD'),
            cms_in_depot_price: item.cm_in_depot_price

          })
        })
      }
      this.$nextTick(() => {
        this.foodsTotal()
      })
    }
  }
}
</script>
