<template>
    <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}倍率信息</div>

          <q-space />
          <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-py-none">
          <q-form ref="dataForm">
            <q-input
              outlined
              v-model="dataForm.cm_name"
              dense
              label="倍率名称"
              lazy-rules
              :rules="[(val) => !!val || '请填写倍率名称']"
            />

            <q-select
            outlined
            dense
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="dataForm.cm_markup_type"
            :options="typeOptions"
            label="计算方式"
            :rules="[(val) => !!val || '请选择计算方式']"
          />

            <q-input
              outlined
              v-model="dataForm.cm_markup_rate"
              dense
              label="倍率"
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的倍率']"
            >
              <template slot="append" v-if="dataForm.cm_markup_type == '1'">%</template>
              <template slot="append" v-if="dataForm.cm_markup_type == '2'">元</template>
            </q-input>
            <q-select
              outlined
              dense
              option-value="id"
              option-label="gt_name"
              emit-value
              map-options
              v-model="dataForm.cm_type_id"
              :options="typeData"
              label="绑定商品类目"
              :disable="dataId > 0"
              :rules="[(val) => !!val || '请选择绑定商品类目']"
            />

          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn label="确定" unelevated @click="clothingMarkupSumbit()" color="primary" :disable="submitDisabled" class="text-right q-px-xl" />
          <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="text-right q-px-xl" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  name: 'AddMarkup',
  data () {
    return {
      typeOptions: this.$store.state.goodsMarkup.typeOptions,
      typeData: [],
      dataId: 0,
      popupActive: false,
      dataForm: {
        cm_name: '',
        cm_type_id: '',
        cm_markup_rate: '',
        cm_markup_type: '1'
      },
      submitDisabled: false
    }
  },
  created () {
    this.getType()
  },
  mounted () {},
  computed: {},
  methods: {
    getType () {
      this.$store.dispatch('goodsMarkup/getTypeAll').then((res) => {
        if (res.code == 200) {
          if (res.data.code == 400) {
            this.typeData = []
          } else {
            this.typeData = res.data ? res.data : []
          }
        }
      })
    },
    init (id) {
      this.popupActive = true
      if (id > 0) {
        this.dataId = id
        this.$store
          .dispatch('goodsMarkup/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.dataForm = res.data
              if (this.dataForm.type) {
                this.typeData.push(this.dataForm.type)
              }
            }
          })
          .catch((err) => {})
      }
    },
    clothingMarkupSumbit () {
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
          this.$store.dispatch('goodsMarkup/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '倍率信息成功',
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
