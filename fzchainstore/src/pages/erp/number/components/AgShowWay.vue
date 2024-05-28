<template>
  <div v-if="!params.data.show_status">
    <q-btn
      v-if="params.data.way_number > 0 && authorityMeta('onWay')"
      padding="xs lg"
      color="info"
      size="sm"
      :to="{ name: 'erpOnWayView', query: { id: params.data.id, archives_id: params.data.cad_archives_id } }"
    >
      <span class="text-subtitle1"> {{ params.data.way_number }}</span>
    </q-btn>
    <span class="text-info" v-else>
      {{ params.data.way_number }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AgShowWay',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    authorityMeta (key) {
      return true
      // if (this.$route.meta) {
      //   const new_arr = this.$route.meta.map((obj) => {
      //     return obj.id
      //   })
      //   if (new_arr.indexOf(key) >= 0) {
      //     return true
      //   }
      // }
      // return false
    }
  }
}
</script>
