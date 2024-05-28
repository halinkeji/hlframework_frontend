<template>
  <div >
    <q-btn flat dense rounded color="red"  @click="delData(row)" icon="delete_forever" />
  </div>
</template>
<script>
export default {
  name: 'AgLendAgDel',
  data () {
    return {
      row: ''
    }
  },
  computed: {},
  created () {
    this.row = this.params.rowIndex
  },
  mounted () {},
  methods: {
    // 删除Ag表格行数据
    delData (index) {
      this.params.context.take.splice(index, 1)
    }
  }
}
</script>
