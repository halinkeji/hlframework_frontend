<template>
  <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}详细属性</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="dataForm">
          <q-card flat bordered>
            <q-card-section class="row q-pa-sm items-center justify-between">
              属性
              <q-space />
              <q-btn color="primary" label="添加属性" @click="addCustomizeDetail" unelevated icon="las la-plus-square" />
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-item dense class="full-width " v-for="(normItem, normIndex) in customizeDetail" :key="normIndex">
                <q-item-section>
                  <q-input
                    v-model="normItem.ccd_sort"
                    outlined
                    bottom-slots
                    dense
                    label="属性排序"
                    placeholder="请输入属性排序"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '请设置属性排序']"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    v-model="normItem.ccd_code"
                    outlined
                    bottom-slots
                    dense
                    label="属性编码"
                    placeholder="请输入属性编码"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '请设置属性编码']"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    v-model="normItem.ccd_name"
                    outlined
                    bottom-slots
                    dense
                    label="属性名称"
                    placeholder="请输入属性名称"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '请设置属性名称']"
                  />
                </q-item-section>
                <q-item-section side top>
                  <q-btn @click="deleteCustomizeDetail(normIndex)" color="red" flat round icon="delete "> </q-btn>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>

          <div>
            <div class="row q-mt-md q-ml-xs">
              <q-btn-group unelevated> </q-btn-group>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md">
        <q-btn label="确定" unelevated @click="clothingCustomizeSumbit()" color="primary" :disable="submitDisabled" class="text-right" />
        <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="text-right" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddCustomizeDetail',
  data () {
    return {
      dataId: 0,
      popupActive: false,
      dataForm: {
        cc_sort: '1',
        cc_code: '',
        cc_name: '',
        cc_if_choose: '',
        cc_if_manual_input: '',
        cc_if_required: ''
      },
      customizeDetail: [],
      submitDisabled: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.popupActive = true
      if (id > 0) {
        this.dataId = id
        const obj = {
          id: this.dataId
        }
        this.$store
          .dispatch('clothingCustomize/getDetailData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.customizeDetail = res.data ? res.data : []
            }
          })
          .catch((err) => {})
      }
    },
    clothingCustomizeSumbit () {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          if (!(this.dataId > 0)) {
            this.dataId = 0
          }
          const obj = {
            customizeDetail: this.customizeDetail,
            id: this.dataId
          }
          this.$store.dispatch('clothingCustomize/setData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '自定义属性成功',
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
        }
      })
    },
    hideNowPage () {
      this.popupActive = false
      this.submitDisabled = false
      this.$emit('getMethods')
    },
    // 添加
    addCustomizeDetail () {
      console.log('this.customizeDetail', this.customizeDetail)
      const layoutArray = this.customizeDetail
      const newlayout = {
        ccd_sort: '',
        ccd_code: '',
        ccd_name: ''
      }
      layoutArray.push(newlayout)
    },
    // 删除
    deleteCustomizeDetail (mainKey) {
      setTimeout(() => {
        this.customizeDetail.splice(mainKey, 1)
      }, 100)
    }
  }
}
</script>
