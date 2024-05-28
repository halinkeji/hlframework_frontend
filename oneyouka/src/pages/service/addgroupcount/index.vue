<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <hl-card-reading ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2 q-mb-md">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table full-height add-groupcount-table hl_header_center hl_content_center"
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
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>

      <div class="col-shrink bg-white q-pt-sm q-pb-lg row q-px-sm q-gutter-md">
        <q-btn unelevated color="info" class="q-px-xl " @click="addGroupCountSelectGoods" :disable="!memberId ? true : false" label="选择套餐" icon="las la-plus" />

        <div class="col q-pa-xs">
          次数:<span class="text-h4 text-orange">{{ totalCount }}</span>
        </div>
        <div class="col q-pa-xs">
          总金额:<span class="text-orange">{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneySymbol }}</span><span class="text-h4 text-orange">{{ totalAmount }}</span>
        </div>
        <q-btn unelevated color="amber-8" class="q-px-xl" @click="refreshBut()" :disable="memberId == 0" label="重置" icon="ion-refresh" />

        <q-btn unelevated color="blue-6" class="q-px-xl" label="结账" @click="openCheckoutCounterPage" :disable="memberId && goodsData ? false : true" icon="las la-chevron-circle-down" />
      </div>
      <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="addShoppingCart"></hl-select-count-group>
      <hl-local-printer ref="localPrinterRef" />
      <hl-checkout @closeCheckoutPopup="closeCheckoutPopup" @paySuccessCallBack="paySuccessCallBack" ref="openCheckoutCounterPage" v-if="checkoutPageReceive"></hl-checkout>
      <select-label v-if="labelVisible" ref="labelData" @getRewardLabel="getRewardLabel"></select-label>
    </div>
  </q-page>
</template>
<script>
import AgOperating from './components/AgOperating.vue'
import AgInput from './components/AgInput.vue'

