<template>
  <div class="row">
    <div class=" col-6 q-pa-xs" v-for="item in packageList" :key="item.id">
      <q-card bordered flat class="q-ma-sm">
        <q-card-section class="q-pa-xs">
          <q-item>
            <q-item-section>
              <q-item-label>{{ item.gtg_name }}</q-item-label>
              <q-item-label caption>
                <span v-if="item.gtg_time_type == 3">
                  指定时间内有效，有效期为
                  {{ $q_date.formatDate(item.gtg_time_start * 1000, 'YYYY-MM-DD ') }}到
                  {{ $q_date.formatDate(item.gtg_time_end * 1000, 'YYYY-MM-DD ') }}内有效
                </span>
                <span v-if="item.gtg_time_type == 2">
                  <span v-if="item.gtg_time_end == 1">相对时间内有效，有效期为{{ item.gtg_time_start }}年内有效</span>
                  <span v-if="item.gtg_time_end == 2">相对时间内有效，有效期为{{ item.gtg_time_start }}季度内有效</span>
                  <span v-if="item.gtg_time_end == 3">相对时间内有效，有效期为{{ item.gtg_time_start }}月内有效</span>
                  <span v-if="item.gtg_time_end == 4">相对时间内有效，有效期为{{ item.gtg_time_start }}周内有效</span>
                  <span v-if="item.gtg_time_end == 5">相对时间内有效，有效期为{{ item.grp_startTime }}天内有效</span>
                </span>
                <span v-if="item.gtg_time_type == 1">永久有效</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side class="text-h6 text-deep-orange">
              <q-item-label>{{ item.gtg_selling_price }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator />
        <div style="height:150px" class="con-example-images q-pa-xs">
          <q-list>
            <q-item :key="key" v-for="(data, key) in item.detail">
              <q-item-section>
                <q-item-label>
                  {{ data.tgd_goods_name }}
                  {{ data.tgd_spe_name ? '-' + data.tgd_spe_name : '' }}
                </q-item-label>
                <q-item-label caption> </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption> {{ data.tgd_time_compute_duration }}分钟</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-separator />
        <q-card-actions align="center">
          <q-btn label="选择套餐" class="full-width bg_cinnabar text-white" @click="addShoppingCart(item.id, item)" :disable="!memberId" unelevated />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SelectGoods',
  components: {},
  props: ['memberId'],
  data () {
    return {
      packageList: [],
      maximizedToggle: true,
      packagePopup: false
    }
  },

  mounted () {},
  created () {
    this.getCountPackageList()
  },
  computed: {},
  methods: {
    // 获取充次套餐商品
    getCountPackageList () {
      console.log('xxx')
      const obj = {
        grp_property: 0
      }
      this.$store
        .dispatch('goodsTiming/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.packageList = res.data
            } else {
              this.packageList = []
            }
          }
        })
        .catch((error) => {})
    },
    // 添加至购物车
    addShoppingCart (packageId, item) {
      this.$emit('refreshDataList', packageId, item)
    }
  }
}
</script>
<style lang="stylus">
.con-example-images {
  max-height: 300px;
  overflow: auto;
}
</style>
