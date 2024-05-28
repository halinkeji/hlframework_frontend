<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">
          绑定下单人
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="principalRef">
          <q-select
            outlined
            dense
            v-model="carData.doc_principal_id"
            option-value="id"
            option-label="pru_name"
            :options="userOptions"
            label="请选择下单人"
            emit-value
            map-options
            :rules="[(val) => (val && !!val) || '请选择下单人']"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-gutter-sm">
        <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="positive" @click="placeAnOrder" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'Principal',
  components: {},
  data () {
    return {
      showDialog: false,
      addButtonDisabled: false,
      carData: {
        doc_desk_id: '',
        doc_principal_id: ''
      },
      userOptions: []
    }
  },
  created () {
    this.getUserList()
  },
  mounted () {},
  computed: {},
  methods: {
    getUserList () {
      this.$store
        .dispatch('consumeorder/getUserList')
        .then((res) => {
          if (res.code == 200) {
            this.userOptions = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getDesk (id) {
      this.showDialog = true
      this.carData.doc_desk_id = id
    },
    // 下单
    placeAnOrder () {
      this.$refs.principalRef.validate().then((success) => {
        if (success) {
          const params = {
            ...this.carData
          }
          this.$store
            .dispatch('consumeorder/placeAnOrder', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '下单成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({
                  name: 'consumeOrder'
                })
              } else if (res.code == 100) {
                this.showDialog = false
                this.$q.notify({
                  message: '下单异常',
                  caption: res.message,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'warning'
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
