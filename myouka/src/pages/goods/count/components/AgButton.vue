<template>
  <div>
    <q-btn class="q-ml-sm" v-if="!params.data.showEdit" unelevated @click.stop="deleteBut(row)" color="red">删除</q-btn>
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
    // 删除单个商品
    deleteBut (index) {
      this.params.context.specNewsData.splice(index, 1)
      this.params.context.setTopTabel(this.params.context.specNewsData)
    }
  }
}
</script>
