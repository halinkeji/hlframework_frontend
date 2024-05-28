<template>
  <q-dialog @hide="hideNowPage" v-model="userDayStatus" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.8) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
      }"
      class="q-pa-sm"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle1">员工日目标设置</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>
      <q-separator class="q-ma-md q-mt-none" />
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink q-px-xs full-height bg-white row">
          <div class="row col-12 col-md-12">
            <div class="col-3 q-ml-lg">
              <div class="no-margin">员工名称: {{ storeDayData.rui_reward_user_name }}</div>
            </div>
            <div class="col-2">
              <div class="no-margin">月份: {{ $q_date.formatDate(storeDayData.rui_start_time * 1000, 'YYYY-MM') }}</div>
            </div>
            <div class="col">
              <div class="no-margin">
                月销售指标: {{ storeDayData.rui_consume_target_amount }}
                {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}
              </div>
            </div>
            <div class="col">
              <div class="no-margin">
                未分配指标:
                <span class="text-red">
                  {{ noTargetTamount }} {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span
                >
              </div>
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
                      <div
                        v-if="timestamp.day == item.uid_time_day && timestamp.month == item.uid_time_month && timestamp.year == item.uid_time_year"
                      >
                        <div class="q-mx-md text-center">
                          <!-- <q-btn square size="sm" color="grey-11" unelevated class="full-width text-center text-blue-grey-10 text-body1">{{
                            item.uid_consume_target_amount
                          }}</q-btn> -->
                          <q-input
                            dense
                            input-class="text-center"
                            outlined
                            v-model="item.uid_consume_target_amount"
                            class="full-width text-blue-grey-10"
                          />
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
      <div class="row q-gutter-sm text-center justify-center">
        <q-btn
          unelevated
          class="q-px-xl"
          label="提交"
          @click="saveData"
          :disable="saveStopData ||noTargetTamount == '0' ? false : true"
          color="primary"
        />
        <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'UserDayCalendar',
  components: {},
  data() {
    return {
      userDayStatus: false,
      saveStopData: false,
      resourceData: [],
      calendarDate: '',
      storeDayData: [],
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
  },
  computed: {
    noTargetTamount() {
      const that = this;
      let amount = 0;
      that.storeIndicatorsDay.forEach(function (item) {
        amount += that.formatAmount(item.uid_consume_target_amount);
      });
      return that.formatAmount(that.storeDayData.rui_consume_target_amount) - that.formatAmount(amount);
    },
  },
  methods: {
    init(data) {
      if (data) {
        this.userDayStatus = true;
        this.storeDayData = data;
        this.calendarDate = this.$q_date.formatDate(data.rui_start_time * 1000, 'YYYY-MM-DD');
        this.getCurrentReserveDetail();
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    getCurrentReserveDetail() {
      this.$store
        .dispatch('rewardIndicators/getUserDayData', {
          id:this.storeDayData.id,
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
              caption: '获取员工日指标失败',
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
    saveData() {
      this.saveStopData = true;
      const obj = {
        storeDayData: this.storeDayData,
        storeIndicatorsDay: this.storeIndicatorsDay,
      };
      this.$store
        .dispatch('rewardIndicators/setUserDayData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: `${this.dataId > 0 ? '修改' : '新增'}` + '员工日指标成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right',
            });
            this.$nextTick(() => {
              this.hideNowPage();
            });
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red',
          });
          this.saveStopData = false;
        });
    },
    hideNowPage() {
      this.userDayStatus = false;
      this.dataForm = {
        pru_name: '',
        pru_telephone: '',
        pru_status: '1',
        pru_member_id: '',
        pru_user_id: '',
      };
      this.$emit('dataList');
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
