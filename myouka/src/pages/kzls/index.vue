<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs">
        <q-tabs
          @input="changeTab"
          v-model="kzjlTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="1">
            <span> 收支记录 </span>
          </q-tab>

          <q-tab name="3" label="开支项" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2 q-pa-none" v-if="parseInt(kzjlTab) == 1 || parseInt(kzjlTab) == 2">
        <kzls-record :activeName="kzjlTab" ref="kzlsRecordRef"></kzls-record>
      </div>

      <div class="col-shrink full-height bg-grey-2 q-pa-none" v-if="parseInt(kzjlTab) == 3">
        <kzls-item></kzls-item>
      </div>
    </div>
  </q-page>
</template>
<script>
import KzlsItem from './item/index'
import KzlsRecord from './record/index'
export default {
  name: 'kzlsManage',
  components: {
    KzlsItem,
    KzlsRecord
  },
  data () {
    return {
      kzjlTab: '1'

    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {

    changeTab () {
      if (parseInt(this.kzjlTab) == 1 || parseInt(this.kzjlTab) == 2) {
        this.$nextTick(() => {
          this.$refs.kzlsRecordRef.getList()
        })
      }
    }
  }
}
</script>
