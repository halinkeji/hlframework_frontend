<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-xs">
      <div class="col-12 col-md-2">
        <q-input outlined dense v-model="text" label="订单编号" />
      </div>

      <q-btn unelevated color="primary" label="查询" @click="getLendBackList()" />
      <q-btn unelevated color="grey" label="重置" @click="clearButton()" />
      <!-- <q-btn unelevated color="primary" label="取回" :to="{ name: 'turnBack' }" /> -->
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height oil-erp-turn-out-table"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="oilLendBackData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :localeText="localeText"
        :context="context"
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
      ></hl-pagination>
    </div>
  </div>
</template>
<script>

export default {
  name: 'TurnIn',
  components: {

  },
  data () {
    return {
      text: '',
      localeText: this.$ag_grid_localeText,

      context: '',
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '借回单据号',
          field: 'poi_invoice_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          pinned: this.pinnedComputed('left'),
          cellClassRules: {
            'cell-span-erp-turn-out': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }, {
          headerName: '油品',
          field: 'oid_oil_name',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '调出油站',
          field: 'poi_invoice_code',
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.poi_out_store_name
          },
          cellClassRules: {
            'cell-span-erp-turn-out': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '调入油站',
          field: 'poi_invoice_code',
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.poi_in_store_name
          },
          cellClassRules: {
            'cell-span-erp-turn-out': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '密度',
          field: 'oid_density',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '吨数',
          field: 'oid_ton_count',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '升数',
          field: 'oid_liter_count',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '损耗比',
          field: 'oid_loss',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '损耗（升）',
          field: 'oid_loss_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '实际取回（升）',
          field: 'oid_operatel_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'poi_invoice_code',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '操作员',
          field: 'poi_invoice_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.user && p.data.user.id ? p.data.user.username : ''
          },
          cellClassRules: {
            'cell-span-erp-take': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],

      oilLendBackData: []
    }
  },
  created () {
    this.getLendBackList()
    this.context = this
  },
  methods: {
    getLendBackList () {
      const obj = {
        text: this.text,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('turnoil/getTurnReturnBackList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilLendBackData = res.data ? res.data.list : []

            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
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
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 295
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearButton () {
      this.text = ''
      this.getLendBackList()
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getLendBackList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getLendBackList()
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    rowSpan (params) {
      const fields = ['poi_invoice_code']
      const data = this.oilLendBackData
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
    formatAmountThree (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 1000) / 1000
      }
    }
  }
}
</script>
<style>
.oil-erp-turn-out-table .cell-span-erp-turn-out {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
