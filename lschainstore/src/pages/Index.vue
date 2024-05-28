<template>
  <q-page class="fit q-pt-md">
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
          <div class="text-subtitle2 text-red">当前门店使用授权已过期</div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="center">
          <q-btn flat class="full-width" @click="logoutAccount">关闭门店</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <q-scroll-area class="fit full-height">
        <div class="row q-px-sm">
          <div class="col-md-10 col-12 q-pr-sm q-pb-md">
            <div class="row q-px-sm" v-if="authorityMeta('memberStatistics')">

              <div class="row col-md-12 col-12">
                <div class="q-px-sm col-2 q-pt-sm" v-for="(item, key) in memberSummary" :key="key">
                  <q-card flat bordered>
                    <q-card-section align="center" class="q-py-lg">
                      <div class="text-h5">
                        {{ item.before }}
                      </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions class="text-white" :class="`bg-${item.color}`" align="center">
                      <div class="q-py-sm">
                        {{ item.name }}
                      </div>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
            <div class="q-pa-sm" v-if="authorityMeta('consumeStatistics')">
              <q-card bordered flat>
                <q-card-section class="q-pa-xs">
                  <echarts-templet-service :servicePayCount="servicePayCount"></echarts-templet-service>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row col-md-2 col-12">
            <q-card flat bordered class="full-height">
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="error_outline" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>待办事宜</q-item-label>
                </q-item-section>
              </q-item>
              <div class="q-px-md">
                <q-scroll-area style="height: 450px; max-width: 300px">
                  <div v-for="i in erpWarn" class="full-width">
                    <q-list bordered>
                      <q-item clickable v-ripple @click="$router.push({ path: i.to })">
                        <q-item-section>{{ i.name }}</q-item-section>
                        <q-item-section avatar>
                          <q-chip dense color="info" text-color="white"> {{ i.number }} </q-chip>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </q-scroll-area>
              </div>
              <q-card-section class="row">
                <q-item>
                  <q-item-section class="text-deep-orange-3">
                    <span> <q-icon name="error_outline" /><span class="q-ml-xs"> 预警 </span></span>
                  </q-item-section>

                  <!-- <q-item-section>
                <q-item-label>预警</q-item-label>
              </q-item-section> -->
                </q-item>
                <div class="full-width">
                  <q-list bordered>
                    <q-item clickable v-ripple @click="$router.push({ name: 'erpWarningProduct' })">
                      <q-item-section>保质期预警</q-item-section>
                      <q-item-section avatar>
                        <q-chip dense color="info" text-color="white"> {{ warningProductCount }} </q-chip>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
// import EchartsTempletPie from './system/templet-pie.vue'
// import EchartsTempletCount from './system/templet-count.vue'
import EchartsTempletService from './system/templet-service.vue'
// import EchartsTempletService from './set/charts/service.vue'
import { LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
export default {
  name: 'PageIndex',
  components: {
    // EchartsTempletPie,
    // EchartsTempletCount,
    EchartsTempletService
  },
  data () {
    return {
      userName: '',
      nowTimeComputed: '',
      warningProductCount: '',
      menuFast: [],
      erpWarn: [],
      memberSummary: [],
      memberSummaryPie: [],
      sevenSummary: {},
      endTimeStatus: false,
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
      const storeLocal = this.$q.localStorage.getItem('lschainstore_store_local')
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
            // this.menuFast = res.data.menuFast
            this.memberSummary = res.data.memberSummary
            // this.memberSummaryPie = res.data.memberSummaryPie
            // this.sevenSummary = res.data.sevenSummary
            // this.servicePayCount = res.data.servicePayCount
            this.warningProductCount = res.data.warningProductCount
            this.erpWarn = res.data.erpWarn
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
      const routerData = LocalStorage.getItem('lschainstore_router_local')
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
