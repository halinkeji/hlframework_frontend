<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
      <div class=" col-12 col-md-2">
        <q-select
          class="q-my-sm"
          outlined
          v-model="client_id"
          :options="clientData"
          option-value="id"
          option-label="ecp_name"
          option-disable="inactive"
          emit-value
          map-options
          dense
          use-input
          @filter="filterFn"
          label="请选择客户"
        />
      </div>
      <div class="col-12 col-md-2">
        <q-input dense outlined class="q-mt-sm" @keyup.enter="addItemData(searchValue)" v-model="searchValue" label="请输入条码" />
      </div>
      <div class="col-12 col-md-4">
        <q-btn
          class="q-mt-sm q-mx-sm"
          color="positive"
          unelevated
          label="添加商品"
          v-if="authorityMeta('code')"
          @click="addItemData(searchValue)"
          :disable="searchValue == '' ? true : false"
        />
        <q-btn color="primary" class="q-mt-sm q-mx-sm" @click="selectBut" unelevated v-if="authorityMeta('select')" label="选择商品" />
        <q-btn
          color="red"
          class="q-mt-sm q-mx-sm"
          :disable="goodsSaleData.length > 1 ? false : true"
          unelevated
          v-if="authorityMeta('clean')"
          label="清空销货列表"
          @click="emptyStorageList()"
        />
        <q-space />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="goodsSaleData"
        :rowDragManaged="true"
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
    <div class="col-shrink bg-white q-pb-xl">
      <q-form ref="packageDataRef">
        <div class="row">
          <div class="col-md-3 col-12 q-px-xs">
            <q-input
              outlined
              v-model="gii_discountRate"
              label="折扣率"
              @change="giiDiscountChange"
              dense
              :rules="[(val) => /^([1-9][0-9]{0,1}|100)$/.test(val) || '请输入正确的折扣率']"
            />
          </div>
          <div class="col-md-3 col-12 q-px-xs">
            <q-input outlined v-model="gii_discountAmount" label="折扣额" disable dense :error="false" />
          </div>
          <div class="col-md-3 col-12 q-px-xs">
            <q-input
              outlined
              v-model="gii_primarySupplement"
              label="本次收款"
              @change="giiPrimaryChange"
              dense
              :rules="[(val) => /^[0-9]+\.?[0-9]{0,2}$/.test(val) || '请输入正确的金额']"
            />
          </div>
          <div class="col-md-3 col-12 q-px-xs">
            <q-input outlined v-model="gii_foldClause" label="本次欠款" disable dense :error="false" />
          </div>
          <div class="col-12 q-px-xs">
            <q-input outlined v-model="gii_note" label="备注" dense :error="false" />
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto ">
            账单小计：<span class="text-primary text-h6"> {{ formatAmount(gii_total) }}</span>
          </div>
          <div class="col-auto ">
            总数量：<span class="text-primary text-h6">{{ gii_totalPurchaseNum }}</span>
          </div>
          <q-space />
          <div class="col-auto ">
            <q-btn
              color="primary"
              class="q-px-xl"
              :disable="goodsSaleData.length == 0"
              @click="dataFormSubmit()"
              unelevated
              label="确认销货"
            />
          </div>
          <div class="col-auto ">
            <q-btn color="grey" class="q-px-xl" unelevated :to="{ name: 'sale' }" label="返回" />
          </div>
        </div>
      </q-form>
    </div>

    <hl-specification-tree-erp
      ref="specificationTree"
      v-show="showGoodsList"
      @getSelectedGoodsData="getSelectedGoodsData"
    ></hl-specification-tree-erp>
  </div>
</template>

