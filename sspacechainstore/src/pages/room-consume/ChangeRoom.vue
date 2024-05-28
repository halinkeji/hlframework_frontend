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
        更换桌台
        <q-space />
        <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="closeChangeRoomDialog"></q-btn>
      </div>
      <q-separator />

      <q-card-section class="full-height">
        <q-scroll-area class="fit">

          <q-item class="full-width">
            <q-item-section side>
              <q-item-label caption> 操作本次操作员工： </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="changeRoomForm.rcr_reward_user_id"
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
              <q-item-label caption> 桌台分组： </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="changeRoomForm.rcr_after_room_group_id"
                :options="roomGroupList"
                emit-value
                option-label="qrg_name"
                option-value="id"
                map-options
                @input="changeGroupData"
                :rules="[(val) => (val && val.length > 0) || '请选择桌台分组']"
              />
            </q-item-section>
          </q-item>

          <q-item class="full-width">
            <q-item-section side>
              <q-item-label caption> 桌台： </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="changeRoomForm.rcr_after_room_id"
                :options="roomTableDataListData"
                emit-value
                option-label="qrt_name"
                option-value="id"
                map-options
                @input="changeRoomData"
                :rules="[(val) => (val && val.length > 0) || '请选择桌台']"
              />
            </q-item-section>
          </q-item>

          <q-item class="full-width">
            <q-item-section side>
              <q-item-label caption> 计费模式： </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="changeRoomForm.rcr_after_charge_rule_id"
                :options="chargeRuleListData"
                emit-value
                option-label="qcr_name"
                option-value="id"
                map-options
                @input="viewRuleDetailDialog"
                :rules="[(val) => (val && val.length > 0) || '请选择计费模式']"
              />
            </q-item-section>
          </q-item>
          <div class="q-pa-sm">
            <rule-detail ref="ruleDetailRef" v-if="changeRoomForm.rcr_after_charge_rule_id" />
          </div>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center">
        <q-btn color="primary" unelevated icon="list_alt" class="q-px-xl" @click="setChangeRoomBind" label="确定更换" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import RuleDetail from './RuleDetail'
export default {
  name: 'openRoomConsume',
  components: { RuleDetail },
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
      changeRoomForm: {
        rcr_consume_buffer_id: '', // 缓存记录ID
        rcr_before_room_id: '', // 更换之前的桌号ID
        rcr_before_room_name: '', // 更换之前的桌号名称
        rcr_after_room_id: '', // 更换之后的桌号ID
        rcr_after_room_name: '', // 更换之后的桌号名称
        rcr_before_charge_rule_id: '', // 更换之前的计费模式ID
        rcr_before_charge_rule_name: '', // 更换之前的计费模式名称
        rcr_after_charge_rule_name: '', // 更换之后的计费模式名称
        rcr_after_charge_rule_id: '', // 更换之后的计费模式ID
        rcr_reward_user_id: '', // 操作员工ID
        rcr_after_room_group_id: '', // 更换之前的桌号分组
        rcr_before_room_group_id: '' // 更换之后的桌号分组
      },
      chargeRuleListData: [],
      currentRoomName: '',
      roomTableDataListData: [],
      roomGroupList: [],
      consumBufferId: ''
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (consumBufferId, afterRoomId, afterChargeRuleId, afterRoomGroupId) {
      this.consumBufferId = consumBufferId
      this.changeRoomForm.rcr_consume_buffer_id = consumBufferId
      this.changeRoomForm.rcr_before_room_id = afterRoomId
      this.changeRoomForm.rcr_before_charge_rule_id = afterChargeRuleId
      this.changeRoomForm.rcr_before_room_group_id = afterRoomGroupId

      this.rewardUserList()

      this.getRoomGroupData()

      this.openRoomConsumeDialog = true
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
    changeGroupData () {
      this.roomTableDataListData = []
      this.changeRoomForm.rcr_after_room_id = ''
      this.changeRoomForm.rcr_after_charge_rule_id = ''
      this.$nextTick(() => {
        this.getRoomDataList()
      })
    },
    // 获取房间列表
    getRoomDataList () {
      const params = {
        room_group_id: this.changeRoomForm.rcr_after_room_group_id,
        qrtStatus: 1
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

    // 更改房间
    changeRoomData () {
      this.chargeRuleListData = []
      this.changeRoomForm.rcr_after_charge_rule_id = ''
      this.$nextTick(() => {
        this.getChargeRuleList()
      })
    },
    viewRuleDetailDialog () {
      this.ruleDetailStatus = true

      this.$nextTick(() => {
        this.$refs.ruleDetailRef.init(this.changeRoomForm.rcr_after_charge_rule_id)
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
      const params = {
        currentGroupId: this.changeRoomForm.rcr_after_room_id
      }
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

    closeChangeRoomDialog () {
      this.$emit('closeChangeRoomDialog')
    },

    setChangeRoomBind () {
      const params = {
        ...this.changeRoomForm
      }
      this.$store
        .dispatch('roomConsume/changeRoomConsume', params)
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
            this.closeChangeRoomDialog()
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
