<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 row  q-gutter-xs">

      <div class="col-12 col-md-2">
        <q-select  outlined dense v-model="reserveData.prd_status" :options="statusOptions" label="预约状态" emit-value map-options />
      </div>

      <div class="col-12 col-md-3" v-if="is_main_store">
        <q-select
          label="查询门店"
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

      <!-- <div class="col-12 col-md-2">
        <q-input  outlined readonly dense v-model="reserveData.prd_time_start" label="开始日期">
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
        <q-input  outlined readonly dense label="结束日期" v-model="reserveData.prd_time_end">
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
      </div> -->
      <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
      <q-btn unelevated color="grey" dense label="重置" @click="clearBut" class="q-px-md" />

    </div>

    <div class="col-shrink q-px-xs full-height ">
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
  </div>
</template>
<script>
import DetailAgOperate from './DetailAgOperate'
import AddReserve from './AddReserve'
import AgStatus from './AgStatus'
import AgMember from './AgMember'
export default {
  name: 'ReserveManage',
  components: { DetailAgOperate, AddReserve, AgStatus, AgMember },
  data () {
    return {
      components: { DetailAgOperate, AddReserve, AgStatus, AgMember },
      addReserveStatus: false,
      reserveData: {
        prp_name: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_status: ''
      },
      statusOptions: [
        { label: '未接单', value: 1 },
        { label: '已接单', value: 2 },
        { label: '已完成', value: 3 },
        { label: '已撤销', value: 4 },
        { label: '已过期', value: 5 }
      ],
      context: null,
      gridOptions: {},
      reserveList: [],
      columnDefs: [
        {
          headerName: '员工',
          field: 'user.pru_name',
          width: this.nowpx(0.11) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.prd_user_id) > 0) {
              return p.data.user && p.data.user.pru_name ? p.data.user.pru_name : ''
            } else {
              return '到店分配'
            }
          }
        },
        {
          headerName: '预约人姓名',
          field: 'prd_people_name',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '预约人手机号',
          field: 'prd_people_mobile',
          width: this.nowpx(0.11) + 'px'
        },

        {
          headerName: '预约日期',
          valueGetter: (p) => {
            return p.data.prd_time_year + '-' + p.data.prd_time_month + '-' + p.data.prd_time_day
          },
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '预约时间段',
          valueGetter: (p) => {
            return p.data.prd_time_hour + ':' + p.data.prd_time_minute
          },
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '会员昵称',
          field: 'prd_member_name',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'prd_member_mobile',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'prd_member_card_number',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '备注',
          field: 'prd_remark',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '新增时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.16) + 'px'
        },

        {
          headerName: '预约状态',
          cellRendererFramework: 'AgStatus',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'DetailAgOperate',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.getList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {},
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
    getList () {
      // if (this.reserveData.prd_time_start) {
      //   var timeStart = new Date(this.reserveData.prd_time_start).getTime() / 1000
      // }
      // if (this.reserveData.prd_time_end) {
      //   var timeEnd = new Date(this.reserveData.prd_time_end).getTime() / 1000
      // }
      const obj = {
        payStatus: 1,
        // timeStart: timeStart,
        // timeEnd: timeEnd,
        status: this.reserveData.prd_status,
        name: this.reserveData.prp_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('reserve/getReserveDetailData', obj)
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
      this.selectStoreData = []
      this.getList()
    },
    showAddReserve (id) {
      this.addReserveStatus = true
      this.$nextTick(() => {
        this.$refs.addReserveRef.init(id)
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
        params.api.sizeColumnsToFit()
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
