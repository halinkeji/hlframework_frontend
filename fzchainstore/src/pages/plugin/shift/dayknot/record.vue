<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row">
        <div class="col-12 col-md-2 q-pt-sm q-mr-sm">
          <q-input outlined dense label="开始时间" v-model="dataForm.startTime" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="dataForm.startTime" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-2 q-pt-sm q-mr-sm">
          <q-input outlined dense label="结束时间" v-model="dataForm.endTime" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="dataForm.endTime" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn @click="getList()" color="primary" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="重置" />
      </div>

      <div class="col-shrink q-pa-sm full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="dayknotRecordData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :context="context"
          @rowSelected="rowSelectedAg"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>

    <view-intergral-record ref="recordRef" />
  </q-page>
</template>
<script>
import ViewIntergralRecord from './ViewIntergralRecord'
import AgOperating from './AgOperating'
export default {
  components: { AgOperating, ViewIntergralRecord },
  data () {
    return {
      dayknotRecordData: [],
      gridOptions: {},
      dataForm: {
        startTime: '',
        endTime: ''
      },
      columnDefs: [
        {
          headerName: '结算日期',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD')
          },
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '销售额',
          field: 'psi_total_sell_amounts',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '成本价',
          field: 'psi_total_cost_price',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '毛利润',
          field: 'psi_total_gross_profit',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '固定成本',
          field: 'psi_fixed_costs',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '纯利润',
          field: 'psi_pure_profit',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '纯毛占比',
          field: 'psi_pure_say_profit',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgOperating',
          filter: false,
          width: this.nowpx(0.25) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null
    }
  },

  mounted () {},
  created () {
    this.context = this
    this.getList()
  },
  computed: {},
  methods: {
    viewIntegral (dayknot_id) {
      this.$refs.recordRef.init(dayknot_id)
    },

    getList () {
      const startTime = this.$q_date.formatDate(this.dataForm.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.dataForm.endTime, 'X')
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
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex,
        startTime,
        endTime
      }
      this.$store
        .dispatch('shift/getDayknotList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.dayknotRecordData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '操作失败',
            color: 'red'
          })
        })
    },
    // 重置
    clearBut () {
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList(this.type)
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList(this.type)
    },
    resetBut () {
      this.dataForm = {
        startTime: '',
        endTime: ''
      }

      this.getList()
    }
  }
}
</script>
