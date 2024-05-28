<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
      <div class="col-12 col-md-3">
        <q-input label="可搜索:核销码" outlined v-model="searchQuery" dense />
      </div>

      <q-btn color="primary" unelevated label="搜索" @click="getNotUseCouponList" />
      <q-btn color="warning" unelevated label="重置" @click="clean" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="notUseCouponData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="50"
        :floatingFilter="false"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :enableCellTextSelection="true"
        :localeText="localeText"
        @gridReady="onFirstDataRendered"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center">
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
import AgStatusChip from './AgStatusChip.vue'
export default {
  name: 'CouponList',
  props: ['currentMemberId'],
  components: {
    AgStatusChip
  },
  data () {
    return {
      startTime: '',
      endTime: '',
      // end
      notUseCouponData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },

      components: {
        AgStatusChip
      },
      columnDefs: [
        // 表格列数据
        {
          headerName: '核销码',
          field: 'cmd_verificationCode',
          pinned: 'left',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '优惠券',
          field: 'coupon.cou_title',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '使用状态',
          field: 'cmd_status',
          filter: false,
          cellRendererFramework: 'AgStatusChip',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '生效时间',
          valueGetter: (p) => {
            if (p.data.cmd_memberreceivetime) {
              return this.$q_date.formatDate(p.data.cmd_memberreceivetime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }

            return ''
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '到期时间',
          field: 'cmd_activityendtime',
          valueGetter: (p) => {
            if (p.data.cmd_activityendtime) {
              return this.$q_date.formatDate(p.data.cmd_activityendtime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }

            return ''
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '使用时间',
          valueGetter: (p) => {
            if (p.data.cmd_memberusetime) {
              return this.$q_date.formatDate(p.data.cmd_memberusetime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }
            return ''
          },
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
      gridOptions: {},
      searchQuery: '',
      localeText: this.$ag_grid_localeText
    }
  },
  computed: {},
  created () {
    this.getNotUseCouponList()
  },
  mounted () {},
  methods: {
    getNotUseCouponList () {
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        status: [1, 2, 3, 4],
        pageIndex: this.page.pageIndex,
        currentMemberId: this.currentMemberId
      }
      this.$store
        .dispatch('hlCoupon/couponCheckList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.notUseCouponData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getNotUseCouponList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getNotUseCouponList()
    },
    clean () {
      this.searchQuery = ''
      this.startTime = ''
      this.endTime = ''
      this.getNotUseCouponList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
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
