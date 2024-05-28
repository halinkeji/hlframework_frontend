<template>
  <div>
    <div   v-if="parseInt(params.data.tcp_expire_type) == 1">
     永久有效
    </div>
    <div   v-if="parseInt(params.data.tcp_expire_type) == 2">
     {{ params.data.tcp_relative_time_number }}  {{ timeTypeObject[params.data.tcp_relative_time_cycle] }}内有效
    </div>

    <div  v-if="parseInt(params.data.tcp_expire_type) == 3">
      {{ $q_date.formatDate(params.data.tcp_regular_start_time * 1000, 'YYYY-MM-DD HH:mm:ss')  }} 至 {{ $q_date.formatDate(params.data.tcp_regular_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') }} 有效
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgType',
  data () {
    return {
      timeTypeObject: {
        1: '年',
        2: '个季度',
        3: '个月',
        4: '周',
        5: '天',
        6: '小时'
      }
    }
  },
  mounted () {},
  computed: {},
  created () {

  },
  methods: {}
}
</script>

<style scoped></style>
