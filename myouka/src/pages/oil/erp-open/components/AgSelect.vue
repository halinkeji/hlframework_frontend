<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <q-select
      class="q-ma-sm q-pr-md"
      v-model="params.data.oid_unit"
      :options="options"
      @input="editActivedEvent(params)"
      option-label="label"
      map-options
      emit-value
      dense
    />
  </div>
</template>
<script>
export default {
  name: 'AgSelect',
  components: {},
  data () {
    return {
      options: [
        { label: '吨', value: '1' },
        { label: '升', value: '2' }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    editActivedEvent (params) {
      this.params.context.editActivedEvent(params)
    }
  }
}
</script>
