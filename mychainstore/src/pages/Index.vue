<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  full-height  ">
        <q-scroll-area class="fit full-height">
          <div class="row q-mt-xs q-mb-sm q-px-sm q-col-gutter-md">
            <div class="col-3">
              <q-item class="bg-white">
                <q-item-section avatar>
                  <q-avatar color="accent" size="md" text-color="white">
                    <q-icon name="las la-calendar-plus" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>今日预约</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <span class="text-h6 text-weight-bold">{{ reserveData.todayReserve }}</span>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-3">
              <q-item class="bg-white">
                <q-item-section avatar>
                  <q-avatar color="orange" size="md" text-color="white">
                    <q-icon name="las la-calendar-check" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>今日完成</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <span class="text-h6 text-weight-bold">{{ reserveData.todaySuccess }}</span>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-3">
              <q-item class="bg-white">
                <q-item-section avatar>
                  <q-avatar color="grey" size="md" text-color="white">
                    <q-icon name="las la-calendar-minus" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>今日取消</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <span class="text-h6 text-weight-bold">{{ reserveData.todayCancel }}</span>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-3">
              <q-item class="bg-white">
                <q-item-section avatar>
                  <q-avatar color="positive" size="md" text-color="white">
                    <q-icon name="las la-calendar-alt" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>明日预约</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <span class="text-h6 text-weight-bold">{{ reserveData.tomorrowReserve }}</span>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <div class="row q-px-sm q-col-gutter-md">
            <div class="col-md-3 col-12 text-center  " v-for="(i, key) in memberSummary">
              <q-card bordered flat>
                <q-card-section>
                  <div class="row justify-between">
                    <div class="col-auto">
                      <q-avatar :color="i.color" size="md" text-color="white" :icon="i.icon"></q-avatar>
                    </div>

                    <q-chip outline class="col-auto" :color="i.color" text-color="white">
                      {{ key }}
                    </q-chip>
                  </div>
                </q-card-section>
                <q-card-section class="row justify-between">
                  <div class="col-6 text-left">
                    <span class="text-caption text-grey"> {{ i.before }} </span
                    ><q-icon color="blue" name="call_made" v-if="i.trend == 'top'"></q-icon>

                    <q-icon color="red" name="call_received" v-if="i.trend == 'down'"></q-icon>
                    <span class="text-h6" :class="`text-${i.color}`">
                      {{ i.beforeValue }}
                    </span>
                  </div>
                  <div class="col-6 text-right">
                    <span class="text-caption text-grey"> {{ i.after }} </span>
                    <strong class="q-pa-sm text-h6" :class="`text-${i.color}`">{{ i.afterValue }}</strong>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="q-mt-sm q-px-sm q-mb-sm">
            <q-card flat bordered class="full-height ">
              <q-card-section class="q-mb-sm row q-pa-sm q-ma-none">
                <div v-for="i in menuFast" class="q-pr-none col q-px-md q-pt-md">
                  <q-item-section avatar style="align-items: center" @click="$router.push({ path: i.to })">
                    <q-avatar font-size="28px" :icon="i.icon" :text-color="i.color"> </q-avatar>
                    {{ i.name }}
                  </q-item-section>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="row q-px-sm ">
            <div class="col-md-5 col-12 q-pr-sm">
              <q-card bordered flat class="full-width ">
                <q-card-section>
                  <echarts-templet-pie :memberSummaryPie="memberSummaryPie"></echarts-templet-pie>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-7 col-12">
              <q-card bordered flat class="full-width ">
                <q-card-section>
                  <echarts-templet-count :sevenSummary="sevenSummary"></echarts-templet-count>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="q-pa-sm ">
            <q-card bordered flat>
              <q-card-section class="q-pa-xs">
                <echarts-templet-service :servicePayCount="servicePayCount"></echarts-templet-service>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
    </div>

    <q-dialog v-model="endTimeStatus" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">
        <q-card-section class="text-center">
          <div class="text-h6">
            <q-icon class="q-mx-sm" name="report_problem" color="red"></q-icon>

            到期提醒
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="text-center">
          <div class="text-subtitle2 text-red">当前店铺使用授权已过期</div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="center">
          <q-btn flat class="full-width" @click="logoutAccount">关闭店铺</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import EchartsTempletPie from './system/templet-pie.vue'
import EchartsTempletCount from './system/templet-count.vue'
import EchartsTempletService from './system/templet-service.vue'
import { LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
export default {
  name: 'PageIndex',
  components: {
    EchartsTempletPie,
    EchartsTempletCount,
    EchartsTempletService
  },
  data () {
    return {
      userName: '',
      nowTimeComputed: '',
      menuFast: [],
      memberSummary: [],
      memberSummaryPie: [],
      sevenSummary: {},
      endTimeStatus: false,
      reserveData: {},
      servicePayCount: []
    }
  },
  created () {
    this.isEndTime()
  },
  computed: {},
  beforeMount () {},
  mounted () {
    this.getHome()
  },
  methods: {
    isEndTime () {
      const storeLocal = this.$q.localStorage.getItem('mychainstore_store_local')
      const storeUseEndTime = storeLocal.storeUseEndTime ? parseInt(storeLocal.storeUseEndTime) : 0
      const nowTime = parseInt(new Date().getTime() / 1000)
      if (storeUseEndTime < nowTime) {
        this.endTimeStatus = true
      }
    },
    getHome () {
      this.$store
        .dispatch('settings/getIndexCount')
        .then((res) => {
          if (res.code == 200) {
            this.menuFast = res.data.menuFast
            this.memberSummary = res.data.memberSummary
            this.memberSummaryPie = res.data.memberSummaryPie
            this.sevenSummary = res.data.sevenSummary
            this.reserveData = res.data.reserveData
            this.servicePayCount = res.data.servicePayCount
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
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
    logoutAccount () {
      this.$q.loading.show({
        message: '正在保存数据,请稍后...'
      })

      removeAllLocalStorage()
      removeAllCookies()

      setTimeout(() => {
        this.$q.loading.hide()

        if (this.$route.name == 'PageIndex') {
          location.reload()
        } else {
          this.$router.push({ name: 'PageIndex' })
        }
      }, 1500)
    },
    authorityMeta (key) {
      const routerData = LocalStorage.getItem('mychainstore_router_local')
      const indexKey = _.findIndex(routerData, function (o) {
        return o.name == 'index'
      })
      if (indexKey > -1 && routerData[indexKey] && routerData[indexKey].meta) {
        const new_arr = routerData[indexKey].meta.map((obj) => {
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
