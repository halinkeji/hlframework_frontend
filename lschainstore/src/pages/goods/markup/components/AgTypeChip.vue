<template>
  <div>
    <q-chip color="primary" text-color="white" size="sm" v-if="params.data.cm_markup_type == 1">
      成本价 *（1 + N%) 元
    </q-chip>
    <q-chip color="green" text-color="white" size="sm" v-if="params.data.cm_markup_type == 2">
      成本价 + N 元
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'TypeChip',
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
