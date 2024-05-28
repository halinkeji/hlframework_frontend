<template>
  <q-page class="fit row no-wrap">
    <div :class="currentRoomId ? 'col-7' : 'col-12'" class="full-height column no-wrap">
      <div class="col-shrink">
        <q-card square flat class="bg-white">
          <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
            <q-tab name="all" label="全部" @click="changeGroupData()" />
            <q-tab :name="key" :label="item.qrg_name" v-for="(item, key) in roomGroupList" :key="key" @click="changeGroupData(item.id)" />
          </q-tabs>
          <q-space />
        </q-card>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="roomTableDataListData.length > 0">
        <q-scroll-area class="fit">
          <div class="row q-pb-xl">
            <div v-for="(item, key) in roomTableDataListData" :key="key" :class="currentRoomId ? 'col-3' : 'col-2'" class="q-pa-sm">
              <q-card
                @click="checkRoomData(item)"
                bordered
                :class="currentRoomId == item.id ? 'shadow-1' : 'no-shadow'"
                class="text-subtitle1 text-left text-grey-8 full-height cursor-pointer"
              >
                <q-card-section
                  class="text-left text-white q-py-sm"
                  :class="{
                    'bg-brown ': parseInt(item.qrt_status) == 4,
                    'bg-red ': parseInt(item.qrt_status) == 3,
                    'bg-primary ': parseInt(item.qrt_status) == 2,
                    'bg-blue-2 text-black': parseInt(item.qrt_status) == 1,
                  }"
                >
                  <div class="text-subtitle2 text-weight-bold row items-center">
                    {{ item.qrt_name }}( {{ item.qrt_people_number }}人 )
                    <q-space />

                    <q-space />

                    <q-chip dense class="text-dark" v-if="item.totalBookCount > 0">
                      <q-avatar color="orange" text-color="white">
                        <span class="text-weight-bold"> {{ item.totalBookCount }} </span>
                      </q-avatar>

                      预订
                      <q-tooltip>
                        <q-icon name="access_time" color="orange"></q-icon>
                        预订 ：{{ item.totalBookCount }} 场
                      </q-tooltip>
                    </q-chip>
                  </div>
                </q-card-section>

                <q-card-section class="text-center q-mb-xs" v-if="parseInt(item.qrt_status) == 2">
                  <div class="text-subtitle2 text-primary">使用中</div>
                  <div class="text-subtitle2">
                    总消费
                    <span class="text-subtitle1 text-weight-bold text-primary">
                      {{ formatAmount(formatAmount(item.scb_goods_total_amount) + formatAmount(item.scb_room_use_amount)) }}
                    </span>
                    元
                  </div>
                </q-card-section>

                <q-card-section class="text-center q-mb-xs" v-if="parseInt(item.qrt_status) == 1">
                  <div class="text-subtitle2 text-dark">空闲中</div>
                </q-card-section>

                <q-card-section class="text-center q-mb-xs" v-if="parseInt(item.qrt_status) == 3">
                  <div class="text-subtitle2 text-dark">清洁中</div>
                </q-card-section>

                <q-card-section class="text-center q-mb-xs" v-if="parseInt(item.qrt_status) == 4">
                  <div class="text-subtitle2 text-dark">暂停中</div>
                </q-card-section>

                <div class="absolute-bottom text-subtitle2 text-center bg-grey-1" v-if="parseInt(item.qrt_status) == 2">
                  时长：{{ maintainTimeText(item.scb_create_time) }}
                </div>
                <div class="absolute-bottom-right q-pa-sm">
                  <q-icon name="las la-door-closed" size="sm" color="positive" v-if="parseInt(item.srd_is_door_status) == 1"></q-icon>
                  <q-icon name="las la-door-open" size="md" color="negative" v-if="parseInt(item.srd_is_door_status) == 2"></q-icon>
                </div>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>
    <q-separator vertical />
    <div class="full-height bg-white no-wrap" :class="currentRoomId ? 'col-5' : ''">
      <q-slide-transition :duration="1000" appears>
        <room-consume-detail
          v-if="currentRoomId"
          ref="roomConsumeDetailRef"
          @resetRoomList="getRoomDataList"
          @openRoomConsume="openRoomConsume"
          @maintainOperate="maintainOperate"
          @closeConsumeDetailDialog="closeOpenRoomDialog"
          @roomBookDialogOperate="roomBookDialogOperate"
        />
      </q-slide-transition>
    </div>

    <goods-consume ref="goodsConsumeRef" v-if="goodsConsumeDialogStatus" @colseConsumeDialog="colseConsumeDialog" />

    <open-room-consume v-if="openRoomConsumeDialog" ref="openRoomConsumeRef" @closeOpenRoomDialog="closeOpenRoomDialog" />

    <maintain-detail-ing v-if="maintainDetailDialogStatus" ref="maintainDetailDialogRef" @closeMaintainDetailDialog="closeOpenRoomDialog" />

    <room-maintain v-if="maintainDialogStatus" ref="roomMaintainDialogRef" @closeRoomMaintainDetailDialog="closeOpenRoomDialog" />

    <room-reserve v-if="roomReserveDialogStatus" ref="roomReserveDialogRef" @closeConsumeDetailDialog="closeOpenRoomDialog" />

    <room-book ref="roomBoolDialogRef" v-if="roomBookDialogStatus" @closeOpenRoomDialog="closeOpenRoomDialog" />
  </q-page>
</template>
<script>
import GoodsConsume from './consume/index.vue'

