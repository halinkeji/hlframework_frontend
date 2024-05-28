<template>
  <div>
    <q-toggle v-model="params.data.rp_status" :true-value="'1'" :false-value="'0'" v-if="authorityMeta('edit') && editStatus" @input="statusBut()" color="green" />
  </div>
</template>

<script>
export default {
  name: 'AgSwitch',
  data () {
    return {
      editStatus: false
    }
  },

  mounted () {},
  created () {
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('myouka_account_info')
      if (accountInfo && accountInfo.lib_id && accountInfo.store_id) {
        if (parseInt(accountInfo.store_id) == parseInt(this.params.data.store_id)) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    // 修改状态
    statusBut () {
      const obj = {
        id: this.params.data.id,
        rp_status: this.params.data.rp_status
      }
      this.$store
        .dispatch('rechargepackages/setData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getList()
            }, 100)
          }
        })
        .catch((error) => {})
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
