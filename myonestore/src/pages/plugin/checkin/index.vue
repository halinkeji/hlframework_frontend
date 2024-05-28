<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row">
        <q-item class="full-width">
          <q-item-section>
            <q-item-label>是否启用签到设置</q-item-label>
            <q-item-label caption lines="2">注意！该设置关闭后以下所有功能全部失效</q-item-label>
          </q-item-section>

          <q-item-section side v-if="authorityMeta('setStatus')">
            <q-toggle
              class="q-ma-none"
              v-model="checkinData.checkin_checkin_checkin"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              @input="setStatus(checkinData.checkin_checkin_checkin, 'checkin_checkin_checkin')"
            />
          </q-item-section>
        </q-item>

        <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
          <q-tab name="0">
            <span>
              规则设置
            </span>
          </q-tab>
          <q-tab name="1">
            <span>
              签到记录
            </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="checkinData.checkin_checkin_checkin == '1' && parseInt(activeName) == 0">
        <set-rules></set-rules>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="checkinData.checkin_checkin_checkin == '1' && parseInt(activeName) == 1">
        <checkin-record></checkin-record>
      </div>
    </div>
  </q-page>
</template>
<script>
import CheckinRecord from './components/CheckinRecord'
import SetRules from './components/SetRules'
export default {
  components: { SetRules, CheckinRecord },
  data () {
    return {
      activeName: '0',
      checkinData: {
        checkin_checkin_checkin: '0'
      }
    }
  },
  mounted () {},
  created () {
    this.getStatus()
  },
  computed: {},
  methods: {
    setStatus (val, keyName) {
      const vald = val
      const obj = {}
      obj[keyName] = vald
      this.$store
        .dispatch('checkin/setStatus', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.getStatus()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    getStatus () {
      this.$store
        .dispatch('checkin/getStatus')
        .then((res) => {
          if (res.code == 200) {
            this.checkinData = res.data ? res.data : {}
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
