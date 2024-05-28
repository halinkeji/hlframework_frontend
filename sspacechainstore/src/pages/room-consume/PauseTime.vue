<template>
  <!-- 开单弹窗 -->
  <q-dialog v-model="openRoomConsumeDialog" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        height: parseInt(this.$q.screen.height * 0.5) + 'px',
      }"
      class="fit column no-wrap"
    >
      <div class="row q-pa-sm items-center">
        暂停计时
        <q-space />
        <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="closePauseRoomTimeDialog"></q-btn>
      </div>
      <q-separator />

      <q-card-section class="full-height">
        <q-scroll-area class="fit">
          <q-form ref="pauseFormRef">
            <q-item class="full-width">
              <q-item-section side>
                <q-item-label caption> 操作本次操作员工： </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-select
                  outlined
                  dense
                  v-model="pauseRoomTimeForm.crr_start_reward_user_id"
                  :options="rewardListData"
                  emit-value
                  option-label="pru_name"
                  option-value="id"
                  map-options
                  :rules="[(val) => (val && val.length > 0) || '请选择操作本次操作员工']"
                />
              </q-item-section>
            </q-item>

            <q-item class="full-width">
              <q-item-section side>
                <q-item-label caption> 暂停时长： </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input @input="changeEndTime" outlined dense v-model="endTimeHours" bottom-slots   :rules="[(val) => (val > 0) ? /^\d+$/.test(val) : true || '请输入正整数']">
                  <template v-slot:after>
                    <div class="text-dark text-subtitle2">小时</div>
                  </template>
                </q-input>
              </q-item-section>

              <q-item-section>
                <q-input @input="changeEndTime" outlined dense v-model="endTimeMinutes"   bottom-slots :rules="[(val) => val > 0 && /^\d+$/.test(val) || '请输入正整数']">
                  <template v-slot:after>
                    <div class="text-dark text-subtitle2">分钟</div>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="full-width">
              <q-item-section side>
                <q-item-label caption> 自动恢复时间：{{  $q_date.formatDate(pauseRoomTimeForm.crr_end_time * 1000, 'YYYY-MM-DD HH:mm') }} </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="full-width">
              <q-item-section side>
                <q-item-label caption> 温馨提示： </q-item-label>
                <q-item-label caption> 1、包间暂停中，可以手动恢复为正常状态。 </q-item-label>
                <q-item-label caption> 2、包间暂停中，可以在暂停记录中延长暂停时间。 </q-item-label>
              </q-item-section>
            </q-item>
          </q-form>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <q-btn color="primary" unelevated icon="list_alt" class="q-px-xl" @click="setChangeRoomBind" label="确定暂停" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { date } from 'quasar'
export default {
  name: 'openRoomConsume',
  components: {},
  data () {
    return {
      currentRoomId: 0,
      currentRoomData: {},

      notOpenRoom: false,
      maintainDialogStatus: false,
      rewardListData: [],

      currentRoomGroupId: 0,
      maintainDetailDialogStatus: false,
      yuyueDialogStatus: false,
      openRoomConsumeDialog: false,
      pauseRoomTimeForm: {
        crr_room_id: '', // 更换之前的桌号ID
        crr_consume_buffer_id: '', // 缓存记录ID
        crr_status: '1', // 状态1暂停中2暂停到期自动完成3员工主动停止暂停4作废
        crr_start_time: '', // 暂停开始时间
        crr_end_time: '', // 暂停结束时间
        crr_start_reward_user_id: '', // 暂时开始员工
        crr_end_reward_user_id: '', // 暂停结束员工
        crr_void_reward_user_id: '', // 暂停作废员工
        crr_is_electricity: '1'
      },
      chargeRuleListData: [],
      currentRoomName: '',
      roomTableDataListData: [],
      roomGroupList: [],
      consumBufferId: '',
      wholeDayHour: [],
      sixtyMinutes: [],
      endTimeHours: '0',
      endTimeMinutes: '0'
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (consumBufferId, afterRoomId) {
      const nowTime = new Date()
      this.pauseRoomTimeForm.crr_start_time = date.formatDate(nowTime, 'X')
      this.pauseRoomTimeForm.crr_end_time = date.formatDate(nowTime, 'X')

      for (var i = 1; i <= 24; i++) {
        this.wholeDayHour.push(i)
      }

      for (var i = 1; i < 60; i++) {
        this.sixtyMinutes.push(i)
      }
      this.consumBufferId = consumBufferId
      this.pauseRoomTimeForm.crr_consume_buffer_id = consumBufferId
      this.pauseRoomTimeForm.crr_room_id = afterRoomId

      this.rewardUserList()

      this.openRoomConsumeDialog = true
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

    closePauseRoomTimeDialog () {
      this.$emit('closePauseRoomTimeDialog')
    },

    changeEndTime () {
      let newDate = new Date(this.pauseRoomTimeForm.crr_start_time * 1000)
      if (this.endTimeHours) {
        newDate = date.addToDate(newDate, { hours: this.endTimeHours })
      }
      if (this.endTimeMinutes) {
        newDate = date.addToDate(newDate, { minutes: this.endTimeMinutes })
      }
      this.pauseRoomTimeForm.crr_end_time = date.formatDate(newDate, 'X')
    },

    setChangeRoomBind () {
      this.$refs.pauseFormRef.validate().then((success) => {
        if (success) {
          const params = {
            ...this.pauseRoomTimeForm
          }
          this.$store
            .dispatch('roomConsume/saveRoomPauseTimeData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '更换桌台成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.closePauseRoomTimeDialog()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
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
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
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
