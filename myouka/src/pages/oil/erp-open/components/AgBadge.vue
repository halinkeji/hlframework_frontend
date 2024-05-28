<template>
  <div>
    <q-badge
      outline
      v-if="params.data.oid_type == 'open'"
      color="#ecf5ff"
    >
      取油
    </q-badge>
    <q-badge
      outline
      v-if="params.data.oid_type == 'take'"
      size="sm"
      color="#ecf5ff"
    >
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
