<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="q-gutter-x-xs row col-shrink bg-white q-px-sm q-pb-md">
      <q-input class=" col-12 col-md-2 q-mt-sm" outlined v-model="searchNumber" label="名称/条码/助记码/简称" dense />

      <q-select
        class=" col-12 col-md-2 q-mt-sm"
        outlined
        v-model="goodsTypeId"
        :options="goodsTypedata"
        option-value="id"
        option-label="gt_name"
        option-disable="inactive"
        emit-value
        map-options
        dense
        label="请选择分类"
      />
      <div class="col-12 col-md-2 q-mt-sm q-mr-xs">
        <q-input outlined v-model="startTime" label="指定时间" dense square readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy  transition-show="scale" transition-hide="scale">
                <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy  transition-show="scale" transition-hide="scale">
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

      <q-btn color="primary" class=" q-mt-sm" unelevated  label="搜索" @click="getList" />
      <q-btn color="warning" @click="resetCondition" class=" q-mt-sm" unelevated  label="重置" />
      <q-btn
        <q-btn
        color="primary"
        class=" q-mt-sm  "
        unelevated
        @click="exportCsv"
        label="导出Csv文件"
        v-if="authorityMeta('out')"
        :disable="specificationNewsData.length == 0"
      />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table erp-number-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="specificationNewsData"
        rowSelection="multiple"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="40"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCharts="true"
        :enableRangeSelection="true"
        :enableCellTextSelection="true"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :rowMultiSelectWithClick="true"
        :localeText="localeText"
        :context="context"
        @rowSelected="rowSelectedAg"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center">
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
</template>
<script>
export default {
  name: 'CostPice',
  data () {
    return {
      goodsTypedata: [],
      gridOptions: {},
      startTime: this.$q_date.formatDate(new Date(), 'YYYY-MM-DD'),
      endTime: this.$q_date.formatDate(new Date(), 'YYYY-MM-DD'),
      columnDefs: [],
      specificationNewsData: [], // 默认数据源
      selected: [],
      searchNumber: '',
      goodsTypeId: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      dataListSelections: []
    }
  },

  mounted () {
    this.getGoodsType()
    this.getList()
  },
  created () {
    this.getColumpRef()
    this.context = this
  },
  computed: {},
  methods: {
    getGoodsType () {
      this.$store
        .dispatch('goodstype/getAllData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypedata = res.data
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品库存进价记录'
      })
    },
    rowSpan (params) {
      const fields = ['goo_name']
      const data = this.specificationNewsData
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
    getList () {
      let startTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')

      this.dataListSelections = []
      const obj = {
        inType: 1,
        type: this.goodsTypeId,
        name: this.searchNumber,
        startTime: startTime,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('erpnumber/getCostPice', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
            this.endTime = this.$q_date.formatDate(this.startTime, 'YYYY-MM-DD')

            this.getColumpRef()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '操作失败',
            color: 'red'
          })
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
    selfAdaption (params) {
      params.api.sizeColumnsToFit()
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    resetCondition () {
      this.searchNumber = ''
      this.goodsTypeId = ''
      this.endTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD')
      this.startTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD')
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    getColumpRef () {
      const that = this
      setTimeout(() => {
        that.columnDefs = [
          {
            headerName: '商品名称',
            field: 'goo_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.24) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = []
              const data = p.data
              data.goo_name = Math.floor(Math.random() * 20000 + 20000)
              itemsToUpdate.push(data)

              const res = p.api.applyTransaction({ update: itemsToUpdate })
            },
            rowSpan: this.rowSpan,
            cellClassRules: {
              'cell-span-erp-number': function (p) {
                if (p.value) {
                  return true
                }
              }
            }
          },
          {
            headerName: '规格名称',
            field: 'sl_title',
            filter: false,
            width: this.nowpx(0.09) + 'px',
            rowSpan: this.rowSpan,
            cellClassRules: {
              'cell-span-erp-number': function (p) {
                if (p.value) {
                  return true
                }
              }
            }
          },
          {
            headerName: '条码',
            field: 'goo_code',
            filter: false,
            valueGetter: (p) => {
              if (p.data.main_spe_id) {
                return p.data.sl_barCode
              } else {
                return p.data.goo_code
              }
            },
            width: this.nowpx(0.09) + 'px'
          },
          {
            headerName: '简称',
            field: 'goo_nick',
            filter: false,
            width: this.nowpx(0.09) + 'px'
          },
          {
            headerName: '分类',
            filter: false,
            width: this.nowpx(0.09) + 'px',
            valueGetter: (p) => {
              if (p.data.goodsType) {
                return p.data.goodsType.gt_name
              } else {
                return ''
              }
            }
          },
          {
            headerName: this.endTime + '原进价',
            field: 'goo_purchasePrice',
            filter: false,
            valueGetter: (p) => {
              if (p.data.main_spe_id) {
                return this.formatAmount(p.data.sl_warehousingPrice)
              } else {
                return this.formatAmount(p.data.goo_purchasePrice)
              }
            },
            width: this.nowpx(0.09) + 'px'
          },
          {
            headerName: this.endTime + '改动后进价',
            field: 'gn_number',
            filter: false,
            valueGetter: (p) => {
              return this.formatAmount(this.formatAmount(p.data.giid_goodsPrice) / this.formatAmount(p.data.goodsPriceNumber)) > 0
                ? this.formatAmount(this.formatAmount(p.data.giid_goodsPrice) / this.formatAmount(p.data.goodsPriceNumber))
                : p.data.main_spe_id > 0
                  ? this.formatAmount(p.data.sl_warehousingPrice)
                  : this.formatAmount(p.data.goo_purchasePrice)
            },
            width: this.nowpx(0.09) + 'px'
          }
        ]
      }, 50)
    },

    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style>
.erp-number-table .cell-span-erp-number {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
