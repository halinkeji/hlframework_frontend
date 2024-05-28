<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pt-sm q-pb-md">
        <div class="q-gutter-xs row ">
          <div class="col-12 col-xs-6 col-sm-2">
            <q-select
              outlined
              dense
              v-model="turnData.cep_transfer_in_depot_id"
              :options="depotData"
              label="请选择调入仓库"
              option-value="id"
              option-label="cd_name"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-xs-6 col-sm-2">
            <q-select
              outlined
              dense
              v-model="turnData.cep_transfer_out_depot_id"
              :options="depotData"
              label="请选择调出仓库"
              option-value="id"
              option-label="cd_name"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-xs-6 col-sm-2">
            <q-input outlined dense v-model="text" label="调拨单据号" />
          </div>

          <q-btn color="primary" unelevated @click="getStockList" label="搜索" />
          <q-btn color="warning" @click="clearBut()" unelevated label="重置" />
          <q-btn color="primary" @click="createTransferOrder" unelevated v-if="authorityMeta('add')" label="新增" />
          <q-btn color="primary" unelevated @click="countExport" label="导出XLS文件" :disable="inListData.length == 0" />
        </div>
      </div>
      <show-log-data ref="showDataRef" v-if="showLogStatus" @dataList="showLogStatus = false"></show-log-data>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="inListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :context="context"
          :localeText="localeText"
          @first-data-rendered="adaptiveTable"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="60"
          rowSelection="multiple"
          :defaultColDef="defaultColDef"
          @rowSelected="rowSelectedAg"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :rowClassRules="{
            'bg-red-3 ': (params) => {
              return params.data.cep_status == 4 ? true : false;
            },
          }"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
    <detail-data ref="itemDataRef" v-if="addStockStatus" @dataList="getStockList" />
     <create-transfer-dialog ref="transferDialogRef" @colseDialog="colseTransferDialog" v-if="transferDialogStatus" />
  </q-page>
</template>
<script>
import DetailData from './components/DetailData.vue'
import AgButton from './components/AgButton.vue'
import AgShow from './components/AgShow'
import ShowLogData from 'pages/erp/purchase/components/ShowLogData'
import CreateTransferDialog from './CreateTransferDialog.vue'
export default {
  name: 'erpTransfer',
  components: {
    AgButton,
    AgShow,
    DetailData,
    ShowLogData,
    CreateTransferDialog
  },
  data () {
    return {
      addStockStatus: false,
      text: '',
      current: 1,
      context: '',
      gridOptions: {},
      dataListSelections: [],
      inListData: [],
      defaultColDef: {
        sortable: true
      },
      columnDefs: [
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '调拨单据号',
          field: 'cep_contract_number',
          cellRendererFramework: 'AgShow',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '调出仓库编号',
          field: 'outDepot.cd_code',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '调出仓库名称',
          field: 'outDepot.cd_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '调入仓库编号',
          field: 'inDepot.cd_code',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '调入仓库名称',
          field: 'inDepot.cd_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '调拨数量',
          field: 'cep_total_purchase_num',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '调拨金额',
          field: 'cep_total_purchase_amount',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '调拨状态',
          field: 'store.name',
          valueGetter: (p) => {
            if (p.data.cep_status == 1) {
              return '保存'
            }
            if (p.data.cep_status == 2) {
              return '已确认'
            }
            if (p.data.cep_status == 3) {
              return '已审核'
            }
            if (p.data.cep_status == 5) {
              return '挂起'
            }
            if (p.data.cep_status == 6) {
              return '已分配出库'
            }
            if (p.data.cep_status == 7) {
              return '已分配入库'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '创建时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm')
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '审核时间',
          field: 'updated_at',
          valueGetter: (p) => {
            if (p.data.cep_status == 3) {
              return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD  HH:mm')
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作员',
          field: 'auditor.username',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      showLogStatus: false,
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      depotData: [],
      turnData: {},
      transferDialogStatus: false
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.context = this

    this.getDepotList()
  },
  mounted () {
    this.getStockList()
  },
  methods: {
    createTransferOrder () {
      this.transferDialogStatus = true
      this.$nextTick(() => {
        this.$refs.transferDialogRef.init()
      })
    },
    colseTransferDialog () {
      this.transferDialogStatus = false

      this.$nextTick(() => {
        this.getStockList()
      })
    },
    getDepotList () {
      this.$store
        .dispatch('clothingDepot/getAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data
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
    getStockList () {
      const obj = {
        ...this.turnData,
        code: this.text,
        selectStoreData: this.selectStoreData,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('erpTransfer/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.inListData = res.data ? res.data.list : [] // 三元运算赋值
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    countExport () {
      const obj = {
        ...this.turnData,
        code: this.text,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('exports/getTransferExport', obj)
        .then((res) => {
          if (res.code == 200) {
            window.location.href = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getStockList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getStockList()
    },
    clearBut () {
      this.text = ''
      this.turnData.cep_transfer_in_depot_id = ''
      this.turnData.cep_transfer_out_depot_id = ''
      this.selectStoreData = []
      this.getStockList()
    }, // 重置按钮方法
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    showPopup (id) {
      this.addStockStatus = true
      this.$nextTick(() => {
        this.$refs.itemDataRef.init(id)
      })
    }, // 显示弹窗方法
    showLogData (val) {
      this.showLogStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.init(val, 8)
      })
    },
    getDataList () {
      this.addStockStatus = false
      this.getStockList()
    }, // 隐藏弹窗方法
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
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
