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

    <div class="row q-px-sm">
      <div class="col-md-5 col-12 q-pr-sm q-pb-md" v-if="authorityMeta('quickMenu')">
        <q-card flat bordered class="full-height">
          <q-card-section class="row">
            <div v-for="i in menuFast" class="col-3 text-center">
              <div @click="$router.push({ path: i.to })">
                <div class="q-pa-md">
                  <q-icon size="40px" :name="i.icon" :color="i.color"> </q-icon>
                </div>

                {{ i.name }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="row col-md-7 col-12">
        <div class="col-md-6 col-12 text-center q-px-xs q-py-xs" v-if="authorityMeta(i.auth)" v-for="(i, key) in memberSummary">
          <q-card bordered flat>
            <q-card-section class="q-pa-sm">
              <div class="row justify-between">
                <div class="col-auto">
                  <q-avatar :color="i.color" size="md" text-color="white" :icon="i.icon"></q-avatar>
                </div>
                <q-chip outline class="col-auto" :color="i.color" text-color="white">
                  {{ key }}
                </q-chip>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-xs row justify-between">
              <div class="col-6 text-left">
                <span class="text-caption text-grey"> {{ i.before }} </span><q-icon color="blue" name="call_made" v-if="i.trend == 'top'"></q-icon>

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
    </div>
    <div class="row q-px-sm">
      <div class="col-md-5 col-12 q-pr-sm" v-if="authorityMeta('memberStatistics')">
        <q-card bordered flat class="full-width">
          <q-card-section class="q-pa-xs">
            <echarts-templet-pie :memberSummaryPie="memberSummaryPie"></echarts-templet-pie>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-7 col-12" v-if="authorityMeta('sevenStatistics')">
        <q-card bordered flat class="full-width">
          <q-card-section class="q-pa-xs">
            <echarts-templet-count :sevenSummary="sevenSummary"></echarts-templet-count>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="q-pa-sm" v-if="authorityMeta('consumeStatistics')">
      <q-card bordered flat>
        <q-card-section class="q-pa-xs">
          <echarts-templet-service :servicePayCount="servicePayCount"></echarts-templet-service>
        </q-card-section>
      </q-card>
    </div>
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
      const storeLocal = this.$q.localStorage.getItem('chainstore_store_local')
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
      const routerData = LocalStorage.getItem('chainstore_router_local')
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
