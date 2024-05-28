<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md ">
        <q-form ref="erpInRef">
          <div class="row q-gutter-sm items-start">
            <q-btn color="grey" unelevated :to="{ name: 'erpStoreReturn' }" label="返回" />
            <q-btn
              color="red"
              :disable="returnGoodsBufferData.length > 0 ? false : true"
              unelevated
              v-if="storeReturnData.cep_status == 1"
              label="清空退货列表"
              @click="emptyStorageList()"
            />
            <q-btn
              color="info"
              unelevated
              label="装箱"
              v-if="storeReturnData.cep_if_pack == '1' && storeReturnData.cep_status < 2 && authorityMeta('packing')"
              :disable="returnGoodsBufferData.length > 0 ? false : true"
              @click="addPacking()"
            />
            <q-btn
              color="secondary"
              unelevated
              label="装箱信息"
              v-if="storeReturnData.cep_if_pack == '1' && authorityMeta('packingDetail')"
              :disable="returnGoodsBufferData.length > 0 ? false : true"
              @click="showPackingData"
            />
            <q-btn
              color="warning"
              :disable="storeReturnData.cep_status < 2 ? false : true"
              v-if="authorityMeta('hangup')"
              @click="hangupOrderData"
              unelevated
              label="挂起"
            />

            <q-btn
              color="primary"
              :disable="storeReturnData.cep_status == 1 || storeReturnData.cep_status == 5 ? false : true"
              v-if="authorityMeta('save')"
              @click="saveOrderData"
              unelevated
              label="保存"
            />
            <q-btn
              color="primary"
              :disable="storeReturnData.cep_status == 1 ? false : true"
              v-if="authorityMeta('confirm')"
              @click="confirmOrderData"
              unelevated
              label="确认"
            />
            <q-btn
              color="positive"
              :disable="storeReturnData.cep_status == 2 ? false : true"
              v-if="authorityMeta('audit')"
              @click="auditOrderData"
              unelevated
              label="审核"
            />
            <q-btn
              color="red"
              :disable="storeReturnData.cep_status == 2 ? false : true"
              v-if="authorityMeta('cancel')"
              @click="cancelOrderConfirmData"
              unelevated
              label="取消确定"
            />
            <q-btn
              color="red"
              :disable="storeReturnData.cep_status == 1 ? false : true"
              v-if="authorityMeta('close')"
              @click="closeOrderData"
              unelevated
              label="作废"
            />

            <div class="col-12 col-md-1" v-if="storeReturnData.cep_status < 2">
              <q-select
                outlined
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="storeReturnData.cep_if_pack"
                :options="[
                  {
                    label: '是',
                    value: '1',
                  },
                  {
                    label: '否',
                    value: '2',
                  },
                ]"
                dense
                label="是否装箱"
                bottom-slots
              />
            </div>

            <q-btn color="primary" @click="selectBut" v-if="storeReturnData.cep_status < 2" unelevated label="选择商品" />

            <q-btn color="green" @click="batchImport()" unelevated v-if="authorityMeta('import')">
              Xlxs 文件批量导入
            </q-btn>
            <div class="col-12 col-md-2" v-if="storeReturnData.cep_status < 2">
              <q-input dense outlined @keyup.enter="addItemData(searchValue)" bottom-slots v-model="searchValue" label="请输入SKU码或唯一码" />
            </div>

            <div class="col">
              <q-btn
                color="positive"
                unelevated
                label="添加商品"
                v-if="authorityMeta('code')"
                :disable="searchValue == '' ? true : false"
                @click="addItemData(searchValue)"
              />
            </div>

            <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="returnGoodsBufferData.length > 0 && store_return_id > 0" />
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
      <upload-table-purchase v-if="uploadStatus" ref="returnTypes" @closeUpload="uploadTable"></upload-table-purchase>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="returnGoodsBufferData"
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
      <div class="col-shrink bg-white q-pa-md q-pb-md row">
        <div class="col-auto">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">{{ storeReturnData.cep_total_purchase_amount }}</q-item-label>
              <q-item-label caption lines="2">账单小计</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-auto">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">{{ storeReturnData.cep_total_purchase_num }}</q-item-label>
              <q-item-label caption lines="2">总数量</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col-auto">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-weight-bold">
                <span v-if="storeReturnData.cep_status == 1" class="text-primary">已保存</span>
                <span v-if="storeReturnData.cep_status == 2" class="text-primary">已确定</span>
                <span v-if="storeReturnData.cep_status == 3" class="text-positive">已审核</span>
                <span v-if="storeReturnData.cep_status == 4" class="text-red">已作废</span>
                <span v-if="storeReturnData.cep_status == 5" class="text-warning">挂起</span>
                <span v-if="storeReturnData.cep_status == 6" class="text-primary">已分配</span>
                <span v-if="storeReturnData.cep_status == 7" class="text-primary">出库中</span>
                 <span v-if="storeReturnData.cep_status == 8" class="text-primary">已入总仓</span>
              </q-item-label>
              <q-item-label caption lines="2">单据状态</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col">
          <q-input
            type="textarea"
            :disable="storeReturnData.cep_status < 2 ? false : true"
            outlined
            v-model="storeReturnData.cep_note"
            label="备注"
            dense
            :rows="1"
          />
        </div>
      </div>
    </div>
    <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
    <hl-specification-tree-erp
      ref="specificationTree"
      v-show="showGoodsList"
      @getSelectedGoodsData="getSelectedGoodsData"
    ></hl-specification-tree-erp>
    <show-packing ref="showDataRef" v-if="showPackingStatus" @dataList="showPackingStatus = false" />
  </q-page>
