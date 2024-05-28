<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <shift-date @getPeriod="init" />
    </div>
    <div class="col-shrink q-pa-sm full-height bg-white">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        :rowData="kzlsData"
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
        @first-data-rendered="onFirstDataRendered"
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
  name: 'KzlsDetail',
  components: { ShiftDate },
  data () {
    return {
      startTime: '',
      endTime: '',
      couponsType: '',
      searchFrom: {
        sc_consumeType: [],
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: ''
      },
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      gridOptions: {},
      kzlsData: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '类型名称',
          field: 'pkr_group_name',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '开支项名称',
          field: 'pkr_item_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '类型',
          field: 'pkr_status',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return p.data.pkr_status == 1 ? '开支' : '收入'
          }
        },
        {
          headerName: '金额',
          field: 'pkr_price',
          filter: false,
          valueGetter: (p) => {
            return this.formatAmount(p.data.pkr_price)
          },
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        }
      ],
      localeText: this.$ag_grid_localeText
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
        .dispatch('shift/getKzlsList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.kzlsData = res.data ? res.data.list : []
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
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style></style>
