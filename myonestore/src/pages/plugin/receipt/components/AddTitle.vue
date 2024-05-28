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
        <div class="col-shrink bg-white q-pa-sm q-pb-md row">
          {{ itemData.id > 0 ? '修改发票抬头' : '新增发票抬头' }}
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
            <q-form ref="titletemRef" class="q-mt-md">
              <div class=" row">

                <div class="col-12 q-pb-md">
                  <q-btn-toggle
                    v-model="itemData.prt_type"
                    spread
                    class="my-custom-toggle"
                    no-caps
                    unelevated
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    @input="
                      itemData.prt_identification_number = ''
                      itemData.prt_bank = ''
                      itemData.prt_bank_number = ''
                      itemData.prt_address = ''
                    "
                    :options="[
                      { label: '个人/事业单位', value: '1' },
                      { label: '单位', value: '2' },
                    ]"
                  />
                </div>

                <div class="col-12">
                  <q-input  outlined dense v-model="itemData.prt_name" placeholder="请输入发票抬头（必填）" lazy-rules :rules="[(val) => !!val || '请填写发票抬头']" />
                </div>

                <div class="col-12" v-if="itemData.prt_type == '2'">
                  <q-input
                    outlined
                    dense
                    maxlength="20"
                    v-model="itemData.prt_identification_number"
                    placeholder="请输入纳税人识别号"
                    lazy-rules
                    :rules="[(val) => !!val || '为确保开票成功请谨慎添加纳税人识别号']"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    v-model="itemData.prt_phone"
                    placeholder="请填写收票人联系电话"
                    lazy-rules
                    :rules="[(val) => !!val || '请填写联系电话', (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确']"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    v-model="itemData.prt_email"
                    placeholder="用于接收电子发票的邮箱（必填）"
                    :rules="[(val) => !!val || '请填写邮箱', (val) => /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val) || '请输入正确的邮箱']"
                  />
                </div>

                <div class=" col-12" v-if="itemData.prt_type == '2'">
                  <q-input class="q-mb-md" outlined dense v-model="itemData.prt_bank" placeholder="请输入开户银行（选填）" />
                </div>

                <div class="col-12" v-if="itemData.prt_type == '2'">
                  <q-input
                    outlined
                    dense
                    v-model="itemData.prt_bank_number"
                    placeholder="请输入银行账号（选填）"
                    lazy-rules
                    :error="bankNumberVerify"
                    :error-message="'银行账号格式不正确'"
                  />
                </div>

                <div class="col-12" v-if="itemData.prt_type == '2'">
                  <q-input  outlined dense v-model="itemData.prt_address" placeholder="请输入单位地址（选填）" />
                </div>
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
  name: 'AddTitle',
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      itemData: {
        id: 0,
        prt_member_id: 0,
        prt_name: '',
        prt_phone: '',
        prt_type: '1',
        prt_email: '',
        prt_identification_number: '',
        prt_bank: '',
        prt_bank_number: '',
        prt_address: ''
      }
    }
  },
  created () {},
  mounted () {},
  computed: {
    bankNumberVerify () {
      if (this.itemData.prt_bank_number && !/^\d{16}|\d{19}$/.test(this.itemData.prt_bank_number)) {
        return true
      }
      return false
    }
  },
  methods: {
    // 查询开支项单条
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('receipt/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.itemData = res.data ? res.data : {}
              this.$refs.memberCardReading.getMemberIdReturnData(this.itemData.prt_member_id)
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
      }
    },
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.itemData.prt_member_id = val.id
        }
      }
    },
    // 新增或修改开支项
    setData () {
      const that = this
      this.$refs.titletemRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const data = {
            ...this.itemData
          }
          this.$store
            .dispatch('receipt/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.itemData.id > 0 ? '修改' : '新增'}` + '发票抬头成功',
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
              this.hideNowPage()
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

    // 关闭弹窗执行
    hideNowPage () {
      this.itemData = {
        id: 0,
        prt_member_id: 0,
        prt_name: '',
        prt_phone: '',
        prt_type: '1',
        prt_email: '',
        prt_identification_number: '',
        prt_bank: '',
        prt_bank_number: '',
        prt_address: ''
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
      this.showDialog = false
    }
  }
}
</script>
<style>
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
