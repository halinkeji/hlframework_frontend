<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pa-none q-pa-xs">
        <div class="text-subtitle2">{{ dataId ? '修改' : '新增' }}员工</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>
      <q-separator />

      <q-form ref="newsDataRef" class="row q-pa-sm">
        <div class="col-12">
          <q-input outlined dense label="员工名称" :rules="[(val) => !!val || '必填项']" v-model="dataForm.pru_name" placeholder="请输入员工">
            <template v-slot:hint> 填写员工名称 </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            outlined
            dense
            label="员工电话"
            :rules="[(val) => !!val || '请填写员工电话', (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确']"
            v-model="dataForm.pru_telephone"
            placeholder="请输入员工电话"
          >
            <template v-slot:hint> 填写员工电话 </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-select
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

        <div class="col-12">
          <q-select
            outlined
            label="职位"
            bottom-slots
            v-model="dataForm.position_id"
            :options="positionListData"
            dense
            emit-value
            map-options
            option-label="prp_name"
            option-value="id"
          >
            <template v-slot:hint> 员工状态 </template>
          </q-select>
        </div>

        <div class="col-12">
          <q-input outlined bottom-slots dense label="绑定会员" maxlength="9" v-model="member" readonly>
            <template v-slot:append>
              <q-btn color="primary" icon="search" dense flat @click="addMember" />
            </template>
            <template v-slot:hint> 点击图标按钮绑定会员 </template>
          </q-input>
        </div>

        <div class="col-12">
          <q-input outlined bottom-slots dense label="绑定操作员" v-model="userName" readonly>
            <template v-slot:append>
              <q-btn color="primary" icon="search" dense flat @click="selectUser" />
            </template>
            <template v-slot:hint> 点击图标按钮绑定操作员 </template>
          </q-input>
        </div>
      </q-form>
      <div class="row q-gutter-sm text-center justify-center q-my-sm">
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
  components: {
    SelectUser
  },
  data () {
    return {

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
      member: '',
      positionListData: []
    }
  },
  created () {},
  mounted () {

  },
  computed: {},
  methods: {
    getUser (id) {
      this.addStoreSidebar = true
      this.getPositionList()
      if (id > 0) {
        this.dataId = id
        this.$store.dispatch('commonReward/getUserItem', id).then((res) => {
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
    getPositionList () {
      this.$store.dispatch('commonReward/getPositionList').then((res) => {
        if (res.code == 200 && res.data) {
          this.positionListData = res.data ? res.data : []
        }
      })
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.saveStopData = true

          const obj = {
            ...this.dataForm,
            id: this.dataId
          }
          this.$store
            .dispatch('commonReward/setUserData', obj)
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
                this.addStoreSidebar = false
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
    selectUser () {
      this.userStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.selectUserRef.getUser()
        }, 500)
      })
    },
    addMember () {
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },

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
