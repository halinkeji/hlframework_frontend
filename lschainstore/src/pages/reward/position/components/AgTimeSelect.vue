<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <div class="q-gutter-sm">
      <q-radio dense v-model="params.data.rpd_type" val="1" label="额度" @input="typeChange(params.data)" />
      <q-radio dense v-model="params.data.rpd_type" val="2" label="比例" @input="typeChange(params.data)" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'AgTimeSelect',
  components: {},
  data() {
    return {
      roleOptions: [
        { label: '永久有效', value: '1' },
        { label: '相对时间', value: '2' },
        { label: '固定时间', value: '3' },
      ],
    };
  },
  watch: {},

  computed: {},
  created() {},
  mounted() {},
  methods: {
    changeTimeTitle() {
      this.params.context.changeTimeValue(this.params);
    },
    typeChange(data){
      if (data.rpd_type == '1') {
         this.params.data.rpd_performance_proportion = ''
      }
      if (data.rpd_type == '2') {
         this.params.data.rpd_performance_amount = ''
      }
    }
  },
};
</script>
