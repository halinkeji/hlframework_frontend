<template>
  <div>
    <div v-if="buttonData.mcl_time_type == 1">永久有效</div>
    <div v-if="buttonData.mcl_time_type == 2">
      从
      {{ this.$q_date.formatDate(buttonData.mcl_start_time * 1000, 'YYYY-MM-DD  HH:mm:ss') }}
      到
      {{ this.$q_date.formatDate(buttonData.mcl_end_time * 1000, 'YYYY-MM-DD  HH:mm:ss') }}有效
    </div>
    <!-- {{ this.$q_date.formatDate(timeStamp, "YYYY-MM-DD") }} -->
    <div v-if="buttonData.mcl_time_type == 3">领取后{{ buttonData.mcl_start_time }}{{ time }}内有效</div>
  </div>
</template>
<script>
export default {
  name: 'ItemButton',
  data () {
    return {
      buttonData: {},
      time: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.buttonData = this.params.data
    if (this.buttonData.mcl_end_time == 1) {
      this.time = '年'
    } else if (this.buttonData.mcl_end_time == 2) {
      this.time = '季度'
    } else if (this.buttonData.mcl_end_time == 3) {
      this.time = '月'
    } else if (this.buttonData.mcl_end_time == 4) {
      this.time = '周'
    } else if (this.buttonData.mcl_end_time == 5) {
      this.time = '天'
    }
  },
  methods: {}
}
</script>
<style scoped></style>
