<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">{{ typeData.id > 0 ? '修改' : '新增' }}菜品分类</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="addTypeRef" class="row full-width">
          <div class="col-12">
            <q-input
              outlined
              dense
              bottom-slots
              v-model="typeData.gt_sort"
              label="分类排序"
              :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
            />
          </div>
          <div class="col-12">
            <q-input outlined dense v-model="typeData.gt_name" label="菜品分类名称" lazy-rules :rules="[(val) => !!val || '请输入菜品分类名称']" />
          </div>
          <div class="col-12">
            <q-input outlined dense type="textarea" :rows="3" v-model="typeData.gt_description" label="描述" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-gutter-sm">
        <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddDishesType',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      typeData: {
        gt_name: '',
        gt_sort: '0',
        gt_description: ''
      }
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('dishes/getTypeItem', { id })
          .then((res) => {
            if (res.code == 200) {
              this.typeData = res.data ? res.data : {}
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
            ...this.typeData
          }
          this.$store
            .dispatch('dishes/setTypeData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.typeData.id > 0 ? '修改' : '新增'}` + '菜品分类成功',
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
      this.typeData.id = ''
      this.addButtonDisabled = false
      this.$emit('dataList')
    }
  }
}
</script>
