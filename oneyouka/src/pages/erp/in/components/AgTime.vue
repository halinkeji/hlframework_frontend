<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width
    }"
  >
    <q-input
      outlined
      v-model="params.data.eb_maturity_time"
      label="预警时间"
      class="q-ma-sm q-pr-md"
      dense
      square
      readonly
    >
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date
              v-model="params.data.eb_maturity_time"
              mask="YYYY-MM-DD HH:mm:ss"
              today-btn
              minimal
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="确定" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time
              v-model="params.data.eb_maturity_time"
              mask="YYYY-MM-DD HH:mm:ss"
              format24h
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="确定" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'AgTime',
  data () {
    return {
      dataId: 0,
      maturity_time: '',
      depotData: []
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
    // this.maturity_time = this.$q_date.formatDate(this.params.data.eb_maturity_time * 1000, 'YYYY-MM-DD HH:mm:ss')
  },
  watch: {},
  methods: {}
}
</script>
