<template>
  <div class="q-gutter-x-sm">
    <q-btn unelevated color="warning" label="取出操作"  @click="showDetail" v-if="parseInt(params.data.cr_operate_type) == 1" />

    <q-btn unelevated color="positive" label="产生利息"  rounded v-if="parseInt(params.data.cr_operate_type) == 2" />

    <q-btn unelevated color="primary" label="取出利息" rounded  v-if="parseInt(params.data.cr_operate_type) == 3" />

    <q-btn unelevated color="orange" label="取出首存" rounded  v-if="parseInt(params.data.cr_operate_type) == 4" />
  </div>
</template>
<script>
export default {
  name: 'AgOperae',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showAddRecord () {
      this.params.context.showAddRecord(this.params.data.id)
    },
    showDetail () {
      this.params.context.showDetail(this.params.data.id)
    }

  }
}
</script>
