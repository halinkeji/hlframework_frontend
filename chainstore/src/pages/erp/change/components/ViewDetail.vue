<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-btn color="grey" class="q-mt-sm" :to="{ name: 'erpChange' }" unelevated label="返回" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-change-table hl_header_center hl_content_center full-height"
          :suppressMovableColumns="true"
          :rowData="checkDataList"
          :columnDefs="columnData"
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
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :current-page="page.pageIndex"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'changeViewDetail',
  components: {},
  data () {
    return {
      gridOptions: {},
      context: null,
      checkDataList: [],
      columnData: [
        {
          headerName: '名称', // 列标题
          field: 'gic_name', // 列与数据源对应的字段
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-change': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '规格',
          field: 'gic_speName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '库存',
          field: 'gic_number',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '盘点前库存',
          field: 'gic_oldNumber',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '盘点数量',
          field: 'gic_number',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '相差数量',
          valueGetter: (p) => {
            return Math.abs(p.data.gic_number - p.data.gic_oldNumber)
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '类型',
          field: 'gic_inventoryChangeType',
          valueGetter: (p) => {
            if (p.data.gic_inventoryChangeType == 1) {
              return '盘盈'
            } else if (p.data.gic_inventoryChangeType == 2) {
              return '盘亏'
            } else if (p.data.gic_inventoryChangeType == 3) {
              return '领用'
            } else if (p.data.gic_inventoryChangeType == 4) {
              return '报废'
            } else if (p.data.gic_inventoryChangeType == 5) {
              return '其他'
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          valueGetter: (p) => {
            if (parseInt(p.data.gic_oldNumber) > parseInt(p.data.gic_number)) {
              return '减少'
            } else if (parseInt(p.data.gic_oldNumber) < parseInt(p.data.gic_number)) {
              return '增加'
            }
            return '不变'
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '原因',
          field: 'gic_reason',
          width: this.nowpx(0.15) + 'px'
        }
      ],

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      roleOptions: [
        { title: '盘盈', id: '1' },
        { title: '盘亏', id: '2' },
        { title: '领用', id: '3' },
        { title: '报废', id: '4' },
        { title: '其他', id: '5' }
      ]
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const obj = {
        id: this.$route.query.id,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store.dispatch('erpchange/getItem', obj).then((res) => {
        if (res.data) {
          this.checkDataList = res.data.list
          this.page.totalCount = parseInt(res.data.page.totalCount)
        }
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },

    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },

    rowSpan (params) {
      const fields = ['gic_name']
      const data = this.checkDataList
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
    }
  }
}
</script>
<style>
.erp-change-table .cell-span-erp-change {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
