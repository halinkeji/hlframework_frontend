<template>
  <q-dialog fullscreen v-model="packagePopup" persistent :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">选择套餐</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="row">
        <div class=" col-4" v-for="item in packageList" :key="item.id">
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
            <div style="height:300px" class="con-example-images q-pa-xs">
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
              <q-btn label="选择套餐" class="full-width" @click="addShoppingCart(item)" color="primary" unelevated />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'SelectGoods',
  components: {},
  data () {
    return {
      packageList: [],
      maximizedToggle: true,
      packagePopup: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    info () {
      this.packagePopup = true
      this.getCountPackageList()
    },
    // 获取充次套餐商品
    getCountPackageList () {
      const params = {

      }
      this.$store
        .dispatch('goodsTiming/getAllData', params)
        .then((res) => {
          if (res.code == 200) {
            this.packageList = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '注意',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 添加至购物车
    addShoppingCart (item) {
      this.packagePopup = false
      this.$emit('dataList', item)
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
