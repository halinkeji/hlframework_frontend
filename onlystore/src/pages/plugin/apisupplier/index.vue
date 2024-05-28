<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-card flat class="q-pa-sm">
          <div class="row q-gutter-x-sm">
            <div class="col-2">
              <q-input clearable label="请输入接口名称" outlined v-model="searchQuery" dense />
            </div>

            <q-btn @click="getList()" color="primary" unelevated label="搜索" />
            <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
            <q-btn @click="addNewData(0)" color="primary" unelevated label="新增" />
            <q-btn :disable="dataListSelections.length > 0 ? false : true" @click="delAll()" color="red" unelevated label="批量删除" />
          </div>
        </q-card>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="dataList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>

    <edit-supplier v-if="isPoppupStatus" @getMethods="getList" ref="addRef"></edit-supplier>
  </q-page>
</template>
<script>
import Operator from './components/AgOperator'

import Mode from './components/AgMode'
import EditSupplier from './components/EditSupplier.vue'

export default {
  name: 'storeNewsIndex',
  components: {
    Operator,
    Mode,
    EditSupplier
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {
        Operator,
        Mode
      },
      gridOptions: {},
      dataList: [],

      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },

        {
          headerName: '接口名称',
          field: 'name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '接口类型',
          field: 'api_group',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '请求链接',
          field: 'api_url',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '请求方式',
          field: 'method',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '请求数据格式',
          field: 'request_format',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '响应数据格式',
          field: 'response_format',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '状态',
          field: 'status',
          cellRendererFramework: 'Mode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      stop: false,
      dataListSelections: []
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.isPoppupStatus = false
      const obj = {
        name: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('apisupplier/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data && res.data.page ? res.data.page.totalCount : 0
            this.dataList = res.data && res.data.list ? res.data.list : []
          }
        })
        .catch((error) => {})
    },
    addNewData (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条供应商吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('apisupplier/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条供应商'
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
      }
    },
    clearnBut () {
      this.searchQuery = ''
      this.getList()
      this.dataListSelections = {}
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
