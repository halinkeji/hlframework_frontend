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
        >
          <q-tab name="0" v-if="authorityMeta('typeTab')">
            <span>
              品类补货
            </span>
          </q-tab>
          <q-tab name="1" v-if="authorityMeta('detailTab')">
            <span>
              明细补货
            </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink  full-height bg-grey-2" v-if="parseInt(activeName) == '0' && authorityMeta('typeTab')">
        <type-tab></type-tab>
      </div>
      <div class="col-shrink  full-height bg-grey-2" v-if="parseInt(activeName) == '1' && authorityMeta('detailTab')">
        <detail-tab></detail-tab>
      </div>
    </div>
  </q-page>
</template>
<script>
import TypeTab from './components/TypeTab'
import DetailTab from './components/DetailTab'
export default {
  name: 'index',
  components: {
    DetailTab,
    TypeTab
  },
  data () {
    return {
      activeName: '0'
    }
  },
  created () {
    if (this.$route.params && this.$route.params.tab) {
      this.activeName = this.$route.params.tab
    }
  },
  mounted () {},
  computed: {},
  methods: {
    authorityMeta (key) {
      return true
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
