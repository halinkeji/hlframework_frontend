<template>
  <q-page class="fit">
    <q-form ref="vipDataRef" class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row">
          <q-tabs
            v-model="activeName"
            class="bg-white"
            active-color="primary"
            indicator-color="primary"
            align="left"
            content-class="text-grey-9"
            narrow-indicator
            dense
          >
            <q-tab name="basicSettings" label="基础设置"></q-tab>
            <q-tab name="upgrade" v-if="isDefaultStatus" label="升级奖励"></q-tab>
            <q-tab name="service" v-if="memberCardLevelData.mcl_type == 'default' && isDefaultStatus" label="管理费规则"></q-tab>

            <q-tab name="deduct" v-if="memberCardLevelData.mcl_type == 'default' && isDefaultStatus" label="成长值扣除"></q-tab>
          </q-tabs>
        </div>

        <div class="q-px-sm" v-show="activeName == 'upgrade'">
          <div class="row">
            <q-input
              class="col-12 col-md-4 q-pr-md"
              :label="'赠送' + `${$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit}`"
              outlined
              v-model="memberCardLevelData.mcl_gift_point"
              dense
              lazy-rules
              :rules="[
                (val) =>
                  /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                  '赠送' + `${$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit}` + '为非负两位以内小数',
              ]"
            />

            <q-input
              class="col-12 col-md-4 q-pr-md"
              :label="`赠送${$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
              outlined
              v-model="memberCardLevelData.mcl_gift_money"
              dense
              lazy-rules
              :rules="[
                (val) =>
                  /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                  '赠送' + $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit + '为非负两位以内小数',
              ]"
            />
          </div>
        </div>

        <div v-show="activeName == 'service'">
          <q-form ref="managementDataRef" class="q-gutter-md">
            <div class="row q-pl-xs">
              <q-select
                class="col-3 col-md-2 q-mr-lg"
                outlined
                map-options
                emit-value
                lazy-rules
                :error="false"
                v-model="management.lsr_cycle"
                :options="cycle"
                dense
                @input="specificTime = ''"
              />
              <q-select
                v-if="management.lsr_cycle == '3'"
                class="col-3 col-md-2 q-mr-lg"
                outlined
                map-options
                emit-value
                lazy-rules
                :error="false"
                v-model="management.lsr_week"
                :options="week"
                dense
              />

              <q-input
                v-if="[1, 4, 5].indexOf(parseInt(management.lsr_cycle)) > -1"
                outlined
                v-model="specificTime"
                label="具体时间"
                dense
                readonly
                lazy-rules
                :error="false"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                      <q-date
                        v-model="specificTime"
                        minimal
                        :mask="
                          parseInt(management.lsr_cycle) == 1
                            ? 'YYYY-MM-DD HH:mm:ss'
                            : parseInt(management.lsr_cycle) == 4
                            ? 'DD HH:mm'
                            : 'MM-DD HH:mm'
                        "
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-menu>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                      <q-time
                        v-model="specificTime"
                        :mask="
                          parseInt(management.lsr_cycle) == 1
                            ? 'YYYY-MM-DD HH:mm:ss'
                            : parseInt(management.lsr_cycle) == 4
                            ? 'DD HH:mm'
                            : 'MM-DD HH:mm'
                        "
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-time>
                    </q-menu>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                lazy-rules
                :error="false"
                v-if="management.lsr_cycle == '2' || management.lsr_cycle == '3'"
                outlined
                v-model="specificTime"
                label="具体时间"
                dense
                readonly
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                      <q-time v-model="specificTime" mask=" HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-time>
                    </q-menu>
                  </q-icon>
                </template>
              </q-input>

              <p class="q-pt-sm q-mr-sm q-ml-sm">自动</p>
              <q-select
                class="col-3 col-md-2 q-mr-lg"
                outlined
                map-options
                lazy-rules
                :error="false"
                emit-value
                v-model="management.lsr_deduct_type"
                :options="deductionmethod"
                dense
              />
              <q-input
                v-if="management.lsr_deduct_type == '2'"
                class="col-3 col-md-2 q-mr-lg"
                :label="'扣除' + `${$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit}`"
                outlined
                v-model="management.lsr_deduct_amount"
                dense
                lazy-rules
                :rules="[
                  (val) =>
                    /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                    '扣除' + `${$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit}` + '为非负两位以内小数',
                ]"
              />
              <q-input
                v-if="management.lsr_deduct_type == '1'"
                class="col-3 col-md-2 q-mr-lg"
                label="扣除金额"
                outlined
                v-model="management.lsr_deduct_amount"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '扣除金额为非负两位以内小数']"
              />
              <q-btn label="添加" unelevated @click="submitManagemnetData" color="primary" class="q-mb-lg" />
            </div>
          </q-form>
        </div>

        <div class="row q-gutter-sm items-start" v-show="activeName == 'deduct'">

            <div class="col-2">
              <q-input label="周期内未消费" hint="例：7天内未消费" outlined v-model="deductRuleForm.ldr_cycle_number"  dense lazy-rules />
            </div>

            <div class="col-2">
              <q-select
                label="扣除周期"
                outlined
                map-options
                emit-value
                lazy-rules
                :error="false"
                v-model="deductRuleForm.ldr_cycle_type"
                :options="deductCycleTypeData"
                dense
              />
            </div>
            <div class="col-2">
              <q-select
                label="扣除类型"
                outlined
                map-options
                emit-value
                lazy-rules
                :error="false"
                v-model="deductRuleForm.ldr_type"
                :options="deductTypeData"
                dense
              />
            </div>

            <div class="col-2">
              <q-input label="扣除成长值"  outlined v-model="deductRuleForm.ldr_deduct_grow_rate" dense lazy-rules />
            </div>

            <q-btn label="添加" unelevated @click="addDeductRule" color="primary" />

        </div>
      </div>
      <div class="col-shrink q-px-xs full-height bg-white q-mt-xs" v-show="activeName == 'basicSettings'">
        <q-scroll-area class="fit full-height">
          <q-card flat class="row justify-start">
            <div class="q-pa-sm col-md-6 col-12">
              <div class="text-subtitle2 q-pa-xs"><q-icon name="las la-square" color="primary"></q-icon> 会员卡级别基础设置</div>
              <q-separator class="q-my-xs" />
              <div class="row">
                <div class="col-md-12 col-12 q-pr-xs">
                  <q-input
                    label="级别名称"
                    outlined
                    v-model="memberCardLevelData.mcl_level_name"
                    dense
                    lazy-rules
                    :rules="[(val) => val.length > 0 || '级别名称是必填']"
                  />
                </div>

                <div class="col-8 q-pr-sm q-pb-md">

                   <hl-editor
                    @change="
                      (v) => {
                        memberCardLevelData.mcl_explanation = v;
                      }
                    "
                    :content="memberCardLevelData.mcl_explanation"
                    titleText="权益说明"
                    :minHeight="$q.screen.height * 0.2"
                  ></hl-editor>

                </div>
                <div class="col-md-4 col-12 q-pr-xs text-center">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="memberCardLevelData.coverImage"
                    @input="
                      (val) => {
                        $nextTick(() => {
                          memberCardLevelData.mcl_cover_image = val;
                        });
                      }
                    "
                    currentDescription="建议尺寸比例4:3"
                    currentTitle="卡面"
                  />
                </div>
              </div>

              <div class="text-subtitle2 q-pa-xs q-mt-sm" v-if="isDefaultStatus"><q-icon name="las la-square" color="primary"></q-icon> 权益设置</div>
              <q-separator class="q-my-xs" />
              <div class="row" v-if="isDefaultStatus">
                <div class="col-md-6 col-6 q-pr-xs">
                  <q-select
                    outlined
                    map-options
                    emit-value
                    v-model="memberCardLevelData.mcl_type"
                    :options="[
                      { label: '默认', value: 'default' },
                      { label: '付费', value: 'pay' },
                    ]"
                    lazy-rules
                    dense
                    label="级别类型"
                    :disable="memberCardLevelData.id ? true : false"
                  >
                  </q-select>
                </div>
              </div>
              <div class="row q-mt-sm q-col-gutter-xs" v-if="memberCardLevelData.mcl_type == 'pay'">
                <div class="col-md-6 col-6">
                  <q-input
                    label="售卡金额"
                    outlined
                    v-model="memberCardLevelData.mcl_card_price"
                    dense
                    lazy-rules
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '售卡金额为非负两位以内小数']"
                  />
                </div>

                <div class="col-md-6 col-6">
                  <q-select
                    outlined
                    map-options
                    emit-value
                    v-model="memberCardLevelData.mcl_time_type"
                    :options="timeType"
                    lazy-rules
                    dense
                    label="到期时间"
                    @input="inputEndTimeType"
                  >
                  </q-select>
                </div>

                <div class="row full-width q-col-gutter-xs" v-if="memberCardLevelData.mcl_time_type == '2'">
                  <q-input
                    class="col-md-6 col-12"
                    outlined
                    v-model="level_start_time"
                    label="开始时间"
                    dense
                    readonly
                    :rules="[(val) => !!val || '请选择开始时间']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-menu :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-date v-model="level_start_time" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-menu :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-time v-model="level_start_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input
                    class="col-md-6 col-12"
                    outlined
                    v-model="level_end_time"
                    label="结束时间"
                    dense
                    readonly
                    :rules="[(val) => !!val || '请选择结束时间']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-menu :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-date v-model="level_end_time" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-menu :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-time v-model="level_end_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                  <div class="text-caption text-light-blue">请点击日历与时钟图标选择日期与时间</div>
                </div>

                <div class="row full-width q-col-gutter-xs" v-if="memberCardLevelData.mcl_time_type == '3'">
                  <q-input
                    label="购买后"
                    outlined
                    v-model="memberCardLevelData.mcl_start_time"
                    dense
                    lazy-rules
                    class="col-md-4 col-12"
                    :rules="[(val) => /^\d+$/.test(val) || '购买期限为非负整数']"
                  />
                  <q-select
                    class="col-md-8 col-12"
                    outlined
                    map-options
                    emit-value
                    v-model="memberCardLevelData.mcl_end_time"
                    :options="time"
                    lazy-rules
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请选择时间类型']"
                    dense
                  >
                    <template v-slot:after>
                      <span class="text-body2 text-black">内有效</span>
                    </template>
                  </q-select>
                  <div class="text-caption text-light-blue">获得级别权限起计算。例如购买后 '1' '天' ,结束时间为当天的第二天的当前时间。</div>
                </div>
              </div>
            </div>
          </q-card>
        </q-scroll-area>
      </div>
      <div class="col-shrink q-px-xs full-height bg-white q-mt-xs" v-show="activeName == 'upgrade'">
        <upgrade-bind
          @setCouponData="setCouponData"
          @setGoodsCountData="setGoodsCountData"
          @setGoodsTimeData="setGoodsTimeData"
          ref="upgradeBindRef"
        />
      </div>
      <div class="col-shrink q-px-xs full-height bg-white q-mt-xs q-pt-sm" v-show="activeName == 'service'">
        <q-table
          separator="cell"
          :pagination="{
            rowsPerPage: 0,
          }"
          hide-bottom
          flat
          bordered
          :data="serviceRuleData"
          :columns="columnDefs"
          row-key="name"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="rule" :props="props">
                {{ serviceRuleText(props.row) }}
              </q-td>

              <q-td key="id" :props="props">
                <q-btn color="negative" @click="deleteServiceRule(props.rowIndex)" unelevated label="删除" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="col-shrink q-px-xs full-height bg-white q-mt-xs q-pt-sm" v-show="activeName == 'deduct'">
        <q-table
          separator="cell"
          :pagination="{
            rowsPerPage: 0,
          }"
          hide-bottom
          flat
          bordered
          :data="deductRuleData"
          :columns="deductColumnDefs"
          row-key="name"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="rule" :props="props">
                {{ deductRuleText(props.row) }}
              </q-td>

              <q-td key="id" :props="props">
                <q-btn color="negative" @click="deleteDeductRule(props.rowIndex)" unelevated label="删除" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn label="提交" unelevated @click="submitData" color="primary" class="q-px-xl" />
        <q-btn label="返回" unelevated :to="{ name: 'memberCardLevel' }" color="grey" class="q-px-xl" />
      </div>
    </q-form>
  </q-page>
