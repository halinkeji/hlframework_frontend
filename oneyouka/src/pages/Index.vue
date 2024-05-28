<template>
  <q-page class="fit q-py-md">
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
    <div class="row q-col-gutter-sm">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col" v-for="(item, key) in memberAssets">
          <q-item class="bg-white rounded-borders">
            <q-item-section avatar>
              <q-avatar :color="item.color" size="md" text-color="white" :icon="item.icon" />
            </q-item-section>

            <q-item-section>
              {{ item.name }}
            </q-item-section>

            <q-item-section side class="text-h6 text-weight-bold text-primary">{{ formatAmount(item.value) }}</q-item-section>
          </q-item>
        </div>
      </div>

      <div class="col-6">
        <q-card flat class="q-pa-xs">
          <oil-consume :oilConsumsData="oilConsumsData" />
        </q-card>
      </div>
      <div class="col-6">
        <q-card flat class="q-pa-xs">
          <discount-charte :discountCharts="discountCharts" />
        </q-card>
      </div>
      <div class="col-6">
        <q-card flat class="q-pa-xs">
          <trend-count :oilTrend="oilChartData" />
        </q-card>
      </div>
      <div class="col-6">
        <q-scroll-area style="max-height: 300px; height: 300px">
          <div class="row">
            <div class="col-4 q-pa-md" v-for="(item, key) in oilCanStork">
              <q-card class="shadow-1">
                <q-card-section class="q-pa-none">
                  <q-item class="q-pb-none q-pt-xs">
                    <q-item-section>
                      <q-item-label class="text-h5 text-weight-bolder">{{ formatAmount(item.oc_stock) }} </q-item-label>
                      <q-item-label class="text-dark text-weight-thin text-overline">升</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="las la-gas-pump" class="text-primary" size="60px"></q-icon>
                    </q-item-section>
                  </q-item>
                  <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="primary">
                    <div class="text-blue-1 text-subtitle1">{{ item.oc_name }}</div>
                  </q-ribbon>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- <div class="col-6">
              <div v-for="(item, key) in oilErpCount">
                <q-list padding class="bg-white">
                  <q-item-label class="text-dark text-weight-bold">{{ item.oilName }}</q-item-label>
                  <q-separator spaced />

                  <q-item class="text-center q-pa-none" :key="'item-' + k" v-for="(i, k) in item.erp">
                    <q-item-section>
                      <q-item-label class="text-primary text-weight-bold">{{ i.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ i.totalTon }} <span class="text-caption q-ml-xs">吨</span> </q-item-label>
                      <q-item-label caption>总吨数</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ i.totalLiter }}<span class="text-caption q-ml-xs">升</span></q-item-label>
                      <q-item-label caption>总升数</q-item-label>
                    </q-item-section>
                    <q-item-section class="text-weight-bold">
                      <q-item-label>{{ i.totalPrice }}<span class="text-caption q-ml-xs">元</span></q-item-label>
                      <q-item-label caption>总金额</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div> -->
        </q-scroll-area>
      </div>
      <div class="col-12">
        <q-card flat class="q-pa-xs">
          <echarts-templet-service :servicePayCount="servicePayCount"></echarts-templet-service>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import EchartsTempletService from './system/templet-service.vue'
import TrendCount from './system/trend-count.vue'
import OilConsume from './system/oil-consume.vue'
import DiscountCharte from './system/discount-charte.vue'

import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
export default {
  name: 'PageIndex',
  components: {
    EchartsTempletService,
    TrendCount,
    OilConsume,
    DiscountCharte
  },
  data () {
    return {
      menuFast: {},
      memberSummary: {},
      memberSummaryPie: {},

      servicePayCount: {},
      oilTrend: {},
      oilConsumsData: {},
      oilChartData: {},
      memberAssets: [],
      discountCharts: {},
      oilErpCount: [],
      oilCanStork: [],
      endTimeStatus: false
    }
  },
  created () {
    this.isEndTime()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  beforeMount () {},
  mounted () {
    this.getHome()

    // const serviceMenu = LocalStorage.getItem('oneyouka_left_menu_navigate_local')

    // if (serviceMenu) {
    //   console.log('serviceMenu', serviceMenu)
    // }
  },
  methods: {
    isEndTime () {
      const storeLocal = this.$q.localStorage.getItem('oneyouka_store_local')
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
            this.memberAssets = res.data ? res.data.memberAssets : []
            this.discountCharts = res.data ? res.data.discountCharts : {}

            this.servicePayCount = res.data.servicePayCount
            this.oilChartData = res.data ? res.data.oilChartData : {}
            this.oilConsumsData = res.data ? res.data.oilConsumsData : {}
            this.oilErpCount = res.data ? res.data.oilErpCount : []
            this.oilCanStork = res.data ? res.data.oilCanStork : []
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
    }
  }
}
</script>
