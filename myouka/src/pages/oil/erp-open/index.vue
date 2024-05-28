<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="1" label="开油" />
          <q-tab name="2" label="取油" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="tab == '1'">
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-xs row">
            <div class="col-12 col-xs-6 col-sm-2">
              <q-input outlined dense v-model="text" label="可搜索单据号" />
            </div>
            <q-btn color="primary" unelevated @click="getList()" label="搜索" />
            <q-btn color="grey" @click="clearBut()" unelevated label="重置" />
            <q-btn color="primary" unelevated :to="{ name: 'AddOpenoil' }" label="开油" v-if="authorityMeta('add')" />
          </div>

          <div class="col-shrink q-px-xs full-height bg-grey-2">
            <ag-grid-vue
              ref="agGridTable"
              class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height oil-erp-open-table"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :rowData="oilListData"
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
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '2'">
        <erp-take></erp-take>
      </div>
    </div>
    <detail-list v-if="detailDialogStatus" @getMethods="detailDialogStatus = false" ref="openOilRecordRef" />
  </q-page>
</template>
<script>
import AgButton from './components/AgButton.vue'
import AddOpenoil from './components/AddOpenoil.vue'
import ErpTake from '../erp-take/index.vue'
import StatusText from './components/StatusText'
import DetailList from './DetailList.vue'
export default {
  name: 'openoil',
  components: {
    AgButton,
    AddOpenoil,
    StatusText,
    ErpTake,
    DetailList
  },
  data () {
    return {
      tab: '1',
      localeText: this.$ag_grid_localeText,
      addPoppupStatus: false,
      text: '',
      context: '',
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'poi_invoice_code',
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          pinned: this.pinnedComputed('left'),
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
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '取回状态',
          cellRendererFramework: 'StatusText',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '开油吨数',
          field: 'oid_ton_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '剩余吨数',
          field: 'oid_last_ton_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '开油升数',
          field: 'oid_liter_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '剩余升数',
          field: 'oid_last_liter_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '剩余金额',
          field: '',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            const item = p.data

            if (parseInt(item.oid_unit) == 1) {
              return this.formatAmountThree(item.oid_last_ton_count * item.oid_price)
            } else if (parseInt(item.oid_unit) == 2) {
              return this.formatAmountThree(item.oid_last_liter_count * item.oid_price)
            } else {
              return '计算错误'
            }
          }
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
          headerName: '供应商',
          field: 'poi_invoice_code',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return p.data.erpSupplier && p.data.erpSupplier.id ? p.data.erpSupplier.es_name : ''
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
          headerName: '本次实付',
          field: 'poi_invoice_code',
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.poi_real_money
          },
          cellClassRules: {
            'cell-span-erp-open': function (p) {
              if (p.value) {
                return true
              }
            }
          }
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
        // {
        //   headerName: '操作',
        //   field: 'poi_invoice_code',
        //   pinned: this.pinnedComputed('right'),
        //   cellRendererFramework: 'AgButton',
        //   width: this.nowpx(0.15) + 'px',
        //   rowSpan: this.rowSpan,
        //   cellClassRules: {
        //     'cell-span-erp-open': function (p) {
        //       if (p.value) {
        //         return true
        //       }
        //     }
        //   }
        // }
      ],
      oilListData: [],
      erpTotal: {},
      detailDialogStatus: false
    }
  },
  created () {
    // this.getErpTotal()
    this.getList()
    this.context = this
  },
  methods: {
    openOilRecord (id) {
      this.detailDialogStatus = true
      this.$nextTick(() => {
        this.$refs.openOilRecordRef.init(id)
      })
    },
    getList () {
      this.isPoppupStatus = false
      const obj = {
        text: this.text,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }

      this.$store
        .dispatch('openoil/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilListData = res.data ? res.data.list : []
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

    clearBut () {
      this.text = ''
      this.getList()
    },
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    showPopup (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    getDataList () {
      this.addPoppupStatus = false
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    getErpTotal () {
      this.$store
        .dispatch('openoil/getOilCount')
        .then((res) => {
          if (res.code == 200) {
            this.erpTotal = res.data ? res.data.inOilCount : {}
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
    formatAmountThree (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 1000) / 1000
      }
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
    authorityMeta (key) {
      return true
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
.oil-erp-open-table .cell-span-erp-open {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
