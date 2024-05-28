<template>
  <q-dialog v-model="oilsupplierstatus" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">{{ dataId > 0 ? '修改' : '新增' }}</q-toolbar-title>
            <q-btn flat round icon="close" @click="hideNowPage()" size="12px" />
          </q-toolbar>
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="oilGunRef" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <div class="col-md-6 col-12 q-pt-none">
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    v-model="oilSupplierFrom.es_name"
                    lazy-rules
                    :rules="[(val) => !!val || '名称是必填项']"
                    label="请输入供应商名称"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-12 q-pt-none">
                  <q-select
                    outlined
                    dense
                    option-value="id"
                    option-label="est_name"
                    emit-value
                    map-options
                    :options="oilsuppliersTypeList"
                    v-model="oilSupplierFrom.supplier_type_id"
                    label="请选择供应商分类"
                    lazy-rules
                    :rules="[(val) => !!val || '供应商分类是必填项']"
                  />
                </div>
                <!-- <div class="col-md-6 col-12 q-pt-none">
                  <q-select
                    outlined
                    dense
                    option-value="id"
                    option-label="label"
                    emit-value
                    map-options
                    :options="oilPropertyList"
                    v-model="oilSupplierFrom.es_property"
                    label="请选择供应商属性"
                    lazy-rules
                    :rules="[(val) => !!val || '供应商属性是必填项']"
                  />
                </div> -->
                <div class="col-md-6 col-12 q-pt-none">
                  <div class="row">
                    <div class="col-9">
                      <q-input outlined bottom-slots dense class="q-pb-none" v-model="oilSupplierFrom.es_code" label="请输入供应商编号"> </q-input>
                    </div>
                    <div class="col-3">
                      <q-btn unelevated color="primary" class="full-width full-height" label="一键生成" @click="changeCode()" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-12 q-pt-none">
                  <q-input outlined bottom-slots dense v-model="oilSupplierFrom.es_increment_tax" label="请输入增值税率仅输入数值不要%（单位：%）">
                  </q-input>
                </div>
                <div class="col-md-6 col-12 q-pt-none">
                  <q-input
                    outlined
                    bottom-slots
                    lazy-rules
                    :rules="[(val) => /^[0-9]+(.[0-9]{0,2})?$/.test(val) || '请输入正确的金额']"
                    dense
                    v-model="oilSupplierFrom.es_payable"
                    label="请输入期初应付款"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-12 q-pt-none">
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    v-model="oilSupplierFrom.es_prepayments"
                    label="请输入期初预付款"
                    lazy-rules
                    :rules="[(val) => /^[0-9]+(.[0-9]{0,2})?$/.test(val) || '请输入正确的金额']"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-pt-none q-col-gutter-sm row">
                  <div class="col-6 q-pt-none">
                    <hl-address
                      :province="oilSupplierFrom.province"
                      :city="oilSupplierFrom.city"
                      :area="oilSupplierFrom.district"
                      @province="provinceupdate"
                      @city="cityupdate"
                      @area="areaupdate"
                    ></hl-address>
                  </div>
                  <div class="col-6 ">
                    <q-input outlined bottom-slots dense v-model="oilSupplierFrom.es_address" label="请输入联系地址"> </q-input>
                  </div>
                </div>
                <div class="col-12 q-pt-none">
                  <q-input outlined type="textarea" :rows="2" bottom-slots dense v-model="oilSupplierFrom.es_remarks" label="请输入备注"> </q-input>
                </div>
              </div>
              <div>
                <supplier-contact-person :supplierId="dataId" @getData="getPersonData" />
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn unelevated label="提交" @click="saveData()" color="primary" class="q-px-xl" />
          <q-btn unelevated label="返回" type="reset" @click="hideNowPage()" color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import SupplierContactPerson from './SupplierContactPerson.vue'
export default {
  name: 'AddSupplier',
  components: { SupplierContactPerson },
  data () {
    return {
      dialogWidth: '1000px',
      oilSupplierFrom: {
        supplier_type_id: '',
        es_code: '',
        es_property: '1',
        es_name: '',
        es_address: '',
        es_remarks: '',
        es_payable: '',
        es_prepayments: '',
        es_increment_tax: '',
        province: '',
        city: '',
        district: ''
      },
      oilsuppliersTypeList: [],
      oilPropertyList: [
        {
          id: '1',
          label: '供油商'
        },
        {
          id: '2',
          label: '关联公司'
        }
      ],
      dataId: 0,
      oilsupplierstatus: false,
      contactPersonData: []
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.8) + 'px'
    }
  },
  computed: {},
  created () {
    this.getSupplierType()
  },
  methods: {
    init (id) {
      this.dataId = id
      this.oilsupplierstatus = true
      if (id > 0) {
        this.$store.dispatch('osupplier/getItem', id).then((res) => {
          if (res.code == 200) {
            this.oilSupplierFrom = res.data
          }
        })
      }
    },
    getSupplierType () {
      this.$store
        .dispatch('osupplier/getTypeData')
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.oilsuppliersTypeList = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    saveData () {
      this.$refs.oilGunRef.validate().then((success) => {
        if (success) {
          this.stop = true
          const obj = {
            contact: this.contactPersonData,
            ...this.oilSupplierFrom,
            id: this.dataId
          }
          this.$store
            .dispatch('osupplier/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              this.stop = false
            })
        }
      })
    },
    provinceupdate (a) {
      this.oilSupplierFrom.province = a.value
      this.oilSupplierFrom.province_code = a.code
    },

    cityupdate (a) {
      this.oilSupplierFrom.city = a.value
      this.oilSupplierFrom.city_code = a.code
    },

    areaupdate (a) {
      this.oilSupplierFrom.district = a.value
      this.oilSupplierFrom.district_code = a.code
    },
    changeCode () {
      this.oilSupplierFrom.es_code = new Date().getTime() + ''
    },
    getPersonData (val) {
      this.contactPersonData = val
    },
    hideNowPage () {
      this.$emit('getMethods')
      this.oilsupplierstatus = false
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
