<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-pb-sm" v-if="checkFormData">
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input dense disable v-model="checkFormData.cep_contract_number" label="盘点表单据" />
          </div>
          <div class="col-12 col-md-1 q-pa-xs">
            <q-input disable dense v-model="checkFormData.cep_depot_name" label="盘点仓库" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs q-mt-sm">
            盘点类型：
            <span v-if="checkFormData.cep_check_order_range == 1">全盘</span>
            <span v-if="checkFormData.cep_check_order_range == 2">抽盘</span>
            <span v-if="checkFormData.cep_check_order_range == 2">分类盘点</span>
          </div>
          <div class="col-12 col-md-3 q-pa-xs">
            <q-input disable dense v-model="checkFormData.cep_note" label="订货备注" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-btn
              color="primary"
              class="q-mt-sm q-mr-xs"
              unelevated
              @click="exportCsv"
              label="导出Csv文件"
              :disable="checkBufferData.length == 0 && purchase_id < 1"
            />
            <q-btn color="grey" class="q-mt-sm q-mr-xs" :to="{ name: 'erpCheck' }" unelevated label="返回" />
            <q-btn color="info" class="q-mt-sm" unelevated @click="erpPrint" label="打印" v-if="checkBufferData.length > 0" />
          </div>
          <q-space />
          <q-btn flat color="black" icon="dialpad">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item tag="label" v-ripple v-for="(item, key) in columnDefs" :key="key" >
                  <q-item-section side top>
                    <q-checkbox v-model="sideBarColumn" @input="changeShowColumn" :val="item.headerName" />
                  </q-item-section>

                  <q-item-section v-if="item.headerName">
                    <q-item-label>{{ item.headerName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-change-table hl_header_center hl_content_center full-height"
          :suppressMovableColumns="true"
          :rowData="checkBufferData"
          :gridOptions="gridOptions"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
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
      <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
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
      erpPrintStatus: false,
      context: null,
      checkBufferData: [],
      columnDefs: [],
      sideBarColumn: [],
      checkFormData: {},
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: true,
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
      ],
      purchase_id: 0
    }
  },
  created () {
    this.context = this
  },
  mounted () {
    this.restColumnData()
  },
  computed: {},
  methods: {
    restColumnData () {
      const columnData = [
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '条码',
          field: 'epd_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'epd_archives_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '货号',
          field: 'epd_article_code',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'epd_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'epd_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '单价',
          field: 'epd_price',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '原有库存',
          field: 'epd_check_before_number',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '库存金额',
          field: 'epd_before_amount',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },

        {
          headerName: '实盘数',
          field: 'epd_check_number',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '实盘金额',
          field: 'epd_check_amount',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '差异数',
          field: 'epd_difference_number',
          comparator: (a, b) => a - b,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '差异金额',
          field: 'epd_difference_amount',
          comparator: (a, b) => a - b,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '盘点状态',
          field: 'store.name',
          valueGetter: (p) => {
            if (parseInt(p.data.epd_status) == 1) {
              return '盘盈'
            }
            if (parseInt(p.data.epd_status) == 2) {
              return '盘亏'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '原因',
          field: 'epd_note',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })

      if (this.$route.query.id) {
        this.check_order_id = this.$route.query.id
        this.getItem()
      }
    },
    changeShowColumn () {
      this.gridOptions.api.setColumnDefs([])
      this.$nextTick(() => {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        this.gridOptions.api.setColumnDefs(newAgColumnDefs)
      })
    },
    erpPrint () {
      if (this.checkBufferData.length > 0) {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        const sideBarColumns = newAgColumnDefs.map((item) => {
          return {
            type: 'text',
            name: item.field,
            value: item.headerName
          }
        })
        this.erpPrintStatus = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.invoice_id, 'check', this.checkFormData)
          }, 500)
        })
      }
    },

    getItem () {
      const obj = {
        id: this.check_order_id
      }
      this.$store
        .dispatch('erpCheck/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.checkFormData = res.data.checkFormData ? res.data.checkFormData : {}
            this.checkBufferData = res.data.checkBufferData.length > 0 ? res.data.checkBufferData : []

            if (res.data.checkBufferData && res.data.checkBufferData.length > 0) {
              this.setTopTabel(this.checkBufferData)
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

    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          epd_price: '数据合计',
          show_status: true,
          epd_check_before_number: '',
          epd_before_amount: '',
          epd_check_number: '',
          epd_check_amount: '',
          epd_difference_number: '',
          epd_difference_amount: ''
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
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
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
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    exportCsv () {
      this.gridOptions.api.exportDataAsCsv({
        fileName: this.checkFormData.cep_contract_number + '-盘点单详情'
      })
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
