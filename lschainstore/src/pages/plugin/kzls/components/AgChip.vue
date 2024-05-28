<template>
  <div>
    <q-chip
      v-if="params.data.pki_status == '1'"
      class="text-white"
      color="red"
      square
    >
      开支
    </q-chip>
    <q-chip
      v-if="params.data.pki_status == '2'"
      class="text-white"
      color="green"
      square
    >
      收入
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
