<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-md">
      <div class="q-gutter-xs row">
        <div class=" col-12 col-md-2">
          <q-input outlined v-model="search" label="单据号" dense />
        </div>
        <div class=" col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="depot_id"
            :options="depotData"
            dense
            label="仓库"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined v-model="startTime" label="开始时间" dense readonly>
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
        <div class="col-12 col-md-2 ">
          <q-input outlined v-model="endTime" label="结束时间" dense readonly>
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
        <q-btn color="primary" unelevated label="新增" v-if="authorityMeta('orderAdd')"  @click="chooseInvoice(16)" />
        <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="goodsInListData.length == 0" />
      </div>
    </div>
    <show-log-data ref="showDataRef" v-if="showLogStatus" @dataList="showLogStatus = false"></show-log-data>

    <show-all ref="showRef" v-if="showStatus" @dataList="showStatus = false" />
    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="goodsInListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :components="components"
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
     <hl-choose-invoice
      v-if="chooseInvoiceVisible"
      ref="chooseInvoiceList"
      @getChooseInvoiceData="receivingAdministrator"
      @closeChooseInvoice="closeChooseInvoice"
    ></hl-choose-invoice>
  </div>
</template>
<script>
import AgButton from './components/AgButton'
import AgInput from './components/AgInput'
import AgShow from './components/AgShow'
import ShowLogData from 'pages/erp/purchase/components/ShowLogData'
import ShowAll from './components/ShowDetail'
export default {
  name: 'directInIndex',
  components: {
    AgButton,
    AgInput,
    AgShow,
    ShowAll,
    ShowLogData
  },
  data () {
    return {
      components: {

      },
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      showLogStatus: false,
      showStatus: false,
      localeText: this.$ag_grid_localeText,
      goodsInListData: [],
      supplierId: '',
      depot_id: '',
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
          cellRendererFramework: 'AgShow',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '原始单据编号',
          field: 'cep_contract_number',
          cellRendererFramework: 'AgInput',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '仓库',
          field: 'cep_depot_name',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '直采店铺',
          field: 'inStore.name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '入库单金额',
          field: 'cep_total_purchase_amount',
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '发货总数',
          field: 'cep_total_purchase_num',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '到货总数',
          field: 'cep_total_shipments_quantity',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '残次总数',
          field: 'cep_total_defect_quantity',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },

        {
          headerName: '状态',
          field: 'cep_status',
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
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '入库时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '备注',
          field: 'cep_note',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'AgButton',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.1) + 'px'
        }
      ],
      search: '',
      context: '',
      chooseInvoiceVisible: false
    }
  },
  computed: {},
  mounted () {
    this.getList()
  },
  created () {
    this.context = this

    this.getDepotList()
  },
  methods: {

    // 选择单据
    chooseInvoice (val) {
      const transport = {
        type: val
      }
      this.chooseInvoiceVisible = true
      this.$nextTick(() => {
        this.$refs.chooseInvoiceList.getInvoice(transport)
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        const obj = {
          direct_out_order_id: val[0].id
        }
        this.$store
          .dispatch('erpDirectin/createDirectInDepotOrder', obj)
          .then((res) => {
            if (res.code == 200 && res.data) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: '成功生成入库单',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })

              this.$nextTick(() => {
                this.$router.push({ name: 'addErpDirectIn', query: { id: res.data.id } })
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
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        supplierId: this.supplierId,
        startTime: startTime,
        endTime: endTime,
        depot_id: this.depot_id
      }

      this.$store
        .dispatch('erpDirectin/getDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.goodsInListData = res.data ? res.data.list : []
            if (res.data) {
              this.setTopTabel(this.goodsInListData)
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
        startTime: startTime,
        endTime: endTime,
        depot_id: this.depot_id,
        type: '直采入库',
        cep_type: 17
      }
      this.$store
        .dispatch('exports/getOrderInExport', obj)
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
        fileName: date + '-采购入库记录'
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
        // params.api.sizeColumnsToFit()
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
          cep_depot_name: '数据合计',
          show_status: true,
          cep_total_purchase_num: '',
          cep_total_purchase_amount: '',
          cep_total_shipments_quantity: '',
          cep_total_defect_quantity: ''
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
        this.$refs.showDataRef.init(val, 7)
      })
    },

    showData (val) {
      this.showStatus = true
      this.$nextTick(() => {
        this.$refs.showRef.getItem(val)
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
