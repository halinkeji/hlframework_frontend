<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <q-card-section class="col-shrink q-pa-xs row q-px-sm items-center">
          <div class="text-subtitle2">{{ dataId ? '修改' : '新增' }}类型</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-separator />
        <q-card-section class="col-shrink q-pa-sm">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="newsDataRef" class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="marketingTypeForm.pmt_title"
                  label="名称"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '名称不能为空']"
                />
              </div>
              <div class="col-6">
                <q-select
                  outlined
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  bottom-slots
                  :options="[
                    { label: '开启', value: '1' },
                    { label: '关闭', value: '0' },
                  ]"
                  v-model="marketingTypeForm.pmt_status"
                  dense
                  label="状态"
                />
              </div>
              <div class="col-6">
                <q-select
                  outlined
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  bottom-slots
                  :options="$store.state.marketingManage.marketUserTypeData"
                  v-model="marketingTypeForm.pmt_type"
                  dense
                  label="类型"
                  :disable="marketingTypeForm.id ? true : false"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="marketingTypeForm.pmt_profit_amount"
                  label="固定收益"
                  maxlength="255"
                  lazy-rules
                   :rules="[
                      (val) => val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) : true || '请输入正确的数值',
                    ]"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="marketingTypeForm.pmt_profit_ratio"
                  label="收益比例"
                  maxlength="255"
                  lazy-rules
                   :rules="[
                      (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0 && val <= 100 : true) || '请输入正确的数值',
                    ]"
                />
              </div>
              <div class="col-6 row" v-if="parseInt(marketingTypeForm.pmt_type) == 3">
                <div class="col-8">
                  <q-input
                    outlined
                    dense
                    borderless
                    v-model="marketingTypeForm.pmt_store_delay_num"
                    :rules="[(val) => (val ? /^\+?[0-9][0-9]*$/.test(val) : true || '请输入正整数')]"
                    label="【赠送】商家授权使用时间"
                    lazy-rules
                  >
                  </q-input>
                </div>
                <div class="col">
                  <q-select
                    outlined
                    dense
                    emit-value
                    borderless
                    map-options
                    option-label="title"
                    option-value="value"
                     :options-dense="true"
                    bottom-slots
                    v-model="marketingTypeForm.pmt_store_delay_cycle"
                    :options="$store.state.marketingManage.marketUserCycleData"
                  >
                  </q-select>
                </div>
              </div>

              <div class="col-6" v-if="parseInt(marketingTypeForm.pmt_type) == 3">
                <q-input
                  outlined
                  dense
                  v-model="marketingTypeForm.pmt_store_account_num"
                  label="【赠送】商家操作员数量"
                  maxlength="255"
                  lazy-rules
                   :rules="[(val) => (val ? /^\+?[0-9][0-9]*$/.test(val) : true || '请输入正整数')]"
                />
              </div>

              <div class="col-6" v-if="parseInt(marketingTypeForm.pmt_type) == 3">
                <q-input
                  outlined
                  dense
                  v-model="marketingTypeForm.pmt_store_son_num"
                  label="【赠送】商家可创建子店数量"
                  maxlength="255"
                  lazy-rules
                   :rules="[(val) => (val ? /^\+?[0-9][0-9]*$/.test(val) : true || '请输入正整数')]"
                />
              </div>

              <div class="col-12 q-px-sm">
                <hl-editor
                  @change="
                    (v) => {
                      marketingTypeForm.pmt_caption = v;
                    }
                  "
                  :content="marketingTypeForm.pmt_caption"
                  :minHeight="$q.screen.height * 0.45"
                  class="fit"
                  titleText="内容"
                ></hl-editor>
              </div>
            </q-form>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="col-shrink row q-gutter-sm text-center justify-center q-pb-md">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'EditType',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      marketingTypeForm: {
        pmt_title: '',
        pmt_type: '1',
        pmt_profit_amount: '',
        pmt_profit_ratio: '',
        pmt_store_delay_cycle: '',
        pmt_store_delay_num: '0',
        pmt_store_account_num: '0',
        pmt_store_son_num: '0',
        pmt_status: '1'
      },

      multiple: false,
      uploadImgStatus: false
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
        this.getItem()
      }
    },

    getItem () {
      this.$store
        .dispatch('marketingManage/getTypeData', {
          id: this.dataId
        })
        .then((res) => {
          if (res.code == 200) {
            this.marketingTypeForm = res.data
          }
        })
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.marketingTypeForm,
            id: this.dataId
          }
          this.$store
            .dispatch('marketingManage/setTypeData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '成功',
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
                message: 'Error',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.addStoreSidebar = false
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
