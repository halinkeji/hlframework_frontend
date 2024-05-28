<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-card flat class="q-pa-sm">
          <div class=" row q-gutter-x-sm">
            <q-input clearable class="col-12 col-md-2 q-mt-sm" label="规则名称" outlined v-model="searchQuery" dense />

            <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
            <q-btn @click="clearBut" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />
            <q-btn color="primary" @click="addIntegralRule" v-if="authorityMeta('add')" class="col-12 col-md-1 q-mt-sm" unelevated label="新增" />
            <q-btn :disabled="dataListSelections.length > 0 ? false : true" @click="delAll()" v-if="authorityMeta('allDel')" color="red" class="col-12 col-md-1 q-mt-sm" unelevated label="批量删除" />
          </div>
        </q-card>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="ticketPrinterListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
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
    <add-integral-set ref="integralSetAdd" v-if="addDialogStatus" @setSuccess="getList" @closePage="addDialogStatus = false" />
    <integral-set-edit ref="integralSetEdit" v-if="editDialogStatus" @closePage="editDialogStatus = false" @setSuccess="getList" />
  </q-page>
</template>

<script>
import Operating from './components/AgOperator'
import IntegralSetEdit from './IntegralSetEdit'
import AddIntegralSet from './components/AddIntegralSet'
import Mode from './components/AgMode'
export default {
  name: 'index',
  components: {
    Operating,
    IntegralSetEdit,
    AddIntegralSet,
    Mode
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        Operating
      },
      dataListSelections: [],
      ticketPrinterListData: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 40
        },
        {
          headerName: '排序',
          field: 'ic_sort',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeSort,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '规则名称',
          field: 'ic_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '业务类型',
          field: 'ic_scenes_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员级别',
          field: 'ic_level_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '生日周期',
          field: 'ic_birthday_type',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '折扣百分比',
          field: 'ic_discount_ratio',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: this.$q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit + '换算比例',
          field: 'ic_integral_ratio',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '状态',
          field: 'sn_status',
          cellRendererFramework: 'Mode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 操作',
          field: 'id',
          cellRendererFramework: 'Operating',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      printerId: '',

      searchQuery: '',
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      addDialogStatus: false,
      editDialogStatus: false
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
      const obj = {
        printerId: this.printerId,
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('integralset/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.ticketPrinterListData = res.data ? res.data.list : []
            this.dataListSelections = []
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

    clearBut () {
      this.searchQuery = ''
      this.printerId = ''
      this.getList()
      this.dataListSelections = []
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条${this.$q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit}设置吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },

    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('integralset/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条折扣信息'
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
    changeSort (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      data.ic_sort = data.ic_sort.replace(/\s+/g, '')
      if (!data.ic_sort) {
        this.getList()
        return ''
      }
      if (!regu.test(data.ic_sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getList()
      } else {
        const obj = {
          ic_sort: data.ic_sort,
          id: data.id
        }
        this.$store.dispatch('integralset/setData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改排序成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getList()
          }
        })
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
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
    },
    editIntegralRule (ruleId) {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.$refs.integralSetEdit.openEditDialog(ruleId)
      })
    },

    addIntegralRule () {
      this.addDialogStatus = true
      this.$nextTick(() => {
        this.$refs.integralSetAdd.init()
      })
    }

  }
}
</script>
