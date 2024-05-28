<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs q-pb-md">
        <q-form ref="erpInRef" >
          <div class="row q-gutter-sm">
            <q-btn color="grey" unelevated :to="{ name: 'erpDirectAllocation' }" label="返回" />

            <q-btn
              color="warning"
              :disable="allocationData.cep_status < 2 ? false : true"
              v-if="authorityMeta('hangup')"
              @click="hangupOrderData"
              unelevated
              label="挂起"
            />
            <q-btn
              color="primary"
              :disable="allocationData.cep_status < 1 || allocationData.cep_status == 5 ? false : true"
              v-if="authorityMeta('save')"
              @click="saveOrderData"
              unelevated
              label="保存"
            />
            <q-btn
              color="primary"
              :disable="allocationData.cep_status == 1 ? false : true"
              v-if="authorityMeta('confirm')"
              @click="confirmOrderData"
              unelevated
              label="确认"
            />
            <q-btn
              color="positive"
              :disable="allocationData.cep_status == 2 ? false : true"
              v-if="authorityMeta('audit')"
              @click="auditOrderData"
              unelevated
              label="审核"
            />
            <q-btn
              color="negative"
              :disable="allocationData.cep_status == 3 ? false : true"
              v-if="authorityMeta('revoke')"
              @click="cancelAudit"
              unelevated
              label="取消审核"
            />
            <q-btn
              color="red"
              :disable="allocationData.cep_status == 2 ? false : true"
              v-if="authorityMeta('cancel')"
              @click="cancelOrderConfirmData"
              unelevated
              label="取消确定"
            />
            <q-btn
              color="red"
              :disable="allocationData.cep_status == 1 ? false : true"
              v-if="authorityMeta('close')"
              @click="closeOrderData"
              unelevated
              label="作废"
            />
            <div v-if="allocationData.cep_status < 2">
              <q-input
                dense
                outlined
                v-model="searchValue"
                @keyup.enter="addItemData(searchValue)"
                label="请输入SKU码或唯一码"
                :disable="allocationData.cep_status < 2 ? false : true"
              />
            </div>

            <q-btn
              color="positive"
              unelevated
              label="添加配货"
              v-if="authorityMeta('code') && allocationData.cep_status < 2"
              @click="addItemData(searchValue)"
            />

            <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="directOrderData.length > 0 && direct_allocation_order_id > 0" />

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
        </q-form>
      </div>

      <div class="col-shrink bg-white q-pb-md">
        <q-form ref="erpInRef" class="row">
          <div class="col-2" v-if="directGoodsData && directGoodsData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ directGoodsData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">直采单据号</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col" v-if="directGoodsData && directGoodsData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ directGoodsData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">配货货仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col" v-if="directGoodsData && directGoodsData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ directGoodsData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">直采实付款</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col" v-if="directGoodsData && directGoodsData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ directGoodsData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">直采订货总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">账单小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">应配货数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">配货数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationData.cep_total_shipments_quantity }}</q-item-label>
                <q-item-label caption lines="2">未配货数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">
                  <span v-if="allocationData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="allocationData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="allocationData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="allocationData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="allocationData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="allocationData.cep_status == 6" class="text-primary">已分配</span>
                  <span v-if="allocationData.cep_status == 7" class="text-primary">出库完毕</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-2">
            <q-input
              type="textarea"
              outlined
              :disable="allocationData.cep_status == 1 ? false : true"
              v-model="allocationData.cep_note"
              label="备注"
              dense
              :rows="2"
            />
          </div>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="directOrderData"
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
  components: { ShowPacking },
  data () {
    return {
      gridOptions: {},
      allocationData: {
        cep_total_shipments_quantity: 0,
        cep_total_purchase_amount: 0,
        cep_total_noallocation_quantity: 0,
        cep_supplier_id: '',
        cep_note: '',
        cep_pay_type: '',
        cep_supplier_name: '',
        cep_supplier_code: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_buyer_id: '',
        cep_buyer_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: '15',
        cep_allocation_way: '',
        cep_order_store_id: ''
      },
      context: null,
      searchValue: '',
      components: {},
      supplierData: [],
      directOrderData: [],
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
      showGoodsList: false,
      erpPrintStatus: false,
      localeText: this.$ag_grid_localeText,
      directGoodsData: {},
      direct_allocation_order_id: 0,
      packingInfo: []
    }
  },

  created () {
    this.context = this
  },
  mounted () {
    this.restColumnData()
  },
  computed: {},
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
          headerName: '规格 ',
          field: 'epd_spe_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '订货数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '折后单价',
          field: 'epd_discount_after_amount',
          filter: false,
          width: this.nowpx(0.05) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '直采金额',
          field: 'epd_cash_amount',
          filter: false,
          width: this.nowpx(0.05) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '配货数量',
          field: 'epd_shipments_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.allocationData.cep_status < 2
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.05) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '未配货数量',
          field: 'epd_discrepancy_quantity',
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
        this.direct_allocation_order_id = this.$route.query.id
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
        id: this.direct_allocation_order_id
      }
      this.$store
        .dispatch('erpDirectAllocation/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.allocationData = res.data.allocationData && res.data.allocationData.id ? res.data.allocationData : {}
            this.directOrderData = res.data.directOrderData && res.data.directOrderData.length > 0 ? res.data.directOrderData : []
            this.directGoodsData = res.data.directGoodsData && res.data.directGoodsData.id ? res.data.directGoodsData : {}

            // if (res.data.allocationPacking.length > 0) {
            //   this.packingInfo = res.data.allocationPacking.map((item) => {
            //     return item.id
            //   })
            // }
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

    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          direct_allocation_order_id: this.direct_allocation_order_id
        }
        this.$store
          .dispatch('erpDirectAllocation/changeBufferQuantity', obj)
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

    changeNumber (p) {
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      const row = p.data
      const itemsToUpdate = []
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(row.epd_shipments_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })

        row.epd_shipments_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      if (this.formatAmount(row.epd_shipments_quantity) > this.formatAmount(row.epd_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '配货数量不得大于订货数量',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_shipments_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      row.epd_discrepancy_quantity = this.formatAmount(row.epd_quantity - row.epd_shipments_quantity)

      this.$store
        .dispatch('erpDirectAllocation/editBufferData', row)
        .then((res) => {
          if (res.code == 200) {
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

    getDataColumnSum () {
      this.allocationData.cep_total_purchase_amount = 0
      const tableData = this.directOrderData
      let inTotalNum = 0
      let inTotalAmount = 0
      let defectTotalNum = 0
      let allocatioTotalNum = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_shipments_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_shipments_quantity)
        }
        if (this.formatAmount(item.epd_shipments_quantity)) {
          inTotalAmount =
            this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_shipments_quantity) * this.formatAmount(item.epd_discount_after_amount)
        }
        if (this.formatAmount(item.epd_discrepancy_quantity)) {
          defectTotalNum = this.formatAmount(defectTotalNum) + this.formatAmount(item.epd_discrepancy_quantity)
        }
        if (this.formatAmount(item.epd_quantity)) {
          allocatioTotalNum = this.formatAmount(allocatioTotalNum) + this.formatAmount(item.epd_quantity)
        }
      })

      this.allocationData.cep_total_purchase_num = this.formatAmount(allocatioTotalNum)
      this.allocationData.cep_total_shipments_quantity = this.formatAmount(inTotalNum)
      this.allocationData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
      this.allocationData.cep_total_noallocation_quantity = this.formatAmount(defectTotalNum)
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
    saveDataOperate (text, cepStatus) {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: text + '配货单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            ...this.allocationData,
            cepStatus,
            direct_allocation_order_id: this.allocationData.id,
            directOrderData: this.directOrderData
          }
          this.$store
            .dispatch('erpDirectAllocation/changeAllocationOrder', obj)
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

    erpPrint () {
      if (this.directOrderData.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.direct_allocation_order_id, 'directAllocation', this.allocationData)
          }, 500)
        })
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
