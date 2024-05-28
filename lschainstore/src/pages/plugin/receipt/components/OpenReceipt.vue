<template>
  <q-dialog ref="titletemRef" @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pa-sm row items-center">
          开具发票
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height q-pa-sm">
          <q-scroll-area class="fit full-height">
            <q-form ref="titletemRef">
              <div class="row items-center">
                <div class="col-12 ">
                  <span class="row justify-center text-h5"> 未开票总计金额：{{ itemData.pr_invoice_amount }}{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                </div>
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="itemData.pr_total_amount"
                  placeholder="请输入开具发票金额"
                  lazy-rules
                  :rules="[(val) => !!val || '请输入开具发票金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '开票金额为非负两位以内小数']"
                />
              </div>
              <div class="col-12">
                <q-input
                  class=" q-pr-sm q-mt-xs"
                  outlined
                  dense
                  v-model="itemData.pr_invoice_code_info"
                  placeholder="请输入开具发票代码"
                  lazy-rules
                  :rules="[(val) => (val > 0 && val <= 999999999999) || '请输入正确的发票代码,发票号码一般是10位或12位']"
                />
              </div>

              <div class="col-12">
                <q-input
                  class=" q-pr-sm q-mt-xs"
                  outlined
                  dense
                  v-model="itemData.pr_invoice_number"
                  placeholder="请输入开具发票发票号码"
                  lazy-rules
                  :rules="[(val) => (val > 0 && val <= 99999999) || '请输入正确的发票号码，发票号码一般是8位']"
                />
              </div>

              <div class="col-12 q-mb-md" v-if="titleListData.length > 0">
                <q-select
                  outlined
                  dense
                  v-model="titleId"
                  :options="titleListData"
                  label="请选择发票抬头"
                  option-value="id"
                  option-label="prt_name"
                  emit-value
                  @input="getTitleName(titleId)"
                  map-options
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <!-- <q-item-label>{{ scope.opt.ic_name }}</q-item-label> -->
                        <q-item-label>抬头名称:{{ scope.opt.prt_name }} — 类型:{{ scope.opt.prt_type == 1 ? '个人/事业单位' : '单位' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12 q-mb-md">
                <q-btn-toggle
                  v-model="itemData.pr_type"
                  spread
                  class="my-custom-toggle"
                  no-caps
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="primary"
                  @input="
                    itemData.pr_identification_number = ''
                    itemData.pr_bank = ''
                    itemData.pr_bank_number = ''
                    itemData.pr_address = ''
                  "
                  :options="[
                    { label: '个人/事业单位', value: '1' },
                    { label: '单位', value: '2' },
                  ]"
                />
              </div>

              <div class="col-12">
                <q-input class=" q-pr-sm q-mt-xs" outlined dense v-model="itemData.pr_title_name" placeholder="请输入发票抬头（必填）" lazy-rules :rules="[(val) => !!val || '请填写发票抬头']" />
              </div>

              <div class="col-12" v-if="itemData.pr_type == '2'">
                <q-input
                  class=" q-pr-sm q-mt-xs"
                  outlined
                  dense
                  maxlength="20"
                  v-model="itemData.pr_identification_number"
                  placeholder="请输入纳税人识别号"
                  lazy-rules
                  :rules="[(val) => !!val || '为确保开票成功请谨慎添加纳税人识别号']"
                />
              </div>
              <div class="col-12">
                <q-input
                  class=" q-pr-sm q-mt-xs"
                  outlined
                  dense
                  v-model="itemData.pr_phone"
                  placeholder="请填写收票人联系电话"
                  lazy-rules
                  :rules="[(val) => !!val || '请填写联系电话', (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确']"
                />
              </div>
              <div class="col-12">
                <q-input
                  class=" q-pr-sm q-mt-xs"
                  outlined
                  dense
                  v-model="itemData.pr_email"
                  placeholder="用于接收电子发票的邮箱（选填）"
                  :rules="[(val) => /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val) || '请输入正确的邮箱']"
                />
              </div>
              <div class="col-12 q-mb-md" v-if="itemData.pr_type == '2'">
                <q-input class=" q-pr-sm q-mt-xs" outlined dense v-model="itemData.pr_bank" placeholder="请输入开户银行（选填）" />
              </div>
              <div class="col-12" v-if="itemData.pr_type == '2'">
                <q-input
                  class=" q-pr-sm q-mt-xs"
                  outlined
                  dense
                  v-model="itemData.pr_bank_number"
                  placeholder="请输入银行账号（选填）"
                  lazy-rules
                  :error="bankNumberVerify"
                  :error-message="'银行账号格式不正确'"
                />
              </div>
              <div class="col-12" v-if="itemData.pr_type == '2'">
                <q-input class=" q-pr-sm q-mt-xs" outlined dense v-model="itemData.pr_address" placeholder="请输入单位地址（选填）" />
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md q-gutter-sm text-center ">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'OpenReceipt',
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      titleId: '',
      itemData: {
        pr_member_id: 0,
        pr_total_amount: '',
        pr_invoice_code_info: '',
        pr_invoice_number: '',
        pr_status: 1,
        pr_invoice_amount: '',
        pr_title_name: '',
        pr_type: '1',
        pr_email: '',
        pr_phone: '',
        pr_bank: '',
        pr_bank_number: '',
        pr_address: ''
      },
      titleListData: [],
      invoiceListData: []
    }
  },
  created () {},
  mounted () {},
  computed: {
    bankNumberVerify () {
      if (this.itemData.pr_bank_number && !/^\d{16}|\d{19}$/.test(this.itemData.pr_bank_number)) {
        return true
      }
      return false
    }
  },
  methods: {
    // 查询开支项单条
    init (totalAmount, data, memberId) {
      this.showDialog = true
      if (totalAmount > 0) {
        this.itemData.pr_invoice_amount = totalAmount
        this.invoiceListData = data
        this.itemData.pr_member_id = memberId
      }
      const params = {
        member_id: memberId
      }
      this.$store
        .dispatch('receipt/getTitleList', params)
        .then((res) => {
          if (res.code == 200) {
            this.titleListData = res.data ? res.data : {}
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    // 新增开票
    setData () {
      this.$refs.titletemRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          this.showDialog = false
          this.itemData.pr_status = 1
          const data = {
            itemData: this.itemData,
            invoiceListData: this.invoiceListData
          }
          this.$store
            .dispatch('receipt/setRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '提交成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
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
            })
        }
      })
    },
    getTitleName (id) {
      if (id > 0) {
        this.$store
          .dispatch('receipt/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.itemData.pr_title_name = res.data.prt_name
              this.itemData.pr_phone = res.data.prt_phone
              this.itemData.pr_type = res.data.prt_type
              this.itemData.pr_email = res.data.prt_email
              this.itemData.pr_identification_number = res.data.prt_identification_number
              this.itemData.pr_bank = res.data.prt_bank
              this.itemData.pr_bank_number = res.data.prt_bank_number
              this.itemData.pr_address = res.data.prt_address
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((err) => {})
      }
    },
    // 关闭弹窗执行
    hideNowPage () {
      this.itemData = {
        pr_member_id: 0,
        pr_title_name: '',
        pr_phone: '',
        pr_type: '1',
        pr_email: '',
        pr_identification_number: '',
        pr_bank: '',
        pr_bank_number: '',
        pr_address: ''
      }
      this.itemData.id = ''
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
<style>
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
