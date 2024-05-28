<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-xs">
      <div class="col-12 col-md-2">
        <q-input outlined dense v-model="text" label="订单编号" />
      </div>

        <div class="col-12 col-md-5 q-mr-sm" v-if="is_main_store">
        <q-select
          label="借入油站查询"
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          :options="libInStoreList"
          use-chips
          clearable
        />
      </div>

      <q-btn unelevated color="primary" label="查询" @click="getLendList()" />
      <q-btn unelevated color="grey" label="重置" @click="clearBut()" />
      <q-btn unelevated color="primary" label="借出" :to="{ name: 'debtLend' }" />
      <!-- <q-btn unelevated color="warning" label="还回" :to="{ name: 'debtReturn' }" /> -->
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height oil-erp-borrow-back-table"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="oilLendData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="60"
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
import AgOperate from './AgOperate'
import DebtDetail from './DebtDetail'
import StatusText from './StatusText'

export default {
  name: 'takeoil',
  components: {
    AgOperate,
    DebtDetail,
    StatusText
  },
  data () {
    return {

      text: '',
      localeText: this.$ag_grid_localeText,
      outDetailStatus: false,
      context: '',
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '借出单据号',
          field: 'poi_invoice_code',
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          pinned: this.pinnedComputed('left'),
          cellClassRules: {
            'cell-span-erp-borrow-back': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        // {
        //   headerName: '关联公司',
        //   field: 'poi_invoice_code',
        //   width: this.nowpx(0.1) + 'px',
        //   rowSpan: this.rowSpan,
        //   valueGetter: (p) => {
        //     return p.data.company ? p.data.company.es_name : ''
        //   },
        //   cellClassRules: {
        //     'cell-span-erp-borrow-back': function (p) {
        //       if (p.value) {
        //         return true
        //       }
        //     }
        //   }
        // },

        {
          headerName: '借出油站',
          field: 'poi_invoice_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return p.data.poi_out_store_name
          },
          cellClassRules: {
            'cell-span-erp-borrow-back': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '借入油站/公司',
          field: 'poi_invoice_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            if (p.data.poi_link_company_id > 0) {
              return p.data.company ? p.data.company.es_name : ''
            } else {
              return p.data.poi_in_store_name
            }
          },
          cellClassRules: {
            'cell-span-erp-borrow-back': function (p) {
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
          headerName: '调拨吨数',
          field: 'oid_ton_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '归还方式',
          field: 'poi_invoice_code',
          width: this.nowpx(0.15) + 'px',
          // pinned: this.pinnedComputed('right'),
          // rowSpan: this.rowSpan,
          cellRendererFramework: 'DebtDetail'
          // cellClassRules: {
          //   'cell-span-erp-borrow-back': function (p) {
          //     if (p.value) {
          //       return true
          //     }
          //   }
          // }
        },

        {
          headerName: '归还状态',
          cellRendererFramework: 'StatusText',
          width: this.nowpx(0.15) + 'px'
        },
        // {
        //   headerName: '已还吨数',

        //   valueGetter: (p) => {
        //     return this.formatAmountThree(p.data.oid_ton_count - p.data.oid_debt_ton_count)
        //   },
        //   width: this.nowpx(0.1) + 'px'
        // },
        // {
        //   headerName: '未还吨数',
        //   field: 'oid_debt_ton_count',

        //   width: this.nowpx(0.1) + 'px'
        // },
        // {
        //   headerName: '剩余升数',
        //   field: 'oid_last_liter_count',
        //   width: this.nowpx(0.1) + 'px'
        // },
        // {
        //   headerName: '剩余金额',
        //   field: '',
        //   width: this.nowpx(0.15) + 'px',
        //   valueGetter: (p) => {
        //     const item = p.data
        //     if (parseInt(item.oid_unit) == 1) {
        //       return this.formatAmountThree(item.oid_last_ton_count * item.oid_price)
        //     } else if (parseInt(item.oid_unit) == 2) {
        //       return this.formatAmountThree(item.oid_last_liter_count * item.oid_price)
        //     } else {
        //       return '计算错误'
        //     }
        //   }
        // },
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
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-borrow-back': function (p) {
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
            'cell-span-erp-borrow-back': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '操作',
          field: 'poi_invoice_code',
          width: this.nowpx(0.2) + 'px',
          pinned: this.pinnedComputed('right'),
          rowSpan: this.rowSpan,
          cellRendererFramework: 'AgOperate',
          cellClassRules: {
            'cell-span-erp-borrow-back': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      oilLendData: [],
      libInStoreList: [],
      selectStoreData: []
    }
  },
  created () {
    this.getLendList()
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  mounted () {},
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getLendList () {
      const obj = {
        text: this.text,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('turnoil/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilLendData = res.data ? res.data.list : []
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
    clearBut () {
      this.text = ''
      this.selectStoreData = []
      this.getLendList()
    },
    // 显示弹窗方法
    showOutDetail (id) {
      this.outDetailStatus = true
      this.$nextTick(() => {
        this.$refs.turnDetailRef.init(id)
      })
    },
    // 隐藏弹窗方法
    getDataList () {
      this.outDetailStatus = false
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getLendList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getLendList()
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
      const data = this.oilLendData
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
.oil-erp-borrow-back-table .cell-span-erp-borrow-back {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
