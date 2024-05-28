<template>
  <div>
    <q-btn color="primary" @click="init(params.data.id)" flat  label="说明">
      <q-menu>
        <q-card
          :style="{
            width: this.$q.screen.width * 0.5 + 'px',
            'min-width': this.$q.screen.width * 0.5 + 'px',
          }"
        >
          <q-card-section class="full-height">
            <q-form ref="roomGroupDataRef" class="row q-col-gutter-sm">

              <div class="col-6">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label caption>开单后：</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-dark">
                      <span class="text-subtitle2 text-primary"> {{ roomGroupData.qcr_begin_limit_minutes }} </span>分钟之内，
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark">
                      按 <span class="text-subtitle2 text-primary">{{ roomGroupData.qcr_begin_limit_amount }}</span> 元
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="parseInt(roomGroupData.qcr_type) == 1">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label caption>计费方式</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-dark">
                      按小时计费: 每小时 <span class="text-subtitle2 text-primary">{{ oneHourConfig.everyHourAmount }}</span
                      >元；
                      <span v-if="parseInt(oneHourConfig.exceedOneHourType) == 1">消费超出1小时，按实际分钟数计费。</span>
                      <span v-if="parseInt(oneHourConfig.exceedOneHourType) == 2">
                        <span class="text-subtitle2 text-primary">{{ oneHourConfig.freeMinutes }}</span>
                        分钟之内免费； 超过
                        <span class="text-subtitle2 text-primary">{{ oneHourConfig.freeMinutes }}</span>
                        分钟至
                        <span class="text-subtitle2 text-primary">{{ oneHourConfig.exceedMinutes }}</span>
                        分钟，按
                        <span class="text-subtitle2 text-primary">{{ oneHourConfig.cycleMinutes }}</span>
                        分钟计费；超过
                        <span class="text-subtitle2 text-primary">{{ oneHourConfig.exceedMinutes }}</span>
                        分钟，按
                        <span class="text-subtitle2 text-primary">{{ oneHourConfig.cycleMinutes }} </span>
                        分钟计费；
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="parseInt(roomGroupData.qcr_type) == 2">
                <q-item class="bg-grey-2">
                  <q-item-section avatar>
                    <q-item-label caption>计费方式</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-dark">
                      按包段计费: 每
                      <span class="text-subtitle2 text-primary">{{ qcrTimePeriodConfig.setHourAmount }}</span>
                      小时
                      <span class="text-subtitle2 text-primary">{{ qcrTimePeriodConfig.everyHourAmount }}</span>
                      元；
                      <span v-if="parseInt(qcrTimePeriodConfig.exceedOneHourType) == 1">
                        消费超出{{ qcrTimePeriodConfig.setHourAmount }}小时，按实际分钟数计费。
                      </span>
                      <span v-if="parseInt(qcrTimePeriodConfig.exceedOneHourType) == 2">
                        消费超出{{ qcrTimePeriodConfig.setHourAmount }}小时，按每
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.exceedEveryHourAmount }}
                        </span>
                        分钟
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.exceedHourAmount }}
                        </span>
                        元
                      </span>
                      <span v-if="parseInt(qcrTimePeriodConfig.exceedOneHourType) == 3">
                        消费超出<span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.setHourAmount }}
                        </span>
                        小时，按每小时
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.everyHourAmount }}
                        </span>
                        元计费，超出的分钟数按区间计费。
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.freeMinutes }}
                        </span>
                        分钟之内免费； 超过
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.freeMinutes }}
                        </span>
                        分钟至
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.exceedMinutes }}
                        </span>
                        分钟，按
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.cycleMinutes }}
                        </span>
                        分钟计费；超过
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.exceedMinutes }}
                        </span>
                        分钟，按
                        <span class="text-subtitle2 text-primary">
                          {{ qcrTimePeriodConfig.cycleMinutes }}
                        </span>
                        分钟计费；
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="parseInt(roomGroupData.qcr_type) == 3">
                <q-item class="bg-grey-2 q-mb-sm">
                  <q-item-section avatar>
                    <q-item-label caption>计费方式</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark">按包段计费</q-item-label>
                  </q-item-section>
                </q-item>
                <q-markup-table separator="cell" flat bordered>
                  <thead>
                    <tr>
                      <th class="text-center">场次</th>
                      <th class="text-center">时间段</th>
                      <th class="text-center">金额</th>
                      <th class="text-center">清洁场次</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(i, k) in fullSessionConfig.sessionList" :key="k">
                      <td class="text-center">场次 {{ k + 1 }}</td>
                      <td class="text-center">
                        <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.startTime] }}</span> 至
                        <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.endtime] }}</span>
                      </td>
                      <td class="text-center">
                        <span class="text-subtitle2 text-primary">{{ i.useAmount }}</span> 元
                      </td>
                      <td class="text-center">{{ parseInt(i.isMaintain) == 1 ? '清洁场次' : '正常' }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>

                <q-item class="bg-grey-2 q-mt-sm">
                  <q-item-section avatar>
                    <q-item-label caption>跨场的计费方式</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-dark">
                      <span v-if="parseInt(fullSessionConfig.exceedOneHourType) == 1">
                        {{ fullSessionConfig.oneFreeMinutes }}分钟之内免费； 超过{{ fullSessionConfig.oneFreeMinutes }}分钟加收下一场包场费用；
                      </span>
                      <span v-if="parseInt(fullSessionConfig.exceedOneHourType) == 2">
                        消费超出1个场次，按实际分钟数计费。每小时
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.exceedHourAmount }}
                        </span>
                        元
                      </span>
                      <span v-if="parseInt(fullSessionConfig.exceedOneHourType) == 3">
                        消费超出1个场次，按每小时
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.exceedHourAmount }}
                        </span>
                        元计费，超出的分钟数按区间计费。
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.freeMinutes }}
                        </span>
                        分钟之内免费； 超过
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.freeMinutes }}
                        </span>
                        分钟至
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.exceedMinutes }}
                        </span>
                        分钟，按
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.cycleMinutes }}
                        </span>
                        分钟计费；超过
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.exceedMinutes }}
                        </span>
                        分钟，按
                        <span class="text-subtitle2 text-primary">
                          {{ fullSessionConfig.cycleMinutes }}
                        </span>
                        分钟计费；
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="parseInt(roomGroupData.qcr_type) == 4">
                <q-item class="bg-grey-2 q-mb-sm">
                  <q-item-section>
                    <q-item-label caption>计费方式</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark">分时段计费</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark">
                      <q-chip color="primary" v-if="parseInt(timeSectionConfig.timeType) == 1" text-color="white" dense> 分时段按小时计费 </q-chip>
                      <q-chip color="positive" v-if="parseInt(timeSectionConfig.timeType) == 2" text-color="white" dense> 分时段按包段计费 </q-chip>
                      <q-chip color="orange" v-if="parseInt(timeSectionConfig.timeType) == 3" text-color="white" dense> 分时段按分钟计费 </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="bg-grey-2 q-mb-sm" v-if="parseInt(timeSectionConfig.timeType) == 2">
                  <q-item-section>
                    <q-item-label>
                      消费
                      <span class="text-subtitle2 text-primary">
                        {{ timeSectionConfig.periodHoursInner }}
                      </span>
                      小时内，按每小时
                      <span class="text-subtitle2 text-primary">
                        {{ timeSectionConfig.periodEveryHoursInner }}
                      </span>
                      元计算，超过
                      <span class="text-subtitle2 text-primary">
                        {{ timeSectionConfig.periodHoursInner }}
                      </span>
                      小时按照包段计费。
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <div v-if="parseInt(timeSectionConfig.timeType) == 1">
                  <q-markup-table separator="cell" flat bordered>
                    <thead>
                      <tr>
                        <th class="text-center">场次</th>
                        <th class="text-center">时间段</th>
                        <th class="text-center">金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(i, k) in timeSectionConfig.sessionList" :key="k">
                        <td class="text-center">场次 {{ k + 1 }}</td>
                        <td class="text-center">
                          <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.startTime] }}</span> 至
                          <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.endtime] }}</span>
                        </td>
                        <td class="text-center">
                          每小时 <span class="text-subtitle2 text-primary">{{ i.useAmount }}</span> 元
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
                <div v-if="parseInt(timeSectionConfig.timeType) == 2">
                  <q-markup-table separator="cell" flat bordered>
                    <thead>
                      <tr>
                        <th class="text-center">场次</th>
                        <th class="text-center">时间段</th>
                        <th class="text-center">金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(i, k) in timeSectionConfig.timeFrameList" :key="k">
                        <td class="text-center">场次 {{ k + 1 }}</td>
                        <td class="text-center">
                          <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.startTime] }}</span> 至
                          <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.endtime] }}</span>
                        </td>
                        <td class="text-center">
                          每
                          <span class="text-subtitle2 text-primary">
                            {{ i.everyHour }}
                          </span>
                          小时
                          <span class="text-subtitle2 text-primary">
                            {{ i.useAmount }}
                          </span>
                          元
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
                <div v-if="parseInt(timeSectionConfig.timeType) == 3">
                  <q-markup-table separator="cell" flat bordered>
                    <thead>
                      <tr>
                        <th class="text-center">场次</th>
                        <th class="text-center">时间段</th>
                        <th class="text-center">金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(i, k) in timeSectionConfig.timeMinutesList" :key="k">
                        <td class="text-center">场次 {{ k + 1 }}</td>
                        <td class="text-center">
                          <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.startTime] }}</span> 至
                          <span class="text-subtitle2 text-primary">{{ fortyEightHourText[i.endtime] }}</span>
                        </td>
                        <td class="text-center">
                          每
                          <span class="text-subtitle2 text-primary">
                            {{ i.everyMinute }}
                          </span>
                          分钟
                          <span class="text-subtitle2 text-primary">
                            {{ i.useAmount }}
                          </span>
                          元
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>

                <q-item class="bg-grey-2 q-mt-sm" v-if="parseInt(timeSectionConfig.timeType) == 3">
                  <q-item-section avatar>
                    <q-item-label caption>超出分钟数的计费方式</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-dark">
                      <span class="text-subtitle2 text-primary">
                        {{ timeSectionConfig.exceedMinutesInner }}
                      </span>
                      分钟内，按每分钟
                      <span class="text-subtitle2 text-primary">
                        {{ timeSectionConfig.exceedMinutesAmount }}
                      </span>
                      元计算，超过
                      <span class="text-subtitle2 text-primary">
                        {{ timeSectionConfig.exceedMinutesInner }}
                      </span>
                      分钟按分钟段计算。
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="bg-grey-2 q-mt-sm" v-if="parseInt(timeSectionConfig.timeType) == 1 || parseInt(timeSectionConfig.timeType) == 2">
                  <q-item-section avatar>
                    <q-item-label caption>跨时段计费方式</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-dark">
                      <span v-if="parseInt(timeSectionConfig.exceedOneHourType) == 1"> 消费超出时段，按实际分钟数计费。 </span>

                      <span v-if="parseInt(timeSectionConfig.exceedOneHourType) == 3">
                        消费超出时段，按超出分钟数区间计费。

                        <span class="text-subtitle2 text-primary">
                          {{ timeSectionConfig.freeMinutes }}
                        </span>
                        分钟之内免费； 超过
                        <span class="text-subtitle2 text-primary">
                          {{ timeSectionConfig.freeMinutes }}
                        </span>
                        分钟至
                        <span class="text-subtitle2 text-primary">
                          {{ timeSectionConfig.exceedMinutes }}
                        </span>
                        分钟，按
                        <span class="text-subtitle2 text-primary">
                          {{ timeSectionConfig.cycleMinutes }}
                        </span>
                        分钟计费；超过
                        <span class="text-subtitle2 text-primary">
                          {{ timeSectionConfig.exceedMinutes }}
                        </span>
                        分钟计费；超过
                        <span class="text-subtitle2 text-primary">
                          {{ timeSectionConfig.cycleMinutes }}
                        </span>
                        分钟计费；
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="extraAmountConfig && parseInt(extraAmountConfig.status) == 1">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label caption>加收服务费</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-dark">
                      <span class="text-subtitle2 text-primary">{{ fortyEightHourText[extraAmountConfig.startTime] }}</span> - 至 -
                      <span class="text-subtitle2 text-primary">{{ fortyEightHourText[extraAmountConfig.endtime] }}</span>

                      <span v-if="extraAmountConfig && parseInt(extraAmountConfig.userType) == 1">
                        开单后：<span class="text-subtitle2 text-primary">{{ extraAmountConfig.exceedMinutesInner }} </span>分钟之内，按
                        <span class="text-subtitle2 text-primary">{{ extraAmountConfig.exceedMinutesAmount }}</span> 元收费
                      </span>

                      <span v-if="extraAmountConfig && parseInt(extraAmountConfig.userType) == 2">
                        每小时<span class="text-subtitle2 text-primary"> {{ extraAmountConfig.everyHourAmount }} </span>元
                        <span class="text-subtitle2 text-primary"> {{ extraAmountConfig.freeMinutes }}</span> 分钟之内免费； 超过
                        <span class="text-subtitle2 text-primary"> {{ extraAmountConfig.freeMinutes }}</span> 分钟至
                        <span class="text-subtitle2 text-primary"> {{ extraAmountConfig.exceedMinutes }}</span> 分钟，按
                        <span class="text-subtitle2 text-primary"> {{ extraAmountConfig.cycleMinutes }}</span> 分钟计费
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'RuleDetail',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      roomGroupData: {
        qcr_name: '',
        qcr_max_amount: '',
        qcr_type: '1',
        qcr_begin_limit_minutes: '0',
        qcr_begin_limit_amount: '0',
        qcr_one_hour_config: {},
        qcr_time_period_config: {},
        qcr_full_session_config: {},
        qcr_extra_amount_config: {},
        qcr_time_section_config: {},
        qcr_status: '1'
      },

      roomGroupId: 0,
      oneHourConfig: {
        everyHourAmount: '',
        exceedOneHourType: '1',
        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30'
      },
      qcrTimePeriodConfig: {
        exceedOneHourType: '1',
        setHourAmount: '8',
        everyHourAmount: '15',
        exceedEveryHourAmount: '3',
        exceedHourAmount: '0',
        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30'
      },
      fullSessionConfig: {
        sessionList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0,
            isMaintain: 0
          }
        ],
        exceedOneHourType: '1',
        setHourAmount: '8',
        everyHourAmount: '15',
        exceedEveryHourAmount: '3',
        exceedHourAmount: '0',
        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30',
        oneFreeMinutes: '30'
      },
      timeSectionConfig: {
        timeType: '1',
        sessionList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0
          }
        ],
        timeFrameList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0,
            everyHour: 4
          }
        ],

        timeMinutesList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0,
            everyMinute: 5
          }
        ],

        periodHoursInner: '1',
        periodEveryHoursInner: '0',

        exceedOneHourType: '1',

        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30',
        oneFreeMinutes: '30',

        exceedMinutesInner: 0,
        exceedMinutesAmount: '0'
      },
      extraAmountConfig: {
        status: 0,
        startTime: 0,
        endtime: 24,

        userType: '1',
        exceedMinutesInner: 0,
        exceedMinutesAmount: '0',

        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30',
        oneFreeMinutes: '30',

        everyHourAmount: '0'
      },

      fiftyNineMinutes: [],
      sixtyMinutes: [],
      fortyEightMinutes: [],
      twentyFourMinutes: [],
      wholeDayHour: [],
      fortyEightHourText: {}
    }
  },
  created () {
    for (var i = 1; i <= 59; i++) {
      this.fiftyNineMinutes.push(i)
    }

    for (var i = 1; i <= 60; i++) {
      this.sixtyMinutes.push(i)
    }

    for (var i = 0; i < 24; i++) {
      this.twentyFourMinutes.push({
        label: i + '点',
        value: i
      })
      this.fortyEightMinutes.push({
        label: i + '点',
        value: i
      })
      this.fortyEightHourText[i] = i + '点'
    }

    for (var i = 1; i <= 24; i++) {
      this.wholeDayHour.push(i)
    }

    for (var i = 0; i < 24; i++) {
      this.fortyEightMinutes.push({
        label: '次日' + i + '点',
        value: i + 24
      })
      this.fortyEightHourText[i + 24] = '次日' + i + '点'
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true

      this.roomGroupId = id
      if (id > 0) {
        this.getItem()
      }
    },

    getItem () {
      this.$store
        .dispatch('chargeRule/getRoomGroupItem', this.roomGroupId)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.roomGroupData = res.data
            if (this.roomGroupData && this.roomGroupData.qcr_one_hour_config) {
              this.oneHourConfig = this.roomGroupData.qcr_one_hour_config
            }
            if (this.roomGroupData && this.roomGroupData.qcr_time_period_config) {
              this.qcrTimePeriodConfig = this.roomGroupData.qcr_time_period_config
            }
            if (this.roomGroupData && this.roomGroupData.qcr_full_session_config) {
              this.fullSessionConfig = this.roomGroupData.qcr_full_session_config
            }

            if (this.roomGroupData && this.roomGroupData.qcr_time_section_config) {
              this.timeSectionConfig = this.roomGroupData.qcr_time_section_config
            }

            if (this.roomGroupData && this.roomGroupData.qcr_extra_amount_config) {
              this.extraAmountConfig = this.roomGroupData.qcr_extra_amount_config
            }
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

    editData () {
      this.showDialog = false
      this.$emit('editRuleData', this.roomGroupId)
    },

    hideNowPage () {
      this.roomGroupData.id = ''
      this.roomGroupData = {
        dt_name: '',
        dt_sort: '0',
        dt_box_price: '0',
        dt_description: '',
        dt_min_consume: '0',
        dt_extra_consume: '0',
        dt_deposit: '0'
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
