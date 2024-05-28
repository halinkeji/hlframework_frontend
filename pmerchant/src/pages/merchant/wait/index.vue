<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-2">
            <q-input label="请输入商户名称/联系人/联系电话" clearable outlined v-model="searchInput" dense />
          </div>

          <div class="col-12 col-md-2">
            <q-select
              outlined
              v-model="searchTrade"
              map-options
              emit-value
              dense
              option-label="name"
              option-value="value"
              :options="tradeListData"
              label="行业"
              clearable
            />
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearBut" color="warning" unelevated label="重置" />

          <q-btn @click="editStoreData()" color="primary" unelevated label="新增"> </q-btn>
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham wait-merchant-list ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="merchantDataList"
          :gridOptions="gridOptions"
           :rowDragManaged="true"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
            :defaultColDef="defaultColDef"
             rowSelection="multiple"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
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
      <edit-dialog
        ref="editDialogRef"
        v-if="editDialogStatus"
        @closeDialog="editDialogStatus = false;getList();"
      />

      <view-page
        ref="viewDialogRef"
        v-if="viewDialogStatus"
        @closeDialog="viewDialogStatus = false;getList();"
      />

      <check-id
        ref="checkIdRef"
        v-if="checkIdDialogStatus"
        @closeDialog="
          checkIdDialogStatus = false;
          getList();
        "
      />
    </div>
  </q-page>
</template>

<script>
import Operating from '../components/AgOperator.vue'
import AgName from '../components/AgName.vue'

import EditDialog from '../Edit'
import ViewPage from '../ViewPage'
import AgStoreStatusChip from '../components/AgStoreStatusChip'

import CheckId from '../CheckId'
export default {
  name: 'merchantPro',
  components: {
    Operating,
    EditDialog,
    ViewPage,
    AgStoreStatusChip,
    AgName,
    CheckId
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        Operating
      },
      merchantDataList: [],
      columnDefs: [
        // 表格列数据
        {
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 50
        },
        {
          headerName: '总部名称',
          field: 'pmm_relation_lib_id',
          valueGetter: (p) => {
            return p.data.name
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-is-main': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '门店名称',
          field: 'name',
          cellRendererFramework: 'AgName'
        },
        {
          headerName: '联系人', // 列标题
          field: 'contact_people' // 列与数据源对应的字段
        },
        {
          headerName: '联系电话',
          field: 'contact_tel'
        },
        {
          headerName: '手机号',
          field: 'contact_moblie'
        },

        {
          headerName: '行业',
          field: 'tradeInfo.name'
        },
        {
          headerName: '门店类型',
          field: 'manage_type',
          valueGetter: (p) => {
            if (p.data.manage_type == 'only') {
              return '单门店'
            } else if (p.data.manage_type == 'chain') {
              return '连锁店'
            } else if (p.data.manage_type == 'join') {
              return '加盟店'
            }
          }
        },

        {
          headerName: '不通过原因',
          field: 'pmm_lose_reason'
        },
        {
          headerName: '地址',
          field: 'ps_type',
          valueGetter: (p) => {
            return p.data.province + '-' + p.data.city + '-' + p.data.district + '-' + p.data.address
          }
        },
        {
          headerName: '状态',
          field: 'pmm_status',
          width: 150,
          cellRendererFramework: 'AgStoreStatusChip',
          pinned: 'right'
        },

        {
          headerName: '操作',
          field: 'ps_type',
          width: 150,
          cellRendererFramework: 'Operating',
          pinned: 'right'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: true,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},

      searchInput: '',
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: [],
      storeSonNum: 0,
      editDialogStatus: false,
      viewDialogStatus: false,
      checkIdDialogStatus: false,
      tradeListData: [],
      tradeItemData: {},
      searchTrade: ''
    }
  },

  mounted () {
    this.context = this
    this.getList()
  },
  computed: {},
  created () {
    const storeLocal = this.$q.localStorage.getItem('pmerchant_store_local')
    if (storeLocal && storeLocal.storeSonNum) {
      this.storeSonNum = storeLocal.storeSonNum

      this.tradeListData = storeLocal.tradeListData
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
        searchInput: this.searchInput,
        pmm_status: [-1, -2, -3],
        searchTrade: this.searchTrade
      }
      this.$store
        .dispatch('merchantManage/getDataList', obj)
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
        // params.api.sizeColumnsToFit()
      }
    },

    rowSpan (params) {
      const fields = ['pmm_relation_lib_id']
      const data = this.merchantDataList
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
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

    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条商户吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {
          console.log('清除')
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('merchant/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条商户信息'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },

    editStoreData (storeId) {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editDialogRef.init(storeId)
      })
    },

    checkMechantData (storeId) {
      this.checkIdDialogStatus = true
      this.$nextTick(() => {
        this.$refs.checkIdRef.init(storeId)
      })
    },
    viewStoreData (storeId) {
      this.viewDialogStatus = true
      this.$nextTick(() => {
        this.$refs.viewDialogRef.init(storeId)
      })
    }
  }
}
</script>
<style>
.wait-merchant-list .cell-span-is-main {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
