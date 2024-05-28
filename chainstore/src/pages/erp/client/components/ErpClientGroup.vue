<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-md">
      <div class="q-gutter-x-xs row  ">
        <q-input class="col-12 col-md-2 q-mt-sm" label="分组名称" clearable outlined v-model="search" dense />
        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索"  @click="getErpClientGroupList" />
        <q-btn color="warning" class=" q-mt-sm" unelevated label="重置"  @click="clean" />
        <q-btn color="primary" class=" q-mt-sm" unelevated label="新增分组" v-if="authorityMeta('addGroup')" @click="editData(0)" />
        <q-btn
          color="red"
          class=" q-mt-sm"
          unelevated
          label="批量删除"
          v-if="authorityMeta('delAllGroup')"
          :disable="dataListSelections.length > 0 ? false : true"
          @click="delAll"
        />
        <q-btn
          color="primary"
          class=" q-mt-sm "
          unelevated
          @click="outCsv"
          label="导出Csv文件"
          v-if="authorityMeta('outCsv')"
          :disable="clientGroupData.length == 0"
        />
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
        :rowData="clientGroupData"
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
    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
    <add-client-group ref="addClientGroupData" @refreshDataList="getErpClientGroupList()" />
  </div>
</template>
<script>
import AgClientGroupOperate from './AgClientGroupOperate'
import AddClientGroup from './AddClientGroup.vue'
export default {
  name: 'ErpClientGroup',
  components: { AgClientGroupOperate, AddClientGroup },
  data () {
    return {
      dataListSelections: [],
      gridOptions: {},
      components: { AgClientGroupOperate, AddClientGroup },
      context: null,
      clientGroupData: [],
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
          headerName: '客户分组名称',
          field: 'ecg_name',
          width: this.nowpx(0.6) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgClientGroupOperate',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      search: '',
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
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.context = this
  },
  mounted () {
    this.getErpClientGroupList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    clean () {
      this.search = ''
      this.getErpClientGroupList()
    },
    editData (id) {
      this.$nextTick(() => {
        this.$refs.addClientGroupData.init(id)
      })
    },
    outCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-客户记录'
      })
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getErpClientGroupList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getErpClientGroupList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getErpClientGroupList () {
      this.dataListSelections = []
      const obj = {
        text: this.search,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }
      this.$store
        .dispatch('erpCustomerGroup/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.clientGroupData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确认批量删除客户分组',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store.dispatch('erpCustomerGroup/delData', obj).then((res) => {
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
              this.getErpClientGroupList()
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
