<template>
  <div class="row q-gutter-sm">
    <q-btn unelevated round color="primary" dense icon="las la-edit" @click="showAddTag">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>

    <q-btn unelevated round color="red" dense  icon="las la-trash-alt" @click="delTag">
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
      dataId: '',
      qrcodeDialog: false,
      baseImageUrl: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    closeDialog () {
      this.qrcodeDialog = false
      this.baseImageUrl = ''
    },
    showAddTag () {
      this.dataId = this.params.data.id
      this.params.context.showAddTag(this.dataId)
    },
    delTag () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.srt_title}"的标签吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('roomTag/deleteTagData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除标签!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
    }

  }
}
</script>
