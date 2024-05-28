<template>
  <div class="row q-gutter-sm">
    <q-input class="col-auto" readonly outlined dense v-model="shiftDate" mask="date" :rules="['date']" label="选择班次">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="shiftDate">
              <div class="row items-center justify-end">
                <q-btn @click="getList" v-close-popup label="确认" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <div v-if="allDateList.length > 0" class="col-auto" v-for="(item, key) in allDateList">
      <q-btn unelevated :color="shiftId == item.id ? 'primary' : 'grey'" @click="selectedShiftDate(item)">
        {{ $q_date.formatDate(item.psr_heir_time * 1000, 'YYYY-MM-DD HH:mm') }}至{{ $q_date.formatDate(item.psr_transfer_time * 1000, 'YYYY-MM-DD HH:mm') }}
      </q-btn>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      shiftDate: '',
      allDateList: [],
      shiftId: ''
    }
  },

  mounted () {},
  created () {
    this.getList()
  },
  computed: {},
  methods: {
    getList () {
      const obj = {
        shiftDate: this.$q_date.formatDate(this.shiftDate, 'X')
      }
      this.$store
        .dispatch('shift/getShiftDate', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            const allDate = res.data
            this.allDateList = allDate
            this.selectedShiftDate(allDate[0])
          }
        })
        .catch((error) => {})
    },

    selectedShiftDate (item) {
      this.shiftId = item.id
      this.$emit('getPeriod', item.psr_heir_time, item.psr_transfer_time)
    }
  }
}
</script>
