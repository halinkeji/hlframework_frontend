<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class=" row q-gutter-xs">
        <div class="col">
          <q-input outlined v-model="search" label="单据号" dense />
        </div>
        <div class="col">
          <q-select
            outlined
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="depot_id"
            :options="depotData"
            dense
            clearable
            label="仓库"
          />
        </div>
        <div class="col">
          <q-select
            outlined
            option-value="id"
            option-label="ces_name"
            emit-value
            map-options
            clearable
            v-model="supplierId"
            :options="supplierList"
            dense
            label="供应商"
          />
        </div>
        <div class="col">
          <q-input outlined v-model="startTime" clearable label="开始时间" dense readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col">
          <q-input outlined v-model="endTime" clearable label="结束时间" dense readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <q-btn color="primary" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" unelevated label="重置" @click="clean" />
        <q-btn color="positive" unelevated label="新增采购单" v-if="authorityMeta('add')" @click="createPurchaseOrder" />
        <q-btn color="primary" unelevated @click="countExport" label="导出Csv文件" :disable="purchaseListData.length == 0" />
      </div>
    </div>

    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="purchaseListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :defaultColDef="defaultColDef"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :localeText="localeText"
        :context="context"
        :rowClassRules="{
          'bg-red-3 ': (params) => {
            return params.data.cep_status == 4 ? true : false;
          },
        }"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :current-page="page.pageIndex"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>

    <show-log-data ref="showDataRef" v-if="showLogStatus" @dataList="showLogStatus = false"></show-log-data>

    <create-purchase-dialog ref="purchaseDialogRef" @colseDialog="colsePurchaseDialog" v-if="purchaseDialogStatus" />
  </div>
</template>

<script>
import AgButton from './components/AgButton'
import AgInput from './components/AgInput'
import CreatePurchaseDialog from './CreatePurchaseDialog.vue'
import ShowLogData from './components/ShowLogData'
export default {
  name: 'purchaseIndex',
  components: {
    AgButton,
    AgInput,
    ShowLogData,
    CreatePurchaseDialog
  },
  data () {
    return {
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      purchaseListData: [],
      supplierId: '',
      depot_id: '',
      supplierList: [],
      depotData: [],
      gridOptions: {},
      startTime: '',
      endTime: '',
      defaultColDef: {
        sortable: true
      },
      columnDefs: [
        // 表格列数据
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '单据号',
          field: 'cep_contract_number',
          pinned: this.pinnedComputed('left'),
          cellRendererFramework: 'AgInput',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '供应商',
          field: 'cep_supplier_name',
          sort: 'desc',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '仓库',
          field: 'cep_depot_name',
          sort: 'desc',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '采购应付',
          field: 'cep_total_purchase_amount',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '采购总数',
          field: 'cep_total_purchase_num',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '采购员',
          field: 'cep_buyer_name',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '状态',
          field: 'cep_status',
          valueGetter: (p) => {
            return this.orderStatusObject[p.data.cep_status]
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '采购时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm')
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '审核时间',
          field: 'updated_at',
          valueGetter: (p) => {
            if (p.data.cep_status >= 3) {
              return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD  HH:mm')
            }
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '审核人',
          field: 'updated_at',
          valueGetter: (p) => {
            if (p.data.cep_status >= 3 && p.data.auditor) {
              return p.data.auditor.username
            }
          },
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '备注',
          field: 'cep_note',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          field: 'goo_price',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.08) + 'px'
        }
      ],
      search: '',
      context: '',
      showLogStatus: false,
      showDetailStatus: false,
      purchaseDialogStatus: false,
      orderStatusObject: {
        1: '已保存',
        2: '已确认',
        3: '已审核',
        4: '已作废',
        5: '挂起',
        6: '入库中',
        7: '入库成功'
      }
    }
  },
  computed: {},
  mounted () {
    this.getList()
  },
  created () {
    this.context = this

    this.getDepotList()
    this.getSupplierList()
  },
  methods: {
    createPurchaseOrder () {
      this.purchaseDialogStatus = true
      this.$nextTick(() => {
        this.$refs.purchaseDialogRef.init()
      })
    },
    colsePurchaseDialog () {
      this.purchaseDialogStatus = false

      this.$nextTick(() => {
        this.getList()
      })
    },

    getList () {
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const obj = {
        text: this.search,
        supplierId: this.supplierId,
        depot_id: this.depot_id,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        startTime: startTime,
        endTime: endTime
      }

      this.$store
        .dispatch('erpPurchase/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.purchaseListData = res.data ? res.data.list : []
            if (res.data) {
              this.setTopTabel(this.purchaseListData)
            }
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
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const obj = {
        text: this.search,
        supplierId: this.supplierId,
        depot_id: this.depot_id,
        startTime: startTime,
        endTime: endTime
      }

      this.$store
        .dispatch('exports/getPurchaseExport', obj)
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
    getSupplierList () {
      this.$store
        .dispatch('clothingSupplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.supplierList = res.data
            }
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-采购记录'
      })
    },
    clean () {
      this.search = ''
      this.endTime = ''
      this.startTime = ''
      this.supplierId = ''
      this.depot_id = ''
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
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          cep_supplier_name: '数据合计',
          show_status: true,
          cep_real_pay_amount: '',
          cep_total_purchase_amount: '',
          cep_total_purchase_num: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }

          rowData.push(oneRowData)
        })
        return rowData
      }
    },
    // 限制保留小数
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    showLogData (val) {
      this.showLogStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.init(val, 1)
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

<style>
.erp-in-table .cell-span-erp-in {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
