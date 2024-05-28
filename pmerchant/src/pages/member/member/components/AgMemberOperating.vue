<template>
  <div class="row q-gutter-sm">
    <q-btn-dropdown color="primary" label="操作">
      <q-list  style="width: 120px">
        <q-item clickable v-close-popup  class="q-pa-none q-px-sm" @click="openCardList">
          <q-item-section class="q-pa-none">
            <q-btn color="primary" icon="payment" unelevated >卡包</q-btn>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup  class="q-pa-none q-px-sm" @click="openInvoiceList">
          <q-item-section class="q-pa-none" >
            <q-btn unelevated icon="library_books"  color="orange">单据</q-btn>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup  class="q-pa-none q-px-sm" @click="openCouponList">
          <q-item-section class="q-pa-none">
            <q-btn unelevated icon="panorama_horizontal"  color="green">卡券</q-btn>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup  class="q-pa-none q-px-sm" @click="deleteBut">
          <q-item-section class="q-pa-none">
            <q-btn unelevated icon="delete_outline"  color="red">删除</q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
<script>
export default {
  name: 'AgMemberOperating',
  components: {},
  data () {
    return {
      memberId: ''
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    openCardList () {
      this.$nextTick(() => {
        this.params.context.openCardList(this.params.data.m_pmerchant_id)
      })
    },
    openInvoiceList () {
      this.$nextTick(() => {
        this.params.context.openInvoiceList(this.params.data.m_pmerchant_id, this.params.data.id)
      })
    },
    openCouponList () {
      this.$nextTick(() => {
        this.params.context.openCouponList(this.params.data.m_pmerchant_id, this.params.data.id)
      })
    },
    deleteBut () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将会员删除至回收站吗',
          cancel: true
        })
        .onOk(() => {
          if (parseInt(this.params.data.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '删除会员失败！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          const obj = [{ id: this.params.data.id, m_pmerchant_status: 2 }]
          this.$store
            .dispatch('member/allupdate', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '会员删除至回收站成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getMemberListData()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '会员删除至回收站失败，请联系管理员！',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
        .onCancel(() => {})
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
