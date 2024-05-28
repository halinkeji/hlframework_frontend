<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-pa-sm q-gutter-sm">
        <div class="col-md-2 col-12 q-pt-none">
          <q-input outlined bottom-slots v-model="search" dense class="q-py-none" label="请输入加油机名称"> </q-input>
        </div>

        <q-btn unelevated color="primary" @click="getList()" label="搜索" class="col-12 col-md-1 q-mt-sm" />
        <q-btn unelevated color="amber" label="重置" class="col-12 col-md-1 q-mt-sm" @click="clearnBut()" />
        <q-btn unelevated color="primary" label="新增" v-if="authorityMeta('add')" class="col-12 col-md-1 q-mt-sm" @click="addOilMachine(0)" />
        <q-btn
          :disabled="dataListSelections.length > 0 ? false : true"
          color="red"
          class="col-12 col-md-1 q-mt-sm"
          unelevated
          label="批量删除"
          v-if="authorityMeta('delAll')"
          @click="delAll()"
        />
      </div>
      <add-oil-machine v-if="isDialogStatus" @getMethods="getList()" ref="addOilMachineRef" />
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
          :rowData="oilMachineList"
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
import AgUse from './components/AgUse.vue'
import AgMode from './components/AgMode.vue'
import AddOilMachine from './components/AddOilMachine.vue'
export default {
  name: 'Machine',
  components: { AgUse, AgMode, AddOilMachine },
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
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true,
          width: this.nowpx(0.02) + 'px'
        },
        {
          headerName: '名称', // 列标题
          field: 'om_name', // 列与数据源对应的字段
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '位置',
          field: 'om_where',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '描述',
          field: 'om_description',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          filter: false,
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '操作',
          filter: false,
          width: this.nowpx(0.12) + 'px',
          cellRendererFramework: 'AgUse'
        }
      ],
      gridOptions: {},
      oilMachineList: [],
      dataListSelections: [],
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {
    this.getList()
  },
  created () {
    this.context = this
  },
  computed: {

  },
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
        .dispatch('machine/getData', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.oilMachineList = res.data ? res.data.list : []
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
    addOilMachine (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addOilMachineRef.init(id)
      })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个加油机信息吗`,
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
        this.$store.dispatch('machine/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 个加油机信息'
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

<style></style>
