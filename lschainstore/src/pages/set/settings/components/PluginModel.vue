<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white ">
      <q-scroll-area class="fit full-height">
        <q-form ref="modelConfigRef" class="row q-my-sm">
          <div class="col-8" v-if="is_main_store">
            <q-select
              label="设置门店"
              v-model="selectStoreData"
              @input="getItem"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              dense
              outlined
              :options="libInStoreList"
            />
          </div>
          <div class="col-8" v-if="selectStoreData">
            <q-list separator padding>
              <q-item>
                <q-item-section>
                  <q-item-label>会员日营销使用模式</q-item-label>
                  <q-item-label caption>启用后，门店可独立设置会员日营销规则。禁用后（默认禁用），使用总部统一管理。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="pluginConfigForm.private_hyryx" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>卡券营销使用模式</q-item-label>
                  <q-item-label caption
                    >启用后，门店只可使用自建卡券，其他门店或总部的卡券均不可在该门店进行使用核销。默认禁用，各门店通用总部创建的卡券。</q-item-label
                  >
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="pluginConfigForm.private_hlcoupon" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>消费满额营销</q-item-label>
                  <q-item-label caption>启用后，门店只能使用自用满额营销，其他门店不可使用。默认禁用，使用总部与当前门店统一创建。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="pluginConfigForm.private_mezs" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>积分商城使用模式</q-item-label>
                  <q-item-label caption>启用后，积分商城商品、设置等信息独立使用编辑。禁用后（默认禁用），使用总部统一管理。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="pluginConfigForm.private_jfmall" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>会员商城使用模式</q-item-label>
                  <q-item-label caption>启用后，会员商城商品、设置等信息独立使用编辑。禁用后（默认禁用），使用总部统一管理。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="pluginConfigForm.private_wxmall" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>会员售后日志使用模式</q-item-label>
                  <q-item-label caption>启用后，门店可独立设置功能配置。禁用后（默认禁用），使用总部统一管理。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="pluginConfigForm.private_track" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <q-btn class="q-px-xl" unelevated label="保存" @click="saveData" color="primary" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PluginModel',
  components: {},
  data () {
    return {
      pluginConfigForm: {
        private_hlcoupon: '0', // 独立使用优惠券
        private_mezs: '0', // 独立满额营销
        private_jfmall: '0', // 独立使用积分商城
        private_wxmall: '0', // 独立使用会员商城
        private_track: '0', // 独立使用会员售后日志
        private_hyryx: '0' // 会员日营销
      },
      libInStoreList: [],
      selectStoreData: '',
      paramsKey: 'pluginModel'
    }
  },
  mounted () {},
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    } else {
      const accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')
      if (accountInfo && accountInfo.store_id) {
        this.selectStoreData = accountInfo.store_id
        this.getItem()
      }
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    // 获取单条
    getItem () {
      this.$store.dispatch('settings/getSuperModel', { currentStoreId: this.selectStoreData, key: this.paramsKey }).then((res) => {
        if (res.code == 200) {
          this.setConfigContent(res.data)
        }
      })
    },
    setConfigContent (data) {
      for (const key in this.pluginConfigForm) {
        this.pluginConfigForm[key] = data[key] ? data[key] : ''
      }
    },
    // 提交
    saveData () {
      this.$refs.modelConfigRef.validate().then((success) => {
        if (success) {
          const obj = {
            value: this.pluginConfigForm,
            StoreId: this.selectStoreData,
            key: this.paramsKey
          }
          this.$store
            .dispatch('settings/setSuperModel', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
                  color: 'green'
                })
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
        }
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
