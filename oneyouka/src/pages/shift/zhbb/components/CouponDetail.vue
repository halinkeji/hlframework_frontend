<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <shift-date @getPeriod="init" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-white">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        :rowData="couponListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :suppressRowTransform="true"
        :localeText="localeText"
        :context="context"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import ShiftDate from '../../time.vue'
export default {
  name: 'CouponDetail',
  components: {
    ShiftDate
  },
  data () {
    return {
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      gridOptions: {},
      couponListData: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '核销码',
          field: 'cmd_verificationCode',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '优惠券',
          field: 'coupon.cou_title',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '姓名',
          field: 'member.mem_memberRealName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员昵称',
          filter: false,
          field: 'member.mem_memberName',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '电话',
          filter: false,
          field: 'member.mem_memberMobile',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '派发时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '领取时间',
          field: 'cmd_memberreceivetime',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.cmd_memberreceivetime * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '使用时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.cmd_memberusetime * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      startTime: '',
      endTime: ''
    }
  },
  created () {},
  computed: {},
  mounted () {

  },
  methods: {
    init (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.$nextTick(() => {
        this.getSummaryList()
      })
    },
    // 获取汇总数据
    getSummaryList () {
      const obj = {
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getCouponList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.couponListData = res.data.list
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
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
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getSummaryList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getSummaryList()
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
    }
  }
}
</script>

<style></style>
