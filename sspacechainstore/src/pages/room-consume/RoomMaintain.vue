<template>
  <!-- 添加清洁状态弹窗 -->
  <q-dialog v-model="maintainDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.2) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
      }"
    >
      <div class="row q-pa-sm items-center">
        {{ currentRoomName }}
        <q-space />
        <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="closeRoomMaintainDetailDialog"></q-btn>
      </div>
      <q-separator />
      <div class="flex flex-center">
        <q-item class="full-width">
          <q-item-section side>
            <q-item-label caption> 清洁员工： </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-select
              outlined
              dense
              v-model="roomData.qrt_maintain_reward_id"
              :options="rewardListData"
              emit-value
              option-label="pru_name"
              option-value="id"
              map-options
            />
          </q-item-section>
        </q-item>

        <q-item class="full-width">
          <q-item-section side>
            <q-item-label caption> 智能电源： </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-checkbox v-model="roomData.qrt_maintain_electricity" :true-value="1" :false-value="0" :val="1" />
          </q-item-section>
        </q-item>

        <q-item class="full-width">
          <q-item-section side top>
            <q-item-label caption> 备注： </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-input outlined v-model="roomData.qrt_maintain_note" type="textarea" />
          </q-item-section>
        </q-item>
      </div>
      <q-separator />

      <q-card-section class="text-center">
        <q-btn color="primary" unelevated icon="list_alt" class="q-px-xl" @click="updateRoomData" label="开始清洁" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'RoomMaintain',
  components: {},
  data () {
    return {

      currentRoomId: 0,
      maintainDialogStatus: false,
      rewardListData: [],
      roomData: {
        qrt_status: 3,
        qrt_maintain_electricity: 0,
        qrt_maintain_note: '',
        qrt_maintain_reward_id: ''
      },
      currentRoomName: ''

    }
  },
  mounted () {},
  created () {

  },
  computed: {},
  methods: {

    init (currentRoomId, currentRoomName) {
      this.maintainDialogStatus = true
      this.currentRoomId = currentRoomId
      this.currentRoomName = currentRoomName

      this.rewardUserList()
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
            this.closeRoomMaintainDetailDialog()
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

    closeRoomMaintainDetailDialog () {
      this.maintainDialogStatus = false
      this.$emit('closeRoomMaintainDetailDialog')
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
