<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row ">
      <q-select
        class="col-12 col-md-2 q-mt-sm q-mr-sm"
        outlined
        option-value="value"
        option-label="label"
        emit-value
        map-options
        :options="consumeTypeData"
        v-model="searchFrom.consumeTypeData"
        dense
        label="选择单据类型"
      />
      <div class="col-12 col-md-3 q-mr-sm q-mt-sm">
        <q-input label="请输入单据号" outlined v-model="searchFrom.searchSerm" dense />
      </div>
      <div class="col-12 col-md-3 q-mt-sm q-mr-sm">
        <q-input label="请输入会员卡号|昵称" outlined v-model="searchFrom.memberText" dense />
      </div>
      <q-btn @click="getList()" color="primary" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="搜索" />
      <q-btn @click="resetButton()" color="warning" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="重置" />
    </div>
    <div class=" col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="consumRecord"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :localeText="localeText"
        :animateRows="false"
        :context="context"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
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
  </div>
</template>

<script>
export default {
  props: ['rewardData'],
  name: 'ConsumDetail',
  components: {},
  data () {
    return {
      type: this.$store.state.invoice.consumePayType,
      consumeTypeData: this.$store.state.invoice.consumeTypeData,
      startTime: '',
      endTime: '',
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
      isSidebarActiveLocal: true,
      context: '',
      gridOptions: {},
      consumRecord: [],
      columnDefs: [
        {
          headerName: '消费单号',
          field: 'sc_invoiceCode',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '消费类型',
          field: 'rcr_consume_type_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'rcr_member_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'rcr_member_card_num',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '绩效金额',
          field: 'rcr_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '应付金额',
          field: 'rcr_handle_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '实付金额',
          field: 'rcr_real_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '消费时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },

  created () {
    this.context = this
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const obj = {
        ...this.searchFrom,
        user_id: this.rewardData.prr_reward_user_id,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        startTime: this.rewardData.prr_start_time,
        endTime: this.rewardData.prr_end_time
      }
      this.$store
        .dispatch('commonReward/consumRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumRecord = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })

        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    resetButton () {
      this.searchFrom = {
        memberText: '',
        searchSerm: '',
        consumeTypeData: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    } // 表格宽度自适应
  }
}
</script>
