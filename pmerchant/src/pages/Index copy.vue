<template>
  <q-page class="fit q-pt-md row">
    <div class="col-4">
      <q-card flat square bordered>
        <q-card-section class="row q-col-gutter-sm">
          <q-item class="col-6" :to="{ name : 'rechargemoney'}">
            <q-item-section>
              <q-item-label top class="text-center">
                <q-icon size="xl" color="primary"  name="credit_card" />
              </q-item-label>

              <q-item-label class="q-mt-sm text-center">会员充值</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="col-6" :to="{ name : 'deductpoint'}">
            <q-item-section>
              <q-item-label top class="text-center">

                <q-icon size="xl" color="green"  name="ballot" />
              </q-item-label>

              <q-item-label class="q-mt-sm text-center">积分操作</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="col-6" :to="{ name : 'memberinfo'}">
            <q-item-section>
              <q-item-label top class="text-center">

                <q-icon size="xl" color="deep-orange"  name="perm_contact_calendar" />
              </q-item-label>

              <q-item-label class="q-mt-sm text-center">会员信息</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="col-6" :to="{ name : 'memberReg'}">
            <q-item-section>
              <q-item-label top class="text-center">
                 <q-icon size="xl" color="orange"  name="library_books" />
              </q-item-label>

              <q-item-label class="q-mt-sm text-center">会员登记</q-item-label>
            </q-item-section>
          </q-item>

        </q-card-section>
      </q-card>
    </div>

    <div class="col-4">

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
import { LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
export default {
  name: 'PageIndex',
  components: {},
  data () {
    return {
      endTimeStatus: false
    }
  },
  created () {
    this.isEndTime()
  },
  computed: {},
  beforeMount () {},
  mounted () {},
  methods: {
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
