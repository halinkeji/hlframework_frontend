<template>
  <!-- 修改弹窗 -->
  <q-dialog v-model="dialogStatus" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.2 + 'px',
        'max-width': $q.screen.width * 0.2 + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="row justify-between">

        <q-toolbar class="text-center">
          <q-toolbar-title class="text-subtitle1"> {{ canName }}回罐 </q-toolbar-title>
        </q-toolbar>
      </div>

      <q-form ref="oilRiseRef" class="q-gutter-md">
        <div class="row">
          <div class="col-12">
            <q-input
              outlined
              bottom-slots
              v-model="oid_operatel"
              class="q-py-none"
              label="请输入回罐升数"
              :rules="[(val) => /^((0{1}\.\d{1,3})|([1-9]\d*\.{1}\d{1,3})|([1-9]+\d*))$/.test(val) || '保留位数不可超过两位']"
            />
          </div>
        </div>
      </q-form>

      <div class="row q-mt-md q-gutter-sm justify-center">
        <q-btn class="q-px-xl" label="回罐" @click="saveData()" color="primary" unelevated />
        <q-btn class="q-px-xl" label="关闭" color="grey" unelevated @click="hideNowPage()" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddCome',
  data () {
    return {
      oilCanId: 0,
      canName: '',
      oilId: 0,
      oilName: '',
      oid_operatel: '',
      dialogStatus: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (oilCanId, canName, oilId, oilName) {
      this.oilCanId = oilCanId
      this.canName = canName
      this.oilId = oilId
      this.oilName = oilName
      this.dialogStatus = true
    },
    saveData () {
      this.$refs.oilRiseRef.validate().then((success) => {
        if (success) {
          const obj = {
            oilCanId: this.oilCanId,
            canName: this.canName,
            oilId: this.oilId,
            oilName: this.oilName,
            operatelLiter: this.formatAmountThree(this.oid_operatel)
          }
          this.$store
            .dispatch('can/backCanData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '回库成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.oid_operatel = ''
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },
    formatAmountThree (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 1000) / 1000
      }
    },
    hideNowPage () {
      this.$emit('getMethods')
      this.dialogStatus = false
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
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
