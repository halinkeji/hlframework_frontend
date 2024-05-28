<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width
    }"
  >
    <q-select
      style="width:80%"
      v-model="params.data.mrc_expiryTimeType"
      @change="changeTimeTitle()"
      :options="roleOptions"
      option-value="value"
      option-label="label"
      emit-value
      map-options
      dense
    />
  </div>
</template>
<script>
export default {
  name: 'AgTimeSelect',
  components: {},
  data () {
    return {
      roleOptions: [
        { label: '永久有效', value: '1' },
        { label: '相对时间', value: '2' },
        { label: '固定时间', value: '3' }
      ]
    }
  },
  watch: {},

  computed: {},
  created () {},
  mounted () {},
  methods: {
    changeTimeTitle () {
      this.params.context.changeTimeValue(this.params)
    }
  }
}
</script>
