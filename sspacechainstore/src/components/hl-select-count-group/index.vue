<template>
  <q-dialog fullscreen v-model="packagePopup" persistent :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">选择套餐</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="row">
          <div class=" col-3" v-for="item in packageList" :key="item.id">
          <q-card bordered flat class="q-ma-sm">
            <q-card-section class="q-pa-xs">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ item.grp_name }}</q-item-label>
                  <q-item-label caption>
                   <span v-if="parseInt(item.grp_timeType) == 3">
                      指定时间内有效，有效期为
                      {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD ') }}到 {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD ') }}内有效
                    </span>
                    <span v-if="parseInt(item.grp_timeType) == 2">
                      <span v-if="parseInt(item.grp_endTime) == 1">相对时间内有效，有效期为{{ item.grp_startTime }}年内有效</span>
                      <span v-if="parseInt(item.grp_endTime) == 2">相对时间内有效，有效期为{{ item.grp_startTime }}季度内有效</span>
                      <span v-if="parseInt(item.grp_endTime) == 3">相对时间内有效，有效期为{{ item.grp_startTime }}月内有效</span>
                      <span v-if="parseInt(item.grp_endTime) == 4">相对时间内有效，有效期为{{ item.grp_startTime }}周内有效</span>
                      <span v-if="parseInt(item.grp_endTime) == 5">相对时间内有效，有效期为{{ item.grp_startTime }}天内有效</span>
                    </span>
                    <span v-if="parseInt(item.grp_timeType) == 1">永久有效</span>
                  </q-item-label>
                   <q-item-label caption v-if="is_main_store && item.store">
                     门店：{{ item.store.name }}
                   </q-item-label>
                </q-item-section>

                <q-item-section side class="text-h6 text-deep-orange">
                  <q-item-label>{{ item.grp_packagePrice }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-separator />
            <div style="height:200px" class="con-example-images q-pa-xs">
              <q-list>
                <q-item :key="key" v-for="(data, key) in item.rechargeDetail">
                  <q-item-section>
                    <q-item-label>
                      {{ data.grc_goodsName }}
                      {{ data.grc_speName ? '-' + data.grc_speName : '' }}
                    </q-item-label>
                    <q-item-label caption>
                      <span v-if="parseInt(data.grc_limitTime) == 1">无限制</span>
                      <span v-if="parseInt(data.grc_limitTime) == 2">使用限制为{{ data.grc_limitCount }}次/年</span>
                      <span v-if="parseInt(data.grc_limitTime) == 3">使用限制为{{ data.grc_limitCount }}次/季度</span>
                      <span v-if="parseInt(data.grc_limitTime) == 4">使用限制为{{ data.grc_limitCount }}次/月</span>
                      <span v-if="parseInt(data.grc_limitTime) == 5">使用限制为{{ data.grc_limitCount }}次/周</span>
                      <span v-if="parseInt(data.grc_limitTime) == 6">使用限制为{{ data.grc_limitCount }}次/天</span></q-item-label
                    >
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>x {{ data.grc_count }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <q-separator />
            <q-card-actions align="center">
              <q-btn label="选择套餐" class="full-width" @click="addShoppingCart(item.id, item)" color="primary" unelevated />
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

  mounted () {},
  created () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    info () {
      this.packagePopup = true
      this.getCountPackageList()
    },
    // 获取充次套餐商品
    getCountPackageList () {
      const obj = {
        grp_property: 0
      }
      this.$store
        .dispatch('goodscount/getAllData', obj)
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
      this.packagePopup = false
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
