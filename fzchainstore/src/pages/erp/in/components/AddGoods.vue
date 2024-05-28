<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs">
        <q-form ref="erpInRef" @submit="addItemData(searchValue)">
          <div class="row q-gutter-sm">
            <q-btn color="grey" unelevated :to="{ name: 'erpIn', params: { tab: '1' } }" label="返回" />
            <q-btn
              color="warning"
              :disable="erpInFormData.cep_status == 1 ? false : true"
              @click="hangupOrderData"
              v-if="authorityMeta('hangup')"
              unelevated
              label="挂起"
            />
            <q-btn
              color="primary"
              :disable="erpInFormData.cep_status == 1 || erpInFormData.cep_status == 5 ? false : true"
              v-if="authorityMeta('save')"
              @click="saveOrderData"
              unelevated
              label="保存"
            />
            <q-btn
              color="primary"
              :disable="erpInFormData.cep_status == 1 ? false : true"
              v-if="authorityMeta('confirm')"
              @click="confirmOrderData"
              unelevated
              label="确认"
            />
            <q-btn
              color="positive"
              :disable="erpInFormData.cep_status == 2 ? false : true"
              v-if="authorityMeta('audit')"
              @click="auditOrderData"
              unelevated
              label="审核"
            />
            <q-btn
              color="red"
              :disable="erpInFormData.cep_status == 2 ? false : true"
              v-if="authorityMeta('cancel')"
              @click="cancelOrderConfirmData"
              unelevated
              label="取消确定"
            />
            <q-btn
              color="red"
              :disable="erpInFormData.cep_status == 1 ? false : true"
              v-if="authorityMeta('close')"
              @click="closeOrderData"
              unelevated
              label="作废"
            />
            <q-btn
              color="green-7 "
              :disable="erpInFormData.cep_status == 2 ? false : true"
              @click="clickInDepot"
              unelevated
              v-if="erpInFormData.cep_status == 2"
              label="直接入库"
            />
            <q-btn
              color="primary"
              :disable="erpInFormData.cep_status == 3 ? false : true"
              v-if="authorityMeta('storage')"
              @click="clickConfirmInDepot"
              unelevated
              label="确认入库"
            />
            <q-btn
              color="red"
              :disable="erpInFormData.cep_status == 7 ? false : true"
              @click="cancelInDepot"
              unelevated
              v-if="erpInFormData.cep_status == 7"
              label="取消入库"
            />

            <q-btn
              color="primary"
              unelevated
              @click="exportCsv"
              label="导出Csv文件"
              :disable="purchaseInDepotBufferData.length == 0 && purchase_id < 1"
            />
            <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="purchaseInDepotBufferData.length > 0 && purchase_id > 0" />

            <div class="col-12 col-md-2" v-if="erpInFormData.cep_status < 2 || erpInFormData.cep_status == 5">
              <q-input @keyup.enter="addItemData(searchValue)" dense outlined v-model="searchValue" label="请输入SKU码或唯一码" />
            </div>
            <q-btn
              color="positive"
              unelevated
              label="扫码录入"
              v-if="erpInFormData.cep_status < 2 || erpInFormData.cep_status == 5"
              :disable="searchValue == '' ? true : false"
              @click="addItemData(searchValue)"
            />

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

        <div class="col-shrink bg-white q-pb-md" v-if="purchaseOrderData.cep_contract_number">
          <q-form ref="erpInRef" class="row">
            <div class="col-2">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseOrderData.cep_contract_number }}</q-item-label>
                  <q-item-label caption lines="2">采购单据号</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseOrderData.cep_buyer_name }}</q-item-label>
                  <q-item-label caption lines="2">采购员</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseOrderData.cep_supplier_name }}</q-item-label>
                  <q-item-label caption lines="2">供货商</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">{{ payTypeObject[purchaseOrderData.cep_pay_type] }}</q-item-label>
                  <q-item-label caption lines="2">结算方式</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseOrderData.cep_depot_name }}</q-item-label>
                  <q-item-label caption lines="2">仓库名称</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseOrderData.cep_total_purchase_amount }}</q-item-label>
                  <q-item-label caption lines="2">采购实付款</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">{{ purchaseOrderData.cep_total_purchase_num }}</q-item-label>
                  <q-item-label caption lines="2">采购总数量</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-2">
              <q-item>
                <q-item-section>
                  <q-item-label caption class="text-subtitle2 text-weight-bold">采购单备注</q-item-label>
                  <q-item-label caption >{{ purchaseOrderData.cep_note }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-form>
        </div>
      </div>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="purchaseInDepotBufferData"
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

      <div class="col-shrink bg-white q-pb-md q-pt-sm" >
        <q-form ref="erpInRef" class="row q-px-sm">
          <div class="col-auto">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ erpInFormData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">发货小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-auto">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ erpInFormData.cep_total_shipments_quantity }}</q-item-label>
                <q-item-label caption lines="2">发货数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-auto">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ erpInFormData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">账单小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-auto">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  <span v-if="erpInFormData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="erpInFormData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="erpInFormData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="erpInFormData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="erpInFormData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="erpInFormData.cep_status == 6" class="text-primary">确认入库</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-input type="textarea" outlined v-model="erpInFormData.cep_note" label="备注" dense :rows="1" />
          </div>
        </q-form>
      </div>
    </div>

    <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
  </q-page>
