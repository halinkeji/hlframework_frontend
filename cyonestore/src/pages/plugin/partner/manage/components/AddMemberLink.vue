<template>
  <q-dialog v-model="dialogShow" width="80%" persistent>
    <q-card style="width: 1000px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dataId ? '修改' : '新增' }}绑定会员推荐人</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="clearFields" />
      </q-card-section>
      <q-card-section>
        <q-form ref="memberDataRef" class="q-gutter-md">
          <div class="col-md-12 col-12 q-pl-sm">
            <!-- <q-input outlined bottom-slots label="手机号" v-model="member_mobile" dense @blur="checkMember" placeholder="请输入手机号或卡号"> </q-input> -->
            <q-input outlined dense label="绑定推荐会员" maxlength="9" v-model="member" readonly class="q-pb-md">
              <template v-slot:append>
                <q-icon name="search" @click="addMember" />
              </template>
              <template v-slot:hint> 点击图标按钮绑定会员 </template>
            </q-input>
          </div>
          <hl-choose-manager ref="chooseManagerList" @getChooseManageData="receivingAdministrator"></hl-choose-manager>
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md text-center q-gutter-sm">
        <q-btn label="确定" @click="addUpdateReward()" color="primary" class="q-px-xl" :disable="memberStatus" unelevated />
        <q-btn label="取消" @click="clearFields()" class="q-px-xl" color="grey" unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddMemberLink',
  props: ['partnerid'],
  data () {
    return {
      dialogShow: false,
      memberStatus: true,
      dataId: '',
      member: '',
      pml_member_id: '',
      member_mobile: '',
      dataForm: {}
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (id) {
      this.dialogShow = true
      if (id > 0) {
        this.dataId = id
        this.$store.dispatch('partner/getMemberItem', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.dataForm = res.data ? res.data : {}
            this.memberStatus = false
          } else {
            this.dialogShow = false
          }
        })
      }
    },
    checkMember () {
      if (this.member_mobile) {
        this.memberStatus = true
        const obj = {
          card_number: this.member_mobile
        }
        this.$store
          .dispatch('components/cardReader', obj)
          .then((res) => {
            if (res.code == 200) {
              const userData = res.data
              if (res.data.id != this.dataForm.member_id) {
                this.$store
                  .dispatch('partner/checkMemberLinkData', {
                    member_id: userData.id
                  })
                  .then((res) => {
                    if (res.code == 400) {
                      this.$q.notify({
                        message: '失败',
                        caption: res.message,
                        icon: 'ion-close-circle-outline',
                        color: 'red',
                        timeout: 500,
                        position: 'top-right'
                      })
                      this.member_mobile = ''
                    } else {
                      this.pml_member_id = userData.id
                      this.$q.notify({
                        message: '成功',
                        caption: '可以绑定',
                        icon: 'ion-checkmark-circle-outline',
                        color: 'green',
                        timeout: 500,
                        position: 'top-right'
                      })
                      this.memberStatus = false
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
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
              this.userData = {}
              this.member_mobile = ''
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
    },
    addMember () {
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        if (parseInt(val[0].id) != this.dataForm.member_id) {
          this.checkMemberInfo(val[0])
        }
      }
    },
    checkMemberInfo (item) {
      this.$store
        .dispatch('partner/checkMemberLinkData', {
          member_id: item.id
        })
        .then((res) => {
          if (res.code == 400) {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            this.member = ''
          } else {
            this.$q.notify({
              message: '成功',
              caption: '可以绑定',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.pml_member_id = item.id
            this.member = item.mem_memberName
            this.memberStatus = false
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
    addUpdateReward () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          this.memberStatus = true
          const obj = {
            pml_partner_id: this.partnerid,
            pml_member_id: this.pml_member_id,
            pml_status: 1
          }
          this.$store
            .dispatch('partner/setMemberLinkData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '绑定会员成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.clearFields()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '操作失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.memberStatus = false
            })
        }
      })
    },
    clearFields () {
      this.member = ''
      this.pml_member_id = ''
      this.dialogShow = false
      this.memberStatus = true
      this.$emit('getMethods')
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style></style>
