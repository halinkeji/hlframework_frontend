<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-xs q-pa-sm q-gutter-sm">
      <div class="col-md-4 col-12 q-pt-none">
        <q-input outlined bottom-slots v-model="search" dense class="q-py-none" label="请输入分类名称"> </q-input>
      </div>
      <q-btn unelevated color="primary" @click="getList()" v-if="authorityMeta('typeSearch')" label="搜索" class="col-auto" />
      <q-btn unelevated color="amber" label="重置" v-if="authorityMeta('typeReset')" class="col-auto" @click="clearnBut()" />
      <q-btn unelevated color="primary" label="新增" v-if="authorityMeta('typeAdd')" class="col-auto" @click="addSupplierTypeData(0)" />
      <q-btn
        :disabled="dataListSelections.length > 0 ? false : true"
        color="red"
        class="col-auto"
        unelevated
        v-if="authorityMeta('typeDelAll')"
        label="批量删除"
        @click="delAll()"
      />
    </div>
    <add-supplier-type v-if="isDialogStatus" @getMethods="getList()" ref="addSupplierTypeRef" />
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height "
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        @first-data-rendered="adaptiveTable"
        :rowData="supplierTypeList"
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
        domLayout="autoHeight"
        :autoGroupColumnDef="false"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[ 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import AddSupplierType from './AddSupplierType.vue'
import AgTypeMake from './AgTypeMake.vue'
export default {
  name: 'SupplierType',
  components: { AddSupplierType, AgTypeMake },
  data () {
    return {
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
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: 20
        },
        {
          headerName: '名称',
          field: 'est_name',
          filter: false
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgTypeMake'
        }
      ],
      gridOptions: {
        onGridReady: function (p) {
          p.api.sizeColumnsToFit()
        }
      },
      supplierTypeList: [],
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
        .dispatch('osupplierType/getData', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.supplierTypeList = res.data ? res.data.list : []
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
    addSupplierTypeData (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addSupplierTypeRef.init(id)
      })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个供应商分类吗`,
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
        this.$store.dispatch('osupplierType/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 个供应商分类'
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

    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
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
