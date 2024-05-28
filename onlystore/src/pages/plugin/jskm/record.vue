<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        计时列表
      </div>
      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="deductTimeList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="40"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :localeText="localeText"
          :context="context"
          :suppressCellSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.page"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgOperating from './components/AgOperating.vue'
export default {
  name: 'deductDuration',
  components: {
    AgOperating
  },
  data () {
    return {
      printInvoiceStatus: true,
      checkoutPageReceive: false,
      deductTimeList: [],
      memberId: 0,
      gridOptions: {},
      columnDefs: [
        {
          headerName: '消费项目',
          field: 'mtr_goods_name',
          filter: false,
          width: this.nowpx(0.3) + 'px',
          valueGetter: function (p) {
            return p.data.mtr_goods_name + (p.data.mtr_spe_name ? '-' + p.data.mtr_spe_name : '')
          }
        },
        {
          headerName: '商品单价',
          field: 'mtr_selling_price',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },
        {
          headerName: '电话号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },
        {
          headerName: '可用时长(分钟)',
          field: 'mtr_duration',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },
        {
          headerName: '扣除时长(分钟)',
          field: 'mtr_deduct_duration',
          filter: false,
          editable: (p) => {
            return !(p.data.mrt_start_counting > 0)
          }, // 单元表格是否可编辑

          width: this.nowpx(0.1) + 'px',
          onCellValueChanged: this.numberDeductions
        },
        {
          headerName: '已超时时长(分钟)',
          field: 'mrc_deductcount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (p.data.mtr_deduct_duration - p.data.mtr_duration > 0) {
              return this.formatAmount(p.data.mtr_deduct_duration - p.data.mtr_duration)
            } else {
              return ''
            }
          }
        },

        {
          headerName: '开始时间',
          field: 'mrt_start_counting',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (p.data.mrt_start_counting) {
              return this.$q_date.formatDate(p.data.mrt_start_counting * 1000, 'YYYY-MM-DD HH:mm:ss')
            } else {
              return ''
            }
          },
          filter: false
        },

        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperating',
          width: this.nowpx(0.11) + 'px'
        }
      ],

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },

      localeText: this.$ag_grid_localeText,
      context: null,
      deductTimes: 0,
      totalTime: 0,
      beMinute: 0,
      totalAmount: 0,
      timeoutCount: 0,
      page: {
        page: 1,
        pSize: 20,
        totalCount: 0
      }
    }
  },

  created () {},
  mounted () {
    this.context = this
    this.getListData()
  },
  computed: {},
  methods: {
    // 获取时卡列表
    getListData () {
      const obj = {
        ...this.page
      }

      this.$store
        .dispatch('jskm/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.deductTimeList = res.data.list
              this.page.totalCount = res.data.page.totalCount
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '注意',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
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
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.page = 1
      this.getListData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.page = val
      this.getListData()
    }
  }
}
</script>
