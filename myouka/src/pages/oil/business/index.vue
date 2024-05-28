<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-pa-sm q-gutter-sm">
        <div class="col-md-2 col-12 q-pt-none">
          <q-input outlined bottom-slots v-model="search" dense class="q-py-none" label="请输入供油商名称"> </q-input>
        </div>
        <q-btn unelevated color="primary" @click="getList()" label="搜索" class="q-px-lg" />
        <q-btn unelevated color="amber" label="重置"  class="q-px-lg" @click="clearnBut()" />
        <q-btn unelevated color="primary" label="新增" v-if="authorityMeta('add')" class="q-px-lg" @click="addSupplier(0)" />
        <q-btn
          unelevated
          color="red"
          label="批量删除"
          v-if="authorityMeta('delAll')"
          :disabled="dataListSelections.length > 0 ? false : true"
          @click="delAll()"
          class="q-px-md"
        />
        <q-btn unelevated color="green" label="供应商分类" v-if="authorityMeta('type')" class="q-px-sm" @click="supplierType = true" />
      </div>
          <!-- 供应商分类 -->
    <q-dialog v-model="supplierType" persistent>
      <q-card
        :style="{
          width: $q.screen.width * 0.4 + 'px',
          'min-width': $q.screen.width * 0.4 + 'px',
        }"
        class="q-px-md q-py-sm"
      >
        <q-toolbar class="q-px-none">
          <q-toolbar-title class="text-subtitle1">供油商分类列表</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup size="12px" />
        </q-toolbar>
        <supplier-type />
      </q-card>
    </q-dialog>

    <!-- 添加供应商 -->
    <add-supplier v-if="isDialogStatus" @getMethods="getList()" ref="addSupplierRef" />

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :defaultColDef="defaultColDef"
          @first-data-rendered="adaptiveTable"
          :rowData="oilSupplierList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          rowHeight="40"
          @rowSelected="rowSelectedAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :suppressRowTransform="true"
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
          :page-size="page.pSize"
          :total="page.totalCount"
        ></hl-pagination>
      </div>
    </div>

  </q-page>
</template>

<script>
import AgUse from './components/AgUse'
import AddSupplier from './components/AddSupplier.vue'
import SupplierType from './components/SupplierType.vue'
export default {
  name: 'oilGun',
  components: { AgUse, AddSupplier, SupplierType },
  data () {
    return {
      supplierType: false,
      search: '',
      isDialogStatus: false,
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        // 表格列数据
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true,
          width: this.nowpx(0.02) + 'px'
        },
        {
          headerName: '供应商名称', // 列标题
          field: 'es_name', // 列与数据源对应的字段
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '供应商编号',
          field: 'es_code',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '供应商类型',
          field: '',
          filter: false,
          valueGetter: (p) => {
            if (p.data.es_property == 1) {
              return '供油商'
            }
            if (p.data.es_property == 2) {
              return '关联公司'
            }
          },
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '供应商分类',
          field: 'oilSupplierType.est_name',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '供应商备注',
          field: 'es_remarks',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgUse',
          width: this.nowpx(0.12) + 'px'
        }
      ],
      gridOptions: {},
      oilSupplierList: [],
      dataListSelections: [],
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  created () {
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {
    getList () {
      this.dataListSelections = []
      this.isDialogStatus = false
      const obj = {
        search: this.search,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('osupplier/getData', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.oilSupplierList = res.data ? res.data.list : []
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
    addSupplier (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addSupplierRef.init(id)
      })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个供应商信息吗`,
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
        this.$store.dispatch('osupplier/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 个供应商信息'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
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
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    clearnBut () {
      this.search = ''
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
