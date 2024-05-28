<template>
  <div>
       <q-badge color="amber"  floating class="q-ma-xs" v-if="parseInt(params.data.pmm_is_main) == 1" label="总部" />
   {{ params.data.name }}
  </div>
</template>

<script>
export default {
  name: 'AgStatusChip',
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>

<style scoped></style>
