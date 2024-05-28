<template>
  <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-sm q-pb-xs row items-center q-pa-xs">
          <div class="text-subtitle2">{{ supplierFrom.id > 0 ? '修改' : '新增' }}供货商信息</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-px-none q-py-xs full-height bg-grey-2">
          <q-scroll-area class="fit full-height">
            <q-form ref="supplierDataRef" class="q-gutter-md bg-white">
              <q-card-section>
                <div class="row">
                  <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                    <q-input label="名称" outlined v-model="supplierFrom.ces_name" dense lazy-rules :rules="[(val) => !!val || '名称是必填的']" />
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                    <q-select
                      outlined
                      multiple
                      emit-value
                      map-options
                      use-chips
                      stack-label
                      option-value="id"
                      option-label="cp_name"
                      v-model="supplierFrom.ces_brand_id"
                      :options="brandData"
                      dense
                      label="选择品牌"
                    />
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                    <q-input
                      label="编号"
                      outlined
                      v-model="supplierFrom.ces_number"
                      dense
                      lazy-rules
                      :rules="[(val) => /^\d+$/.test(val) || '编号为非负整数']"
                    >
                      <template v-slot:after>
                        <q-btn color="warning" class="full-width" unelevated label="一键生成编号" @click="math" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm q-mt-xs">
                    <q-input outlined dense label="绑定会员" maxlength="9" v-model="member" readonly>
                      <template v-slot:append>
                        <q-icon name="search" @click="addMember" />
                      </template>
                      <template v-slot:hint> 点击图标按钮绑定会员 </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                    <span>姓名</span>
                    <q-input
                      label="姓名"
                      outlined
                      v-model="supplierFrom.ces_contact_people"
                      dense
                      lazy-rules
                      :rules="[(val) => !!val || '请填写姓名']"
                    />
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                    <span>联系电话</span>
                    <q-input
                      outlined
                      bottom-slots
                      v-model="supplierFrom.ces_contact_tel"
                      dense
                      :rules="[
                        (val) => !!val || '请填写联系电话',
                        (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm  ">
                    <span>手机号<span class="text-red q-pl-xs">*</span></span>
                    <q-input
                      outlined
                      bottom-slots
                      v-model="supplierFrom.ces_contact_moblie"
                      dense
                      lazy-rules
                      :rules="[
                        (val) => !!val || '请填写手机号',
                        (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '电话号不正确',
                      ]"
                    >
                    </q-input>
                  </div>

                  <div class="col-md-6 col-12 q-pr-sm ">
                    <span>邮箱<span class="text-red q-pl-xs">*</span></span>
                    <q-input
                      outlined
                      bottom-slots
                      v-model="supplierFrom.ces_contact_email"
                      dense
                      lazy-rules
                      :rules="[
                        (val) => !!val || '请填写邮箱',
                        (val) =>
                          /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val) ||
                          '请输入正确的邮箱',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm">
                    <span>企业信用代码<span class="text-red q-pl-xs">*</span></span>
                    <q-input outlined bottom-slots v-model="supplierFrom.ces_business_license" dense lazy-rules> </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm">
                    <span>注册资本<span class="text-red q-pl-xs">*</span></span>
                    <q-input outlined bottom-slots v-model="supplierFrom.ces_register_capital" dense lazy-rules> </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm">
                    <span>开户银行<span class="text-red q-pl-xs">*</span></span>
                    <q-input outlined bottom-slots v-model="supplierFrom.ces_bank" dense lazy-rules> </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm">
                    <span>银行账号<span class="text-red q-pl-xs">*</span></span>
                    <q-input outlined bottom-slots v-model="supplierFrom.ces_bank_card_number" dense lazy-rules> </q-input>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm">
                    <span>退货率</span>
                    <q-input outlined bottom-slots v-model="supplierFrom.ces_return_rate" dense lazy-rules> </q-input>
                  </div>

                  <div class="col-md-6 col-12 q-pr-sm">
                    <span>支付方式<span class="text-red q-pl-xs">*</span></span>
                    <q-select
                      outlined
                      option-value="value"
                      option-label="label"
                      emit-value
                      map-options
                      v-model="supplierFrom.ces_pay_type"
                      :options="options"
                      dense
                      label="支付方式"
                    />
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm" v-if="supplierFrom.ces_pay_type == 1">
                    <span>结算周期</span>
                    <q-input outlined bottom-slots v-model="supplierFrom.ces_pay_period" dense lazy-rules> </q-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 col-12 q-pr-sm">
                    <hl-address
                      :province="supplierFrom.ces_province"
                      :city="supplierFrom.ces_city"
                      :area="supplierFrom.ces_district"
                      @province="provinceupdate"
                      @city="cityupdate"
                      @area="areaupdate"
                    ></hl-address>
                  </div>
                  <div class="col-md-6 col-12 q-pr-sm ">
                    <q-input label="联系地址" outlined v-model="supplierFrom.ces_address" dense :error="false" />
                  </div>
                </div>
                <q-input :rows="2" class="q-mt-sm q-mb-lg" label="备注" outlined v-model="supplierFrom.ces_supplier_note" dense type="textarea" />
              </q-card-section>
            </q-form>
          </q-scroll-area>
        </div>
        <hl-choose-manager ref="chooseManagerList" @getChooseManageData="receivingAdministrator"></hl-choose-manager>
        <q-card-actions align="center">
          <q-btn unelevated label="确认" color="primary" @click="submitData" :disable="stop" class="q-mb-lg q-px-xl" />
          <q-btn label="关闭" unelevated @click="hideNowPage" color="grey" class="q-mb-lg q-ml-sm q-mr-lg q-px-xl" v-close-popup />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddSupplier',
  data () {
    return {
      dialogWidth: '1000px',
      dataId: '',
      isSidebarActiveLocal: false,
      disabledStatus: false,
      success: false,
      stop: false,
      supplierFrom: {
        ces_brand_id: [],
        ces_name: '',
        ces_number: '',
        ces_address: '',
        ces_province: '',
        ces_province_code: '',
        ces_city: '',
        ces_city_code: '',
        ces_district: '',
        ces_district_code: '',
        ces_contact_people: '',
        ces_contact_tel: '',
        ces_contact_moblie: '',
        ces_contact_email: '',
        ces_business_license: '',
        ces_register_capital: '',
        ces_bank: '',
        ces_bank_card_number: '',
        ces_return_rate: '',
        ces_pay_type: '1',
        ces_pay_period: '',
        ces_supplier_note: ''
      },
      options: [
        {
          label: '账期',
          value: '1'
        },
        {
          label: '现结',
          value: '2'
        }
      ],
      brandData: [],
      member: ''
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + 'px'
    }
  },
  mounted () {
    this.getBrandData()
  },
  computed: {},
  methods: {
    init (id) {
      this.isSidebarActiveLocal = true
      if (id > 0) {
        this.dataId = id
        this.$store.dispatch('supplier/getItemData', this.dataId).then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.supplierFrom = res.data
              this.member = res.data.member ? res.data.member.mem_memberName : ''
              if (this.supplierFrom.ces_brand_id) {
                this.supplierFrom.ces_brand_id = this.supplierFrom.ces_brand_id.split(',')
              } else {
                this.supplierFrom.ces_brand_id = []
              }
              // this.supplierFrom.ces_brand_id = parseInt(this.supplierFrom.ces_brand_id)
            }
          }
        })
      }
    },
    getBrandData () {
      this.$store.dispatch('goodsProperty/getPropertyList', { type: 'brand' }).then((res) => {
        if (res.code == 200) {
          this.brandData = res.data
        }
      })
    },
    math () {
      this.supplierFrom.ces_number = new Date().getTime().toString()
    },
    submitData () {
      this.$refs.supplierDataRef.validate().then((success) => {
        if (success) {
          this.stop = true
          this.disabledStatus = true
          const obj = {
            ...this.supplierFrom,
            id: this.dataId
          }
          this.$store.dispatch('supplier/addData', obj).then((res) => {
            if (res.code == 200) {
              this.success = false
              this.isSidebarActiveLocal = false
              this.$q.notify({
                message: '成功',
                caption: '操作成功!',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.$nextTick(() => {
                this.disabledStatus = false
                this.hideNowPage()
              })
            } else {
              this.disabledStatus = false
            }
          })
        }
      })
    },

    provinceupdate (a) {
      this.supplierFrom.ces_province = a.value
      this.supplierFrom.ces_province_code = a.code
    },
    cityupdate (a) {
      this.supplierFrom.ces_city = a.value
      this.supplierFrom.ces_city_code = a.code
    },
    areaupdate (a) {
      this.supplierFrom.ces_district = a.value
      this.supplierFrom.ces_district_code = a.code
    },
    hideNowPage () {
      this.$emit('refreshDataList')
    },
    addMember () {
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    delMember () {
      this.member = ''
      this.supplierFrom.ces_member_id = 0
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        this.member = val[0].mem_memberName
        this.supplierFrom.ces_member_id = parseInt(val[0].id)
      }
    }
  }
}
</script>
