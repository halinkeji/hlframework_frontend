<template>
  <q-dialog v-model="dialogShow" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.5) + 'px',
        'max-width': parseInt($q.screen.width * 0.5) + 'px',
      }"
    >
      <div class="col-shrink bg-white row q-px-xs q-pa-sm">
        <div class="text-subtitle1">{{ currentAddressId ? '修改' : '新增' }}地址</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="colseDialog" />
      </div>
      <q-form ref="addressDataRef" class="q-gutter-xs">
        <div class="row">
          <q-input
            outlined
            dense
            class="col-12 col-md-6 q-mt-sm q-px-sm"
            v-model="addressData.ma_name"
            label="收件人"
            lazy-rules
            :rules="[(val) => (val && !!val) || '收件人不能为空']"
          />
          <q-input
            outlined
            dense
            class="col-12 col-md-6 q-mt-sm q-px-sm"
            v-model="addressData.ma_telephone"
            label="电话号"
            lazy-rules
            :rules="[(val) => (val && !!val) || '电话号码不能为空', (val) => /^1[3|4|5|7|8][0-9]{9}$/.test(val) || '请输入正确的手机号']"
          />
        </div>
        <div class="row">
          <q-input
            outlined
            dense
            class="col-12 col-md-6 q-px-sm"
            v-model="addressData.ma_postcode"
            label="邮编"
            lazy-rules
            :rules="[(val) => (val && !!val) || '邮编不能为空', (val) => /^[0-9]{6}$/.test(val) || '请输入正确的邮编']"
          />
          <q-select
            outlined
            dense
            class="col-12 q-px-sm col-md-6"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="addressData.ma_is_default"
            :options="stateOptions"
            label="状态"
            :error="false"
          />
        </div>
        <div class="row">
          <div class="col-6 q-px-sm q-pt-xs">
            <hl-address
              :province="addressData.province"
              :city="addressData.city"
              :area="addressData.district"
              @province="provinceupdate"
              @city="cityupdate"
              @area="areaupdate"
            ></hl-address>
          </div>
          <q-input
            outlined
            dense
            class="col-12 col-md-6 q-mt-sm q-px-sm"
            v-model="addressData.ma_address"
            label="详细地址"
            lazy-rules
            :rules="[(val) => (val && !!val) || '详细地址不能为空']"
          />
        </div>
      </q-form>
      <div class="row q-mt-md justify-center q-gutter-sm q-pa-sm">
        <q-btn label="提交" unelevated @click="saveData()" color="primary" class="q-px-xl" />
        <q-btn label="关闭" unelevated color="grey" @click="colseDialog" class="q-px-xl" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ModifyAddress',
  components: {},
  data () {
    return {
      dialogShow: false,
      stateOptions: [
        {
          label: '默认地址',
          value: 1
        },
        {
          label: '非默认地址',
          value: 2
        }
      ],
      addressData: {
        ma_name: '',
        ma_telephone: '',
        ma_postcode: '',
        ma_is_default: 2,
        province: '北京市',
        city: '北京市',
        district: '东城区',
        province_code: '',
        city_code: '',
        district_code: '',
        ma_address: ''
      },
      memberId: '',
      currentAddressId: ''
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (memberId, addressId) {
      this.memberId = memberId
      this.dialogShow = true
      if (addressId > 0) {
        this.currentAddressId = addressId
        this.$nextTick(() => {
          this.getItem()
        })
      }
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('memberAddress/getItem', this.currentAddressId).then((res) => {
        if (res.code == 200) {
          this.addressData = res.data
        }
      })
    },
    saveData () {
      this.$refs.addressDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            id: this.currentAddressId,
            ...this.addressData,
            member_id: this.memberId
          }
          this.$store
            .dispatch('memberAddress/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.colseDialog()
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },
    colseDialog () {
      this.dialogShow = false
      this.$emit('colseDialog')
    },

    // 地址组件
    provinceupdate (a) {
      this.addressData.province = a.value
      this.addressData.province_code = a.code
    },
    cityupdate (a) {
      this.addressData.city = a.value
      this.addressData.city_code = a.code
    },
    areaupdate (a) {
      this.addressData.district = a.value
      this.addressData.district_code = a.code
    }
  }
}
</script>

<style scoped></style>
