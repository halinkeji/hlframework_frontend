<template>
  <q-dialog v-model="dialogShow" width="80%">
    <q-card style="width: 1000px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dataId ? '修改' : '新增' }}股东</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="clearFields" />
      </q-card-section>

      <q-card-section>
        <q-form ref="memberDataRef" class="q-gutter-md">
          <div class="col-md-12 col-12 q-pl-sm">
            <q-input outlined dense label="绑定会员" maxlength="9" v-model="member" readonly class="q-pb-md">
              <template v-slot:after>
                <q-btn color="green" @click="addMember" unelevated label="绑定" :disable="dataForm.member_id > 0" />
                <q-btn color="red" class=" q-ml-xm" unelevated @click="delMember">解绑</q-btn>
              </template>

              <template v-slot:hint> 点击图标按钮绑定会员 </template>
            </q-input>
            <q-input
              outlined
              bottom-slots
              label="股东手机号"
              v-model="dataForm.ppi_member_mobile"
              dense
              placeholder="请输入股东手机号"
              :rules="[(val) => /^1[3|4|5|7|8][0-9]{9}$/.test(val) || '请输入正确的手机号码', (val) => !!val || '股东手机号为必填项']"
            />
            <q-input
              outlined
              bottom-slots
              label="股东姓名"
              v-model="dataForm.ppi_partner_name"
              dense
              lazy-rules
              :rules="[(val) => !!val || '股东姓名是必填']"
              placeholder="请输入股东姓名"
            >
            </q-input>

            <q-select
              outlined
              dense
              label="选择合伙人级别"
              v-model="dataForm.ppi_level_id"
              :options="levelList"
              option-value="id"
              option-label="ppl_name"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || '合伙人级别必填项']"
            />
            <q-input
              class="col-md-6 col-12 q-pr-xs"
              outlined
              v-model="dataForm.ppi_partner_end_time"
              label="有效期至"
              dense
              readonly
              square
              :rules="[(val) => !!val || '有效期是必填']"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                    <q-date v-model="dataForm.ppi_partner_end_time" mask="YYYY-MM-DD" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-menu>
                </q-icon>
              </template>
            </q-input>
            <template-components ref="formFieldRef" @saveSuccess="saveData"></template-components>
          </div>
          <hl-choose-manager ref="chooseManagerList" @getChooseManageData="receivingAdministrator"></hl-choose-manager>
        </q-form>
      </q-card-section>
      <q-card-actions align="center" class="q-pb-md text-center q-gutter-sm">
        <q-btn label="确定" @click="setData()" color="primary" class="q-px-xl" :disable="memberStatus" unelevated />
        <q-btn label="取消" @click="clearFields()" class="q-px-xl" color="grey" unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import TemplateComponents from '@/pages/plugin/formfield/TemplateComponents.vue'
export default {
  name: 'AddPartner',
  components: { TemplateComponents },
  data () {
    return {
      dialogShow: false,
      memberStatus: false,
      dataId: '',
      member: '',
      levelList: [],
      dataForm: {
        ppi_member_mobile: '',
        ppi_member_card_num: '',
        ppi_partner_name: '',
        ppi_type: 'partner',
        ppi_member_proportion: '0.00',
        ppi_partner_end_time: '',
        ppi_status: 1
      },
      configData: {}
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    getLevelList () {
      const params = {
        type: 3
      }
      this.$store
        .dispatch('partner/getLevelList', params)
        .then((res) => {
          if (res.code == 200) {
            this.levelList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getConfig () {
      this.$store
        .dispatch('partner/getData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.configData = res.data ? res.data : this.configData
              this.$nextTick(() => {
                this.$refs.formFieldRef.getList({
                  formId: this.configData.ppc_form_id,
                  memberId: this.dataForm.member_id
                })
              })
            }
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
    setData () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          if (this.configData.ppc_form_id > 0) {
            this.$nextTick(() => {
              this.$refs.formFieldRef.setData()
            })
            return false
          }
          this.saveData()
        }
      })
    },
    init (id) {
      this.getLevelList()
      this.getConfig()
      this.dialogShow = true
      if (id > 0) {
        this.dataId = id
        this.$store.dispatch('partner/getMemberItem', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.dataForm = res.data ? res.data : {}
            this.dataForm.ppi_partner_end_time = this.$q_date.formatDate(this.dataForm.ppi_partner_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            this.member = res.data.member ? res.data.member.mem_memberName : ''
            setTimeout(() => {
              if (this.configData.ppc_form_id > 0) {
                this.$nextTick(() => {
                  this.$refs.formFieldRef.getList({
                    formId: this.configData.ppc_form_id,
                    memberId: this.dataForm.member_id,
                    templateId: this.dataForm.ppi_form_id
                  })
                })
              }
            }, 100)
          }
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
        .dispatch('partner/checkMemberrData', {
          member_id: item.id
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '可以绑定',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.dataForm.ppi_member_name = item.mem_memberName
            this.dataForm.member_id = item.id
            this.dataForm.ppi_member_card_num = item.mem_memberCardNum
            this.member = item.mem_memberName
          }
          if (res.code == 400) {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            this.dataForm.ppi_member_card_num = ''
            this.member = ''
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    delMember () {
      this.member = ''
      this.dataForm.ppi_member_name = ''
      this.dataForm.member_id = 0
      this.dataForm.ppi_member_card_num = ''
    },
    saveData (res) {
      const endTime = parseInt(this.$q_date.formatDate(this.dataForm.ppi_partner_end_time, 'X'))
      const timestamp = new Date().getTime() / 1000
      if (endTime <= timestamp) {
        this.$q.notify({
          message: '保存失败',
          caption: '有效期应大于当前时间，请重新选择！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.memberStatus = true
      this.dataForm.ppi_form_id = res || 0
      const obj = {
        ...this.dataForm,
        ppi_partner_end_time: endTime,
        id: this.dataId
      }
      this.$store
        .dispatch('partner/setMemberData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: `${this.dataId > 0 ? '修改' : '新增'}` + '股东成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {
              this.clearFields()
            })
          } else {
            this.memberStatus = false
            this.$q.notify({
              message: '操作失败',
              caption: '保存失败',
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
    },
    clearFields () {
      this.dialogShow = false
      this.memberStatus = false
      this.dataForm = {
        ppi_member_mobile: '',
        ppi_member_card_num: '',
        ppi_partner_name: '',
        ppi_type: 'partner',
        ppi_member_proportion: '0.00',
        ppi_partner_end_time: '',
        ppi_status: 1
      }
      this.dataId = 0
      this.member = ''
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
