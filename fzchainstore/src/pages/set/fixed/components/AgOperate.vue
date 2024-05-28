<template>
  <div>
      <q-btn label="修改" color="primary" class="q-mt-sm q-mx-sm" unelevated v-if="authorityMeta('edit')" @click="editData()" />
      <q-btn label="删除" color="red" v-if="authorityMeta('del')" class="q-mt-sm" unelevated @click="confirmDeleteRecord()" />
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    editData () {
      this.$nextTick(() => {
        this.params.context.showPopup(this.params.data.id)
      })
    },

    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          title: '是否确认',
          message: '确认删除此数值吗？',
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const obj = {
        id: [this.params.data.id]
      }
      this.$store
        .dispatch('fixed/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '成功删除固定金额',
              color: 'green'
            })
            this.params.context.getFixedmoneyList(this.params.data.fm_type)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
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
