<template>
  <div v-if="!params.data.show_status">
    <q-btn color="secondary" class="q-mx-sm" unelevated label="查看" @click="editPotion" />
  </div>
</template>

<script>
export default {
  name: 'AgRecordOperator',
  data() {
    return {
      dataId: 0,
      dialogShow: false,
    };
  },
  created() {
    this.dataId = this.params.data.id;
  },
  mounted() {},
  computed: {},
  methods: {
    editPotion() {
      this.data = this.params.data;
      this.params.context.showDetail(this.data);
    },
    authorityMeta(key) {
      return true;
    },
  },
};
</script>
