<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="tab" indicator-color="primary" active-color="primary" dense align="left" inline-label class="bg-white">
          <q-tab name="1" icon="las la-tv" label="平台信息" />
          <q-tab name="2" icon="las la-clipboard-list" label="消费设置" />
          <q-tab name="pay" icon="las la-money-check-alt" label="支付配置"> </q-tab>
          <q-tab name="prefix" icon="las la-wrench" label="单据前缀设置"> </q-tab>
          <q-tab name="parame" icon="las la-cogs" label="参数设置"> </q-tab>
          <q-tab name="member" icon="las la-users-cog" label="会员设置"> </q-tab>
          <q-tab name="erp" icon="las la-campground" label="erp设置"> </q-tab>
          <q-tab name="withdraw-rule" icon="las la-donate" label="结算设置"> </q-tab>
          <!-- <q-tab name="other" icon="las la-save" label="其他设置"> </q-tab> -->
        </q-tabs>
      </div>

      <div class="col-shrink q-mt-xs fit" v-if="parseInt(tab) == 1">
        <index-info class="fit"></index-info>
      </div>
      <div class="bg-white col-shrink q-mt-xs fit" v-if="parseInt(tab) == 2">
        <q-tabs v-model="tabOne" dense indicator-color="primary" active-color="primary" class="text-grey-8" align="left">
          <q-tab name="3" label="会员充值" />

          <q-tab name="1" label="消费设置" />
        </q-tabs>

        <div class="q-pa-sm" v-if="parseInt(tabOne) == 3">
          <recharge-money-set></recharge-money-set>
        </div>

        <div class="q-pa-sm" v-if="parseInt(tabOne) == 1">
          <consume-set></consume-set>
        </div>
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
      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'pay'">
        <pay-set></pay-set>
      </div>

       <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'other'">
        <other-set></other-set>
      </div>

      <div class="col-shrink full-height q-mt-xs fit" v-if="tab == 'withdraw-rule'">
        <withdraw-rule-set></withdraw-rule-set>
      </div>
    </div>
  </q-page>
</template>

<script>
import IndexInfo from './components/IndexInfo.vue'

import RechargeMoneySet from './components/RechargeMoneySet.vue'
import InvoicePrefix from './components/InvoicePrefix.vue' // 单据前缀
import ParameSet from './components/ParameSet.vue' // 参数设置
import ErpSet from './components/ErpSet.vue' // erp设置
import MemberSet from './components/MemberSet.vue' // 会员设置
import PaySet from './components/PaySet.vue' // 支付设置

import ConsumeSet from './components/ConsumeSet.vue'
import OtherSet from './components/OtherSet.vue'
import WithdrawRuleSet from './components/WithdrawRuleSet.vue'

export default {
  name: 'set',
  components: {
    IndexInfo,
    RechargeMoneySet,
    InvoicePrefix,
    ParameSet,
    ErpSet,
    MemberSet,
    PaySet,
    ConsumeSet,
    OtherSet,
    WithdrawRuleSet
  },
  data () {
    return {
      tab: '1',

      tabOne: '3'
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
