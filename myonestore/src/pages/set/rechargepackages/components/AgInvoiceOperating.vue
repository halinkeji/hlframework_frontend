<template>
  <div>
    <div>
      <q-btn
        class=" q-ma-xs"
        color="primary"
        icon="ion-eye"
        flat
        round
        @click="viewBut()"
      />
    </div>

    <view-details ref="viewDetails"></view-details>
  </div>
</template>

<script>
import ViewDetails from "./ViewDetails.vue";
export default {
  name: "AgInvoiceOperating",
  components: {
    ViewDetails
  },
  data() {
    return {};
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {
    //查看详情
    viewBut() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.viewDetails.getViewData(
            this.params.data.consumeinvoice_id
          );
        }, 200);
      });
    }
  }
};
</script>
