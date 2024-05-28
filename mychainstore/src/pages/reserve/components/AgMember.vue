<template>
  <q-chip
    outline
    color="primary"
    text-color="white"
    v-if="params.data.mem_memberName"
  >
    {{ params.data.mem_memberName }}
  </q-chip>
  <q-chip outline  color="deep-orange " text-color="white" v-else>
    非会员
  </q-chip>
</template>
<script>
export default {
  name: 'AgMember',
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
