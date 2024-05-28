<template>
  <div>
    <q-toggle v-model="params.data.pca_status" :true-value="'1'" :false-value="'0'" @input="statusBut" color="green" v-if="authorityMeta('setStatus')" />
  </div>
</template>

<script>
export default {
  name: 'AgSwitch',
  components: {},
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {},

  computed: {},
  methods: {
    statusBut () {
      const obj = {
        id: this.params.data.id,
        pca_status: this.params.data.pca_status
      }
      this.$store
        .dispatch('csjz/setData', obj)
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
          } else {
            this.$q.notify({
              message: '失败',
              caption: '修改失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
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
