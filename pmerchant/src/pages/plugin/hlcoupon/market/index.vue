<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xs">
        <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
         <q-tab name="3">
            <span>
              推广中
            </span>
          </q-tab>
           <q-tab name="4" >
            <span>
              已结束
            </span>
          </q-tab>
          <q-tab name="2" >
            <span>
              待审核
            </span>
          </q-tab>
           <q-tab name="5" >
            <span>
              等待支付服务费
            </span>
          </q-tab>

           <q-tab name="1" >
            <span>
              创建中
            </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 3">
        <promotion-list></promotion-list>
      </div>
       <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 4">
        <end-list></end-list>
      </div>
        <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 2">
        <wait-check-list ></wait-check-list>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 5">
        <wait-pay-list ></wait-pay-list>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 1">
        <created-list ></created-list>
      </div>

    </div>
  </q-page>
</template>

<script>
import CreatedList from './CreatedList.vue'
import WaitCheckList from './WaitCheckList.vue'
import PromotionList from './PromotionList.vue'
import EndList from './EndList.vue'
import WaitPayList from './WaitPayList.vue'

export default {
  name: 'hlcouponMarket',
  components: { CreatedList, WaitCheckList, PromotionList, EndList, WaitPayList },
  data () {
    return {
      activeName: '3'
    }
  },
  mounted () {},
  watch: {},
  created () {},
  computed: {},
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
