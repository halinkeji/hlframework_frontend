<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <div class="row text-left">
          <div class="col-2 q-pa-xs">
            <q-select dense v-model="settleStatus" map-options option-label="label" option-value="value" emit-value :options="settleOptions" label="结款状态" />
          </div>
          <div class="col-2 q-pa-xs">
            <q-input disable dense v-model="outData.gii_total" label="入库应付款" />
          </div>
          <div class="col-2 q-pa-xs">
            <q-input disable dense v-model="outData.gii_primarySupplement" label="入库实付款" />
          </div>
          <div class="col-2 q-pa-xs">
            <q-input dense disable v-model="outData.gii_inventoryInCode" label="入库单据号" />
          </div>
          <div class="col-4 q-pa-xs">
            <q-input disable dense v-model="outData.gii_note" label="入库备注" />
          </div>
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham erp-return-table full-height hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="returnGoodsItemListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn
          color="primary"
          @click="confirmReturn()"
          unelevated
          label="确认退货"
          :disable="returnGoodsItemListData.length > 0 ? (newRows[0] ? (formatAmount(newRows[0].giid_returnNumber) > 0 ? false : true) : true) : true"
          class="q-px-xl"
        />
        <q-btn color="grey" unelevated :to="{ name: 'erpIn' }" label="返回" class="q-px-xl" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ReturnGoodsItem',
  data () {
    return {
      gridOptions: {},
      gii_returnQuantity: 0,
      gii_returnAmount: 0,
      goodssupplier_id: 0,
      totalReturnAmount: 0,
      outData: {},
      returnGoodsItemListData: [],
      columnDefs: [
        {
          headerName: '商品条码',
          field: 'giid_goods_code',
          filter: false,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-return': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '商品名称',
          field: 'giid_goodsName',
          filter: false,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-return': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '规格名称',
          field: 'giid_specificationName',
          filter: false
        },
        {
          headerName: '入库数量',
          field: 'giid_goodsNumber',
          filter: false
        },
        {
          headerName: '本次退货数(编辑)',
          field: 'giid_returnNumber',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return !p.data.showEdit
          },

          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '已退数量',
          field: 'retiredQuantity',
          filter: false
        },
        {
          headerName: '购货单价',
          field: 'giid_discountAfterAmount',
          filter: false
        },
        {
          headerName: '购货总价',
          field: 'giid_goodsCashAmount',
          filter: false
        },
        {
          headerName: '本次退款金额',
          field: 'returnAmount',
          filter: false
        },
        {
          headerName: '总退款金额',
          field: 'totalReturnAmount',
          filter: false
        },
        {
          headerName: '仓库',
          field: 'depot.ed_name',
          filter: false,
          pinned: 'right'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gii_returnInvoiceId: 0,
      localeText: this.$ag_grid_localeText,
      newRows: [],
      settleOptions: [
        {
          label: '已结清',
          value: '1'
        },
        {
          label: '未结清',
          value: '0'
        }
      ],
      settleStatus: '1'
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.gii_returnInvoiceId = this.$route.query.id

    this.getList()
  },
  methods: {
    getList () {
      const obj = {
        id: this.gii_returnInvoiceId
      }

      this.$store
        .dispatch('erpin/getThData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.returnGoodsItemListData = res.data.dataItem
            this.outData = res.data.returnInvoice
            if (this.returnGoodsItemListData.length > 0) {
              this.setTopTabel(this.returnGoodsItemListData)
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },

    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const reg = /^[0-9]+\.?[0-9]{0,2}$/

      if (!reg.test(data.giid_returnNumber) && data.giid_returnNumber != null) {
        data.giid_returnNumber = 0
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
      }

      if (parseInt(data.giid_returnNumber) + parseInt(data.retiredQuantity) > parseInt(data.giid_goodsNumber)) {
        data.giid_returnNumber = 0
        this.$q.notify({
          message: '警告',
          caption: '退货数量不能大于入库数量',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
      }

      data.returnAmount = this.formatAmount(data.giid_returnNumber * data.giid_discountAfterAmount)

      itemsToUpdate.push(data)

      const res = p.api.applyTransaction({ update: itemsToUpdate })

      if (this.returnGoodsItemListData.length > 0) {
        this.setTopTabel(this.returnGoodsItemListData)
      }
    },

    // 确认退货
    confirmReturn () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: '确认退货, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            gii_returnInvoiceId: this.gii_returnInvoiceId,
            gii_returnAmount: this.gii_returnAmount,
            gii_returnQuantity: this.gii_returnQuantity,
            goodssupplier_id: this.outData.goodssupplier_id,
            gii_inventoryErpInCode: this.outData.gii_inventoryInCode,
            goodsOutData: this.returnGoodsItemListData,
            settleStatus: this.settleStatus
          }
          this.$store
            .dispatch('erpin/editOutAdd', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: "成功操作退货'" + res.data + "'条商品",
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })

                this.$router.push({ name: 'erpIn' })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        })
    },

    rowSpan (params) {
      const fields = ['giid_goodsName']
      const data = this.returnGoodsItemListData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },

    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          giid_goodsName: '数据合计',
          showEdit: true,
          giid_goodsNumber: '',
          giid_returnNumber: '',
          retiredQuantity: '',
          giid_goodsPrice: '',
          giid_goodsCashAmount: '',
          returnAmount: '',
          totalReturnAmount: ''
        }
      ])
      setTimeout(() => {
        this.newRows = newRows
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      const that = this
      that.gii_returnAmount = 0
      that.gii_returnQuantity = 0
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                if (j == 'returnAmount') {
                  that.gii_returnAmount = oneRowData[j]
                }
                if (j == 'giid_returnNumber') {
                  that.gii_returnQuantity = oneRowData[j]
                }
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          rowData.push(oneRowData)
        })
        return rowData
      }
    },

    // 限制保留小数
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style>
.erp-return-table .cell-span-erp-return {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
