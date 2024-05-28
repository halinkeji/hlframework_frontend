<template>
  <div v-if="!params.data.show_status">
    <q-btn
      v-if="params.data.buy_number > 0 && authorityMeta('onBuy')"
      class="text-subtitle1"
      color="primary"
      size="sm"
      @click="goPage(params.data)"
    >
      <span class="text-subtitle1"> {{ params.data.buy_number }}</span>
    </q-btn>

    <span class="text-info" v-else>
      {{ params.data.buy_number }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AgShowBuy',
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
    },
    goPage (params) {
      const query = {}

      if (params.main_goods_id > 0) {
        query.archives_id = params.main_goods_id
      }
      if (params.main_spe_id > 0) {
        query.id = params.main_spe_id
      }

      this.$router.push({ name: 'erpPurchaseView', query })
    }
  }
}
</script>
