<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-xs row">
          <div class="col-2">
            <q-input outlined v-model="searchNumber" label="请输入盘点单据号" dense />
          </div>
          <div class="col-2">
            <q-input outlined v-model="depot" label="请输入盘点仓库" dense />
          </div>
          <q-btn color="primary" unelevated label="申请盘点号" v-if="authorityMeta('add')" @click="addCheck(0)" />

          <q-btn color="primary" unelevated label="搜索" @click="getList" />
          <q-btn color="warning" unelevated label="重置" @click="clean" />
          <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" />
        </div>
      </div>

      <add-check ref="addRef" v-if="addPoppupStatus" @dataList="getList" />
      <show-log-data ref="showDataRef" v-if="showLogStatus" @dataList="showLogStatus = false"></show-log-data>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="pdData"
          :gridOptions="gridOptions"
          :defaultColDef="defaultColDef"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          :rowClassRules="{
            'bg-red-3 ': (params) => {
              return params.data.cep_status == 4 ? true : false;
            },
          }"
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
import AgPdOperate from './components/AgPdOperate'
import AddCheck from './components/AddCheckOrder'
import AgInput from './components/AgInput'
import ShowLogData from 'pages/erp/purchase/components/ShowLogData'
export default {
  name: 'index',
  components: { AgPdOperate, AddCheck, ShowLogData, AgInput },
  data () {
    return {
      components: { AgPdOperate },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '盘点单据号',
          field: 'cep_contract_number',
          cellRendererFramework: 'AgInput',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '盘点类型',
          field: 'cep_contract_number',
          valueGetter: (p) => {
            if (p.data.cep_check_order_range == 1) {
              return '全盘'
            }
            if (p.data.cep_check_order_range == 2) {
              return '抽盘'
            }
            if (p.data.cep_check_order_range == 3) {
              return '分类盘点'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '仓库编号',
          field: 'cep_depot_code',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '仓库名称',
          field: 'cep_depot_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '应有库存',
          field: 'cep_check_before_quantity',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '实盘库存',
          field: 'cep_check_real_quantity',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '盘点状态',
          field: 'store.name',
          valueGetter: (p) => {
            if (p.data.cep_status == 1) {
              return '保存'
            }
            if (p.data.cep_status == 2) {
              return '已确认'
            }
            if (p.data.cep_status == 3) {
              return '已审核'
            }
            if (p.data.cep_status == 4) {
              return '已关闭'
            }
            if (p.data.cep_status == 5) {
              return '已挂起'
            }
            if (p.data.cep_status == 6) {
              return '已过账'
            }
            if (p.data.cep_status == 7) {
              return '已生成盘点差异单'
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '盘点表备注',
          field: 'cep_note',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '盘点时间',
          field: 'updated_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '操作',
          cellRendererFramework: 'AgPdOperate',
          width: this.nowpx(0.18) + 'px'
        }
      ],
      pdData: [],
      searchNumber: '',
      depot: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      addPoppupStatus: false,
      showLogStatus: false,
      context: '',
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {
    this.getList()
  },
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    getList () {
      this.addPoppupStatus = false
      const obj = {
        text: this.searchNumber,
        depot: this.depot,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        type: 1
      }
      this.$store
        .dispatch('erpCheck/getData', obj)
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
        fileName: date + '-盘点主记录'
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
        params.api.sizeColumnsToFit()
      }
    },
    clean () {
      this.searchNumber = ''
      this.depot = ''
      this.getList()
    },
    addCheck (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    showLogData (val) {
      this.showLogStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.init(val, 8)
      })
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
      return true
    }
  }
}
</script>
