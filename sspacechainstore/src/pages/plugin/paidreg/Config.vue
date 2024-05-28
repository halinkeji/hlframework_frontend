<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll q-mt-xs">
    <div class="col-shrink q-pa-sm full-height bg-white">

        <q-list bordered padding separator>
          <q-item>
            <q-item-section>
              <q-item-label>是否启用付费开卡</q-item-label>
              <!-- <q-item-label caption>{{ item.fieldRemarks }}</q-item-label> -->
            </q-item-section>
            <q-item-section side top>
              <q-toggle v-model="configData.ppc_is_buy" :true-value="1" :false-value="-1" color="green" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>是否启用套餐赠送</q-item-label>
              <!-- <q-item-label caption>{{ item.fieldRemarks }}</q-item-label> -->
            </q-item-section>
            <q-item-section side top>
              <q-toggle v-model="configData.ppc_is_use_package" :true-value="1" :false-value="-1" color="green" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>是否启用等级卡</q-item-label>
              <!-- <q-item-label caption>{{ item.fieldRemarks }}</q-item-label> -->
            </q-item-section>
            <q-item-section side top>
              <q-toggle v-model="configData.ppc_is_use_level" :true-value="1" :false-value="-1" color="green" />
            </q-item-section>
          </q-item>
        </q-list>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
      <q-btn unelevated label="保存" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" v-if="authorityMeta('saveConfig')" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaidregConfig',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      configData: {
        ppc_is_buy: -1,
        ppc_is_use_package: -1,
        ppc_is_use_level: -1
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      this.$store
        .dispatch('paidreg/getConfigListData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : this.configData
            this.configData.ppc_is_buy = parseInt(res.data.ppc_is_buy)
            this.configData.ppc_is_use_package = parseInt(res.data.ppc_is_use_package)
            this.configData.ppc_is_use_level = parseInt(res.data.ppc_is_use_level)
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setData () {
      this.addButtonDisabled = true
      const params = {
        ...this.configData
      }
      this.$store
        .dispatch('paidreg/setConfigData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.addButtonDisabled = false
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
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
