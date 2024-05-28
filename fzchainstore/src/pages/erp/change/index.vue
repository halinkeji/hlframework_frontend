<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-sm row">
          <div class="col">
            <q-input outlined v-model="searchNumber" label="请输入调整单据号" dense />
          </div>
          <div class="col">
            <q-select
              outlined
              option-value="id"
              option-label="ect_name"
              emit-value
              map-options
              v-model="type"
              :options="changeTypData"
              dense
              label="请选择调整状态"
            />
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
              label="请选择仓库"
            />
          </div>

          <div class="col">
            <q-input outlined v-model="startTime" label="开始时间" dense  readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy  transition-show="scale" transition-hide="scale">
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
                  <q-popup-proxy  transition-show="scale" transition-hide="scale">
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
            <q-input outlined v-model="endTime" label="结束时间" dense  readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy @before-show="endTime" transition-show="scale" transition-hide="scale">
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
                  <q-popup-proxy @before-show="endTime" transition-show="scale" transition-hide="scale">
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
          <q-btn color="primary" unelevated label="新增" v-if="authorityMeta('add')" @click="createChangeOrder" />
          <q-btn color="primary" unelevated @click="countExport" label="导出Xls文件" />
        </div>
      </div>

      <div class="col-shrink q-px-sm full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="pdData"
          :gridOptions="gridOptions"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :defaultColDef="defaultColDef"
          :enableCellTextSelection="true"
          :components="components"
          :context="context"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
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
      <create-change-order-dialog ref="changeOrderDialogRef" @colseDialog="colseChangeDialog" v-if="changeOrderDialogStatus" />
    </div>
  </q-page>
</template>
<script>
import AgPdOperate from './components/AgPdOperate'
import AgShow from './components/AgShow'
import ShowLogData from 'pages/erp/purchase/components/ShowLogData'

import CreateChangeOrderDialog from './CreateChangeOrderDialog.vue'
export default {
  name: 'index',
  components: { AgPdOperate, AgShow, ShowLogData, CreateChangeOrderDialog },
  data () {
    return {
      components: { AgPdOperate, AgShow },
      gridOptions: {},
      showLogStatus: false,
      context: '',
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
          headerName: '调整单据号',
          cellRendererFramework: 'AgShow',
          field: 'cep_contract_number',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '调整仓库',
          field: 'depot.cd_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '调整类型',
          field: 'updated_at',
          valueGetter: (p) => {
            if (p.data.changeType) {
              return p.data.changeType.ect_name
            }
            return ''
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '调整总数量',
          field: 'cep_total_purchase_num',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '调整品类数',
          field: 'cep_total_shipments_quantity',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
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
          headerName: '调整时间',
          field: 'updated_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '操作',
          cellRendererFramework: 'AgPdOperate',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      pdData: [],
      depotData: [],
      changeTypData: [],
      selected: [],
      searchNumber: '',
      type: '',
      depot_id: '',
      startTime: '',
      endTime: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },

      localeText: this.$ag_grid_localeText,
      changeOrderDialogStatus: false,
      orderStatusObject: {
        1: '已保存',
        2: '已确认',
        3: '已审核',
        4: '已作废',
        5: '挂起',
        6: '调整中',
        7: '调整成功'
      }
    }
  },
  mounted () {
    this.context = this

    this.getList()
  },
  created () {
    this.getDepotList()
    this.getChangeTypeList()
  },
  computed: {},
  methods: {

    createChangeOrder () {
      this.changeOrderDialogStatus = true
      this.$nextTick(() => {
        this.$refs.changeOrderDialogRef.init()
      })
    },
    colseChangeDialog () {
      this.changeOrderDialogStatus = false

      this.$nextTick(() => {
        this.getList()
      })
    },

    getChangeTypeList () {
      this.$store
        .dispatch('erpChangeType/getAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.changeTypData = res.data
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
        text: this.searchNumber,
        depot_id: this.depot_id,
        startTime: startTime,
        endTime: endTime,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        type: this.type
      }
      this.$store
        .dispatch('erpchange/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.pdData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
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
        text: this.searchNumber,
        depot_id: this.depot_id,
        startTime: startTime,
        endTime: endTime,
        type: this.type
      }
      this.$store
        .dispatch('exports/getChangeExport', obj)
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
    showLogData (val) {
      this.showLogStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.init(val, 13)
      })
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-调整记录'
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    selfAdaption (params) {
      params.api.sizeColumnsToFit()
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
    clean () {
      this.searchNumber = ''
      this.depot_id = ''
      this.this.type = ''
      this.getList()
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
