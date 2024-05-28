<template>
  <div>
    <q-btn  unelevated @click="deleteBut(row)" color="red">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgButton',
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
    // 删除单个规格
    deleteBut (index) {
      this.$q
        .dialog({
          title: '确定',
          message: '删除商品名规格？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.params.context.tableData.splice(index, 1)
        })
    }
  }
}
</script>
