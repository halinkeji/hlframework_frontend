<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-px-xs full-height bg-white row" v-if="parseInt(reserveConfig.src_status) == 1">
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
          :resources="todayAllMinutes"
          bordered
          :resource-height="calendarViewType == 'week-scheduler' ? 230 : 50"
          :interval-height="180"
          :resource-width="150"
          class="full-height book-calendar-day"
          locale="zh-hans"
          :weekdays="weekdaysConfig"

        >
          <template #scheduler-resources-header="scope">
            <div class="full-width text-center row items-center justify-center" v-if="calendarViewType == 'day-scheduler'">
              <q-btn outline round class="color_cinnabar" @click="onChangeView" padding="xs" icon="las la-angle-left" />
            </div>
          </template>
          <template  #scheduler-resource="{ resource /*, index */ }">
            <div class="full-width cursor-pointer text-white full-height  " style="padding:0 !important"  @click="clickBookRoom(resource)" :class="{
              'bg-white text-dark': calendarViewType == 'week-scheduler',
              'bg-grey-5 text-white' : resource.dayTimestamp < nowTimestamp,
              'bg-blue text-white' : resource.dayTimestamp >= nowTimestamp,
            }">
              <div class="text-center full-height items-center row justify-center " :class="calendarViewType == 'week-scheduler' ? 'text-dark' : 'text-white'">
                <span>{{ resource.hourTimestampText }}</span>
              </div>
            </div>
          </template>

          <template #scheduler-resource-day="{ timestamp, /*, index */ resource }">
            <div class="row full-height q-gutter-x-sm" v-if="calendarViewType == 'day-scheduler'">
              <div class="col-1 full-height" @click="viewReserveDetail(i)" v-for="(i, k) in resource.arr">
                <div
                  class="text-center bg-primary text-white flex flex-center"
                  :style="`height: ${i.timePeriodRatio * (i.timePeriodRatio < 0 ? -100 : 100)}%;margin-top:${i.timePeriodRatio < 0 ? 50 * (i.timePeriodRatio * -1) : 0}px`"
                >
                  {{ i.roomData ? i.roomData.qrt_name : '' }}
                </div>
              </div>
            </div>
            <div class="q-pa-xs row q-col-gutter-sm full-height text-dark items-center text-center" v-else>
              <template v-for="(item, key) in weekReserveCountData">
                <div
                  class="text-center full-width"
                  v-if="
                    parseInt(timestamp.year) == parseInt(item.year) &&
                    parseInt(timestamp.month) == parseInt(item.month) &&
                    parseInt(timestamp.day) == parseInt(item.day)
                  "
                >
                  <div v-if="parseInt(resource.type) == 1">
                    <q-chip dense color="primary" text-color="white">
                      {{ item.n_count }}
                    </q-chip>
                  </div>
                  <div v-if="parseInt(resource.type) == 3">
                    <q-chip dense color="positive" text-color="white">
                      {{ item.s_count }}
                    </q-chip>
                  </div>
                  <div class="text-center full-width" v-if="parseInt(resource.type) == 4">
                    <q-chip dense color="red" text-color="white">
                      {{ item.e_count }}
                    </q-chip>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </q-calendar>
      </div>
      <div class="col-12 col-md-2 q-pa-xs q-pb-xl">
        <!-- <q-date v-model="calendarDate" mask="YYYY-MM-DD" minimal flat bordered /> -->
        <q-scroll-area class="fit full-height q-pb-md">
          <q-scroller
            v-model="calendarDate"
            view="date"
            no-footer
            text-color="white"
            color="#3271AE"
            inner-text-color="white"
            inner-color="#3271AE"
            style="height: 200px"
            locale="zh-hans"
            @input="changeCalendarDate"
          ></q-scroller>

          <q-list bordered padding v-if="currentReserveItem && currentReserveItem.id">
            <q-item-label header>预订信息</q-item-label>

             <q-item>
              <q-item-section> <q-item-label caption>状态</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">

                    <q-chip color="lime" text-color="white" v-if="currentReserveItem.srr_status == -1">待支付</q-chip>
                    <q-chip color="primary" text-color="white" v-if="currentReserveItem.srr_status == 1 && currentReserveItem.srr_start_time > nowTimestamp">待使用</q-chip>
                    <q-chip color="positive" text-color="white" v-if="(currentReserveItem.srr_status == 1 && currentReserveItem.srr_start_time <= nowTimestamp && currentReserveItem.srr_end_time > nowTimestamp) ||  currentReserveItem.srr_status == 2">使用中</q-chip>
                    <q-chip color="blue-grey" text-color="white" v-if="currentReserveItem.srr_status == 3">

                       已完成

                    </q-chip>
                    <q-chip color="grey" text-color="white" v-else-if="currentReserveItem.srr_status == 4 ">
                     已撤销
                    </q-chip>
                    <q-chip color="grey" text-color="white" v-else-if="currentReserveItem.srr_end_time < nowTimestamp ">
                     已撤销
                    </q-chip>
                  </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>预订开始时间</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ $q_date.formatDate(currentReserveItem.srr_start_time * 1000, 'YYYY-MM-DD  HH:mm') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>预订结束时间</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ $q_date.formatDate(currentReserveItem.srr_end_time * 1000, 'YYYY-MM-DD  HH:mm') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>预订桌台</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.roomData ? currentReserveItem.roomData.qrt_name : '' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>到店人数</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.srr_people_number }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="currentReserveItem.srr_member_id > 0">
              <q-item-section> <q-item-label caption>会员</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark" lines="2">
                  {{ currentReserveItem.srr_member_nickname }}（{{ currentReserveItem.srr_member_card_number }}）
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="currentReserveItem.srr_reward_id > 0">
              <q-item-section> <q-item-label caption>员工</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.user ? currentReserveItem.user.pru_name : '' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>应付金额</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.srr_room_normal_amount }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>实付金额</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.srr_room_total_amount }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div class="row q-gutter-sm">
          <!-- <div class="col">
            <q-btn class="full-width " color="positive" unelevated :disable="(parseInt(currentReserveItem.srr_status) == 1 && currentReserveItem.srr_end_time < nowTimestamp) ? false : true"  @click="reserveDetailEdit(currentReserveItem)" label="修改" />
          </div> -->
          <div class="col" v-if="parseInt(currentReserveItem.srr_status) == 1 &&  nowTimestamp <= currentReserveItem.srr_end_time  ">
            <q-btn
              class="full-width bg-grey text-white"
              unelevated
              @click="cancelBookOrder(currentReserveItem.id)"
              label="取消"
            />
          </div>
          <div class="col" v-if="currentReserveItem && currentReserveItem.id" >
            <q-btn
              class="full-width bg-primary text-white"
              :disable="(parseInt(currentReserveItem.srr_status) == 1 && currentReserveItem.srr_start_time <= nowTimestamp && nowTimestamp <= currentReserveItem.srr_end_time) ? false : true"
              unelevated
              @click="clickOpenRoom(currentReserveItem.id)"
              label="去开台"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height row bg-white justify-center full-width" v-else>
      <q-card flat class="text-center">
        <q-card-section class="text-h6 text-red"> 未开启预订功能 </q-card-section>
        <q-card-section>
          <q-spinner-ball size="150px" class="color_cinnabar" />
        </q-card-section>
      </q-card>
    </div>

    <room-book ref="roomBoolDialogRef" v-if="roomBookDialogStatus" @closeOpenRoomDialog="closeOpenRoomDialog" />

    <select-room-group ref="selectRoomGroupDialogRef" v-if="selectRoomGroupStatus" @clickBookRoom="roomBookDialogOperate" @closeBookRoomDialog="selectRoomGroupStatus = false" />
  </div>