</template>
<script>
import UpgradeBind from './UpgradeBind.vue'
export default {
  name: 'AddVip',
  components: {
    UpgradeBind
  },
  data () {
    return {
      activeName: 'basicSettings',
      uploadImgStatus: false,
      componentsAg: {},
      delIds: [],
      gridOptions: {},
      context: null,
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          name: 'rule',
          label: '管理费规则',
          align: 'center',
          field: 'id'
        },
        { name: 'id', align: 'center', label: '操作', field: 'id' }
      ],

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      timeType: [
        // {
        //   label: '永久有效',
        //   value: '1'
        // },
        {
          label: '相对有效',
          value: '3'
        },
        {
          label: '指定时间',
          value: '2'
        }
      ],
      multiple: false,
      memberCardLevelData: {
        mcl_type: 'default',
        mcl_gift_point: '0.00',
        mcl_gift_money: 0,
        mcl_level_name: '',
        mcl_explanation: '',
        mcl_start_time: 1,
        mcl_card_price: 0,
        mcl_time_type: '2',
        mcl_cover_image: '',
        mcl_end_time: 0,
        mcl_sort: 0,
        mcl_default: 1,
        mcl_quiet_warning_days: ''
      },
      management: {
        level_id: 0,
        lsr_cycle: '1',
        lsr_week: '1',
        lsr_time: '',
        lsr_deduct_type: '1',
        lsr_deduct_amount: 0
      },
      time: [
        { label: '年', value: '1' },
        { label: '季度', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '日', value: '5' }
      ],
      cycle: [
        { label: '一次性', value: '1' },
        { label: '每天', value: '2' },
        { label: '每周', value: '3' },
        { label: '每月', value: '4' },
        { label: '每年', value: '5' }
      ],
      week: [
        { label: '星期一', value: '1' },
        { label: '星期二', value: '2' },
        { label: '星期三', value: '3' },
        { label: '星期四', value: '4' },
        { label: '星期五', value: '5' },
        { label: '星期六', value: '6' },
        { label: '星期日', value: '7' }
      ],
      deductionmethod: [
        { label: '扣除' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit, value: '1' },
        { label: '扣除' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit, value: '2' },
        { label: this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit + '清零', value: '3' },
        { label: this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit + '清零', value: '4' }
      ],

      level_start_time: '',
      level_end_time: '',
      specificTime: '',
      bindGiveCoupon: [],
      bindGiveGoodsCount: [],
      bindGiveGoodsTime: [],
      serviceRuleData: [],
      isDefaultStatus: true,

      deductTypeData: this.$store.state.level.deductTypeData,
      deductTypeObject: this.$store.state.level.deductTypeObject,
      deductCycleTypeData: this.$store.state.level.deductCycleTypeData,
      deductCycleTypeObject: this.$store.state.level.deductCycleTypeObject,

      deductRuleForm: {
        ldr_type: '',
        ldr_cycle_type: '',
        ldr_cycle_number: '',
        ldr_deduct_grow_rate: '',
        ldr_status: 1,
        ldr_level_id: ''
      },
      deductColumnDefs: [
        {
          name: 'rule',
          label: '规则说明',
          align: 'center',
          field: 'id'
        },

        { name: 'id', align: 'center', label: '操作', field: 'id' }
      ],
      deductRuleData: []
    }
  },
  computed: {},
  created () {
    this.context = this
    if (this.$route.query.id > 0) {
      this.getData()
    } else {
      this.getDefaultLevelOne()
    }
  },
  watch: {},
  mounted () {},
  methods: {
    getDefaultLevelOne () {
      this.$store
        .dispatch('level/getDefaultLevelOne', this.$route.query.id)
        .then((res) => {
          if (res.code == 200) {
            if (!(res.data && res.data.id)) {
              this.isDefaultStatus = false
            }
          }
        })
        .catch((error) => {})
    },

    getData () {
      this.$store
        .dispatch('level/getItem', this.$route.query.id)
        .then((res) => {
          if (res.code == 200) {
            this.memberCardLevelData = res.data.item

            this.memberCardLevelData.mcl_time_type = String(this.memberCardLevelData.mcl_time_type)
            if (this.memberCardLevelData.mcl_time_type == 3) {
              this.memberCardLevelData.mcl_end_time = this.memberCardLevelData.mcl_end_time.toString()
            } else if (this.memberCardLevelData.mcl_time_type == 2) {
              this.level_start_time = this.$q_date.formatDate(this.memberCardLevelData.mcl_start_time * 1000, 'YYYY-MM-DD HH:mm:ss')
              this.level_end_time = this.$q_date.formatDate(this.memberCardLevelData.mcl_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            }

            if (res.data && res.data.bindGiveCoupon && res.data.bindGiveCoupon.length > 0) {
              this.bindGiveCoupon = res.data.bindGiveCoupon
              this.$refs.upgradeBindRef.setBindGiveCoupon(this.bindGiveCoupon)
            }
            if (res.data && res.data.bindGiveGoodsCount && res.data.bindGiveGoodsCount.length > 0) {
              this.bindGiveGoodsCount = res.data.bindGiveGoodsCount

              this.$refs.upgradeBindRef.setBindGiveGoodsCount(this.bindGiveGoodsCount)
            }
            if (res.data && res.data.bindGiveGoodsTime && res.data.bindGiveGoodsTime.length > 0) {
              this.bindGiveGoodsTime = res.data.bindGiveGoodsTime

              this.$refs.upgradeBindRef.setBindGiveGoodsTime(this.bindGiveGoodsTime)
            }

            if (this.memberCardLevelData && parseInt(this.memberCardLevelData.mcl_default) == 1) {
              this.isDefaultStatus = false
            }

            this.serviceRuleData = res.data && res.data.serviceRuleData ? res.data.serviceRuleData : []

            this.deductRuleData = res.data && res.data.deductRuleData ? res.data.deductRuleData : []
          }
        })
        .catch((error) => {})
    },

    serviceRuleText (item) {
      let data = ''

      if (item.lsr_cycle == 1) {
        data = this.$q_date.formatDate(item.lsr_time * 1000, 'YYYY-MM-DD  HH:mm')
      } else if (item.lsr_cycle == 2) {
        data += '每天'
        data += this.$q_date.formatDate(item.lsr_time * 1000, ' HH:mm')
      } else if (item.lsr_cycle == 3) {
        data += '每'
        data += this.week[parseInt(item.lsr_week) - 1].label + this.$q_date.formatDate(item.lsr_time * 1000, '  HH:mm')
      } else if (item.lsr_cycle == 4) {
        data += '每月'
        data += this.$q_date.formatDate(item.lsr_time * 1000, 'D日  HH:mm')
      } else if (item.lsr_cycle == 5) {
        data += '每年'
        data += this.$q_date.formatDate(item.lsr_time * 1000, 'MM月D日  HH:mm')
      }

      data += ', ' + this.deductionmethod[parseInt(item.lsr_deduct_type) - 1].label

      if (item.lsr_deduct_type == 1) {
        data += item.lsr_deduct_amount + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneyUnit
      }
      if (item.lsr_deduct_type == 2) {
        data += item.lsr_deduct_amount + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit
      }

      return data
    },

    deleteServiceRule (key) {
      if (key > -1) {
        this.serviceRuleData.splice(key, 1)
      }
    },

    inputEndTimeType () {
      if (parseInt(this.memberCardLevelData.mcl_time_type) == 3) {
        this.memberCardLevelData.mcl_start_time = 1
        this.memberCardLevelData.mcl_end_time = '1'
      }
      if (parseInt(this.memberCardLevelData.mcl_time_type) == 2) {
        this.level_start_time = ''
        this.level_end_time = ''
      }
    },

    submitManagemnetData () {
      if (!this.specificTime) {
        this.$q.notify({
          message: '注意',
          caption: '请选择具体时间！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.$refs.managementDataRef.validate().then((success) => {
        if (success) {
          if (
            this.formatAmount(this.management.lsr_deduct_amount) <= 0 &&
            (parseInt(this.management.lsr_deduct_type) == 1 || parseInt(this.management.lsr_deduct_type) == 2)
          ) {
            this.$q.notify({
              message: '注意',
              caption: '扣除的应大于0！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          let endSpecificTime = ''
          const specificTime = this.specificTime
          if (parseInt(this.management.lsr_cycle) == 1) {
            endSpecificTime = this.$q_date.formatDate(specificTime, 'X')
            const nowDate = this.$q_date.formatDate(new Date(), 'X')
            if (endSpecificTime < nowDate) {
              this.$q.notify({
                message: '失败',
                caption: '具体时间不得大于当前时间,请重新选择',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
              this.specificTime = ''
              return false
            }
            endSpecificTime = specificTime
          }

          if ([2, 3].indexOf(parseInt(this.management.lsr_cycle)) > -1) {
            endSpecificTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD') + specificTime
          }
          if (parseInt(this.management.lsr_cycle) == 4) {
            endSpecificTime = this.$q_date.formatDate(new Date(), 'YYYY-MM-') + specificTime
          }
          if (parseInt(this.management.lsr_cycle) == 5) {
            endSpecificTime = this.$q_date.formatDate(new Date(), 'YYYY-') + specificTime
          }

          this.management.lsr_time = this.$q_date.formatDate(endSpecificTime, 'X')
          this.management.id = 0
          this.serviceRuleData.push(this.management)

          this.$nextTick(() => {
            this.resetManageRule()
          })
        }
      })
    },

    resetManageRule () {
      this.management = {
        lsr_cycle: '1',
        lsr_week: '1',
        lsr_time: '',
        lsr_deduct_type: '1',
        lsr_deduct_amount: 0,
        id: 0
      }
      this.specificTime = ''
    },

    submitData () {
      this.$refs.vipDataRef.validate().then((success) => {
        if (success) {
          if (parseInt(this.memberCardLevelData.mcl_time_type) == 1) {
            this.memberCardLevelData.mcl_start_time = parseInt(new Date().getTime() / 1000)
            this.memberCardLevelData.mcl_start_time = 2147457847
          } else if (parseInt(this.memberCardLevelData.mcl_time_type) == 2) {
            const startTime = this.$q_date.formatDate(this.level_start_time, 'X')
            const endTime = this.$q_date.formatDate(this.level_end_time, 'X')
            if (startTime >= endTime) {
              this.$q.notify({
                message: '注意',
                caption: '开始时间不能大于等于结束时间！',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
              return false
            }
            this.memberCardLevelData.mcl_start_time = startTime
            this.memberCardLevelData.mcl_end_time = endTime
          }

          const obj = {
            id: this.$route.query.id,
            ...this.memberCardLevelData,
            delIds: this.delIds,
            bindGiveCoupon: this.bindGiveCoupon,
            bindGiveGoodsCount: this.bindGiveGoodsCount,
            bindGiveGoodsTime: this.bindGiveGoodsTime,
            serviceRuleData: this.serviceRuleData,
            deductRuleData: this.deductRuleData
          }

          this.$store
            .dispatch('level/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.$route.query.id > 0 ? '修改' : '新增'}` + '会员级别信息成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$router.push({ name: 'memberCardLevel' })
              } else {
                this.$q.notify({
                  message: '注意',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
                return false
              }
            })
            .catch((error) => {})
        }
      })
    },

    deductRuleText (row) {
      return row.ldr_cycle_number + this.deductCycleTypeObject[parseInt(row.ldr_cycle_type)] + '内' + this.deductTypeObject[parseInt(row.ldr_type)] + '扣除' + row.ldr_deduct_grow_rate + '成长值'
    },

    addDeductRule () {
      if (!(this.deductRuleForm && this.deductRuleForm.ldr_cycle_type)) {
        this.$q.notify({
          message: '注意',
          caption: '请选择扣除周期时间',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      if (!(this.deductRuleForm && this.deductRuleForm.ldr_cycle_number)) {
        this.$q.notify({
          message: '注意',
          caption: '请选择扣除周期',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      if (!(this.deductRuleForm && this.deductRuleForm.ldr_type)) {
        this.$q.notify({
          message: '注意',
          caption: '请选择扣除类型',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      if (!(this.deductRuleForm && this.deductRuleForm.ldr_deduct_grow_rate)) {
        this.$q.notify({
          message: '注意',
          caption: '请输入扣除成长值',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.deductRuleData.push(this.deductRuleForm)

      this.deductRuleForm = {
        ldr_type: '',
        ldr_cycle_type: '',
        ldr_cycle_number: '',
        ldr_deduct_grow_rate: '',
        ldr_status: 1,
        ldr_level_id: ''
      }
    },

    deleteDeductRule (key) {
      if (key > -1) {
        this.deductRuleData.splice(key, 1)
      }
    },

    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    setCouponData (val) {
      this.bindGiveCoupon = val
    },
    setGoodsCountData (val) {
      this.bindGiveGoodsCount = val
    },
    setGoodsTimeData (val) {
      this.bindGiveGoodsTime = val
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
