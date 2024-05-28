<template>
  <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal" persistent>
    <q-card>
      <q-card-section class="row q-pa-sm items-center">
        <div class="text-subtitle2">{{ dataId ? '修改' : '新增' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>
      <q-form ref="fixedDataRef" class="q-gutter-md q-pa-sm">
        <q-input
          outlined
          dense
          v-model="fixedAmountFrom.fm_order"
          label="排序:数字越小，排序越靠前"
          lazy-rules
          maxlength="11"
          :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
        />
        <q-input
          outlined
          dense
          v-model="fixedAmountFrom.fm_parameter"
          label="固定数值"
          lazy-rules
          maxlength="11"
          :rules="[(val) => !!val || '请输入参数', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的金额']"
        />
      </q-form>

      <q-card-actions align="around">
        <q-btn class="q-px-xl" label="提交" unelevated color="primary" @click="saveData()" />
        <q-btn class="q-px-xl" label="关闭" unelevated @click="hideNowPage()" color="grey" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddMoneyPoppup',
  props: [],
  data () {
    return {
      dataId: '',
      FastExpensedataId: 0,
      isSidebarActiveLocal: false,
      fixedData: [],
      fixedAmountFrom: {
        fm_type: 7,
        fm_order: 0,
        fm_parameter: ''
      },

      disabledStatus: false
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (id) {
      this.dataId = id
      this.isSidebarActiveLocal = true
      if (id > 0) {
        const obj = {
          id: this.dataId
        }
        this.$store.dispatch('fixed/getItemData', obj).then((res) => {
          if (res.code == 200) {
            this.fixedAmountFrom = res.data
          }
        })
      }
    },
    saveData () {
      this.$refs.fixedDataRef.validate().then((success) => {
        if (success) {
          this.disabledStatus = true
          const obj = {
            ...this.fixedAmountFrom,
            id: this.dataId
          }

          this.$store
            .dispatch('fixed/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '固定金额成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                  this.isSidebarActiveLocal = false
                  this.disabledStatus = false
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '新增固定金额错误！',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {})
        }
      })
    },
    hideNowPage () {
      this.$emit('dataList')
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
