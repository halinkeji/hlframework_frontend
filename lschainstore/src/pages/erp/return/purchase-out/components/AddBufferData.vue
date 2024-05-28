<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md ">
        <div class="q-gutter-xs row ">
          <q-btn color="grey" unelevated :to="{ name: 'erpOut', params: { tab: '6' } }" label="返回" />

          <q-btn
            v-if="storeOutData.cep_if_pack == '1' && purchaseReturnOutBuffer.length > 1"
            color="secondary"
            unelevated
            label="装箱信息"
            :disable="purchaseReturnOutBuffer.length > 1 ? false : true"
            @click="showPackingData"
          />

          <q-btn
            color="warning"
            :disable="storeOutData.cep_status < 2 ? false : true"
            v-if="authorityMeta('hangup')"
            @click="hangupOrderData"
            unelevated
            label="挂起"
          />
          <q-btn
            color="primary"
            :disable="storeOutData.cep_status == 1 || storeOutData.cep_status == 5 ? false : true"
            v-if="authorityMeta('save')"
            @click="saveOrderData"
            unelevated
            label="保存"
          />
          <q-btn
            color="primary"
            :disable="storeOutData.cep_status == 1 ? false : true"
            v-if="authorityMeta('confirm')"
            @click="confirmOrderData"
            unelevated
            label="确认"
          />
          <q-btn
            color="positive"
            :disable="storeOutData.cep_status == 2 ? false : true"
            v-if="authorityMeta('audit')"
            @click="auditOrderData"
            unelevated
            label="审核"
          />

          <q-btn
            color="negative"
            :disable="storeOutData.cep_status == 3 ? false : true"
            v-if="authorityMeta('revoke')"
            @click="cancelAudit"
            unelevated
            label="取消审核"
          />
          <q-btn
            color="red"
            :disable="storeOutData.cep_status == 2 ? false : true"
            v-if="authorityMeta('cancel')"
            @click="cancelOrderConfirmData"
            unelevated
            label="取消确认"
          />
          <q-btn
            color="red"
            :disable="storeOutData.cep_status == 1 ? false : true"
            v-if="authorityMeta('close')"
            @click="closeOrderData"
            unelevated
            label="作废"
          />
          <q-btn
            color="green-7"
            :disable="storeOutData.cep_status == 2 ? false : true"
            @click="clickOutDepot"
            unelevated
            label="直接出库"
          />

          <q-btn
            color="positive"
            :disable="storeOutData.cep_status == 3 ? false : true"
            @click="clickOutDepot"
            unelevated
            label="确认出库"
          />
          <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="purchaseReturnOutBuffer.length == 0 && storeInId < 1" />

          <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="purchaseReturnOutBuffer.length > 0 && storeInId > 0" />
          <q-space />
          <q-btn flat color="black" icon="dialpad">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item tag="label" v-ripple v-for="(item, key) in columnDefs" :key="key">
                  <q-item-section side top>
                    <q-checkbox v-model="sideBarColumn" @input="changeShowColumn" :val="item.headerName" />
                  </q-item-section>

                  <q-item-section v-if="item.headerName">
                    <q-item-label>{{ item.headerName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
      <div class="col-shrink bg-white q-pa-md q-pb-md row">

        <div class="col-2" v-if="purchaseReturnOrderData && purchaseReturnOrderData.id">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseReturnOrderData.cep_contract_number }}</q-item-label>
              <q-item-label caption lines="2">退货单据号</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col" v-if="purchaseReturnOrderData && purchaseReturnOrderData.id">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseReturnOrderData.cep_depot_name }}</q-item-label>
              <q-item-label caption lines="2">退货仓库</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col" v-if="purchaseReturnOrderData && purchaseReturnOrderData.id">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseReturnOrderData.cep_total_purchase_amount }}</q-item-label>
              <q-item-label caption lines="2">退货金额</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col" v-if="purchaseReturnOrderData && purchaseReturnOrderData.id">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseReturnOrderData.cep_total_purchase_num }}</q-item-label>
              <q-item-label caption lines="2">退货总数量</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold text-primary">{{ storeOutData.cep_total_purchase_amount }}</q-item-label>
              <q-item-label caption lines="2">出库账单小计</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold text-primary">{{ storeOutData.cep_total_purchase_num }}</q-item-label>
              <q-item-label caption lines="2">出库总数量</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">
                 <span v-if="storeOutData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="storeOutData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="storeOutData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="storeOutData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="storeOutData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="storeOutData.cep_status == 6" class="">出库中</span>
                  <span v-if="storeOutData.cep_status == 7" class="">已出库</span>
                  <span v-if="storeOutData.cep_status == 8" class="">退回成功</span>
              </q-item-label>
              <q-item-label caption lines="2">单据状态</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-2">
          <q-input
            type="textarea"
            :disable="storeOutData.cep_status < 2 ? false : true"
            outlined
            v-model="storeOutData.cep_note"
            label="备注"
            dense
            :rows="1"
          />
        </div>
      </div>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="purchaseReturnOutBuffer"
          :rowDragManaged="true"
          :gridOptions="gridOptions"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :context="context"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        >
        </ag-grid-vue>
      </div>
    </div>
    <show-packing ref="showDataRef" v-if="showPackingStatus" @dataList="showPackingStatus = false" />
    <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
  </q-page>
