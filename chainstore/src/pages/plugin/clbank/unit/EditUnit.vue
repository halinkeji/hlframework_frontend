<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}材料信息</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-form ref="newsDataRef" class="q-gutter-md">
            <div class="row">
              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="unitDataForm.cu_name"
                  label="材料名称"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '材料名称不能为空']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="unitDataForm.cu_unit"
                  label="材料单位"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '材料单位不能为空']"
                />
              </div>
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ClbankEditUnit',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      unitDataForm: {
        cu_name: '',
        cu_unit: ''
      },
      stop: false,
      multiple: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dataId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.$store.dispatch('clbank/getUnitItemData', {
          id
        }).then((res) => {
          if (res.code == 200) {
            this.unitDataForm = res.data ? res.data : {}
          }
        })
      }
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.stop = true

          const obj = {
            ...this.unitDataForm,
            id: this.dataId
          }
          this.$store
            .dispatch('clbank/setUnitData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.addStoreSidebar = false
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '材料成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
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
              this.stop = false
            })
        }
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
