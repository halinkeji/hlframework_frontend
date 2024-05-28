<template>
  <div>
    <q-dialog
      @hide="hideNowPage"
      v-model="viewDetails"
      persistent
      full-height
      fullscreen
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <q-card-section class="row q-pa-none">
            <span class="row text-h6 q-px-md"> 退换货 </span>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </q-card-section>
          <div class="col-shrink q-px-xs q-py-none full-height bg-white">
            <q-scroll-area class="fit full-height">
              <div v-if="invoiceId == ''" class="row">
                <div class="col-6">
                  <q-input
                    outlined
                    v-model="invoiceCode"
                    @keyup.enter="getViewCodeData()"
                    label="请输入消费收银单据号"
                    class="q-mt-xs q-pb-xl"
                    dense
                    ref="goodsBarCodeInput"
                  >
                    <template v-slot:after>
                      <q-btn color="primary" label="查询" @click="getViewCodeData()" />
                    </template>
                  </q-input>
                </div>
              </div>

              <div v-if="invoiceData.id > 0">
                <q-card-section>
                  <q-item-label class="row q-gutter-y-md">
                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      消费单据号:<span class="text-body1">{{ invoiceData.sc_invoiceCode }}</span>
                    </div>
                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      会员卡号:<span class="text-body1">{{ invoiceData.sc_memberCardNum }}</span>
                    </div>
                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      会员姓名:<span class="text-body1">{{ invoiceData.sc_memberName }}</span>
                    </div>
                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      时间:<span class="text-body1">{{ this.$q_date.formatDate(invoiceData.created_at * 1000, 'YYYY-MM-DD HH:mm') }}</span>
                    </div>

                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      应付金额:<span class="text-body1">{{ invoiceData.sc_handleMoneyCount }}</span>
                    </div>
                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      实收金额:<span class="text-body1">{{ invoiceData.sc_realMoneyCount }}</span>
                    </div>

                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      操作员:<span class="text-body1">{{ invoiceData.user ? invoiceData.user.username : '操作员' }}</span>
                    </div>
                    <div class="col col-md-3 col-sm-6 col-xs-12">
                      备注:<span class="text-body1">{{ invoiceData.sc_note }}</span>
                    </div>
                  </q-item-label>
                </q-card-section>
                <q-separator color="primary" />
                <div class="q-mt-xs" v-if="invoiceData.consumeInvoiceDetail.length > 0">
                  <q-table
                    title="消费详情"
                    :data="invoiceData.consumeInvoiceDetail"
                    :columns="consumeData"
                    row-key="id"
                    hide-bottom
                    flat
                    bordered
                    title-classs="bg-brown"
                    separator="vertical"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td key="cid_packageName" :props="props">
                          <div>
                            {{ props.row.cid_packageName }}
                            <q-tooltip> {{ props.row.cid_packageName }}</q-tooltip>
                          </div>
                        </q-td>
                        <q-td key="cid_goo_name" :props="props">
                           <div>
                          {{ props.row.cid_goo_name }}{{ props.row.cid_specificationName }}
                          <q-tooltip> {{ props.row.cid_goo_name }}{{ props.row.cid_specificationName }}</q-tooltip>
                        </div>
                        </q-td>
                        <q-td key="cid_goo_code" :props="props">
                          {{ props.row.cid_goo_code }}
                        </q-td>
                        <q-td key="cid_consumeNumber" :props="props">
                         <span v-if="parseInt(props.row.cid_packageId) > 0" class="text-red">[套]</span>
                        {{ props.row.cid_consumeNumber }}
                        </q-td>
                        <q-td key="cid_goo_price" :props="props">
                         <span v-if="parseInt(props.row.cid_packageId) > 0" class="text-red">[套]</span>
                        {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ props.row.cid_goo_price }}
                        </q-td>
                        <q-td key="cid_sellingPrice" :props="props">
                          <span v-if="parseInt(props.row.cid_packageId) > 0" class="text-red">[套]</span>
                        {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ props.row.cid_sellingPrice }}
                        </q-td>
                        <q-td key="cid_discount_rate" :props="props">
                          {{ props.row.cid_discount_rate }}
                        </q-td>
                        <q-td key="cid_discount_amount" :props="props">
                          {{ props.row.cid_discount_amount }}
                        </q-td>
                        <q-td key="cid_memberPrice" :props="props">
                          {{ props.row.cid_memberPrice }}
                        </q-td>

                        <q-td key="cid_totalPrice" :props="props">
                          <span v-if="parseInt(props.row.cid_packageId) > 0" class="text-red">[套]</span>
                        {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ props.row.cid_totalPrice }}
                        </q-td>
                        <q-td key="alreadyReturnNumber" :props="props">
                          {{ props.row.alreadyReturnNumber }}
                        </q-td>

                        <q-td key="id" :props="props">
                          <q-input
                            outlined
                            dense
                            stack-label
                            v-if="props.row.alreadyReturnNumber < props.row.cid_consumeNumber"
                            class="q-pa-none"
                            v-model="props.row.rgd_return_quantity"
                            @blur="returnChange(props.row)"
                            label="退货数量"
                          />

                          <span v-else>已退货</span>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <q-card class="q-pa-sm">
                  <q-card-section class="row q-pa-none">
                    <span class="row text-h6 q-px-md"> 换货详情 </span>
                    <q-input
                      outlined
                      @keyup.enter="addingGoodsBut(null, 3, null)"
                      v-model="goodsBarCode"
                      label="请输入商品编码"
                      class="q-pa-none q-mx-lg q-mb-xs"
                      dense
                      ref="goodsBarCodeInput"
                    >
                      <template v-slot:after>
                        <q-btn padding="xs" icon="add_box" color="primary" @click="addingGoodsBut(null, 3, null)" />
                      </template>
                    </q-input>
                    <q-btn color="primary" class="q-pa-none q-mx-lg q-mb-xs" @click="selectBut" unelevated label="选择商品" />
                  </q-card-section>
                  <div class="col-shrink q-px-xs q-py-none bg-grey-2" style="height: 400px; min-height: 400px">
                    <ag-grid-vue
                      ref="agGridTable"
                      :gridOptions="gridOptions"
                      class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
                      :columnDefs="columnDefs"
                      :suppressMovableColumns="true"
                      :rowData="shoppingCartsList"
                      rowSelection="multiple"
                      @first-data-rendered="onFirstDataRendered"
                      rowHeight="40"
                      :rowDragManaged="true"
                      colResizeDefault="shift"
                      :animateRows="false"
                      :floatingFilter="false"
                      :enableCharts="true"
                      :enableRangeSelection="true"
                      :enableCellTextSelection="true"
                      :suppressRowTransform="true"
                      :suppressCellSelection="true"
                      :suppressRowClickSelection="true"
                      :rowMultiSelectWithClick="true"
                      :singleClickEdit="true"
                      :stopEditingWhenGridLosesFocus="true"
                      :localeText="localeText"
                      :context="context"
                      @rowSelected="rowSelectedAg"
                      @gridReady="onFirstDataRendered"
                    ></ag-grid-vue>
                  </div>
                </q-card>
              </div>
            </q-scroll-area>
          </div>
          <div class="col-shrink bg-white q-pt-sm q-pa-md" v-if="invoiceData.id > 0">
            <div class="row">
              <q-space />
              <div class="col-md-4 col-12 q-mb-sm">
                <q-select
                  dense
                  outlined
                  stack-label
                  class="q-pa-none q-mx-sm"
                  v-model="returnMode"
                  :options="returnStatusData"
                  :disable="(totalReturnCount > 0 && totaChanglAmount < 1) || totalAmount < 0 ? false : true"
                  option-value="value"
                  option-label="text"
                  label="退款方式"
                  emit-value
                  map-options
                />
              </div>
            </div>
            <div class="row q-px-sm q-pb-lg q-gutter-md">
              <div class="col-6 col-md-2 q-pa-xs">
                退货数量: 共<span class="text-h5 text-negative"> {{ totalReturnCount }} </span>
                <!-- 件 -->
              </div>
              <div class="col-6 col-md-2 q-pa-xs">
                退货金额:
                <span class="text-h5 text-negative"
                  >{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ totalReturnAmount }}</span
                >
              </div>
              <div class="col-6 col-md-2 q-pa-xs">
                换货数量: 共<span class="text-h5 text-negative"> {{ totaChanglAmount }}</span> 件
              </div>
              <div class="col-6 col-md-2 q-pa-xs">
                差异金额:
                <span class="text-h5 text-negative">
                  {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ totalAmount }}</span
                >
              </div>
              <q-space />

              <q-btn
                unelevated
                color="blue-6"
                class="q-px-md"
                label="结账"
                @click="openCheckoutCounterPage()"
                :disable="totalAmount > 0 ? false : true"
                icon="las la-chevron-circle-down"
              />
              <q-btn
                color="red"
                text-color="white"
                label="退货"
                :disable="(totalReturnCount > 0 && totaChanglAmount < 1) || totalAmount < 0 ? false : true"
                class="q-px-md q-ml-sm"
                icon="las la-sign-out-alt"
                @click="setReturnData"
                unelevated
              />
            </div>
          </div>
        </div>
        <hl-checkout
          @paySuccessCallBack="paySuccessCallBack"
          @closeCheckoutPopup="checkoutPageReceive = false"
          ref="openCheckoutCounterPage"
          v-if="checkoutPageReceive"
        ></hl-checkout>
        <hl-specification-tree
          ref="specificationTree"
          v-if="showGoodsList"
          @getSelectedGoodsData="getSelectedGoodsData"
          @closeDialog="showGoodsList = false"
        ></hl-specification-tree>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ExchangeGoods',
  components: {},
  data () {
    return {
      dialogWidth: '1400px',
      maximizedToggle: true,
      sc_return_amount: '',
      returnPoint: 0,
      returnMode: '',
      goodsBarCode: '',
      returnTime: this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      invoiceData: {
        consumeInvoiceDetail: [],
        memberRechargeCountDetail: [],
        user: {}
      },
      returnStatusData: this.$store.state.invoice.returnStatusData,
      viewDetails: false,
      printInvoiceStatus: false,
      // 消费详情
      consumeData: [
        {
          label: '套餐名称',
          align: 'left',
          name: 'cid_packageName',
          classes: 'ellipsis'
        },
        {
          label: '消费项目',
          align: 'left',
          name: 'cid_goo_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '条码',
          name: 'cid_goo_code'
        },
        {
          label: '数量',
          align: 'center',
          name: 'cid_consumeNumber'
        },
        {
          label: '原价',
          name: 'cid_goo_price',
          align: 'left'
        },
        {
          label: '售价',
          align: 'center',
          name: 'cid_sellingPrice'
        },
        {
          label: '折扣率',
          align: 'center',
          name: 'cid_discount_rate'
        },
        {
          label: '折扣额',
          align: 'center',
          name: 'cid_discount_amount'
        },
        {
          label: '小计',
          name: 'cid_totalPrice',
          align: 'left'
        },
        {
          label: '已退数量',
          align: 'center',
          name: 'alreadyReturnNumber'
        },
        {
          label: '操作',
          name: 'id',
          align: 'center'
        }
      ],
      dataListSelections: [],
      context: '',
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'chud_goo_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.13) + 'px',
          onCellValueChanged: function (p) {
            const itemsToUpdate = []
            const data = p.data
            data.chud_goo_name = Math.floor(Math.random() * 20000 + 20000)
            itemsToUpdate.push(data)
            const res = p.api.applyTransaction({ update: itemsToUpdate })
          }
        },
        {
          headerName: '规格',
          field: 'chud_specificationName',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '条码',
          field: 'chud_goo_code',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },

        {
          headerName: '数量',
          field: 'chud_consumeNumber',
          filter: false,
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '售价',
          field: 'chud_selling_price',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '小计',
          field: 'chud_totalPrice',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        }
      ],
      shoppingCartsList: [],
      checkoutPageReceive: false,
      showGoodsList: false,
      returnCount: 0,
      invoiceCode: '',
      invoiceId: ''
    }
  },
  created () {},
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 1) + 'px'
    }
  },
  computed: {
    totalAmount () {
      const that = this
      let amount = 0
      this.shoppingCartsList.forEach(function (item) {
        amount += that.formatAmount(item.chud_totalPrice)
      })
      const aa = amount - that.totalReturnAmount
      return this.formatAmount(aa)
    },
    totaChanglAmount () {
      let number = 0
      const that = this
      this.shoppingCartsList.forEach(function (item) {
        number += that.formatAmount(item.chud_consumeNumber)
      })
      return that.formatAmount(number)
    },
    totalReturnCount () {
      let number = 0
      const that = this
      this.invoiceData.consumeInvoiceDetail.forEach(function (item) {
        number += that.formatAmount(item.rgd_return_quantity)
      })
      return that.formatAmount(number)
    },
    totalReturnAmount () {
      let amount = 0
      const that = this
      this.invoiceData.consumeInvoiceDetail.forEach(function (item) {
        amount += that.formatAmount(item.rgd_return_quantity * item.cid_sellingPrice)
      })
      return that.formatAmount(amount)
    }
  },
  methods: {
    selectBut () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1, 2, 3])
        }, 500)
      })
    },
    returnChange (item) {
      const alreadyReturnNumber = item.cid_consumeNumber - this.formatAmount(item.alreadyReturnNumber)
      if (item.rgd_return_quantity > alreadyReturnNumber) {
        item.rgd_return_quantity = parseInt(item.cid_consumeNumber)
      }
      item.rgd_return_amount = this.formatAmount(item.cid_sellingPrice * item.rgd_return_quantity)
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        var specNewsDataBak = []
        for (let i = 0; i < data.length; i++) {
          console.log(' data[i]', data[i])
          const person = {}
          person.goods_id = data[i].goods_id
          person.chud_goo_name = data[i].goo_name
          person.chud_specificationId = data[i].id
          person.chud_specificationName = data[i].specificationName
          person.chud_goo_code = data[i].goo_code
          person.chud_goo_price = data[i].goo_price
          person.chud_selling_price = data[i].goo_price
          person.chud_consumeNumber = data[i].frequency
          person.chud_goodsOrService = data[i].goo_goodsOrService
          person.chud_memberPrice = data[i].goo_price
          person.chud_totalPrice = this.formatAmount(data[i].goo_price * data[i].frequency)
          specNewsDataBak.push(person)
        }
      }
      this.shoppingCartsList = this.shoppingCartsList.concat(specNewsDataBak)
    },

    getViewData () {
      this.viewDetails = true
    },
    getViewCodeData () {
      this.viewDetails = true
      if (this.invoiceCode) {
        const params = {
          invoiceCode: this.invoiceCode
        }
        this.$store
          .dispatch('returnGoods/getInvoice', params)
          .then((res) => {
            if (res.code == 200) {
              if (res.data) {
                this.invoiceData = res.data
                this.invoiceId = this.invoiceData.id
                this.member_id = this.invoiceData.member_id > 0 ? this.invoiceData.member_id : 0
                let returnCount = 0
                this.invoiceData.consumeInvoiceDetail.forEach((val) => {
                  returnCount += this.formatAmount(val.alreadyReturnNumber)
                })
                this.returnCount = this.formatAmount(returnCount)
              } else {
                this.invoiceData = []
              }
            } else {
              this.$q.notify({
                color: 'red',
                message: '失败',
                caption: res.message ? res.message : '操作失败',
                icon: 'ion-close-circle-outline',
                position: 'top-right',
                timeout: 500
              })
              this.invoiceCode = ''
            }
          })
          .catch((error) => {})
      }
    },
    setReturnData () {
      if (this.returnMode == 2) {
        if (this.invoiceData.member_id < 1) {
          this.$q.notify({
            message: '退货失败',
            caption: '原因：非会员不能退款到' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
      }
      const obj = {
        printInvoiceStatus: this.printInvoiceStatus,
        invoiceData: this.invoiceData,
        returnMode: this.returnMode,
        type: 'one',
        sc_return_amount: this.totalReturnAmount
      }
      this.$store
        .dispatch('returnGoods/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '退货成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.hideNowPage()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    hideNowPage () {
      this.invoiceId = ''
      this.invoiceCode = ''
      this.invoiceData = {}
      this.viewDetails = false
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^[0-9]+\.?[0-9]{0,2}/
      data.chud_consumeNumber = data.chud_consumeNumber.replace(/\s+/g, '')

      if (!regu.test(data.chud_consumeNumber)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入非负两位小数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        data.chud_consumeNumber = 1
      }
      data.chud_totalPrice = this.formatAmount(data.chud_consumeNumber * data.chud_goo_price)
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },
    rowSpan (rows, rowIndexe, field) {
      const fields = [field]
      if (this.invoiceData && this.invoiceData.consumeInvoiceDetail && this.invoiceData.consumeInvoiceDetail.length > 0) {
        const data = this.invoiceData.consumeInvoiceDetail
        const row = rows
        const rowIndex = rowIndexe
        const property = field
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
      }
      return 1
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    closeChooseGoods () {
      this.showGoodsList = false
    },
    // 处理结账成功执行
    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false
      this.$store
        .dispatch('returnGoods/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '操作成功',
              caption: '收银成功',
              icon: 'ion-checkmark-circle-outline',
              position: 'top-right',
              timeout: 500
            })
            this.$emit('paySuccessCallBack')
            this.hideNowPage()
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: res.message ? res.message : '操作失败',
              icon: 'ion-close-circle-outline',
              position: 'top-right',
              timeout: 500
            })
            this.disabled = false
          }
        })
        .catch((error) => {})
    },
    // 调用结账函数
    openCheckoutCounterPage () {
      const amountsPayable = this.formatAmount(this.totalAmount)
      this.checkoutPageReceive = true
      const return_param = {
        invoiceId: this.invoiceId,
        member_id: this.member_id,
        goodsData: this.shoppingCartsList
      }
      if (this.totalReturnCount > 0) {
        return_param.invoiceDetail = this.invoiceData.consumeInvoiceDetail
      }

      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('consume', amountsPayable, parseInt(this.member_id), return_param)
      })
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
