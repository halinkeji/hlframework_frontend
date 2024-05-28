<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-x-sm items-center">
        <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="查询" />
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
    </div>
  </q-page>
</template>
<script>
import Operator from './AgOperator'
export default {
  name: 'allinpayUser',
  components: {
    Operator
  },
  data () {
    return {
      context: null,
      components: {},
      gridOptions: {},
      payRecordData: [],

      columnDefs: [
        {
          headerName: '用户ID',
          field: 'aup_biz_user_id',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '分润比例',
          field: 'aup_user_proportion',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '属性（2企业3个人）',
          field: 'aup_user_type',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.aup_user_type) == 2) {
              return '企业'
            } else if (parseInt(p.data.aup_user_type) == 3) {
              return '个人'
            }
          }
        },
        {
          headerName: '电话号',
          field: 'aup_merchant_phone',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '姓名',
          field: 'aup_user_real_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '银行卡号',
          field: 'aup_bank_card_number',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '全部余额',
          field: 'allAmount',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.allAmount / 100)
          }
        },
        {
          headerName: '冻结余额',
          field: 'freezenAmount',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.freezenAmount / 100)
          }
        },
        {
          headerName: '可提现金额',
          field: 'currentAmount',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.currentAmount / 100)
          }
        },

        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,

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
    this.getList()
    this.context = this
  },
  methods: {
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
        ...this.searchFrom
      }
      this.$store
        .dispatch('allinpay/getUserData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.payRecordData = res.data ? res.data : []
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
      this.$store
        .dispatch('allinpay/getAccountFile', {
          bizUserId: this.allinPayData.pac_biz_user_id
        })
        .then((res) => {
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
