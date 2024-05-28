<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm row q-gutter-xs">
        <div class="col-2">
          <q-input outlined dense v-model="wuliuData.cew_name" label="物流名称" />
        </div>
        <div class="col-2">
          <q-input outlined dense v-model="wuliuData.cew_number" label="物流单据号" />
        </div>

        <q-btn unelevated color="primary" label="搜索" @click="getList()" />
        <q-btn unelevated color="warning" label="重置" @click="clearBut()" />
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="wuliuListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="adaptiveTable"
          @rowSelected="rowSelectedAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
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
  </q-page>
</template>
<script>
import AgShow from './components/AgShow'
export default {
  name: 'wuliuIndex',
  components: {
    AgShow
  },
  data () {
    return {
      selected: [],
      wuliuData: {
        cew_name: '',
        cew_number: ''
      },
      context: '',
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '出库单据号',
          cellRendererFramework: 'AgShow',
          field: 'orderData.cep_contract_number',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '打包单号',
          field: 'cep_code',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '物流单据号',
          field: 'cep_wuliu_order',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '物流单据号',
          field: 'cep_wuliu_order',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '物流名称',
          field: 'cep_wuliu_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '物流备注',
          field: 'cep_wuliu_note',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '制单时间',
          field: 'user.username',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm')
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '制单人',
          field: 'user.username',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '物流店铺',
          field: 'store.name',
          width: this.nowpx(0.15) + 'px'
        }
        // {
        //   headerName: '操作',
        //   width: this.nowpx(0.2) + 'px'
        // }
      ],
      wuliuListData: [],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.isPoppupStatus = false
      const obj = {
        text: this.wuliuData.cew_name,
        number: this.wuliuData.cew_number,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('erpPacking/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.wuliuListData = res.data ? res.data.list : [] // 三元运算赋值
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 262
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearBut () {
      this.wuliuData.cew_name = ''
      this.wuliuData.cew_number = ''
      this.getList()
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 分页方法
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 分页方法
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 统计选中的ag表格行数方法
    rowSelectedAg (p) {
      this.selected = p.api.getSelectedRows()
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