export default {
  components: {
    AgOperating,
    AgInput
  },
  data () {
    return {
      goodsData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '套餐名称',
          field: 'shoppingCarId',
          filter: false,
          checkboxSelection: false,
          valueGetter: function (p) {
            return p.data.mrc_packageName
          },
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          rowSpan: this.rowSpan,
          width: this.nowpx(0.1) + 'px',
          cellClassRules: {
            'cell-span': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '售价',
          field: 'shoppingCarId',
          filter: false,
          checkboxSelection: false,
          valueGetter: function (p) {
            return p.data.packagePrice
          },
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          rowSpan: this.rowSpan,
          width: this.nowpx(0.1) + 'px',
          cellClassRules: {
            'cell-span': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '套餐数量',
          field: 'shoppingCarId',
          filter: false,
          valueGetter: function (p) {
            return p.data.cpb_quantity
          },
          width: this.nowpx(0.08) + 'px',
          cellRendererFramework: 'AgInput',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '小计',
          field: 'shoppingCarId',
          filter: false,
          valueGetter: this.computedPackageAmount,
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '项目',
          field: 'mrc_goodsName',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          valueGetter: function (p) {
            return p.data.mrc_goodsName + (p.data.mrc_specificationName ? '-' + p.data.mrc_specificationName : '')
          }
        },
        {
          headerName: '总次数',
          field: 'mrc_count',
          filter: false,

          width: this.nowpx(0.08) + 'px'
        },

        // {
        //   headerName: '原售价',
        //   field: 'mrc_price',
        //   filter: false,
        //   width: this.nowpx(0.08) + 'px'
        // },
        // {
        //   headerName: '小计',
        //   field: 'mrc_totalPrice',
        //   filter: false,
        //   width: this.nowpx(0.08) + 'px'
        // },
        {
          headerName: '使用期限限制',
          filter: false,
          valueGetter: function (p) {
            if (parseInt(p.data.mrc_limitTime) == 1) {
              return '不限制规定时间使用次数'
            } else if (parseInt(p.data.mrc_limitTime) == 2) {
              return '使用限制为每年可使用' + p.data.mrc_limitCount + '次'
            } else if (parseInt(p.data.mrc_limitTime) == 3) {
              return '使用限制为每季度可使用' + p.data.mrc_limitCount + '次'
            } else if (parseInt(p.data.mrc_limitTime) == 4) {
              return '使用限制为每月可使用' + p.data.mrc_limitCount + '次'
            } else if (parseInt(p.data.mrc_limitTime) == 5) {
              return '使用限制为每周可使用' + p.data.mrc_limitCount + '次'
            } else {
              return '使用限制为每天可使用' + p.data.mrc_limitCount + '次'
            }
          },
          rowSpan: this.rowSpan,
          width: this.nowpx(0.1) + 'px',
          cellClassRules: {
            'cell-span-add-groupcount': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '到期时间',
          field: 'shoppingCarId',
          filter: false,
          valueGetter: this.maturityTimeType,
          rowSpan: this.rowSpan,
          width: this.nowpx(0.1) + 'px',
          cellClassRules: {
            'cell-span-add-groupcount': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '操作',
          field: 'shoppingCarId',
          filter: false,
          cellRendererFramework: 'AgOperating',
          width: this.nowpx(0.05) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-add-groupcount': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      components: {
        AgOperating,
        AgInput
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      memberId: 0,
      totalAmount: 0,
      context: null,
      localeText: this.$ag_grid_localeText,
      checkoutPageReceive: false,
      selectCountStatus: false,
      labelVisible: false,
      labelInfo: []
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
          count += parseInt(item.mrc_count) * item.cpb_quantity
        })
      }

      return count
    }
  },
  methods: {
    computedPackageAmount (p) {
      return this.formatAmount(p.data.cpb_quantity * p.data.packagePrice)
    },
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.getShoppingCartData()
        }
      }
    },
    // 获取购物车数据
    getShoppingCartData () {
      this.selectCountStatus = false
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('addGroupCount/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            const shoppingCart = res.data ? res.data.goodsData : []
            this.totalAmount = this.formatAmount(res.data.totalAmount)
            if (shoppingCart && shoppingCart.length > 0) {
              this.$nextTick(() => {
                const goodsData = []
                shoppingCart.forEach((item, key) => {
                  if (item.rechargeCount && item.rechargeCount.length > 0) {
                    item.rechargeCount.forEach((i, k) => {
                      goodsData.push({
                        mrc_packageName: item.package_name,
                        shoppingCarId: item.id,
                        member_id: item.member_id,
                        package_id: item.package_id,
                        cpb_quantity: item.cpb_quantity,
                        mrc_expiryTimeType: item.rechargePackage.grp_timeType,
                        mrc_timeRuleOne: item.rechargePackage.grp_startTime,
                        mrc_timeRuleTwo: item.rechargePackage.grp_endTime,
                        packagePrice: item.rechargePackage.grp_packagePrice,
                        mrc_goodsName: i.grc_goodsName,
                        mrc_count: i.grc_count,
                        mrc_price: i.grc_originalPrice,
                        mrc_totalPrice: i.grc_totalPrice,
                        mrc_limitTime: i.grc_limitTime,
                        mrc_limitCount: i.grc_limitCount
                      })
                    })
                  }
                })
                this.goodsData = goodsData
              })
            } else {
              this.goodsData = []
            }
          }
        })
        .catch((error) => {})
    },

    // 重置
    refreshBut () {
      this.memberId = 0
      this.totalAmount = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
      this.goodsData = []
    },
    // 选择套餐
    addGroupCountSelectGoods () {
      const that = this
      this.selectCountStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          that.$refs.selectGoodsRef.info(2)
        }, 500)
      })
    },

    openCheckoutCounterPage () {
      const amountsPayable = this.totalAmount
      this.checkoutPageReceive = true

      const rechargeBufferData = []
      this.goodsData.forEach(function (item, index) {
        if (rechargeBufferData.indexOf(item.shoppingCarId) < 0) {
          rechargeBufferData.push(item.shoppingCarId)
        }
      })

      const return_param = {
        rechargeBufferData,
        labelInfo: this.labelInfo,
        ...this.cashRegisterData
      }

      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('addGroupCount', amountsPayable, parseInt(this.memberId), return_param)
      })
    },

    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false

      this.$store
        .dispatch('addGroupCount/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结算成功',
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
          }
        })
        .catch((error) => {})
    },
    // 添加至购物车
    addShoppingCart (packageId, data) {
      this.showGoodsList = false
      const that = this
      if (packageId > 0 && data.rechargeDetail.length > 0) {
        const obj = {
          packageId: packageId,
          member_id: that.memberId,
          quantity: 1,
          grp_name: data.grp_name
        }
        this.$store
          .dispatch('addGroupCount/addShoppingCart', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功添加至购物车',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.$nextTick(() => {
                this.getShoppingCartData()
              })
            } else {
              this.$q.notify({
                message: '失败',
                caption: '操作失败',
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            }
          })
          .catch((error) => {})
      } else {
        this.$q.notify({
          message: '失败',
          caption: '操作失败,未找到套餐信息',
          icon: 'ion-close-circle-outline',
          color: 'red',
          position: 'top-right'
        })
      }
    },

    maturityTimeType (p) {
      const mrc_expiryTimeType = parseInt(p.data.mrc_expiryTimeType)
      const mrc_timeRuleOne = parseInt(p.data.mrc_timeRuleOne)
      const mrc_timeRuleTwo = parseInt(p.data.mrc_timeRuleTwo)

      if (mrc_expiryTimeType == 3) {
        return parseInt(mrc_timeRuleTwo) >= 2147457847 ? '永久有效' : this.$q_date.formatDate(mrc_timeRuleTwo * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
      if (parseInt(mrc_expiryTimeType) == 2) {
        if (parseInt(mrc_timeRuleTwo) == 1) {
          return mrc_timeRuleOne + '年有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 2) {
          return mrc_timeRuleOne + '月有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 3) {
          return mrc_timeRuleOne + '月有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 4) {
          return mrc_timeRuleOne + '周有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 5) {
          return mrc_timeRuleOne + '天有效'
        }
      }
      if (parseInt(mrc_expiryTimeType) == 1) {
        return '永久有效'
      }
    },

    rowSpan (params) {
      const fields = ['shoppingCarId']

      const data = this.goodsData
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
    closeCheckoutPopup () {
      this.checkoutPageReceive = false
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
<style>
.cell-span {
  background: white;
  border-left: 1px solid lightgrey !important;
  border-right: 1px solid lightgrey !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}

.add-groupcount-table .cell-span-add-groupcount {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
