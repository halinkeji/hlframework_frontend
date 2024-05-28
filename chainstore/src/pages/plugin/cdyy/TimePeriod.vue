<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.4 + 'px',
        'min-width': this.$q.screen.width * 0.4 + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md q-py-sm">
          <div class="text-subtitle2 q-pr-lg">换场</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="addReserveRef">
              <!-- <q-scroll-area style="height: 60px" class="bg-blue-grey-9 q-mt-md"> -->
              <div class="row q-gutter-sm text-white q-pa-xs bg-blue-grey-9">
                <div
                  v-for="(item, key) in sitePeriodData"
                  :key="key + 'week'"
                  :class="key == currentWeek ? 'bg-negative' : ''"
                  class="text-center col"
                >
                  <q-item clickable v-ripple class="full-width q-pa-xs" @click="changeWeek(item, key)">
                    <q-item-section class="q-pa-xs">
                      <q-item-label class="text-body2"> {{ item.week }}</q-item-label>
                      <q-item-label class="text-body2">{{ item.date }} </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
              <!-- </q-scroll-area> -->

              <div class="full-width q-mt-md bg-dark" style="overflow-x: scroll">
                <div class="row no-wrap q-gutter-xs">
                  <div class="text-white col-3 text-center q-pa-xs">
                    <div class="q-pa-sm">
                      <div class="text-subtitle2">时间</div>

                      <div class="q-mt-sm q-py-sm" v-for="(i, k) in weekData">
                        <span class="text-body2 q-ml-sm">{{ i.start }} - {{ i.end }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="text-white col-3 text-center q-pa-xs" v-for="(item, key) in currentSiteData">
                    <div class="item-dotted q-pa-sm">
                      <div class="text-subtitle2">{{ item.cs_name }}</div>

                      <div class="q-mt-sm" v-for="(i, k) in item.timePeriod">
                        <q-btn
                          :color="colorValue(i)"
                          :disable="i.check"
                          :outline="checkArr.indexOf(i.id) < 0"
                          :unelevated="checkArr.indexOf(i.id) > -1"
                          @click="checkTimePeriod(item, i)"
                        >
                          ¥ <span class="text-body2 q-ml-sm">{{ i.ctp_amount }}</span>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-list v-if="recordData.id">
                <q-item-label header>当前预约时间</q-item-label>
                <q-item class="bg-grey-8 text-white">
                  <q-item-section>
                    <q-item-label>{{ recordData.cr_year }}-{{ recordData.cr_month }}-{{ recordData.cr_day }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      >{{ recordData.cr_start_hour }}:{{ recordData.cr_start_minutes }}-{{ recordData.cr_end_hour }}:{{ recordData.cr_end_minutes }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>

              <q-list v-if="checkItemArr.id">
                <q-item-label header>新预约时间</q-item-label>
                <q-item class="bg-grey-8 text-white">
                  <q-item-section>
                    <q-item-label>{{ checkItemArr.week }}({{ checkItemArr.date }})</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      >{{ checkItemArr.start_hour }}:{{ checkItemArr.start_minutes }}-{{ checkItemArr.end_hour }}:{{
                        checkItemArr.end_minutes
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-form>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm items-center justify-center q-px-md">
          <q-btn color="negative" @click="confirmChangeTime" unelevated label="确认换场" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'TimePeriod',
  data () {
    return {
      showDialog: false,
      weekData: [],
      sitePeriodData: [],
      currentWeek: 1,
      currentSiteData: [],
      checkArr: [],
      totalAmount: 0,
      checkItemArr: {},
      memberId: 0,
      openCheckoutPageIf: false,
      recordId: 0,
      recordData: {}
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (recordId) {
      this.showDialog = true
      this.$nextTick(() => {
        this.recordId = recordId
        this.getList()
      })
    },

    getList () {
      const obj = {
        recordId: this.recordId
      }
      this.$store
        .dispatch('cdyy/getStoreSiteData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.sitePeriodData = res.data && res.data.sitePeriodData ? res.data.sitePeriodData : []

            if (res.data && res.data.recordData) {
              this.recordData = res.data.recordData
            }

            if (this.sitePeriodData && this.sitePeriodData.length > 0) {
              this.changeWeek(this.sitePeriodData[0], 0)
            }
          }
        })
        .catch((error) => {})
    },

    changeWeek (item, key) {
      this.currentWeek = key
      this.weekData = item.time_period
      this.currentSiteData = item.siteData && item.siteData.length > 0 ? item.siteData : []
    },

    colorValue (i) {
      if (this.checkArr == i.id) {
        return 'negative'
      } else {
        return 'white'
      }
    },

    checkTimePeriod (item, i) {
      this.checkArr = i.id
      const week = this.sitePeriodData[this.currentWeek]
      this.checkItemArr = {
        id: i.id,
        week: week.week,
        currentWeek: this.currentWeek,
        date: week.date,
        start_hour: i.ctp_start_hour,
        start_minutes: i.ctp_start_minutes,
        end_hour: i.ctp_end_hour,
        end_minutes: i.ctp_end_minutes,
        amount: i.ctp_amount,
        site_id: item.id,
        year: week.year,
        month: week.month,
        day: week.day
      }
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },

    confirmChangeTime () {
      this.$store
        .dispatch('cdyy/changeRecordData', {
          recordId: this.recordId,
          checkItemArr: this.checkItemArr
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '换绑成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })

            this.hideNowPage()
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '支付失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },

    hideNowPage () {
      this.showDialog = false
      this.$emit('dataList')
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style>
.cdyy-time-item {
  border-radius: 10px;
}

.row-box {
  width: 100%;
  height: auto;
  background: #fff;
  box-shadow: 0px 1px 10px rgba(27, 31, 68, 0.08);
}
.item-dotted {
  border: 3px dotted;
  border-color: gray;
}
</style>
