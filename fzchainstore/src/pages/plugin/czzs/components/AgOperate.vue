<template>
  <div v-if="parseInt(params.data.pcr_status) == 2">
    <q-btn @click="confirmDeleteRecord(1)" v-if="authorityMeta('edit')" color="primary" class="q-mr-sm" unelevated>审批 </q-btn>
    <q-btn color="red" unelevated @click="confirmDeleteRecord(3)" v-if="authorityMeta('edit')">拒绝</q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperate',
  data () {
    return {
      params: [],
      dataId: '',
      delectPrompt: false
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    confirmDeleteRecord (type) {
      this.$q
        .dialog({
          title: '确定',
          message: `${type == 1 ? '通过' : '拒绝'} "${this.params.data.pcr_give_member_name}"的转赠申请吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id,
            pcr_status: type
          }
          this.$store.dispatch('czzs/setCzzsRecord', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '修改状态成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.params.context.getCzzsRecord()
            }
          })
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },
    authorityMeta (key) {
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
