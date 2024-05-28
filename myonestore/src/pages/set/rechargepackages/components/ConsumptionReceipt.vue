<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-px-md">
      <q-input class="col-12 col-md-2 q-mt-sm q-mr-sm" label="单据号" outlined v-model="receiptNum" dense />
      <!-- <q-input class="col-12 col-md-2 q-mt-sm q-mr-sm" label="卡号" outlined v-model="cardNum" dense /> -->
      <q-btn @click="getDatalist()" color="primary" class="col-12 col-md-1 q-mt-sm q-mr-sm" unelevated label="搜索" />
      <q-btn @click="restButton" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />
    </div>

    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
       <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table ag-recharge-money hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="receiptData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>

export default {
  name: 'MemberRecharge',
  components: {
  },

  data () {
    return {
      receiptNum: '',
      cardNum: '',
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      receiptData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'invoice_code',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-recharge-money': function (p) {
              if (p.value) {
                return true
              }
            }
          },

          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'invoice_code',
          width: 170,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-recharge-money': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.member ? p.data.member.mem_memberName : ''
          }
        },
        {
          headerName: '会员卡号',
          field: 'invoice_code',
          width: 170,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-recharge-money': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.member ? p.data.member.mem_memberCardNum : ''
          }
        },

        {
          headerName: '总赠送金额',
          field: 'invoice_code',
          width: 150,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-recharge-money': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.rpd_give_money
          }
        },

        {
          headerName: '总赠送金额期数',
          field: 'invoice_code',
          width: 150,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-recharge-money': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.rpd_give_money_period
          }
        },
        {
          headerName: '总赠送' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'invoice_code',
          width: 150,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-recharge-money': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.rpd_give_points
          }
        },
        {
          headerName: '总赠送' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit + '期数',
          field: 'invoice_code',
          width: 150,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-recharge-money': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.rpd_give_points_period
          }
        },

        {
          headerName: '上账单据号',
          field: 'rpr_invoice_code',
          filter: false,
          width: 200
        },
        {
          headerName: '赠送金额期数',
          field: 'rpr_give_money_period',
          filter: false,
          width: 150
        },
        {
          headerName: '赠送金额',
          field: 'rpr_give_money',
          filter: false,
          width: 150
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit + '期数',
          field: 'rpr_give_points_period',
          filter: false,
          width: 150
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'rpr_give_points',
          filter: false,
          width: 150
        },

        {
          headerName: '时间',
          field: 'addTime',
          filter: false,
          valueGetter: this.createdAt
        }

      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      }
    }
  },

  mounted () {
    this.getDatalist()
  },
  created () {

  },
  computed: {},
  methods: {

    getDatalist () {
      const obj = {
        receiptNum: this.receiptNum,
        cardNum: this.cardNum,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('rechargepackages/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.receiptData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getDatalist()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },
    restButton () {
      this.receiptNum = ''
      this.cardNum = ''
      this.getDatalist()
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
      if (!p.data.addTime) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.addTime * 1000, 'YYYY-MM-DD HH:mm:ss')
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
    rowSpan (params) {
      const fields = ['invoice_code']
      const data = this.receiptData
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
.ag-recharge-money .cell-span-recharge-money {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
