<template>
  <!-- 开单弹窗 -->
  <q-dialog v-model="openRoomConsumeDialog" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
        height: parseInt(this.$q.screen.height * 0.9) + 'px',
      }"
      class="fit column no-wrap"
    >
      <div class="row q-pa-sm items-center">
        {{ currentRoomName }}
        <q-space />
        <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="closeOpenRoomDialog"></q-btn>
      </div>
      <q-separator />

      <q-form class="full-height" ref="openRoomFormRef">
        <q-card-section class="full-height row">
          <div class="col-5 q-pa-xs">
            <q-scroll-area class="fit">
              <q-card flat bordered class="q-mt-sm full-width">
                <q-card-section>
                  <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
                </q-card-section>
              </q-card>

              <q-item class="full-width">
                <q-item-section side>
                  <q-item-label caption> 开台员工： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-select
                    outlined
                    dense
                    v-model="consumeDetailForm.scb_create_reward_user_id"
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
                  <q-item-label caption> 顾客人数： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input outlined dense v-model="consumeDetailForm.scb_people_number" type="number" />
                </q-item-section>
              </q-item>

              <q-item class="full-width">
                <q-item-section side>
                  <q-item-label caption> 备注： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input outlined v-model="consumeDetailForm.scb_remark" :rows="2" type="textarea" />
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </div>

          <div class="col-7 q-pa-xs">
            <q-scroll-area class="fit">
              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 开台时间： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input readonly dense outlined v-model="createOrderTime"  :rules="[(val) => !!val || '请选择开台时间']">
                    <!-- <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" v-if="parseInt(checkPackageType) == 1">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-card class="my-card">
                            <q-card-section class="q-py-xs">
                              <div class="text-subtitle2 text-center">选择日期</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="q-py-xs">
                              <q-scroller
                                v-model="createOrderTime"
                                view="date-time"
                                no-footer
                                no-shadow
                                color="primary"
                                locale="zh-hans"
                                style="max-width: 200px; height: 200px"
                              ></q-scroller>
                            </q-card-section>
                            <q-separator />
                            <q-card-actions>
                              <q-btn @click="changeCreateTime" class="full-width" v-close-popup color="primary" flat label="确认" />
                            </q-card-actions>
                          </q-card>
                        </q-popup-proxy>
                      </q-icon>
                    </template> -->
                  </q-input>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 预计离店时间： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input readonly dense outlined v-model="leaveMerchantTime"  :rules="[(val) => !!val || '请选择离店时间']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" v-if="parseInt(consumeDetailForm.scb_charge_package_id) <= 0">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-card class="my-card">
                            <q-card-section class="q-py-xs">
                              <div class="text-subtitle2 text-center">选择日期</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="q-py-xs">
                              <q-scroller
                                v-model="leaveMerchantTime"
                                view="date-time"
                                no-footer
                                no-shadow
                                color="primary"
                                locale="zh-hans"
                                style="max-width: 200px; height: 200px"
                              ></q-scroller>
                            </q-card-section>
                            <q-separator />
                            <q-card-actions>
                              <q-btn @click="computeRuleAmount" class="full-width" v-close-popup color="primary" flat label="确认" />
                            </q-card-actions>
                          </q-card>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-separator />

              <q-item class="full-width bg-grey-2" v-if="parseInt(consumeDetailForm.scb_charge_mode) == 1">
                <q-item-section side>
                  <q-item-label caption> 选择使用小时 </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="row q-gutter-sm">
                    <div :key="'btn-' + key" v-for="(item,key) in fastBtnArr">
                      <q-btn color="primary" @click="fastCheckTime(item)" outline :label="item + '小时'" />
                    </div>

                  </q-item-label>

                </q-item-section>
              </q-item>
              <q-separator />

              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 时长 </q-item-label>
                </q-item-section>
                <q-item-section>
                   <q-item-label class="text-subtitle2 text-weight-bold text-negative text-right"> {{ forecastEveryTime }} </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 桌台费 </q-item-label>
                </q-item-section>
                <q-item-section>
                   <q-item-label class="text-subtitle2 text-weight-bold text-negative text-right">
                    {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                     {{ consumeDetailForm.srr_room_total_amount }}
                     </q-item-label>
                </q-item-section>
              </q-item>

              <q-tabs
                v-model="consumeDetailForm.scb_charge_mode"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
                @input="changeTab"
              >
                <q-tab name="2" label="计费套餐" />
                <q-tab name="1" label="计费模式" />
              </q-tabs>

              <div v-if="parseInt(consumeDetailForm.scb_charge_mode) == 1">
                <q-item class="full-width">
                  <q-item-section side>
                    <q-item-label caption> 计费模式： </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-select
                      outlined
                      dense
                      v-model="consumeDetailForm.scb_charge_rule_id"
                      :options="chargeRuleListData"
                      emit-value
                      option-label="qcr_name"
                      option-value="id"
                      map-options
                      @input="viewRuleDetailDialog"
                      :rules="[(val) => !!val || '请选择计费模式']"
                    />
                  </q-item-section>
                </q-item>

                <div class="q-pa-sm">
                  <rule-detail ref="ruleDetailRef" v-if="consumeDetailForm.scb_charge_rule_id" />
                </div>
              </div>

              <div
                class="full-width row"
                v-if="packageListListData && packageListListData.length > 0 && parseInt(consumeDetailForm.scb_charge_mode) == 2"
              >
                <div class="col-12 q-mt-sm q-pa-sm" v-for="(item, key) in packageListListData">
                  <q-card flat bordered v-ripple @click="checkPackage(item)">
                    <q-item clickable :class="parseInt(consumeDetailForm.scb_charge_package_id) == parseInt(item.id) ? 'bg-blue-3 text-white' : ''">
                      <q-item-section>
                        <q-item-label class="row text-subtitle2">
                          {{ item.scp_name }}
                          <div class="text-weight-bold" v-if="parseInt(item.scp_time_type) == 1">（{{ item.scp_regular_hours }} 小时有效）</div>

                          <div class="text-weight-bold" v-if="parseInt(item.scp_time_type) == 2">
                            （{{ fortyEightHourText[item.scp_time_period_start] }} 至
                            {{ fortyEightHourText[item.scp_time_period_end] }} 有效）
                          </div>
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-item-label class="text-subtitle1 text-weight-bold text-negative">
                          {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                          {{ item.scp_sell_price }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />

                    <q-card-section>
                      <div v-html="item.scp_description"></div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-scroll-area>
          </div>
        </q-card-section>
      </q-form>

      <q-separator />

      <q-card-section class="text-center">
          <div class="text-red">
          {{ bookErrMsg }}
        </div>
        <q-btn color="primary" unelevated icon="list_alt" class="q-px-xl" :disable="bookBtnStatus" @click="setOpenRoomConsume" label="确定开台" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { date } from 'quasar'
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
      consumeDetailForm: {
        scb_charge_package_id: '0',
        scb_charge_mode: '2',
        scb_charge_rule_id: '', // 计费
        scb_room_group_id: '', // 房间分组ID
        scb_room_table_id: '', // 房间ID
        scb_people_number: '', // 人数
        scb_create_time: '', // 开单时间
        scb_leave_time: '',
        scb_create_reward_user_id: '', // 开单员工
        scb_member_id: '', // 会员

        scb_member_nickname: '', // 会员昵称
        scb_member_card_number: '', // 会员卡号
        scb_member_phone_number: '', // 会员电话号

        scb_auto_settle_hour: '', // 自动预结账小时
        scb_auto_settle_minute: '', // 自动预结账分钟
        scb_remark: '' // 备注
      },
      chargeRuleListData: [],
      currentRoomName: '',
      packageListListData: [],
      fortyEightHourText: {},
      checkPackageType: 1,
      leaveMerchantTime: '',
      createOrderTime: '',
      roomGroupId: 0,
      forecastEveryTime: '',
      currentChargePackageItem: {},
      bookBtnStatus: true,
      bookErrMsg: '',
      fastBtnArr: [
        1, 2, 3, 6, 12
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (currentRoomId, currentRoomData, currentRoomName) {
      for (var i = 0; i < 24; i++) {
        this.fortyEightHourText[i] = i + '点'
      }

      for (var i = 0; i < 24; i++) {
        this.fortyEightHourText[i + 24] = '次日' + i + '点'
      }
      this.rewardUserList()

      this.currentRoomData = currentRoomData
      this.currentRoomId = currentRoomId
      this.roomGroupId = currentRoomData.qrt_room_group_id

      this.currentRoomName = currentRoomName

      this.openRoomConsumeDialog = true
      this.getChargePackageListData()
      this.getChargeRuleList()
      this.$nextTick(() => {
        this.openRoomConsume(currentRoomId, currentRoomData)
      })
    },
    changeCreateTime () {
      if (parseInt(this.checkPackageType) == 1 && this.currentChargePackageItem) {
        this.checkPackage(this.currentChargePackageItem)
      } else {
        this.$nextTick(() => {
          this.computeRuleAmount()
        })
      }
    },
    fastCheckTime (item) {
      this.leaveMerchantTime = date.formatDate(date.addToDate(new Date(this.createOrderTime), { hour: item }), 'YYYY-MM-DD HH:mm:ss')

      this.$nextTick(() => {
        this.computeRuleAmount()
      })
    },
    getChargePackageListData () {
      const params = {
        currentRoomId: this.currentRoomId,
        time_type: 1
      }
      this.$store
        .dispatch('chargePackage/getChargePackageListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.packageListListData = res.data ? res.data : []
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
    viewRuleDetailDialog () {
      this.ruleDetailStatus = true

      this.computeRuleAmount()

      this.$nextTick(() => {
        this.$refs.ruleDetailRef.init(this.consumeDetailForm.scb_charge_rule_id)
      })
    },
    // 开台
    openRoomConsume (currentRoomId, currentRoomData) {
      this.consumeDetailForm.scb_room_group_id = currentRoomData.qrt_room_group_id

      this.consumeDetailForm.scb_room_table_id = currentRoomId

      this.createOrderTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')

      this.consumeDetailForm.scb_people_number = currentRoomData.qrt_people_number
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
        currentGroupId: this.currentRoomData.qrt_room_group_id
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

    // 读卡
    getMemberInfo (item) {
      this.consumeDetailForm.scb_member_id = item.id
      this.consumeDetailForm.scb_member_nickname = item.mem_memberName
      this.consumeDetailForm.scb_member_card_number = item.mem_memberCardNum
      this.consumeDetailForm.scb_member_phone_number = item.mem_memberMobile
    },

    checkPackage (item) {
      this.consumeDetailForm.scb_charge_package_id = item.id
      this.consumeDetailForm.scb_charge_rule_id = item.scp_charge_rule_id
      let newDate = new Date(this.createOrderTime)

      if (parseInt(this.checkPackageType) == 2 && parseInt(item.scp_time_type) == 1) {
        this.createOrderTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
      }

      if (parseInt(item.scp_time_type) == 1) {
        this.checkPackageType = 1
        newDate = date.addToDate(newDate, { hours: parseInt(item.scp_regular_hours) })
        this.leaveMerchantTime = this.$q_date.formatDate(newDate, 'YYYY-MM-DD HH:mm:ss')
      }
      if (parseInt(item.scp_time_type) == 2) {
        this.checkPackageType = 2
        this.createOrderTime = this.$q_date.formatDate(newDate, 'YYYY-MM-DD ') + item.scp_time_period_start + ':' + '00'
        const currentTimeDate = new Date(this.createOrderTime)
        const leaveTime = date.addToDate(currentTimeDate, { hours: parseInt(item.scp_time_period_end - item.scp_time_period_start) })
        this.leaveMerchantTime = this.$q_date.formatDate(leaveTime, 'YYYY-MM-DD HH:mm:ss')
      }

      this.currentChargePackageItem = item

      this.$nextTick(() => {
        this.computeRuleAmount()
      })
    },

    changeTab () {
      this.leaveMerchantTime = ''
      this.checkPackageType = 1
      this.createOrderTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')

      if (parseInt(this.consumeDetailForm.scb_charge_mode) == 1) {
        this.consumeDetailForm.scb_charge_package_id = 0
        this.consumeDetailForm.scb_charge_rule_id = ''
      } else if (parseInt(this.consumeDetailForm.scb_charge_mode) == 2) {
        this.consumeDetailForm.scb_charge_rule_id = ''
      }
    },

    // 关闭开单页面
    closeOpenRoomDialog () {
      this.openRoomConsumeDialog = false
      this.$emit('closeOpenRoomDialog', { status: 'openRoom' })
    },

    // 开单
    setOpenRoomConsume () {
      this.$refs.openRoomFormRef.validate().then((success) => {
        if (success) {
          if (parseInt(this.consumeDetailForm.scb_charge_mode) == 2) {
            if (!this.consumeDetailForm.scb_charge_package_id) {
              this.$q.notify({
                message: '失败',
                caption: '请选择计费套餐',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              return false
            }
          }
          this.consumeDetailForm.scb_create_time = this.$q_date.formatDate(this.createOrderTime, 'X')
          this.consumeDetailForm.scb_leave_time = this.$q_date.formatDate(this.leaveMerchantTime, 'X')
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
                this.closeOpenRoomDialog()
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

    computeRuleAmount () {
      this.bookBtnStatus = true
      const leave_time = this.$q_date.formatDate(this.leaveMerchantTime, 'X')
      const charge_rule_id = this.consumeDetailForm.scb_charge_rule_id
      const start_time = this.$q_date.formatDate(this.createOrderTime, 'X')
      const scb_charge_package_id = this.consumeDetailForm.scb_charge_package_id
      if (leave_time && charge_rule_id && start_time) {
        const params = {
          leave_time,
          charge_rule_id,
          start_time,
          charge_package_id: scb_charge_package_id,
          currentRoomId: this.currentRoomId
        }
        this.$store
          .dispatch('roomConsume/computeRuleAmount', params)
          .then((res) => {
            if (res.code == 200) {
              const resultData = res.data
              if (resultData && resultData.status_code == 200) {
                this.bookBtnStatus = false
                this.consumeDetailForm.srr_room_total_amount = res.data.amount ? this.formatAmount(res.data.amount) : 0
                this.forecastEveryTime = res.data.everyTime
                this.bookErrMsg = ''
              } else {
                this.bookBtnStatus = true
                this.bookErrMsg = resultData.status_msg
              }
            } else {
              this.bookBtnStatus = true
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
