<template>
  <q-page class="q-ma-sm">
    <q-tabs
      v-model="activeName"
      class="bg-white q-mt-sm"
      active-color="primary"
      indicator-color="primary"
      align="left"
      content-class="text-grey-9"
      narrow-indicator
      dense
    >
      <q-tab name="contract" v-if="authorityMeta('contract')">
        <span>
          合同管理
        </span>
      </q-tab>
      <q-tab name="info" v-if="authorityMeta('info')">
        <span>
          信息管理
        </span>
      </q-tab>
      <q-tab name="debt" v-if="authorityMeta('debt')">
        <span>
          欠款管理
        </span>
      </q-tab>

      <q-tab name="set" v-if="authorityMeta('set')">
        <span>
          易货设置
        </span>
      </q-tab>
      <q-tab name="recharge" v-if="authorityMeta('recharg')">
        <span>
          解冻充值
        </span>
      </q-tab>
    </q-tabs>
    <q-separator />

    <q-tab-panels
      v-model="activeName"
      animated
      transition-prev="fade"
      transition-next="fade"
      class="bg-blue-grey-1"
    >
      <q-tab-panel
        class="q-pa-none"
        name="contract"
        v-if="authorityMeta('contract')"
      >
        <trade-contract></trade-contract>
      </q-tab-panel>
      <q-tab-panel class="q-pa-none" name="info" v-if="authorityMeta('info')">
        <trade-info></trade-info>
      </q-tab-panel>
      <q-tab-panel class="q-pa-none" name="set" v-if="authorityMeta('set')">
        <trade-set></trade-set>
      </q-tab-panel>
      <q-tab-panel class="q-pa-none" name="debt" v-if="authorityMeta('debt')">
        <trade-debt></trade-debt>
      </q-tab-panel>
      <q-tab-panel
        class="q-pa-none"
        name="recharge"
        v-if="authorityMeta('recharg')"
      >
        <trade-recharge></trade-recharge>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script>
import TradeContract from "./contract/index.vue";
import TradeInfo from "./info/index.vue";
import TradeDebt from "./debt/index.vue";
import TradeSet from "./set/index.vue";
import TradeRecharge from "./recharge/index.vue";
export default {
  name: "trade",
  components: {
    TradeContract,
    TradeInfo,
    TradeDebt,
    TradeSet,
    TradeRecharge
  },
  data() {
    return {
      activeName: "contract"
    };
  },

  created() {},
  mounted() {},
  computed: {},
  methods: {
    authorityMeta(key) {
      if (this.$route.meta) {
        let new_arr = this.$route.meta.map(obj => {
          return obj.id;
        });
        if (new_arr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
