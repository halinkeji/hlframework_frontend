<template>
  <q-img :src="data.headimgurl" style="height: 50px ;width: 50px" />
</template>
<script>
export default {
  name: "PictureItem",
  data() {
    return {
      data: {}
    };
  },
  created() {
    this.data = this.params.data;
  },
  mounted() {},
  computed: {},
  methods: {}
};
</script>
<style scoped></style>
