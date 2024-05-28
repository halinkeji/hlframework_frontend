<template>
  <div>
    <q-badge outline v-if="params.data.oid_status == '2'" color="blue-grey" size="sm">
      取油
    </q-badge>
    <q-badge outline v-if="params.data.oid_status == '1'" size="sm" color="primary">
      开油
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
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
