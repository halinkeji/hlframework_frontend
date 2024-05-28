<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ dataId > 0 ? '修改' : '新增' }}标签</div>

          <q-space />
          <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="dataForm">
            <q-input outlined v-model="dataForm.gt_sort" dense label="排序" class="q-pa-sm q-my-sm" :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']" />
            <q-input outlined v-model="dataForm.gt_name" dense label="名称" class="q-pa-sm q-my-sm" :rules="[(val) => !!val || '请输入名称']" />
            <q-input outlined v-model="dataForm.gt_hot_key" dense label="快捷键" class="q-pa-sm q-my-sm" :rules="[(val) => !!val || '请输入快捷键']" />
            <q-select
              class="q-pa-sm"
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="dataForm.gt_status"
              :options="[
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' },
              ]"
              dense
              label="状态"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn label="确定" unelevated @click="goodsTagSumbit()" color="primary" :disable="submitDisabled" class="q-px-xl" />
          <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="q-px-xl" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddTag',
  data () {
    return {
      dataId: 0,
      popupActive: false,
      dataForm: {
        gt_sort: '0',
        gt_name: '',
        gt_status: '1',
        gt_hot_key: ''
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
      this.dataId = id
      if (id > 0) {
        this.$store
          .dispatch('goodsTag/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.dataForm = res.data ? res.data : {}
            }
          })
          .catch((err) => {})
      }
    },
    goodsTagSumbit () {
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
          this.$store.dispatch('goodsTag/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '标签单位成功',
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
