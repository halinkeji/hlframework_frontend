<template>
  <q-dialog v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.5) + 'px',
        'max-width': parseInt($q.screen.width * 0.5) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="row items-center q-pb-none">
        {{ dataId > 0 ? '修改' : '新增' }}信息
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </div>

      <q-form ref="InfoDataRef" class="q-gutter-md">
        <div class="col-12 col-md-4 q-px-xs q-pt-md text-center" v-if="!(dataId > 0)">
          <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-6">
            <q-input
              outlined
              dense
              v-model="carInfoData.zi_name"
              label="姓名"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '姓名不能为空']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input outlined dense v-model="carInfoData.zi_nick_name" label="昵称" lazy-rules :error="false" />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              outlined
              dense
              v-model="carInfoData.zi_mobile"
              label="手机号"
              lazy-rules
              :rules="[(val) => /^1[3|4|5|7|8][0-9]{9}$/.test(val) || '请填写正确的手机号']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              outlined
              dense
              v-model="carInfoData.zi_number_plate"
              label="车牌号"
              lazy-rules
              :rules="[
                (val) =>
                  /^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/.test(
                    val
                  ) || '请填写正确的车牌号',
              ]"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              option-value="id"
              option-label="zg_name"
              emit-value
              map-options
              v-model="carInfoData.zi_type_id"
              :options="typeDataList"
              dense
              label="请选择认证类型"
              :rules="[(val) => !!val || '请选择认证类型']"
            />
          </div>
          <div class="col-12">
            <hl-address
              :province="carInfoData.zi_province"
              :city="carInfoData.zi_city"
              :area="carInfoData.zi_district"
              @province="provinceupdate"
              @city="cityupdate"
              @area="areaupdate"
            ></hl-address>
          </div>
          <div class="col-12">
            <q-input outlined dense v-model="carInfoData.zi_detail_address" label="详细地址" lazy-rules :error="false" />
          </div>

          <div class="col-12 col-md-6 text-center">
            <hl-upload
              :multiple="true"
              :maxTotal="5"
              :currentAttach="carInfoData.driverLicenseImage"
              @input="(val)=>{ $nextTick(()=>{ carInfoData.zi_driver_license_image = val })}"
              currentTitle="驾驶证照片"
            />
          </div>
          <div class="col-12 col-md-6 text-center">
            <hl-upload
              :multiple="true"
              :maxTotal="5"
              :currentAttach="carInfoData.carImage"
              @input="(val)=>{ $nextTick(()=>{ carInfoData.zi_car_image = val })}"
              currentTitle="车辆照片"
            />
          </div>
        </div>
        <div class="row text-center q-gutter-sm justify-center">
          <q-btn class="q-px-xl" label="提交" @click="saveData()" color="primary" unelevated />
          <q-btn class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" unelevated />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddCarType',
  data () {
    return {
      uploadImgField: '',
      addStoreSidebar: false,
      dataId: 0,
      typeDataList: [],
      carInfoData: {
        member_id: 0,
        zi_name: '',
        zi_nick_name: '',
        zi_mobile: '',
        zi_number_plate: '',
        zi_type_id: '',
        zi_province: '',
        zi_city: '',
        zi_district: '',
        zi_detail_address: '',
        zi_driver_license_image: '',
        zi_car_image: ''
      }
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {

    init (id) {
      this.getTypeData()
      this.dataId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.$store.dispatch('zcrz/getItemData', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.carInfoData = res.data
          }
        })
      }
    },
    // 获取分类列表，无分页
    getTypeData () {
      const obj = {
        type: 2
      }
      this.$store
        .dispatch('zcrz/getTypeData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typeDataList = res.data
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
    // 提交数据
    saveData () {
      this.$refs.InfoDataRef.validate().then((success) => {
        if (success) {
          if (!this.dataId) {
            if (!this.carInfoData.zi_driver_license_image) {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '请上传驾驶证照片',
                color: 'red'
              })
              return false
            }
            if (!this.carInfoData.zi_car_image) {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '请上车辆照片',
                color: 'red'
              })
              return false
            }
            this.carInfoData.zi_status = 4
          }

          if (parseInt(this.carInfoData.member_id) <= 0) {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '请选择绑定会员',
              color: 'red'
            })
            return false
          }

          const obj = {
            ...this.carInfoData,
            id: this.dataId
          }
          this.$store
            .dispatch('zcrz/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}车辆认证信息成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addStoreSidebar = false
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
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

    hideNowPage () {
      this.addStoreSidebar = false
      this.$emit('getMethods')
    },
    provinceupdate (a) {
      this.carInfoData.zi_province = a.value
    },

    cityupdate (a) {
      this.carInfoData.zi_city = a.value
    },

    areaupdate (a) {
      this.carInfoData.zi_district = a.value
    },
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.carInfoData.member_id = val.id
          this.judgeOnlyMember(val.id)
        }
      }
    },

    judgeOnlyMember (memberId) {
      this.$store.dispatch('zcrz/judgeOnlyMember', { memberId }).then((res) => {
        if (res.code != 200) {
          this.$q.notify({
            message: '失败',
            caption: res.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.carInfoData.member_id = 0
          this.$refs.memberCardReading.emptyMemberCardInfo()
        }
      })
    }
  }
}
</script>
