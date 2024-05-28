<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-2">
            <q-input label="请输入商户名称/联系人/联系电话" clearable outlined v-model="searchInput" dense />
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearBut" color="warning" unelevated label="重置" />
          <q-btn @click="openEditDialog" color="primary" unelevated label="新增" :disable="storeSonNum <= page.totalCount">
            <q-tooltip> 可创建门店数 {{ storeSonNum }} 个 </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="merchantDataList"
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
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-py-sm">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
      <edit-merchant ref="editMerchantRef" v-if="editMerchantDialogStatus" @getMethods="closeEditDialog" />
    </div>
  </q-page>
</template>

<script>
import Operating from './components/AgOperator'
import AgSwitch from './components/AgSwitch'
import EditMerchant from './Edit'
export default {
  name: 'merchantManage',
  components: {
    Operating,
    AgSwitch,
    EditMerchant
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        Operating,
        AgSwitch
      },
      merchantDataList: [],
      columnDefs: [
        // 表格列数据
        {
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '排序',
          field: 'sort',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeSort,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '门店名称',
          field: 'name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '联系人', // 列标题
          field: 'contact_people', // 列与数据源对应的字段
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '联系电话',
          field: 'contact_tel',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '地址',
          field: 'ps_type',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return p.data.province + '-' + p.data.city + '-' + p.data.district + '-' + p.data.address
          }
        },
        {
          headerName: '状态',
          field: 'status',
          cellRendererFramework: 'AgSwitch',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          field: 'ps_type',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'Operating'
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

      searchInput: '',
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 0
      },
      dataListSelections: [],
      storeSonNum: 0,
      editMerchantDialogStatus: false
    }
  },

  mounted () {
    this.context = this
    this.getList()
  },
  computed: {},
  created () {
    const storeLocal = this.$q.localStorage.getItem('mychainstore_store_local')
    if (storeLocal && storeLocal.storeSonNum) {
      this.storeSonNum = storeLocal.storeSonNum
    }
  },
  methods: {
    clearBut () {
      this.searchInput = ''

      this.getList()
    },
    getList () {
      const obj = {
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        searchInput: this.searchInput
      }
      this.$store
        .dispatch('merchant/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.merchantDataList = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },

    currentChangeHandle (val) {
      this.page.pageIndex = val
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

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    openEditDialog (merchantId) {
      this.editMerchantDialogStatus = true

      this.$nextTick(() => {
        this.$refs.editMerchantRef.init(merchantId)
      })
    },

    closeEditDialog () {
      this.editMerchantDialogStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },

    changeSort (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      data.sort = data.sort.replace(/\s+/g, '')
      if (!data.sort) {
        this.getList()
        return ''
      }
      if (!regu.test(data.sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      const obj = {
        sort: data.sort,
        id: data.id
      }
      this.$store.dispatch('merchant/setData', obj).then((res) => {
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
  }
}
</script>
