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
<!-- v-if="!is_main_store" -->
    <son-page  />
    <!-- <main-page v-if="is_main_store" /> -->
  </q-page>
</template>

<script>
import SonPage from './SonPage'

import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
export default {
  name: 'PageIndex',
  components: {
    SonPage
  },
  data () {
    return {
      userName: '',
      nowTimeComputed: '',
      menuFast: [],
      memberSummary: [],
      memberSummaryPie: [],
      sevenSummary: {},
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
  },
  methods: {
    isEndTime () {
      const storeLocal = this.$q.localStorage.getItem('myouka_store_local')
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
