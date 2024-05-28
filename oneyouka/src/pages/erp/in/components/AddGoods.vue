<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
        <div class="col-12 col-md-2">
          <q-select
            class="q-my-sm"
            outlined
            v-model="erpInFormData.goodssupplier_id"
            :options="supplierData"
            option-value="id"
            option-label="gs_supplierName"
            option-disable="inactive"
            emit-value
            map-options
            dense
            label="请选择供货商"
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
            :disable="searchValue == '' ? true : false"
            @click="addItemData(searchValue)"
          />
          <q-btn color="primary" class="q-mt-sm q-mx-sm" @click="selectBut" unelevated label="选择商品" />
          <q-btn
            color="red"
            class="q-mt-sm q-mx-sm"
            :disable="goodsInData.length > 1 ? false : true"
            unelevated
            label="清空入库列表"
            @click="emptyStorageList()"
          />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="goodsInData"
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
      <div class="col-shrink bg-white q-pa-md q-pb-xl">
        <q-form ref="packageDataRef">
          <div class="row ">
            <div class="col-12 col-md-3 q-px-xs">
              <q-input
                outlined
                v-model="erpInFormData.gii_discountRate"
                label="折扣率"
                @change="giiChangeDiscount"
                dense
                :rules="[(val) => /^([1-9][0-9]{0,1}|100)$/.test(val) || '请输入正确的折扣率']"
              />
            </div>
            <div class="col-12 col-md-3 q-px-xs">
              <q-input outlined v-model="erpInFormData.gii_discountAmount" label="折扣额" disable dense :error="false" />
            </div>
            <div class="col-12 col-md-3 q-px-xs">
              <q-input
                outlined
                v-model="erpInFormData.gii_primarySupplement"
                label="本次付款"
                @change="giiPrimaryChange"
                dense
                :rules="[(val) => /^[0-9]+\.?[0-9]{0,2}$/.test(val) || '请输入正确的金额']"
              />
            </div>
            <div class="col-12 col-md-3 q-px-xs">
              <q-input outlined v-model="erpInFormData.gii_foldClause" label="本次欠款" disable dense :error="false" />
            </div>
            <div class="col-12 q-px-xs">
              <q-input outlined v-model="erpInFormData.gii_note" label="备注" dense  :rows="2" />
            </div>
          </div>
          <div class="row q-gutter-sm q-mt-xs">
            <div class="col-auto">
              账单小计：<span class="text-primary  text-h6"> {{ erpInFormData.gii_total }}</span>
            </div>
            <div class="col-auto">
              总数量：<span class="text-primary text-h6">{{ erpInFormData.gii_totalPurchaseNum }}</span>
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn
                color="primary"
                class="q-px-xl"
                :disable="goodsInData.length == 0"
                @click="dataFormSubmit()"
                unelevated
                label="确认入库"
              />
            </div>
            <div class="col-auto">
              <q-btn color="grey" class="q-px-xl" unelevated  :to="{ name: 'erpIn' }" label="返回" />
            </div>
          </div>
        </q-form>
      </div>
    </div>

    <hl-specification-tree-erp
      ref="specificationTree"
      v-show="showGoodsList"
      @getSelectedGoodsData="getSelectedGoodsData"
    ></hl-specification-tree-erp>
  </q-page>
</template>

