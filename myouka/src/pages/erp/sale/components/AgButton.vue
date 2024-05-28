<template>
  <div>
    <q-btn
      color="red"
      unelevated
      v-if="params.data.bid > 0 && authorityMeta('return')"
      :to="{ name: 'saleReturn', query: { id: params.data.bid } }"
      >退货
    </q-btn>
  </div>
</template>

<script>
export default {
  name: "AgButton",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    authorityMeta(key) {
      if (this.$route.meta) {
        let new_arr = this.$route.meta.map(obj => {
          return obj.id;
        });
        if (new_arr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
