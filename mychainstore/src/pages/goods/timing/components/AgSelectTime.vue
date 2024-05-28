<template>

  <div >
    <div class=" row" v-if="parseInt(params.data.tgd_time_compute_type) == 2">
      <div>
        <q-input  dense v-model="params.data.tgd_time_compute_number" @change="computedDuration"> </q-input>
      </div>
      <div>
        <q-select v-model="params.data.tgd_time_compute_model" :options="timeModel" @input="computedDuration" option-label="label" map-options emit-value dense />
      </div>
      <div>
        <q-chip outline color="primary" text-color="white"> {{ params.data.tgd_time_compute_duration }}分 </q-chip>
      </div>
    </div>
    <div v-if="parseInt(params.data.tgd_time_compute_type) == 1">
      <q-input dense class="col-12 col-xs-6 col-sm-2" v-model="params.data.tgd_time_compute_duration" @change="durationError">
        <template v-slot:append>
          <q-chip outline color="primary" text-color="white"> 分 </q-chip>
        </template>
      </q-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AgSelectTime',
  components: {},
  data () {
    return {
      timeModel: [
        { label: '分', value: '7' },
        { label: '时', value: '6' },
        { label: '日', value: '5' },
        { label: '周', value: '4' },
        { label: '月', value: '3' }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    durationError () {
      const regu = /^\+?[1-9][0-9]*$/
      if (this.params.data.tgd_time_compute_duration) {
        if (!regu.test(this.params.data.tgd_time_compute_duration)) {
          this.$q.notify({
            message: '注意',
            caption: '请输入正整数！',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.params.data.tgd_time_compute_duration = ''
        }
      }

      const itemsToUpdate = []

      itemsToUpdate.push(this.params.data)

      const res = this.params.api.applyTransaction({ update: itemsToUpdate })
    },
    numberError () {
      const regu2 = /^\+?[1-9][0-9]*$/
      if (this.params.data.tgd_time_compute_number) {
        if (!regu2.test(this.params.data.tgd_time_compute_number)) {
          this.$q.notify({
            message: '注意',
            caption: '请输入正整数！',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.params.data.tgd_time_compute_number = ''
        }
      }
      const itemsToUpdate = []

      itemsToUpdate.push(this.params.data)

      const res = this.params.api.applyTransaction({ update: itemsToUpdate })
    },
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

      this.numberError()
    }
  }
}
</script>
