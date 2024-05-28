<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-px-sm q-py-xs">
        <div class="text-subtitle2">{{ materialFormData.id > 0 ? '修改' : '新增' }}原料信息</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form ref="addTypeRef" class="row full-width">

          <div class="col-12">
            <q-input outlined dense v-model="materialFormData.cm_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入原料名称']" />
          </div>
          <div class="col-12">
            <q-input outlined dense v-model="materialFormData.cm_unit" label="单位" lazy-rules :rules="[(val) => !!val || '请输入原料单位']" />
          </div>
          <div class="col-12">
            <q-input outlined dense v-model="materialFormData.cm_exp_day" label="默认保质期天数" lazy-rules :rules="[(val) => !!val || '请输入默认保质期天数']" />
          </div>
          <div class="col-12">
            <q-input outlined dense v-model="materialFormData.cm_in_depot_price" label="入库价" lazy-rules :rules="[(val) => !!val || '请输入入库价']" />
          </div>
          <div class="col-12">
            <q-input outlined dense type="textarea" :rows="3" v-model="materialFormData.cm_description" label="描述" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-gutter-sm q-pa-sm">
        <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddMaterial',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      materialFormData: {
        cm_name: '',
        cm_unit: '',
        cm_exp_day: '0',
        cm_in_depot_price: '',
        cm_description: ''
      }

    }
  },
  created () {

  },
  mounted () {},
  computed: {

  },
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('materialManage/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.materialFormData = res.data ? res.data : {}
            } else {
              this.$q.notify({
                message: '失败',
                caption: '操作失败',
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
    },

    setData () {
      this.$refs.addTypeRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.materialFormData
          }
          this.$store
            .dispatch('materialManage/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.materialFormData.id > 0 ? '修改' : '新增'}` + '原料信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
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
              this.showDialog = false
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
