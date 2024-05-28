<template>
  <div class="centerx labelx">
    <q-form ref="aliPayRef" class="col-8">
      <q-card flat class="bg-white q-pa-md ">
        <q-list bordered padding>
          <q-item-label header>
            <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />消费基础配置</div>
          </q-item-label>
          <q-separator spaced />
          <q-item>
            <q-item-section>
              <q-item-label>使用储值与积分时需使用密码</q-item-label>
              <q-item-label caption>默认关闭，开启后收银台读卡后如使用会员积分或余额时强制验证密码会员默认密码为888888</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-toggle color="red" @input="handleSwitchChange(baseConfigData.consume_base_isPassword,'consume_base_isPassword')" v-model="baseConfigData.consume_base_isPassword" true-value="1" false-value="0" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'BaseConfig',
  data () {
    return {
      baseConfigData: {
        consume_base_isPassword: '0'
      }
    }
  },
  mounted () {
    this.getConsumeSet()
  },
  created () {},
  computed: {},
  methods: {
    getConsumeSet () {
      const obj = {
        name: 'base'
      }
      this.$store
        .dispatch('settings/getConsumeSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.baseConfigData = res.data ? res.data : {}
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
              position: 'top-right'
            })
            this.getConsumeSet()
          }
        })
        .catch((error) => {})
    }

  }
}
</script>

<style></style>
