<template>
  <q-page class="fit">
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-tabs
        v-model="activeName"
        class="bg-white q-mt-sm"
        active-color="primary"
        indicator-color="primary"
        align="left"
        content-class="text-grey-9"
        narrow-indicator
        dense
        @input="searchBut"
      >
        <q-tab name="rechargeCount" >
          <span>
            会员+次卡+员工绩效
          </span>
        </q-tab>
      </q-tabs>
    </div>

    <div class="col-shrink bg-white full-height bg-grey-2 fit">
      <q-tab-panels v-model="activeName" animated transition-prev="fade" transition-next="fade" class="fit">
        <q-tab-panel class="q-ma-none q-pa-none fit" name="rechargeCount">
          <deduct-count :memberId="memberId" ref="deductCountDataRef"></deduct-count>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
  </q-page>
</template>

<script>
import DeductCount from './DeductCount.vue'
export default {
  name: 'invoice',
  props: ['memberId'],
  components: {
    DeductCount
  },
  data () {
    return {
      status: [
        { value: 4, text: '未支付' },
        { value: 1, text: '支付成功' },
        { value: 2, text: '支付失败' },
        { value: 3, text: '退款成功' }
      ],
      searchFrom: {},
      activeName: 'rechargeCount'
    }
  },
  watch: {

  },
  mounted () {},

  created () {
    this.searchBut()
  },
  computed: {},
  methods: {
    // 搜索
    searchBut () {
      switch (this.activeName) {
        case 'rechargeCount':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.deductCountDataRef.getListData()
            })
          }, 100)
          break
      }
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

<style></style>