</template>

<script>
import AgOperator from './AgOperator'
import ShowPacking from 'pages/erp/packing/components/ShowPacking'
export default {
  name: 'AddGoods',
  components: {
    AgOperator,
    ShowPacking
  },
  data () {
    return {
      gridOptions: {},
      storeReturnData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_purchase_num: 0,
        cep_total_purchase_amount: 0,
        cep_note: '',
        cep_depot_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: 10,
        cep_order_store_id: ''
      },
      context: null,
      searchValue: '',
      components: {
        AgOperator
      },
      showPackingStatus: false,
      returnGoodsBufferData: [],
      columnDefs: [],
      sideBarColumn: [],
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      depotData: [],
      showGoodsList: false,
      uploadStatus: false,
      erpPrintStatus: false,
      localeText: this.$ag_grid_localeText,
      store_return_id: '',
      libInStoreList: [],
      packingInfo: []
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
          headerName: '规格 ',
          field: 'epd_spe_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货数量',
          field: 'epd_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0
          },
          width: this.nowpx(0.06) + 'px',
          onCellValueChanged: this.changeNumber,
          comparator: (a, b) => a - b
        },
        {
          headerName: '退货单价',
          field: 'epd_price',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.storeReturnData.cep_status < 2
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.07) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '折扣率',
          field: 'epd_discount_rate',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.storeReturnData.cep_status < 2
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.05) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '折扣额',
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_fold_amount > 0 ? p.data.epd_fold_amount : 0) : ''
          },
          filter: false,
          width: this.nowpx(0.05) + 'px',
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
          headerName: '退货金额',
          field: 'epd_cash_amount',
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
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.04) + 'px'
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })
      if (this.$route.query.id) {
        this.store_return_id = this.$route.query.id
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
      if (this.returnGoodsBufferData.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.store_return_id, 'store', this.storeReturnData)
          }, 500)
        })
      }
    },

    uploadTable () {
      this.uploadStatus = false
      this.getItem()
    },
    batchImport () {
      this.uploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('storeReturn', this.store_return_id, this.storeReturnData.cep_order_store_id)
        }, 500)
      })
    },

    getItem () {
      const obj = {
        id: this.store_return_id
      }
      this.$store
        .dispatch('erpStoreReturn/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.storeReturnData = res.data.storeReturnData && res.data.storeReturnData.id ? res.data.storeReturnData : {}
            this.returnGoodsBufferData = res.data.returnGoodsBufferData && res.data.returnGoodsBufferData.length > 0 ? res.data.returnGoodsBufferData : []
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
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      const row = p.data
      const storagePrice = this.formatAmount(row.epd_price)
      const epd_price = row.epd_price
      let epd_discount_rate = this.formatAmount(row.epd_discount_rate)
      if (epd_discount_rate == 0) {
        epd_discount_rate = 100
      }
      const itemsToUpdate = []

      const regu2 = /^[0-9]+\.?[0-9]{0,2}$/
      if (!regu2.test(storagePrice)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_price = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      const regu3 = /^([1-9][0-9]{0,1}|100)$/
      if (!regu3.test(row.epd_discount_rate)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_discount_rate = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      // 原价
      const originalPrice = this.formatAmount(storagePrice * epd_price)
      // 单个商品折扣
      const discountAmount = this.formatAmount(originalPrice * (epd_discount_rate * 0.01))
      // 折扣额
      row.epd_fold_amount = this.formatAmount(originalPrice - discountAmount)
      // 购货金额
      row.epd_cash_amount = this.formatAmount(discountAmount)
      // 数量
      row.epd_price = epd_price
      // 单价
      row.epd_price = storagePrice
      // 折扣率
      row.epd_discount_rate = epd_discount_rate
      // 折后金额
      row.epd_discount_after_amount = this.formatAmount(storagePrice * (epd_discount_rate * 0.01))

      row.currentStoreId = this.storeReturnData.cep_order_store_id

      this.$store
        .dispatch('erpStoreReturn/editBufferData', row)
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
              color: 'red',
              message: '失败',
              caption: res.message,
              con: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
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
      this.storeReturnData.cep_fold_clause = 0
      this.storeReturnData.cep_discount_amount = 0
      this.storeReturnData.cep_total_purchase_amount = 0
      const tableData = this.returnGoodsBufferData
      let inTotalNum = 0
      let inTotalAmount = 0
      tableData.forEach((item, index) => {
        // if (this.formatAmount(item.epd_price)) {
        //   inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_price)
        // }
        if (this.formatAmount(item.epd_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_quantity)
        }
        if (this.formatAmount(item.epd_cash_amount)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_cash_amount)
        }
      })
      this.storeReturnData.cep_total_purchase_num = this.formatAmount(inTotalNum)
      this.storeReturnData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
      // this.storeReturnData.cep_real_pay_amount = this.formatAmount(inTotalAmount)
    },

    hangupOrderData () {
      this.saveDataOperate('挂起', 5)
    },

    saveOrderData () {
      this.saveDataOperate('保存', 1)
    },

    confirmOrderData () {
      this.saveDataOperate('确认', 2)
    },

    auditOrderData () {
      this.saveDataOperate('审核', 3)
    },

    cancelOrderConfirmData () {
      this.saveDataOperate('取消确定', -2)
    },

    closeOrderData () {
      this.saveDataOperate('作废', 4)
    },

    cancelAudit () {
      this.saveDataOperate('取消审核', -3)
    },

    saveDataOperate (text, cepStatus) {
      if (this.returnGoodsBufferData.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择退货商品!',
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
          message: text + '退货单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            store_return_id: this.store_return_id,
            ...this.storeReturnData,
            cepStatus,
            returnGoodsBufferData: this.returnGoodsBufferData
          }
          this.$store
            .dispatch('erpStoreReturn/setChangePurchaseOrder', obj)
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

    addPacking () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: '是否进行装箱操作'
        })
        .onOk(() => {
          const obj = {
            bufferData: this.returnGoodsBufferData,
            erp_order_id: this.store_return_id
          }
          this.$store
            .dispatch('erpOrderGoods/setPacking', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功装箱' + (res.data || 0) + '件商品',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 800,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.getItem()
                })
              } else {
                this.$q.notify({
                  message: '添加失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
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

    showPackingData () {
      this.showPackingStatus = true

      this.$nextTick(() => {
        this.$refs.showDataRef.init('cep_ordergoods_id', this.store_return_id)
      })
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        setTimeout(() => {
          const obj = {
            bufferDatas: data,
            store_return_id: this.store_return_id,
            currentStoreId: this.storeReturnData.cep_order_store_id
          }
          that.addGoodsInBufferData(obj)
        }, 500)
      }
    },

    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          store_return_id: this.store_return_id,
          currentStoreId: this.storeReturnData.cep_order_store_id
        }
        this.addGoodsInBufferData(obj)
      }
    },

    addGoodsInBufferData (data) {
      this.$store
        .dispatch('erpStoreReturn/addGoodsInBuffer', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '成功添加' + res.data + '条商品',
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
    },
    emptyStorageList () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定清空退货列表',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('erpStoreReturn/clearBufferData', {
              store_return_id: this.store_return_id
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '清空成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
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
        })
    },
    selectBut () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1)
        }, 500)
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

<style>
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
