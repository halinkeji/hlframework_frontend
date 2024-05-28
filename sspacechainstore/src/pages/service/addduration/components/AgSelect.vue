<template>
  <div>
    <div class="q-gutter-xs" text-align="center">
      <q-select
        class=" q-px-sm full-height"
        v-model="params.data.rtb_duration_type"
        :options="timeType"
        option-value="value"
        option-label="label"
        @input="computedDuration()"
        emit-value
        map-options
        dense
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "AgSelect",
  components: {},
  data() {
    return {
      timeType: [
        { label: "固定时间", value: "1" },
        { label: "时效计算器", value: "2" }
      ]
    };
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {
    computedDuration() {
      this.params.context.computedDuration(this.params);
    }
  }
};
</script>
