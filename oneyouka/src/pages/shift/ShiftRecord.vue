<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-sm q-pt-sm">
        <div class="col-12 col-md-3 q-mt-sm" v-if="is_main_store">
          <q-select
            label="查询油站"
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

        <div class="col-12 col-md-2">
          <q-input outlined dense label="开始时间" v-model="startTime" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined dense label="结束时间" v-model="endTime" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
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
        <q-btn color="warning" unelevated label="重置" @click="clearBut" />
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="shiftRecordData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="60"
          :context="context"
          @rowSelected="rowSelectedAg"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
          @gridReady="onFirstDataRendered"
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
    <record-detail v-if="detailDialogStauts" ref="recordDetailRef" />
  </q-page>
</template>
<script>
import AgOperating from './components/AgOperating'
import RecordDetail from './RecordDetail'

export default {
  components: { AgOperating, RecordDetail },
  data () {
    return {

      shiftRecordData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '接班时间',
          field: 'psr_get_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.psr_get_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '交班时间', // 列标题
          field: 'psr_out_time', // 列与数据源对应的字段
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.psr_out_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '油站',
          field: 'store.name',
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
          width: this.nowpx(0.1) + 'px'
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
      context: null,
      detailDialogStauts: false,

      selectStoreData: [],
      libInStoreList: [],
      startTime: '',
      endTime: ''
    }
  },

  mounted () {
    this.getList()
  },
  created () {
    this.context = this

    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    openShiftDialog (recordId) {
      this.detailDialogStauts = true
      if (recordId > 0) {
        this.$nextTick(() => {
          this.$refs.recordDetailRef.init(recordId)
        })
      }
    },

    getList () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
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
        page: this.page.pageIndex,
        selectStoreData: this.selectStoreData,
        startTime,
        endTime
      }
      this.$store
        .dispatch('shift/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.shiftRecordData = res.data ? res.data.list : []
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
    // 重置
    clearBut () {
      this.selectStoreData = []
      this.startTime = ''
      this.endTime = ''
      this.$nextTick(() => {
        this.getList()
      })
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
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>
