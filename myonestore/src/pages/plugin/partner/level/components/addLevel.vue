<template>
  <q-page class="fit">
    <div
      class="
        fit
        column
        no-wrap
        justify-between
        items-stretch
        content-stretch
        no-scroll
      "
    >
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mb-xs" />
        {{ $route.query.id > 0 ? '修改' : '新增' }}等级
      </div>
      <q-card flat class="q-pa-md col-shrink q-pa-sm full-height">
        <q-scroll-area class="fit full-height">
          <q-form ref="levelRefs">
            <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
              <div class="q-pa-xs">
                <div class="text-subtitle2">基本信息</div>
              </div>
              <q-separator />
              <div class="row q-pt-md ">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="levelData.ppl_name" label="等级名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-select
                    outlined
                    dense
                    v-model="levelData.ppl_status"
                    :options="statusOptions"
                    label="状态"
                    option-label="label"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-6 q-pr-md">
                  <q-select
                    outlined
                    dense
                    v-model="levelData.ppl_type"
                    :options="typeOptions"
                    :disable="$route.query.id > 0 ? true : false"
                    label="级别类别"
                    option-label="label"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-6 q-pr-sm" v-if="levelData.ppl_type == 1">
                  <q-select
                    outlined
                    dense
                    v-model="levelData.ppl_upgrade_property"
                    :options="upgradeTypeOptions"
                    label="请选择升级方式"
                    option-label="label"
                    emit-value
                    map-options
                  >
                    <!-- <template v-slot:after>
                      <q-btn icon="las la-question-circle" color="warning" flat unelevated round @click="useCaption = true">
                        <q-tooltip>升级说明</q-tooltip>
                      </q-btn>
                    </template> -->
                  </q-select>
                </div>
              </div>
            </q-card>
            <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm" v-if="levelData.ppl_type != 3">
              <div class="q-pa-xs">
                <div class="text-subtitle2">升级方式</div>
              </div>
              <q-separator />

              <div class="row q-pt-md" v-if="levelData.ppl_upgrade_property == '1'">
                <div class="col-6 q-pr-md">
                  <q-input
                    outlined
                    dense
                    v-model="levelData.ppl_all_member_quantity"
                    label="推荐所有会员数"
                    lazy-rules
                    :rules="[(val) => !!val || '请输入推荐所有会员数', (val) => /^[0-9]\d*$/.test(val) || '请输入正确的数量']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">人</span>
                    </template></q-input
                  >
                </div>
                <div class="col-6 q-pr-md">
                  <q-input
                    outlined
                    dense
                    v-model="levelData.ppl_pay_member_quantity"
                    label="推荐付费会员累计数"
                    lazy-rules
                    :rules="[(val) => !!val || '请输入推荐付费会员累计数', (val) => /^[0-9]\d*$/.test(val) || '请输入正确的数量']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">人</span>
                    </template></q-input
                  >
                </div>
                <div class="col-6 q-pr-md" v-if="levelData.ppl_type == 1">
                  <q-input
                    outlined
                    dense
                    v-model="levelData.ppl_one_consume_full_amount"
                    label="单次消费满金额"
                    lazy-rules
                    :rules="[
                      (val) => !!val || '请输入单次消费满金额',
                      (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '单次消费满金额为非负两位以内小数',
                    ]"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">{{
                        $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template></q-input
                  >
                </div>
                <div class="col-6 q-pr-md" v-if="levelData.ppl_type == 1">
                  <q-input
                    outlined
                    dense
                    v-model="levelData.ppl_one_recharge_full_amount"
                    label="单次充值满金额"
                    lazy-rules
                    :rules="[
                      (val) => !!val || '请输入单次充值满金额',
                      (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '单次充值满金额为非负两位以内小数',
                    ]"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">{{
                        $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template></q-input
                  >
                </div>
                <div class="col-6 q-pr-md">
                  <q-input
                    outlined
                    dense
                    v-model="levelData.ppl_member_pay_amount"
                    label="付费会员累计金额"
                    lazy-rules
                    :rules="[(val) => !!val || '请输入付费会员累计金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '累计金额为非负两位以内小数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">{{
                        $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template></q-input
                  >
                </div>
              </div>
              <div class="row q-pt-md" v-if="levelData.ppl_upgrade_property == '2'">
                <div class="col-6 q-pr-md">
                  <q-input
                    outlined
                    dense
                    v-model="levelData.ppl_pay_amount"
                    label="付费金额"
                    lazy-rules
                    :rules="[(val) => !!val || '请输入付费金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '付费金额为非负两位以内小数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">{{
                        $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template></q-input
                  >
                </div>
              </div>
            </q-card>
            <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm" v-if="levelData.ppl_type != '2'">
              <div class="q-pa-xs">
                <div class="text-subtitle2">分红设置</div>
              </div>
              <q-separator />
              <div class="row q-pt-md ">
                <div class="col-6 q-pr-md" v-if="levelData.ppl_type == '3'">
                  <q-input
                    outlined
                    dense
                    class="col-md-4 col-12"
                    label="股金"
                    :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的股金格式']"
                    v-model="levelData.ppl_partner_amount"
                    placeholder="请输入股东股金"
                  >
                    <template slot="append"
                      ><span class="text-h6">{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-6 q-pr-md">
                  <q-input
                    outlined
                    dense
                    v-model="levelData.ppl_partner_proportion"
                    label="分红比率"
                    lazy-rules
                    :rules="[(val) => !!val || '必填项', , (val) => /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/.test(val) || '请输入正确的分红比列']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">%</span>
                    </template></q-input
                  >
                </div>
              </div>
            </q-card>
            <q-card flat bordered class="q-mt-md" v-if="levelData.ppl_type == '2'">
              <q-card-section>
                <div class="text-subtitle1">员工分红设置</div>
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
                    <template slot="append"
                      ><span class="text-h6">{{
                        $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span></template
                    >
                  </q-input>
                  <div class="text-h6 q-mx-sm">-</div>
                  <q-input
                    outlined
                    dense
                    class="col-md-2 col-12"
                    label="业绩范围"
                    :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                    v-model="normItem.ppc_staff_max_amount"
                    placeholder="请输入业绩范围"
                  >
                    <template slot="append"
                      ><span class="text-h6">{{
                        $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span></template
                    >
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
                  </q-btn-group>
                </div>
              </div>
            </q-card>
          </q-form>
        </q-scroll-area>
      </q-card>
      <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated label="保存" :disable="addButtonDisabled" color="primary" class="q-px-xl" @click="setData" />
        <q-btn unelevated label="返回" class="q-px-xl" color="grey" :to="{ name: 'partnerLevel' }" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'partnerAddLevel',
  components: {},
  data () {
    return {
      useCaption: false,
      addButtonDisabled: false,
      staffItem: [],
      configData: {
        pmc_level: ''
      },
      levelData: {
        ppl_name: '',
        ppl_type: '1',
        ppl_status: '1',
        ppl_upgrade_property: '1',
        ppl_all_member_quantity: '0',
        ppl_pay_member_quantity: '0',
        ppl_member_pay_amount: '0',
        ppl_partner_proportion: '0',
        ppl_one_consume_full_amount: '0.00',
        ppl_one_recharge_full_amount: '0.00',
        ppl_partner_amount: '0'
      },
      levelOptions: [],
      statusOptions: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '-1'
        }
      ],
      typeOptions: [
        {
          label: '会员',
          value: '1'
        },
        {
          label: '员工',
          value: '2'
        },
        {
          label: '股东',
          value: '3'
        }
      ],

      upgradeTypeOptions: [
        {
          label: '条件升级',
          value: '1'
        },
        {
          label: '付费升级',
          value: '2'
        }
      ]
    }
  },
  created () {},
  mounted () {
    if (parseInt(this.$route.query.id) > 0) {
      this.init(this.$route.query.id)
    }
  },
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('partner/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.levelData = res.data ? res.data : {}
              this.staffItem = res.data.levelBind ? res.data.levelBind : []
            } else {
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
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setData () {
      this.$refs.levelRefs.validate().then((success) => {
        if (success) {
          // if (this.levelData.pml_upgrade_property.length == 0) {
          //   this.$q.notify({
          //     message: "失败",
          //     caption: "请选择升级条件",
          //     color: "red",
          //     icon: "ion-close-circle-outline",
          //     timeout: 500,
          //     position: "top-right",
          //   });
          //   return false;
          // }
          this.addButtonDisabled = true
          const params = {
            ...this.levelData,
            staffItem: this.staffItem
          }
          this.$store
            .dispatch('partner/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.levelData.id > 0 ? '修改' : '新增'}` + '等级成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({ name: 'partnerLevel' })
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
        }
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
      }, 100)
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
