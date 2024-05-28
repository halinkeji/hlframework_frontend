<template>
  <div>
    <span v-if='parseInt(params.data.pml_weights)>0'>
      {{ getSpecName(params.data.pml_upgrade_property, params.data.pml_type) }}
      <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-white text-black text-subtitle2" :offset="[10, 10]">
        {{ getSpecName(params.data.pml_upgrade_property, params.data.pml_type) }}
      </q-tooltip>
    </span>
  </div>
</template>
<script>
export default {
  name: 'AgCondition',
  components: {},
  data () {
    return {
      propertpObject: this.$store.state.market.tagObject
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    // 获取规格名
    getSpecName (val, type) {
      let specName = ''
      const that = this
      const upgradeType = type
      if (val) {
        const propertyList = val.split(',')
        propertyList.forEach(function (value, key) {
          specName += (key > 0 ? (parseInt(upgradeType) == 1 ? ' 、 ' : ' ， ') : '') + that.propertpObject[value]
        })
        return specName
      }
      return ''
    }
  }
}
</script>
