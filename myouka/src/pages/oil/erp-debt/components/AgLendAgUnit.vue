<template>
  <div>
    <q-select
      outlined
      dense
      v-model="params.data.oid_unit"
      :options="options"
      option-label="label"
      emit-value
      @input="changeNumber(params)"
      map-options
    />
  </div>
</template>
<script>
export default {
  name: 'AgLendAgUnit',
  data () {
    return {
      options: [
        {
          label: '吨',
          value: '1'
        },
        {
          label: '升',
          value: '2'
        }
      ]
    }
  },
  computed: {},
  created () {
    // this.id = this.params.data.id;
  },
  mounted () {},
  methods: {
    changeNumber (params) {
      this.params.context.changeNumber(params)
    }
  }
}
</script>
