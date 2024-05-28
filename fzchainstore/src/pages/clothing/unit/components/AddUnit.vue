<template>
  <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}计量单位</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="dataForm">
          <q-input
            outlined
            v-model="dataForm.gu_sort"
            dense
            label="排序"
            :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
          />
          <q-input
            outlined
            v-model="dataForm.gu_name"
            dense
            label="单位名称"
            lazy-rules
            :rules="[(val) => !!val || '请填写单位名称']"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn label="确定" unelevated @click="clothingUnitSumbit()" color="primary" :disable="submitDisabled" class="text-right q-px-xl" />
        <q-btn label="关闭" color="grey" unelevated @click="hideNowPage()" class="text-right q-px-xl" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddUnit',
  data () {
    return {
      dataId: 0,
      popupActive: false,
      dataForm: {
        gu_sort: '0',
        gu_name: ''
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
          .dispatch('clothingUnit/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.dataForm = res.data
            }
          })
          .catch((err) => {})
      }
    },
    clothingUnitSumbit () {
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
          this.$store.dispatch('clothingUnit/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '计量单位成功',
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
