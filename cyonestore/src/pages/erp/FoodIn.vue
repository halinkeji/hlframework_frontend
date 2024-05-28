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
          :rowData="foodsLists"
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
            <q-btn unelevated color="primary" label="确认入库" :disable="addButtonDisabled" @click="setData" />
          </div>
        </q-card>
      </div>
    </div>
   <hl-foods-list ref="foodListDialogRef" v-if="showFoodsList" @getSelectedFoodsData="getSelectedFoodsData" @closeDialog="showFoodsList = false" />

  </q-page>
</template>
<script>

import AgOperate from './components/AgOperate'
export default {
  name: 'addFoodErpIn',
  components: { AgOperate },
  data () {
    return {
      listsPoppupStatus: false,
      addButtonDisabled: false,
      invoiceData: {
        fei_subtotal_amount: '0.00',
        fei_total_number: '0.00'
      },

      context: '',
      foodsLists: [],
      foodsIdLists: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '名称',
          field: 'fed_goods_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '主规格',
          field: 'fed_spec_mian_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '子规格',
          field: 'fed_spec_son_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '入库价',
          field: 'fed_purchase_price',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changePrice,
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '数量',
          field: 'fed_quantity',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '小计',
          field: 'fed_subtotal_amount',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '备注',
          field: 'fed_remarks',
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
    showLists () {
      this.listsPoppupStatus = true
    },
    hideListsPoppup (data) {
      const that = this
      if (data.length > 0) {
        data.forEach(function (value, index, array) {
          if (!that.foodsIdLists.includes(parseInt(value.id))) {
            that.foodsLists.push(value)
            that.foodsIdLists.push(parseInt(value.id))
          }
        })
      }
      this.listsPoppupStatus = false
    },
    setData () {
      if (parseFloat(this.invoiceData.fei_total_number) <= 0) {
        this.$q.notify({
          message: '失败',
          caption: '请添加入库菜品和数量',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.$q
        .dialog({
          title: '是否确定',
          message: '确定入库吗',
          cancel: true
        })
        .onOk(() => {
          this.addButtonDisabled = true
          const params = {
            ...this.invoiceData,
            foodsLists: this.foodsLists
          }
          this.$store
            .dispatch('fooderp/setData', params)
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
                this.$router.push({ name: 'foodErp' })
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
        .onCancel(() => {})
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^(\d+|\d+\.\d{1,2})$/
      if (!regu.test(data.fed_quantity)) {
        data.fed_quantity = 0
        data.fed_subtotal_amount = 0
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
        data.fed_subtotal_amount = this.formatAmount(this.formatAmount(data.fed_purchase_price) * this.formatAmount(data.fed_quantity))
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.foodsTotal()
      }
    },
    changePrice (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^(\d+|\d+\.\d{1,2})$/
      if (!regu.test(data.fed_purchase_price)) {
        data.fed_purchase_price = 0
        data.fed_subtotal_amount = 0
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
        data.fed_subtotal_amount = (this.formatAmount(data.fed_purchase_price) * this.formatAmount(data.fed_quantity)).toFixed(2)
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.foodsTotal()
      }
    },
    foodsTotal () {
      let totalAmount = 0
      let totalNumber = 0
      const that = this
      if (this.foodsLists.length > 0) {
        this.foodsLists.forEach(function (value, index, array) {
          totalAmount += that.formatAmount(value.fed_subtotal_amount)
          totalNumber = totalNumber + that.formatAmount(value.fed_quantity)
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
          this.$refs.foodListDialogRef.getInquireType([1])
        }, 500)
      })
    },
    getSelectedFoodsData (value) {
      if (value && value.length > 0) {
        this.foodsLists = value.map(item => {
          return {
            fed_goods_name: item.goo_name,
            fed_spec_mian_name: item.spec_main_name,
            fed_spec_son_name: item.spec_son_name,
            fed_purchase_price: item.goo_listPrice,
            fed_quantity: 1,
            fed_subtotal_amount: item.goo_listPrice,
            fed_spec_son_id: item.spec_son_id,
            fed_spec_main_id: item.spec_main_id,
            fed_goods_id: item.id,
            fed_food_id: item.foodId,
            fed_remarks: ''
          }
        })
      }
      this.$nextTick(() => {
        this.foodsTotal()
      })
    }
  }
}
</script>
