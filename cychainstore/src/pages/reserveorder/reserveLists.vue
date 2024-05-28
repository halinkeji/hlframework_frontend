<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="row q-gutter-sm q-pa-sm">
        <div class="col-auto">
          <q-input outlined dense v-model="queryInfo" label="预约人姓名/预约人手机号" />
        </div>
        <div class="col-auto">
          <q-input outlined dense v-model="queryText" label="会员名称/会员卡号" />
        </div>
        <div class="col-1">
          <q-select outlined dense v-model="deskId" :options="deskData" label="请选择餐桌"  option-value="id" option-label="dp_name" emit-value map-options />
        </div>

        <div class="col-1">
          <q-select outlined dense v-model="statusId" :options="statusOptions" label="预约状态" emit-value map-options />
        </div>
        <div class="col-auto">
          <q-input  outlined readonly dense v-model="startTime" label="到店时间开始时间">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm">
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
        <div class="col-auto">
          <q-input  outlined readonly dense label="到店时间结束时间" v-model="endTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm">
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
        <q-btn unelevated color="primary"  label="查询"  @click="getList" />
        <q-btn unelevated color="grey"  label="重置" @click="clearBtn"  />

      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
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
        :floatingFilter="false"
        @first-data-rendered="onFirstDataRendered"
        :enableCellTextSelection="true"
        rowHeight="40"
        :context="context"
        :localeText="localeText"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :suppressRowTransform="true"
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
    <reserve-detail ref="reserveDetailRef" v-if="reserveDetailStatus" @dataList="getList" />
    <add-reserve ref="reserveEditRef" v-if="reserveEditStatus" @dataList="getList" />
  </div>
</template>
<script>
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
import ReserveDetail from './components/ReserveDetail'
import AddReserve from './AddReserve'

export default {
  name: 'reserveLists',
  components: { AgStatus, AgOperate, ReserveDetail, AddReserve },
  data () {
    return {
      reserveDetailStatus: false,
      deskId: '',
      typeId: '',
      statusId: '',
      queryInfo: '',
      queryText: '',
      startTime: '',
      endTime: '',
      context: null,
      gridOptions: {},
      deskData: [],
      reserveList: [],

      statusOptions: [
        { label: '未接单', value: 1 },
        { label: '已接单', value: 2 },
        { label: '已完成', value: 3 },
        { label: '已撤销', value: 4 }
      ],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '预约餐桌',
          field: 'desk.dp_name',
          width: this.nowpx(0.08) + 'px',
          valueGetter (p) {
            if (parseInt(p.data.drr_desk_id) > 0) {
              return p.data.desk && p.data.desk.dp_name ? p.data.desk.dp_name : ''
            } else {
              return '到店分配'
            }
          }
        },
        {
          headerName: '到店时间',
          width: this.nowpx(0.1) + 'px',
          valueGetter: this.formatTimeDate
        },
        {
          headerName: '预约人姓名',
          field: 'drr_people_name',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '预约人手机号',
          field: 'drr_people_mobile',
          width: this.nowpx(0.07) + 'px'
        },

        // {
        //   headerName: '会员姓名',
        //   field: 'mem_memberName',
        //   width: this.nowpx(0.07) + 'px'
        // },
        // {
        //   headerName: '会员卡号',
        //   field: 'mem_memberCardNum',
        //   width: this.nowpx(0.07) + 'px'
        // },
        // {
        //   headerName: '会员手机号',
        //   field: 'mem_memberMobile',
        //   width: this.nowpx(0.07) + 'px'
        // },

        {
          headerName: '状态',
          width: this.nowpx(0.07) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.14) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      reserveEditStatus: false
    }
  },
  created () {
    this.getList()
    this.getDeskList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    formatTimeDate (p) {
      if (p.data.drr_start_date) {
        return this.$q_date.formatDate(p.data.drr_start_date * 1000, 'YYYY-MM-DD HH:mm')
      }
    },
    getList () {
      let startTime = null
      if (this.startTime) {
        startTime = new Date(this.startTime).getTime() / 1000
      }
      let endTime = null
      if (this.endTime) {
        endTime = new Date(this.endTime).getTime() / 1000
      }
      const obj = {
        deskId: this.deskId,
        typeId: this.typeId,
        status: this.statusId,
        queryInfo: this.queryInfo,
        queryText: this.queryText,
        startTime: startTime,
        endTime: endTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('reserveorder/getReserveData', obj)
        .then((res) => {
          this.reserveList = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getDeskList () {
      this.$store
        .dispatch('consumeorder/getDeskList')
        .then((res) => {
          if (res.code == 200) {
            this.deskData = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    clearBtn () {
      this.deskId = ''
      this.typeId = ''
      this.statusId = ''
      this.queryInfo = ''
      this.queryText = ''
      this.startTime = ''
      this.endTime = ''
      this.getList()
    },
    showReserveDetail (id) {
      this.reserveDetailStatus = true
      this.$nextTick(() => {
        this.$refs.reserveDetailRef.init(id)
      })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },

    addReserveDialog () {
      this.reserveEditStatus = true
      this.$nextTick(() => {
        this.$refs.reserveEditRef.init()
      })
    }
  }
}
</script>
