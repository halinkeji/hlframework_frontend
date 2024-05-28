<template>
  <div>
    <q-chip size="sm" color="red" text-color="white" v-if="params.data.prt_type == 1">个人/事业单位</q-chip>
    <q-chip size="sm" color="green" text-color="white" v-if="params.data.prt_type == 2">单位</q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgTypeBg',
  data () {
    return {
      params: []
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
