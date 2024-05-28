<template>
  <div>
    <q-btn  @click.stop="deleteBut(params.rowIndex)" unelevated color="red">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgLabelButton',
  data () {
    return {
      row: ''
    }
  },

  created () {

  },
  mounted () {},
  computed: {},
  methods: {
    // 删除单个商品
    deleteBut (index) {
      this.params.context.rewardBindUser.splice(index, 1)
    }
  }
}
</script>
