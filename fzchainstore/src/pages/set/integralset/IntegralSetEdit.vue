<template>
  <q-dialog v-model="dialogShow" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">修改{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit }}折扣设置-{{ integralData.ic_name }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
      </q-card-section>
      <q-card-section>
        <q-form ref="integralDataRef" class="q-gutter-md">
          <q-card flat square class="q-pa-xs">
            <div class="row">
              <div class="col-12 q-mt-sm">
                <q-select class="q-px-sm" outlined label="状态" bottom-slots v-model="integralData.ic_status" :options="statusOptions" dense emit-value map-options> </q-select>
              </div>

              <div class="col-12">
                <q-input outlined dense class="q-px-sm" v-model="integralData.ic_sort" label="排序" lazy-rules :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']" />
              </div>
              <div class="col-12">
                <q-input
                  outlined
                  dense
                  label="折扣百分比"
                  class="  q-px-sm"
                  v-model="integralData.ic_discount_ratio"
                  lazy-rules
                  :rules="[(val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式', (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式']"
                >
                  <template v-slot:append>
                    %
                  </template>
                  <template v-slot:hint>
                    范围：1~100
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  :label="`${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit}系数`"
                  class=" col-12 col-md-6 q-px-sm"
                  v-model="integralData.ic_integral_ratio"
                  :error="false"
                  lazy-rules
                  :rules="[
                    (val) => (val > -1 && val <= 100) || '请输入正确的' + $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit + '换算比例',
                    (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的' + $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit + '换算比例',
                  ]"
                >
                  <template v-slot:append>
                    %
                  </template>
                  <template v-slot:hint>
                     范围：大于等于1
                  </template>
                </q-input>
              </div>
            </div>
          </q-card>
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md q-gutter-sm">
        <q-btn label="确定" @click="addUpdateReward()" color="primary" class="q-px-xl" unelevated />
        <q-btn label="关闭" @click="clearFields()" class="q-px-xl" color="grey" unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'integralSetEdit',
  data () {
    return {
      dataId: 0,
      dialogShow: false,
      integralData: {},
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    openEditDialog (ruleData) {
      this.integralData = JSON.parse(JSON.stringify(ruleData))
      this.dialogShow = true
    },
    clearFields () {
      this.dialogShow = false
      this.$emit('closePage')
    },
    addUpdateReward () {
      this.$refs.integralDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.integralData
          }
          this.$store
            .dispatch('integralset/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.clearFields()
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改折扣设置成功',
                  color: 'green'
                })
                this.$emit('setSuccess')
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
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
