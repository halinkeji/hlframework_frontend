<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-xs row q-pt-sm">
      <div class="col-4" v-if="is_main_store">
        <q-select
          label="查询门店"
          use-chips
          clearable
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          :options="libInStoreList"
        />
      </div>
      <div class="col-2">
         <q-input outlined dense  v-model="memberText" label="员工姓名" />
      </div>

      <q-btn color="primary"  unelevated @click="getList" label="搜索" />
      <q-btn color="warning" @click="clearButton"  unelevated label="重置" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
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
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Record',
  components: { },
  data () {
    return {
      context: '',
      recordDetailStatus: false,
      memberText: '',
      gridOptions: {},
      openCardRecord: [],
      columnDefs: [
        {
          headerName: '员工姓名',
          field: 'prr_reward_user_name',

          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '员工职位',
          field: 'position.prp_name',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '开卡数量',
          field: 'prr_open_card_number',

          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '开卡绩效',
          field: 'prr_open_card_reward_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '消费绩效',
          field: 'prr_consume_reward_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '标签绩效',
          field: 'prr_label_reward_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '总绩效',
          field: 'prr_total_reward_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '结算周期',
          field: 'prr_consume_reward_amount',
          valueGetter: (p) => {
            return (
              this.$q_date.formatDate(p.data.prr_start_time * 1000, 'YYYY-MM-DD HH:mm:ss') +
              '至' +
              this.$q_date.formatDate(p.data.prr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            )
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '结算时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.13) + 'px'
        }

      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.context = this

    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      const obj = {
        memberText: this.memberText,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('rewardPosition/getRecordList', obj)
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
      this.memberText = ''
      this.selectStoreData = []
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
    }, // 表格宽度自适应
    showDetail (val) {
      this.recordDetailStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.recordDetailRef.getUser(val)
        }, 500)
      })
    }
  }
}
</script>
