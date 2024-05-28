<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <div class="row q-gutter-sm">
          <div class="col-3">
            <q-input outlined dense label="记录产生开始时间" v-model="startTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
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
          <div class="col-3">
            <q-input outlined dense label="记录产生结束时间" v-model="endTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
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
          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="resetBut()" color="warning" unelevated label="重置" />
        </div>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table w-full hl_header_center hl_content_center full-height"
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
          rowHeight="40"
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

      <record-detail v-if="recordDetailDialog" @closeDialog="recordDetailDialog = false" ref="recordDetailRef" />
    </div>
  </q-page>
</template>
<script>
import AgOperating from './AgOperating'
import RecordDetail from './RecordDetail'
export default {
  components: { AgOperating, RecordDetail },
  data () {
    return {
      isPoppupStatus: false,
      isVerify: false,
      shiftRecordData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '接班时间',
          field: 'psr_heir_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.psr_heir_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '交班时间',
          field: 'psr_transfer_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.psr_transfer_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '备注',
          field: 'psr_note',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '用户',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '记录产生时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
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
      startTime: '',
      endTime: '',
      recordDetailDialog: false
    }
  },

  mounted () {},
  created () {
    this.context = this
    this.getList()
  },
  computed: {},
  methods: {
    // 获取认证信息列表
    getList () {
      this.isPoppupStatus = false
      this.isVerify = false
      const obj = {
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex,
        startTime: this.$q_date.formatDate(this.startTime, 'X'),
        endTime: this.$q_date.formatDate(this.endTime, 'X')
      }
      this.$store
        .dispatch('commonShift/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.shiftRecordData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    // 重置
    resetBut () {
      this.startTime = ''
      this.endTime = ''
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
    openShiftDetail (recordId) {
      console.log('recordId', recordId)
      this.recordDetailDialog = true
      this.$nextTick(() => {
        this.$refs.recordDetailRef.init(recordId)
      })
    }
  }
}
</script>
