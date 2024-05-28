<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">{{ clientFrom.id > 0 ? '修改' : '新增' }}客户信息</div>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-form ref="clientDataRef"  @submit="submitData">
          <q-card-section class="q-pa-sm">
            <div class="row">
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                <q-input label="名称" outlined v-model="clientFrom.ecp_name" dense lazy-rules :rules="[(val) => !!val || '名称是必填的']" />
              </div>
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                <q-select outlined emit-value map-options option-value="id" option-label="ecg_name" v-model="clientFrom.group_id" :options="clientGroupData" dense label="客户组别" />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                <q-input label="客户编号" outlined v-model="clientFrom.ecp_number" dense lazy-rules :rules="[(val) => /^\d+$/.test(val) || '编号为非负整数']">
                  <template v-slot:after>
                    <q-btn color="warning" class="full-width" unelevated label="一键生成编号" @click="math" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                <q-input label="绑定会员" outlined v-model="member" dense disable>
                  <template v-slot:after>
                    <q-btn color="green" @click="addMember" unelevated label="绑定" :disable="clientFrom.member_id > 0" />
                    <q-btn color="red" class=" q-ml-xm" unelevated @click="delMember">解绑</q-btn>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                <q-input label="期初预付款" outlined v-model="clientFrom.ecp_preparatory_fee" dense lazy-rules :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '期初预付款为非负两位以内小数']" />
              </div>
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                <q-input label="期初应付款" outlined v-model="clientFrom.ecp_should_fee" dense lazy-rules :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '期初应付款为非负两位以内小数']" />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-12 q-pr-sm ">
                <hl-address :province="dataFrom.province" :city="dataFrom.city" :area="dataFrom.district" @province="provinceupdate" @city="cityupdate" @area="areaupdate"></hl-address>
              </div>
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs ">
                <q-input label="联系地址" outlined v-model="clientFrom.ecp_address" dense lazy-rules :error="false" />
              </div>
            </div>
            <q-input class=" q-mt-sm q-mb-lg" label="备注" outlined v-model="clientFrom.ecp_remarks" dense type="textarea" />
          </q-card-section>
        </q-form>
        <q-card-actions align="center" class="q-gutter-sm">
          <q-btn unelevated label="确认" color="primary" @click="submitData" class="q-px-xl" :disable="stop" />
          <q-btn label="关闭" unelevated @click="hideNowPage" color="grey" class="q-px-xl" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <hl-choose-manager ref="chooseManagerList" @getChooseManageData="receivingAdministrator"></hl-choose-manager>
  </div>
</template>
<script>
export default {
  name: 'AddClient',
  data () {
    return {
      dialogWidth: '1000px',
      dataId: '',
      isSidebarActiveLocal: false,
      disabledStatus: false,
      localeText: this.$ag_grid_localeText,
      member: '',
      stop: false,
      clientFrom: {
        ecp_name: '',
        ecp_number: '',
        ecp_should_fee: 0,
        ecp_preparatory_fee: 0,
        ecp_address: '',
        ecp_remarks: '',
        group_id: '',
        member_id: 0
      },
      clientGroupData: [],
      dataFrom: {
        province: '',
        city: '',
        district: ''
      }
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + 'px'
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.getGroup()
      this.dataId = id
      this.isSidebarActiveLocal = true
      if (id > 0) {
        this.$store.dispatch('erpCustomer/getItem', this.dataId).then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.clientFrom = res.data
              this.clientFrom.group_id = parseInt(this.clientFrom.group_id)
              const address = this.clientFrom.ecp_address.split('-')
              this.dataFrom.province = address[0]
              this.dataFrom.city = address[1]
              this.dataFrom.district = address[2]
              this.clientFrom.ecp_address = address[3]
              this.member = res.data.member.mem_memberName ? res.data.member.mem_memberName : '会员失效'
            }
          }
        })
      }
    },
    getGroup () {
      const obj = {}
      this.$store.dispatch('erpCustomerGroup/getGroup', obj).then((res) => {
        if (res.code == 200) {
          this.clientGroupData = res.data
        }
      })
    },
    math () {
      this.clientFrom.ecp_number = new Date().getTime().toString()
    },

    submitData () {
      this.$refs.clientDataRef.validate().then((success) => {
        if (success) {
          if (this.clientFrom.group_id == 0) {
            this.$q.notify({
              message: '注意',
              caption: '请选择客户组别！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          this.stop = true
          this.disabledStatus = true
          const address = this.dataFrom.province + '-' + this.dataFrom.city + '-' + this.dataFrom.district + '-' + this.clientFrom.ecp_address
          this.clientFrom.ecp_address = address
          const obj = {
            ...this.clientFrom,
            id: this.dataId
          }
          this.$store.dispatch('erpCustomer/setData', obj).then((res) => {
            if (res.code == 200) {
              this.isSidebarActiveLocal = false
              this.$q.notify({
                message: '成功',
                caption: '操作成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.$nextTick(() => {
                this.disabledStatus = false
                this.hideNowPage()
              })
            } else {
              this.disabledStatus = false
            }
          })
        }
      })
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
        this.clientFrom.member_id = parseInt(val[0].id)
      }
    },

    provinceupdate (a) {
      this.dataFrom.province = a.value
    },
    cityupdate (a) {
      this.dataFrom.city = a.value
    },
    areaupdate (a) {
      this.dataFrom.district = a.value
    },
    hideNowPage () {
      this.$emit('refreshDataList')
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
