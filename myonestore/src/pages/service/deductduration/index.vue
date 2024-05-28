<template>
  <q-page class="fit row no-wrap justify-between items-stretch content-stretch">
    <div class="col-shrink col-xs-10 col-sm-11 col-md-11 col-lg-11 col-xl-11">
      <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink  bg-white q-px-xs q-pb-md">
          <q-item class="q-mb-sm">
            <q-item-section avatar>
              <q-avatar v-if="currentMemberInfo.coverImage && currentMemberInfo.coverImage.id" text-color="white">
                <img :src="$q.localStorage.getItem('myonestore_system_local').attach_url + currentMemberInfo.coverImage.path" />
              </q-avatar>
              <q-avatar color="grey" text-color="white" v-else icon="person" />
            </q-item-section>

            <q-item-section v-if="currentMemberInfo.id">
              <q-item-label>{{ currentMemberInfo.mem_memberName }}</q-item-label>
              <q-item-label caption lines="1">
                {{ currentMemberInfo.mem_memberCardNum }}({{
                  currentMemberInfo.memberLevel ? currentMemberInfo.memberLevel.mcl_level_name : '无等级'
                }})
              </q-item-label>
            </q-item-section>
            <q-item-section v-else>
              <q-item-label>请读卡</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn  unelevated class="full-width q-my-xs bg_cinnabar" v-if="!currentMemberInfo.id" @click="openReadingDialog">
                <span class="text-subtitle1 q-my-xs text-white">会员(m)</span>
              </q-btn>
              <q-btn color="negative" unelevated class="full-width q-my-xs" v-else @click="resetMemberInfo">
                <span class="text-subtitle1 q-my-xs">重置</span>
              </q-btn>
            </q-item-section>
          </q-item>
          <hl-dialog-card-reading ref="cardReadingRef" @refreshDataList="getMemberInfo" />
        </div>
        <div class="col-shrink bg-white q-px-xs full-height bg-grey-2 row">
          <div class="col-md-3 col-3" v-for="(item, key) in deductTimeList">
            <q-card bordered flat class="q-ma-sm">
              <q-card-section class="q-pa-xs">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ item.mtr_goods_name }}{{ item.mtr_spe_name ? '-' + item.mtr_spe_name : '' }}</q-item-label>
                    <q-item-label caption v-if="item.mtr_end_time >= 2147457847">
                      <span> 到期时间:永久有效 </span>
                    </q-item-label>
                    <q-item-label caption v-else>
                      <span> 到期时间:{{ $q_date.formatDate(item.mtr_end_time * 1000, 'YYYY-MM-DD ') }} </span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side class="text-h6 text-deep-orange">
                    <q-item-label>{{ item.mtr_duration }} <span class="text-caption">分</span>  </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-separator />
              <div class="con-example-images q-pa-xs">
                <q-input :disable="(item.mrt_start_counting > 0)" @input="numberDeductions(item)" outlined dense v-model="item.mtr_deduct_duration" label="扣除时长" />
              </div>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  unelevated
                  color="primary"
                  label="开始"
                  :disable="item.mrt_start_counting > 0 || item.mrt_end_counting > 0"
                  v-if="!(item.mrt_start_counting > 0)"
                  @click="startButton(item)"
                  class="full-width"
                />
                <!-- !(p.data.mrt_start_counting > 0)    class="q-mr-sm" -->
                <q-btn
                  unelevated
                  color="red-6"
                  label="结束"
                  :disable="item.mrt_end_counting > 0"
                  v-if="item.mrt_start_counting > 0"
                  @click="endButton(item)"
                  class="full-width"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <div class="row q-px-sm q-mt-sm q-gutter-md">
            <div class="col-6 col-md-2 q-pa-xs">
              本次扣除:
              <span class="text-h4 text-orange"> {{ deductTimes }}</span>
            </div>
            <div class="col-6 col-md-2 q-pa-xs">
              超时价格:
              <span class="text-orange">{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}</span>
              <span class="text-h4 text-orange"> {{ totalAmount }}</span>
            </div>
            <div class="col-6 col-md-2 q-pa-xs">
              超时时长:
              <span class="text-h4 text-orange"> {{ beMinute }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll   column justify-end">
      <q-space />
      <div>
        <q-checkbox dense v-model="printInvoiceStatus" label="打印小票" color="blue-8" />
        <q-btn round flat icon="ion-help-circle" color="warning">
          <q-tooltip content-class="bg-red" :offset="[10, 10]">
            <q-icon name="ion-warning"> </q-icon>超时结算=超时时长(分钟) * 商品单价<br />
            <q-icon name="ion-warning"> </q-icon>点击表格内，扣除时间列编辑扣除的时长<br />
            <q-icon name="ion-warning"> </q-icon>勾选打印小票选项，小票打印机将打印计次消费小票
          </q-tooltip>
        </q-btn>
      </div>

      <q-btn
        unelevated
        color="amber-8"
        class="full-width q-my-xs q-py-sm "
        padding="none"
        @click="refreshButton()"
        :disable="memberId == 0"
        icon="ion-refresh"
      >
        <span class="text-subtitle1 q-my-xs text-white">重置</span>
      </q-btn>
      <q-btn
        unelevated

        v-if="beMinute > 0"
        class="full-width q-my-xs q-py-sm bg_cinnabar"
        padding="none"
        @click="openCheckoutCounterPage"
        :disable="deductTimes > 0 ? false : true"
        icon="las la-chevron-circle-down"
      >
        <span class="text-subtitle1 q-my-xs text-white">超时结算</span>
      </q-btn>
      <q-btn
        unelevated
        v-if="deductTimes > timeoutCount"
        class="full-width q-my-xs q-py-sm bg_cinnabar text-white"
        padding="none"
        @click="rewardLabel"
        :disable="deductTimes > 0 ? false : true"
        icon="las la-minus-circle"
      >
        <span class="text-subtitle1 q-my-xs text-white">扣时</span>
      </q-btn>
    </div>
     <select-label v-if="labelVisible" ref="labelData" @getRewardLabel="getRewardLabel"></select-label>
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>
  </q-page>
</template>
<script>
import SelectLabel from 'src/pages/reward/label/SelectLabel.vue'
export default {
  name: 'deductDuration',
  components: {
    SelectLabel
  },
  data () {
    return {
      printInvoiceStatus: true,
      checkoutPageReceive: false,
      deductTimeList: [],
      memberId: 0,
      gridOptions: {},

      localeText: this.$ag_grid_localeText,
      context: null,
      deductTimes: 0,
      totalTime: 0,
      beMinute: 0,
      totalAmount: 0,
      timeoutCount: 0,
      currentMemberInfo: {},
      labelVisible: false,
      meiyeRewardData: []
    }
  },

  created () {},
  mounted () {
    this.context = this
  },
  computed: {},
  methods: {
    // 打开读卡界面
    openReadingDialog () {
      this.$nextTick(() => {
        this.$refs.cardReadingRef.openReaderDialog()
      })
    },
    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.currentMemberInfo = val
          this.getListData()
        }
      } else {
        this.refreshButton()
      }
    },
    // 重置会员卡
    resetMemberInfo () {
      this.$nextTick(() => {
        this.currentMemberInfo = {}
        this.goodsData = []
        this.getShoppingCartData()
      })
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
        meiyeRewardData: this.meiyeRewardData,
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

            if (this.beMinute > 0) {
              this.openCheckoutCounterPage()
            }
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
    numberDeductions (item) {
      const itemsToUpdate = []
      const data = item
      const regu = /^[0-9]*[0-9][0-9]*$/
      if (!regu.test(item.mtr_deduct_duration)) {
        this.$q.notify({
          message: '失败',
          caption: '请输入大于0的数',
          icon: 'ion-close-circle-outline',
          color: 'red',
          position: 'top-right'
        })
        data.mtr_deduct_duration = ''
      }
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
      this.currentMemberInfo = {}
      this.deductTimeList = []
      this.totalTimeData()
    },
    startButton (item) {
      item.mrt_start_counting = this.$q_date.formatDate(new Date(), 'X')
      const params = {
        mrt_start_counting: this.$q_date.formatDate(new Date(), 'X'),
        id: item.id,
        info: item
      }
      this.$store
        .dispatch('deductDuration/putnumber', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '开始计时成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            setTimeout(() => {
              this.getListData()
            }, 200)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    endButton (item) {
      const startTime = item.mrt_start_counting
      const endTime = this.$q_date.formatDate(new Date(), 'X')
      if (parseInt(endTime) - parseInt(startTime) >= 10) {
        const params = {
          mrt_end_counting: this.$q_date.formatDate(new Date(), 'X'),
          id: item.id,
          info: item
        }
        this.$store
          .dispatch('deductDuration/putnumber', params)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '结束计时成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              setTimeout(() => {
                this.getListData()
              }, 200)
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      } else {
        this.$q.notify({
          message: '失败',
          caption: '您操作的太快了！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
    },
    rewardLabel () {
      this.labelVisible = true
      this.$nextTick(() => {
        this.$refs.labelData.openStaffLabel(this.deductTimeList, 'deductDuration')
      })
    },
    getRewardLabel (val) {
      this.labelVisible = false
      this.meiyeRewardData = val
      setTimeout(() => {
        this.deductionButton()
      }, 500)
    }
  }
}
</script>

<style lang="scss"></style>
