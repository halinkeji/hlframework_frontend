<template>
  <div>
    <q-select
      v-model="params.data.ppa_property"
      :options="sortTypeData"
      option-label="label"
      option-value="value"
      map-options
      emit-value
      dense
      outlined
      hide-bottom-space
      @input="updatedStatus"
    />

  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {
      sortTypeData: [
        {
          label: '推荐',
          value: 'top'
        },
        {
          label: '热门',
          value: 'hot'
        },
        {
          label: '无',
          value: 'none'
        }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    updatedStatus () {
      const obj = {
        ppa_property: this.params.data.ppa_property,
        id: this.params.data.id
      }
      this.$store
        .dispatch('pattern/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.params.context.getList()
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改成功',
              color: 'green'
            })
          } else {
            this.$q.notify({
              message: '错误',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改失败，请联系管理员',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
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
