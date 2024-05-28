<template>
  <div>
    <q-chip
      size="12px"
      class="text-white"
      :color="params.data.ja_type == '1' ? 'green' : 'primary'"
    >
      {{ params.data.ja_type == "1" ? "首页头部广告" : "首页中部广告" }}
    </q-chip>
  </div>
</template>
<script>
export default {
  name: "AgChip",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {}
};
</script>
