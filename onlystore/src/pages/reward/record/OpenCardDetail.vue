<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm q-gutter-xs row">
      <q-input outlined dense class="col-12 col-xs-6 col-sm-2" v-model="member" label="会员卡号/手机号" />
      <q-btn color="primary" class="col-6 col-xs-3 col-sm-1" unelevated @click="getList" label="搜索" />
      <q-btn color="warning" @click="clearButton" class="col-6 col-xs-3 col-sm-1" unelevated label="重置" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="openCardRecord"
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
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rewardData'],
  name: 'OpenCardDetail',
  components: {},
  data () {
    return {
      context: '',
      member: '',
      gridOptions: {},
      openCardRecord: [],
      columnDefs: [
        {
          headerName: '会员卡号',
          field: 'omr_member_card_num',

          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'omr_member_name',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '会员电话',
          field: 'omr_member_mobile',

          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '引导奖励',
          field: 'omr_amount',

          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '注册时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  computed: {},
  created () {
    this.context = this
    this.getList()
  },
  mounted () {},
  methods: {
    getList () {
      const obj = {
        member: this.member,
        user_id: this.rewardData.prr_reward_user_id,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        startTime: this.rewardData.prr_start_time,
        endTime: this.rewardData.prr_end_time
      }
      this.$store
        .dispatch('commonReward/openCardRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.openCardRecord = res.data ? res.data.list : []
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
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearButton () {
      this.member = ''
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
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
    } // 表格宽度自适应
  }
}
</script>
