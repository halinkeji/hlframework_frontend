<template>
  <div class="fit q-pa-sm row">
    <div class="col-6">
      <q-card flat bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="sm" icon="settings_applications" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-primary text-weight-bold"> 生日关怀 </q-item-label>
            <q-item-label class="text-caption"> 默认关闭，开启后系统会在每日指定时间发送生日关怀短信 </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle
              v-model="smsLibConfig.sms_lib_isAutoBirthday"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              class="float-right"
              @input="handleSwitchChange(smsLibConfig.sms_lib_isAutoBirthday, 'sms_lib_isAutoBirthday')"
            />
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendSet',
  components: {},
  data () {
    return {
      smsLibConfig: {
        sms_lib_isAutoBirthday: 0
      }
    }
  },
  created () {},
  computed: {},
  beforeMount () {},
  mounted () {
    this.getConsumeSet()
  },
  methods: {
    getConsumeSet () {
      const obj = {
        name: 'lib',
        group: 'sms'
      }
      this.$store
        .dispatch('settings/getParams', obj)
        .then((res) => {
          if (res.code == 200) {
            this.smsLibConfig = res.data
          }
        })
        .catch((error) => {})
    },
    handleSwitchChange (val, keyName) {
      const obj = {}
      obj[keyName] = val
      this.$store
        .dispatch('settings/addSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '添加成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right',
              timeout: 500
            })
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
