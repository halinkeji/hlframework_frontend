<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-form ref="erpInRef" class="row q-gutter-sm">
          <q-btn
            color="grey"
            unelevated
            :to="{
              name: 'erpDirect',
            }"
            label="返回"
          />

          <q-btn
            color="red"
            :disable="directBufferData.length > 1 ? false : true"
            unelevated
            label="清空直采列表"
            @click="emptyStorageList"
            v-if="directFormData.cep_status < 2"
          />

          <q-btn
            color="warning"
            :disable="directFormData.cep_status < 2 ? false : true"
            v-if="authorityMeta('hangup')"
            @click="hangupOrderData"
            unelevated
            label="挂起"
          />
          <q-btn
            color="primary"
            :disable="directFormData.cep_status < 1 || directFormData.cep_status == 5 ? false : true"
            v-if="authorityMeta('save')"
            @click="saveOrderData"
            unelevated
            label="保存"
          />
          <q-btn
            color="primary"
            :disable="directFormData.cep_status == 1 ? false : true"
            v-if="authorityMeta('confirm')"
            @click="confirmOrderData"
            unelevated
            label="确认"
          />
          <q-btn
            color="positive"
            :disable="directFormData.cep_status == 2 ? false : true"
            v-if="authorityMeta('audit')"
            @click="auditOrderData"
            unelevated
            label="审核"
          />
          <q-btn
            color="negative"
            :disable="directFormData.cep_status == 3 ? false : true"
            v-if="authorityMeta('revoke')"
            @click="cancelAudit"
            unelevated
            label="取消审核"
          />
          <q-btn
            color="red"
            :disable="directFormData.cep_status == 2 ? false : true"
            v-if="authorityMeta('cancel')"
            @click="cancelOrderConfirmData"
            unelevated
            label="取消确定"
          />
          <q-btn
            color="primary"
            :disable="directFormData.cep_status == 3 ? false : true"
            v-if="authorityMeta('storage')"
            @click="confirmInOrderData"
            unelevated
            label="确认下单"
          />
          <q-btn
            color="red"
            :disable="directFormData.cep_status == 1 ? false : true"
            v-if="authorityMeta('close')"
            @click="closeOrderData"
            unelevated
            label="作废"
          />

           <q-btn color="primary" @click="selectBut" v-if="authorityMeta('select') && directFormData.cep_status < 2" unelevated label="选择商品" />

           <div class="col-12 col-md-2" v-if="directFormData.cep_status < 2">
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

          <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="directBufferData.length > 0 && direct_order_id > 0" />
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
      <div class="col-shrink bg-white  q-pb-md">
        <q-form ref="erpInRef" class="row">
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ directFormData.cep_supplier_name }}</q-item-label>
                <q-item-label caption lines="2">供货商</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ directFormData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">仓库名称</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ directFormData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">账单小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ directFormData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col" v-if="directFormData.cep_status > 0">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  <span v-if="directFormData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="directFormData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="directFormData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="directFormData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="directFormData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="directFormData.cep_status == 6" class="text-primary">已下单</span>
                  <span v-if="directFormData.cep_status == 7" class="text-primary">已分配</span>
                  <span v-if="directFormData.cep_status == 8" class="text-primary">已配货</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-3">
            <q-input
              type="textarea"
              outlined
              v-model="directFormData.cep_note"
              :disable="directFormData.cep_status < 2 ? false : true"
              label="备注"
              dense
              :rows="1"
            />
          </div>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2  q-pb-sm">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="directBufferData"
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
    <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
    <goods-tree-erp ref="specificationTree" v-show="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData"></goods-tree-erp>
  </q-page>
</template>

