<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">

    <div class="col-shrink q-pa-sm full-height bg-white ">
      <q-scroll-area class="fit full-height">
        <q-form ref="modelConfigRef" class="row q-my-sm">
          <div class="col-8" v-if="is_main_store">
            <q-select label="设置门店" v-model="selectStoreData" @input="getItem" option-value="id" option-label="name"  emit-value map-options dense outlined :options="libInStoreList" />
          </div>
          <div class="col-8" v-if="selectStoreData">
            <q-list separator padding>
              <q-item>
                <q-item-section>
                  <q-item-label>是否开启经营模式</q-item-label>
                  <q-item-label caption>开启后，总部可根据经营实际情况，调配门店为连锁经营模式、加盟经营模式、直营+加盟混合经营模式。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_status" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit }}使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用当前门店内产生的>{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit }}。默认禁用，门店可使用会员产生的全部>{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit }}。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.private_integral" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用当前门店内产生的>{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}。默认禁用，门店可使用会员产生的全部>{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit }}。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.private_balance" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>商家公告使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用自建公告。禁用后（默认禁用），门店可查看总部公告与使用自建公告。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.private_store_news" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>积分折扣设置使用模式</q-item-label>
                  <q-item-label caption>启用后，门店的积分折扣规则各自独立使用。禁用后门店均使用总部统一设置的积分规则折扣</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_integral_config" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>消费设置使用模式</q-item-label>
                  <q-item-label caption>启用后，门店的消费设置各自独立使用。禁用后，门店使用总部统一设置的消费设置</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_consume_config" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

            <q-item>
                <q-item-section>
                  <q-item-label>支付设置使用模式</q-item-label>
                  <q-item-label caption>启用后，门店的支付设置各自独立使用。禁用后，门店使用总部统一设置的支付设置</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_pay_config" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>会员充值套餐使用模式</q-item-label>
                  <q-item-label caption>启用后，门店的充值套餐各自独立使用。禁用后，门店使用总部统一设置的充值套餐</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_recharge_package" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>会员标签使用模式</q-item-label>
                  <q-item-label caption>启用后，门店的会员标签各自独立使用。禁用后，门店使用总部统一设置的会员标签</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_member_tag" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>商品标签使用模式</q-item-label>
                  <q-item-label caption>启用后，门店的商品标签各自独立使用。禁用后，门店使用总部统一设置的商品标签</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_goods_tag" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>商品使用模式</q-item-label>
                  <q-item-label caption>启用后，门店可独立添加自有商品，且门店可以编辑总部商品在本店的售价、状态等参数。禁用后，门店仅可使用总部授权提供的商品。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_set_son_goods" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>充次套餐使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用自有套餐。禁用后（默认禁用），门店可使用总部套餐与自有套餐。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_set_son_count_package" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
                <q-item>
              <q-item-section>
                  <q-item-label>次卡使用模式</q-item-label>
                  <q-item-label caption>默认禁用，禁用后次卡可在任意门店使用（示例：会员在A店购的次卡可在任意店使用），启用后门店次卡各使用各的（示例：会员在A店购买的次卡只能在A店使用）。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_common_count" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>充时套餐使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用自有套餐。禁用后（默认禁用），门店可使用总部套餐与自有套餐。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_set_son_timing_package" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
              <q-item-section>
                  <q-item-label>时卡使用模式</q-item-label>
                  <q-item-label caption>默认禁用，禁用后时卡可在任意门店使用（示例：会员在A店购的时卡可在任意店使用），启用后门店时卡各使用各的（示例：会员在A店购买的时卡只能在A店使用）。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_timing" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>商品套餐模式</q-item-label>
                  <q-item-label caption>启用后，门店可独立添加自有商品，且门店可以编辑总部商品在本店的售价、状态等参数。禁用后，门店仅可使用总部授权提供的商品。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_set_son_goods_package" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>ERP供货商使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用自有供货商。禁用后（默认禁用），门店可使用总部供货商与自有供货商。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_erp_supplier" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>ERP客户使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用自有客户。禁用后（默认禁用），门店可使用总部客户与自有客户。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_erp_client" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>ERP预警规则使用模式</q-item-label>
                  <q-item-label caption>启用后，门店只可使用自有预警规则。禁用后（默认禁用），门店可使用总部预警规则与自有预警规则。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="supermodelConfigForm.psc_private_erp_warning" :disable="parseInt(supermodelConfigForm.psc_status) == 1 ? false : true" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

            </q-list>
          </div>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <q-btn class="q-px-xl" unelevated label="保存"  @click="saveData" color="primary" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Supermodel',
  components: {},
  data () {
    return {
      supermodelConfigForm: {
        psc_status: '0',
        private_balance: '0',
        private_integral: '0',
        psc_common_count: '0',
        psc_private_integral_config: '0',
        psc_private_consume_config: '0',
        psc_private_pay_config: '0',
        psc_private_recharge_package: '0',
        psc_private_member_tag: '0',
        psc_private_goods_tag: '0',
        psc_set_son_goods: '0',
        psc_set_son_count_package: '0',
        psc_set_son_goods_package: '0',
        psc_set_son_timing_package: '0',
        psc_private_timing: '0',
        psc_private_erp_supplier: '0',
        psc_private_erp_client: '0',
        psc_private_erp_warning: '0',
        private_store_news: ''
      },
      libInStoreList: [],
      selectStoreData: '',
      paramsKey: 'supermodel'
    }
  },
  mounted () {

  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    } else {
      const accountInfo = this.$q.localStorage.getItem('chainstore_account_info')
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
      this.$store.dispatch('settings/getSuperModel', { currentStoreId: this.selectStoreData, key: this.paramsKey })
        .then((res) => {
          if (res.code == 200) {
            this.setConfigContent(res.data)
          }
        })
    },
    setConfigContent (data) {
      for (const key in this.supermodelConfigForm) {
        this.supermodelConfigForm[key] = data[key] ? data[key] : ''
      }
    },
    // 提交
    saveData () {
      this.$refs.modelConfigRef.validate().then((success) => {
        if (success) {
          const obj = {
            value: this.supermodelConfigForm,
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
