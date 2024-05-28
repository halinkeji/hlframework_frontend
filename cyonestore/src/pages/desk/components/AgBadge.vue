<template>
  <div>
    <q-badge outline v-if="params.data.dp_status == '1'" color="red">
      未开台
    </q-badge>
    <q-badge outline v-if="params.data.dp_status == '2'" color="green">
      已开台
    </q-badge>
    <q-badge outline v-if="params.data.dp_status == '3'" color="primary">
      已下单
    </q-badge>
  </div>
</template>
<script>
export default {
  name: 'AgBadge',
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
