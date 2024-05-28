<template>
  <div>
    <q-select outlined v-model="goods_type" :options="options" dense label="请选择商品状态" emit-value map-options />
  </div>
</template>
<script>
export default {
  name: 'AgCountType',
  data () {
    return {
      goods_type: '',
      options: [
        {
          lable: '盘盈',
          value: 1
        },
        {
          lable: '盘亏',
          value: 2
        },
        {
          lable: '领用',
          value: 3
        },
        {
          lable: '报废',
          value: 4
        },
        {
          lable: '其他',
          value: 6
        }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
