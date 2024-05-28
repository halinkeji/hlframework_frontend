<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-card flat class="q-mb-md">
        <div class="row q-col-gutter-xs items-center">

          <div class="col-12 col-md-4">
            <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            clearable
            map-options
            :options="consumeTypeData"
            multiple
            v-model="searchFrom.sc_consumeType"
            dense
            label="请选择消费方式"
          />
          </div>
          <div class="col-12 col-md-2">
            <q-select
            outlined
            option-value="value"
            option-label="text"
            emit-value
            map-options
            :options="type"
            v-model="searchFrom.consumePayType"
            dense
            clearable
            label="选择支付方式"
          />
          </div>
          <div class="col-12 col-md-2">
            <q-select
            outlined
            option-value="value"
            option-label="text"
            emit-value
            map-options
            clearable
            :options="payStatusData"
            v-model="searchFrom.payStatus"
            dense
            label="选择支付状态"
          />
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined dense label="开始时间" v-model="startTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined dense label="结束时间" v-model="endTime" readonly>

              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4" v-if="is_main_store">
            <q-select label="查询门店" use-chips v-model="selectStoreData" option-value="id" option-label="name" multiple emit-value map-options dense outlined :options="libInStoreList" />
          </div>

          <div class="col-12 col-md-2">
            <q-input label="请输入单据号" clearable outlined v-model="searchFrom.searchSerm" dense />
          </div>
          <div class="col-12 col-md-2" v-if="!memberId">
            <q-input label="请输入会员卡号|电话号|姓名" clearable outlined v-model="searchFrom.memberText" dense />
          </div>

          <q-btn @click="getDatalist()" color="primary" class="q-px-md q-mx-xs" unelevated label="搜索" />
          <q-btn @click="resetBut()" color="warning" class="q-px-md q-mx-xs" unelevated label="重置" />

          <q-btn @click="exportBut()" v-if="searchFrom.member_id == 0" color="red" class="q-px-md q-mx-xs" unelevated label="导出" />
        </div>
      </q-card>
    </div>

    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height "
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="invoiceListData"
        rowSelection="single"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="false"
        :localeText="localeText"
        :context="context"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="40"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>

    <return-all-goods ref="returnAllGoods" v-if="returnAllGoodsStatus" @getMethods="getList"></return-all-goods>
    <revoke-order ref="revokeOrderRef" v-if="revokeOrderStatus" @getMethods="getList"></revoke-order>
  </div>
