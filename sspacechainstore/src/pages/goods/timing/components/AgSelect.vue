<template>
  <div class="q-gutter-xs" >

    <q-select v-model="params.data.tgd_time_compute_type" :options="timeType" option-label="label" map-options emit-value dense @input="computedDuration" />
  </div>
</template>
<script>
export default {
  name: 'AgSelect',
  components: {},
  data () {
    return {
      timeType: [
        { label: '自定义时长', value: '1' },
        { label: '时效计算器', value: '2' }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    computedDuration () {
      switch (this.params.data.tgd_time_compute_model) {
        case '7':
          this.params.data.tgd_time_compute_duration = 1 * parseInt(this.params.data.tgd_time_compute_number)
          break
        case '6':
          this.params.data.tgd_time_compute_duration = 60 * parseInt(this.params.data.tgd_time_compute_number)
          break
        case '5':
          this.params.data.tgd_time_compute_duration = 1440 * parseInt(this.params.data.tgd_time_compute_number)
          break
        case '4':
          this.params.data.tgd_time_compute_duration = 10080 * parseInt(this.params.data.tgd_time_compute_number)
          break
        case '3':
          this.params.data.tgd_time_compute_duration = 43200 * parseInt(this.params.data.tgd_time_compute_number)
          break
        case '2':
          this.params.data.tgd_time_compute_duration = 129600 * this.params.data.tgd_time_compute_number
          break
        case '1':
          this.params.data.tgd_time_compute_duration = 525600 * parseFloat(this.params.data.tgd_time_compute_number)
          break
      }
    }
  }
}
</script>
