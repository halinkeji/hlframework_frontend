<template>
  <div class="row full-width">
    <!-- <div class="col-4"> -->
    <q-btn-toggle
      v-model="countCycle"
      unelevated
      class="my-custom-toggle"
      no-caps
      @input="getList"
      toggle-color="primary"
      color="white"
      text-color="black"
      :options="[
        { label: '当前', value: '1' },
        { label: '月度', value: '2' },
        { label: '季度', value: '3' },
        { label: '年度', value: '4' },
      ]"
    />
    <!-- </div> -->

    <!-- <div class="col-7"> -->
    <div class="row" v-if="countCycle == '1'">
      <div class="q-mx-sm">
        <q-input outlined dense label="当前时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat @click="getList" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row" v-if="countCycle == '2'">
      <div class="q-mx-sm">
        <q-input outlined dense label="月度时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat @click="getList" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row" v-if="countCycle == '3'">
      <div class="col-12 col-md-5 q-mx-sm">
        <q-input outlined dense label="开始时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat @click="getList" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-5 q-mr-sm">
        <q-input outlined dense label="结束时间" v-model="endTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="endTime" mask="YYYY-MM">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat @click="getList" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row" v-if="countCycle == '4'">
      <div class="q-mx-sm">
        <q-input outlined dense label="年度时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat @click="getList" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

     <q-btn unelevated color="primary" v-if="shiftItem.psr_get_time">
        {{ $q_date.formatDate(shiftItem.psr_get_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}至{{  $q_date.formatDate(shiftItem.psr_out_time * 1000, 'YYYY-MM-DD HH:mm:ss')}}
      </q-btn>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  name: 'count',
  components: {},
  data () {
    return {
      startTime: '',
      endTime: '',
      countCycle: '1',
      shiftItem: {}
    }
  },

  mounted () {
    this.getList()
  },
  created () {
    const nowDate = new Date()
    this.startTime = this.$q_date.formatDate(nowDate.getTime(), 'YYYY-MM-DD HH:mm:ss')
  },
  computed: {},
  methods: {
    getList () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')

      const obj = {
        countCycle: this.countCycle,
        startTime,
        endTime
      }
      this.$store
        .dispatch('shift/getShiftDate', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.shiftItem = res.data
            this.selectedShiftDate(res.data)
          } else {
            this.allDateList = []
          }
        })
        .catch((error) => {})
    },

    selectedShiftDate (item) {
      this.shiftId = item.id

      this.$emit('getPeriod', item.psr_get_time, item.psr_out_time)
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
