<template>
  <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}商品标准</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="dataForm">
          <q-input outlined v-model="dataForm.cs_sort" dense label="排序" lazy-rules :rules="[(val) => !!val || '请填写标准排序']" />
          <q-input outlined v-model="dataForm.cs_name" dense label="标准名称" lazy-rules :rules="[(val) => !!val || '请填写标准名称']" />
          <q-input outlined v-model="dataForm.cs_code" dense label="标准编码" lazy-rules :rules="[(val) => !!val || '请填写标准编码']" />
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn label="确定" unelevated @click="clothingStandardSumbit()" color="primary" :disable="submitDisabled" class="q-px-xl" />
        <q-btn label="取消" class="q-px-xl" color="grey" unelevated @click="hideNowPage()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddStandard',
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
        cs_sort: '1',
        cs_code: '',
        cs_name: ''
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
          .dispatch('clothingStandard/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.dataForm = res.data
            }
          })
          .catch((err) => {})
      }
    },
    clothingStandardSumbit () {
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
          this.$store.dispatch('clothingStandard/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '商品标准成功',
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
