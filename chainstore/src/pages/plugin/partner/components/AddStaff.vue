<template>
  <q-dialog v-model="dialogShow" width="80%">
    <q-card style="width: 1000px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dataId ? '修改' : '新增' }}员工合伙人</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
      </q-card-section>

      <q-card-section>
        <q-chip square color="red" text-color="white" class="q-pa-md">
          <span>
            <q-icon name="report_problem"></q-icon>
            注意：输入手机号为会员绑定手机号
          </span>
        </q-chip>
        <q-form ref="staffDataRef" class="q-gutter-md">
          <div class="col-md-12 col-12 q-pl-sm">
            <q-input outlined bottom-slots label="手机号" v-model="dataForm.ppi_member_mobile" dense @blur="checkMember" placeholder="请输入手机号/卡号"> </q-input>
            <q-input outlined bottom-slots label="员工姓名" v-model="dataForm.ppi_partner_name" dense lazy-rules :rules="[(val) => val.length > 0 || '员工姓名是必填']" placeholder="请输入员工姓名">
            </q-input>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md q-gutter-sm">
        <q-btn label="确定" @click="addUpdateReward()" color="primary" class="q-px-xl" :disable="memberStatus" unelevated />
        <q-btn label="取消" @click="clearFields()" class="q-px-xl"  color="grey" unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddStaff',
  data () {
    return {
      dialogShow: false,
      memberStatus: true,
      dataId: '',
      dataForm: {
        ppi_member_mobile: '',
        ppi_partner_name: '',
        ppi_type: 'staff'
      }
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
      if (this.dataForm.ppi_member_mobile) {
        this.memberStatus = true
        const obj = {
          card_number: this.dataForm.ppi_member_mobile
        }

        this.$store
          .dispatch('components/cardReader', obj)
          .then((res) => {
            if (res.code == 200) {
              const userData = res.data
              if (res.data.id != this.dataForm.member_id) {
                this.$store
                  .dispatch('partner/checkMemberrData', {
                    member_id: res.data.id
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
                      this.dataForm.ppi_member_mobile = ''
                    } else {
                      this.dataForm.ppi_member_name = userData.mem_memberName
                      this.dataForm.ppi_member_card_num = userData.mem_memberCardNum
                      this.dataForm.member_id = userData.id

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
              this.memberStatus = false
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })

              this.dataForm.ppi_member_mobile = ''
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
    addUpdateReward () {
      this.$refs.staffDataRef.validate().then((success) => {
        if (success) {
          this.memberStatus = true
          const obj = {
            ...this.dataForm,
            id: this.dataId
          }
          this.$store
            .dispatch('partner/setMemberData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '员工合伙人成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.clearFields()
                })
              } else {
                this.$q.notify({
                  message: '操作失败',
                  caption: '保存失败，名称过长',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
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
      this.$emit('getMethods')
      this.dialogShow = false
      this.dataForm = {}
      this.memberStatus = false
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
