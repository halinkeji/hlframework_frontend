<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pa-sm q-pb-md">
        <div class="q-gutter-xs row">
          <div class="col">
            <q-select
              clearable
              outlined
              option-value="id"
              option-label="ed_name"
              emit-value
              map-options
              v-model="depot_id"
              :options="depotData"
              dense
              label="仓库"
            />
          </div>

          <div class="col">
            <q-input outlined clearable v-model="searchNumber" label="请输入盘点单据号" dense />
          </div>

          <div class="col">
            <q-input outlined clearable v-model="goodsText" label="商品名称/条码" dense />
          </div>

          <div class="col-12 col-md-2">
            <q-input outlined v-model="startTime" label="开始时间" dense readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
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
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
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
          <div class="col-12 col-md-2">
            <q-input outlined v-model="endTime" label="结束时间" dense readonly>
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
          <q-btn color="primary" unelevated label="搜索" @click="getList" />
          <q-btn color="warning" unelevated label="重置" @click="clean" />

          <q-btn color="primary" unelevated label="库存盘点" v-if="authorityMeta('check')" :to="{ name: 'addErpChange' }" />
          <q-btn color="primary" unelevated @click="exportCsv" v-if="authorityMeta('exportCsv')" label="导出Csv文件" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-change-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="pdData"
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
  </q-page>
</template>
<script>
export default {
  name: 'index',
  components: {},
  data () {
    return {
      components: {},
      gridOptions: {},
      columnDefs: [
        {
          headerName: '盘点单据号',
          field: 'gii_inventoryInCode',
          rowSpan: this.rowSpan,
          width: this.nowpx(0.15) + 'px',
          cellClassRules: {
            'cell-span-erp-change': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '盘点时间',
          field: 'gii_inventoryInCode',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-change': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '条码', // 列标题
          field: 'gic_goods_code', // 列与数据源对应的字段

          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '名称', // 列标题
          field: 'gic_name', // 列与数据源对应的字段

          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '规格',
          field: 'gic_speName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '仓库名称',
          field: 'depot.ed_name'
          //  width: this.nowpx(0.05) + "px"
        },
        {
          headerName: '库存',
          field: 'gic_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '盘点前库存',
          field: 'gic_oldNumber',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '盘点数量',
          field: 'gic_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '相差数量',
          valueGetter: (p) => {
            return Math.abs(p.data.gic_number - p.data.gic_oldNumber)
          },
          width: this.nowpx(0.1) + 'px'
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
            } else if (p.data.gic_inventoryChangeType == 6) {
              return '正常'
            }
          },
          width: this.nowpx(0.1) + 'px'
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
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '原因',
          field: 'gic_reason',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      pdData: [],
      searchNumber: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },

      localeText: this.$ag_grid_localeText,
      startTime: '',
      endTime: '',
      goodsText: '',
      depotData: [],
      depot_id: ''
    }
  },
  mounted () {
    this.getList()
  },
  created () {
    this.getDepotList()
  },
  computed: {},
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
        text: this.searchNumber,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        startTime,
        endTime,
        goodsText: this.goodsText,
        depot_id: this.depot_id
      }
      this.$store
        .dispatch('erpchange/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.pdData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-盘点记录'
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
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
        // params.api.sizeColumnsToFit()
      }
    },
    clean () {
      this.searchNumber = ''
      this.startTime = ''
      this.endTime = ''
      this.goodsText = ''
      this.getList()
    },
    rowSpan (params) {
      const fields = ['gii_inventoryInCode']
      const data = this.pdData
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
.erp-change-table .cell-span-erp-change {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
