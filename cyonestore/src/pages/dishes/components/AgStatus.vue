<template>
  <div>
    <q-badge outline v-if="parseInt(params.data.goo_status) == 1" color="info">
      上架
    </q-badge>
    <q-badge outline v-else color="warning">
      下架
    </q-badge>
  </div>
</template>
<script>
export default {
  name: 'AgStatus',
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
