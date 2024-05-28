<template>
  <div>
    <q-btn unelevated dense color="primary" class="q-px-sm" label="查看" @click="getGoodsData" />
  </div>
</template>
<script>
export default {
  name: 'AgButton',
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    getGoodsData() {
      this.params.context.goShowType(this.params.data.id);
    },
  },
};
</script>
