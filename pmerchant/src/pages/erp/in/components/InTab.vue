<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="q-gutter-xs row">
        <div class=" col">
          <q-input  clearable outlined v-model="search" label="单据号/商品名称/条码" dense />
        </div>
        <div class=" col">
          <q-select  clearable outlined option-value="id" option-label="ed_name" emit-value map-options v-model="depot_id" :options="depotData" dense label="仓库" />
        </div>

        <div class=" col">
          <q-select  clearable outlined option-value="id" option-label="gs_supplierName" emit-value map-options v-model="supplierId" :options="supplierList" dense label="供货商" />
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
                <q-popup-proxy transition-show="scale" transition-hide="scale">
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
        <q-btn color="primary"  unelevated label="搜索" @click="getList" />
        <q-btn color="warning"  unelevated label="重置"  @click="clean" />
        <q-btn color="primary"  unelevated label="购货" v-if="authorityMeta('add')" :to="{ name: 'addErpIn' }" />
        <q-btn color="primary"  unelevated @click="exportCsv" v-if="authorityMeta('out')" label="导出Csv文件"  />

      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2 " id="printMe">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="goodsInListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :components="components"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
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
import AgButton from './AgButton'
export default {
  name: 'InTab',
  components: {
    AgButton
  },
  data () {
    return {
      components: {
        AgButton: AgButton
      },
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      goodsInListData: [],
      supplierId: '',
      depot_id: '',
      supplierList: [],
      depotData: [],
      gridOptions: {},
      startTime: '',
      endTime: '',
      columnDefs: [
        // 表格列数据
        {
          headerName: '单据号',
          field: 'gii_inventoryInCode',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          },

          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '供货商',
          field: 'gii_inventoryInCode',
          valueGetter: (p) => {
            return p.data.supplier && p.data.supplier.gs_supplierName ? p.data.supplier.gs_supplierName : ''
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
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
          field: 'giid_specificationName'
          //  width: this.nowpx(0.08) + "px"
        },

        {
          headerName: '仓库名称',
          field: 'depot.ed_name'
          //  width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '购货单价',
          field: 'giid_discountAfterAmount'
          //   width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '入库数量',
          field: 'giid_goodsNumber'
          //  width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '折扣率(0~100)',
          field: 'giid_goodsDiscountRate'
          //  width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '折扣额',
          field: 'giid_goodsFoldAmount'
          //  width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '购货金额',
          field: 'giid_goodsCashAmount'
          //  width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '商品备注',
          field: 'giid_goodsNote'
          // width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '预警数量',
          field: 'giid_warning_number',
          // width: this.nowpx(0.06) + "px",
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.giid_warning_number
          }
        },
        {
          headerName: '预警时间',
          field: 'created_at',
          valueGetter: (p) => {
            if (p.data.giid_maturity_time) {
              return this.$q_date.formatDate(p.data.giid_maturity_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            } else {
              return ''
            }
          },
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
          // width: this.nowpx(0.06) + "px"
        },
        {
          headerName: '本次应付',
          field: 'gii_inventoryInCode',
          // width: this.nowpx(0.05) + "px",
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.gii_total
          },
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '本次实付',
          field: 'gii_inventoryInCode',
          // width: this.nowpx(0.05) + "px",
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.gii_primarySupplement
          },
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '订单总入库',
          field: 'gii_inventoryInCode',
          // width: this.nowpx(0.06) + "px",
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.gii_totalPurchaseNum
          }
        },

        {
          headerName: '入库时间',
          field: 'created_at',
          valueGetter: this.addDate,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
          // width: this.nowpx(0.06) + "px"
        },
        {
          headerName: '备注',
          field: 'gii_inventoryInCode',

          valueGetter: (p) => {
            return p.data.gii_note
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
          // width: this.nowpx(0.06) + "px"
        },
        {
          headerName: ' 操作',
          field: 'gii_inventoryInCode',

          cellRendererFramework: 'AgButton',
          pinned: this.pinnedComputed('right'),
          valueGetter: (p) => {
            return '退货'
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.09) + 'px'
        }
      ],
      search: ''
    }
  },
  computed: {},
  mounted () {
    this.getList()
  },
  created () {
    this.getDepotList()
    this.getSupplierList()
  },
  methods: {
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.depotData = res.data
            }
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
        endTime: endTime,
        depot_id: this.depot_id
      }

      this.$store
        .dispatch('erpin/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.goodsInListData = res.data ? res.data.list : []
            if (res.data) {
              this.setTopTabel(this.goodsInListData)
            }
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
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
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
        fileName: date + '-购货记录'
      })
    },
    rowSpan (params) {
      const fields = ['gii_inventoryInCode', 'created_at', 'gii_note', 'gii_primarySupplement', 'gii_totalPurchaseNum', 'gii_total']
      const data = this.goodsInListData
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
    updateDate (p) {
      return p.data.gii_primarySupplement
    },
    typeData (p) {
      if (p.data.gii_type == 0) {
        return '采购入库'
      }
      return '调拨入库'
    },
    clean () {
      this.search = ''
      this.endTime = ''
      this.startTime = ''
      this.supplierId = ''
      this.depot_id = ''
      this.getList()
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
          giid_goodsNumber: '',
          giid_goodsCashAmount: '',
          gii_total: '',
          gii_totalPurchaseNum: '',
          gii_primarySupplement: '',
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
                if ((j == 'gii_primarySupplement' && value.bid != bid) || (j == 'gii_totalPurchaseNum' && value.bid != bid) || (j == 'gii_total' && value.bid != bid)) {
                  oneRowData[j] += this.formatAmount(value[j])
                } else if (!(j == 'gii_primarySupplement' || j == 'gii_totalPurchaseNum' || j == 'gii_total')) {
                  oneRowData[j] += this.formatAmount(value[j])
                }
                bid = value.bid
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          oneRowData.bid = 0
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
.erp-in-table .cell-span-erp-in {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
