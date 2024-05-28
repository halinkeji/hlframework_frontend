<template>
  <div>
    <q-chip
      square
      dense
      color="red"
      text-color="white"
      v-if="parseInt(params.data.drr_type) == 2"
    >
      预约占位
    </q-chip>
    <q-chip
      square
      dense
      color="deep-orange"
      text-color="white"
      v-else-if="parseInt(params.data.drr_type) == 1"
    >
      预约点餐
    </q-chip>
  </div>
</template>
<script>
export default {
  name: 'AgType',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
