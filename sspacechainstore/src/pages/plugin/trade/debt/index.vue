<template>
  <div class="q-pa-sm">
    <q-card flat class=" q-pa-md">
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
        <q-tab name="lentOut">
          <span>
            借出记录
          </span>
        </q-tab>
        <q-tab name="lentIn">
          <span>
            借入记录
          </span>
        </q-tab>
        <q-tab name="repay">
          <span>
            还回记录
          </span>
        </q-tab>
        <q-tab name="debt">
          <span>
            还出记录
          </span>
        </q-tab>
      </q-tabs>

      <q-tab-panels
        v-model="activeName"
        animated
        transition-prev="fade"
        transition-next="fade"
        class="bg-blue-grey-1"
      >
        <q-tab-panel class="q-pa-none" name="lentOut">
          <lent-out></lent-out>
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" name="lentIn">
          <lent-in></lent-in>
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" name="repay">
          <repay-record></repay-record>
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" name="debt">
          <debt-out></debt-out>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script>
import LentOut from "./components/LentOut.vue";//借出
import LentIn from "./components/LentIn.vue";//借入
import RepayRecord from "./components/RepayRecord.vue";//还回记录
import DebtOut from "./components/DebtOut.vue";//还出
export default {
  name: "tradeDebt",
  components: {
    LentOut,
    LentIn,
    RepayRecord,
    DebtOut
  },
  data() {
    return {
      activeName: "lentOut"
    };
  },
  created() {},
  mounted() {},
  computed: {},
};
</script>
