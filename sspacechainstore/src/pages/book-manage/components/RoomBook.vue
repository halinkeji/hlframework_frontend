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

      <q-form class="full-height" ref="bookRoomFormRef">
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
                  <q-item-label caption> 预订员工： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-select
                    outlined
                    dense
                    v-model="consumeDetailForm.srr_reward_id"
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
                  <q-input outlined dense v-model="consumeDetailForm.srr_people_number" type="number" />
                </q-item-section>
              </q-item>

               <q-item class="full-width">
                <q-item-section side>
                  <q-item-label caption> 联系人： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input outlined dense v-model="consumeDetailForm.srr_contact_person" :rules="[(val) => !!val || '请输入联系人名称']" />
                </q-item-section>
              </q-item>

               <q-item class="full-width">
                <q-item-section side>
                  <q-item-label caption> 联系电话： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input outlined dense v-model="consumeDetailForm.srr_contact_phone" :rules="[(val) => !!val || '请输入联系电话']" />
                </q-item-section>
              </q-item>

              <q-item class="full-width">
                <q-item-section side>
                  <q-item-label caption> 备注： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input outlined v-model="consumeDetailForm.srr_note" :rows="2" type="textarea" />
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </div>

          <div class="col-7 q-pa-xs">
            <q-scroll-area class="fit">
              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 计费模式： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="row">
                    <q-radio v-model="consumeDetailForm.srr_charge_mode" @input="changeTab" val="2" label="特惠套餐" />
                    <q-radio
                      v-model="consumeDetailForm.srr_charge_mode"
                      @input="changeTab"
                      val="1"
                      label="整点时间"
                      v-if="roomBookDetailData && roomBookDetailData.charge_rule_id"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 发送短信通知： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="row">
                    <q-checkbox  v-model="consumeDetailForm.srr_is_sms_notify"  true-value="1" false-value="0"  />

                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />
              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 预订时间： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input readonly dense outlined v-model="createOrderTime">
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        v-if="parseInt(checkPackageType) == 1 && parseInt(consumeDetailForm.srr_charge_mode) == 2"
                      >
                        <q-popup-proxy @hide="changeBookOrderTime" ref="qDateProxy" transition-show="scale" transition-hide="scale">
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
                              <q-btn class="full-width" v-close-popup color="primary" flat label="确认" />
                            </q-card-actions>
                          </q-card>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>

              <q-separator />
              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 离店时间： </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input readonly dense outlined v-model="leaveMerchantTime"> </q-input>
                </q-item-section>
              </q-item>

              <q-separator />
              <!-- <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 详情： </q-item-label>
                </q-item-section>
                <q-item-section class="q-pa-xs">
                  <q-item-label class="row q-gutter-sm">
                    <div :key="key" v-for="(item, key) in 24">
                      <div :class="squareBg(key)"></div>
                      <div class="text-center">{{ key }}</div>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item> -->

              <q-separator />

              <div v-if="parseInt(consumeDetailForm.srr_charge_mode) == 1">
                <q-item class="full-width bg-grey-2">
                  <q-item-section side>
                    <q-item-label caption> 默认计费模式： </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle2 text-weight-bold text-negative text-right">
                      {{ roomBookDetailData && roomBookDetailData.charge_rule_id ? roomBookDetailData.qcr_name : '' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <div class="q-pa-sm" v-if="consumeDetailForm.srr_charge_rule_id">
                  <rule-detail ref="ruleDetailRef" />
                </div>
              </div>

              <q-item class="full-width bg-grey-2" v-if="parseInt(consumeDetailForm.srr_charge_mode) == 1">
                <q-item-section side>
                  <q-item-label caption> 日期 </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input readonly dense outlined v-model="bookDiyOrderDate">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" @hide="getRoomBookDetail" transition-show="scale" transition-hide="scale">
                          <q-card class="my-card">
                            <q-card-section class="q-py-xs">
                              <div class="text-subtitle2 text-center">选择日期</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="q-py-xs">
                              <q-scroller
                                v-model="bookDiyOrderDate"
                                view="date"
                                no-footer
                                no-shadow
                                color="primary"
                                locale="zh-hans"
                                style="max-width: 200px; height: 200px"
                              ></q-scroller>
                            </q-card-section>
                            <q-separator />
                            <q-card-actions>
                              <q-btn class="full-width" v-close-popup color="primary" flat label="确认" />
                            </q-card-actions>
                          </q-card>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>

              <div class="col-12 q-mt-sm" v-if="parseInt(consumeDetailForm.srr_charge_mode) == 1">
                <div class="row items-center">
                  <q-scroll-area class="full-width" style="height: 62px">
                    <div class="row no-wrap q-gutter-sm q-px-sm items-center">
                      <div class="col-auto" v-for="(item, key) in weekAllTimePeriod" :key="key">
                        <div
                          @click="bookDateDay = item.dateTimestamp"
                          class="book-date q-pa-sm text-center q-px-md cursor-pointer"
                          :class="bookDateDay == item.dateTimestamp ? 'bg-primary text-white' : ''"
                        >
                          <span class="text-weight-bold"> {{ item.weekName }}</span>
                          <br />
                          {{ item.monthData }}
                        </div>
                      </div>
                    </div>
                  </q-scroll-area>
                </div>
                <q-separator class="q-my-sm" />
                <div v-for="(item, key) in weekAllTimePeriod">
                  <div class="row q-gutter-sm q-pa-xs" v-if="bookDateDay == item.dateTimestamp">
                    <div
                      v-for="(i, k) in item.bookTimePeriod"
                      :key="`${item.dateTimestamp + k}`"
                      class="col-2  q-pa-sm text-center cursor-pointer q-px-md"
                      :class="{
                        'bg-primary text-white':checkTimestamp(item, i),
                        'book-date': parseInt(i.bookStatus) == 1,
                        'book-date-disable': parseInt(i.bookStatus) == 2,
                      }"
                      @click="clickTimeSelectState(i)"
                    >
                      {{ i.hourTimestampText }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="full-width row"
                v-if="packageListListData && packageListListData.length > 0 && parseInt(consumeDetailForm.srr_charge_mode) == 2"
              >
                <div class="col-12 q-mt-sm q-pa-sm" v-for="(item, key) in packageListListData">
                  <q-card flat bordered v-ripple @click="checkPackage(item)">
                    <q-item clickable :class="parseInt(consumeDetailForm.srr_charge_package_id) == parseInt(item.id) ? 'bg-blue-3 text-white' : ''">
                      <q-item-section>
                        <q-item-label class="row text-subtitle2">
                          {{ item.scp_name }}
                          <div class="text-weight-bold" v-if="parseInt(item.scp_time_type) == 1">（{{ item.scp_regular_hours }} 小时有效）</div>
                          <div class="text-weight-bold" v-if="parseInt(item.scp_time_type) == 2">
                            （{{ fortyEightHourText[item.scp_time_period_start] }} 至 {{ fortyEightHourText[item.scp_time_period_end] }} 有效）
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

              <q-separator />

              <q-item class="full-width bg-grey-2">
                <q-item-section side>
                  <q-item-label caption> 时长 </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold text-negative text-right">
                    {{ forecastEveryTime }}
                  </q-item-label>
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
            </q-scroll-area>
          </div>
        </q-card-section>
      </q-form>

      <q-separator />

      <q-card-section class="text-center">
        <div class="text-red">
          {{ bookErrMsg }}
        </div>
        <q-btn color="primary" :disable="bookBtnStatus" unelevated icon="list_alt" class="q-px-xl" @click="setBookRoomConsume" label="确定预订" />
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
        srr_charge_package_id: '',
        srr_charge_mode: '2',
        srr_charge_rule_id: '', // 计费
        srr_room_group_id: '', // 房间分组ID
        srr_room_id: '', // 房间ID
        srr_people_number: '', // 人数
        srr_start_time: '', // 开单时间
        srr_end_time: '',
        srr_reward_id: '', // 开单员工
        srr_member_id: '', // 会员

        srr_member_nickname: '', // 会员昵称
        srr_member_card_number: '', // 会员卡号
        srr_member_phone_number: '', // 会员电话号

        srr_contact_person: '',
        srr_contact_phone: '',
        srr_note: '', // 备注
        srr_room_total_amount: '',
        srr_status: '1',
        srr_is_sms_notify: '1'
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
      roomBookDetailData: {},
      bookBtnStatus: true,
      nowDayBookTimePeriod: [],
      bookDiyOrderDate: '',
      weekAllTimePeriod: [],
      bookDateDay: '',
      createBookOrderTime: '',
      endBookOrderTime: '',
      bookErrMsg: '',
      checkoutPageReceive: false,
      usedTimePeriod: [],
      charge_rule_id: ''
    }
  },
  mounted () {},
  created () {},
  computed: {},

  methods: {
    init (currentRoomId, currentRoomData, currentRoomName, dayTimestamp) {
      this.openRoomConsumeDialog = true
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

      this.getChargePackageListData()

      this.$nextTick(() => {
        this.openRoomConsume(currentRoomId, currentRoomData, dayTimestamp)
      })
    },

    openRoomConsume (currentRoomId, currentRoomData, dayTimestamp) {
      this.consumeDetailForm.srr_room_group_id = currentRoomData.qrt_room_group_id

      this.consumeDetailForm.srr_room_id = currentRoomId
      const noTimestamp = dayTimestamp ? new Date(dayTimestamp * 1000) : new Date()
      this.createOrderTime = this.$q_date.formatDate(noTimestamp, 'YYYY-MM-DD HH:mm')

      this.bookDiyOrderDate = this.$q_date.formatDate(noTimestamp, 'YYYY-MM-DD')

      this.consumeDetailForm.srr_people_number = currentRoomData.qrt_people_number

      this.getRoomBookDetail()
    },

    checkPackage (item) {
      this.consumeDetailForm.srr_charge_package_id = item.id
      this.consumeDetailForm.srr_charge_rule_id = item.scp_charge_rule_id
      let newDate = new Date(this.createOrderTime)

      if (parseInt(this.checkPackageType) == 2 && parseInt(item.scp_time_type) == 1) {
        this.createOrderTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      }

      this.$nextTick(() => {
        if (parseInt(item.scp_time_type) == 1) {
          this.checkPackageType = 1
          newDate = date.addToDate(newDate, { hours: parseInt(item.scp_regular_hours) })
          this.leaveMerchantTime = this.$q_date.formatDate(newDate, 'YYYY-MM-DD HH:mm')
        }
        if (parseInt(item.scp_time_type) == 2) {
          this.checkPackageType = 2

          this.createOrderTime = this.$q_date.formatDate(newDate, 'YYYY-MM-DD ') + item.scp_time_period_start + ':' + '00'
          const currentTimeDate = new Date(this.createOrderTime)
          const leaveTime = date.addToDate(currentTimeDate, { hours: parseInt(item.scp_time_period_end - item.scp_time_period_start) })
          this.leaveMerchantTime = this.$q_date.formatDate(leaveTime, 'YYYY-MM-DD HH:mm')
        }
        this.computeRuleAmount()
      })
    },

    changeTab () {
      this.leaveMerchantTime = ''
      this.createOrderTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      this.checkPackageType = 1
      this.consumeDetailForm.srr_charge_rule_id = ''
      if (parseInt(this.consumeDetailForm.srr_charge_mode) == 1) {
        this.consumeDetailForm.srr_charge_package_id = ''
        this.consumeDetailForm.srr_charge_rule_id = this.charge_rule_id
      } else if (parseInt(this.consumeDetailForm.srr_charge_mode) == 2) {
        this.consumeDetailForm.srr_charge_rule_id = ''
      }
    },

    getRoomBookDetail () {
      const params = {
        currentRoomId: this.consumeDetailForm.srr_room_id,
        createOrderTime: this.$q_date.formatDate(this.createOrderTime, 'X'),
        bookDiyOrderDate: this.$q_date.formatDate(this.bookDiyOrderDate, 'X')
      }
      this.$store
        .dispatch('roomConsume/getRoomBookDetail', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (res.data.roomBookDetailData) {
              this.roomBookDetailData = res.data.roomBookDetailData
              this.charge_rule_id = res.data.roomBookDetailData.charge_rule_id
              this.consumeDetailForm.srr_charge_rule_id = res.data.roomBookDetailData.charge_rule_id
            }

            if (res.data.nowDayBookTimePeriod && res.data.nowDayBookTimePeriod.length > 0) {
              this.nowDayBookTimePeriod = res.data.nowDayBookTimePeriod
            }

            if (res.data.usedTimePeriod && res.data.usedTimePeriod.length > 0) {
              this.usedTimePeriod = res.data.usedTimePeriod
            }

            if (res.data.weekAllTimePeriod && res.data.weekAllTimePeriod.length > 0) {
              this.weekAllTimePeriod = res.data.weekAllTimePeriod
              this.bookDateDay = this.weekAllTimePeriod[0].dateTimestamp
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

    squareBg (key) {
      const nowDayBookTimePeriod = this.nowDayBookTimePeriod
      const newKey = key * 2

      const s = nowDayBookTimePeriod[newKey]

      const e = nowDayBookTimePeriod[newKey + 1]

      if (s && e) {
        // console.log(s.dayTimestampText, e.dayTimestampText, parseInt(s.bookStatus), parseInt(e.bookStatus))
        if (parseInt(s.bookStatus) == 1 && parseInt(e.bookStatus) == 1) {
          return 'book-time-square-kong'
        } else if (parseInt(s.bookStatus) == 4 && parseInt(e.bookStatus) == 4) {
          return 'book-time-square-fit'
        } else if (parseInt(s.bookStatus) == 2 && parseInt(e.bookStatus) == 1) {
          return 'book-time-square-right-half'
        } else if (parseInt(s.bookStatus) == 1 && parseInt(e.bookStatus) == 2) {
          return 'book-time-square-left-half'
        } else if (parseInt(s.bookStatus) == 4 && parseInt(e.bookStatus) == 1) {
          return 'book-time-square-right-half'
        } else if (parseInt(s.bookStatus) == 1 && parseInt(e.bookStatus) == 4) {
          return 'book-time-square-left-half'
        }
      }

      return 'book-time-square-kong'
    },

    checkTimestamp (item, i) {
      if (i.dayTimestamp >= this.createBookOrderTime && i.dayTimestamp <= this.endBookOrderTime) {
        return true
      }

      if (i.dayTimestamp == this.createBookOrderTime) {
        return true
      }

      if (i.dayTimestamp == this.endBookOrderTime) {
        return true
      }
      return false
    },

    clickTimeSelectState (i) {
      const that = this
      if (parseInt(i.bookStatus) == 2) {
        this.$q.notify({
          message: '失败',
          caption: '无法选择当前时间',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      if (i.dayTimestamp && !this.createBookOrderTime) {
        this.createBookOrderTime = i.dayTimestamp
      } else if (i.dayTimestamp == this.createBookOrderTime) {
        this.createBookOrderTime = ''
        this.endBookOrderTime = ''

        this.createOrderTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        this.leaveMerchantTime = ''
      } else if (i.dayTimestamp && this.createBookOrderTime) {
        if (i.dayTimestamp <= this.createBookOrderTime) {
          this.$q.notify({
            message: '失败',
            caption: '不可选择之前的时间',
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })

          return false
        }

        if (this.usedTimePeriod && this.usedTimePeriod.length > 0) {
          try {
            that.usedTimePeriod.forEach(item => {
              if (that.getTimePeriodRatio(item.s, item.e, that.createBookOrderTime, i.dayTimestamp)) {
                throw new Error('有占用')
              }
            })
          } catch (e) {
            this.$q.notify({
              message: '失败',
              caption: '中间有时间段已被占用',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          };
        }

        this.endBookOrderTime = i.dayTimestamp
        this.createOrderTime = this.$q_date.formatDate(this.createBookOrderTime * 1000, 'YYYY-MM-DD HH:mm')
        this.leaveMerchantTime = this.$q_date.formatDate(this.endBookOrderTime * 1000, 'YYYY-MM-DD HH:mm')
      }

      this.$nextTick(() => {
        this.computeRuleAmount()
      })
    },

    checkTimestampEnd (i, endBookOrderTime) {
      if (i.dayTimestamp >= this.createBookOrderTime && i.dayTimestamp <= endBookOrderTime) {
        return true
      }

      if (i.dayTimestamp == this.createBookOrderTime) {
        return true
      }

      if (i.dayTimestamp == endBookOrderTime) {
        return true
      }
      return false
    },

    changeBookOrderTime () {
      const nowTimestamp = this.$q_date.formatDate(new Date(), 'X')
      const createOrderTime = this.$q_date.formatDate(new Date(this.createOrderTime), 'X')

      if (createOrderTime < nowTimestamp) {
        this.$q.notify({
          message: '失败',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '不可小于当前时间',
          color: 'red'
        })
        this.createOrderTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        return false
      }
      const that = this
      if (parseInt(this.consumeDetailForm.srr_charge_package_id) > 0) {
        const index = _.findIndex(this.packageListListData, function (o) {
          return parseInt(o.id) == parseInt(that.consumeDetailForm.srr_charge_package_id)
        })
        if (index > -1) {
          this.checkPackage(this.packageListListData[index])
        }
      }

      this.$nextTick(() => {
        this.getRoomBookDetail()
      })
    },

    getChargePackageListData () {
      const params = {
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('chargePackage/getChargePackageListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.packageListListData = res.data ? res.data : []
            if (parseInt(this.consumeDetailForm.srr_charge_mode) == 2 && this.packageListListData && this.packageListListData.length > 0) {
              this.checkPackage(this.packageListListData[0])
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

    viewRuleDetailDialog () {
      this.ruleDetailStatus = true

      this.computeRuleAmount()

      this.$nextTick(() => {
        this.$refs.ruleDetailRef.init(this.consumeDetailForm.srr_charge_rule_id)
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

    // 读卡
    getMemberInfo (item) {
      this.consumeDetailForm.srr_member_id = item.id
      this.consumeDetailForm.srr_member_nickname = item.mem_memberName
      this.consumeDetailForm.srr_member_card_number = item.mem_memberCardNum
      this.consumeDetailForm.srr_member_phone_number = item.mem_memberMobile

      this.consumeDetailForm.srr_contact_person = item.mem_memberName
      this.consumeDetailForm.srr_contact_phone = item.mem_memberMobile
    },

    // 关闭开单页面
    closeOpenRoomDialog () {
      this.openRoomConsumeDialog = false
      this.$emit('closeOpenRoomDialog')
    },

    setBookRoomConsume () {
      this.$refs.bookRoomFormRef.validate().then((success) => {
        if (success) {
          // if (parseInt(this.consumeDetailForm.srr_charge_mode) == 2) {
          //   if (!this.consumeDetailForm.srr_charge_package_id) {
          //     this.$q.notify({
          //       message: '失败',
          //       caption: '请选择计费套餐',
          //       color: 'red',
          //       icon: 'ion-close-circle-outline',
          //       timeout: 500,
          //       position: 'top-right'
          //     })
          //     return false
          //   }
          // }
          this.consumeDetailForm.srr_start_time = this.$q_date.formatDate(this.createOrderTime, 'X')
          this.consumeDetailForm.srr_end_time = this.$q_date.formatDate(this.leaveMerchantTime, 'X')

          this.checkoutPageReceive = true
          const return_param = {
            ...this.consumeDetailForm,
            currentRoomId: this.currentRoomId
          }
          this.$nextTick(() => {
            this.paySuccessCallBack(return_param)
          })
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },

    paySuccessCallBack (params) {
      this.$store
        .dispatch('roomConsume/bookOrderSettleData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '预订成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.closeOpenRoomDialog()
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

    computeRuleAmount () {
      const leave_time = this.$q_date.formatDate(this.leaveMerchantTime, 'X')
      const charge_rule_id = this.consumeDetailForm.srr_charge_rule_id
      const start_time = this.$q_date.formatDate(this.createOrderTime, 'X')
      const srr_charge_package_id = this.consumeDetailForm.srr_charge_package_id

      const currentRoomId = this.consumeDetailForm.srr_room_id

      if (leave_time && (charge_rule_id || srr_charge_package_id) && start_time && currentRoomId) {
        const params = {
          currentRoomId,
          leave_time,
          charge_rule_id,
          start_time,
          charge_package_id: srr_charge_package_id,
          mode: 'book'
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
    },
    getTimePeriodRatio (a1, a2, b1, b2) {
      if (a1 <= b1) {
        if (a2 >= b2) {
          return 1
        } else {
          if (a2 > b1 && b2 > b1) {
            return this.formatAmount(1 / ((b2 - b1) / (a2 - b1)))
          }
        }
      } else {
        if (b2 > a1 && b2 > b1) {
          return this.formatAmount((1 - (($b2 - a1) / (b2 - b1))) * -1)
        }
      }
    }
  }
}
</script>
<style scoped>
.book-time-square-kong {
  width: 13px;
  height: 13px;
  border: 1px solid #3271ae;
}
.book-time-square-left-half {
  width: 13px;
  height: 13px;
  border: 1px solid #3271ae;
  background: linear-gradient(to left, #3271ae 50%, #fff 50%);
}
.book-time-square-right-half {
  width: 13px;
  height: 13px;
  border: 1px solid #3271ae;
  background: linear-gradient(to right, #3271ae 50%, #fff 50%);
}
.book-time-square-fit {
  width: 13px;
  height: 13px;
  background-color: #3271ae;
}
.book-date {
  border-radius: 100px;
  border: 1px solid #3271ae;
}
.book-date-disable {
  border-radius: 100px;
  border: 1px solid #bbb9b9;
}

</style>
