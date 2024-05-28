<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mb-xs " />
        {{ $route.query.levelId > 0 ? '修改' : '新增' }}等级
      </div>
      <q-card flat class="q-pa-md col-shrink q-pa-sm full-height">
        <q-scroll-area class="fit full-height">
          <q-form ref="levelRefs">
            <div class="row" v-if="defaultLevel == true">
              <div class="col-6 q-pr-md">
                <q-select
                  outlined
                  dense
                  v-model="levelData.pfl_weights"
                  :options="levelOptions"
                  option-disable="disable"
                  label="请选择等级权重"
                  option-label="label"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || '请选择等级权重']"
                />
              </div>
              <div class="col-6 q-pr-sm">
                <q-select outlined dense v-model="levelData.pfl_status" :options="statusOptions" label="状态" option-label="label" emit-value map-options />
              </div>
            </div>
            <div class="row q-mt-xs">
              <div class="col-6 q-pr-md">
                <q-input outlined dense v-model="levelData.pfl_name" label="等级名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
              </div>
              <div class="col-6 q-pr-sm">
                <q-input
                  outlined
                  dense
                  v-model="levelData.pfl_one_fxzx_proportion"
                  label="一级佣金比例"
                  :rules="[(val) => (!val ? '请输入一级佣金比例' : (/^(\d+|\d+\.\d{1})$/.test(val) && parseFloat(val) <= 99.9 && parseFloat(val) >= 0) || '支持0到99.9')]"
                  v-if="1 <= parseInt(configData.pfc_level) && parseInt(configData.pfc_level) <= 3"
                >
                  <template v-slot:append>
                    <q-separator dark color="grey" class="q-mr-sm" vertical />
                    <span class="text-subtitle2 ">%</span>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-mt-xs">
              <div class="col-6 q-pr-md">
                <q-input
                  outlined
                  dense
                  v-model="levelData.pfl_two_fxzx_proportion"
                  label="二级佣金比例"
                  :rules="[(val) => (!val ? '请输入二级佣金比例' : (/^(\d+|\d+\.\d{1})$/.test(val) && parseFloat(val) <= 99.9 && parseFloat(val) >= 0) || '支持0到99.9')]"
                  v-if="2 <= parseInt(configData.pfc_level) && parseInt(configData.pfc_level) <= 3"
                >
                  <template v-slot:append>
                    <q-separator dark color="grey" class="q-mr-sm" vertical />
                    <span class="text-subtitle2 ">%</span>
                  </template>
                </q-input>
              </div>
              <div class="col-6 q-pr-sm">
                <q-input
                  outlined
                  dense
                  v-model="levelData.pfl_three_fxzx_proportion"
                  label="三级佣金比例"
                  :rules="[(val) => (!val ? '请输入三级佣金比例' : (/^(\d+|\d+\.\d{1})$/.test(val) && parseFloat(val) <= 99.9 && parseFloat(val) >= 0) || '支持0到99.9')]"
                  v-if="parseInt(configData.pfc_level) == 3"
                >
                  <template v-slot:append>
                    <q-separator dark color="grey" class="q-mr-sm" vertical />
                    <span class="text-subtitle2 ">%</span>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-mt-xs" v-if="defaultLevel == true">
              <div class="col-6 q-pr-md">
                <q-select outlined dense v-model="levelData.pfl_type" :options="upgradeTypeOptions" label="请选择升级方式" option-label="label" emit-value map-options >
                 <template v-slot:after>
                  <q-btn icon="las la-question-circle" color="warning"  flat unelevated round @click="useCaption = true" >
                  <q-tooltip>升级说明</q-tooltip>
                  </q-btn>
                </template>
                </q-select>
              </div>
            </div>
            <div class="q-mt-xs" v-if="tagList.length > 0 && defaultLevel == true">
              <q-btn
                unelevated
                class="q-mr-sm q-px-sm q-mb-sm q-mt-xs"
                @click="pushSelectedCondition(item)"
                :label="item.label"
                :color="levelData.pfl_upgrade_property.indexOf(item.value) >= 0 ? 'primary' : 'grey'"
                v-for="(item, key) in tagList"
                :key="key"
              >
              </q-btn>
            </div>
            <div class="q-mt-md" v-if="levelData.pfl_upgrade_property.length > 0">
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-md q-gutter-y-xs">
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(1) >= 0"
                    dense
                    label="分销订单总额"
                    v-model="levelData.pfl_order_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入分销订单总额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(1)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(2) >= 0"
                    dense
                    label="分销订单总数"
                    v-model="levelData.pfl_order_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入分销订单总数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">单</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(2)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(3) >= 0"
                    dense
                    label="一级分销订单总额"
                    v-model="levelData.pfl_one_order_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入一级分销订单总额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(3)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(4) >= 0"
                    dense
                    label="一级分销订单总数"
                    v-model="levelData.pfl_one_order_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入一级分销订单总数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">单</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(4)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(5) >= 0"
                    dense
                    label="自购分销订单总额"
                    v-model="levelData.pfl_self_order_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入自购分销订单总额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(5)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(6) >= 0"
                    dense
                    label="自购分销订单总数"
                    v-model="levelData.pfl_self_order_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入自购分销订单总数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">单</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(6)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(7) >= 0"
                    dense
                    label="下线总人数"
                    v-model="levelData.pfl_son_member_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入下线总人数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">人</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(7)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(8) >= 0"
                    dense
                    label="下线分销商人数"
                    v-model="levelData.pfl_son_fxzx_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入下线分销商人数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">人</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(8)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(9) >= 0"
                    dense
                    label="一级下线人数"
                    v-model="levelData.pfl_one_member_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入一级下线人数']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">人</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(9)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(10) >= 0"
                    dense
                    label="一级下线分销商"
                    v-model="levelData.pfl_one_fxzx_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入一级下线分销商']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">人</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(10)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pfl_upgrade_property.indexOf(11) >= 0"
                    dense
                    label="已提现佣金金额"
                    v-model="levelData.pfl_take_fxzx_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入已提现佣金金额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(11)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <div v-if="levelData.pfl_upgrade_property.indexOf(12) >= 0">
                    <div class="row">
                      <q-btn unelevated label="添加指定商品" icon="add" :disable="addButtonDisabled" color="primary" class="q-px-lg" @click="selectBut" />
                      <q-btn unelevated color="red" @click="delSelectData(12)" label="删除" class="q-ml-md q-px-xs" />
                    </div>
                    <q-card flat bordered class="q-pa-md q-mt-sm" v-if="goodsData.length > 0">
                      <div class="row justify-between">
                        <div class="text-subtitle2  q-pl-md">商品</div>
                        <div class="text-subtitle2  q-pr-xl">操作</div>
                      </div>
                      <div v-for="(item, key) in goodsData" :key="key" class="q-mt-sm">
                        <q-separator />
                        <div class="row q-mt-md  q-pl-md q-pr-lg items-center justify-between">
                          <div class="row">
                            <div class="q-ml-md q-mt-sm">
                              {{ item.goodsName }}
                            </div>
                          </div>
                          <div class="q-mr-xs">
                            <q-btn unelevated color="red" @click="delSelectGoodsData(key)" label="删除" class="q-ml-md q-px-xs" />
                          </div>
                        </div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </q-card>
      <q-dialog v-model="useCaption">
        <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.5) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
          height: parseInt(this.$q.screen.width * 0.7) + 'px',
        }">
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll" >
          <div class="col-shrink bg-white row q-px-xs q-pa-sm">
            <div class="text-subtitle1">升级说明</div>
              <q-space />
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
              />
          </div>

            <div class="col-shrink q-pa-sm full-height">
              <q-scroll-area class="fit full-height q-pa-sm">
              <div class="text-subtitle1">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                升级方式说明
              </div>
              <q-separator />
              <div class="text-subtitle1 text-weight-bold text-primary">
                满足任意一种条件
              </div>
              <div class="text-body1">
                分销商满足以下所设任意条件之一，均可升级到当前分销等级。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                满足所选全部条件
              </div>
              <div class="text-body1">
                分销商满足以下所设全部条件，可升级到当前分销等级。
              </div>

                <div class="text-subtitle1 q-mt-sm">
                 <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                升级条件说明
              </div>
                  <q-separator />
              <div class="text-subtitle1  text-weight-bold text-primary">
                分销订单总额
              </div>
              <div class="text-body1">
                分销商通过引导下级消费或自购消费等方式产生的分销订单总额，大于等于设置金额，即满足条件。
              </div>

              <div class="text-subtitle1  text-weight-bold text-primary">
                分销订单总数
              </div>
              <div class="text-body1">
                分销商通过引导下级消费或自购消费等方式产生的分销订单总数，大于等于设置数量，即满足条件。
              </div>
                <div class="text-subtitle1  text-weight-bold text-primary">
                一级分销订单总额
              </div>
              <div class="text-body1">
                所属分销商一级会员消费产生的分销订单总额，大于等于设置金额，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                一级分销订单总数
              </div>
              <div class="text-body1">
                 所属分销商一级会员消费产生的分销订单总数，大于等于设置总数，即满足条件。
              </div>
              <div class="text-subtitle1 text-weight-bold text-primary">
                自购分销订单总额
              </div>
              <div class="text-body1">
               分销商自身消费产生的分销订单总额，大于等于设置总额，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                自购分销订单总数
              </div>
              <div class="text-body1">
                分销商自身消费产生的分销订单总数，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                下线总人数
              </div>
              <div class="text-body1">
                分销商下线（不区分一级、二级、三级）的会员，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                下线分销商人数
              </div>
              <div class="text-body1">
                分销商下线（不区分一级、二级、三级）的分销商，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                一级下线人数
              </div>
              <div class="text-body1">
                分销商一级下线的会员，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                一级下线分销商
              </div>
              <div class="text-body1">
                分销商一级下线的分销商，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                已提现佣金金额
              </div>
              <div class="text-body1">
                分销商通过分销产生的佣金，申请提现并成功到账金额，大于等于设置总额，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                自购指定商品
              </div>
              <div class="text-body1">
                分销商购买设置指定商品（不区分数量、价钱），即满足条件。
              </div>

              </q-scroll-area>
            </div>

            <q-card-actions align="center">
              <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
            </q-card-actions>
        </div>
        </q-card>
      </q-dialog>
      <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated label="保存" :disable="addButtonDisabled" color="primary" class="q-px-xl" @click="setData" />
        <q-btn unelevated label="返回" class="q-px-xl" color="grey" :to="{ name: 'fxzxLevel' }" />
      </div>
    </div>
    <goods-lists ref="goodsListsRef" v-if="goodsListsStatus" @dataList="getSelectedGoodsData"></goods-lists>
  </q-page>
