<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-px-xs full-height bg-white row" v-if="parseInt(reserveConfig.drc_status) == 1">
      <div class="col-12 col-md-10 q-pa-xs full-height">
        <q-calendar
          @change="onModelChanged"
          @click:date2="onClickDate2"
          @click:day:header2="onClickDayHeader2"
          @click:resource:day2="onClickResourceDay2"
          @click:resource:header2="onClickResourceHeader2"
          @expanded="onResourceExpanded"
          v-model="calendarDate"
          :view="calendarViewType"
          :resources="resourceData"
          bordered
          :resource-height="150"
          :interval-height="180"
          :resource-width="150"
          class="full-height"
          locale="zh-hans"
          :disabled-days="disabledDayArr"
        >
          <template #scheduler-resources-header="scope">
            <div class="full-width text-center row items-center justify-center" v-if="calendarViewType == 'day-scheduler'">
              <q-btn outline round class="color_cinnabar" @click="onChangeView" padding="xs" icon="las la-angle-left" />
            </div>
          </template>

          <template #scheduler-resource="{ resource /*, index */ }">
            <div class="full-width cursor-pointer">
              <div class="text-center  ">
                <span>{{ resource.start }}</span>
                <!-- <br />
                <span class="text-caption">
                  {{ calendarViewType == 'day-scheduler' ? '剩余预约人数：' : '可预约人数：' }}

                  <span class="text-subtitle1 text-weight-bold">{{ reserveCount(resource) }} </span>
                </span> -->
              </div>

              <div
                class="text-center q-mt-sm"
                @click="onClickResource2(resource)"
                v-if="calendarViewType == 'day-scheduler'"
              >
                <q-icon size="lg" name="las la-plus-circle" class="color_cinnabar"></q-icon>
              </div>
            </div>
          </template>

          <template #scheduler-resource-day="{ timestamp, /*, index */resource }">
            <div class="q-pa-xs row q-col-gutter-sm full-height items-center" v-if="calendarViewType == 'day-scheduler'">
              <template v-for="(item, key) in currentReserveDetail">
                <div class="col-2" v-if="resource.start == $q_date.formatDate(item.drr_start_date * 1000, 'HH:mm')">
                  <q-card class="q-pa-none" flat bordered>
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar>
                          <q-icon size="lg" class="color_cinnabar" name="las la-layer-group"></q-icon>
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ item.drr_desk_id == -1 ? '到店分配' :  (item.desk ? item.desk.dp_name : '')  }}</q-item-label>
                        <q-item-label caption>{{ item.drr_people_name }}</q-item-label>
                        <q-item-label caption>{{ item.drr_people_mobile }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-space />
                    <q-card-actions class="justify-around ">
                      <q-btn
                        flat
                        round
                        color="positive"
                        icon="las la-play-circle"
                        @click="setRecordAllow(item.id)"
                        v-if="parseInt(item.drr_status) == 1"
                      >
                        <q-tooltip>
                          接单
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        round
                        color="positive"
                        icon="las la-check-circle"
                        @click="setRecordComplete(item.id)"
                        v-if="parseInt(item.drr_status) == 2"
                      >
                        <q-tooltip>
                          完成
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="las la-times-circle"
                        @click="setRecordCancel(item.id)"
                        v-if="parseInt(item.drr_status) == 1 || parseInt(item.drr_status) == 2"
                      >
                        <q-tooltip>
                          撤单
                        </q-tooltip>
                      </q-btn>
                      <q-btn flat round color="primary" @click="viewReserveDetail(item)" icon="las la-eye">
                        <q-tooltip>
                          详情
                        </q-tooltip>
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </template>
            </div>
            <div class="q-pa-xs row q-col-gutter-sm full-height items-center" v-else>
              <template v-for="(item, key) in weekReserveCountData">
                <q-list class="full-width" v-if="resource.start == item.hour_minute && timestamp.day == item.day && timestamp.month == item.month && timestamp.year == item.year">
                  <q-item v-if="item.notAcceptQuantity > 0">
                    <q-item-section avatar>
                      <q-icon class="color_cinnabar" name="las la-bell-slash" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>未接单</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.notAcceptQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="item.waitQuantity > 0" />
                  <q-item v-if="item.waitQuantity > 0">
                    <q-item-section avatar>
                      <q-icon color="positive" name="las la-play-circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>已接单</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.waitQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="item.revokeQuantity > 0" />
                  <q-item v-if="item.revokeQuantity > 0">
                    <q-item-section avatar>
                      <q-icon color="red" name="las la-times-circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>已撤单</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.revokeQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="item.completeQuantity > 0" />
                  <q-item v-if="item.completeQuantity > 0">
                    <q-item-section avatar>
                      <q-icon color="primary" name="las la-check-circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>已完成</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.completeQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </div>
          </template>
        </q-calendar>
      </div>
      <div class="col-12 col-md-2  q-pa-xs q-pb-xl">

        <!-- <q-date v-model="calendarDate" mask="YYYY-MM-DD" minimal flat bordered /> -->
        <q-scroll-area class="fit full-height q-pb-md ">
          <q-scroller
            v-model="calendarDate"
            view="date"
            no-footer
            text-color="white"
            color="#006241"
            inner-text-color="white"
            inner-color="#006241"
            style="height: 200px;"
            locale="zh-hans"
          ></q-scroller>

          <q-list bordered padding v-if="currentReserveItem && currentReserveItem.id">
            <q-item-label header>预约信息</q-item-label>

            <q-item>
              <q-item-section>
                <q-item-label caption>预约时间</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">
                   {{ $q_date.formatDate(currentReserveItem.drr_start_date * 1000, 'YYYY-MM-DD HH:mm') }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item v-if="currentReserveItem.drr_member_id > 0">
              <q-item-section> <q-item-label caption>会员</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark" lines="2">
                  {{ currentReserveItem.prd_member_name }}（{{ currentReserveItem.prd_member_card_number }}）
                  </q-item-label>
              </q-item-section>
            </q-item> -->

            <q-item>
              <q-item-section> <q-item-label caption>联系人</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.drr_people_name }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>联系电话</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.drr_people_mobile }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>备注</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.drr_remark }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="parseInt(currentReserveItem.drr_status) == 4">
              <q-item-section> <q-item-label caption>取消备注</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.prd_cancel_remark }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item >
              <q-item-section> <q-item-label caption>桌号</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.desk ? currentReserveItem.desk.dp_name : '到店分配' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-list separator class="full-width q-mt-md" v-if="currentReserveItem.carRecord && currentReserveItem.carRecord.length > 0">
              <q-item-label header>菜单</q-item-label>

              <q-item :key="'item-' + key" v-for="(item, key) in currentReserveItem.carRecord">
                <q-item-section>{{ item.rdi_goo_name }}</q-item-section>
                <q-item-section side>
                  <q-icon color="purple" size="xs" name="las la-check-circle"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-list>
        </q-scroll-area>

        <div class="row q-gutter-sm ">
          <div class="col" v-if="parseInt(currentReserveItem.drr_status) < 3">
            <q-btn class="full-width " color="primary" outline @click="reserveDetailEdit(currentReserveItem)" label="修改" />
          </div>
          <div
            class="col"
            v-if="currentReserveItem.carRecord && currentReserveItem.carRecord.length > 0 && parseInt(currentReserveItem.prd_settle_invoice_id) <= 0"
          >
            <q-btn
              class="full-width bg_cinnabar text-white"
              unelevated
              :to="{ name: 'consume', query: { reserveId: currentReserveItem.id } }"
              label="去结账"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height row bg-white justify-center full-width " v-else>
      <q-card flat class="text-center">
        <q-card-section class="text-h6 text-red"> 未开启预约功能 </q-card-section>
        <q-card-section>
          <q-spinner-ball size="150px" class="color_cinnabar" />
        </q-card-section>
      </q-card>
    </div>

    <add-reserve ref="reserveEditRef" v-if="reserveDialogStatus" @dataList="getCurrentReserveDetail" />

  </div>
