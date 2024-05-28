<template>
  <div>
    <q-input
      dense
      outlined
      class="full-width"
      v-model="params.data.mrc_count"
      @change="changeTimes()"
    />
  </div>
</template>
<script>
export default {
  name: "AgTotalTimes",
  components: {},
  data() {
    return {
      totalTimesData: 0
    };
  },
  watch: {},
  limitedTime: "",

  computed: {},
  created() {},
  mounted() {},
  methods: {
    changeTimes() {
      var p = this.params;
      var data = p.data;

      if (this.totalTimesData) {
        var re = /^[0-9]*[0-9][0-9]*$/;
        if (re.test(this.totalTimesData)) {
          data.mrc_count = this.totalTimesData;
          data.mrc_totalPrice = this.totalTimesData * data.mrc_price;
        }
      }
      this.params.context.changeTimeValue(this.params);
    }
  }
};
</script>
