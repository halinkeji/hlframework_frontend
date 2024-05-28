<template>
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">

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

    </div>
</template>
<script>

export default {
  name: 'deductDuration',
  components: {
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
          headerName: '可用时长(分钟)',
          field: 'mtr_duration',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },

        {
          headerName: '到期时间',
          field: 'mtr_end_time',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: this.expireDate
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
      timeoutCount: 0
    }
  },

  created () {},
  mounted () {
    this.context = this
  },
  computed: {},
  methods: {
    init (memberId) {
      this.memberId = memberId
      this.$nextTick(() => {
        this.getListData()
      })
    },

    // 获取时卡列表
    getListData () {
      const obj = {
        mId: this.memberId,
        getType: 'all'
      }
      this.$store
        .dispatch('deductDuration/getListData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deductTimeList = res.data
            this.$nextTick(() => {
              this.totalTimeData()
            })
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

    totalTimeData () {
      this.totalAmount = 0
      let totalTime = 0
      let deductTimes = 0
      let beMinute = 0
      let goodsPrice = 0
      let timeoutCount = 0

      this.deductTimeList.forEach(function (item) {
        totalTime += parseInt(item.mtr_duration)
        deductTimes += parseInt(item.mtr_deduct_duration) > 0 ? parseInt(item.mtr_deduct_duration) : 0
        if (parseInt(item.mtr_deduct_duration) > parseInt(item.mtr_duration)) {
          beMinute += parseInt(item.mtr_deduct_duration) - parseInt(item.mtr_duration)
          timeoutCount += parseInt(item.mtr_deduct_duration)
          goodsPrice += (parseInt(item.mtr_deduct_duration) - parseInt(item.mtr_duration)) * item.mtr_selling_price
        }
      })
      this.deductTimes = deductTimes
      this.totalTime = totalTime
      this.beMinute = beMinute
      this.timeoutCount = timeoutCount
      this.totalAmount = this.formatAmount(this.formatAmount(goodsPrice) + this.formatAmount(this.totalAmount))
    },
    expireDate (p) {
      if (parseInt(p.data.mtr_end_time) >= 2147457847) {
        return '永久有效'
      } else {
        return this.$q_date.formatDate(p.data.mtr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    numberDeductions (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^[0-9]*[0-9][0-9]*$/
      if (!regu.test(p.data.mtr_deduct_duration)) {
        this.$q.notify({
          message: '失败',
          caption: '请输入大于0的数',
          icon: 'ion-close-circle-outline',
          color: 'red',
          position: 'top-right'
        })
        data.mtr_deduct_duration = ''
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
      this.$nextTick(() => {
        this.totalTimeData()
      })
    },

    // 列表列宽自适应
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
    },

    // 重置
    refreshButton () {
      this.memberId = 0
      this.totalAmount = 0
      this.beMinute = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
      this.deductTimeList = []
    }
  }
}
</script>
