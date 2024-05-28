<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pt-sm q-pb-md">
      <div class="q-gutter-xs row ">
        <div class="col">
        <q-select
          outlined
          dense
            v-model="turnData.cep_in_depot_id"
          :options="depotData"
          label="请选择调入仓库"
          option-value="id"
          option-label="cd_name"
          emit-value
          map-options
        />
        </div>
        <div class="col">
        <q-select
          outlined
          dense
            v-model="turnData.cep_out_depot_id"
          :options="depotData"
          label="请选择调出仓库"
          option-value="id"
          option-label="cd_name"
          emit-value
          map-options
        />
        </div>
        <div class="col">
          <q-input outlined dense v-model="text" label="调拨单据号" />
        </div>
        <q-btn color="primary" unelevated @click="getStockList" label="搜索" />
        <q-btn color="warning" unelevated @click="clearBut()" label="重置" />
        <q-btn color="primary" @click="chooseInvoice(2)" unelevated v-if="authorityMeta('transferAdd')" label="新增" />
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
        :defaultColDef="defaultColDef"
        @first-data-rendered="adaptiveTable"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="60"
        rowSelection="multiple"
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
    <choose-invoice
      v-if="chooseInvoiceVisible"
      ref="chooseInvoiceList"
      @getChooseInvoiceData="receivingAdministrator"
      @closeChooseInvoice="closeChooseInvoice"
    ></choose-invoice>
  </div>
</template>
<script>
import AgButton from './components/AgButton.vue'
import ShowLogData from 'pages/erp/purchase/components/ShowLogData'
import AgInput from './components/AgInput'
import AgShow from './components/AgShow'
import ChooseInvoice from './components/ChooseInvoice'
export default {
  name: 'erpTransfer',
  components: {
    AgButton,
    AgInput,
    AgShow,
    ShowLogData,
    ChooseInvoice
  },
  data () {
    return {
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
          headerName: '调拨入库单据号',
          field: 'cep_contract_number',
          cellRendererFramework: 'AgShow',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.18) + 'px'
        },
        {
          headerName: '原始单据编号',
          field: 'cep_contract_number',
          cellRendererFramework: 'AgInput',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.16) + 'px'
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
            if (p.data.cep_status == 4) {
              return '已关闭'
            }
            if (p.data.cep_status == 5) {
              return '挂起'
            }
            if (p.data.cep_status == 6) {
              return '确认入库'
            }
            if (p.data.cep_status == 7) {
              return '已完成'
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
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '审核时间',
          field: 'updated_at',
          valueGetter: (p) => {
            if (p.data.cep_status == 3) {
              return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD  HH:mm')
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgButton',
          pinned: this.pinnedComputed('right'),
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
      chooseInvoiceVisible: false
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
    chooseInvoice (val) {
      const obj = {
        type: val
      }
      this.chooseInvoiceVisible = true
      this.$nextTick(() => {
        this.$refs.chooseInvoiceList.getInvoice(obj)
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        const obj = {
          transfer_out_order_id: val[0].id
        }
        this.$store
          .dispatch('erpTransferIn/createTransferInDepotOrder', obj)
          .then((res) => {
            if (res.code == 200 && res.data) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: '成功生成出库单',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })

              this.$nextTick(() => {
                this.$router.push({ name: 'addErpTransferIn', query: { id: res.data.id } })
              })
            } else {
              this.$q.notify({
                message: '生成失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
          .catch((error) => {})
      }
    },
    // 关闭
    closeChooseInvoice () {
      this.chooseInvoiceVisible = false
    },
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
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
        .dispatch('erpTransferIn/getDataList', obj)
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
        selectStoreData: this.selectStoreData,
        order_type: 3,
        type: '调拨入库单记录'
      }
      this.$store
        .dispatch('exports/getTransferAllExport', obj)
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
      this.turnData.cep_in_depot_id = ''
      this.turnData.cep_out_depot_id = ''
      this.selectStoreData = []
      this.getStockList()
    }, // 重置按钮方法
    adaptiveTable (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },
    // 显示弹窗方法
    showLogData (val) {
      this.showLogStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.init(val, 8)
      })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
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
