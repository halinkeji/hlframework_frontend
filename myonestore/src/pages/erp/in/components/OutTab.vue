<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-md">
      <div class="q-gutter-sm row">
        <div class="col">
          <q-input clearable outlined v-model="search" label="入库/退货单据号/商品名称/条码" dense />
        </div>

        <div class="col">
          <q-select
          clearable
          outlined
          option-value="id"
          option-label="gs_supplierName"
          emit-value
          map-options
          v-model="supplierId"
          :options="supplierList"
          dense
          label="供货商"
        />
        </div>

        <div class="col">
          <q-input outlined v-model="startTime" label="开始时间" dense  readonly>
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
              <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
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
        <div class="col">
          <q-input outlined v-model="endTime" label="结束时间" dense  readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
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
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
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
        <q-btn color="primary" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" unelevated label="重置" @click="clean" />
        <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="returnGoodsListData.length == 0" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-out-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="returnGoodsListData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :gridOptions="gridOptions"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :context="context"
        :localeText="localeText"
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
import Settle from './Settle'
export default {
  name: 'OutTab',
  components: {
    Settle
  },
  data () {
    return {
      search: '',
      localeText: this.$ag_grid_localeText,
      supplierId: '',
      supplierList: [],
      gridOptions: {},
      startTime: '',
      endTime: '',
      columnDefs: [
        // 表格列数据
        {
          headerName: '退货单据号',
          field: 'gii_inventoryInCode',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-out': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '入库单据号',
          field: 'gii_inventoryErpInCode',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-out': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '供货商',
          field: 'gii_inventoryInCode',
          valueGetter: (p) => {
            return p.data.gs_supplierName
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-out': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '商品条码',
          field: 'giid_goods_code',
          filter: false
        },
        {
          headerName: '商品名称',
          field: 'giid_goodsName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '规格',
          field: 'giid_specificationName',
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '购货单价',
          field: 'giid_discountAfterAmount',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货数量',
          field: 'giid_returnNumber',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '折扣率',
          field: 'giid_goodsDiscountRate',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '折扣额',
          field: 'giid_goodsFoldAmount',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货小计',
          field: 'giid_returnAmount',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货金额',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.06) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.gii_returnAmount
          },
          cellClassRules: {
            'cell-span-erp-out': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '退货总量',
          field: 'gii_inventoryInCode',

          width: this.nowpx(0.06) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-out': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.gii_returnQuantity
          }
        },

        {
          headerName: '退货时间',
          field: 'created_at',
          pinned: this.pinnedComputed('right'),
          valueGetter: this.addDate,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-out': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '结款状态',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.06) + 'px',
          rowSpan: this.rowSpan,
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'Settle',
          cellClassRules: {
            'cell-span-erp-out': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      returnGoodsListData: [],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },

      context: null
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.context = this
    this.getSupplierList()
    this.getList()
  },
  methods: {
    getList () {
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')
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
      const obj = {
        text: this.search,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        supplierId: this.supplierId,
        startTime: startTime,
        endTime: endTime
      }
      this.$store
        .dispatch('erpin/getErpOut', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.returnGoodsListData = res.data ? res.data.list : []
            if (res.data) {
              this.setTopTabel(this.returnGoodsListData)
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-购货退货记录'
      })
    },
    rowSpan (params) {
      const fields = ['gii_inventoryInCode', 'gii_inventoryErpInCode', 'created_at', 'gii_returnAmount', 'gii_returnQuantity']
      const data = this.returnGoodsListData
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
    addDate (p) {
      return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
    },
    getSupplierList () {
      this.$store
        .dispatch('supplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.supplierList = res.data
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
    clean () {
      this.search = ''
      this.endTime = ''
      this.startTime = ''
      this.supplierId = ''
      this.getList()
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          gii_inventoryInCode: '数据合计',
          gii_returnQuantity: '',
          gii_returnAmount: '',
          giid_returnAmount: '',
          giid_returnNumber: '',
          bid: ''
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
            let bid
            if (!i[j]) {
              data.forEach((value, key) => {
                if ((j == 'gii_returnAmount' && value.bid != bid) || (j == 'gii_returnQuantity' && value.bid != bid)) {
                  oneRowData[j] += this.formatAmount(value[j])
                } else if (!(j == 'gii_returnAmount' || j == 'gii_returnQuantity')) {
                  oneRowData[j] += this.formatAmount(value[j])
                }
                bid = value.bid
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
.erp-out-table .cell-span-erp-out {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
