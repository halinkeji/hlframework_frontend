<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm q-mb-xs">
        <q-tabs v-model="tab" indicator-color="primary" dense active-color="primary" align="left" inline-label class="bg-white">
          <q-tab name="1" icon="las la-qrcode" label="收款码" />
          <q-tab name="2" icon="lab la-whmcs" label="买单设置" />
          <q-tab name="3" icon="las la-hand-holding-usd" label="定额收款" />
        </q-tabs>
      </div>

      <div class="col-shrink  full-height " v-if="parseInt(tab) == 1">
        <payment-code></payment-code>
      </div>
      <div class="col-shrink full-height " v-if="parseInt(tab) == 2">
        <pay-config></pay-config>
      </div>

      <div class="col-shrink full-height " v-if="parseInt(tab) == 3">
        <fixed-list></fixed-list>
      </div>

    </div>
  </q-page>
</template>

<script>
import PaymentCode from './PaymentCode.vue'
import PayConfig from './PayConfig.vue'
import FixedList from './fixed/index.vue'
export default {
  name: 'zzpay',
  components: { PaymentCode, PayConfig, FixedList },
  data () {
    return {
      tab: '1'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>

<style></style>