<script>
import Operator from './AgOperator'
import AgInput from './AgInput'
import AgSelect from './AgSelect'
export default {
  name: 'AddErpSale',
  components: {
    Operator,
    AgInput,
    AgSelect
  },
  data () {
    return {
      searchValue: '',
      context: null,
      client_id: '',
      invoice_id: 0,
      gii_foldClause: 0,
      gii_primarySupplement: 0,
      gii_note: '',
      gii_discountAmount: 0,
      gii_discountRate: 100,
      gii_totalPurchaseNum: 0,
      gii_total: 0,
      hidden_carttotalprice: 0,
      stop: false,
      components: {
        Operator,
        AgSelect
      },
      isSidebarShow: false,
      clientData: [],
      gridOptions: '',
      goodsSaleData: [],
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'eb_goodsName',
          filter: false,
          cellRendererFramework: 'AgInput',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '商品条码',
          field: 'eb_goods_code',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '规格名称 ',
          field: 'eb_specificationName',
          filter: false
        },
        {
          headerName: '出货仓库-库存',
          field: 'depot_id',
          filter: false,
          singleClickEdit: true,
          cellRendererFramework: 'AgSelect',
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '总库存',
          field: 'goodsNumber.gn_number',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '销货单价',
          field: 'eb_goodsPrice',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.goods_id > 0
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '销货数量',
          field: 'eb_goodsNumber',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.goods_id > 0
          },
          width: this.nowpx(0.08) + 'px',
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '折扣率',
          field: 'eb_goodsDiscountRate',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            // alert(p.data.goods_id > 0);
            return p.data.goods_id > 0
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折扣额',

          valueGetter: (p) => {
            return p.data.goods_id > 0 ? (p.data.eb_goodsFoldAmount > 0 ? p.data.eb_goodsFoldAmount : 0) : ''
          },
          filter: false,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折后单价',
          field: 'eb_discountAfterAmount',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '销货金额',
          field: 'eb_goodsCashAmount',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '备注',
          field: 'eb_goodsNote',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            // alert(p.data.goods_id > 0);
            return p.data.goods_id > 0
          },
          width: this.nowpx(0.08) + 'px',
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'Operator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 20
      },
      showGoodsList: false,
      localeText: this.$ag_grid_localeText,
      depotData: []
    }
  },
  computed: {},
  created () {
    this.getClientData()

    this.getList()
    this.getDepotList()
  },
  mounted () {
    this.context = this
  },
  methods: {
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
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
    getList () {
      this.$store
        .dispatch('sale/getGoodsBuf')
        .then((res) => {
          if (res.code == 200) {
            this.goodsSaleData = res.data ? res.data : []
            this.getDataColumnSum()
            this.goodsSaleData.push({})
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
    getClientData () {
      this.$store
        .dispatch('erpCustomer/getClient')
        .then((res) => {
          if (res.code == 200) {
            this.clientData = res.data ? res.data : []
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
    dataFormSubmit () {
      this.$refs.packageDataRef.validate().then((success) => {
        if (success) {
          if (this.goodsSaleData.length <= 1) {
            this.$q.notify({
              message: '注意',
              caption: '请选择销货商品！',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          if (this.client_id <= 0) {
            this.$q.notify({
              message: '注意',
              caption: '请重新选择客户！',
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
              message: '确认销货, 是否继续?'
            })
            .onOk(() => {
              const gii = {
                gii_foldClause: this.gii_foldClause,
                gii_primarySupplement: this.gii_primarySupplement,
                gii_note: this.gii_note,
                gii_discountAmount: this.gii_discountAmount,
                gii_discountRate: this.gii_discountRate,
                gii_totalPurchaseNum: this.gii_totalPurchaseNum,
                gii_total: this.gii_total,
                client_id: this.client_id
              }
              const obj = {
                ...gii,
                goodsSaleData: this.goodsSaleData
              }
              this.$store
                .dispatch('sale/setData', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      message: '成功',
                      caption: '成功销货' + res.data + '条商品',
                      color: 'green',
                      icon: 'ion-checkmark-circle-outline',
                      timeout: 500,
                      position: 'top-right'
                    })
                    this.$router.push({ name: 'sale' })
                  }
                })
                .catch((error) => {
                  this.$q.notify({
                    message: 'Error',
                    caption: error.message,
                    color: 'red',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                })
            })
        }
      })
    },
    delSaleDetail () {
      const obj = {}
      this.$store
        .dispatch('sale/delAll', obj)
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
            this.getList()
            this.gii_totalPurchaseNum = 0
            this.gii_total = 0
            this.gii_primarySupplement = 0
          }
        })
        .catch((error) => {})
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
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    rowSpan (params) {
      const fields = ['eb_goodsName']
      const data = this.goodsSaleData
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
    changeNumber (p) {
      const row = p.data
      const storagePrice = this.formatAmount(row.eb_goodsPrice)
      const eb_goodsNumber = row.eb_goodsNumber
      let eb_goodsDiscountRate = this.formatAmount(row.eb_goodsDiscountRate)
      if (eb_goodsDiscountRate == 0) {
        eb_goodsDiscountRate = 100
      }
      const itemsToUpdate = []
      const regu = /^[0-9]+\.?[0-9]{0,2}$/
      if (!regu.test(row.eb_goodsNumber)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getList()
        return false
      }
      if (parseInt(row.eb_goodsNumber) > parseInt(row.goodsNumber.gn_number)) {
        this.$q.notify({
          message: '警告',
          caption: '库存不足',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getList()
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
        this.getList()
        return false
      }
      const regu3 = /^([1-9][0-9]{0,1}|100)$/
      if (!regu3.test(row.eb_goodsDiscountRate)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getList()
        return false
      }
      // 原价
      const originalPrice = this.formatAmount(storagePrice * eb_goodsNumber)
      // 单个商品折扣
      const discountAmount = this.formatAmount(originalPrice * (eb_goodsDiscountRate * 0.01))
      // 折扣额
      row.eb_goodsFoldAmount = this.formatAmount(originalPrice - discountAmount)
      // 销货金额
      row.eb_goodsCashAmount = this.formatAmount(discountAmount)
      // 数量
      row.eb_goodsNumber = eb_goodsNumber
      // 单价
      row.eb_goodsPrice = storagePrice
      // 折扣率
      row.eb_goodsDiscountRate = eb_goodsDiscountRate
      // 折后金额
      row.eb_discountAfterAmount = this.formatAmount(storagePrice * (eb_goodsDiscountRate * 0.01))
      itemsToUpdate.push(row)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      const obj = {
        id: row.id,
        eb_goodsNumber: eb_goodsNumber,
        eb_goodsCashAmount: this.formatAmount(discountAmount),
        eb_goodsDiscountRate: eb_goodsDiscountRate,
        eb_goodsPrice: storagePrice,
        eb_goodsNote: row.eb_goodsNote,
        eb_discountAfterAmount: this.formatAmount(storagePrice * (eb_goodsDiscountRate * 0.01)),
        eb_goodsFoldAmount: this.formatAmount(originalPrice - discountAmount)
      }
      this.$store
        .dispatch('sale/editButtfer', obj)
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
          }
        })
        .catch((error) => {})
      this.getDataColumnSum()
    },
    filterFn (val, update) {
      update(() => {
        const obj = {
          text: val
        }
        this.$store
          .dispatch('erpCustomer/getClient', obj)
          .then((res) => {
            if (res.code == 200) {
              if (res.data) {
                this.clientData = res.data
              } else {
                this.clientData = []
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
      })
    },
    getDataColumnSum () {
      const tableData = this.goodsSaleData
      this.gii_discountRate = 100
      this.gii_foldClause = 0
      this.gii_discountAmount = 0
      let sumeb_goodsNumber = 0
      let sumeb_goodsCashAmount = 0
      tableData.forEach((item, index) => {
        if (item.eb_goodsNumber) {
          sumeb_goodsNumber = parseInt(sumeb_goodsNumber) + parseInt(item.eb_goodsNumber)
        }
        if (item.eb_goodsCashAmount) {
          sumeb_goodsCashAmount = this.formatAmount(sumeb_goodsCashAmount) + this.formatAmount(item.eb_goodsCashAmount)
        }
      })
      this.gii_totalPurchaseNum = sumeb_goodsNumber
      this.gii_total = sumeb_goodsCashAmount
      this.hidden_carttotalprice = sumeb_goodsCashAmount
      this.gii_primarySupplement = sumeb_goodsCashAmount
      this.giiDiscountChange()
      this.giiPrimaryChange()
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    // 限制输入框必须是正整数
    changeRelativelyNumber (val) {
      let integer = 0
      if (val.replace(/[^\d]/g, '')) {
        integer = val.replace(/[^\d]/g, '')
      }
      return integer
    },
    // 测试商品选择租还组件
    selectBut (searchValue) {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1)
        }, 500)
      })
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data) {
      if (data) {
        const obj = {
          ...data
        }
        this.$store
          .dispatch('sale/addGoodsBuf', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: res.message,
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.searchValue = ''
              this.getList()
              this.getDataColumnSum()
            } else {
              this.$q.notify({
                message: '失败',
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
    // 计算销货详情
    giiDiscountChange () {
      const x = this.formatAmount(this.hidden_carttotalprice)
      const y = this.formatAmount(this.gii_discountRate)
      const n = this.formatAmount(y * 0.01)
      // this.gii_total = this.formatAmount(n * x);
      this.gii_discountAmount = this.formatAmount(x - n * x)
      this.gii_primarySupplement = this.formatAmount(n * x)
      this.gii_foldClause = 0
      this.giiPrimaryChange()
    },
    // 计算本次欠款与本次收款
    giiPrimaryChange () {
      const settlement = this.formatAmount(this.gii_total - this.gii_discountAmount) // 账单小计
      const payment = this.formatAmount(this.gii_primarySupplement) // 本次收款
      // 当本次收款小于
      if (this.formatAmount(payment) > this.formatAmount(settlement)) {
        this.gii_primarySupplement = settlement
        this.gii_foldClause = 0
        this.$q.notify({
          message: '输入错误',
          caption: '输入数据不得大于' + this.formatAmount(this.gii_total * (this.gii_discountRate * 0.01)),
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
      } else {
        this.gii_foldClause = this.formatAmount(settlement - payment)
      }
    },
    addItemData (searchValue) {
      const obj = {
        goodsCode: searchValue
      }
      this.getSelectedGoodsData(obj)
    },
    emptyStorageList () {
      const that = this
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定清空销货列表',
          cancel: true
        })
        .onOk(() => {
          that.$store
            .dispatch('sale/delAll')
            .then((res) => {
              if (res.code == 200) {
                that.$q.notify({
                  message: '成功',
                  caption: '清空成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                that.getList()
                that.gii_totalPurchaseNum = 0
                that.gii_total = 0
                that.gii_primarySupplement = 0
              }
            })
            .catch((error) => {})
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
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
