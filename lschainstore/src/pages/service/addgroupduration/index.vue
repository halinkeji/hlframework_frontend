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
          class="ag-theme-balham ag-grid-table full-height full-width add-groupduration-table hl_header_center hl_content_center"
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
          :skipHeader="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pt-sm q-pb-lg row q-px-sm q-gutter-md">
        <q-btn unelevated color="info" class="q-px-xl" @click="addGroupTimeSelectGoods" :disable="!memberId ? true : false" label="选择套餐" icon="las la-plus" />

        <div class="col q-pa-xs">
          总时长: <span class="text-h4 text-orange"> {{ totalTimeCount }}</span>
        </div>
        <div class="col q-pa-xs">
          总金额: <span class="text-orange">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span><span class="text-h4 text-orange"> {{ totalAmount }}</span>
        </div>

        <q-space />
        <q-btn unelevated color="amber-8" class="q-px-xl" @click="refreshBut()" :disable="memberId == 0" label="重置" icon="ion-refresh" />

        <q-btn unelevated color="blue-6" class="q-px-xl" label="结账" @click="openCheckoutTimeerPage()" :disable="memberId && goodsData ? false : true" icon="las la-chevron-circle-down" />
      </div>
    </div>

    <hl-select-time-group ref="selectGoodsRef" v-if="selectTimeStatus" @dataList="addShoppingCart"> </hl-select-time-group>
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout @closeCheckoutPopup="closeCheckoutPopup" @paySuccessCallBack="paySuccessCallBack" ref="openCheckoutTimeerPage" v-if="checkoutPageReceive"></hl-checkout>
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
          valueGetter: function (p) {
            return p.data.package_name
          },
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          rowSpan: this.rowSpan,
          width: '150',
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
          field: 'tgd_goods_name',
          filter: false,
          width: 200,
          valueGetter: function (p) {
            return p.data.tgd_goods_name + (p.data.tgd_spe_name ? '-' + p.data.tgd_spe_name : '')
          }
        },

        {
          headerName: '总时长(分钟)',
          field: 'tgd_time_compute_duration',
          filter: false,
          width: 80
        },
        {
          headerName: '套餐售价',
          field: 'shoppingCarId',
          filter: false,
          valueGetter: (p) => {
            return p.data.packagePrice
          },
          width: 80,
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
          headerName: '到期时间',
          filter: false,
          valueGetter: this.maturityTimeType,
          rowSpan: this.rowSpan,
          field: 'shoppingCarId',
          width: 100,
          cellClassRules: {
            'cell-span-add-groupduration': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '套餐数量',
          field: 'shoppingCarId',
          valueGetter: function (p) {
            return p.data.tpb_quantity
          },
          filter: false,
          width: 100,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          cellRendererFramework: 'AgInput'

        },

        {
          headerName: '操作',
          filter: false,
          field: 'shoppingCarId',
          cellRendererFramework: 'AgOperating',
          width: 50,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-add-groupduration': function (p) {
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
      context: null,
      localeText: this.$ag_grid_localeText,
      checkoutPageReceive: false,
      selectTimeStatus: false,
      totalAmount: 0,
      totalTimeCount: 0
    }
  },

  mounted () {
    this.context = this
  },
  created () {},
  computed: {},
  methods: {
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
      this.selectTimeStatus = false
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('addGroupDuration/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            const shoppingCart = res.data ? res.data.goodsData : []
            this.totalAmount = this.formatAmount(res.data.totalAmount)

            this.totalTimeCount = this.formatAmount(res.data.totalTimeCount)
            if (shoppingCart && shoppingCart.length > 0) {
              this.$nextTick(() => {
                const goodsData = []
                shoppingCart.forEach((item, key) => {
                  if (item.rechargeCount && item.rechargeCount.length > 0) {
                    item.rechargeCount.forEach((i, k) => {
                      goodsData.push({
                        package_name: item.package_name,
                        shoppingCarId: item.id,
                        member_id: item.member_id,
                        package_id: item.package_id,
                        tpb_quantity: item.tpb_quantity,
                        rtb_expiry_time_type: item.rechargePackage.gtg_time_type,
                        rtb_time_rule_start: item.rechargePackage.gtg_time_start,
                        rtb_time_rule_end: item.rechargePackage.gtg_time_end,
                        packagePrice: item.rechargePackage.gtg_selling_price,
                        tgd_goods_name: i.tgd_goods_name,
                        tgd_time_compute_duration: i.tgd_time_compute_duration,
                        // mrc_price: i.grc_originalPrice,
                        tgd_subtotal_price: i.tgd_subtotal_price,
                        tgd_spe_id: i.tgd_spe_id,
                        tgd_spe_name: i.tgd_spe_name
                        // mrc_limitTime: i.grc_limitTime,
                        // mrc_limitCount: i.grc_limitCount
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
      this.$refs.memberCardReading.emptyMemberCardInfo()

      this.totalAmount = 0
      this.totalTimeCount = 0
      this.goodsData = []
    },
    // 选择套餐
    addGroupTimeSelectGoods () {
      const that = this
      this.selectTimeStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          that.$refs.selectGoodsRef.info()
        }, 500)
      })
    },

    openCheckoutTimeerPage () {
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
        ...this.cashRegisterData
      }

      this.$nextTick(() => {
        this.$refs.openCheckoutTimeerPage.checkoutPageReceive('addGroupDuration', amountsPayable, parseInt(this.memberId), return_param)
      })
    },

    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false

      this.$store
        .dispatch('addGroupDuration/addinvoice', v)
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
    addShoppingCart (data, packageId) {
      this.showGoodsList = false
      const that = this
      if (packageId > 0) {
        const obj = {
          packageId,
          gtg_name: data.gtg_name,
          member_id: that.memberId,
          quantity: 1
        }
        this.$store
          .dispatch('addGroupDuration/addShoppingCart', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功添加至购物车',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.getShoppingCartData()
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
      const rtb_expiry_time_type = parseInt(p.data.rtb_expiry_time_type)
      const rtb_time_rule_start = parseInt(p.data.rtb_time_rule_start)
      const rtb_time_rule_end = parseInt(p.data.rtb_time_rule_end)

      if (rtb_expiry_time_type == 3) {
        return parseInt(rtb_time_rule_end) >= 2147457847 ? '永久有效' : this.$q_date.formatDate(rtb_time_rule_end * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
      if (parseInt(rtb_expiry_time_type) == 2) {
        if (parseInt(rtb_time_rule_end) == 1) {
          return rtb_time_rule_start + '年有效'
        }
        if (parseInt(rtb_time_rule_end) == 2) {
          return rtb_time_rule_start + '月有效'
        }
        if (parseInt(rtb_time_rule_end) == 3) {
          return rtb_time_rule_start + '月有效'
        }
        if (parseInt(rtb_time_rule_end) == 4) {
          return rtb_time_rule_start + '周有效'
        }
        if (parseInt(rtb_time_rule_end) == 5) {
          return rtb_time_rule_start + '天有效'
        }
      }
      if (parseInt(rtb_expiry_time_type) == 1) {
        return '永久有效'
      }
    },

    rowSpan (params) {
      const fields = ['rtb_package_name', 'shoppingCarId']

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
        // params.api.autoSizeAllColumns()
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

.add-groupduration-table .cell-span-add-groupduration {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
