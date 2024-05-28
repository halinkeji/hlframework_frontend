<template>
  <q-page>
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
    <div class="row q-mt-md  q-px-sm ">

    </div>
    <div class="row q-px-sm q-col-gutter-lg">
      <div class="col-md-3  col-12 " v-for="(item,key) in memberSummary">
        <q-card bordered flat class="full-width">
          <q-card-section>
            <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder"> {{ formatAmount(item.value) }} </q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">{{ item.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon :name="item.icon" class="color_shallow" size="60px"></q-icon>
                </q-item-section>
              </q-item>

          </q-card-section>
            <q-ribbon class="q-pb-md text-center q-mt-md " leaf-position="top" size="full" background-color="#006241">
                <div class="text-blue-1 text-subtitle1">{{ item.name }}</div>
              </q-ribbon>
        </q-card>
      </div>
      <div class="col-12">
        <q-card bordered flat class="full-width ">
          <q-card-section>
            <echarts-templet-service :servicePayCount="servicePayCount"></echarts-templet-service>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import EchartsTempletPie from './system/templet-pie.vue'
import EchartsTempletCount from './system/templet-count.vue'
import EchartsTempletService from './system/templet-service.vue'
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
      servicePayCount: {}
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
      const storeLocal = this.$q.localStorage.getItem('cychainstore_store_local')
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
          if (res.code == 200 && res.data) {
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
    }
  }
}
</script>
