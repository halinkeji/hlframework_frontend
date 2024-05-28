<template>
  <div>
    <span>【{{params.data.pha_time_number}}】{{cycleItem[params.data.pha_time_cycle]}}内到期</span>
  </div>
</template>
<script>
export default {
  name: 'AgCycle',
  components: {},
  data () {
    return {
      weekDay: '',
      cycleItem: {
        1: '年',
        2: '季度',
        3: '月',
        4: '周',
        5: '天',
        6: '小时'
      }
    }
  },
  created () {

  },
  mounted () {},
  computed: {},
  methods: {

  }
}
</script>
