<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="tab" indicator-color="primary" active-color="primary" dense align="left" inline-label class="bg-white">
          <q-tab name="1" icon="las la-tv" v-if="authorityMeta('storeInfo')" label="商家信息" />
          <q-tab name="2" icon="las la-clipboard-list" v-if="authorityMeta('consumSet')" label="消费设置" />
          <q-tab name="pay" icon="las la-money-check-alt" label="支付配置"> </q-tab>
          <q-tab name="member" icon="las la-users-cog" label="会员设置"> </q-tab>
          <q-tab name="prefix" icon="las la-wrench" v-if="authorityMeta('prefix')" label="单据前缀设置"> </q-tab>
          <q-tab name="parame" icon="las la-cogs" v-if="authorityMeta('parame')" label="参数设置"> </q-tab>
          <q-tab name="supermodel" icon="las la-sitemap" v-if="authorityMeta('supermodel')" label="门店经营模式"> </q-tab>
          <q-tab name="pluginmodel" icon="las la-server" v-if="authorityMeta('pluginmodel')" label="应用使用模式"> </q-tab>
          <q-tab name="other" icon="las la-icons" v-if="authorityMeta('other')" label="其他设置"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink q-mt-xs fit" v-if="parseInt(tab) == 1">
        <index-info class="fit"></index-info>
      </div>
      <div class="bg-white col-shrink q-mt-xs fit" v-if="parseInt(tab) == 2">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="2" class="q-pa-none q-px-sm">
            <q-tabs v-model="tabOne" dense indicator-color="primary" active-color="primary" class="text-grey-8" align="left">
              <q-tab name="1" label="堂食点单" />
              <q-tab name="2" label="快速消费" />
              <q-tab name="3" label="会员充值" />

            </q-tabs>
            <q-tab-panels v-model="tabOne" animated>
              <q-tab-panel name="1" class="q-pa-none">
                <consume-order></consume-order>
              </q-tab-panel>
              <q-tab-panel name="2" class="q-pa-none">
                <quick-consume></quick-consume>
              </q-tab-panel>
              <q-tab-panel name="3" class="q-pa-none">
                <recharge-money-set></recharge-money-set>
              </q-tab-panel>
            </q-tab-panels>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'prefix'">
        <invoice-prefix></invoice-prefix>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'parame'">
        <parame-set></parame-set>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'erp'">
        <erp-set></erp-set>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'member'">
        <member-set></member-set>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'supermodel'">
        <super-model></super-model>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'pluginmodel'">
        <plugin-model></plugin-model>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'pay'">
        <pay-set></pay-set>
      </div>
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'other'">
        <other-set ></other-set>
      </div>
    </div>
  </q-page>
</template>

<script>
import IndexInfo from './components/IndexInfo.vue'
import QuickConsume from './components/QuickConsume.vue'
import RechargeMoneySet from './components/RechargeMoneySet.vue'
import InvoicePrefix from './components/InvoicePrefix.vue' // 单据前缀
import ParameSet from './components/ParameSet.vue' // 单据前缀
import ErpSet from './components/ErpSet.vue' // erp设置
import SuperModel from './components/Supermodel.vue' // 门店经营模式
import PluginModel from './components/PluginModel.vue' // 门店经营模式
import MemberSet from './components/MemberSet.vue' // 会员设置
import PaySet from './components/PaySet.vue' // 支付设置
import ConsumeOrder from './components/ConsumeOrder.vue'

import OtherSet from './components/OtherSet.vue' // 其他设置
export default {
  name: 'set',
  components: {
    IndexInfo,
    QuickConsume,
    RechargeMoneySet,
    InvoicePrefix,
    ParameSet,
    ErpSet,
    SuperModel,
    PluginModel,
    MemberSet,
    PaySet,
    ConsumeOrder,
    OtherSet
  },
  data () {
    return {
      tab: '1',

      tabOne: '1'
    }
  },
  methods: {

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

<style></style>
