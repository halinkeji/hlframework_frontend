<template>
  <div>
    <q-btn flat rounded color="red" icon="delete_forever" @click="del(row)" />
  </div>
</template>
<script>
export default {
  name: 'RecordAgDel',
  components: {},
  data () {
    return {
      row: ''
    }
  },
  mounted () {},
  created () {
    this.row = this.params.rowIndex
  },
  computed: {},
  methods: {
    del (index) {
      this.params.context.recordListData.splice(index, 1)
    }
  }
}
</script>