</template>

<script>
export default {
  name: 'AddGoods',
  components: {},
  data () {
    return {
      gridOptions: {},
      chooseInvoiceVisible: false,
      erpInFormData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_shipments_quantity: 0,
        cep_total_purchase_amount: 0,
        cep_total_defect_quantity: 0,
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
        cep_type: 3
      },
      context: null,
      searchValue: '',
      components: {},
      supplierData: [],
      purchaseInDepotBufferData: [],
      columnDefs: [],
      sideBarColumn: [],
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      showGoodsList: false,
      erpPrintStatus: false,
      localeText: this.$ag_grid_localeText,
      inTotalAmount: 0,
      purchase_id: '',
      purchaseOrderData: {},
      payTypeObject: {
        1: '账期',
        2: '现结'
      }
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
    getItem () {
      const obj = {
        id: this.purchase_id
      }
      this.$store
        .dispatch('erpin/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.erpInFormData = res.data.erpInFormData ? res.data.erpInFormData : {}
            this.purchaseInDepotBufferData = res.data.purchaseInDepotBufferData.length > 0 ? res.data.purchaseInDepotBufferData : []
            this.purchaseOrderData = res.data.purchaseOrderData ? res.data.purchaseOrderData : {}

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
        {
          headerName: '采购金额',
          field: 'epd_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '到货数量',
          field: 'epd_in_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && parseInt(this.erpInFormData.cep_status) == 1
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },

        {
          headerName: '到货金额',
          field: 'epd_in_amount',
          filter: false,
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
          headerName: '残次差异金额',
          field: 'epd_defect_amount',
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
        this.purchase_id = this.$route.query.id
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

    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          epd_purchase_in_depot_id: this.purchase_id
        }
        this.$store
          .dispatch('erpin/changeBufferQuantity', obj)
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
      if (this.purchaseInDepotBufferData.length <= 0) {
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
            purchase_in_depot_order_id: this.erpInFormData.id,
            ...this.erpInFormData,
            cepStatus,
            purchaseInDepotBufferData: this.purchaseInDepotBufferData
          }
          this.$store
            .dispatch('erpin/changePurchaseInDepotOrder', obj)
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
      if (this.formatAmount(row.epd_in_quantity) > this.formatAmount(row.epd_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '到货数量不得大于发货数量',
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

      row.epd_defect_quantity = this.formatAmount(row.epd_quantity - row.epd_in_quantity)

      row.epd_in_amount = this.formatAmount(row.epd_in_quantity * row.epd_discount_after_amount)

      row.epd_defect_amount = this.formatAmount(row.epd_defect_quantity * row.epd_discount_after_amount)

      this.$store
        .dispatch('erpin/editBufferData', row)
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
      this.erpInFormData.cep_fold_clause = 0
      this.erpInFormData.cep_discount_amount = 0
      this.erpInFormData.cep_total_purchase_amount = 0
      const tableData = this.purchaseInDepotBufferData
      let inTotalNum = 0
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
      })

      this.erpInFormData.cep_total_shipments_quantity = this.formatAmount(inTotalNum)
      this.erpInFormData.cep_total_defect_quantity = this.formatAmount(defectTotalNum)

      this.erpInFormData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
      this.erpInFormData.cep_real_pay_amount = this.formatAmount(inTotalAmount)
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
        fileName: this.erpInFormData.cep_contract_number + '-采购入库单详情'
      })
    },
    erpPrint () {
      if (this.purchaseInDepotBufferData.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.purchase_id, 'in', this.erpInFormData)
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
