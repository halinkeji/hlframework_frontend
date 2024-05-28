<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-md">
      <div class="q-gutter-x-xs row ">
        <q-input class="col-12 col-md-2 q-mt-sm" label="客户名称" clearable outlined v-model="search" dense />

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

        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索"  @click="getErpClientList" />
        <q-btn color="warning" class=" q-mt-sm" unelevated label="重置"  @click="clean" />
        <q-btn color="primary" class=" q-mt-sm" unelevated label="新增客户" v-if="authorityMeta('add')" @click="editData(0)" />
        <q-btn color="red" class=" q-mt-sm" unelevated label="批量删除" v-if="authorityMeta('delAll')" :disable="dataListSelections.length > 0 ? false : true" @click="delAll" />
        <q-btn color="primary" class=" q-mt-sm " unelevated @click="outCsv" label="导出Csv文件" :disable="clientData.length == 0" />
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
        :rowData="clientData"
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
    <add-client ref="AddClientData" v-if="addPoppupStatus" @refreshDataList="getErpClientList" />
  </div>
</template>
<script>
import AgClientOperate from './AgClientOperate'
import AddClient from './AddClient'
export default {
  name: 'ErpClient',
  components: {
    AgClientOperate,
    AddClient
  },
  data () {
    return {
      addPoppupStatus: false,
      dataListSelections: [],
      gridOptions: {},
      components: {
        AgClientOperate,
        AddClient
      },
      context: null,
      clientData: [],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.045) + 'px'
        },
        {
          headerName: '名称',
          field: 'ecp_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '编号',
          field: 'ecp_number',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '地址',
          field: 'ecp_address',
          width: this.nowpx(0.27) + 'px'
        },
        {
          headerName: '备注',
          field: 'ecp_remarks',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgClientOperate',
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
      clientGroupData: [],
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
    this.getErpClientList()
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
      this.search = ''
      this.selectStoreData = []
      this.getErpClientList()
    },
    // 新增修改
    editData (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.AddClientData.init(id)
      })
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getErpClientList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getErpClientList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getErpClientList () {
      this.addPoppupStatus = false
      this.dataListSelections = []
      const obj = {
        text: this.search,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('erpCustomer/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.clientData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确认批量删除客户',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const accountInfo = this.$q.localStorage.getItem('myouka_account_info')

            const obj = dataListSelections.map((item) => {
              if (parseInt(item.store_id) == parseInt(accountInfo.store_id)) {
                return item.id
              } else if (this.is_main_store) {
                return item.id
              } else {
                return null
              }
            })
            this.$store.dispatch('erpCustomer/delData', obj).then((res) => {
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
              this.getErpClientList()
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
    outCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-客户记录'
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
