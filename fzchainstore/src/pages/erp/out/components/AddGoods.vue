<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md ">
        <q-form ref="erpInRef">
          <div class="row q-gutter-xs">
            <q-btn color="grey" unelevated :to="{ name: 'erpOut', params: { tab: '1' } }" label="返回" />

            <q-btn
              color="warning"
              :disable="erpOutFormData.cep_status < 2 ? false : true"
              v-if="authorityMeta('hangup')"
              @click="hangupOrderData"
              unelevated
              label="挂起"
            />
            <q-btn
              color="primary"
              :disable="erpOutFormData.cep_status == 1 || erpOutFormData.cep_status == 5 ? false : true"
              v-if="authorityMeta('save')"
              @click="saveOrderData"
              unelevated
              label="保存"
            />
            <q-btn
              color="primary"
              :disable="erpOutFormData.cep_status == 1 ? false : true"
              v-if="authorityMeta('confirm')"
              @click="confirmOrderData"
              unelevated
              label="确认"
            />
            <q-btn
              color="positive"
              :disable="erpOutFormData.cep_status == 2 ? false : true"
              v-if="authorityMeta('audit')"
              @click="auditOrderData"
              unelevated
              label="审核"
            />
            <q-btn
              color="negative"
              :disable="erpOutFormData.cep_status == 3 ? false : true"
              v-if="authorityMeta('revoke')"
              @click="cancelAudit"
              unelevated
              label="取消审核"
            />
            <q-btn
              color="positive"
              :disable="erpOutFormData.cep_status == 3 ? false : true"
              v-if="authorityMeta('audit')"
              @click="clickOutDepot"
              unelevated
              label="确认出库"
            />
            <q-btn
              color="red"
              :disable="erpOutFormData.cep_status == 2 ? false : true"
              v-if="authorityMeta('cancel')"
              @click="cancelOrderConfirmData"
              unelevated
              label="取消确定"
            />
            <q-btn
              color="red"
              :disable="erpOutFormData.cep_status == 1 ? false : true"
              v-if="authorityMeta('close')"
              @click="closeOrderData"
              unelevated
              label="作废"
            />
            <q-btn
              color="primary"
              unelevated
              @click="exportCsv"
              label="导出Csv文件"
              :disable="orderOutDepotData.length == 0 && order_out_depot_id < 1"
            />

            <div class="col-2" v-if="erpOutFormData.cep_status < 2">
              <q-input dense outlined @keyup.enter="addItemData(searchValue)" v-model="searchValue" label="请输入SKU码或唯一码" />
            </div>

            <q-btn
              color="positive"
              unelevated
              label="添加商品"
              v-if="authorityMeta('code')"
              :disable="searchValue == '' ? true : false"
              @click="addItemData(searchValue)"
            />
            <q-btn color="info" unelevated @click="erpPrint" label="打印" />

            <q-btn  color="secondary" unelevated label="装箱信息" v-if="erpOutFormData.cep_if_pack == '1'" @click="showPackingData" />
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

      <div class="col-shrink bg-white q-pt-sm q-pb-md">
        <q-form ref="erpInRef" class="row q-gutter-xs">
          <div class="col-2">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationOrderData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">配货单据号</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationOrderData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">配货仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationOrderData.cep_total_shipments_quantity }}</q-item-label>
                <q-item-label caption lines="2">配货数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationOrderData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">仓库名称</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ allocationOrderData.cep_total_amount }}</q-item-label>
                <q-item-label caption lines="2">配货实付款</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ erpOutFormData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">账单小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ erpOutFormData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">
                  <span v-if="erpOutFormData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="erpOutFormData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="erpOutFormData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="erpOutFormData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="erpOutFormData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="erpOutFormData.cep_status == 6" class="text-primary">已出库</span>
                  <span v-if="erpOutFormData.cep_status == 7" class="text-primary">已分配</span>
                  <span v-if="erpOutFormData.cep_status == 8" class="text-primary">已入库</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-2">
            <q-input type="textarea" outlined v-model="erpOutFormData.cep_note" label="备注" dense :rows="2" />
          </div>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs q-pb-sm full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="orderOutDepotData"
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
      erpOutFormData: {
        cep_real_pay_amount: 0,
        cep_total_purchase_num: 0,
        cep_total_purchase_amount: 0,
        cep_note: '',
        cep_depot_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: 6
      },
      context: null,
      searchValue: '',
      components: {},
      chooseInvoiceVisible: false,
      showPackingStatus: false,
      orderOutDepotData: [],
      columnDefs: [],
      sideBarColumn: [],
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      erpPrintStatus: false,
      localeText: this.$ag_grid_localeText,
      order_out_depot_id: '',
      allocationOrderData: {},
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
          width: this.nowpx(0.1) + 'px',
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
          headerName: '货号',
          field: 'epd_article_code',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'epd_color_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'epd_size_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '配货数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '配货单价',
          field: 'epd_price',
          filter: false,
          width: this.nowpx(0.07) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '批发价',
          field: 'epd_wholesale_price',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '折后单价',
          field: 'epd_discount_after_amount',
          filter: false,
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_discount_after_amount > 0 ? p.data.epd_discount_after_amount : p.data.epd_price) : ''
          },
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '配货金额',
          field: 'epd_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '出库数量',
          field: 'epd_out_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.07) + 'px',
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
        this.order_out_depot_id = this.$route.query.id
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
      this.$store
        .dispatch('erpOut/getItem', this.order_out_depot_id)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.erpOutFormData = res.data.erpOutFormData ? res.data.erpOutFormData : {}
            this.orderOutDepotData = res.data.orderOutDepotData.length > 0 ? res.data.orderOutDepotData : []
            this.allocationOrderData = res.data.allocationOrderData ? res.data.allocationOrderData : {}

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
      if (this.orderOutDepotData.length <= 0) {
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
          message: text + '订货出库单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            ...this.erpOutFormData,
            out_depot_order_id: this.erpOutFormData.id,
            cepStatus,
            orderOutDepotData: this.orderOutDepotData
          }
          this.$store
            .dispatch('erpOut/changeOutDepotOrder', obj)
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
      const row = p.data
      const itemsToUpdate = []

      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
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
          caption: '出库数量不得大于配货数量',
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

      this.$store
        .dispatch('erpOut/editButtfer', row)
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
          epd_order_out_depot_id: this.order_out_depot_id
        }
        this.$store
          .dispatch('erpOut/changeBufferQuantity', obj)
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

    getDataColumnSum () {
      this.erpOutFormData.cep_total_purchase_amount = 0
      const tableData = this.orderOutDepotData
      let inTotalNum = 0
      let inTotalAmount = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_out_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_out_quantity)
        }
        if (this.formatAmount(item.epd_out_amount)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_out_amount)
        }
      })
      this.erpOutFormData.cep_total_purchase_num = this.formatAmount(inTotalNum)
      this.erpOutFormData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
    },
    getPacking () {
      this.orderOutDepotData.forEach((item) => {
        if (item.epd_packing_id > 0) {
          if (this.packingInfo.indexOf(item.epd_packing_id) < 0) {
            this.packingInfo.push(item.epd_packing_id)
          }
        }
      })
    },
    showPackingData () {
      this.showPackingStatus = true
      if (this.allocationOrderData && this.allocationOrderData.cep_goods_order_id) {
        this.$nextTick(() => {
          this.$refs.showDataRef.init('cep_ordergoods_id', this.allocationOrderData.cep_goods_order_id)
        })
      }
    },

    erpPrint () {
      if (this.orderOutDepotData.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.order_out_depot_id, 'out', this.erpOutFormData)
          }, 500)
        })
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
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
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
        fileName: this.erpOutFormData.cep_contract_number + '-订货出库单详情'
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
