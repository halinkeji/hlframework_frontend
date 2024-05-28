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
              单击表格增加次数列，更改次数、选择商品到期时间、选择商品限制周期
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
          总次数: <span class="text-h4 text-orange"> {{ totalCount }}</span>
        </div>
        <div class="col-6 col-md-3 q-pa-xs">
          总金额: <span class="text-orange">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span><span class="text-h4 text-orange"> {{ totalAmount }}</span>
        </div>
        <q-space />
        <q-btn unelevated color="amber-8" class="q-px-xl" @click="refreshBut()" :disable="memberId ? false : true" label="重置" icon="ion-refresh" />
        <q-btn unelevated color="blue-6" class="q-px-xl" label="结账" @click="openCheckoutCounterPage()" :disable="memberId && goodsData.length > 0 ? false : true" icon="las la-chevron-circle-down" />
      </div>

      <hl-specification-tree ref="specificationTree" @getSelectedGoodsData="getSelectedGoodsData"></hl-specification-tree>
 <hl-local-printer ref="localPrinterRef" />
      <hl-checkout @closeCheckoutPopup="closeCheckoutPopup" @paySuccessCallBack="paySuccessCallBack" ref="openCheckoutCounterPage" v-if="checkoutPageReceive"></hl-checkout>
    </div>
  </q-page>
</template>

<script>
import keyboardJS from 'keyboardJS'
import AgTotalTimes from './components/AgTotalTimes.vue'
import AgTimeSelect from './components/AgTimeSelect.vue'
import AgExpireDate from './components/AgExpireDate.vue'
import AgTimeCycle from './components/AgTimeCycle.vue'
import AgOperating from './components/AgOperating.vue'
export default {
  name: 'addCount',
  components: {
    AgTotalTimes,
    AgTimeSelect,
    AgExpireDate,
    AgTimeCycle,
    AgOperating
  },

  data () {
    return {
      gridOptions: {},

      goodsData: [],
      memberId: 0,
      columnDefs: [
        // 表格列数据
        {
          headerName: '消费项目', // 列标题
          field: 'mrc_goodsName', // 列与数据源对应的字段
          filter: false, // 是否过滤
          checkboxSelection: false, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: false, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: false, // 标题复选框开关状态
          width: this.nowpx(0.1) + 'px',
          valueGetter: function (p) {
            return p.data.mrc_goodsName + (p.data.mrc_specificationName ? '-' + p.data.mrc_specificationName : '')
          }
        },
        {
          headerName: '共充次',
          field: 'mrc_count',
          filter: false,
          editable: true,
          width: this.nowpx(0.1) + 'px',
          onCellValueChanged: this.changeTimeValue
        },
        {
          headerName: '售价/次',
          field: 'mrc_price',
          width: this.nowpx(0.07) + 'px',
          filter: false
        },
        {
          headerName: '小计',
          field: 'mrc_totalPrice',
          width: this.nowpx(0.07) + 'px',
          filter: false
        },
        {
          headerName: '到期时间类型',
          field: 'mrc_expiryTimeType',
          filter: false,
          cellRendererFramework: 'AgTimeSelect',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '到期时间',
          filter: false,
          cellRendererFramework: 'AgExpireDate',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '限制周期',
          field: 'mrc_limitTime',
          filter: false,
          cellRendererFramework: 'AgTimeCycle',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '限次',
          field: 'mrc_limitCount',
          filter: false,
          editable: (p) => {
            return p.data.mrc_limitTime != '1'
          },
          onCellValueChanged: this.limitNumberTimes,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperating',
          width: this.nowpx(0.05) + 'px'
        }
      ],
      components: {
        AgTotalTimes,
        AgTimeSelect,
        AgExpireDate,
        AgTimeCycle,
        AgOperating
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
  created () {
    keyboardJS.bind('shift + space', (e) => {
      if (this.memberId && this.goodsData.length > 0) {
        this.openCheckoutCounterPage()
      }
    })
    keyboardJS.bind('shift + s', (e) => {
      if (this.memberId) {
        this.selectGoodsBut()
      }
    })
    keyboardJS.bind('shift + d', (e) => {
      if (this.goodsData.length > 0) {
        this.clearShoppingCart()
      }
    })
    keyboardJS.bind('shift + r', (e) => {
      if (this.memberId) {
        this.refreshBut()
      }
    })
  },
  computed: {
    totalCount () {
      let count = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          count += parseInt(item.mrc_count)
        })
      }
      return count
    },
    totalAmount () {
      const that = this
      let amount = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          amount += that.formatAmount(item.mrc_totalPrice)
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

      if (p.data.mrc_count) {
        const re = /^[0-9]*[0-9][0-9]*$/

        if (re.test(p.data.mrc_count)) {
          p.data.mrc_totalPrice = p.data.mrc_price * p.data.mrc_count
        } else {
          p.data.mrc_count = 1
          p.data.mrc_totalPrice = p.data.mrc_price * p.data.mrc_count
        }
        const obj = {
          shoppingCartProductInfo: p.data
        }
        this.$store
          .dispatch('addCount/putnumber', obj)
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

    // 限制次数
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
        .dispatch('addCount/getListData', obj)
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
          goodsItem.recharge_type = 1
          goodsItem.member_id = that.memberId
          goodsItem.goods_id = item.goods_id
          goodsItem.mrc_goodsName = item.goo_name
          goodsItem.spe_id = item.id
          goodsItem.mrc_speName = item.specificationName
          goodsItem.mrc_count = 1
          goodsItem.mrc_price = item.goo_price
          goodsItem.mrc_totalPrice = item.goo_price

          goodsItem.mrc_limitTime = 1 // 设置限制使用周期为无限期
          goodsItem.mrc_limitCount = 0 // 设置无限制次数

          goodsItem.mrc_expiryTimeType = 1 // 设置到期时间为永久有效
          goodsItem.mrc_timeRuleOne = '1' // 设置开始规则为空

          goodsItem.mrc_timeRuleTwo = '1' // 设置结束规则为空

          goodsData.push(goodsItem)
        })

        if (goodsData.length > 0) {
          const obj = {
            mId: this.memberId,
            goodsData: goodsData
          }

          this.$store
            .dispatch('addCount/addShoppingCart', obj)
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
          this.$refs.specificationTree.getInquireType([1, 2])
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
        .dispatch('addCount/delList', obj)
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
        .dispatch('addCount/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '增加计次成功',
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
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('addCount', amountsPayable, parseInt(this.memberId), return_param)
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
