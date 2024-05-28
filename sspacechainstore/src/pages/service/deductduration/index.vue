<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <hl-card-reading ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
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
        <div class="row q-px-sm q-mt-sm q-gutter-md">
          <div class="col-6 col-md-2 q-pa-xs">
            本次扣除:
            <span class="text-h4 text-orange"> {{ deductTimes }}</span>
          </div>
          <div class="col-6 col-md-2 q-pa-xs">
            超时价格:
            <span class="text-orange">{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span>
            <span class="text-h4 text-orange"> {{ totalAmount }}</span>
          </div>
          <div class="col-6 col-md-2 q-pa-xs">
            超时时长:
            <span class="text-h4 text-orange"> {{ beMinute }}</span>
          </div>

          <div class="col-12 col-md-1 q-pa-xs flex flex-center">
            <q-checkbox dense v-model="printInvoiceStatus" label="打印小票" color="blue-8" />
            <q-btn round flat icon="ion-help-circle" color="warning">
              <q-tooltip content-class="bg-red" :offset="[10, 10]">
                <q-icon name="ion-warning"> </q-icon>超时结算=超时时长(分钟) * 商品单价<br />
                <q-icon name="ion-warning"> </q-icon>点击表格内，扣除时间列编辑扣除的时长<br />
                <q-icon name="ion-warning"> </q-icon>勾选打印小票选项，小票打印机将打印计次消费小票
              </q-tooltip>
            </q-btn>
          </div>
          <q-space />
          <q-btn unelevated color="amber-8" class="q-px-lg" @click="refreshButton()" :disable="memberId == 0" label="重置" icon="ion-refresh" />
          <q-btn
            unelevated
            color="blue-6"
            v-if="beMinute > 0"
            class="q-px-lg"
            label="超时结算"
            @click="openCheckoutCounterPage"
            :disable="deductTimes > 0 ? false : true"
            icon="las la-chevron-circle-down"
          />
          <q-btn
            unelevated
            color="red-6"
            v-if="deductTimes > timeoutCount"
            class="q-px-lg"
            label="扣时"
            @click="deductionButton"
            :disable="deductTimes > 0 ? false : true"
            icon="las la-minus-circle"
          />
        </div>
      </div>
      <hl-local-printer ref="localPrinterRef" />
      <hl-checkout
        @closeCheckoutPopup="closeCheckoutPopup"
        @paySuccessCallBack="paySuccessCallBack"
        ref="openCheckoutCounterPage"
        v-if="checkoutPageReceive"
      ></hl-checkout>
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
          },

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
          width: this.nowpx(0.1) + 'px',
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
          headerName: '结束时间',
          field: 'mrt_end_counting',
          valueGetter: (p) => {
            if (p.data.mrt_end_counting) {
              return this.$q_date.formatDate(p.data.mrt_end_counting * 1000, 'YYYY-MM-DD HH:mm:ss')
            } else {
              return ''
            }
          },
          width: this.nowpx(0.1) + 'px',
          filter: false
        },

        {
          headerName: '到期时间',
          field: 'mtr_end_time',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: this.expireDate
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
      timeoutCount: 0
    }
  },

  created () {},
  mounted () {
    this.context = this
  },
  computed: {},
  methods: {
    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.getListData()
        }
      } else {
        this.refreshButton()
      }
    },
    // 获取时卡列表
    getListData () {
      const obj = {
        mId: this.memberId
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
    // 扣时
    deductionButton () {
      const params = {
        mId: this.memberId,
        printInvoiceStatus: this.printInvoiceStatus,
        deductTimeList: this.deductTimeList
      }
      this.$store
        .dispatch('deductDuration/addinvoice', params)
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data.errorArray.length > 0) {
              res.data.errorArray.forEach((i, k) => {
                this.$q.notify({
                  progress: true,
                  position: 'top',
                  color: 'white',
                  textColor: 'primary',
                  message: i,
                  multiLine: true,
                  timeout: 3500
                })
              })
            } else {
              this.$q.notify({
                message: '成功',
                caption: '计时消费成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
            }
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            if (this.beMinute > 0) {
              this.openCheckoutCounterPage()
            }
            this.$nextTick(() => {
              this.totalCountData()
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: '计时消费失败，请重新操作！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
          this.refreshButton()
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
    closeCheckoutPopup () {
      this.checkoutPageReceive = false
    },
    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false
      this.$store
        .dispatch('deductDuration/addinvoiced', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '增加计时成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.refreshButton()
          } else {
            this.$q.notify({
              message: '失败',
              caption: '操作失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
          this.refreshButton()
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

    openCheckoutCounterPage () {
      const amountsPayable = this.totalAmount
      this.checkoutPageReceive = true
      const return_param = {
        deductTimeList: this.deductTimeList
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('addDuration', amountsPayable, parseInt(this.memberId), return_param)
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

<style lang="scss"></style>
