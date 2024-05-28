<template>
  <div>
    <q-chip color="primary" text-color="white" dense v-if="parseInt(params.data.scp_time_type) == 1">
      {{ params.data.scp_regular_hours }} 小时有效
    </q-chip>

    <q-chip color="positive" text-color="white" dense v-if="parseInt(params.data.scp_time_type) == 2">
      {{ params.context.fortyEightHourText[params.data.scp_time_period_start]  }} 至 {{ params.context.fortyEightHourText[params.data.scp_time_period_end]  }} 有效
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgType',
  data () {
    return {

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
