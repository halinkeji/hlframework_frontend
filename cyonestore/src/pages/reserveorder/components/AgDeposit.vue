<template>
  <div>
    <q-chip square dense color="red" text-color="white" v-if="parseInt(params.data.drr_deposit) == 0">
      ￥0
    </q-chip>
    <q-chip square dense color="deep-orange" text-color="white" v-else-if="parseInt(params.data.drr_deposit) > 0">
     ￥{{params.data.drr_deposit}}
    </q-chip>
  </div>
</template>
<script>
export default {
  name: 'AgDeposit',
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
