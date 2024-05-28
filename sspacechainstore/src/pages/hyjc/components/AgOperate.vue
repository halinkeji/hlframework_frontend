<template>
  <div class="q-gutter-x-sm">
    <q-btn unelevated  color="primary" label="修改" @click="showAddRecord" v-if="authorityMeta('editRecord')" />
    <q-btn unelevated color="warning" label="存取处理" @click="showDetail" v-if="authorityMeta('detailRecord')" />
    <q-btn unelevated color="red" label="删除" @click="delRecord" v-if="authorityMeta('delRecord')" />
  </div>
</template>
<script>
export default {
  name: 'AgOperae',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showAddRecord () {
      this.params.context.showAddRecord(this.params.data.id)
    },
    showDetail () {
      this.params.context.showDetail(this.params.data.id)
    },
    delRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.phr_name}"的寄存记录吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('hyjc/delRecordAll', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除寄存记录!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
    },
    authorityMeta (key) {
      return true
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
