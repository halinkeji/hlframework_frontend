<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md text-subtitle2 q-mb-xs">
      <shift-date @getPeriod="init" />
      <div class="row q-mt-xs q-gutter-xs">
        <div class="col-12 col-md-3">
          <q-input label="可搜索:会员卡号/手机号/昵称/姓名" outlined v-model="memberText" dense />
        </div>
        <q-btn @click="getSummaryList()" color="primary" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" unelevated label="重置" />
      </div>
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
  name: 'DebtDetail',
  components: { ShiftDate },
  data () {
    return {
      memberText: '',
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      gridOptions: {},
      debtData: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '单据号',
          field: 'odr_invoice_code'
        },
        {
          headerName: '姓名',
          field: 'odr_member_real_name'
        },
        {
          headerName: '昵称',
          field: 'odr_member_name'
        },

        {
          headerName: '卡号',
          field: 'odr_member_card_num'
        },
        {
          headerName: '手机号',
          field: 'odr_member_mobile'
        },
        {
          headerName: '类型',
          field: 'odr_consume_type_name'
        },
        {
          headerName: '类型',
          field: 'odr_debt_type',
          valueGetter: (p) => {
            if (parseInt(p.data.odr_debt_type) == 1) {
              return '欠款'
            } else {
              return '还款'
            }
          }
        },
        {
          headerName: '金额',
          field: 'odr_debt_amount'
        },
        {
          headerName: '欠款时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          }
        },
        {
          headerName: '还款时间',
          field: 'created_at',
          valueGetter: (p) => {
            if (p.data.odr_repayment_time) {
              return this.$q_date.formatDate(p.data.odr_repayment_time * 1000, 'YYYY-MM-DD HH:mm')
            }
          }
        },
        {
          headerName: '操作员',
          field: 'user.username'
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
        name: this.memberText,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getDebtList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.debtData = res.data.list
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
    resetBut () {
      this.memberText = ''
      this.getSummaryList()
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
