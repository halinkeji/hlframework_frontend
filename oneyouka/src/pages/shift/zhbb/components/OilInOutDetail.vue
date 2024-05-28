<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md text-subtitle2">
      <shift-date @getPeriod="init" />
      <div class="row q-gutter-xs q-mt-xs">
        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="op_name"
            emit-value
            map-options
            :options="oilList"
            v-model="oilId"
            dense
            label="请选择油品"
          />
        </div>
        <q-btn @click="getSummaryList()" color="primary" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" unelevated label="重置" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height bg-white">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height oil-erp-open-table"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        :rowData="oilListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :suppressRowTransform="true"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
        :context="context"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import ShiftDate from '../../time.vue'
export default {
  name: 'OilInOutDetail',
  components: {
    ShiftDate
  },
  data () {
    return {
      oilGunList: [],
      oilList: [],
      startTime: '',
      endTime: '',
      oilGunId: '',
      oilId: '',
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      gridOptions: {},
      oilListData: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '单据号',
          field: 'poi_invoice_code',
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-open': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '供应商/关联公司/油站',
          field: 'poi_invoice_code',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.poi_supplier_id) > 0) {
              return p.data.erpSupplier && p.data.erpSupplier.id ? p.data.erpSupplier.es_name : ''
            }

            if (parseInt(p.data.poi_link_company_id) > 0) {
              return p.data.company && p.data.company.id ? p.data.company.es_name : ''
            }

            if (parseInt(p.data.poi_in_store_id) > 0) {
              return p.data.poi_in_store_name
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-open': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '油品',
          field: 'oid_oil_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '类型',
          field: 'poi_invoice_type_text',
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
          headerName: '单价',
          field: 'oid_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '小计',
          field: 'oid_total_price',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '备注',
          field: 'oid_note',
          width: this.nowpx(0.2) + 'px'
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
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.user && p.data.user.id ? p.data.user.username : ''
          },
          cellClassRules: {
            'cell-span-erp-open': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {},
  computed: {},
  mounted () {
    this.getBasis()
  },
  methods: {

    init (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.$nextTick(() => {
        this.getSummaryList()
      })
    },
    getBasis () {
      this.$store
        .dispatch('shift/getOilConfigData')
        .then((res) => {
          if (res.code == 200) {
            this.oilList = res.data.oil ? res.data.oil : []
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
    // 获取汇总数据
    getSummaryList () {
      const obj = {
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        oilGunId: this.oilGunId,
        oilId: this.oilId,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getOilInoutList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilListData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
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
      this.getSummaryList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getSummaryList()
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
    resetBut () {
      this.oilGunId = ''
      this.oilId = ''

      this.getSummaryList()
    },
    rowSpan (params) {
      const fields = ['poi_invoice_code']
      const data = this.oilListData
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
    // 格式化保留小数点后两位数据
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
.oil-erp-open-table .cell-span-erp-open {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