</template>
<script>

import RoomBook from './RoomBook.vue'
import SelectRoomGroup from '../SelectRoomGroup'
export default {
  name: 'ReserveCalendar',
  components: {
    RoomBook,
    SelectRoomGroup
  },
  data () {
    return {
      todayAllMinutes: [],
      reserveDataForm: {
        prd_date: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_time_year: '',
        prd_time_month: '',
        prd_time_day: '',
        prd_time_hour: '',
        prd_time_minute: '',
        prd_time_second: '',
        prd_people_name: '',
        prd_people_mobile: '',
        prd_remark: '',
        prd_user_id: '0',
        srr_status: '2'
      },
      planDate: '',
      calendarDate: '',

      userData: [],
      reserveConfig: {},
      goodsList: [],
      reserveItemData: [],
      currentReserveDetail: [],
      currentReserveItem: {},
      selectTimeStatus: true,
      calendarViewType: 'week-scheduler',
      weekReserveCountData: [],
      limitPeopleNumber: 0,
      defaultResource: [
        {
          hourTimestampText: '待使用',
          type: 1
        },
        {
          hourTimestampText: '已完成',
          type: 3
        },
        {
          hourTimestampText: '已取消',
          type: 4
        }
      ],
      nowTimestamp: 0,
      roomBookDialogStatus: false,
      selectRoomGroupStatus: false,
      weekdaysConfig: []
    }
  },
  mounted () {
    this.getReserveConfigData()
  },
  created () {
    const timeStamp = Date.now()
    // this.planDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.calendarDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.nowTimestamp = this.$q_date.formatDate(timeStamp, 'X')
    this.changeCalendarDate()
  },
  computed: {},
  methods: {
    changeCalendarDate () {
      let week = this.$q_date.formatDate(this.calendarDate, 'E')
      week = week == 7 ? 0 : week

      this.setWeekConfig(week)
    },
    setWeekConfig (week) {
      if (parseInt(week) == 0) {
        this.weekdaysConfig = [0, 1, 2, 3, 4, 5, 6]
      } else if (parseInt(week) == 1) {
        this.weekdaysConfig = [1, 2, 3, 4, 5, 6, 0]
      } else if (parseInt(week) == 2) {
        this.weekdaysConfig = [2, 3, 4, 5, 6, 0, 1]
      } else if (parseInt(week) == 3) {
        this.weekdaysConfig = [3, 4, 5, 6, 0, 1, 2]
      } else if (parseInt(week) == 4) {
        this.weekdaysConfig = [4, 5, 6, 0, 1, 2, 3]
      } else if (parseInt(week) == 5) {
        this.weekdaysConfig = [5, 6, 0, 1, 2, 3, 4]
      } else if (parseInt(week) == 6) {
        this.weekdaysConfig = [6, 0, 1, 2, 3, 4, 5]
      }
    },
    roomBookDialogOperate (currentRoomId, currentRoomData, currentRoomName, dayTimestamp) {
      this.roomBookDialogStatus = true

      this.$nextTick(() => {
        this.$refs.roomBoolDialogRef.init(currentRoomId, currentRoomData, currentRoomName, dayTimestamp)
      })
    },
    closeOpenRoomDialog () {
      this.selectRoomGroupStatus = false
      this.roomBookDialogStatus = false
      this.$nextTick(() => {
        this.getCurrentReserveDetail()
      })
    },
    getReserveConfigData () {
      this.$store
        .dispatch('bookManage/getBookManageConfig', {})
        .then((res) => {
          if (res.code == 200) {
            this.reserveConfig = res.data && res.data.reserveConfig ? res.data.reserveConfig : {}

            this.todayAllMinutes = this.defaultResource
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取预订项目失败',
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

    getWeekReserveCount (start, end) {
      this.$store
        .dispatch('bookManage/getWeekReserveCount', {
          start,
          end
        })
        .then((res) => {
          if (res.code == 200) {
            this.weekReserveCountData = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取预订项目失败',
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
      this.$store
        .dispatch('bookManage/getCurrentReserveDetail', {
          currentDateTime: this.$q_date.formatDate(this.calendarDate, 'X')
        })
        .then((res) => {
          if (res.code == 200) {
            this.currentReserveDetail = res.data && res.data.currentReserveDetail && res.data.currentReserveDetail.length > 0 ? res.data.currentReserveDetai : []
            this.todayAllMinutes = res.data && res.data.todayAllMinutes && res.data.todayAllMinutes.length > 0 ? res.data.todayAllMinutes : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取预订项目失败',
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

    reserveCount (resource) {
      if (resource && resource.limit_people_number && resource.limit_people_number > 0) {
        let count = 0

        const calendarDate = this.calendarDate

        const y = this.$q_date.formatDate(calendarDate, 'YYYY')
        const m = this.$q_date.formatDate(calendarDate, 'M')
        const d = this.$q_date.formatDate(calendarDate, 'DD')
        const currentReserveDetail = this.currentReserveDetail
        if (currentReserveDetail && currentReserveDetail.length > 0) {
          currentReserveDetail.forEach((item, key) => {
            if (d == item.prd_time_day && m == item.prd_time_month && y == item.prd_time_year) {
              if (parseInt(item.srr_status) < 4) {
                if (resource.time_hour_minute == item.prd_time_hour + ':' + item.prd_time_minute) {
                  count++
                }
              }
            }
          })
        }
        return resource.limit_people_number - count
      }
    },

    clearTimeData () {
      this.reserveDialogStatus = false
      this.reserveDataForm = {
        prd_date: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_time_year: '',
        prd_time_month: '',
        prd_time_day: '',
        prd_time_hour: '',
        prd_time_minute: '',
        prd_time_second: '',
        prd_people_name: '',
        prd_people_mobile: '',
        prd_remark: '',
        prd_user_id: '0',
        srr_status: '2'
      }
      this.currentReserveItem = {}
      this.$nextTick(() => {
        this.getCurrentReserveDetail()
      })
    },

    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.reserveDataForm.prd_member_id = val.id
          this.reserveDataForm.prd_member_name = val.mem_memberName
          this.reserveDataForm.prd_member_mobile = val.mem_memberMobile
          this.reserveDataForm.prd_member_card_number = val.mem_memberCardNum
          if (!this.reserveDataForm.prd_people_name) {
            this.reserveDataForm.prd_people_name = val.mem_memberRealName
          }
          if (!this.reserveDataForm.prd_people_mobile) {
            this.reserveDataForm.prd_people_mobile = val.mem_memberMobile
          }
        }
      }
    },

    checkGoodsData (item) {
      if (this.reserveItemData.indexOf(item.id) > -1) {
        this.reserveItemData.splice(this.reserveItemData.indexOf(item.id), 1)
      } else {
        this.reserveItemData.push(item.id)
      }
    },

    setGoodsList (item, type, status) {
      if (type == 'user') {
        this.reserveDataForm.prd_user_id = item.id
        if (item.goodsLinkArray && item.goodsLinkArray.length > 0) {
          this.goodsList = item.goodsLinkArray
        } else {
          this.goodsList = []
        }
      }

      if (status == 'change') {
        this.reserveItemData = []
      }
    },

    clickOpenRoom (order_id) {
      this.$q
        .dialog({
          title: '提示',
          message: '立即开台',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('bookManage/openRoomConsumeData', {
              order_id
            })
            .then((res) => {
              if (res.code == 200 && res.data && res.data.id) {
                this.$q.dialog({
                  title: '提示',
                  message: '开台成功，是否跳转营业消费?',
                  ok: {
                    push: true
                  },
                  cancel: {
                    push: true,
                    color: 'negative'
                  },
                  persistent: true
                }).onOk(() => {
                  this.$router.push({ name: 'roomConsume', query: { rcId: res.data.id } })
                }).onCancel(() => {
                  this.getCurrentReserveDetail()
                }).onDismiss(() => {

                })
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
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
        })
    },

    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    onModelChanged ({ start, end }) {
      console.log('start', start, 'end', end)
      if (this.calendarViewType == 'week-scheduler') {
        this.getWeekReserveCount(start.date, end.date)
      }
    },
    onClickDate2 (data) {
      console.log('click:date2:', data)
    },
    onClickDayHeader2 (data) {
      // console.log('click:day:header2:', data)
      this.calendarViewType = 'day-scheduler'
      this.$nextTick(() => {
        this.getCurrentReserveDetail()
      })
    },
    onChangeView (data) {
      // console.log('click:day:header2:', data)
      this.calendarViewType = 'week-scheduler'

      this.todayAllMinutes = this.defaultResource
    },
    onClickResourceDay2 (data) {

    },

    clickBookRoom (resource) {
      if (this.calendarViewType == 'day-scheduler') {
        const nowTimestamp = this.$q_date.formatDate(new Date(), 'X')
        if (resource.dayTimestamp < nowTimestamp) {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '不可小于当前时间',
            color: 'red'
          })
          return false
        }

        this.selectRoomGroupStatus = true
        this.$nextTick(() => {
          this.$refs.selectRoomGroupDialogRef.init(resource.dayTimestamp)
        })
      }
    },

    cancelBookOrder (order_id) {
      this.$store
        .dispatch('bookManage/cancelBookOrder', {
          order_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '取消成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getCurrentReserveDetail()
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '取消预订失败',
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

    viewReserveDetail (data) {
      this.currentReserveItem = data
      setTimeout(() => {
        this.reserveDialogStatus = false
      }, 1000)
    },

    onClickResourceHeader2 (data) {
      console.log('click:resource:header2:', data)
    },

    onResourceExpanded (data) {
      console.log('expanded: ', data)
    },
    showBookDetail (item) {
      console.log('item', item)
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
.book-calendar-day .q-calendar-scheduler__resource
 padding:0 !important
</style>
