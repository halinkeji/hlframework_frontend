<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <shift-count @getPeriod="init" />
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
        @first-data-rendered="onFirstDataRendered"
        :rowData="debtData"
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
  </div>
</template>

<script>
import ShiftCount from '../../count.vue'
export default {
  name: 'DebtCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 0
      },
      gridOptions: {},
      debtData: [],
      columnDefs: [
        {
          headerName: '真实姓名',
          field: 'odr_member_real_name',
          width: this.nowpx(0.25) + 'px'
        },

        {
          headerName: '昵称',
          field: 'odr_member_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '手机号',
          field: 'odr_member_mobile',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '卡号',
          field: 'odr_member_card_num',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '总欠款',
          field: 'debts',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '总还款',
          field: 'repay',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '总未还',
          field: 'undebts',
          width: this.nowpx(0.25) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      startTime: '',
      endTime: ''
    }
  },
  created () {},

  mounted () {

  },
  computed: {},
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
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getDebtCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.debtData = res.data ? res.data : []
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
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0.0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
