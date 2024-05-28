<template>
  <q-dialog v-model="isPopupShow" persistent @hide="hideNowPage">
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
    >
      <q-form ref="labelDataRef" class="q-gutter-md">
        <div class="row items-center q-pa-sm">
          <div class="text-subtitle1">{{ dataForm.id > 0 ? '修改' : '新增' }}标签</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="q-pa-sm">
          <q-input label="名称" outlined v-model="dataForm.mti_name" dense lazy-rules :rules="[(val) => !!val || '标签名称是必填的']" />
          <q-input label="描述" outlined v-model="dataForm.mti_content" dense :rows="2" type="textarea" />
        </div>
      </q-form>
      <div class="text-center q-gutter-sm q-mb-md">
        <q-btn unelevated label="确认" color="primary" @click="addData" class="q-px-xl" :disable="submitDisabled" />
        <q-btn unelevated label="关闭" color="grey" class="q-px-xl" @click="hideNowPage" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddMembertagInfo',
  components: {},
  data () {
    return {
      isPopupShow: false,
      dataForm: {
        id: 0,
        mti_name: '',
        mti_content: '',
        mti_status: 1
      },
      popupType: false,
      submitDisabled: false
    }
  },
  created () {
    this.context = this
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.2) + 'px'
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.dataForm.id = id
        this.$store.dispatch('membertag/getItemData', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.dataForm = res.data
          }
        })
      }
      this.isPopupShow = true
    },
    addData () {
      this.$refs.labelDataRef.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          const obj = {
            ...this.dataForm
          }
          this.$store.dispatch('membertag/setData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataForm.id > 0 ? '修改' : '新增'}` + '会员标签成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.hideNowPage()
            }
          })
        }
      })
    },
    hideNowPage () {
      this.dataForm = {
        id: 0,
        mti_name: '',
        mti_content: '',
        mti_status: 1
      }
      this.isPopupShow = false
      this.submitDisabled = false
      this.$emit('getMethods')
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style></style>
