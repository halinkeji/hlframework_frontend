<template>
    <!-- 未开单弹窗 -->
  <q-dialog seamless position="right" v-model="currentDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
      }"
      class="full-height no-wrap"
    >
      <div class="row q-pa-sm items-center">
       {{  currentRoomName }}
        <q-space />
        <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="colseNotOpenRoomDialog"></q-btn>
      </div>
      <q-separator />
      <div class="flex flex-center q-px-xl q-mt-xl">

      </div>
    </q-card>
  </q-dialog>
</template>
<script>

export default {
  name: 'RoomReserve',
  components: { },
  data () {
    return {
      currentDialogStatus: false,
      currentRoomId: 0,
      currentRoomData: {},
      currentRoomName: ''
    }
  },
  mounted () {},
  created () {

  },
  computed: {},
  methods: {
    init (currentRoomId, currentRoomData, currentRoomName) {
      this.currentDialogStatus = true
      this.currentRoomId = currentRoomId
      this.currentRoomData = currentRoomData
      this.currentRoomName = currentRoomName
    },
    // 获取房间分组
    getRoomGroupData () {
      this.$store
        .dispatch('roomManage/getRoomGroupDataList')
        .then((res) => {
          if (res.code == 200) {
            this.roomGroupList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 更改房间分组
    changeGroupData (id) {
      this.currentRoomGroupId = id
      this.$nextTick(() => {
        this.getRoomDataList()
      })
    },
    // 获取房间列表
    getRoomDataList () {
      const params = {
        room_group_id: this.currentRoomGroupId
      }
      this.$store
        .dispatch('roomManage/getRoomTableDataList', params)
        .then((res) => {
          if (res.code == 200) {
            this.roomTableDataListData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 获取员工
    rewardUserList () {
      const params = {}
      this.$store
        .dispatch('commonReward/getStaffUserLists', params)
        .then((res) => {
          if (res.code == 200) {
            this.rewardListData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 获取计费
    getChargeRuleList () {
      const params = {}
      this.$store
        .dispatch('chargeRule/getChargeRuleList', params)
        .then((res) => {
          if (res.code == 200) {
            this.chargeRuleListData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 关闭使用中房间详情弹窗
    colseRoomDialog () {
      this.drawerDetail = false
      this.currentRoomId = 0
      this.currentRoomData = {}
    },
    // 关闭清洁详情弹窗
    colseMaintainRoomDetailDialog () {
      this.maintainDetailDialogStatus = false
      this.currentRoomId = 0
      this.currentRoomData = {}
    },

    // 选择房间
    checkRoomData (item) {
      this.currentRoomId = item.id
      this.currentRoomData = item
      if (parseInt(item.qrt_status) == 2) {
        this.selectRoomObject(item)
      } else if (parseInt(item.qrt_status) == 1) {
        this.drawerDetail = false
        this.maintainDetailDialogStatus = false
        this.notOpenRoom = true
      } else if (parseInt(item.qrt_status) == 3) {
        this.notOpenRoom = false
        this.maintainDetailDialogStatus = true
      } else if (parseInt(item.qrt_status) == 4) {
        this.selectRoomObject(item)
      }
    },

    // 关闭未开台弹窗
    colseNotOpenRoomDialog () {
      this.notOpenRoom = false
      this.currentRoomId = 0
      this.currentRoomData = {}
    },

    // 打开清洁信息填写弹窗
    maintainOperate () {
      this.maintainDialogStatus = true
    },

    // 更新房间状态（开始维修）
    updateRoomData () {
      const params = {
        ...this.roomData,
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomConsume/saveMaintainData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '清洁操作成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.notOpenRoom = false
            this.maintainDialogStatus = false
            this.getRoomDataList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 结束维修
    overMaintainOperate () {
      const params = {
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomConsume/overMaintainOperate', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '完成清洁',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.notOpenRoom = false
            this.maintainDialogStatus = false
            this.maintainDetailDialogStatus = false
            this.currentRoomId = 0
            this.currentRoomData = {}

            this.getRoomDataList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 转换时间差为时分秒
    maintainTimeText (currentTime) {
      if (currentTime > 0) {
        let text = ''
        const t = this.$q_date.formatDate(new Date(), 'X') - currentTime
        let h = parseInt((t / 60 / 60))
        let m = parseInt(((t - h * 60 * 60) / 60))
        let s = parseInt(t % 60)
        // 三元表达式 补零 如果小于10 则在前边进行补零 如果大于10 则不需要补零
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        if (h > 0) {
          text += this.formatAmount(h) + '小时'
        }
        if (m > 0) {
          text += this.formatAmount(m) + '分钟'
        }
        if (h <= 0 && m <= 0) {
          text += parseInt(s) + '秒'
        }
        return text
      }
    },

    // 开台
    openRoomConsume () {
      this.openRoomConsumeDialog = true

      this.consumeDetailForm.scb_room_group_id = this.currentRoomData.qrt_room_group_id

      this.consumeDetailForm.scb_room_table_id = this.currentRoomId

      this.consumeDetailForm.scb_create_time = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')

      this.consumeDetailForm.scb_people_number = this.currentRoomData.qrt_people_number
    },

    // 读卡
    getMemberInfo (item) {
      this.consumeDetailForm.scb_member_id = item.id
      this.consumeDetailForm.scb_member_nickname = item.mem_memberName
      this.consumeDetailForm.scb_member_card_number = item.mem_memberCardNum
      this.consumeDetailForm.scb_member_phone_number = item.mem_memberMobile
    },

    // 关闭开单页面
    closeOpenRoomDialog () {
      this.openRoomConsumeDialog = false
    },

    // 开单
    setOpenRoomConsume () {
      this.consumeDetailForm.scb_create_time = this.$q_date.formatDate(this.consumeDetailForm.scb_create_time, 'X')
      const params = {
        ...this.consumeDetailForm,
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomConsume/setConsumeData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '开台成功，已开始计时',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.notOpenRoom = false
            this.maintainDialogStatus = false
            this.openRoomConsumeDialog = false

            this.getRoomDataList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 获取开单详情
    selectRoomObject () {
      const params = {
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomConsume/getRoomDetail', params)
        .then((res) => {
          if (res.code == 200) {
            this.drawerDetail = true
            this.currentConsumeData = res.data

            this.$nextTick(() => {
              this.sumShoppingTotalAmount()
            })
            // this.currentRoomId = item.id
            // this.currentRoomData = item
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
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 增加消费
    openGoodsConsume () {
      this.goodsConsumeDialogStatus = true
      this.$nextTick(() => {
        this.$refs.goodsConsumeRef.openInit(this.currentRoomId)
      })
    },

    // 增加消费成功
    colseConsumeDialog () {
      this.goodsConsumeDialogStatus = false
      this.$nextTick(() => {
        this.selectRoomObject()
      })
    },

    // 删除购物车信息
    delShoppingCarData (item) {
      const obj = {
        buff_id: item.id
      }
      this.$store.dispatch('roomConsume/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除' + res.message + '条数据',
            icon: 'ion-checkmark-circle-outline',
            color: 'green',
            position: 'top-right',
            timeout: 500
          })
          this.selectedShoppingCarInfo = {}

          this.selectRoomObject()
        } else {
          this.$q.notify({
            message: '失败',
            caption: res.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        }
      })
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    openCheckoutCounterPage () {
      const amountsPayable = this.goodsShoppingTotalAmount
      this.checkoutPageReceive = true
      const return_param = {
        ...this.consumeDetailForm,
        currentRoomId: this.currentRoomId
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('roomConsume', amountsPayable, parseInt(this.currentConsumeData.scb_member_id), return_param)
      })
    },

    sumShoppingTotalAmount () {
      if (this.currentConsumeData && this.currentConsumeData.goodsShoppingList) {
        this.currentConsumeData.goodsShoppingList.forEach((item, key) => {
          this.goodsShoppingTotalAmount += this.formatAmount(item.cgb_totalPrice)
        })
      }
    },

    paySuccessCallBack (v) {
      this.openCheckoutPageIf = false
      this.$store
        .dispatch('roomConsume/orderSettle', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.resetCurrentPage()
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '结账错误',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },
    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },

    resetCurrentPage () {
      this.goodsConsumeDialogStatus = false
      this.checkoutPageReceive = false

      this.maintainDetailDialogStatus = false
      this.yuyueDialogStatus = false
      this.openRoomConsumeDialog = false
      this.currentRoomGroupId = 0
      this.currentConsumeData = {}

      this.currentRoomData = {}
    }

  }
}
</script>
