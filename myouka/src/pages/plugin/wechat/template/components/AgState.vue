<template>
  <div>
    <q-chip color="green" text-color="white" v-if="this.params.data.state == 0">
      发送完成
    </q-chip>
    <q-chip color="primary" text-color="white" v-if="this.params.data.state == 1">
      发送未开始
    </q-chip>
    <q-chip color="amber" text-color="white" v-if="this.params.data.state == 2">
      未生成发送列表
    </q-chip>
  </div>
</template>

<script>
export default {
  name: "AgState",
  data() {
    return {
    };
  },
  mounted() {},
  created() {
  },
  computed: {},
  methods: {}
};
</script>

<style></style>
