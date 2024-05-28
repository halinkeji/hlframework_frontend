<template>
  <div :style="{ width: params.colDef.width }">
    <q-input v-model="params.data.zrg_serve_title" @change="updatedDataAmount" label="服务费说明" />
  </div>
</template>
<script>
export default {
  name: 'AgInputTitle',
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
    updatedDataAmount () {
      const obj = {
        zrg_serve_title: this.params.data.zrg_serve_title,
        zrg_goods_id: this.params.data.id
      }
      this.updatedData(obj)
    },
    updatedData (obj) {
      this.$store
        .dispatch('zzfwf/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改信息成功',
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
      // return true
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
