<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
          <q-tab name="0" v-if="authorityMeta('list')">
            <span>
              <!-- <q-icon name="list_alt" size="sm" /> -->
              商品管理
            </span>
          </q-tab>
          <q-tab name="1" v-if="authorityMeta('recycle')">
            <span>
              <!-- <q-icon name="settings_applications" size="sm" /> -->
              商品回收站
            </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '0'">
        <goods-normal-list :goodsTypeData="goodsTypeData"></goods-normal-list>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '1'">
     <goods-recycle-bin :goodsTypeData="goodsTypeData"></goods-recycle-bin>
      </div>
    </div>
  </q-page>
</template>
<script>
import GoodsNormalList from './components/GoodsNormalList.vue'
import GoodsRecycleBin from './components/GoodsRecycleBin.vue'
export default {
  name: 'goodsIndex',
  components: { GoodsNormalList, GoodsRecycleBin },
  data () {
    return {
      activeName: '0',
      goodsTypeData: []
    }
  },
  mounted () {},
  watch: {},
  created () {
    this.getGoodsType()
  },
  computed: {},
  methods: {
    // 获取商品分类
    getGoodsType () {
      const obj = {
        goodsType: [1, 2]
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypeData = res.data
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
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