<script>
import Operator from './AgOperator'
import AgInput from './AgInput'
import AgSelect from './AgSelect'
import AgTime from './AgTime'
export default {
  name: 'AddGoods',
  components: {
    Operator,
    AgInput,
    AgSelect,
    AgTime
  },
  data () {
    return {
      gridOptions: {},
      erpInFormData: {
        gii_foldClause: 0,
        gii_primarySupplement: 0,
        gii_note: '',
        gii_discountAmount: 0,
        gii_discountRate: 100,
        gii_totalPurchaseNum: 0,
        gii_total: 0,
        goodssupplier_id: ''
      },
      context: null,
      searchValue: '',
      components: {
        Operator,
        AgInput,
        AgSelect,
        AgTime
      },
      supplierData: [],
      goodsInData: [],
      columnDefs: [
        {
          headerName: '商品条码',
          field: 'eb_goods_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        // 表格列数据
        {
          headerName: '商品名称',
          field: 'eb_goodsName',
          filter: false,
          cellRendererFramework: 'AgInput',
          width: this.nowpx(0.2) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '规格名称 ',
          field: 'eb_specificationName',
          filter: false,

          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '入库仓库-库存',
          field: 'depot_id',
          filter: false,
          singleClickEdit: true,
          cellRendererFramework: 'AgSelect',
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '购货单价',
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
          headerName: '入库数量',
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
          valueGetter: (p) => {
            return p.data.goods_id > 0 ? (p.data.eb_discountAfterAmount > 0 ? p.data.eb_discountAfterAmount : p.data.eb_goodsPrice) : ''
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '购货金额',
          field: 'eb_goodsCashAmount',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '预警数量',
          field: 'eb_warning_number',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.goods_id > 0
          },
          width: this.nowpx(0.08) + 'px',
          onCellValueChanged: this.changeWarningNumber
        },
        {
          headerName: '预警时间',
          field: 'eb_warning_number',
          filter: false,
          singleClickEdit: true,
          cellRendererFramework: 'AgTime',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '备注',
          field: 'eb_goodsNote',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.goods_id > 0
          },
          onCellValueChanged: this.changeNumber,

          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'Operator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.05) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      showGoodsList: false,
      localeText: this.$ag_grid_localeText,
      inTotalAmount: 0,
      depotData: []
    }
  },

  computed: {},
  created () {
    this.getSupplierList()
    this.getDepotList()
  },

  mounted () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.$store
        .dispatch('erpin/getGoodsBuf')
        .then((res) => {
          if (res.code == 200) {
            this.goodsInData = res.data ? res.data : []
            this.$nextTick(() => {
              this.getDataColumnSum()
            })
          }
          this.goodsInData.push({})
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

    getSupplierList () {
      this.$store
        .dispatch('supplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierData = res.data ? res.data : []
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

    dataFormSubmit () {
      this.$refs.packageDataRef.validate().then((success) => {
        if (success) {
          if (this.goodsInData.length <= 1) {
            this.$q.notify({
              message: '注意',
              caption: '请选择入库商品！',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          if (this.erpInFormData.goodssupplier_id <= 0) {
            this.$q.notify({
              message: '注意',
              caption: '请重新选择供货商！',
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
              message: '确认入库, 是否继续?'
            })
            .onOk(() => {
              this.addErpInData()
            })
        }
      })
    },

    addErpInData () {
      const obj = {
        ...this.erpInFormData,
        goodsInData: this.goodsInData
      }
      this.$store
        .dispatch('erpin/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功入库' + res.data + '条商品',
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

      // 购货金额
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
      p.api.applyTransaction({ update: itemsToUpdate })

      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      this.$store
        .dispatch('erpin/editButtfer', row)
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

    changeWarningNumber (p) {
      const row = p.data
      const itemsToUpdate = []
      const regu = /^[1-9]\d*$/
      if (!regu.test(row.eb_warning_number)) {
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
      itemsToUpdate.push(row)
      p.api.applyTransaction({ update: itemsToUpdate })

      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      this.$store
        .dispatch('erpin/editButtfer', row)
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
      this.erpInFormData.gii_discountRate = 100
      this.erpInFormData.gii_foldClause = 0
      this.erpInFormData.gii_discountAmount = 0
      this.erpInFormData.gii_total = 0
      const tableData = this.goodsInData
      let inTotalNum = 0
      let inTotalAmount = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.eb_goodsNumber)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.eb_goodsNumber)
        }
        if (this.formatAmount(item.eb_goodsCashAmount)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.eb_goodsCashAmount)
        }
      })
      this.erpInFormData.gii_totalPurchaseNum = this.formatAmount(inTotalNum)
      this.erpInFormData.gii_total = this.formatAmount(inTotalAmount)
      this.erpInFormData.gii_primarySupplement = this.formatAmount(inTotalAmount)
    },

    // 限制输入框必须是正整数
    changeRelativelyNumber (val) {
      let integer = 0
      if (val.replace(/[^\d]/g, '')) {
        integer = val.replace(/[^\d]/g, '')
      }
      return integer
    },

    // 计算本次欠款与本次付款
    giiPrimaryChange () {
      const settlement = this.formatAmount(this.erpInFormData.gii_total - this.erpInFormData.gii_discountAmount) // 账单小计

      const payment = this.formatAmount(this.erpInFormData.gii_primarySupplement) // 本次付款
      // 当本次付款小于
      if (this.formatAmount(payment) > this.formatAmount(settlement)) {
        this.erpInFormData.gii_primarySupplement = settlement
        this.erpInFormData.gii_foldClause = 0
        this.$q.notify({
          message: '输入错误',
          caption: '输入数据不得大于' + this.formatAmount(this.erpInFormData.gii_total * (this.erpInFormData.gii_discountRate * 0.01)),
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.erpInFormData.gii_foldClause = this.formatAmount(this.formatAmount(settlement) - this.formatAmount(payment))
    },

    // 计算本次折扣额
    giiChangeDiscount () {
      const settlement = this.formatAmount(this.erpInFormData.gii_total) // 账单小计

      this.erpInFormData.gii_discountRate = this.changeRelativelyNumber(this.erpInFormData.gii_discountRate)

      this.erpInFormData.gii_discountAmount = this.formatAmount(
        settlement - this.formatAmount(settlement) * (this.erpInFormData.gii_discountRate * 0.01)
      )

      this.erpInFormData.gii_primarySupplement = this.formatAmount(settlement - this.formatAmount(this.erpInFormData.gii_discountAmount))
      this.giiPrimaryChange()
    },

    addItemData (searchValue) {
      const obj = {
        goodsCode: searchValue
      }
      this.addBufferData(obj)
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        setTimeout(() => {
          that.addBufferData(data)
        }, 500)
      }
    },

    addBufferData (data) {
      this.$store
        .dispatch('erpin/addGoodsBuf', data)
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
            this.getList()
          } else {
            this.$q.notify({
              message: '添加失败',
              caption: res.data.msg,
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
      const that = this
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定清空入库列表',
          cancel: true
        })
        .onOk(() => {
          setTimeout(() => {
            that.$store
              .dispatch('erpin/delAll')
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
          }, 500)
        })
    },

    deleteRecord () {
      this.$store
        .dispatch('erpin/delAll')
        .then((res) => {
          if (res.code == 200) {
            this.goodsInData = []
            this.$q.notify({
              message: '成功',
              caption: '清空成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
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
    },

    selectBut () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1)
        }, 500)
      })
    },

    rowSpan (params) {
      const fields = ['eb_goodsName']
      const data = this.goodsInData
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
