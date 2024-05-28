<template>
  <q-dialog v-model="qrcodeDialog" persistent>
    <q-card
      flat
      :style="{
        width: $q.screen.width * 0.2 + 'px',
        'min-width': $q.screen.width * 0.2 + 'px',
      }"
    >
      <q-form ref="consumeSetFormRef">
        <q-item>
          <q-item-section>
            <q-item-label> 转账用户设置 </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" @click="closeDialog"> </q-btn>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-12">
            <q-item>
              <q-item-section>
                <q-item-label>{{ transferMemberForm.nick_name ? transferMemberForm.nick_name : '未绑定' }}</q-item-label>
                <q-item-label caption lines="2">{{ transferMemberForm.card_number ? '卡号：' + transferMemberForm.card_number :  '' }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn color="primary" label="绑定会员"  unelevated @click="addMember" />
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
        <q-separator />
      </q-form>
      <q-card-actions align="center">
        <q-btn @click="saveTransferMember" :disable="!transferMemberForm.pmm_transfer_pmerchant_member_id" color="primary" class="q-px-xl" unelevated>保存</q-btn>
      </q-card-actions>

      <hl-choose-manager
        ref="chooseManagerList"
        @getChooseManageData="receivingAdministrator"
        v-if="chooseMemberDialog"
        @closeChooseManage="chooseMemberDialog = false"
      ></hl-choose-manager>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'RechargeMoneySet',
  data () {
    return {
      qrcodeDialog: false,
      relationStoreId: 0,
      chooseMemberDialog: false,
      transferMemberForm: {
        pmm_transfer_pmerchant_member_id: '',
        nick_name: '',
        card_number: ''
      }
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (storeId) {
      this.qrcodeDialog = true
      this.relationStoreId = storeId

      this.$nextTick(() => {
        this.getTransferData()
      })
    },
    getTransferData () {
      const obj = {
        relationStoreId: this.relationStoreId
      }
      this.$store
        .dispatch('merchantManage/getTransferMemberId', obj)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.merchantId) {
            this.transferMemberForm = res.data
          }
        })
        .catch((error) => {})
    },
    saveTransferMember () {
      const obj = {
        pmm_transfer_pmerchant_member_id: this.transferMemberForm.pmm_transfer_pmerchant_member_id,
        merchantId: this.transferMemberForm.merchantId
      }
      this.$store
        .dispatch('merchantManage/setTransferMemberId', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.closeDialog()
          } else {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    },
    closeDialog () {
      this.qrcodeDialog = false
      this.$emit('closeDialog')
    },
    addMember () {
      this.chooseMemberDialog = true
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      this.chooseMemberDialog = false
      if (val && val.length > 0) {
        const memberInfo = val[0]
        this.transferMemberForm.pmm_transfer_pmerchant_member_id = memberInfo.m_pmerchant_id
        this.transferMemberForm.card_number = memberInfo.card_number
        this.transferMemberForm.nick_name = memberInfo.nick_name
      }
    }
  }
}
</script>

<style></style>
