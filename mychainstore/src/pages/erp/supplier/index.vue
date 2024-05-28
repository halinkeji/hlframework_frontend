<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs
          v-model="activeName"
          class="bg-white "
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-tab name="0" label="供货商"> </q-tab>
          <q-tab name="1" label="供货商分类"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2">
        <div v-if="activeName == '0'" class="fit">
          <goods-supplier></goods-supplier>
        </div>
        <div v-if="activeName == '1'" class="fit">
          <goods-supplier-type></goods-supplier-type>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import GoodsSupplier from './components/GoodsSupplier.vue'
import GoodsSupplierType from './components/GoodsSupplierType.vue'
export default {
  name: 'gysIndex',
  components: { GoodsSupplier, GoodsSupplierType },
  data () {
    return {
      activeName: '0'
    }
  },
  mounted () {},
  watch: {},
  created () {},
  computed: {},
  methods: {}
}
</script>
<style></style>
