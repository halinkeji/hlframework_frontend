<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs row items-center">
        <q-btn label="返回" unelevated :to="{ name: 'erpNumber' }" color="grey" />
        <q-tabs v-model="activeName" class="bg-white q-my-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
          <q-tab name="0" label="购货记录"> </q-tab>
          <q-tab name="1" label="购货退货记录"> </q-tab>
          <q-tab name="2" label="销货记录"> </q-tab>
          <q-tab name="3" label="销货退货记录"> </q-tab>
          <q-tab name="4" label="盘点记录"> </q-tab>
          <q-tab name="5" label="销售记录"> </q-tab>
          <q-tab name="6" label="顾客退货"> </q-tab>
          <q-tab name="7" label="仓库库存"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '0'">
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-py-sm">
            <q-btn color="primary"  unelevated @click="exportCsv" label="导出Csv文件" :disable="inData.length == 0" />
          </div>
          <div class="col-shrink q-px-xs full-height bg-grey-2">
            <ag-grid-vue
              ref="agGridTable"
              class="ag-theme-balham ag-grid-table erp-table-number-view hl_header_center hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :rowData="inData"
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
              :page-size="page.pSize"
              :total="page.totalCount"
              layout="total, sizes, prev, pager, next, jumper"
            ></hl-pagination>
          </div>
        </div>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '1'">
        <out-view :goods="goodsId"></out-view>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '2'">
        <sale-view :goods="goodsId"></sale-view>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '3'">
        <sale-return-view :goods="goodsId"></sale-return-view>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '4'">
        <change-view :goods="goodsId"></change-view>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '5'">
        <consum-view :goods="goodsId"></consum-view>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '6'">
        <return-goods-view :goods="goodsId"></return-goods-view>
      </div>
      <div class="col-shrink  full-height bg-grey-2" v-if="activeName == '7'">
        <depot-view :goodsId="goodsId"></depot-view>
      </div>
    </div>
  </q-page>
</template>
<script>
import ChangeView from './ChangeView.vue'
import ConsumView from './ConsumView.vue'
import OutView from './OutView.vue'
import ReturnGoodsView from './ReturnGoodsView.vue'
import SaleView from './SaleView.vue'
import SaleReturnView from './SaleReturnView.vue'
import DepotView from './DepotView.vue'
export default {
  components: {
    OutView,
    ChangeView,
    ConsumView,
    ReturnGoodsView,
    SaleView,
    SaleReturnView,
    DepotView
  },
  name: 'viewdata',
  data () {
    return {
      activeName: '0',
      gridOptions: {},
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      inData: [],
      goodsId: 0,
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        // 表格列数据

        {
          headerName: ' 单据号',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.25) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '数量',
          field: 'giid_goodsNumber',
          filter: false, // 是否过滤

          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '购货商品名称',
          field: 'giid_goodsName',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '商品规格',
          field: 'giid_specificationName',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: ' 购货日期',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: ' 操作员',
          valueGetter: (p) => {
            return p.data.user ? p.data.user.username : ''
          },
          filter: false,
          width: this.nowpx(0.15) + 'px'
        }
      ]
    }
  },
  computed: {},
  created () {
    this.goodsId = this.$route.query.id
    this.getInData()
  },
  mounted () {},
  methods: {
    getInData () {
      const obj = {
        goodsId: this.goodsId,
        type: 1,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }

      this.$store.dispatch('erpnumber/getItem', obj).then((res) => {
        if (res.code == 200) {
          this.page.totalCount = res.data ? res.data.page.totalCount : 0
          this.inData = res.data ? res.data.list : []
          this.setTopTabel(this.inData)
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getInData()
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-购货记录'
      })
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
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
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          gii_inventoryInCode: '数据合计',
          giid_goodsNumber: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },
    rowSpan (params) {
      const fields = ['gii_inventoryInCode']
      const data = this.inData
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
    // 限制保留小数
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
.erp-table-number-view .cell-span-erp-number-view {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
