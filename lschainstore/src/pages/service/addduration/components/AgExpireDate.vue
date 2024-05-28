<template>
  <div>
    <template v-if="parseInt(params.data.rtb_expiry_time_type) == 1"
      >永久有效</template
    >
    <template v-if="parseInt(params.data.rtb_expiry_time_type) == 2">
      <div class="row " text-align="center">
        <div class="col-6">
          <q-input
            dense
            v-model="params.data.rtb_time_rule_start"
            class=" q-px-sm full-height"
            @change="limitNumberTimes()"
          />
        </div>
        <div class="col-6">
          <q-select
            class=" q-px-sm full-height"
            v-model="params.data.rtb_time_rule_end"
            @change="limitNumberTimes()"
            :options="timeLimitData"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
          />
        </div>
      </div>
    </template>
    <template v-if="parseInt(params.data.rtb_expiry_time_type) == 3">
      <q-input
        v-model="rtb_time_rule_end"
        label="选择到期时间"
        dense
        emit-value
        map-options
        square
        readonly
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date minimal v-model="rtb_time_rule_end" mask="YYYY-MM-DD" flat>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="关闭" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </template>
  </div>
</template>
<script>
export default {
  name: "AgExpireDate",
  components: {},
  data() {
    return {
      rtb_time_rule_end: "",
      timeLimitData: [
        {
          label: "年",
          value: "1"
        },
        {
          label: "季度",
          value: "2"
        },
        {
          label: "月",
          value: "3"
        },
        {
          label: "周",
          value: "4"
        },
        {
          label: "天",
          value: "5"
        }
      ]
    };
  },
  watch: {
    rtb_time_rule_end(val) {
      if (parseInt(this.params.data.rtb_expiry_time_type) == 3) {
        this.params.data.rtb_time_rule_end = this.$q_date.formatDate(val, "X");
      }
    },
    "params.data.rtb_expiry_time_type"(val) {
      if (parseInt(val) == 2) {
        this.params.data.rtb_time_rule_start = 1;
        this.params.data.rtb_time_rule_end = "1";
      } else if (parseInt(val) == 3) {
        this.rtb_time_rule_end = this.$q_date.formatDate(
          new Date(),
          "YYYY-MM-DD"
        );
      }
    }
  },

  computed: {},
  created() {
    this.rtb_time_rule_end = this.$q_date.formatDate(
      this.params.data.rtb_time_rule_end * 1000,
      "YYYY-MM-DD"
    );
  },
  mounted() {},
  methods: {
    //限制时数
    limitNumberTimes() {
      var p = this.params;
      var updateData = [];
      if (p.data.rtb_time_rule_start) {
        var re = /^[0-9]*[0-9][0-9]*$/;
        if (!re.test(p.data.rtb_time_rule_start)) {
          p.data.rtb_time_rule_start = 1;
        }
      }
      updateData.push(p.data);

      var res = p.api.applyTransaction({ update: updateData });

      this.params.context.changeTimeValue(this.params);
    }
  }
};
</script>
