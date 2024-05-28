<template>
  <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}商品标签</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="dataForm">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="dataForm.gt_status"
            :options="options"
            dense
            label="状态"
            :rules="[(val) => (val && val.length > 0) || '请选择状态']"
          />
          <q-input outlined v-model="dataForm.gt_name" dense label="名称" lazy-rules :rules="[(val) => !!val || '请填写标签名称']" />

          <q-input outlined bottom-slots v-model="dataForm.gt_content" :rows="3" dense type="textarea" label="描述"> </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn label="确定" unelevated @click="clothingTagSumbit()" color="primary" :disable="submitDisabled" class="text-right q-px-xl" />
        <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="text-right q-px-xl" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddTag',
  data () {
    return {
      options: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '0'
        }
      ],
      dataId: 0,
      popupActive: false,
      dataForm: {
        gt_name: '',
        gt_status: '1',
        gt_content: ''
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
          .dispatch('clothingTag/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.dataForm = res.data
            }
          })
          .catch((err) => {})
      }
    },
    clothingTagSumbit () {
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
          this.$store.dispatch('clothingTag/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '商品标签成功',
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