</template>
<script>
import AgInvoiceOperating from './AgInvoiceOperating.vue'
import ReturnAllGoods from 'src/pages/set/returngoods/ReturnAllGoods.vue'
import RevokeOrder from 'src/pages/set/returngoods/RevokeOrder.vue'
export default {
  name: 'ConsumerInvoice',
  components: {
    AgInvoiceOperating,
    ReturnAllGoods,
    RevokeOrder
  },
  props: ['memberId'],
  data () {
    return {
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      returnAllGoodsStatus: false,
      revokeOrderStatus: false,
      context: null,
      invoiceListData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'sc_invoiceCode',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '消费方式',
          field: 'sc_consumeTypeName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '会员姓名',
          field: 'sc_memberName',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'sc_memberCardNum',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '应付总金额',
          field: 'sc_handleMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_handleMoneyCount > 0 ? p.data.sc_handleMoneyCount : 0
          }
        },
        {
          headerName: '实收金额',
          field: 'sc_realMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_realMoneyCount > 0 ? p.data.sc_realMoneyCount : 0
          }
        },

        {
          headerName: '支付状态',
          field: 'sc_pay_status_label',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '商家优惠',
          field: 'sc_rulePaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_rulePaymentCount > 0 ? p.data.sc_rulePaymentCount : 0
          }
        },
        {
          headerName: '抹零金额',
          field: 'sc_rounding_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_rounding_amount > 0 ? p.data.sc_rounding_amount : 0
          }
        },
        {
          headerName: '卡券优惠',
          field: 'sc_couponPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_couponPaymentCount > 0 ? p.data.sc_couponPaymentCount : 0
          }
        },

        {
          headerName: '支付方式',
          field: 'sc_consumePayType',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if ([0, 1, 2].indexOf(parseInt(p.data.sc_pay_status))) {
              return p.data.sc_consumePayType
            } else if ([3, 4].indexOf(parseInt(p.data.sc_pay_status))) {
              return p.data.sc_refund_type_label
            }
          }
        },
        {
          headerName: '备注',
          field: 'sc_note',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          valueGetter: this.createdAt,
          pinned: 'right',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          pinned: 'right',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          field: 'goo_price',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgInvoiceOperating',
          width: this.nowpx(0.07) + 'px'
        }
      ],
      components: {
        AgInvoiceOperating
      },
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      payStatusData: this.$store.state.invoice.payStatusData,
      startTime: '',
      endTime: '',
      couponsType: '',
      searchFrom: {
        sc_consumeType: [],
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: ''
      },
      paymentChannel: [],
      consumeTypeData: this.$store.state.invoice.consumeTypeData,
      libInStoreList: [],
      selectStoreData: []
    }
  },
  created () {
    this.getDatalist()
    this.context = this
    if (this.$q.localStorage.getItem('cychainstore_store_local') && this.$q.localStorage.getItem('cychainstore_store_local').openPayment) {
      this.paymentChannel = this.$q.localStorage.getItem('cychainstore_store_local').openPayment
      this.setColumnData()
    }
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    setColumnData () {
      const that = this
      if (that.paymentChannel && that.paymentChannel.length > 0) {
        that.paymentChannel.forEach(function (item, key) {
          that.columnDefs.splice(11, 0, {
            headerName: item.name,
            field: item.field,
            filter: false,
            width: that.nowpx(0.1) + 'px',
            valueGetter: (p) => {
              if (!p.data.show_status) {
                if (item.channel == 'local') {
                  return that.formatAmount(p.data[item.field])
                } else if (item.channel == 'extend') {
                  const extend_pay = p.data.extend_pay ? JSON.parse(p.data.extend_pay) : []
                  const currentIndex = _.findIndex(extend_pay, function (o) { return o.key == item.key })

                  if (currentIndex > -1) {
                    return extend_pay[currentIndex].value
                  }
                  return 0
                } else if (item.channel == 'hlpay') {
                  const hl_pay = p.data.hl_pay ? JSON.parse(p.data.hl_pay) : []
                  const currentIndex = _.findIndex(hl_pay, function (o) { return o.key == item.key })

                  if (currentIndex > -1) {
                    return hl_pay[currentIndex].value
                  }
                  return 0
                }
              } else {
                return p.data[item.field]
              }
            }
          }
          )
        })
      }
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getDatalist () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime
      const obj = {
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        member_id: this.memberId,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('invoice/getInvoiceList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.invoiceListData = res.data.list
              this.page.totalCount = res.data.page.totalCount
            } else {
              this.invoiceListData = []
              this.page.totalCount = 0
            }
            if (this.invoiceListData.length > 0) {
              setTimeout(() => {
                this.setTopTabel(res.data.list)
              }, 200)
            }
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getDatalist()
    },

    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },

    setTopTabel (list) {
      const that = this

      const oneColumn = {
        sc_memberName: '数据合计',
        show_status: true,
        sc_getPoint: '',
        sc_handleMoneyCount: '',
        sc_rechargePaymentCount: '',
        sc_pointPaymentCount: '',
        sc_blankPaymentCount: '',
        sc_wechatPaymentCount: '',
        sc_alipayPaymentCount: '',
        sc_wechatPersonalPaymentCount: '',
        sc_alipayPersonalPaymentCount: '',
        sc_cashPaymentCount: '',
        sc_otherPaymentCount: '',
        sc_realMoneyCount: ''

      }
      if (that.paymentChannel && that.paymentChannel.length > 0) {
        that.paymentChannel.forEach(function (item, key) {
          oneColumn[item.key] = ''
        })
      }

      const newRows = this.countColumnData(list, [oneColumn])

      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      const that = this
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                if (value.hl_pay && JSON.parse(value.hl_pay) && JSON.parse(value.hl_pay).length > 0) {
                  const hlapyArr = JSON.parse(value.hl_pay)
                  hlapyArr.forEach(function (item, key) {
                    if (item.key == j) {
                      oneRowData[j] += that.formatAmount(item.value)
                    }
                  })
                } else if (value.extend_pay && JSON.parse(value.extend_pay) && JSON.parse(value.extend_pay).length > 0) {
                  const extendArr = JSON.parse(value.extend_pay)
                  extendArr.forEach(function (item, key) {
                    if (item.key == j) {
                      oneRowData[j] += that.formatAmount(item.value)
                    }
                  })
                } else {
                  oneRowData[j] = this.formatAmount(this.formatAmount(oneRowData[j]) + this.formatAmount(value[j]))
                }
              })
            } else {
              oneRowData[j] = i[j]
            }
          }

          rowData.push(oneRowData)
        })
        return rowData
      }
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    createdAt (p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
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
    // 重置
    resetBut () {
      this.searchFrom = {
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: ''
      }
      this.selectStoreData = []
      this.startTime = ''
      this.endTime = ''
      this.getDatalist()
    },
    returnBut (id) {
      this.returnAllGoodsStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnAllGoods.getViewData(id)
        }, 200)
      })
    },
    revokeOrderBut (data) {
      this.revokeOrderStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.revokeOrderRef.init(data)
        }, 200)
      })
    },
    getList () {
      this.getDatalist()
    },
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-业务消费记录'
      })
    }
  }
}
</script>
