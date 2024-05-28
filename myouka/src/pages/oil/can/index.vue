<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-pa-sm q-gutter-sm">
        <div class="col-md-2 col-12 q-pt-none">
          <q-input outlined bottom-slots v-model="search" dense class="q-py-none" label="请输入油罐名称"> </q-input>
        </div>
        <div class="col-12 col-md-4 q-mt-sm" v-if="is_main_store">
          <q-select
            label="查询油站"
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
        <q-btn unelevated color="primary" @click="getList()" label="搜索" class="col-12 col-md-1 q-mt-sm" />
        <q-btn unelevated color="amber" label="重置" class="col-12 col-md-1 q-mt-sm" @click="clearnBut()" />
        <q-btn unelevated color="primary" label="新增" v-if="authorityMeta('add')" class="col-12 col-md-1 q-mt-sm" @click="addOilCan(0)" />
        <q-btn
          :disabled="dataListSelections.length > 0 ? false : true"
          color="red"
          class="col-12 col-md-1 q-mt-sm"
          unelevated
          v-if="authorityMeta('delAll')"
          label="批量删除"
          @click="delAll()"
        />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :defaultColDef="defaultColDef"
          @first-data-rendered="adaptiveTable"
          :rowData="oilCanList"
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

    <add-oil-can v-if="isDialogStatus" @getMethods="getList()" ref="addOilMachineRef" />
    <add-come v-if="balanceOilVisible" @getMethods="getList()" ref="addCanCount" />
    <ag-data v-if="isDialogStatus2" @getMethods="getList()" ref="addOilMachineRef2" />
    <oil-record v-if="canInOutRecordDialog" @getMethods="canInOutRecordDialog = false" ref="canOilRecordRef" />
  </q-page>
</template>

<script>
import AgUse from './components/AgUse'
import AgMode from './components/AgMode'
import AddOilCan from './components/AddOilCan.vue'
import AgData from './components/AgData.vue'
import AddCome from './components/AddCome.vue'
import OilRecord from './OilRecord.vue'
export default {
  name: 'Machine',
  components: { AgUse, AgMode, AddOilCan, AddCome, AgData, OilRecord },
  data () {
    return {
      search: '',
      isDialogStatus: false,
      balanceOilVisible: false,
      isDialogStatus2: false,
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
          width: this.nowpx(0.02) + 'px'
        },
        {
          headerName: '名称',
          field: 'oc_name',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '油品',
          field: 'oilProduct.op_name',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '库存',
          field: 'oc_stock',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '状态',
          filter: false,
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '创建油站',
          field: 'store.name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgUse',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      gridOptions: {},
      oilCanList: [],
      dataListSelections: [],
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: [],
      canInOutRecordDialog: false
    }
  },
  mounted () {
    this.getList()
  },
  created () {
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
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      this.dataListSelections = []

      this.isDialogStatus = false
      this.balanceOilVisible = false
      this.isDialogStatus2 = false
      const obj = {
        search: this.search,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('can/getData', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.oilCanList = res.data ? res.data.list : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    addOilCan (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addOilMachineRef.init(id)
      })
    },
    addCome (oilCanId, canName, oilId, oilName) {
      this.balanceOilVisible = true
      this.$nextTick(() => {
        this.$refs.addCanCount.init(oilCanId, canName, oilId, oilName)
      })
    },
    agData (id) {
      this.isDialogStatus2 = true
      this.$nextTick(() => {
        this.$refs.addOilMachineRef2.init(id)
      })
    },
    openOilRecord (id) {
      this.canInOutRecordDialog = true
      this.$nextTick(() => {
        this.$refs.canOilRecordRef.init(id)
      })
    },

    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个油罐信息吗`,
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
        this.$store.dispatch('can/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 个油罐信息'
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
      this.selectStoreData = []
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

<style></style>
