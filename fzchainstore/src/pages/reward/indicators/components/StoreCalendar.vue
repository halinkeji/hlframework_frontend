<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-px-xs full-height bg-white row">
      <div class="row col-12 col-md-12">
        <div class="col-12 col-md-2 q-pa-xs">
          <q-input outlined v-model="startTime" label="月份" dense square readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" mask="YYYY-MM" today-btn minimal default-month default-view="Months" years-in-month-view>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat @click="setTime" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <!-- <q-scroller v-model="startTime" dense view="date" no-footer no-days style="height: 70px;" locale="zh-hans" class="full-width"></q-scroller> -->
        </div>
        <div class="col-12 col-md-3 q-pa-xs">
          <!-- <q-btn label="确定" color="primary" @click="setTime" style="height: 70px; width: 120px;"  /> -->
          <q-btn flat icon="ion-help-circle" color="grey-5">
            <q-tooltip> 销售日指数 = 当日指标/每个指数：例如：每个指数 = 200 元 ， 日指标为1000元 ，则当日指数 = 1000/200 = 5个 </q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="col-12 col-md-12 q-pa-xs full-height">
        <q-calendar
          v-model="calendarDate"
          :view="calendarViewType"
          :resources="resourceData"
          bordered
          :resource-height="150"
          :interval-height="180"
          :resource-width="150"
          class="full-height"
          locale="zh-hans"
        >
          <template #day="{ timestamp /*, index */ }">
            <div class="full-width cursor-pointer">
              <div v-if="storeIndicatorsDay.length > 0">
                <template v-for="(item, key) in storeIndicatorsDay">
                  <div v-if="timestamp.day == item.sid_time_day && timestamp.month == item.sid_time_month && timestamp.year == item.sid_time_year">
                    <div class="q-mx-md text-center">
                      <q-btn square size="sm" color="grey-11" unelevated class="full-width text-center text-blue-grey-10 text-body1"
                        >{{ formatAmount(item.sid_consume_target_amount / item.sid_one_exponent) }} 个
                      </q-btn>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </q-calendar>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StoreCalendar',
  components: {},
  data() {
    return {
      resourceData: [],
      calendarDate: '',
      startTime: '',
      userData: [],
      storeIndicatorsDay: [],
      currentReserveItem: {},
      calendarViewType: 'month',
      weekReserveCountData: [],
    };
  },
  mounted() {},
  created() {
    const timeStamp = Date.now();
    this.calendarDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD');
    this.startTime = this.$q_date.formatDate(timeStamp, 'YYYY-MM');
    this.getCurrentReserveDetail();
  },
  computed: {},
  methods: {
    setTime() {
      this.calendarDate = this.startTime + '-15';
      this.getCurrentReserveDetail();
    },
    getCurrentReserveDetail() {
      this.$store
        .dispatch('rewardIndicators/getStoreCalendarData', {
          year: this.$q_date.formatDate(this.calendarDate, 'YYYY'),
          month: this.$q_date.formatDate(this.calendarDate, 'M'),
          day: this.$q_date.formatDate(this.calendarDate, 'DD'),
        })
        .then((res) => {
          if (res.code == 200) {
            this.storeIndicatorsDay = res.data ? res.data : [];
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取店铺日指标失败',
              color: 'red',
            });
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
          });
        });
    },
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
  },
};
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
