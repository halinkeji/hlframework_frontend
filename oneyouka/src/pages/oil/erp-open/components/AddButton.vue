<template>
  <div>
    <q-btn class="q-ml-sm" unelevated v-if="!params.data.showEdit" @click.stop="deleteBut(params.rowIndex)" color="red" flat round icon="las la-trash"></q-btn>
  </div>
</template>
<script>
export default {
  name: 'AddButton',
  data () {
    return {

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
      this.params.context.probuctData.splice(index, 1)
    }
  }
}
</script>
