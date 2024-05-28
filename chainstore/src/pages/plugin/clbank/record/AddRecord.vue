<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
      class="q-py-md"
    >
      <q-form ref="addRecordRef">
        <div class="row items-center q-pa-none q-px-md">
          <div class="text-subtitle2 q-pr-lg">{{ recordData.id > 0 ? '修改' : '新增' }}记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <q-card-section>
          <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
        </q-card-section>
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input
              outlined
              dense
              :rules="[(val) => !!val || '存入重量单位']"
              readonly
              v-model="recordData.cr_member_card_number"
              label="卡号"
              lazy-rules
            />
          </div>

          <div class="col-6">
            <q-input outlined dense :rules="[(val) => !!val || '请输入昵称']" v-model="recordData.cr_member_name" label="昵称" lazy-rules />
          </div>
          <div class="col-6">
            <q-input
              outlined
              dense
              :rules="[(val) => !!val || '请输入真实姓名']"
              v-model="recordData.cr_member_real_name"
              label="真实姓名"
              lazy-rules
            />
          </div>

          <div class="col-6">
            <q-input outlined dense :rules="[(val) => !!val || '请输入联系电话']" v-model="recordData.cr_member_mobile" label="联系电话" lazy-rules />
          </div>

          <div class="col-6">
            <q-select
              outlined
              dense
              v-model="recordData.cr_unit_id"
              option-value="id"
              option-label="cu_name"
              :options="unitDataList"
              label="请选择材料"
              emit-value
              map-options
              @input="changeUnitList"
              :rules="[(val) => (val && val.length > 0) || '请选择材料']"
            />
          </div>

          <div class="col-6">
            <q-input
              outlined
              dense
              disable
              v-model="recordData.cr_unit"
              label="存入单位"
              lazy-rules
              :rules="[(val) => !!val || '存入重量单位']"
            />
          </div>

          <div class="col-12">
            <q-select
              outlined
              dense
              v-model="recordData.cr_rule_id"
              option-value="id"
              option-label="cr_name"
              :options="ruleDataList"
              label="请选择利息规则"
              emit-value
              map-options
              :rules="[(val) => (val && val.length > 0) || '请选择利息规则']"
            >

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.cr_name }}</q-item-label>
                    <q-item-label caption>
                      {{ '每' + scope.opt.cu_return_period_time + ((parseInt(scope.opt.cu_return_period_property) == 2 || parseInt(scope.opt.cu_return_period_property) == 3) ? '个' : '') + periodTimeObject[scope.opt.cu_return_period_property] }}

                      {{ parseInt(scope.opt.cu_interest_type) == 1 ? '产生固定利息' + scope.opt.cu_interest_fixed_amount : '产生首存重量的' + scope.opt.cu_interest_proportion + '%的利息' }}

                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-6">
            <q-input
              outlined
              dense
              v-model="recordData.cr_init_weight"
              label="首存重量"
              lazy-rules
              :rules="[(val) => /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) || '请输入重量']"
            />
          </div>

          <div class="col-6">

            <q-input outlined dense label="锁定截止时间" v-model="recordData.cr_lock_end_time" readonly :rules="[(val) => !!val || '请选择锁定截止时间']">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="recordData.cr_lock_end_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="recordData.cr_lock_end_time" @click="recordData.cr_lock_end_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="recordData.cr_lock_end_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

        </q-card-section>
        <div align="center" class="q-gutter-sm">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" color="primary" class="q-px-xl" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddRecord',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: true,
      recordData: {
        cr_order_no: '',
        cr_order_number: '',
        cr_order_id: 0,
        cr_rule_id: '',
        cr_member_id: '',
        cr_member_card_number: '',
        cr_member_name: '',
        cr_member_real_name: '',
        cr_member_mobile: '',
        cr_operate_type: 1,
        cr_init_weight: '',
        cr_change_weight: '',
        cr_lock_end_time: '',
        cr_unit_id: '',
        cr_unit: ''
      },
      unitDataList: [],
      ruleDataList: [],
      periodTimeObject: this.$store.state.clbank.periodTimeObject,
      interestTypeObject: this.$store.state.clbank.interestTypeObject
    }
  },
  created () {
    this.getBaseConfigData()
  },
  mounted () {},
  computed: {},
  methods: {
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.addButtonDisabled = false
          this.recordData.cr_member_id = val.id
          this.recordData.cr_member_card_number = val.mem_memberCardNum
          this.recordData.cr_member_name = val.mem_memberName
          this.recordData.cr_member_real_name = val.mem_memberRealName
          this.recordData.cr_member_mobile = val.mem_memberMobile
        }
      }
    },
    getBaseConfigData () {
      this.$store
        .dispatch('clbank/getBaseConfig')
        .then((res) => {
          if (res.code == 200) {
            this.unitDataList = res.data && res.data.unitDataList ? res.data.unitDataList : []
            this.ruleDataList = res.data && res.data.ruleDataList ? res.data.ruleDataList : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 查询寄存记录单条记录
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('hyjc/getRecordItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.recordData = res.data ? res.data : this.recordData
              this.$refs.memberCardReading.getMemberIdReturnData(this.recordData.phr_member_id)
              this.recordData.phr_loop_image = res.data.phr_loop_image ? this.recordData.phr_loop_image.split(',') : []
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    // 新增或修改寄存记录
    setData () {
      this.$refs.addRecordRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.recordData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('clbank/addRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '首存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    changeUnitList (e) {
      const item = _.find(this.unitDataList, function (o) { return parseInt(e) == parseInt(o.id) })
      this.recordData.cr_unit = item.cu_unit
    },

    hideNowPage () {
      this.$emit('dataList')
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
