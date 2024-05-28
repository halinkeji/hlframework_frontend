<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-xs">
          <q-input class="col-12 col-md-2 q-mt-sm" label="请输入商户名称/联系人/联系电话" clearable outlined v-model="searchInput" dense />
          <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
          <q-btn @click="clearBut" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />
          <q-btn
            :to="{ name: 'editMerchant' }"
            color="primary"
            class="col-12 col-md-1 q-mt-sm"
            unelevated
            label="新增"
            :disable="storeSonNum <= page.totalCount"
          >
            <q-tooltip> 可创建门店数 {{ storeSonNum }} 个 </q-tooltip>
          </q-btn>
          <!--  -->
        </div>
      </div>
      <store-credit ref="storeCreditRef" v-if="showCreditStatus" @getMethods="getList" />
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
      <div class="col-shrink bg-white q-pb-md">
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
    </div>
  </q-page>
</template>

<script>
import Operating from './components/AgOperator'
import AgSwitch from './components/AgSwitch'
import AgCreditSwitch from './components/AgCreditSwitch'
import AgModifySwitch from './components/AgModifySwitch'
import StoreCredit from './components/StoreCredit'
export default {
  name: 'merchantManage',
  components: {
    Operating,
    AgSwitch,
    AgCreditSwitch,
    AgModifySwitch,
    StoreCredit,
  },
  data() {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      showCreditStatus: false,
      components: {
        Operating,
        AgCreditSwitch,
        AgModifySwitch,
        AgSwitch,
      },
      merchantDataList: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px',
        },
        {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: '门店名称',
          field: 'name',
          width: this.nowpx(0.2) + 'px',
        },
        {
          headerName: '联系人',
          field: 'contact_people',
          width: this.nowpx(0.12) + 'px',
        },
        {
          headerName: '联系电话',
          field: 'contact_tel',
          width: this.nowpx(0.15) + 'px',
        },
        {
          headerName: '地址',
          field: 'ps_type',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return p.data.province + '-' + p.data.city + '-' + p.data.district + '-' + p.data.address
          },
        },
        {
          headerName: '状态',
          field: 'status',
          cellRendererFramework: 'AgSwitch',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '门店类型',
          field: 'storeCredit.cep_status',
          valueGetter: (p) => {
            if (p.data.storeCredit) {
              if (p.data.storeCredit.csc_type == 1) {
                return '联营'
              }
              if (p.data.storeCredit.csc_type == 2) {
                return '直营'
              }
              if (p.data.storeCredit.csc_type == 3) {
                return '合伙'
              }
              if (p.data.storeCredit.csc_type == 4) {
                return '合伙'
              }
            } else {
              return ''
            }
          },
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '授信额度',
          field: 'storeCredit.csc_credit_amount',
          valueGetter: (p) => {
            if (p.data.storeCredit) {
              return p.data.storeCredit.csc_credit_amount
            } else {
              return ''
            }
          },
          width: this.nowpx(0.15) + 'px',
        },
        {
          headerName: '供货折扣 ',
          field: 'storeCredit.csc_supply_discount',
          valueGetter: (p) => {
            if (p.data.storeCredit) {
              return p.data.storeCredit.csc_supply_discount
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '授信状态',
          field: 'storeCredit.csc_credit_switch',
          cellRendererFramework: 'AgCreditSwitch',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '是否手动修改',
          field: 'storeCredit.csc_if_manually_modify',
          cellRendererFramework: 'AgModifySwitch',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '操作',
          field: 'ps_type',
          width: this.nowpx(0.21) + 'px',
          cellRendererFramework: 'Operating',
        },
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true,
      },
      gridOptions: {},

      searchInput: '',
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 0,
      },
      dataListSelections: [],
      storeSonNum: 0,
    }
  },

  mounted() {
    this.context = this
    this.getList()
  },
  computed: {},
  created() {
    const system_local = this.$q.localStorage.getItem('fzchainstore_store_local')
    if (system_local && system_local.storeSonNum) {
      this.storeSonNum = system_local.storeSonNum
    }
  },
  methods: {
    clearBut() {
      this.searchInput = ''

      this.getList()
    },
    getList() {
      const obj = {
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        searchInput: this.searchInput,
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

    sizeChangeHandle(val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },

    currentChangeHandle(val) {
      this.page.pageIndex = val
      this.getList()
    },

    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },

    showStoreCredit(val) {
      this.showCreditStatus = true
      this.$nextTick(() => {
        this.$refs.storeCreditRef.init(val)
      })
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    delAll() {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条商户吗`,
          cancel: true,
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {
          console.log('清除')
        })
    },
    deleteRecord() {
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
              caption: '成功删除 ' + res.data + ' 条商户信息',
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
      }
    },
  },
}
</script>
