<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="q-gutter-x-xs row ">
        <q-input class="col-12 col-md-2 q-mt-sm" clearable label="供货商名称" outlined v-model="searchProvider" dense />
        <div class="col-12 col-md-4 q-mt-sm" v-if="is_main_store">
          <q-select
            label="查询门店"
            v-model="selectStoreData"
            option-value="id"
            option-label="name"
            multiple
            emit-value
            map-options
            dense
            outlined
            clearable
            use-chips
            :options="libInStoreList"
          />
        </div>
        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索"  @click="getGoodsSupplierList" />
        <q-btn color="warning" class=" q-mt-sm" unelevated label="重置"  @click="clean" />
        <q-btn color="primary" class=" q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增供货商" @click="editData(0)" />
        <q-btn
          color="red"
          class=" q-mt-sm"
          unelevated
          label="批量删除"
          v-if="authorityMeta('delAll')"
          :disable="dataListSelections.length > 0 ? false : true"
          @click="delAll"
        />
        <q-btn color="primary" class=" q-mt-sm " unelevated @click="exprotCsv" label="导出Csv文件" :disable="supplierData.length == 0" />
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
        :rowData="supplierData"
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
        @first-data-rendered="onFirstDataRendered"
        @rowSelected="rowSelectedAg"
        :context="context"
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
      ></hl-pagination>
    </div>
    <add-supplier ref="AddSupplierData" v-if="addPoppupStatus" @refreshDataList="getGoodsSupplierList" />
  </div>
</template>
<script>
import AgSupplierOperate from './AgSupplierOperate'
import AddSupplier from './AddSupplier'
export default {
  name: 'GoodsSupplier',
  components: {
    AgSupplierOperate,
    AddSupplier
  },
  data () {
    return {
      addPoppupStatus: false,
      dataListSelections: [],
      gridOptions: {},
      components: {
        AgSupplierOperate,
        AddSupplier
      },
      context: null,
      supplierData: [],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.045) + 'px'
        },
        {
          headerName: '名称',
          field: 'gs_supplierName',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '编号',
          field: 'gs_supplierNumber',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '地址',
          field: 'gs_supplierAddress',
          width: this.nowpx(0.27) + 'px'
        },
        {
          headerName: '备注',
          field: 'gs_supplierNote',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgSupplierOperate',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      searchProvider: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 10
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.getGoodsSupplierList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    clean () {
      this.searchProvider = ''
      this.selectStoreData = []
      this.getGoodsSupplierList()
    },
    // 新增修改
    editData (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.AddSupplierData.init(id)
      })
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getGoodsSupplierList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getGoodsSupplierList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getGoodsSupplierList () {
      this.addPoppupStatus = false
      this.dataListSelections = []
      const obj = {
        text: this.searchProvider,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('supplier/dataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.supplierData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },
    delAll () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      this.$q
        .dialog({
          title: '是否确认',
          message: `确认${dataListSelections.length}删除供货商`,
          cancel: true
        })
        .onOk(() => {
          if (dataListSelections.length > 0) {
            const accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')

            const obj = dataListSelections.map((item) => {
              if (parseInt(item.store_id) == parseInt(accountInfo.store_id)) {
                return item.id
              } else if (this.is_main_store) {
                return item.id
              } else {
                return null
              }
            })

            this.$store.dispatch('supplier/delData', obj).then((res) => {
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
              this.getGoodsSupplierList()
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
        fileName: date + '-供货商记录'
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
