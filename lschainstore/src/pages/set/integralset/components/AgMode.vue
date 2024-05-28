<template>
  <div>
    <q-toggle color="green" :true-value="'1'" :false-value="'0'" v-if="authorityMeta('edit') && editStatus" @input="updated" v-model="params.data.ic_status" />
  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {

      editStatus: false
    }
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')
      if (accountInfo && accountInfo.lib_id && accountInfo.store_id) {
        if (parseInt(accountInfo.store_id) == parseInt(this.params.data.store_id)) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
    }
  },
  methods: {
    updated () {
      const obj = {
        ic_status: this.params.data.ic_status,
        id: this.params.data.id
      }
      this.$store
        .dispatch('integralset/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改状态成功',
              color: 'green'
            })
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

<style scoped></style>
