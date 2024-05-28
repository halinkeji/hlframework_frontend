<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-x-sm items-center">
        <!-- <div class="col-2">
          总额: <span class="text-h6 q-px-xs text-weight-bold text-red"> {{ formatAmount(withdrawBalance.allAmount)/100 }} </span>
        </div>
        <div class="col-2">
          冻结额: <span class="text-h6 q-px-xs text-weight-bold text-red">{{ formatAmount(withdrawBalance.freezenAmount)/100 }} </span>
        </div>
        <div class="col-2">
          可提现: <span class="text-h6 q-px-xs text-weight-bold text-red">{{ formatAmount(formatAmount(withdrawBalance.allAmount - withdrawBalance.freezenAmount)/100) }} </span>
        </div> -->
        <q-input class="col-12 col-md-2 q-mt-sm" label="请输入云商通单据号" outlined v-model="searchFrom.order_no" dense />
        <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" class=" col-12 col-md-1 q-mt-sm" unelevated label="重置" />
        <!-- <q-btn color="red" class="col-12 col-md-1 q-mt-sm" unelevated label="提现" @click="clickWithdraw" /> -->
        <q-btn color="red" class="col-12 col-md-1 q-mt-sm" unelevated label="对账文件" @click="getAccountFile" />
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="payRecordData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
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
export default {
  name: 'allinpayRecord',
  components: {},
  data () {
    return {
      context: null,
      components: {},
      gridOptions: {},
      payRecordData: [],

      columnDefs: [
        {
          headerName: '提现订单号',
          field: 'awl_order_no',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '用户ID',
          field: 'awl_biz_user_id',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '提现金额',
          field: 'awl_withdraw_amount',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      withdrawBalance: {},

      startTime: '',
      endTime: '',
      searchFrom: {
        order_no: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted () {},
  computed: {},
  created () {
    // this.getItem()
    this.getList()
    this.context = this
  },
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('allinpay/getItem').then((res) => {
        if (res.code == 200) {
          this.allinPayData = res.data ? res.data : {}
          this.getWithdrawBalance()
        }
      })
    },

    // // 可提现金额
    // getWithdrawBalance () {
    //   this.$store
    //     .dispatch('allinpay/withdrawBalance', {
    //       bizUserId: this.allinPayData.pac_biz_user_id,
    //       accountSetNo: '400193'
    //     })
    //     .then((res) => {
    //       if (res.code == 200) {
    //         this.withdrawBalance = res.data ? res.data : {}
    //       }
    //     })
    // },

    getList () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.searchFrom.startTime = startTime
      this.searchFrom.endTime = endTime
      const obj = {
        ...this.searchFrom,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('allinpay/getLogData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.payRecordData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },

    clickWithdraw () {
      this.$q
        .dialog({
          title: '提现操作',
          message: '请输入提现金额，提现金额不能大于可提现金额',
          prompt: {
            model: '',
            type: 'text'
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          this.$store
            .dispatch('allinpay/withdrawOperate', {
              bizUserId: this.allinPayData.pac_biz_user_id,
              accountSetNo: '400193',
              amount: data
            })
            .then((res) => {
              if (res.code == 200) {
                if (res.data && res.data.subCode == 'OK') {
                  this.getList()
                  this.getWithdrawBalance()
                  this.$q.notify({
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    message: '成功',
                    caption: res.data.subMsg,
                    color: 'green'
                  })
                } else {
                  this.$q.notify({
                    message: '失败',
                    caption: res.data.subMsg,
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'red'
                  })
                }
              }
            })
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },

    getAccountFile () {
      this.$store.dispatch('allinpay/getAccountFile', {
        bizUserId: this.allinPayData.pac_biz_user_id
      }).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.subCode == 'OK') {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: res.data.subMsg,
              color: 'green'
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.data.subMsg,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        }
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    clearnBut () {
      this.searchQuery = ''
      this.getList()
      this.dataListSelections = {}
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
