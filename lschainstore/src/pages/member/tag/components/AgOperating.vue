<template>
  <div>
    <!-- <q-btn color="warning"  unelevated class="q-ml-sm" @click="params.context.seeMemberList(params.data.id)">查看</q-btn> -->
    <q-btn color="primary" v-if="authorityMeta('edit') && editStatus" class="q-ml-sm" unelevated @click="params.context.addMembertag(params.data.id)">修改</q-btn>
    <q-btn @click="deleteBut" v-if="authorityMeta('del') && editStatus" unelevated color="red" class="q-ml-sm">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  components: {},
  data () {
    return {
      editStatus: false
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
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    deleteBut () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `删除名称为 "${this.params.data.pmi_name}"的会员标签吗？`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.params.data.id]
          this.$store.dispatch('membertag/delData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除会员标签！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              setTimeout(() => {
                this.params.context.getMembertagList()
              }, 500)
            }
          })
        })
        .onCancel(() => {})
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
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
