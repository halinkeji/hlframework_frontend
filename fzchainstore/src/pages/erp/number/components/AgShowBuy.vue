<template>
  <div v-if="!params.data.show_status">
    <q-btn
      v-if="params.data.buy_number > 0 && authorityMeta('onBuy')"
      class="text-subtitle1"
      padding="xs lg"
      color="primary"
      size="sm"
      :to="{ name: 'erpPurchaseView', query: { id: params.data.id, archives_id: params.data.cad_archives_id } }"
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
  data() {
    return {
      dataId: 0,
    };
  },
  mounted() {},
  computed: {},
  created() {
    this.dataId = this.params.data.id;
  },
  methods: {
    authorityMeta(key) {
      return true;
      // if (this.$route.meta) {
      //   const new_arr = this.$route.meta.map((obj) => {
      //     return obj.id
      //   })
      //   if (new_arr.indexOf(key) >= 0) {
      //     return true
      //   }
      // }
      // return false
    },
  },
};
</script>
