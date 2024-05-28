<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <div class="row q-gutter-sm">
        <div class="col-12 col-md-3" v-if="is_main_store">
          <q-select
            label="查询店铺"
            v-model="selectStoreData"
            option-value="id"
            option-label="name"
            multiple
            emit-value
            map-options
            dense
            outlined
            :options="libInStoreList"
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
            label="选择支付方式"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            class="col-12 col-md-2"
            outlined
            option-value="value"
            option-label="text"
            emit-value
            map-options
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
                  <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
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
                  <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-3 q-mt-sm">
          <q-input label="请输入单据号" outlined v-model="searchFrom.searchSerm" dense />
        </div>
        <div class="col-12 col-md-3" v-if="!memberId">
          <q-input label="请输入会员卡号|电话号|姓名" outlined v-model="searchFrom.memberText" dense />
        </div>
        <q-btn @click="getDatalist()" color="primary" class="q-px-sm" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" class="q-px-sm" unelevated label="重置" />

        <q-btn @click="exportBut()" v-if="searchFrom.member_id == 0" color="red" class="q-px-sm" unelevated label="导出" />
      </div>
    </div>

    <div class="col-shrink q-pa-sm full-height bg-white">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
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
        @first-data-rendered="onFirstDataRendered"
        rowHeight="40"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center">
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
  </div>
</template>
<script>
import AgInvoiceOperating from './AgInvoiceOperating.vue'
export default {
  name: 'OilConsumerInvoice',
  components: {
    AgInvoiceOperating
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
      invoiceListData: [], // 默认数据源
      gridOptions: {},
      columnDefs: [
        // 表格列数据
        {
          headerName: '会员姓名', // 列标题
          field: 'sc_memberName', // 列与数据源对应的字段
          filter: false, // 是否过滤
          checkboxSelection: false, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: false, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: false, // 标题复选框开关状态
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '会员卡号',
          field: 'sc_memberCardNum',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '车牌号',
          field: 'rcid_plate_number',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          valueGetter: this.createdAt,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '消费场景',
          field: 'sc_consumeTypeName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '消费单据号',
          field: 'sc_invoiceCode',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '油品名称',
          field: 'rcid_oilName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '油枪名称',
          field: 'rcid_oilGunName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '机显金额',
          field: 'rcid_rechargeMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcid_rechargeMoneyCount > 0 ? p.data.rcid_rechargeMoneyCount : 0
          }
        },
        {
          headerName: '消费油升',
          field: 'rcid_consumeOilRise',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcid_consumeOilRise > 0 ? p.data.rcid_consumeOilRise : 0
          }
        },
        {
          headerName: '会员价/L',
          field: 'rcid_memberPrice',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcid_memberPrice > 0 ? p.data.rcid_memberPrice : 0
          }
        },
        {
          headerName: '挂牌价/L',
          field: 'rcid_labelPrice',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcid_labelPrice > 0 ? p.data.rcid_labelPrice : 0
          }
        },
        {
          headerName: '会员优惠',
          field: 'rcid_offerPrice',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcid_offerPrice > 0 ? p.data.rcid_offerPrice : 0
          }
        },
        {
          headerName: '专车优惠',
          field: 'rcid_zcrzPrice',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcid_zcrzPrice > 0 ? p.data.rcid_zcrzPrice : 0
          }
        },

        {
          headerName: '规则优惠',
          field: 'sc_rulePaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_rulePaymentCount > 0 ? p.data.sc_rulePaymentCount : 0
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
          headerName: '实收金额',
          field: 'sc_realMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_realMoneyCount > 0 ? p.data.sc_realMoneyCount : 0
          }
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
          headerName: '支付状态',
          field: 'sc_pay_status_label',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '支付方式',
          field: 'sc_consumePayType',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '储值支付',
          field: 'sc_rechargePaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_rechargePaymentCount > 0 ? p.data.sc_rechargePaymentCount : 0
          }
        },
        {
          headerName: '积分支付',
          field: 'sc_pointPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_pointPaymentCount > 0 ? p.data.sc_pointPaymentCount : 0
          }
        },
        {
          headerName: '银行卡支付',
          field: 'sc_blankPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_blankPaymentCount > 0 ? p.data.sc_blankPaymentCount : 0
          }
        },
        {
          headerName: '(刷卡)微信支付',
          field: 'sc_wechatPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_wechatPaymentCount > 0 ? p.data.sc_wechatPaymentCount : 0
          }
        },
        {
          headerName: '(刷卡)支付宝支付',
          field: 'sc_alipayPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_alipayPaymentCount > 0 ? p.data.sc_alipayPaymentCount : 0
          }
        },
        {
          headerName: '个人微信支付',
          field: 'sc_wechatPersonalPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_wechatPersonalPaymentCount > 0 ? p.data.sc_wechatPersonalPaymentCount : 0
          }
        },
        {
          headerName: '个人支付宝支付',
          field: 'sc_alipayPersonalPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_alipayPersonalPaymentCount > 0 ? p.data.sc_alipayPersonalPaymentCount : 0
          }
        },

        {
          headerName: '现金支付',
          field: 'sc_cashPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_cashPaymentCount > 0 ? p.data.sc_cashPaymentCount : 0
          }
        },

        {
          headerName: '其他支付',
          field: 'sc_otherPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_otherPaymentCount > 0 ? p.data.sc_otherPaymentCount : 0
          }
        },

        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          pinned: 'right',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '备注',
          field: 'sc_note',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '所属店铺',
          field: 'store.name',
          pinned: 'right',
          width: this.nowpx(0.08) + 'px'
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
      type: this.$store.state.invoice.consumePayType,
      consumeTypeData: this.$store.state.invoice.consumeTypeData,
      libInStoreList: [],
      selectStoreData: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },

  mounted () {},
  created () {
    this.getDatalist()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },

  methods: {
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
        .dispatch('invoice/getOilConsumeList', obj)
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
      const newRows = this.countColumnData(list, [
        {
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
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
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

    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-加油记录'
      })
    }
  }
}
</script>
