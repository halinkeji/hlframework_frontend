<template>
  <div>
    <q-select
      outlined
      v-model="params.data.cs_status"
      option-label="label"
      option-value="value"
      map-options
      emit-value
      dense
      :options="statusOptions"
      @input="updated"
    />
  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {
      statusOptions: [
        {
          label: '未使用',
          value: '0'
        },
        {
          label: '使用中',
          value: '1'
        },
        {
          label: '维护中',
          value: '2'
        }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    updated () {
      const obj = {
        cs_status: this.params.data.cs_status,
        id: this.params.data.id
      }
      this.$store
        .dispatch('cdyy/setSiteData', obj)
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
