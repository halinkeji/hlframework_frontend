<template>
  <div v-if="!params.data.show_status">
    <q-btn
      color="primary"
      icon="ion-eye"
      unelevated
      flat
      :to="{ name: 'erpViewData', query: { id: params.data.id, archives_id: params.data.cad_archives_id } }"
    >
      <q-tooltip>
        详情
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgButton',
  data () {
    return {
      dataId: 0
    }
  },
  computed: {},
  created () {
    this.dataId = this.params.data.main_goods_id
  },
  mounted () {},
  methods: {}
}
</script>
