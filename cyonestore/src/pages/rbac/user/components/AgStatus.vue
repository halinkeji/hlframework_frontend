<template>
  <div style="justify-content: center">
    <q-toggle
      @input="changeStatus($event)"
      v-model="params.data.status"
      :true-value="'1'"
      :false-value="'0'"
      v-if="authorityMeta('edit')"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: 'AgStatus',
  data () {
    return {}
  },
  computed: {},
  methods: {
    changeStatus (event) {
      const payload = {
        id: parseInt(this.params.data.id),
        status: event
      }
      this.$store
        .dispatch('user/setUserInfo', payload)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '用户状态更新成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: '用户状态更新失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
