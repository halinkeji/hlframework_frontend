<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xl">
        <hl-card-reading ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
        <div class="row q-gutter-md">
          <q-btn unelevated class="q-px-xl" color="amber-8" @click="selectGoodsBut" :disable="memberId ? false : true" label="选择商品" icon="las la-plus" />

          <q-btn class="q-px-xl" unelevated color="red" label="清除购物车" :disable="goodsData.length > 0 ? false : true" @click="clearShoppingCart()" icon="ion-trash" />

          <q-btn round flat icon="ion-help-circle" color="warning">
            <q-tooltip content-class="bg-red" :offset="[10, 10]">
              单击表格增加时数列，更改时间、选择商品到期时间
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2 q-mb-md">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="goodsData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          rowHeight="50"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :suppressCellSelection="true"
          :context="context"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pt-sm q-pb-lg row q-px-sm q-gutter-md">
        <div class="col-6 col-md-3 q-pa-xs">
          总时长: <span class="text-h4 text-orange"> {{ totalCount }}</span>
        </div>
        <div class="col-6 col-md-3 q-pa-xs">
          总金额: <span class="text-orange">{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span><span class="text-h4 text-orange"> {{ totalAmount }}</span>
        </div>
        <q-space />
        <q-btn unelevated color="amber-8" class="q-px-xl" @click="refreshBut" :disable="memberId ? false : true" label="重置" icon="ion-refresh" />

        <q-btn unelevated color="blue-6" class="q-px-xl" label="结账" @click="openCheckoutCounterPage" :disable="memberId && goodsData.length > 0 ? false : true" icon="las la-chevron-circle-down" />
      </div>
    </div>
    <div></div>

    <hl-specification-tree ref="specificationTree" @getSelectedGoodsData="getSelectedGoodsData"></hl-specification-tree>
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout @closeCheckoutPopup="closeCheckoutPopup" @paySuccessCallBack="paySuccessCallBack" ref="openCheckoutCounterPage" v-if="checkoutPageReceive"></hl-checkout>
  </q-page>
</template>

<script>
import AgTimeSelect from './components/AgTimeSelect.vue'
import AgExpireDate from './components/AgExpireDate.vue'
import AgOperating from './components/AgOperating.vue'
import AgSelectTime from './components/AgSelectTime.vue'
import AgSelect from './components/AgSelect.vue'
export default {
  name: 'addDuration',
  components: {
    AgTimeSelect,
    AgExpireDate,
    AgOperating,
    AgSelectTime,
    AgSelect
  },

  data () {
    return {
      gridOptions: {},
      goodsData: [],
      memberId: 0,
      columnDefs: [
        {
          headerName: '消费项目',
          field: 'rtb_goods_name',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.09) + 'px',
          valueGetter: function (p) {
            return p.data.rtb_goods_name + (p.data.rtb_spe_name ? '-' + p.data.rtb_spe_name : '')
          }
        },
        {
          headerName: '原售价',
          field: 'rtb_selling_price',
          width: this.nowpx(0.06) + 'px',
          filter: false
        },
        {
          headerName: '使用时长',
          field: 'rtb_duration_type',
          filter: false,
          cellRendererFramework: 'AgSelect',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '总时长(分钟)',
          field: 'rtb_duration_total',
          filter: false,
          cellRendererFramework: 'AgSelectTime',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '小计',
          field: 'rtb_subtotal_price',
          width: this.nowpx(0.07) + 'px',
          filter: false
        },
        {
          headerName: '到期时间类型',
          field: 'rtb_expiry_time_type',
          filter: false,
          cellRendererFramework: 'AgTimeSelect',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '到期时间',
          filter: false,
          cellRendererFramework: 'AgExpireDate',
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperating',
          width: this.nowpx(0.03) + 'px'
        }
      ],
      components: {
        AgTimeSelect,
        AgExpireDate,
        AgOperating,
        AgSelectTime,
        AgSelect
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },

      context: null,
      localeText: this.$ag_grid_localeText,
      cashRegisterData: {},
      checkoutPageReceive: false
    }
  },

  mounted () {
    this.context = this
  },
  created () {},
  computed: {
    totalCount () {
      let count = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          count += parseInt(item.rtb_duration_total)
        })
      }
      return count
    },
    totalAmount () {
      const that = this
      let amount = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          amount += that.formatAmount(item.rtb_subtotal_price)
        })
      }

      return that.formatAmount(amount)
    }
  },
  methods: {
    changeTimeValue (p) {
      const itemsToUpdate = []
      if (p.data.mrc_limitTime == '1') {
        p.data.mrc_limitCount = 0
      }

      if (p.data.rtb_duration_total) {
        const re = /^[0-9]*[0-9][0-9]*$/

        if (re.test(p.data.rtb_duration_total)) {
          p.data.rtb_subtotal_price = p.data.rtb_selling_price * p.data.rtb_duration_total
        } else {
          p.data.rtb_duration_total = 1
          p.data.rtb_subtotal_price = p.data.rtb_selling_price * p.data.rtb_duration_total
        }
        const obj = {
          shoppingCartProductInfo: p.data
        }
        this.$store
          .dispatch('addDuration/putnumber', obj)
          .then((res) => {
            if (res.code == 200 && res.data) {
              this.getShoppingCartList()
            } else {
              this.$q.notify({
                message: '操作失败',
                caption: '添加购物车失败,请联系管理员',
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
              setTimeout(() => {
                this.getShoppingCartList()
              }, 500)
            }
          })
          .catch((error) => {})
      }
      itemsToUpdate.push(p.data)

      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },

    // 限制时数
    limitNumberTimes (p) {
      const itemsToUpdate = []
      if (p.data.mrc_limitCount) {
        const re = /^[0-9]*[0-9][0-9]*$/
        if (!re.test(p.data.mrc_limitCount)) {
          p.data.mrc_limitCount = 1
        }
      }
      itemsToUpdate.push(p.data)

      const res = p.api.applyTransaction({ update: itemsToUpdate })
      this.changeTimeValue(p)
    },

    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.cashRegisterData.member_id = this.memberId
          this.getShoppingCartList()
        }
      }
    },

    // 获取购物车数据
    getShoppingCartList () {
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('addDuration/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data) {
      if (data) {
        const goodsData = []
        const that = this
        data.forEach(function (item) {
          const goodsItem = {}
          goodsItem.rtb_recharge_type = 1
          goodsItem.rtb_member_id = that.memberId
          goodsItem.rtb_goods_id = item.goods_id
          goodsItem.rtb_goods_name = item.goo_name
          goodsItem.rtb_spe_id = item.id
          goodsItem.rtb_spe_name = item.specificationName
          goodsItem.rtb_selling_price = item.goo_price
          goodsItem.rtb_subtotal_price = item.goo_price
          goodsItem.rtb_duration_type = 1
          goodsItem.rtb_duration_total = 1
          goodsItem.rtb_expiry_time_type = 1 // 设置到期时间为永久有效
          goodsItem.rtb_time_rule_start = '1' // 设置开始规则为空
          goodsItem.rtb_time_rule_end = '1' // 设置结束规则为空
          goodsItem.rtb_time_compute_model = '7' // 设置开始规则为空
          goodsItem.rtb_time_compute_number = '1' // 设置结束规则为空
          goodsData.push(goodsItem)
        })

        if (goodsData.length > 0) {
          const obj = {
            mId: this.memberId,
            goodsData: goodsData
          }

          this.$store
            .dispatch('addDuration/addShoppingCart', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功添加' + res.data + '条商品',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right'
                })
                this.getShoppingCartList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '操作失败',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  position: 'top-right'
                })
                this.disabled = false
              }
            })
            .catch((error) => {})
        }
      }
    },

    // 选择商品
    selectGoodsBut () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(2)
        }, 500)
      })
    },

    // 清空购物车
    clearShoppingCart () {
      const obj = {
        type: 2,
        mId: this.memberId
      }
      this.$store
        .dispatch('addDuration/delList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsData = []
            this.$q.notify({
              message: '成功',
              caption: '清空成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false
      // const obj = {
      //   goodsData: this.goodsData,
      //   ...this.cashRegisterData
      // };
      this.$store
        .dispatch('addDuration/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '增加计时成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.refreshBut()
          } else {
            this.$q.notify({
              message: '失败',
              caption: '操作失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })

            this.disabled = false
          }
        })
        .catch((error) => {})
    },

    // 重置
    refreshBut () {
      this.memberId = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
      this.goodsData = []
    },

    openCheckoutCounterPage () {
      const amountsPayable = this.totalAmount
      this.checkoutPageReceive = true
      const return_param = {
        goodsData: this.goodsData,
        ...this.cashRegisterData
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('addDuration', amountsPayable, parseInt(this.memberId), return_param)
      })
    },

    closeCheckoutPopup () {
      this.checkoutPageReceive = false
    },
    // 列表自适应
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
    computedDuration (p) {
      console.log(p.data)
      const itemsToUpdate = []

      switch (p.data.rtb_time_compute_model) {
        case '7':
          p.data.rtb_duration_total = 1 * parseInt(p.data.rtb_time_compute_number)
          break
        case '6':
          p.data.rtb_duration_total = 60 * parseInt(p.data.rtb_time_compute_number)
          break
        case '5':
          p.data.rtb_duration_total = 1440 * parseInt(p.data.rtb_time_compute_number)
          break
        case '4':
          p.data.rtb_duration_total = 10080 * parseInt(p.data.rtb_time_compute_number)
          break
        case '3':
          p.data.rtb_duration_total = 43200 * parseInt(p.data.rtb_time_compute_number)
          break
        case '2':
          p.data.rtb_duration_total = 129600 * p.data.rtb_time_compute_number
          break
        case '1':
          p.data.rtb_duration_total = 525600 * parseFloat(p.data.rtb_time_compute_number)
          break
      }

      itemsToUpdate.push(p.data)

      const res = p.api.applyTransaction({ update: itemsToUpdate })
      this.changeTimeValue(p)
      // this.numberError();
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
