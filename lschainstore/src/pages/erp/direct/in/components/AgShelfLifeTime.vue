<template>
  <div>
    <template>
      <q-input v-model="epd_shelf_life_time" label="到期时间" disable dense emit-value map-options square readonly>
        <template v-slot:prepend>
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date minimal v-model="epd_shelf_life_time" mask="YYYY-MM-DD" flat>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="关闭" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </template>
      </q-input>
    </template>
  </div>
</template>
<script>
export default {
  name: 'AgShelfLifeTime',
  components: {},
  data () {
    return {
      epd_shelf_life_time: ''
    }
  },
  watch: {
    epd_shelf_life_time (val) {
      this.params.data.epd_shelf_life_time = this.$q_date.formatDate(val, 'X')
    }
  },

  computed: {},
  created () {
    this.epd_shelf_life_time = this.$q_date.formatDate(this.params.data.epd_shelf_life_time * 1000, 'YYYY-MM-DD')
  },
  mounted () {},
  methods: {

  }
}
</script>
