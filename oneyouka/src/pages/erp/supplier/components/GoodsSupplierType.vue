<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-md">
      <div class="q-gutter-x-xs row  ">
        <q-input class="col-12 col-md-2 q-mt-sm" label="分类名称" clearable outlined v-model="searchProvider" dense />
        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getGoodsSupplierTypeList" />
        <q-btn color="warning" class=" q-mt-sm" unelevated label="重置"  @click="clean" />
        <q-btn color="primary" class=" q-mt-sm" unelevated label="新增分类" v-if="authorityMeta('addType')" @click="editData(0)" />
        <q-btn
          color="red"
          class="q-mt-sm"
          unelevated
          label="批量删除"
          v-if="authorityMeta('delAllType')"
          :disable="dataListSelections.length > 0 ? false : true"
          @click="delAll"
        />
        <q-btn color="primary" class=" q-mt-sm " unelevated @click="exprotCsv" label="导出Csv文件" :disable="supplierTypeData.length == 0" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :components="components"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="supplierTypeData"
        :rowDragManaged="true"
        rowSelection="multiple"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="50"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :rowMultiSelectWithClick="true"
        @rowSelected="rowSelectedAg"
        :context="context"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
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
    <add-supplier-type ref="AddSupplierTypeData" v-if="addPoppupStatus" @refreshDataList="getGoodsSupplierTypeList()" />
  </div>
</template>
<script>
import AgSupplierTypeOperate from './AgSupplierTypeOperate'
import AddSupplierType from './AddSupplierType'
export default {
  name: 'GoodsSupplierType',
  components: { AgSupplierTypeOperate, AddSupplierType },
  data () {
    return {
      addPoppupStatus: false,
      dataListSelections: [],
      gridOptions: {},
      components: { AgSupplierTypeOperate, AddSupplierType },
      context: null,
      supplierTypeData: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.035) + 'px'
        },
        {
          headerName: '供货商分类名称',
          field: 'gst_name',
          width: this.nowpx(0.6) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgSupplierTypeOperate',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      searchProvider: '',
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
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getGoodsSupplierTypeList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    clean () {
      this.searchProvider = ''
      this.getGoodsSupplierTypeList()
    },
    editData (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.AddSupplierTypeData.init(id)
      })
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getGoodsSupplierTypeList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getGoodsSupplierTypeList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getGoodsSupplierTypeList () {
      this.addPoppupStatus = false
      this.dataListSelections = []
      const obj = {
        text: this.searchProvider,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }
      this.$store
        .dispatch('supplierType/dataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.supplierTypeData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },
    delAll () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      this.$q
        .dialog({
          title: '是否确认',
          message: `确认删除${dataListSelections.length}条供货商分类`,
          cancel: true
        })
        .onOk(() => {
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store.dispatch('supplierType/delData', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
              }
              this.getGoodsSupplierTypeList()
            })
          }
        })
        .onCancel(() => {})
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
    exprotCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-供货商分类记录'
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
      return false
    }
  }
}
</script>