<script>
import AgOperator from './AgOperator'
import GoodsTreeErp from './GoodsTreeErp'
export default {
  name: 'AddErpDirect',
  components: {
    AgOperator,
    GoodsTreeErp
  },
  data () {
    return {
      gridOptions: {},
      directFormData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_purchase_num: 0,
        cep_total_purchase_amount: 0,
        cep_supplier_id: '',
        cep_note: '',
        cep_pay_type: '',
        cep_supplier_name: '',
        cep_supplier_code: '',
        cep_depot_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_status: 0,
        cep_type: 14,
        cep_order_store_id: ''
      },
      context: null,
      searchValue: '',
      components: {
        AgOperator
      },
      directBufferData: [],
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      columnDefs: [],
      sideBarColumn: [],
      erpPrintStatus: false,

      showGoodsList: false,
      localeText: this.$ag_grid_localeText,
      inTotalAmount: 0,
      direct_order_id: '',
      libInStoreList: []
    }
  },
  created () {

  },
  mounted () {
    this.context = this
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
          headerName: '直采数量',
          field: 'epd_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.directFormData.cep_status < 2
          },
          width: this.nowpx(0.06) + 'px',
          onCellValueChanged: this.changeNumber,
          comparator: (a, b) => a - b
        },
        {
          headerName: '直采单价',
          field: 'epd_price',
          filter: false,
          singleClickEdit: true,
          // editable: (p) => {
          //   return p.data.epd_archives_id > 0
          // },
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
            return p.data.epd_archives_id > 0 && this.directFormData.cep_status < 2
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
          headerName: '直采金额',
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
        this.direct_order_id = this.$route.query.id
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
        id: this.direct_order_id
      }
      this.$store
        .dispatch('erpDirect/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.directFormData = res.data.directFormData && res.data.directFormData.id ? res.data.directFormData : {}
            this.directBufferData = res.data.directBufferData && res.data.directBufferData.length > 0 ? res.data.directBufferData : []

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

    confirmInOrderData () {
      this.saveDataOperate('确认下单', 7)
    },

    saveDataOperate (text, cepStatus) {
      if (this.directBufferData.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择直采商品!',
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
          message: text + '直采单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            direct_order_id: this.direct_order_id,
            ...this.directFormData,
            cepStatus,
            directBufferData: this.directBufferData
          }
          this.$store
            .dispatch('erpDirect/setChangeDirectOrder', obj)
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
      const storagePrice = this.formatAmount(row.epd_price)
      const epd_quantity = row.epd_quantity
      let epd_discount_rate = this.formatAmount(row.epd_discount_rate)
      if (epd_discount_rate == 0) {
        epd_discount_rate = 100
      }
      const itemsToUpdate = []
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(row.epd_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_quantity = p.oldValue ? p.oldValue : 0
        return false
      }
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
      // 增量
      if (parseInt(row.epd_type) == 2 && this.formatAmount(row.epd_minimum_order) > this.formatAmount(row.epd_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '直采数量必须大于起订数量',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      // // 倍率
      if (parseInt(row.epd_type) == 3 && this.formatAmount(row.epd_quantity) % this.formatAmount(row.epd_minimum_order) != 0) {
        this.$q.notify({
          message: '警告',
          caption: '直采数量必须是起订数量的倍数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      // 原价
      const originalPrice = this.formatAmount(storagePrice * epd_quantity)
      // 单个商品折扣
      const discountAmount = this.formatAmount(originalPrice * (epd_discount_rate * 0.01))
      // 折扣额
      row.epd_fold_amount = this.formatAmount(originalPrice - discountAmount)
      // 购货金额
      row.epd_cash_amount = this.formatAmount(discountAmount)
      // 数量
      row.epd_quantity = epd_quantity
      // 单价
      row.epd_price = storagePrice
      // 折扣率
      row.epd_discount_rate = epd_discount_rate
      // 折后金额
      row.epd_discount_after_amount = this.formatAmount(storagePrice * (epd_discount_rate * 0.01))

      this.$store
        .dispatch('erpDirect/editButtfer', row)
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

      this.getDataColumnSum()
    },
    getDataColumnSum () {
      this.directFormData.cep_total_amount = 0
      const tableData = this.directBufferData
      let inTotalNum = 0
      let inTotalAmount = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_quantity)
        }
        if (this.formatAmount(item.epd_cash_amount)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_cash_amount)
        }
      })

      this.directFormData.cep_total_purchase_num = this.formatAmount(inTotalNum)
      this.directFormData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        setTimeout(() => {
          const obj = {
            bufferDatas: data,
            direct_order_id: this.direct_order_id
          }
          that.addGoodsInBufferData(obj)
        }, 500)
      }
    },

    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          direct_order_id: this.direct_order_id
        }
        this.addGoodsInBufferData(obj)
      }
    },

    addGoodsInBufferData (data) {
      this.$store
        .dispatch('erpDirect/addGoodsInBuffer', data)
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
          message: '确定清空直采列表',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('erpDirect/clearBufferData', {
              direct_order_id: this.direct_order_id
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
          this.$refs.specificationTree.getInquireType(1, this.directFormData.cep_supplier_id)
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
        // params.api.sizeColumnsToFit();
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
      if (this.directBufferData.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.direct_order_id, 'direct', this.directFormData)
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

<style>
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  tex-align: center;
}
</style>
