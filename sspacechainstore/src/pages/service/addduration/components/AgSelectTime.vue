<template>
  <div>
    <template v-if="parseInt(params.data.rtb_duration_type) == 2">
      <div class="row" text-align="center">
        <div class="col-4">
          <q-input
            dense
            class=" q-px-sm full-height"
            v-model="params.data.rtb_time_compute_number"
            @change="computedDuration"
          >
          </q-input>
        </div>
        <div class="col-4">
          <q-select
            class=" q-px-sm full-height"
            v-model="params.data.rtb_time_compute_model"
            :options="timeModel"
            @input="computedDuration"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            dense
          />
        </div>
        <div class="col-4">
          <q-chip outline color="primary" text-color="white">
            {{ params.data.rtb_duration_total }}分钟
          </q-chip>
        </div>
      </div>
    </template>
    <template v-if="parseInt(params.data.rtb_duration_type) == 1">
      <q-input
        dense
        class="col-12 col-xs-6 col-sm-2"
        v-model="params.data.rtb_duration_total"
        @change="durationError"
      />
    </template>
  </div>
</template>
<script>
export default {
  name: 'AgSelectTime',
  components: {},
  data () {
    return {
      timeModel: [
        { label: '年', value: '1' },
        { label: '季', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '日', value: '5' }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    durationError () {
      const regu = /^\+?[1-9][0-9]*$/
      if (this.params.data.rtb_duration_total) {
        if (!regu.test(this.params.data.rtb_duration_total)) {
          this.$q.notify({
            message: '注意',
            caption: '请输入正整数！',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.params.data.rtb_duration_total = '1'
          return false
        }
        console.log(this.params.data)
        this.params.context.changeTimeValue(this.params)
      }
    },
    numberError () {
      const regu2 = /^\+?[1-9][0-9]*$/
      if (this.params.data.rtb_time_compute_number) {
        if (!regu2.test(this.params.data.rtb_time_compute_number)) {
          this.$q.notify({
            message: '注意',
            caption: '请输入正整数！',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.params.data.rtb_time_compute_number = '1'
        }
      }
    },
    computedDuration () {
      this.numberError()
      this.params.context.computedDuration(this.params)
    }
  }
}
</script>
