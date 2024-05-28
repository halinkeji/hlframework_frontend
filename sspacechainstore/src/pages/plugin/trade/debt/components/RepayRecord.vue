<template>
  <div>

    <hl-auto-height class="q-mt-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table full-height repay-record-table hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="repayListData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          @first-data-rendered="adaptiveTable"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
        ></ag-grid-vue>
      </template>
    </hl-auto-height>
    <div class="flex flex-center">
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
</template>
<script>
export default {
  name: 'RepayRecord',
  components: {},
  data () {
    return {
      gridOptions: {},
      viewDetailStatus: false,
      repayListData: [],
      context: '',
      columnDefs: [
        {
          headerName: '货物还款金额',
          field: 'tsd_return_debt_id',
          width: this.nowpx(0.08) + 'px',
          valueGetter: p => {
            return p.data.debt.tsd_goods_return_amount
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-repay-record': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '转账还款金额',
          field: 'tsd_return_debt_id',
          width: this.nowpx(0.08) + 'px',
          valueGetter: p => {
            return p.data.debt.tsd_return_amount
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-repay-record': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '单据号',
          field: 'tsd_invoice_code',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'tsd_member_name',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'tsd_member_card_number',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '借出' + this.$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'tsd_lend_money_count',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '还出门店',
          field: 'outStore.name',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '消费时间',
          field: 'tsd_return_debt_id',
          valueGetter: p => {
            return this.$q_date.formatDate(
              p.data.created_at * 1000,
              'YYYY-MM-DD HH:mm:ss'
            )
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '还回门店',
          field: 'tsd_return_debt_id',
          valueGetter: p => {
            return p.data.debt.outStore.name
          },
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-repay-record': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '还回时间',
          field: 'tsd_return_debt_id',
          valueGetter: p => {
            return this.$q_date.formatDate(
              p.data.debt.created_at * 1000,
              'YYYY-MM-DD HH:mm:ss'
            )
          },
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-repay-record': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },

  created () {
    this.context = this
  },
  mounted () {
    this.getRepayList()
  },
  computed: {},
  methods: {
    getRepayList () {
      const obj = {
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        type: 3
      }
      this.$store
        .dispatch('tradeDebt/getListData', obj)
        .then(res => {
          if (res.code == 200) {
            this.repayListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch(error => {
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

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getRepayList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRepayList()
    },
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    rowSpan (params) {
      const fields = ['tsd_return_debt_id']
      const data = this.repayListData
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
.cell-span {
  background: white;
  border-left: 1px solid lightgrey !important;
  border-right: 1px solid lightgrey !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
.repay-record-table .cell-span-repay-record {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