</template>
<script>

import AddReserve from './AddReserve'
export default {
  name: 'ReserveCalendar',
  components: {
    AddReserve
  },
  data () {
    return {
      resourceData: [],

      planDate: '',
      calendarDate: '',

      reserveDialogStatus: false,
      reserveConfig: {},
      goodsList: [],
      reserveItemData: [],
      currentReserveTime: '',
      currentReserveDetail: [],
      currentReserveItem: {},
      selectTimeStatus: true,
      calendarViewType: 'week-scheduler',
      weekReserveCountData: [],
      limitPeopleNumber: 0,
      disabledDayArr: [],
      limitWeek: []
    }
  },
  mounted () {},
  created () {
    const timeStamp = Date.now()
    // this.planDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.calendarDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')

    this.getReserveConfigData()
  },
  computed: {},
  methods: {
    getWeekReserveCount (start, end) {
      const that = this
      this.$store
        .dispatch('reserveorder/getWeekReserveCount', {
          start,
          end
        })
        .then((res) => {
          if (res.code == 200) {
            this.weekReserveCountData = res.data && res.data.weekReserveCountData ? res.data.weekReserveCountData : []

            that.disabledDayArr = res.data && res.data.disabledDayArr ? res.data.disabledDayArr : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取预约项目失败',
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

    getCurrentReserveDetail () {
      this.reserveDialogStatus = false
      this.$store
        .dispatch('reserveorder/getCurrentReserveDetail', {
          calendarDate: this.calendarDate
        })
        .then((res) => {
          if (res.code == 200) {
            this.currentReserveDetail = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取预约项目失败',
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

    clearTimeData () {
      this.reserveDialogStatus = false

      this.currentReserveItem = {}
      this.$nextTick(() => {
        this.getCurrentReserveDetail()
      })
    },

    checkGoodsData (item) {
      if (this.reserveItemData.indexOf(item.id) > -1) {
        this.reserveItemData.splice(this.reserveItemData.indexOf(item.id), 1)
      } else {
        this.reserveItemData.push(item.id)
      }
    },

    getReserveConfigData () {
      this.$store
        .dispatch('reserveorder/getConfig', {})
        .then((res) => {
          if (res.code == 200) {
            this.reserveConfig = res.data && res.data.reserveConfigInfo ? res.data.reserveConfigInfo : {}
            this.limitWeek = res.data && res.data.reserveConfigInfo && res.data.reserveConfigInfo.drc_week_limit ? res.data.reserveConfigInfo.drc_week_limit : []
            this.resourceData = this.reserveConfig && this.reserveConfig.drc_time_period ? this.reserveConfig.drc_time_period : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取预约项目失败',
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

    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    onModelChanged ({ start, end }) {
      if (this.calendarViewType == 'week-scheduler') {
        this.getWeekReserveCount(start.date, end.date)
      }
    },
    onClickDate2 (data) {
      console.log('click:date2:', data)
    },
    onClickDayHeader2 (data) {
      if (data && data.scope && data.scope.activeDate) {
        this.calendarViewType = 'day-scheduler'
        this.$nextTick(() => {
          this.getCurrentReserveDetail()
        })
      }
    },
    onChangeView (data) {
      // console.log('click:day:header2:', data)
      this.calendarViewType = 'week-scheduler'
    },
    onClickResourceDay2 (data, a) {
      console.log('click:resource:day2: ', data.scope.resource.limit_people_number)
    },

    reserveDetailEdit (data) {
      if (data && data.id) {
        this.reserveDialogStatus = true
        this.$nextTick(() => {
          this.$refs.reserveEditRef.edit(data.id)
        })
      }
    },

    viewReserveDetail (data) {
      this.currentReserveItem = data
      setTimeout(() => {
        this.reserveDialogStatus = false
      }, 1000)
    },

    onClickResource2 (resource) {
      this.reserveDialogStatus = true
      this.$nextTick(() => {
        this.$refs.reserveEditRef.init(this.calendarDate, resource.start)
      })
    },

    onClickResourceHeader2 (data) {
      console.log('click:resource:header2:', data)
    },

    onResourceExpanded (data) {
      console.log('expanded: ', data)
    },

    setRecordCancel (recordId) {
      this.$q
        .dialog({
          title: '提示',
          message: '确定撤销当前预约吗？',
          cancel: true
        })
        .onOk(() => {
          const data = {
            id: recordId,
            drr_status: 4
          }
          this.$store
            .dispatch('reserveorder/changeRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '提示',
                  caption: '已撤销预约!',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getCurrentReserveDetail()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getCurrentReserveDetail()
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
        })
    },
    setRecordComplete (recordId) {
      this.$q
        .dialog({
          title: '提示',
          message: '确定完成当前预约吗？',
          cancel: true
        })
        .onOk(() => {
          const data = {
            id: recordId,
            drr_status: 3
          }
          this.$store
            .dispatch('reserveorder/changeRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '提示',
                  caption: '已完成预约!',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getCurrentReserveDetail()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getCurrentReserveDetail()
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
        })
    },
    setRecordAllow (recordId) {
      this.$q
        .dialog({
          title: '提示',
          message: '确定接受当前预约吗？',
          cancel: true
        })
        .onOk(() => {
          const data = {
            id: recordId,
            drr_status: 2
          }
          this.$store
            .dispatch('reserveorder/changeRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '提示',
                  caption: '当前预约已接受!',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getCurrentReserveDetail()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getCurrentReserveDetail()
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
        })
    }
  }
}
</script>

<style lang="sass">
.calendar-container
  position: relative

.my-event
  width: 100%
  position: absolute
  font-size: 12px

.full-width
  left: 0
  width: 100%

.left-side
  left: 0
  width: 49.75%

.right-side
  left: 50.25%
  width: 49.75%

.selected-border
  border: 1px solid #B93A26

.my-resource-header
  display: flex
  flex-direction: row
  flex: 1
  justify-content: center
  align-items: center
  position: relative
  font-size: 10px
  font-weight: 700
</style>
