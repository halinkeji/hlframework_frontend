<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <div class="row q-gutter-xs q-mb-md">
        <div class="col-12 col-md-2">
          <q-input outlined readonly dense v-model="reserveData.prd_time_start" label="开始日期">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="reserveData.prd_time_start" minimal mask="YYYY-MM-DD HH:mm:ss">
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
                  <q-time v-model="reserveData.prd_time_start" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-md-2 col-12">
          <q-input outlined readonly dense label="结束日期" v-model="reserveData.prd_time_end">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="reserveData.prd_time_end" minimal mask="YYYY-MM-DD HH:mm:ss">
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
                  <q-time v-model="reserveData.prd_time_end" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
        <q-btn unelevated color="grey" dense label="重置" @click="clearBut" class="q-px-md" />
        <q-btn unelevated color="green" dense label="新增预约" @click="showAddReserve" class="q-px-md" />

        <q-btn unelevated color="orange" dense label="核销场次" @click="openCheckDialog" class="q-px-md" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="reserveList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        :context="context"
        rowSelection="multiple"
        :localeText="localeText"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :stopEditingWhenGridLosesFocus="true"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
    <add-reserve ref="addReserveRef" v-if="addReserveStatus" @dataList="getDataList" />
    <time-period ref="timePeriodRef" v-if="timePeriodStatus" @dataList="getDataList" />
     <check-record ref="checkRecordDialogRef" v-if="checkDialogStatus" @closeDialog="getDataList" />
  </div>
</template>
<script>
import { date } from 'quasar'
import DetailAgOperate from './components/DetailAgOperate'
import AddReserve from './AddReserve'
import TimePeriod from './TimePeriod'
import CheckRecord from './CheckRecord'
export default {
  name: 'cdyyManage',
  components: { DetailAgOperate, AddReserve, TimePeriod, CheckRecord },
  data () {
    return {
      components: { DetailAgOperate, AddReserve },
      addReserveStatus: false,
      reserveData: {
        prp_name: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_status: ''
      },

      context: null,
      gridOptions: {},
      reserveList: [],
      columnDefs: [
        {
          headerName: '场地',
          field: 'site.cs_name',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '属性',
          field: 'cs_attribute',
          width: this.nowpx(0.11) + 'px',
          valueGetter: (p) => {
            return p.data.site && p.data.site.id ? (parseInt(p.data.cs_attribute) == 1 ? '全场' : '半场') : ''
          }
        },

        {
          headerName: '会员',
          width: this.nowpx(0.11) + 'px',
          field: 'member.mem_memberName'
        },
        {
          headerName: '会员卡号',
          width: this.nowpx(0.11) + 'px',
          field: 'member.mem_memberCardNum'
        },
        {
          headerName: '会员电话',
          width: this.nowpx(0.11) + 'px',
          field: 'member.mem_memberMobile'
        },
        {
          headerName: '支付金额',
          field: 'cr_amount',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '日期',
          valueGetter: (p) => {
            return p.data.cr_year + '-' + p.data.cr_month + '-' + p.data.cr_day
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '时间',
          valueGetter: (p) => {
            return p.data.cr_start_hour + ':' + p.data.cr_start_minutes + ' - ' + p.data.cr_end_hour + ':' + p.data.cr_end_minutes
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '添加时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '核销时间',
          valueGetter: (p) => {
            if (p.data.cr_check_time) {
              return this.$q_date.formatDate(p.data.cr_check_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '退款金额',
          field: 'cr_refund_amount',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '退款时间',
          valueGetter: (p) => {
            return p.data.cr_refund_time ? this.$q_date.formatDate(p.data.cr_refund_time * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
          },
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '状态',
          field: 'cr_status',
          width: this.nowpx(0.11) + 'px',
          valueGetter: (p) => {
            return this.statusText(p.data)
          },
          pinned: 'right'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'DetailAgOperate',
          width: this.nowpx(0.2) + 'px',
          pinned: 'right'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      timePeriodStatus: false,
      checkDialogStatus: false
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  methods: {
    statusText (p) {
      const time = p.cr_year + '-' + p.cr_month + '-' + p.cr_day + ' ' + p.cr_start_hour + ':' + p.cr_start_minutes
      const yyTiem = date.formatDate(new Date(time), 'X')
      const nowTime = date.formatDate(new Date(), 'X')
      if (yyTiem < nowTime) {
        return '已结束'
      } else if (parseInt(p.cr_status) == 1) {
        return '预约成功'
      } else if (parseInt(p.cr_status) == 2) {
        return '已换场'
      } else if (parseInt(p.cr_status) == 3) {
        return '已退款'
      } else if (parseInt(p.cr_status) == 4) {
        return '已核销'
      } else if (parseInt(p.cr_status) == 5) {
        return '申请退款中'
      }
      return '失效'
    },
    getList () {
      const obj = {
        timeStart: this.reserveData.prd_time_start,
        timeEnd: this.reserveData.prd_time_end,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('cdyy/getRecordData', obj)
        .then((res) => {
          this.reserveList = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    clearBut () {
      this.reserveData.prp_name = ''
      this.reserveData.prd_time_start = ''
      this.reserveData.prd_time_end = ''
      this.reserveData.prd_status = ''
      this.getList()
    },
    showAddReserve (id) {
      this.addReserveStatus = true
      this.$nextTick(() => {
        this.$refs.addReserveRef.init(id)
      })
    },
    changeTimePeriod (id) {
      this.timePeriodStatus = true
      this.$nextTick(() => {
        this.$refs.timePeriodRef.init(id)
      })
    },
    openCheckDialog () {
      this.checkDialogStatus = true
      this.$nextTick(() => {
        this.$refs.checkRecordDialogRef.init()
      })
    },

    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },
    // 关闭弹窗执行
    getDataList () {
      this.addReserveStatus = false
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
