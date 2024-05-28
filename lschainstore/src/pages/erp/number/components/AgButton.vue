<template>
  <div v-if="!params.data.show_status">
    <q-btn color="primary" icon="ion-eye" unelevated flat @click="goPage(params.data)">
      <q-tooltip> 详情 </q-tooltip>
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

  },
  mounted () {},
  methods: {
    goPage (params) {
      const query = {}

      if (params.main_goods_id > 0) {
        query.archives_id = params.main_goods_id
      }
      if (params.main_spe_id > 0) {
        query.id = params.main_spe_id
      }

      this.$router.push({ name: 'viewData', query })
    }
  }
}
</script>
