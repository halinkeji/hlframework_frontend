<template>
  <div>
    <q-btn flat rounded color="warning" icon="visibility" v-if="authorityMeta('template')" :to="{ name: 'formTemplate', query: { id: params.data.id } }">
      <q-tooltip>
        查看详情
      </q-tooltip>
    </q-btn>
    <q-btn flat rounded color="primary" icon="create" @click="showPopup" v-if="authorityMeta('editFiled')">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>
    <q-btn flat rounded color="red" icon="delete_forever" @click="delFormField" v-if="authorityMeta('delFiled')">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showAddFormField(this.dataId)
    },
    delFormField () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.pff_form_name}"的表单吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('formfield/delAll', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除表单!',
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
