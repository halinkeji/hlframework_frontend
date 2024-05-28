<template>
  <div>
    <span v-if="parseInt(params.data.phr_type)==1">每周{{weekDay}}</span>
    <span v-if="parseInt(params.data.phr_type)==2">每月{{params.data.phr_day}}号</span>
  </div>
</template>
<script>
export default {
  name: 'AgCycle',
  components: {},
  data () {
    return {
      weekDay: ''
    }
  },
  created () {
    this.setWeek()
  },
  mounted () {},
  computed: {},
  methods: {
    setWeek () {
      switch (parseInt(this.params.data.phr_day)) {
        case 1:
          this.weekDay = '一'
          break
        case 2:
          this.weekDay = '二'
          break
        case 3:
          this.weekDay = '三'
          break
        case 4:
          this.weekDay = '四'
          break
        case 5:
          this.weekDay = '五'
          break
        case 6:
          this.weekDay = '六'
          break
        case 7:
          this.weekDay = '日'
          break
        default:
          this.weekDay = ''
          break
      }
    }
  }
}
</script>