</template>

<script>
import ShowPacking from 'pages/erp/packing/components/ShowPacking'
export default {
  name: 'AddGoods',
  components: {
    ShowPacking
  },
  data () {
    return {
      gridOptions: {},
      storeOutData: {
        cep_total_shipments_quantity: 0,
        cep_total_purchase_amount: 0,
        cep_total_defect_quantity: 0,
        cep_total_purchase_num: 0,
        cep_note: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: 12
      },
      context: null,
      components: {},
      purchaseReturnOutBuffer: [],
      columnDefs: [],
      sideBarColumn: [],
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      showPackingStatus: false,
      erpPrintStatus: false,
      localeText: this.$ag_grid_localeText,
      purchase_id: '',
      storeInId: '',
      purchaseReturnOrderData: {},
      packingInfo: []
    }
  },

  computed: {},
  created () {
    this.context = this
  },
  mounted () {
    this.restColumnData()
  },
  methods: {
    restColumnData () {
      const columnData = [
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '条码',
          field: 'epd_skc_code',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '商品名称',
          field: 'epd_archives_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '规格',
          field: 'epd_spe_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '应退货数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '折后单价',
          field: 'epd_discount_after_amount',
          comparator: (a, b) => a - b,
          filter: false,
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_discount_after_amount > 0 ? p.data.epd_discount_after_amount : p.data.epd_price) : ''
          },
          width: this.nowpx(0.06) + 'px'
        },
        // {
        //   headerName: '采购金额',
        //   field: 'epd_cash_amount',
        //   filter: false,
        //   width: this.nowpx(0.06) + 'px'
        // },
        {
          headerName: '实际退货数量',
          field: 'epd_out_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.storeOutData.cep_status < 2
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '差异数量',
          field: 'epd_defect_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '备注',
          field: 'epd_note',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('right')
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })

      if (this.$route.query.id) {
        this.storeInId = this.$route.query.id
        this.getItem()
      }
    },
    changeShowColumn () {
      this.gridOptions.api.setColumnDefs([])
      this.$nextTick(() => {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        this.gridOptions.api.setColumnDefs(newAgColumnDefs)
      })
    },
    getItem () {
      const obj = {
        id: this.storeInId
      }
      this.$store
        .dispatch('erpPurchaseOut/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.storeOutData = res.data.storeOutData ? res.data.storeOutData : {}
            this.purchaseReturnOutBuffer = res.data.purchaseReturnOutBuffer.length > 0 ? res.data.purchaseReturnOutBuffer : []
            this.purchaseReturnOrderData = res.data.purchaseReturnOrderData ? res.data.purchaseReturnOrderData : {}

            this.$nextTick(() => {
              this.getDataColumnSum()
            })
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

    // 订单挂起 5
    hangupOrderData () {
      this.saveDataOperate('挂起', 5)
    },

    // 订单保存 1
    saveOrderData () {
      this.saveDataOperate('保存', 1)
    },

    // 订单确认 2
    confirmOrderData () {
      this.saveDataOperate('确认', 2)
    },

    // 订单审核 3
    auditOrderData () {
      this.saveDataOperate('审核', 3)
    },

    // 取消确定 1
    cancelOrderConfirmData () {
      this.saveDataOperate('取消确定', -2)
    },

    // 作废  4
    closeOrderData () {
      this.saveDataOperate('作废', 4)
    },

    // 取消审核  2
    cancelAudit () {
      this.saveDataOperate('取消审核', -3)
    },

    // 取消入库  2
    cancelInDepot () {
      this.saveDataOperate('取消入库', -4)
    },

    clickOutDepot () {
      this.saveDataOperate('确认出库', 7)
    },

    saveDataOperate (text, cepStatus) {
      if (this.purchaseReturnOutBuffer.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择出库商品!',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: text + '门店退货出库单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            ...this.storeOutData,
            store_out_depot_order_id: this.storeOutData.id,
            cepStatus,
            purchaseReturnOutBuffer: this.purchaseReturnOutBuffer
          }
          this.$store
            .dispatch('erpPurchaseOut/changeStoreOutDepotOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: text + '成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.getItem()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
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

    changeNumber (p) {
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      const row = p.data
      const itemsToUpdate = []
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(row.epd_out_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_out_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      if (this.formatAmount(row.epd_out_quantity) > this.formatAmount(row.epd_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '出库数量不得大于退货数量',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_out_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      row.epd_defect_quantity = this.formatAmount(row.epd_quantity - row.epd_out_quantity)
      row.epd_shipments_amount = this.formatAmount(row.epd_out_quantity * row.epd_discount_after_amount)
      row.epd_defect_amount = this.formatAmount(row.epd_defect_quantity * row.epd_discount_after_amount)

      this.$store
        .dispatch('erpPurchaseOut/editBuffer', row)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            itemsToUpdate.push(row)
            p.api.applyTransaction({ update: itemsToUpdate })
            this.getDataColumnSum()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            row[p.colDef.field] = p.oldValue ? p.oldValue : 0
            itemsToUpdate.push(row)
            p.api.applyTransaction({ update: itemsToUpdate })
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
          row[p.colDef.field] = p.oldValue ? p.oldValue : 0
          itemsToUpdate.push(row)
          p.api.applyTransaction({ update: itemsToUpdate })
        })
    },
    getDataColumnSum () {
      this.storeOutData.cep_total_purchase_amount = 0
      const tableData = this.purchaseReturnOutBuffer
      let inTotalNum = 0
      let number = 0
      let inTotalAmount = 0
      let defectTotalNum = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_out_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_out_quantity)
        }
        if (this.formatAmount(item.epd_out_quantity)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_out_quantity) * this.formatAmount(item.epd_discount_after_amount)
        }
        if (this.formatAmount(item.epd_defect_quantity)) {
          defectTotalNum = this.formatAmount(defectTotalNum) + this.formatAmount(item.epd_defect_quantity)
        }
        if (this.formatAmount(item.epd_out_quantity)) {
          number = this.formatAmount(number) + this.formatAmount(item.epd_out_quantity)
        }
      })
      this.storeOutData.cep_total_purchase_num = this.formatAmount(number)
      this.storeOutData.cep_total_defect_quantity = this.formatAmount(defectTotalNum)
      this.storeOutData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
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
        params.api.sizeColumnsToFit()
      }
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    showPackingData () {
      this.showPackingStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.getPacking(this.packingInfo)
      })
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    exportCsv () {
      this.gridOptions.api.exportDataAsCsv({
        fileName: this.storeOutData.cep_contract_number + '-退货出库单详情'
      })
    },
    erpPrint () {
      if (this.purchaseReturnOutBuffer.length > 0) {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        const sideBarColumns = newAgColumnDefs.map((item) => {
          return {
            type: 'text',
            name: item.field,
            value: item.headerName
          }
        })
        this.erpPrintStatus = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.storeInId, 'storeOut', this.storeOutData)
          }, 500)
        })
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
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
