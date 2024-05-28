<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width
    }"
  >
    <q-select
      
      style="width:80%"
      v-model="params.data.mrc_limitTime"
      @change="changeTimeTitle()"
      :options="goodsTypedata"
      option-value="value"
      option-label="label"
      emit-value
      map-options
      dense
    />
  </div>
</template>
<script>
export default {
  name: "AgTimeCycle",
  components: {},
  data() {
    return {
      goodsTypedata: [
        {
          label: "不限制",
          value: '1'
        },
        {
          label: "年",
          value: '2'
        },
        {
          label: "季度",
          value: '3'
        },
        {
          label: "月",
          value: '4'
        },
        {
          label: "周",
          value: '5'
        },
        {
          label: "天",
          value: '6'
        }
      ]
    };
  },
  watch: {},

  computed: {},
  created() {},
  mounted() {},
  methods: {
    changeTimeTitle() {
      this.params.context.changeTimeValue(this.params);
    }
  }
};
</script>
