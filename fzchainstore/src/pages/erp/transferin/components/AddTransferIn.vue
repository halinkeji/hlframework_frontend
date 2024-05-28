<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <q-form ref="addDataRef" class="row q-gutter-sm">
           <q-btn color="grey" unelevated :to="{ name: 'erpIn', params: { tab: '4' } }" label="返回" />
          <q-btn
            color="warning"
            :disable="transferInOrderData.cep_status == 1 ? false : true"
            v-if="authorityMeta('hangup')"
            @click="hangupOrderData"
            unelevated
            label="挂起"
          />
          <q-btn
            color="primary"
            :disable="transferInOrderData.cep_status == 1 || transferInOrderData.cep_status == 5 ? false : true"
            v-if="authorityMeta('save')"
            @click="saveOrderData"
            unelevated
            label="保存"
          />
          <q-btn
            color="primary"
            :disable="transferInOrderData.cep_status == 1 ? false : true"
            v-if="authorityMeta('confirm')"
            @click="confirmOrderData"
            unelevated
            label="确认"
          />
          <q-btn
            color="primary"
            :disable="transferInOrderData.cep_status == 2 ? false : true"
            v-if="authorityMeta('audit')"
            @click="auditOrderData"
            unelevated
            label="审核"
          />
          <q-btn
            color="green-7"
            :disable="transferInOrderData.cep_status == 2 ? false : true"
            v-if="authorityMeta('audit')"
            @click="clickInDepot"
            unelevated
            label="直接入库"
          />
          <q-btn
            color="red"
            :disable="transferInOrderData.cep_status == 3 ? false : true"
            v-if="authorityMeta('cancel')"
            @click="cancelAudit"
            unelevated
            label="取消审核"
          />
          <q-btn
            color="red"
            :disable="transferInOrderData.cep_status == 2 ? false : true"
            v-if="authorityMeta('cancel')"
            @click="cancelOrderConfirmData"
            unelevated
            label="取消确定"
          />
          <q-btn
            color="red"
            :disable="transferInOrderData.cep_status == 1 ? false : true"
            v-if="authorityMeta('close')"
            @click="closeOrderData"
            unelevated
            label="作废"
          />
          <q-btn
            color="primary"
            :disable="transferInOrderData.cep_status == 2 ? false : true"
            v-if="authorityMeta('storage')"
            @click="clickInDepot"
            unelevated
            label="直接入库"
          />
          <q-btn
            color="primary"
            :disable="transferInOrderData.cep_status == 3 ? false : true"
            v-if="authorityMeta('storage')"
            @click="clickConfirmInDepot"
            unelevated
            label="确认入库"
          />
          <q-btn
            color="negative"
            :disable="transferInOrderData.cep_status == 7 ? false : true"
            @click="cancelInDepot"
            unelevated
            v-if="transferInOrderData.cep_status == 7"
            label="取消入库"
          />
          <q-btn
            color="primary"
            unelevated
            @click="exportCsv"
            label="导出Csv文件"
            :disable="transferInOrderBuffer.length == 0 && transfer_in_order_id < 1"
          />

          <div class="col-12 col-md-2" v-if="transferInOrderData.cep_status == 1">
            <q-input dense outlined v-model="searchValue" label="请输入SKU码或唯一码" />
          </div>
          <q-btn
            color="positive"
            unelevated
            label="扫码录入"
            v-if="transferInOrderData.cep_status < 2 || transferInOrderData.cep_status == 5"
            :disable="searchValue == '' ? true : false"
            @keyup.enter="addItemData(searchValue)"
            @click="addItemData(searchValue)"
          />
          <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="transferInOrderBuffer.length > 0 && transfer_in_order_id > 0" />
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
        </q-form>
      </div>
      <div class="col-shrink bg-white q-pb-md q-gutter-sm">
        <q-form ref="erpInRef" class="row" v-if="transferInOrderData && transferInOrderData.cep_contract_number">
          <div class="col-2">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ transferInOrderData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">调拨单据号</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{
                  transferInOrderData.inDepot ? transferInOrderData.inDepot.cd_name : ''
                }}</q-item-label>
                <q-item-label caption lines="2">入库仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{
                  transferInOrderData.inDepot ? transferInOrderData.outDepot.cd_name : ''
                }}</q-item-label>
                <q-item-label caption lines="2">出库仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col" v-if="transferOutOrderData && transferOutOrderData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ transferOutOrderData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">出库小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col" v-if="transferOutOrderData && transferOutOrderData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ transferOutOrderData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">出库总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary">{{ transferInOrderData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">入库小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary">{{ transferInOrderData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">入库总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col" v-if="transferOutOrderData.cep_status > 0">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  <span v-if="transferInOrderData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="transferInOrderData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="transferInOrderData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="transferInOrderData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="transferInOrderData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="transferInOrderData.cep_status == 6" class="text-primary">确认入库</span>
                  <span v-if="transferInOrderData.cep_status == 7" class="text-primary">已完成</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-3">
            <q-input
              type="textarea"
              outlined
              v-model="transferInOrderData.cep_note"
              :disable="transferInOrderData.cep_status < 2 ? false : true"
              label="备注"
              dense
              :rows="1"
            />
          </div>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-white q-mb-sm">
        <ag-grid-vue
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center erp-turn-table full-height"
          ref="agGridTable"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="transferInOrderBuffer"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :gridOptions="gridOptions"
          @first-data-rendered="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
        >
        </ag-grid-vue>
      </div>

      <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'AddTransferIn',
  components: {},
  data () {
    return {
      context: null,
      showGoodsList: false,

      addButtonDisabled: false,
      erpPrintStatus: false,
      gridOptions: {},
      transferInOrderBuffer: [],
      transferInOrderData: {
        cep_contract_number: '',
        cep_type: 1,
        cep_order_type: 1,
        cep_status: 0,
        cep_transfer_in_depot_id: '',
        cep_transfer_out_depot_id: '',
        cep_total_purchase_amount: '',
        cep_total_purchase_num: '',
        cep_note: ''
      },
      searchValue: '',
      depotData: [],
      defaultColDef: {
        rowDragManaged: true,
        sortable: true
      },
      columnDefs: [],
      sideBarColumn: [],
      localeText: this.$ag_grid_localeText,
      transfer_in_order_id: ''
    }
  },

  created () {
    this.context = this
  },
  mounted () {
    this.restColumnData()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
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
          headerName: '商品条码',
          field: 'epd_skc_code',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '商品名称 ',
          field: 'epd_archives_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'epd_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'epd_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        // {
        //   headerName: '现有库存',
        //   field: 'epd_turn_before_number',
        //   width: this.nowpx(0.08) + 'px',
        //   comparator: (a, b) => a - b
        // },
        {
          headerName: '调拨数量',
          field: 'epd_out_quantity',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
          // editable: (p) => {
          //   return !p.data.showEdit && this.transferInOrderData.cep_status < 2
          // },
          // singleClickEdit: true,
          // onCellValueChanged: this.changeNumber
        },

        {
          headerName: '入库数量',
          field: 'epd_in_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return !p.data.showEdit && this.transferInOrderData.cep_status < 2
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '残次数量',
          field: 'epd_defect_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '商品单价',
          field: 'epd_price',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '小计',
          field: 'epd_in_amount',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '备注',
          field: 'epd_note',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.13) + 'px'
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })

      if (this.$route.query.id) {
        this.transfer_in_order_id = this.$route.query.id
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
    erpPrint () {
      if (this.transferInOrderBuffer.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.transfer_in_order_id, 'transferIn', this.transferInOrderData)
          }, 500)
        })
      }
    },

    getItem () {
      const obj = {
        id: this.transfer_in_order_id
      }
      this.$store
        .dispatch('erpTransferIn/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.transferInOrderData = res.data.transferInOrderData ? res.data.transferInOrderData : {}
            this.transferInOrderBuffer = res.data.transferInOrderBuffer.length > 0 ? res.data.transferInOrderBuffer : []
            this.transferOutOrderData = res.data.transferOutOrderData ? res.data.transferOutOrderData : {}

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

    changeNumber (p) {
      const itemsToUpdate = []
      const row = p.data
      const regu = /^[0-9]*[1-9][0-9]*$/
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      if (!regu.test(row.epd_in_quantity)) {
        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        row.epd_in_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      if (this.formatAmount(row.epd_in_quantity) > this.formatAmount(row.epd_out_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '入库数量不得大于调拨数量',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_in_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      row.epd_defect_quantity = this.formatAmount(row.epd_out_quantity - row.epd_in_quantity)
      row.epd_in_amount = this.formatAmount(row.epd_in_quantity * row.epd_price)
      row.epd_defect_amount = this.formatAmount(row.epd_defect_quantity * row.epd_price)

      this.$store
        .dispatch('erpTransferIn/editBufferData', row)
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
            this.$nextTick(() => {
              this.getDataColumnSum()
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
            this.getItem()
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

    clickInDepot () {
      this.saveDataOperate('直接入库', 7)
    },

    clickConfirmInDepot () {
      this.saveDataOperate('确认入库', 7)
    },

    saveDataOperate (text, cepStatus) {
      if (this.transferInOrderBuffer.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择入库商品!',
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
          message: text + '采购入库单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            transfer_in_order_id: this.transferInOrderData.id,
            ...this.transferInOrderData,
            cepStatus,
            transferInOrderBuffer: this.transferInOrderBuffer
          }
          this.$store
            .dispatch('erpTransferIn/changeInDepotOrder', obj)
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

    getDataColumnSum () {
      this.transferInOrderData.cep_total_purchase_num = 0
      this.transferInOrderData.cep_total_purchase_amount = 0

      const tableData = this.transferInOrderBuffer
      let inTotalNum = 0
      let inTotalAmount = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_in_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_in_quantity)
        }
        if (this.formatAmount(item.epd_in_amount)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_in_amount)
        }
      })
      this.transferInOrderData.cep_total_purchase_num = this.formatAmount(inTotalNum)
      this.transferInOrderData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
    },
    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          transfer_in_order_id: this.transfer_in_order_id
        }
        this.$store
          .dispatch('erpTransferIn/changeBufferQuantity', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: '更新成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.searchValue = ''
              this.getItem()
            } else {
              this.$q.notify({
                message: '添加失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.searchValue = ''
            }
          })
          .catch((error) => {})
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
        params.api.sizeColumnsToFit()
      }
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
        fileName: this.transferInOrderData.cep_contract_number + '-调拨入库单详情'
      })
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
.erp-turn-table .cell-span-erp-turn {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
