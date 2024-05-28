<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="usedCouponData"
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
export default {
  name: 'UsedCouponList',
  data () {
    return {
      usedStartTime: '',
      usedEndTime: '',
      usedCouponData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
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
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'mem_memberRealName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
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
          headerName: '使用时间',
          valueGetter: (p) => {
            if (p.data.cmd_memberusetime) {
              return this.$q_date.formatDate(p.data.cmd_memberusetime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }
            return ''
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '优惠金额',
          field: 'useRecord.cur_amount',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '过期时间',
          valueGetter: (p) => {
            if (p.data.cmd_activityendtime) {
              return this.$q_date.formatDate(p.data.cmd_activityendtime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }
            return ''
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
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
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  methods: {

    getUsedCouponList () {
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        status: 3,
        pageIndex: this.page.pageIndex,

        usedStartTime: this.startTime,
        usedEndTime: this.endTime,
        selectStoreData: this.storeId
      }
      this.$store
        .dispatch('hlCoupon/couponCheckList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.usedCouponData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getUsedCouponList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getUsedCouponList()
    },
    clean () {
      this.searchQuery = ''
      this.usedStartTime = ''
      this.usedEndTime = ''
      this.selectStoreData = []
      this.getUsedCouponList()
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-卡券已使用记录'
      })
    }
  }
}
</script>
