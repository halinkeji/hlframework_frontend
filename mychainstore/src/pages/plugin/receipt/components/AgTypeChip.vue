<template>
  <div>
    <q-chip size="sm" color="red" text-color="white" v-if="params.data.pr_status == 0">未开票</q-chip>
    <q-chip size="sm" color="green" text-color="white" v-if="params.data.pr_status == 1">已开票</q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgTypeChip',
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
