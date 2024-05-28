<template>
  <div>
    <q-btn flat rounded color="primary" class="q-mr-sm" icon="create" @click="showPopup" v-if="authorityMeta('editTemplate')">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>
    <q-btn flat rounded color="red" icon="delete_forever" @click="delTemplate" v-if="authorityMeta('delTemplate')">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'TemplateAgOperate',
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
      this.params.context.showAddTemplate(this.dataId)
    },
    delTemplate () {
      this.$q
        .dialog({
          title: '确定',
          message: '删除这条数据吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id,
            formId: this.params.data.form_id
          }
          this.$store.dispatch('formfield/delTemplateData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除表单模板数据',
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
