<template>

  <!-- 清洁中弹窗 -->
  <q-dialog seamless position="right" full-height v-model="maintainDetailDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.2) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm row items-center q-gutter-sm q-px-sm">
          <div class="col-auto text-dark text-weight-bold">{{ currentRoomName }}</div>
          <q-btn flat dense @click="getDeskTypeList()">
            <q-icon name="shutter_speed" size="xs" color="primary"></q-icon>
            <span class="text-weight-bold text-blue-grey q-px-sm">清洁</span>
          </q-btn>

          <q-space />
          <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="colseMaintainRoomDetailDialog"></q-btn>
        </div>

        <q-separator />

        <div class="col-shrink bg-grey-2 full-height">
          <q-item class="bg-grey-2">
            <q-item-section>
              <q-item-label caption>开始时间</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                {{ $q_date.formatDate(currentRoomData.qrt_maintain_start_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="bg-grey-2">
            <q-item-section>
              <q-item-label caption>清洁时长</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                {{ maintainTimeText(currentRoomData.qrt_maintain_start_time) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="bg-grey-2" v-if="currentRoomData && currentRoomData.qrt_maintain_reward_id">
            <q-item-section>
              <q-item-label caption>清洁员工</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                <q-badge color="positive" outline>{{ currentRoomData.rewardUser ? currentRoomData.rewardUser.pru_name : '' }}</q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="bg-grey-2">
            <q-item-section>
              <q-item-label caption>备注</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ currentRoomData.qrt_maintain_note }} </q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col-shrink bg-white q-px-xs q-pb-md bg-grey-2 row q-gutter-md">
          <q-space />
          <q-btn color="teal" unelevated icon="settings_brightness" @click="overMaintainOperate" label="完成清洁" class="text-weight-bold" />
        </div>
      </div>
    </q-card>
  </q-dialog>

</template>
<script>

export default {
  name: 'roomConsume',
  components: { },
  data () {
    return {

      currentRoomId: 0,
      currentRoomData: {},

      notOpenRoom: false,
      maintainDialogStatus: false,
      rewardListData: [],
      roomData: {
        qrt_status: 3,
        qrt_maintain_electricity: 0,
        qrt_maintain_note: '',
        qrt_maintain_reward_id: ''
      },

      maintainDetailDialogStatus: false,
      currentRoomName: ''

    }
  },
  mounted () {},
  created () {

  },
  computed: {},
  methods: {

    init (currentRoomId, currentRoomData, currentRoomName) {
      this.maintainDetailDialogStatus = true
      this.currentRoomId = currentRoomId
      this.currentRoomData = currentRoomData
      this.currentRoomName = currentRoomName
    },

    // 关闭清洁详情弹窗
    colseMaintainRoomDetailDialog () {
      this.maintainDetailDialogStatus = false
      this.$emit('closeMaintainDetailDialog')
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
            this.colseMaintainRoomDetailDialog()
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
