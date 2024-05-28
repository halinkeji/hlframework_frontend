<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
        <div class="col-12 col-md-3  q-pt-sm" v-if="is_main_store">
          <q-select
            label="查询门店"
            clearable
            v-model="selectStoreData"
            use-chips
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
        <div class="col-12 col-md-2 q-pt-sm">
          <q-input outlined dense v-model="invoiceCode" label="请输入订单号" />
        </div>
        <div class="col-12 col-md-2 q-pt-sm">
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|姓名" />
        </div>
        <div class="col-12 col-md-2 q-pt-sm">
          <q-btn @click="getList" color="primary" unelevated label="搜索" />
          <q-btn @click="clearButton" color="grey-6 q-ml-sm" unelevated label="重置" />
        </div>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center  order-show-table"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="orderList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCharts="true"
          :enableRangeSelection="true"
          :enableCellTextSelection="true"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="false"
          :rowMultiSelectWithClick="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="45"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'partnerOrder',
  components: {},
  data () {
    return {
      invoiceCode: '',
      memberInfo: '',
      amountStatus: '',
      typeStatus: '',
      context: '',
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      orderList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '订单号',
          field: 'pmi_invoice_code',
          width: this.nowpx(0.14) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-show': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '消费会员卡号',
          field: 'pmi_invoice_code',
          valueGetter: (p) => {
            if (p.data.pmi_member_card_num) {
              return p.data.pmi_member_card_num
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-show': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '消费会员姓名',
          field: 'pmi_invoice_code',
          valueGetter: (p) => {
            if (p.data.pmi_member_name) {
              return p.data.pmi_member_name
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-show': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '消费会员手机号',
          field: 'pmi_invoice_code',
          valueGetter: (p) => {
            if (p.data.pmi_member_mobile) {
              return p.data.pmi_member_mobile
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-show': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '消费金额',
          field: 'pmi_invoice_code',
          valueGetter: (p) => {
            if (p.data.pmi_real_consume_amount) {
              return p.data.pmi_real_consume_amount
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-show': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '分红收益',
          field: 'pmi_income_amount',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '分红比率（%）',
          field: 'pmi_income_ratio',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '合伙人',
          field: 'partner.ppi_partner_name',
          valueGetter: (p) => {
            if (p.data.partner) {
              return p.data.partner.ppi_partner_name
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '合伙人电话',
          field: 'partner.ppi_member_mobile',
          valueGetter: (p) => {
            if (p.data.partner) {
              return p.data.partner.ppi_member_mobile
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '合伙人级别 ',
          field: 'partner.level',
          valueGetter: (p) => {
            if (p.data.partner) {
              const level = p.data.partner.level
              if (level) {
                return level.ppl_name
              } else {
                return ''
              }
            } else {
              return ''
            }
          },
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '合伙人类型',
          field: 'partner.ppi_partner_name',
          valueGetter: (p) => {
            if (p.data.partner) {
              const partner = p.data.partner

              if (partner.ppi_type == 'member') {
                return '会员合伙人'
              } else if (partner.ppi_type == 'staff') {
                return '员工合伙人'
              } else if (partner.ppi_type == 'partner') {
                return '股东合伙人'
              }
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.getList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      const params = {
        invoiceCode: this.invoiceCode,
        amountStatus: this.amountStatus,
        typeStatus: this.typeStatus,
        name: this.memberInfo,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('partner/getIncome', params)
        .then((res) => {
          if (res.code == 200) {
            this.orderList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.selectStoreData = []
      this.invoiceCode = ''
      this.memberInfo = ''
      this.amountStatus = ''
      this.typeStatus = ''
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    rowSpan (params) {
      const fields = ['pmi_invoice_code']
      const data = this.orderList
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
    }
  }
}
</script>
<style>
.my-green-class {
  text-align: center;
}

.order-show-table .cell-span-order-show {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
