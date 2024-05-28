<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
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
          <q-tab name="0" label="对账记录"> </q-tab>
          <q-tab name="1" label="提现记录"> </q-tab>
          <!-- <q-tab name="2" label="消费设置"> </q-tab>
          <q-tab name="3" label="提现设置"> </q-tab> -->
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2">
        <div v-if="activeName == '0'" class="fit">
          <finance-list></finance-list>
        </div>
        <div v-if="activeName == '1'" class="fit">
          <withdraw-list></withdraw-list>
        </div>
        <div v-if="activeName == '2'" class="fit">
          <finance-set></finance-set>
        </div>
        <div v-if="activeName == '3'" class="fit">
          <withdrawe-set></withdrawe-set>
        </div>
      </div>
    </div>

     <q-dialog v-model="showApplyStatus" persistent>
      <q-card :style="{
        width: parseInt(this.$q.screen.width * 0.2) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
      }">
        <q-card-section class="row items-center text-center">
         <q-icon name="las la-exclamation-circle" size="sm" color="warning" />  <div class="text-subtlte2 full-width text-center">您还未加入门店共享平台！</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="row q-gutter-sm">
          <q-btn color="blue-6" unelevated class="q-px-sm" label="去加入" :to="{ name : 'pmerchantApply'}" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>
<script>
import FinanceList from './FinanceList.vue'
import WithdrawList from './WithdrawList.vue'

import FinanceSet from './FinanceSet.vue'
import WithdraweSet from './WithdraweSet.vue'

export default {
  components: { FinanceList, WithdrawList, FinanceSet, WithdraweSet },
  name: 'memberIndex',
  data () {
    return {
      activeName: '0',
      showApplyStatus: false
    }
  },
  mounted () {},
  created () {
    this.$nextTick(() => {
      this.getApplyJoinData()
    })
  },
  computed: {},
  methods: {

    getApplyJoinData () {
      const obj = {}
      this.$store
        .dispatch('pmerchantManage/getApplyJoinData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.merchantData = res.data ? res.data.merchantData : {}
            if (!(this.merchantData && this.merchantData.id)) {
              this.showApplyStatus = true
            } else if (this.merchantData && this.merchantData.id && parseInt(this.merchantData.pmm_status) == -2) {
              this.showApplyStatus = true
            }
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
<style></style>
