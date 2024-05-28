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
          <div class="text-subtitle2 q-pr-lg">新增预约</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="addReserveRef">
              <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
              <!-- <q-scroll-area style="height: 60px" class="bg-blue-grey-9 q-mt-md"> -->
              <div class="row q-gutter-sm text-white q-pa-xs bg-blue-grey-9 q-mt-md">
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

              <q-list>
                <q-item class="bg-grey-8 text-white" :key="'check' + key" v-for="(item, key) in checkItemArr">
                  <q-item-section>
                    <q-item-label>{{ item.week }}({{ item.date }})</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.start_hour }}:{{ item.start_minutes }}-{{ item.end_hour }}:{{ item.end_minutes }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn color="white" @click="cancelCheckTimePeriod(item.id)" outline label="取消" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-form>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm items-center justify-right q-px-md">
          <q-space />
          <div>
            总价：¥<span class="text-h6 q-ml-xs">{{ totalAmount }}</span>
          </div>
          <q-btn color="negative" @click="paySelfhelpRefuel" :disable="!(checkArr.length > 0 && memberId)" unelevated label="提交订单" />
        </div>

        <hl-checkout-plugin
          @closeCheckoutPopup="closeCheckoutPopup"
          @paySuccessCallBack="paySuccessCallBack"
          ref="openCheckoutCounterPage"
          v-if="openCheckoutPageIf"
        ></hl-checkout-plugin>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'AddReserve',
  data () {
    return {
      showDialog: false,
      weekData: [],
      sitePeriodData: [],
      currentWeek: 1,
      currentSiteData: [],
      checkArr: [],
      totalAmount: 0,
      checkItemArr: [],
      memberId: 0,
      openCheckoutPageIf: false
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init () {
      this.showDialog = true
      this.$nextTick(() => {
        this.getList()
      })
    },

    getList () {
      const obj = {}
      this.$store
        .dispatch('cdyy/getStoreSiteData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.sitePeriodData = res.data && res.data.sitePeriodData ? res.data.sitePeriodData : []
            if (this.sitePeriodData && this.sitePeriodData.length > 0) {
              this.changeWeek(this.sitePeriodData[0], 0)
            }
          }
        })
        .catch((error) => {})
    },

    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
        }
      }
    },

    changeWeek (item, key) {
      this.currentWeek = key
      this.weekData = item.time_period
      this.currentSiteData = item.siteData && item.siteData.length > 0 ? item.siteData : []
    },

    colorValue (i) {
      if (this.checkArr.indexOf(i.id) > -1) {
        return 'negative'
      } else {
        return 'white'
      }
    },

    checkTimePeriod (item, i) {
      if (this.checkArr.indexOf(i.id) < 0) {
        this.checkArr.push(i.id)
        const week = this.sitePeriodData[this.currentWeek]

        this.checkItemArr.push({
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
        })
        console.log('this.checkItemArr', this.checkItemArr)
      } else {
        this.checkArr.splice(this.checkArr.indexOf(i.id), 1)
        this.checkItemArr.splice(this.checkArr.indexOf(i.id), 1)
      }
      this.$nextTick(() => {
        this.calculateAmount()
      })
    },

    cancelCheckTimePeriod (id) {
      if (this.checkArr.indexOf(id) > -1) {
        this.checkArr.splice(this.checkArr.indexOf(id), 1)
        this.checkItemArr.splice(this.checkArr.indexOf(id), 1)
      }
      this.$nextTick(() => {
        this.calculateAmount()
      })
    },

    calculateAmount () {
      const that = this
      this.totalAmount = _.sumBy(this.checkItemArr, function (o) {
        return that.formatAmount(o.amount)
      })
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

    paySuccessCallBack (v) {
      this.openCheckoutPageIf = false
      this.$store
        .dispatch('cdyy/setRecordData', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '预约成功',
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

    paySelfhelpRefuel () {
      this.openCheckoutPageIf = true

      const return_param = {
        checkItemArr: this.checkItemArr,
        member_id: this.memberId
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('cdyy', this.totalAmount, parseInt(this.memberId), return_param)
      })

      return false
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
