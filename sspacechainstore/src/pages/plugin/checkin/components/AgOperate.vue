<template>
  <div>
    <div>
      <q-btn
        color="primary"
        class="q-mt-sm q-mx-sm"
        unelevated
        label="修改"
        @click="editData"
        v-if="authorityMeta('edit')"
      />
      <q-btn
        color="red"
        class="q-mt-sm"
        unelevated
        label="删除"
        v-if="authorityMeta('del')"
        @click="confirmDeleteRecord"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    editData () {
      this.$nextTick(() => {
        this.params.context.addChechinRules(this.params.data.id)
      })
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定删除这条规则吗',
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      const obj = {
        id: [this.params.data.id]
      }
      this.$store
        .dispatch('checkin/delRule', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '删除成功',
              color: 'green'
            })
            this.params.context.getList()
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '错误',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map(obj => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
