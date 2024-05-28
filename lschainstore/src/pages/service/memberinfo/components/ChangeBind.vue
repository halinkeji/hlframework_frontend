<template>
  <div>
    <q-dialog v-model="changeBind">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.4) + 'px',
          'max-width': parseInt($q.screen.width * 0.4) + 'px',
        }"
      >
        <q-toolbar>
          <q-toolbar-title>门店改绑</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="closeButton" />
        </q-toolbar>
        <q-card-section>
          <div class="row">
            <div class="col">
              <q-select filled label="绑定门店" v-model="memberInformation.store_id" :options="libInStoreList" option-value="id" option-label="name" emit-value map-options />
            </div>
          </div>
          <div class="row q-mt-md">
            <q-space />
            <q-btn outline unelevated color="grey" label="关闭" v-close-popup @click="closeButton" />
            <q-btn unelevated color="primary" label="保存" class="q-ml-sm" @click="saveBut" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'ChangeBind ',
  data () {
    return {
      memberInformation: {
        store_id: ''
      },
      changeBind: false,
      libInStoreList: []
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    init (val) {
      if (val > 0) {
        this.changeBind = true
        this.$nextTick(() => {
          this.getLibInStoreData()
          this.memberInformation.id = val
        })
      }
    },
    // 关闭
    closeButton () {
      this.changeBind = false
      this.memberInformation.id = ''
      this.memberInformation.store_id = ''
    },
    // 保存
    saveBut () {
      const obj = {
        ...this.memberInformation
      }
      this.$store
        .dispatch('member/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '改绑成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.closeButton()
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
    }
  }
}
</script>