</template>
<script>
import GoodsLists from './components/GoodsLists'
export default {
  name: 'fxzxAddLevel',
  components: { GoodsLists },
  data () {
    return {
      addButtonDisabled: false,
      goodsListsStatus: false,
      configData: {
        pfc_level: ''
      },
      defaultLevel: false,
      levelData: {
        pfl_weights: '',
        pfl_name: '',
        pfl_type: 1,
        pfl_status: 1,
        pfl_upgrade_property: [],
        pfl_buy_goods_status: '',
        pfl_buy_goods_id: [],
        pfl_order_amount: '',
        pfl_order_quantity: '',
        pfl_one_order_amount: '',
        pfl_one_order_quantity: '',
        pfl_self_order_amount: '',
        pfl_self_order_quantity: '',
        pfl_son_member_quantity: '',
        pfl_son_fxzx_quantity: '',
        pfl_one_member_quantity: '',
        pfl_one_fxzx_quantity: '',
        pfl_take_fxzx_amount: ''
      },
      goodsData: [],
      levelOptions: [],
      tagList: this.$store.state.fxzx.tagList,
      statusOptions: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: -1
        }
      ],
      upgradeTypeOptions: [
        {
          label: '满足任意一种条件',
          value: 1
        },
        {
          label: '满足所选全部条件',
          value: 2
        }
      ],
      useCaption: false
    }
  },
  created () {
    this.getConfigList()
    if (!this.levelData.pfl_weights && !this.$route.query.levelId) {
      this.getLevelOption(false)
    }
  },
  mounted () {
    if (parseInt(this.$route.query.levelId) > 0) {
      this.init(this.$route.query.levelId)
    }
  },
  computed: {},
  methods: {
    getConfigList () {
      this.$store
        .dispatch('fxzx/getConfigData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : this.configData
            this.configData.pfc_level = res.data ? parseInt(res.data.pfc_level) : ''
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
    },
    getLevelOption (defaultLevel) {
      const params = {
        weights: this.levelData.pfl_weights,
        default: defaultLevel
      }
      this.$store
        .dispatch('fxzx/getLevelOption', params)
        .then((res) => {
          if (res.code == 200) {
            this.levelOptions = res.data ? res.data.levelOptions : []
            this.defaultLevel = res.data ? res.data.defaultLevel : ''
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
    },
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('fxzx/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.levelData = res.data ? res.data : {}
              this.levelData.pfl_weights = res.data.pfl_weights ? parseInt(res.data.pfl_weights) : ''
              this.levelData.pfl_type = res.data.pfl_type ? parseInt(res.data.pfl_type) : ''
              this.levelData.pfl_status = res.data.pfl_status ? parseInt(res.data.pfl_status) : ''
              this.levelData.pfl_upgrade_property = res.data.pfl_upgrade_property ? res.data.pfl_upgrade_property.split(',').map(Number) : []
              this.levelData.pfl_buy_goods_id = res.data.pfl_buy_goods_id ? res.data.pfl_buy_goods_id.split(',').map(Number) : []
              this.goodsData = res.data.goodsData ? res.data.goodsData : []
              if (parseInt(this.levelData.pfl_weights) == 0) {
                this.getLevelOption(true)
              } else {
                this.getLevelOption(false)
              }
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
          if (this.defaultLevel == true) {
            if (this.levelData.pfl_upgrade_property.length == 0) {
              this.$q.notify({
                message: '失败',
                caption: '请选择升级条件',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              return false
            }
          }
          if (this.goodsData.length == 0 && parseInt(this.levelData.pfl_buy_goods_status) == 1) {
            this.$q.notify({
              message: '失败',
              caption: '请添加指定商品',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          if (this.defaultLevel == false) {
            this.levelData.pfl_weights = 0
          }
          this.addButtonDisabled = true
          const params = {
            ...this.levelData
          }
          this.$store
            .dispatch('fxzx/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.levelData.id > 0 ? '修改' : '新增'}` + '分销等级成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({ name: 'fxzxLevel' })
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
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    // 选中的标签
    pushSelectedCondition (item) {
      const conditionPosition = this.levelData.pfl_upgrade_property.indexOf(item.value)
      if (conditionPosition >= 0) {
        this.levelData.pfl_upgrade_property.splice(conditionPosition, 1)
        if (item.value == 12) {
          this.levelData.pfl_buy_goods_status = -1
          this.goodsData = []
          this.levelData.pfl_buy_goods_id = []
        }
      } else {
        this.levelData.pfl_upgrade_property.unshift(item.value)
        if (item.value == 12) {
          this.levelData.pfl_buy_goods_status = 1
        }
      }
    },
    delSelectData (key) {
      switch (key) {
        case 1:
          this.levelData.pfl_order_amount = ''
          break
        case 2:
          this.levelData.pfl_order_quantity = ''
          break
        case 3:
          this.levelData.pfl_one_order_amount = ''
          break
        case 4:
          this.levelData.pfl_one_order_quantity = ''
          break
        case 5:
          this.levelData.pfl_self_order_amount = ''
          break
        case 6:
          this.levelData.pfl_self_order_quantity = ''
          break
        case 7:
          this.levelData.pfl_son_member_quantity = ''
          break
        case 8:
          this.levelData.pfl_son_fxzx_quantity = ''
          break
        case 9:
          this.levelData.pfl_one_member_quantity = ''
          break
        case 10:
          this.levelData.pfl_one_fxzx_quantity = ''
          break
        case 11:
          this.levelData.pfl_take_fxzx_amount = ''
          break
        case 12:
          this.levelData.pfl_buy_goods_status = -1
          this.goodsData = []
          this.levelData.pfl_buy_goods_id = []
          break
        default:
          return false
      }
      const conditionPosition = this.levelData.pfl_upgrade_property.indexOf(key)
      this.levelData.pfl_upgrade_property.splice(conditionPosition, 1)
    },
    selectBut () {
      this.goodsListsStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.goodsListsRef.getList(this.levelData.pfl_buy_goods_id, this.goodsData)
        }, 500)
      })
    },
    getSelectedGoodsData (selectedGoodsData) {
      if (selectedGoodsData) {
        if (!this.levelData.pfl_buy_goods_id.includes(parseInt(selectedGoodsData.id))) {
          this.goodsData.unshift(selectedGoodsData)
          this.levelData.pfl_buy_goods_id.unshift(parseInt(selectedGoodsData.id))
        }
      }
      this.goodsListsStatus = false
    },
    delSelectGoodsData (key) {
      this.goodsData.splice(key, 1)
      this.levelData.pfl_buy_goods_id.splice(key, 1)
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
