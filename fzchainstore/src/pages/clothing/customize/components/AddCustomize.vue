<template>
  <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}自定义属性</div>
        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-none">
        <q-form ref="dataForm">
          <q-input outlined v-model="dataForm.cc_sort" dense label="排序" lazy-rules :rules="[(val) => !!val || '请填写属性排序']" />
          <q-input outlined v-model="dataForm.cc_name" dense label="属性名称" lazy-rules :rules="[(val) => !!val || '请填写属性名称']" />
          <q-input outlined v-model="dataForm.cc_code" dense label="属性编码" lazy-rules :rules="[(val) => !!val || '请填写属性编码']" />
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="dataForm.cc_if_choose"
            :options="options"
            dense
            label="是否多选"
            bottom-slots
          />
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="dataForm.cc_if_required"
            :options="options"
            dense
            label="是否必填"
            bottom-slots
          />

          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="dataForm.cc_if_manual_input"
            :options="options"
            dense
            label="是否手动输入"
            bottom-slots
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn label="确定" unelevated @click="clothingCustomizeSumbit()" color="primary" :disable="submitDisabled" class="text-right q-px-xl" />
        <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="text-right q-px-xl" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddCustomize',
  data () {
    return {
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
      dataId: 0,
      popupActive: false,
      dataForm: {
        cc_sort: '1',
        cc_code: '',
        cc_name: '',
        cc_if_choose: '0',
        cc_if_required: '0',
        cc_if_manual_input: '0'
      },

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
        this.$store
          .dispatch('clothingCustomize/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.dataForm = res.data
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
            ...this.dataForm,
            id: this.dataId
          }
          this.$store.dispatch('clothingCustomize/addData', obj).then((res) => {
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
    }
  }
}
</script>
