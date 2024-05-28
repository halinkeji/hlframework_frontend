<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-form ref="erpInRef">
          <div class="q-gutter-xs row">
            <q-btn color="grey" unelevated :to="{ name: 'erpIn', params: { tab: '3' } }" label="返回" />
            <q-btn
              v-if="storeInData.cep_if_pack == '1'"
              color="secondary"
              unelevated
              label="装箱信息"
              :disable="storeReturnInBuffer.length > 0 ? false : true"
              @click="showPackingData"
            />

            <q-btn
              color="warning"
              :disable="storeInData.cep_status < 2 ? false : true"
              v-if="authorityMeta('hangup')"
              @click="hangupOrderData"
              unelevated
              label="挂起"
            />
            <q-btn
              color="primary"
              :disable="storeInData.cep_status == 1 || storeInData.cep_status == 5 ? false : true"
              v-if="authorityMeta('save')"
              @click="saveOrderData"
              unelevated
              label="保存"
            />
            <q-btn
              color="primary"
              :disable="storeInData.cep_status == 1 ? false : true"
              v-if="authorityMeta('confirm')"
              @click="confirmOrderData"
              unelevated
              label="确认"
            />
            <q-btn
              color="positive"
              :disable="storeInData.cep_status == 2 ? false : true"
              v-if="authorityMeta('audit')"
              @click="auditOrderData"
              unelevated
              label="审核"
            />
            <q-btn
              color="red"
              :disable="storeInData.cep_status == 2 ? false : true"
              v-if="authorityMeta('cancel')"
              @click="cancelOrderConfirmData"
              unelevated
              label="取消确认"
            />
            <q-btn
              color="red"
              :disable="storeInData.cep_status == 1 ? false : true"
              v-if="authorityMeta('close')"
              @click="closeOrderData"
              unelevated
              label="作废"
            />
            <q-btn
              color="green-7"
              :disable="storeInData.cep_status == 2 ? false : true"
              @click="clickInDepot"
              v-if="storeInData.cep_status == 2"
              unelevated
              label="直接入库"
            />
            <q-btn
              color="primary"
              :disable="storeInData.cep_status == 3 ? false : true"
              v-if="storeInData.cep_status == 3"
              @click="clickConfirmInDepot"
              unelevated
              label="确认入库"
            />
            <q-btn
              color="primary"
              unelevated
              @click="exportCsv"
              label="导出Csv文件"
              :disable="storeReturnInBuffer.length == 0 && store_return_in_id < 1"
            />

            <div class="col-12 col-md-2" v-if="storeInData.cep_status < 2 || storeInData.cep_status == 5">
              <q-input dense outlined @keyup.enter="addItemData(searchValue)" v-model="searchValue" label="请输入SKU码或唯一码" />
            </div>
            <q-btn
              color="positive"
              unelevated
              label="扫码录入"
              v-if="storeInData.cep_status < 2 || storeInData.cep_status == 5"
              :disable="searchValue == '' ? true : false"
              @click="addItemData(searchValue)"
            />
            <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="storeReturnInBuffer.length > 0 && store_return_in_id > 0" />
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
      <div class="col-shrink bg-white q-pb-md q-pt-sm">
        <q-form ref="erpInRef" class="row q-px-sm">
           <div class="col-2" v-if="storeReturnOutOrderData.cep_contract_number">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ storeReturnOutOrderData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">退货单据号</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col" v-if="storeReturnOutOrderData.cep_contract_number">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ storeReturnOutOrderData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">退货仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col" v-if="storeReturnOutOrderData.cep_contract_number">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ storeReturnOutOrderData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">退货金额</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col" v-if="storeReturnOutOrderData.cep_contract_number">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ storeReturnOutOrderData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">退货总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ storeInData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">入库账单小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ storeInData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">总发货数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ storeInData.cep_total_shipments_quantity }}</q-item-label>
                <q-item-label caption lines="2">总入库数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  <span v-if="storeInData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="storeInData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="storeInData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="storeInData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="storeInData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="storeInData.cep_status == 6" class="text-warning">入库中</span>
                  <span v-if="storeInData.cep_status == 7" class="">确认入库</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-2">
            <q-input type="textarea" outlined v-model="storeInData.cep_note" label="备注" dense :rows="1" />
          </div>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="storeReturnInBuffer"
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

      storeInData: {
        cep_total_shipments_quantity: 0,
        cep_total_purchase_amount: 0,
        cep_total_defect_quantity: 0,
        cep_total_purchase_num: 0,
        cep_note: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: 11
      },
      context: null,
      components: {},
      searchValue: '',
      storeReturnInBuffer: [],
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
      store_return_in_id: '',
      storeReturnOutOrderData: {},
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
          headerName: '发货数量',
          field: 'epd_quantity',
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
        // {
        //   headerName: '采购金额',
        //   field: 'epd_cash_amount',
        //   filter: false,
        //   width: this.nowpx(0.06) + 'px'
        // },
        {
          headerName: '入库数量',
          field: 'epd_in_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.storeInData.cep_status < 2
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
        this.store_return_in_id = this.$route.query.id
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
        id: this.store_return_in_id
      }
      this.$store
        .dispatch('erpStorein/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.storeInData = res.data.storeInData ? res.data.storeInData : {}
            this.storeReturnInBuffer = res.data.storeReturnInBuffer.length > 0 ? res.data.storeReturnInBuffer : []
            this.storeReturnOutOrderData = res.data.storeReturnOutOrderData ? res.data.storeReturnOutOrderData : {}

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

    clickInDepot () {
      this.saveDataOperate('直接入库', 7)
    },

    clickConfirmInDepot () {
      this.saveDataOperate('确认入库', 7)
    },

    saveDataOperate (text, cepStatus) {
      if (this.storeReturnInBuffer.length <= 0) {
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
          message: text + '门店退货入库单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            ...this.storeInData,
            store_return_in_depot_order_id: this.storeInData.id,
            cepStatus,
            storeReturnInBuffer: this.storeReturnInBuffer
          }
          this.$store
            .dispatch('erpStorein/changeStoreInDepotOrder', obj)
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
      if (!regu.test(row.epd_in_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
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
      if (this.formatAmount(row.epd_in_quantity) > this.formatAmount(row.epd_out_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '入库数量不得大于退货数量',
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
      row.epd_shipments_amount = this.formatAmount(row.epd_in_quantity * row.epd_discount_after_amount)
      row.epd_defect_amount = this.formatAmount(row.epd_defect_quantity * row.epd_discount_after_amount)

      this.$store
        .dispatch('erpStorein/editBufferData', row)
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
          this.getItem()
        })
    },
    getDataColumnSum () {
      this.storeInData.cep_total_purchase_amount = 0
      const tableData = this.storeReturnInBuffer
      let inTotalNum = 0
      let number = 0
      let inTotalAmount = 0
      let defectTotalNum = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_in_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_in_quantity)
        }
        if (this.formatAmount(item.epd_in_quantity)) {
          inTotalAmount =
            this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_in_quantity) * this.formatAmount(item.epd_discount_after_amount)
        }
        if (this.formatAmount(item.epd_defect_quantity)) {
          defectTotalNum = this.formatAmount(defectTotalNum) + this.formatAmount(item.epd_defect_quantity)
        }
        if (this.formatAmount(item.epd_quantity)) {
          number = this.formatAmount(number) + this.formatAmount(item.epd_quantity)
        }
      })
      this.storeInData.cep_total_purchase_num = this.formatAmount(number)
      this.storeInData.cep_total_shipments_quantity = this.formatAmount(inTotalNum)
      this.storeInData.cep_total_defect_quantity = this.formatAmount(defectTotalNum)
      this.storeInData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
    },

    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          store_return_in_id: this.store_return_in_id
        }
        this.$store
          .dispatch('erpStorein/changeBufferQuantity', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: '成功添加商品',
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
              this.getItem()
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
      if (this.storeReturnOutOrderData && this.storeReturnOutOrderData.cep_store_return_order_id) {
        this.$nextTick(() => {
          this.$refs.showDataRef.init('cep_ordergoods_id', this.storeReturnOutOrderData.cep_store_return_order_id)
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
    erpPrint () {
      if (this.storeReturnInBuffer.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.store_return_in_id, 'storeIn', this.storeInData)
          }, 500)
        })
      }
    },
    exportCsv () {
      this.gridOptions.api.exportDataAsCsv({
        fileName: this.storeInData.cep_contract_number + '-退货入库单详情'
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
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