import OpenRoomConsume from './OpenRoomConsume.vue'
import MaintainDetailIng from './MaintainDetailIng.vue'
import RoomMaintain from './RoomMaintain.vue'
import RoomConsumeDetail from './RoomConsumeDetail.vue'
import RoomReserve from './RoomReserve.vue'
import RoomBook from './RoomBook.vue'

export default {
  name: 'roomConsume',
  components: { GoodsConsume, RoomBook, OpenRoomConsume, MaintainDetailIng, RoomMaintain, RoomConsumeDetail, RoomReserve },
  data () {
    return {
      currentRoomName: '',
      tab: 'all',
      totalAmount: 0,
      roomGroupList: [],
      roomTableDataListData: [],
      currentRoomId: 0,
      currentRoomData: {},
      carListData: [],
      orderCheckout: false,
      orderSettleRefStatus: false,
      drawerDetail: false, // 使用中 房间弹窗状态
      maintainDialogStatus: false, // 维修 侧边弹窗状态
      rewardListData: [],

      currentRoomGroupId: 0,
      maintainDetailDialogStatus: false, // 清洁中 弹窗状态
      yuyueDialogStatus: false, // 预订弹窗状态
      openRoomConsumeDialog: false, // 下单弹窗状态

      chargeRuleListData: [],
      currentConsumeData: {},
      goodsConsumeDialogStatus: false, // 增加消费弹窗状态
      checkoutPageReceive: false,
      goodsShoppingTotalAmount: 0,
      roomReserveDialogStatus: false,
      roomBookDialogStatus: false
    }
  },
  mounted () {},
  created () {
    this.getRoomGroupData()
    this.getRoomDataList()
    this.rewardUserList()
  },
  computed: {},
  methods: {
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
      const that = this
      const params = {
        room_group_id: this.currentRoomGroupId
      }
      this.$store
        .dispatch('roomManage/getRoomTableDataList', params)
        .then((res) => {
          if (res.code == 200) {
            this.roomTableDataListData = res.data ? res.data : []

            if (this.roomTableDataListData && this.roomTableDataListData.length > 0) {
              if (that.$route.params.rcId > 0) {
                const index = _.findIndex(that.roomTableDataListData, function (o) {
                  return parseInt(o.id) == parseInt(that.$route.params.rcId)
                })
                if (index > -1) {
                  that.checkRoomData(that.roomTableDataListData[index])
                }
              }
            }
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

    // 选择房间
    checkRoomData (item, openRoom) {
      this.currentRoomId = item.id
      this.currentRoomData = item

      this.currentRoomName = (item.roomGroup && item.roomGroup.qrg_name ? item.roomGroup.qrg_name : '') + '-' + item.qrt_name
      // roomGroup
      this.drawerDetail = true
      this.$nextTick(() => {
        this.$refs.roomConsumeDetailRef.init(this.currentRoomId, this.currentRoomData, this.currentRoomName, openRoom)
      })
    },

    // 关闭未开台弹窗
    colseNotOpenRoomDialog () {
      this.currentRoomId = 0
      this.currentRoomData = {}
    },

    // 打开清洁信息填写弹窗
    maintainOperate () {
      this.maintainDialogStatus = true

      this.$nextTick(() => {
        this.$refs.roomMaintainDialogRef.init(this.currentRoomId, this.currentRoomName)
      })
    },

    // 转换时间差为时分秒
    maintainTimeText (currentTime) {
      if (currentTime > 0) {
        let text = ''
        const t = this.$q_date.formatDate(new Date(), 'X') - currentTime
        let h = parseInt(t / 60 / 60)
        let m = parseInt((t - h * 60 * 60) / 60)
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

      this.$nextTick(() => {
        this.$refs.openRoomConsumeRef.init(this.currentRoomId, this.currentRoomData, this.currentRoomName)
      })
    },

    roomBookDialogOperate () {
      this.roomBookDialogStatus = true

      this.$nextTick(() => {
        this.$refs.roomBoolDialogRef.init(this.currentRoomId, this.currentRoomData, this.currentRoomName)
      })
    },

    // 关闭开单页面
    closeOpenRoomDialog (item) {
      const that = this
      this.drawerDetail = false
      this.roomBookDialogStatus = false
      this.maintainDialogStatus = false
      this.maintainDetailDialogStatus = false
      this.yuyueDialogStatus = false
      this.openRoomConsumeDialog = false

      this.goodsConsumeDialogStatus = false

      // if (item && item.status && item.status == 'openRoom') {
      if (that.roomTableDataListData && this.roomTableDataListData.length > 0) {
        if (that.currentRoomId > 0) {
          const index = _.findIndex(that.roomTableDataListData, function (o) {
            return parseInt(o.id) == parseInt(that.currentRoomId)
          })
          if (index > -1) {
            that.checkRoomData(that.roomTableDataListData[index], item ? item.status : '')
          }
        }
      }
      // }
      // this.currentRoomId = 0
      // this.currentRoomData = {}

      this.$nextTick(() => {
        this.getRoomDataList()
      })
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },

    reserveOperate () {
      this.roomReserveDialogStatus = true

      this.$nextTick(() => {
        this.$refs.roomReserveDialogRef.init(this.currentRoomId, this.currentRoomData, this.currentRoomName)
      })
    },

    resetCurrentPage () {
      this.drawerDetail = false

      this.maintainDialogStatus = false
      this.maintainDetailDialogStatus = false
      this.yuyueDialogStatus = false
      this.openRoomConsumeDialog = false

      this.goodsConsumeDialogStatus = false

      this.currentConsumeData = {}

      this.currentRoomData = {}

      this.currentRoomId = 0
      this.currentRoomData = {}
      this.currentRoomName = ''

      this.$nextTick(() => {
        this.getRoomDataList()
      })
    }
  }
}
</script>
