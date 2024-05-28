<template>
  <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.4) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">授信额度设置</div>
        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="dataForm">
          <div class="row">
            <div class="col-md-8 col-12 q-pa-sm">
              <span>经营模式</span>
              <span>
                <q-btn-toggle
                v-model="creditData.csc_type"
                spread
                no-caps
                class="my-custom-toggle"
                rounded
                unelevated
                toggle-color="primary"
                color="white"
                text-color="black"
                :options="[
                  { label: '联营', value: '1' },
                  { label: '直营', value: '2' },
                  { label: '合伙', value: '3' },
                  { label: '加盟', value: '4' },
                ]"
              />
              </span>

            </div>
            <div class="col-md-8 col-12">
              <q-select
                class="q-pa-sm"
                outlined
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="creditData.csc_credit_switch"
                :options="[
                  {
                    label: '开启',
                    value: '1',
                  },
                  {
                    label: '关闭',
                    value: '0',
                  },
                ]"
                dense
                label="授信状态"
              />
            </div>
            <div class="col-md-8 col-12">
              <q-input
                class="q-mt-md q-mx-sm"
                v-model="creditData.csc_credit_amount"
                outlined
                bottom-slots
                dense
                label="授信额度"
                placeholder="请输入授信额度"
                lazy-rules
                :rules="[(val) => /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/.test(val) || '请输入正确的金额']"
              />
            </div>
            <div class="col-md-8 col-12">
              <q-input
                class="q-mt-md q-mx-sm"
                v-model="creditData.csc_supply_discount"
                outlined
                bottom-slots
                dense
                label="采购折扣"
                placeholder="请输入采购折扣（0-1）"
                lazy-rules
                :rules="[(val) => /^(0.\d+|0|1)$/.test(val) || '请设置采购折扣']"
              />
            </div>
            <div class="col-md-8 col-12">
              <q-select
                class="q-pa-sm"
                outlined
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="creditData.csc_if_manually_modify"
                :options="[
                  {
                    label: '是',
                    value: '1',
                  },
                  {
                    label: '否',
                    value: '0',
                  },
                ]"
                dense
                label="是否手动修改折扣"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md">
        <q-btn
          label="确定"
          unelevated
          @click="storeCreditSumbit()"
          color="primary"
          v-if="authorityMeta('save')"
          :disable="submitDisabled"
          class="text-right"
        />
        <q-btn label="取消" color="grey" unelevated v-if="authorityMeta('back')" @click="hideNowPage()" class="text-right" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'StoreCredit',
  data () {
    return {
      dataId: 0,
      popupActive: false,
      creditData: {
        csc_credit_switch: '1',
        csc_credit_amount: '',
        csc_supply_discount: '',
        csc_if_manually_modify: '',
        csc_name: '',
        csc_type: '1'
      },
      submitDisabled: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (data) {
      this.popupActive = true
      if (data.id > 0) {
        this.dataId = data.id
        const obj = {
          id: this.dataId
        }
        this.$store
          .dispatch('storeCredit/getList', obj)
          .then((res) => {
            if (res.code == 200) {
              this.creditData = res.data
                ? res.data
                : {
                    csc_credit_switch: '1',
                    csc_credit_amount: '',
                    csc_supply_discount: '',
                    csc_if_manually_modify: '',
                    csc_name: '',
                    csc_type: '1'
                  }
              this.creditData.csc_name = data.name
              this.creditData.StoreId = data.id
            }
          })
          .catch((err) => {})
      }
    },
    storeCreditSumbit () {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          if (!(this.dataId > 0)) {
            this.dataId = 0
          }
          this.creditData.StoreId = this.dataId

          const obj = {
            ...this.creditData
          }
          this.$store.dispatch('storeCredit/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '授信额度设置成功',
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
      return true
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
