<template>
  <q-page class="fit q-pa-sm bg-grey-2">
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

       <div class="col-4" v-if="authorityMeta('quickMenu')">
        <q-card flat bordered class="full-width full-height row">
          <div v-for="i in menuFast" class="col-4 text-center">
            <div @click="openMenu(i)">
              <div class="q-pa-sm">
                <q-icon size="40px" :name="i.icon" :color="i.color"> </q-icon>
              </div>
              {{ i.name }}
            </div>

          </div>
        </q-card>
      </div>

      <div class="col-md-4 col-12" v-for="(item, key) in memberSummary">
        <q-card flat bordered class="full-width full-height row q-pa-sm items-center">
          <div class="col-12 text-center q-px-xs" v-for="(i, k) in item">
            <q-card flat class="fit">
              <q-card-section class="q-pa-sm">
                <div class="row justify-between">
                  <div class="col-auto">
                    <q-avatar :color="i.color" size="md" text-color="white" :icon="i.icon"></q-avatar>
                  </div>
                  <q-separator vertical />
                  <q-chip outline class="col-auto" :color="i.color" text-color="white">
                    {{ k }}
                  </q-chip>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-xs row justify-between">
                <div class="col text-left">
                  <span class="text-caption text-grey"> {{ i.before }} </span><q-icon color="blue" name="call_made" v-if="i.trend == 'top'"></q-icon>

                  <q-icon color="red" name="call_received" v-if="i.trend == 'down'"></q-icon>
                  <span class="text-h6" :class="`text-${i.color}`">
                    {{ i.beforeValue }}
                  </span>
                </div>

                <div class="col text-right">
                  <span class="text-caption text-grey"> {{ i.after }} </span>
                  <strong class="q-pa-sm text-h6" :class="`text-${i.color}`">{{ i.afterValue }}</strong>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card>
      </div>

      <div class="col-md-6 col-12">
        <q-card flat bordered class="full-width full-height q-pa-md" v-if="authorityMeta('memberStatistics')">
          <echarts-templet-pie :memberSummaryPie="memberSummaryPie"></echarts-templet-pie>
        </q-card>
      </div>

      <div class="col-md-6 col-12">
        <q-card flat bordered class="full-width full-height q-pa-md" v-if="authorityMeta('memberStatistics')">
          <echarts-templet-merchant :merchantSummaryPie="merchantSummaryPie"></echarts-templet-merchant>
        </q-card>
      </div>

      <!-- <div class="col-md-3 col-12">
        <q-card flat bordered class="full-width full-height q-pa-md" v-if="authorityMeta('memberStatistics')">
          <echarts-templet-member :memberChartData="memberChartData"></echarts-templet-member>
        </q-card>
      </div>

      <div class="col-md-3 col-12">
        <q-card flat bordered class="full-width full-height q-pa-md" v-if="authorityMeta('memberStatistics')">
          <echarts-templet-member-money :memberMoneyChartData="memberMoneyChartData"></echarts-templet-member-money>
        </q-card>
      </div> -->

      <div class="col-12" v-if="authorityMeta('sevenStatistics')">
        <q-card bordered flat class="full-width full-height q-px-md">
          <q-card-section class="q-pa-xs">
            <echarts-templet-count :sevenSummary="sevenSummary"></echarts-templet-count>
          </q-card-section>
        </q-card>
      </div>
    </div>

     <edit-dialog
        ref="editDialogRef"
        v-if="editDialogStatus"
        @closeDialog="editDialogStatus = false;getHome();"
      />
  </q-page>
</template>

<script>
import EchartsTempletPie from './system/templet-pie.vue'
import EchartsTempletCount from './system/templet-count.vue'
import EchartsTempletMerchant from './system/templet-merchant.vue'

import EchartsTempletMember from './system/templet-member.vue'
import EchartsTempletMemberMoney from './system/templet-member-money.vue'

import { LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'

import EditDialog from './merchant/Edit.vue'
export default {
  name: 'PageIndex',
  components: {
    EchartsTempletPie,
    EchartsTempletCount,
    EchartsTempletMerchant,
    EchartsTempletMember,
    EchartsTempletMemberMoney,
    EditDialog
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
      servicePayCount: [],
      merchantSummaryPie: [],
      memberChartData: [],
      memberMoneyChartData: [],
      editDialogStatus: false
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
    addStoreData () {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editDialogRef.init(0)
      })
    },
    isEndTime () {
      const storeLocal = this.$q.localStorage.getItem('pmerchant_store_local')
      if (storeLocal && storeLocal.storeUseEndTime) {
        const storeUseEndTime = storeLocal.storeUseEndTime
        const nowTime = parseInt(new Date().getTime() / 1000)
        if (parseInt(storeUseEndTime) < nowTime) {
          this.endTimeStatus = true
        }
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
            this.merchantSummaryPie = res.data.merchantSummaryPie
            // this.memberChartData = res.data.memberChartData
            // this.memberMoneyChartData = res.data.memberMoneyChartData
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

    openMenu (row) {
      if (row.function_name) {
        this[row.function_name]()
      } else {
        this.$router.push({ path: row.to })
      }
    },

    authorityMeta (key) {
      return true
      const routerData = LocalStorage.getItem('pmerchant_router_local')
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
