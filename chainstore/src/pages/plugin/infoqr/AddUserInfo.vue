<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ qrUserId ? '修改' : '新增' }}用户信息</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="modifyRef">
              <!-- 顶部导航 -->

              <div class="q-pa-sm row q-col-gutter-sm">
                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">编号 <span class="text-negative">*</span></div>
                  <q-input bottom-slots dense v-model="userInfo.piu_number" outlined class="text-subtitle1" readonly>
                    <!-- <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_number" />
                    </template> -->
                  </q-input>
                </div>

                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">姓名 <span class="text-negative">*</span></div>
                  <q-input outlined bottom-slots v-model="userInfo.piu_name" dense :rules="[(val) => !!val || '请填写姓名']">
                    <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_name" />
                    </template>
                  </q-input>
                </div>
                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">联系电话 <span class="text-negative">*</span></div>
                  <q-input outlined bottom-slots v-model="userInfo.piu_phone_number" dense :rules="[(val) => !!val || '请填写联系电话']">

                  </q-input>
                </div>

                <!-- <q-select outlined dense v-model="userInfo.piu_age" :options="ageOptions"  label="年龄" emit-value map-options /> -->

                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">年龄 <span class="text-negative">*</span></div>
                  <q-input outlined bottom-slots v-model="userInfo.piu_age" dense :rules="[(val) => !!val || '请填写年龄']">
                    <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_age" />
                    </template>
                  </q-input>
                </div>

                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">性别 <span class="text-negative">*</span></div>
                  <q-select
                    outlined
                    dense
                    v-model="userInfo.piu_sex"
                    :options="sexOptions"
                    emit-value
                    map-options
                    :rules="[(val) => !!val || '请选择性别']"
                  >
                    <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_sex" />
                    </template>
                  </q-select>
                </div>

                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">身份证号 <span class="text-negative">*</span></div>
                  <q-input outlined bottom-slots v-model="userInfo.piu_card_id" dense :rules="[(val) => !!val || '请填写身份证号']">
                    <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_card_id" />
                    </template>
                  </q-input>
                </div>

                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">联系地址 <span class="text-negative">*</span></div>
                  <q-input outlined v-model="userInfo.piu_address" dense lazy-rules :rules="[(val) => !!val || '请填写联系地址']">
                    <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_address" />
                    </template>
                  </q-input>
                </div>
                <!-- 紧急联系人 -->

                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">既往病史</div>
                  <q-input outlined bottom-slots type="textarea" v-model="userInfo.piu_medical_history">
                    <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_medical_history" />
                    </template>
                  </q-input>
                </div>
                <div class="col-md-6 col-12">
                  <div class="text-body2 q-pa-xs">备注</div>
                  <q-input outlined bottom-slots type="textarea" v-model="userInfo.piu_note">
                    <template v-slot:append>
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_note" />
                    </template>
                  </q-input>
                </div>
              </div>

              <q-card bordered flat>
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">紧急联系人</div>
                      <div class="text-subtitle2">至少填写一个紧急联系人</div>
                    </div>
                    <div class="col-auto">
                      <q-checkbox v-model="userInfo.piu_show_field" val="piu_urgent" />
                    </div>

                    <div class="col-auto">
                      <q-btn color="primary" @click="addUrgent" label="添加联系人" unelevated icon="las la-plus"> </q-btn>
                    </div>
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section>
                  <div class="row q-col-gutter-sm items-center" v-for="(item, key) in userInfo.piu_urgent">
                    <div class="col-auto">
                      <div class="text-body2 q-pa-xs">紧急联系人姓名 <span class="text-negative">*</span></div>
                      <q-input outlined bottom-slots v-model="item.name" dense :rules="[(val) => !!val || '请填写紧急联系人姓名']"> </q-input>
                    </div>

                    <div class="col-auto">
                      <div class="text-body2 q-pa-xs">联系方式</div>
                      <q-input outlined bottom-slots dense v-model="item.model"> </q-input>
                    </div>

                    <div class="col-auto">
                      <div class="text-body2 q-pa-xs">与用户关系</div>
                      <q-input outlined bottom-slots dense v-model="item.link"> </q-input>
                    </div>

                    <div class="col-2">
                      <q-btn color="negative" @click="deleteUrgent(key)" label="删除联系人" unelevated> </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-form>
          </q-scroll-area>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'infoqrIndex',
  data () {
    return {
      addButtonDisabled: false,
      userInfo: {
        id: '',
        piu_name: '',
        piu_age: '',
        piu_sex: '男',
        piu_card_id: '',
        piu_address: '',
        piu_medical_history: '',
        piu_note: '',
        piu_urgent: [],
        piu_show_field: [],
        piu_phone_number: ''
      },
      sexOptions: ['男', '女'],
      // ageOptions: [
      //   { label: '未知', value: '0' },
      //   { label: '男', value: '1' },
      //   { label: '女', value: '2' }
      // ],
      linkOptions: ['夫妻', '父亲', '母亲', '姐妹', '兄弟', '祖孙'],
      // address: '',

      dialogStatus: false,
      qrUserId: 0
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (qrUserId) {
      this.dialogStatus = true
      if (qrUserId > 0) {
        this.qrUserId = qrUserId
        this.getItem()
      }
    },
    getItem () {
      this.$store.dispatch('infoqr/getUserItemData', { id: this.qrUserId }).then((res) => {
        if (res.code == 200) {
          this.userInfo = res.data ? res.data : {}
        }
      })
    },
    saveData () {
      if (this.userInfo && this.userInfo.piu_urgent && this.userInfo.piu_urgent.length < 1) {
        this.$q.notify({
          message: '失败',
          caption: '至少填写一个紧急联系人',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })

        return false
      }

      this.$refs.modifyRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.userInfo
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('infoqr/setUserData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '修改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })

                this.hideNowPage()
                this.addButtonDisabled = false
              } else {
                this.addButtonDisabled = false
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
            .catch((err) => {
              this.addButtonDisabled = false
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    deleteUrgent (key) {
      if (this.userInfo && this.userInfo.piu_urgent) {
        this.userInfo.piu_urgent.splice(key, 1)
      }
    },
    addUrgent () {
      if (this.userInfo && this.userInfo.piu_urgent && this.userInfo.piu_urgent.length < 3) {
        this.userInfo.piu_urgent.push({
          name: '',
          model: '',
          link: ''
        })
      }
    },
    hideNowPage () {
      this.$emit('dataList')
    },
    provinceupdate (a) {
      this.userInfo.province = a.value
      this.userInfo.province_id = a.code
    },
    cityupdate (a) {
      this.userInfo.city = a.value
      this.userInfo.city_id = a.code
    },
    areaupdate (a) {
      this.userInfo.district = a.value
      this.userInfo.district_id = a.code
    }
  }
}
</script>
