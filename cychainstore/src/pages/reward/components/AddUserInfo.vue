<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="q-pa-sm "
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dataId ? '修改' : '新增' }}员工</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>

      <q-form ref="newsDataRef" class="q-gutter-md">
        <div class="q-ml-lg">
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />基础信息</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6  q-ml-md">
              <q-input outlined dense label="员工名称" :rules="[(val) => !!val || '必填项']" v-model="dataForm.pru_name" placeholder="请输入员工">
                <template v-slot:hint>
                  填写员工名称
                </template></q-input
              >
            </div>
            <div class="col-8 col-md-5  q-ml-md">
              <q-input
                outlined
                dense
                label="员工电话"
                :rules="[(val) => !!val || '请填写员工电话', (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确']"
                v-model="dataForm.pru_telephone"
                placeholder="请输入员工电话"
              >
                <template v-slot:hint>
                  填写员工电话
                </template></q-input
              >
            </div>
          </div>

          <div class="row q-my-sm">
            <div class="col-8 col-md-6 q-ml-md">
              <q-select
                class="col-12 col-md-2"
                outlined
                label="员工状态"
                bottom-slots
                v-model="dataForm.pru_status"
                :options="[
                  { label: '开启', value: '1' },
                  { label: '关闭', value: '0' },
                ]"
                dense
                emit-value
                map-options
              >
                <template v-slot:hint> 员工状态 </template>
              </q-select>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />绑定设置</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6  q-ml-md">
              <q-input outlined dense label="绑定会员" maxlength="9" v-model="member" readonly>
                <template v-slot:append>
                  <q-icon name="search" @click="addMember" />
                </template>
                <template v-slot:hint> 点击图标按钮绑定会员 </template>
              </q-input>
            </div>
            <div class="col-8 col-md-5  q-ml-md">
              <q-input outlined dense label="绑定操作员" v-model="userName" readonly>
                <template v-slot:append @click="selectUser">
                  <q-icon name="search" @click="selectUser" />
                </template>
                <template v-slot:hint> 点击图标按钮绑定操作员 </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-form>
      <div class="row q-gutter-sm text-center justify-center">
        <q-btn unelevated class="q-px-xl" label="提交" @click="saveData" :disable="saveStopData" color="primary" />
        <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage" />
      </div>
    </q-card>
    <select-user v-if="userStatus" ref="selectUserRef" @getSelectedUserData="getUserData"></select-user>
    <hl-choose-manager ref="chooseManagerList" @getChooseManageData="receivingAdministrator"></hl-choose-manager>
  </q-dialog>
</template>

<script>
import SelectUser from './SelectUser'
export default {
  name: 'AddUserInfo',
  props: ['positionId'],
  components: {
    SelectUser
  },
  data () {
    return {
      dialogWidth: '1000px',
      addStoreSidebar: false,
      userStatus: false,
      dataId: 0,
      dataForm: {
        pru_name: '',
        pru_telephone: '',
        pru_status: '1',
        pru_member_id: '',
        pru_user_id: ''
      },
      saveStopData: false,
      userName: '',
      member: ''
    }
  },
  created () {},
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.7) + 'px'
    }
  },
  computed: {},
  methods: {
    getUser (id) {
      this.addStoreSidebar = true
      if (id > 0) {
        this.dataId = id
        this.$store.dispatch('reward/getUserItem', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.dataForm = res.data ? res.data : {}
            if (this.dataForm) {
              this.member = res.data.member ? res.data.member.mem_memberName : ''
              this.userName = res.data.user ? res.data.user.username : ''
            }
          } else {
            this.addStoreSidebar = false
          }
        })
      }
    },
    selectUser () {
      console.log()
      this.userStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.selectUserRef.getUser()
        }, 500)
      })
    },
    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.saveStopData = true
          this.addStoreSidebar = false
          const obj = {
            ...this.dataForm,
            position_id: this.positionId,
            id: this.dataId
          }
          this.$store
            .dispatch('reward/setUserData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '员工成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
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
              this.saveStopData = false
            })
        }
      })
    },
    getUserData (val) {
      this.userStatus = false
      if (val.length > 0) {
        this.dataForm.pru_user_id = parseInt(val[0].id)
        this.userName = val[0].username
      }
    },
    addMember () {
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    delMember () {
      this.member = ''
      this.clientFrom.member_id = 0
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        this.member = val[0].mem_memberName
        this.dataForm.pru_member_id = parseInt(val[0].id)
      }
    },
    hideNowPage () {
      this.addStoreSidebar = false
      this.saveStopData = false
      this.dataId = 0
      this.dataForm = {
        pru_name: '',
        pru_telephone: '',
        pru_status: '1',
        pru_member_id: '',
        pru_user_id: ''
      }
      this.member = ''
      this.userName = ''
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
