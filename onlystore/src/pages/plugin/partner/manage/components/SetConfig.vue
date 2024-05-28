<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-grey-2">
      <q-scroll-area class="fit full-height">
        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="text-subtitle1">股东合伙人设置</div>
          </q-card-section>
          <q-separator />
          <div class="q-ma-md">
            <div class="row q-mt-sm" v-for="(normItem, normIndex) in partnerItem" :key="normIndex">
              <q-input
                outlined
                dense
                class="col-md-4 col-12"
                label="股金"
                :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的合伙人股金格式']"
                v-model="normItem.ppc_partner_amount"
                placeholder="请输入股东合伙人股金"
              >
                <template slot="append"><span class="text-h6">{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span> </template>
              </q-input>

              <q-input
                outlined
                dense
                class="col-md-4 q-mx-md"
                label="分红比列"
                :rules="[(val) => !!val || '必填项', , (val) => /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/.test(val) || '请输入正确的分红比列']"
                v-model="normItem.ppc_partner_proportion"
                placeholder="请输入分红比列"
              >
                <template slot="append">%</template>
              </q-input>

              <div class="col-md-2 q-pl-none">
                <div @click="deleteSpecification(normIndex, normItem.id)" class="text-h6">
                  ×
                </div>
              </div>
            </div>
            <div class="row q-mt-sm q-ml-xs">
              <q-btn-group unelevated>
                <q-btn color="primary" label="添加" @click="addSpecification" v-if="authorityMeta('addSet')" unelevated icon="las la-plus-square" />
                <q-separator dark vertical />
                <q-btn color="primary" label="保存设置" v-if="authorityMeta('saveSet')" @click="savePartner" icon="las la-edit" />
              </q-btn-group>
            </div>
          </div>
        </q-card>
        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="text-subtitle1">员工合伙人设置</div>
          </q-card-section>
          <q-separator />
          <div class="q-ma-md">
            <div class="row q-mt-sm" v-for="(normItem, normIndex) in staffItem" :key="normIndex">
              <q-input
                outlined
                dense
                label="业绩范围"
                class="col-md-2 col-12"
                :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                v-model="normItem.ppc_staff_min_amount"
                placeholder="请输入业绩范围"
              >
                <template slot="append"><span class="text-h6">{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span></template>
              </q-input>
              <div class="text-h6 q-mx-sm">
                -
              </div>
              <q-input
                outlined
                dense
                class="col-md-2 col-12"
                label="业绩范围"
                :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                v-model="normItem.ppc_staff_max_amount"
                placeholder="请输入业绩范围"
              >
                <template slot="append"><span class="text-h6">{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span></template>
              </q-input>

              <div class="col-4 q-mx-lg">
                <q-input
                  outlined
                  dense
                  label="分红比列"
                  :rules="[(val) => !!val || '必填项', , (val) => /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/.test(val) || '请输入正确的分红比列']"
                  v-model="normItem.ppc_staff_proportion"
                  placeholder="请输入分红比列"
                >
                  <template slot="append">%</template>
                </q-input>
              </div>
              <div class="col-md-2 q-pl-none">
                <div @click="deleteStaff(normIndex, normItem.id)" class="text-h6">
                  ×
                </div>
              </div>
            </div>
            <div class="row q-mt-sm q-ml-xs">
              <q-btn-group unelevated>
                <q-btn color="primary" label="添加" @click="addStaffData" v-if="authorityMeta('addSet')" unelevated icon="las la-plus-square" />
                <q-separator dark vertical />
                <q-btn color="primary" label="保存设置" @click="saveStaff" v-if="authorityMeta('saveSet')" icon="las la-edit" />
              </q-btn-group>
            </div>
          </div>
        </q-card>
      </q-scroll-area>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SetConfig',
  data () {
    return {
      partnerItem: [],
      staffItem: []
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.getPartnerList()
    this.getStaffList()
  },
  methods: {
    getPartnerList () {
      const obj = {
        type: 'partner'
      }
      this.$store
        .dispatch('partner/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.partnerItem = res.data ? res.data : []
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
        })
    },
    getStaffList () {
      const obj = {
        type: 'staff'
      }
      this.$store
        .dispatch('partner/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.staffItem = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    savePartner () {
      const obj = {
        ...this.partnerItem
      }
      this.$store
        .dispatch('partner/setConfigData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存设置成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {})
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
    },
    // 添加
    addSpecification () {
      const layoutArray = this.partnerItem
      const newlayout = {
        ppc_type: 'partner',
        ppc_partner_amount: 0.0,
        ppc_partner_proportion: 0.0
      }
      layoutArray.push(newlayout)
    },
    // 删除
    deleteSpecification (mainKey, id) {
      setTimeout(() => {
        this.partnerItem.splice(mainKey, 1)

        setTimeout(() => {
          if (id > 0) {
            this.deleteConfig(id)
          }
        }, 100)
      }, 100)
    },
    saveStaff () {
      const obj = {
        ...this.staffItem
      }
      this.$store
        .dispatch('partner/setConfigData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存设置成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {})
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
    },
    // 添加
    addStaffData () {
      const layoutArray = this.staffItem
      const newlayout = {
        ppc_type: 'staff',
        ppc_staff_max_amount: 0.0,
        ppc_staff_min_amount: 0.0,
        ppc_staff_proportion: 0.0
      }
      layoutArray.push(newlayout)
    },
    // 删除
    deleteStaff (mainKey, id) {
      setTimeout(() => {
        this.staffItem.splice(mainKey, 1)
        setTimeout(() => {
          if (id > 0) {
            this.deleteConfig(id)
          }
        }, 100)
      }, 100)
    },
    deleteConfig (id) {
      this.$store
        .dispatch('partner/delData', id)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除配置',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getPartnerList()
            this.getStaffList()
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
