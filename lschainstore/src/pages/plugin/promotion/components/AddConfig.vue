<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-grey-3">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        促销方案{{ $route.query.type == 'edit' ? '编辑' : '新增' }}
        <q-tabs v-model="tab" indicator-color="primary" class="text-grey-8 bg-white q-py-sm" align="left" dense>
          <q-tab name="1" label="基本信息" />
          <q-tab name="2" label="促销模式" />
          <q-tab name="3" label="例外商品" v-if="dataForm.ppi_discounts_scope != 4" />
        </q-tabs>
      </div>
      <div class="col-shrink full-height bg-white q-pa-sm q-mt-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="configDataRef">
            <div v-show="tab == '1'" class="q-py-xs">
              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="q-pa-xs">
                  <div class="text-subtitle2">基本信息</div>
                </div>
                <q-separator />
                <div class="row q-mt-sm">
                  <div class="col-4 q-px-lg">
                    <q-input
                      v-model="dataForm.ppi_name"
                      outlined
                      bottom-slots
                      dense
                      label="促销名称*"
                      :rules="[(val) => !!val || '促销名称是必填项']"
                    ></q-input>
                  </div>
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-input
                      v-model="dataForm.ppi_number"
                      outlined
                      bottom-slots
                      dense
                      label="方案编号"
                      readonly
                      :rules="[(val) => !!val || '方案编号是必填项']"
                    >
                      <template v-slot:after>
                        <q-btn unelevated color="blue-6" @click="oneKeyGenerateCode()" label="一键生成方案编号" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-select
                      outlined
                      v-model="dataForm.ppi_status"
                      map-options
                      emit-value
                      dense
                      option-label="label"
                      option-value="value"
                      :options="[
                        {
                          label: '开启',
                          value: '1',
                        },
                        {
                          label: '关闭',
                          value: '0',
                        },
                      ]"
                      :rules="[(val) => !!val || '状态是必填项']"
                      label="方案状态"
                    />
                  </div>
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-select
                      outlined
                      v-model="dataForm.ppi_online_status"
                      map-options
                      emit-value
                      dense
                      option-label="label"
                      option-value="value"
                      :options="[
                        {
                          label: '是',
                          value: '1',
                        },
                        {
                          label: '否',
                          value: '0',
                        },
                      ]"
                      label="是否线上可用"
                    />
                  </div>
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-select
                      outlined
                      v-model="dataForm.ppi_offline_status"
                      map-options
                      emit-value
                      dense
                      option-label="label"
                      option-value="value"
                      :options="[
                        {
                          label: '是',
                          value: '1',
                        },
                        {
                          label: '否',
                          value: '0',
                        },
                      ]"
                      label="是否线下可用"
                    />
                  </div>
                </div>
                <div class="row q-mt-xs q-my-sm">
                  <div class="col-md-12 col-12 q-px-lg">
                    <q-input outlined bottom-slots v-model="dataForm.ppi_note" dense :rows="2" label="促销摘要" type="textarea"></q-input>
                  </div>
                </div>
              </q-card>

              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="q-pa-xs">
                  <div class="text-subtitle2">促销档期</div>
                </div>
                <q-separator />
                <div class="row q-mt-sm items-center">
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-select
                      class="q-my-sm"
                      outlined
                      v-model="dataForm.ppi_time_id"
                      :options="timeData"
                      option-value="id"
                      option-label="ppt_name"
                      option-disable="inactive"
                      emit-value
                      map-options
                      dense
                      label="请选择促销档期"
                      @input="selectTime"
                    />
                  </div>
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-input outlined class="q-my-sm" v-model="startTime" label="开始时间" dense square readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm" today-btn>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="关闭" color="primary" flat />
                              </div>
                            </q-date>
                          </q-menu>
                        </q-icon>
                      </template>
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-slot:hint> 选择促销开始时间 </template>
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-input class="q-my-sm" outlined v-model="endTime" label="结束时间" dense square readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm" today-btn>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="关闭" color="primary" flat />
                              </div>
                            </q-date>
                          </q-menu>
                        </q-icon>
                      </template>
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-slot:hint> 选择促销结束时间 </template>
                    </q-input>
                  </div>

                  <div class="col-md-4 col-12 q-px-lg">
                    <q-select
                      outlined
                      v-model="dataForm.ppi_special_date"
                      map-options
                      emit-value
                      dense
                      option-label="label"
                      option-value="value"
                      :options="[
                        {
                          label: '不限制',
                          value: '1',
                        },
                        {
                          label: '限星期',
                          value: '2',
                        },
                        {
                          label: '限日期',
                          value: '3',
                        },
                      ]"
                      label="特殊日期"
                    />
                  </div>

                  <div class="col-md-8 col-12 q-px-lg" v-if="dataForm.ppi_special_date == 2">
                    <q-option-group v-model="week_limit" :options="weekOptions" color="primary" inline type="checkbox" dense />
                  </div>
                  <div class="col-md-8 col-12 q-px-lg" v-if="dataForm.ppi_special_date == 3">
                    <q-select
                      label="每月"
                      v-model="month_limit"
                      multiple
                      emit-value
                      clearable
                      map-options
                      use-chips
                      stack-label
                      dense
                      outlined
                      :options="monthOptions"
                    />
                  </div>
                </div>
              </q-card>

              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="q-pa-xs">
                  <div class="text-subtitle2">促销范围</div>
                </div>
                <q-separator />
                <div class="row q-mt-sm">
                  <div class="col-md-12 col-12 q-px-lg">
                    <q-select
                      label="可用商户"
                      v-model="store_limit"
                      option-value="id"
                      option-label="name"
                      @input="selectStore"
                      multiple
                      emit-value
                      map-options
                      use-chips
                      stack-label
                      dense
                      outlined
                      hint=" 可用商户，如不选则不限制"
                      :options="libInStoreList"
                    >
                    </q-select>
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col-md-12 col-12 q-px-lg">
                    <span>限制级别</span>
                    <q-option-group v-model="leve_limit" :options="memberCardLevelDatas" color="primary" inline type="checkbox" dense />
                  </div>
                </div>
              </q-card>
            </div>
            <div v-show="tab == '2'" class="q-py-xs">
              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="row q-col-gutter-x-xs q-col-gutter-y-md text-center q-pl-lg">
                  <span>模式选择：</span>
                  <q-radio dense v-model="dataForm.ppi_discounts_model" val="1" label="折扣" />
                  <q-radio dense v-model="dataForm.ppi_discounts_model" val="2" label="特价" />
                  <q-radio dense v-model="dataForm.ppi_discounts_model" val="3" label="满减满送" />
                  <q-checkbox v-model="dataForm.ppi_blend" label="混合促销" true-value="1" false-value="0" />
                </div>
                <q-separator class="q-my-sm" />
                <div class="row q-col-gutter-x-xs q-col-gutter-y-lg text-center q-pl-lg">
                  <span>折扣范围：</span>
                  <q-radio dense v-model="dataForm.ppi_discounts_scope" val="1" @input="changScope(1)" label="全场" v-if="dataForm.ppi_blend == 0" />
                  <q-radio dense v-model="dataForm.ppi_discounts_scope" @input="changScope(2)" val="2" label="类别" />
                  <q-radio dense v-model="dataForm.ppi_discounts_scope" @input="changScope(3)" val="3" label="品牌" />
                  <q-radio dense v-model="dataForm.ppi_discounts_scope" @input="changScope(4)" val="4" label="商品" />
                </div>

                <div class="q-pa-md">
                  <q-list>
                    <div v-if="dataForm.ppi_discounts_model == '1'">
                      <div v-if="dataForm.ppi_blend == 1">
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="1" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【直接折扣(混合)】</q-item-label>
                            <q-item-label caption>针对选择的范围，进行直接折扣，例如：全场打95折、某一类别\品牌打9折、特定商品打8折。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="2" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满多少金额折扣(混合)】</q-item-label>
                            <q-item-label caption>
                              针对选择的范围，买满多少金额进行折扣，例如：全场买满100元打95折、某一类别\品牌买满100元 打9折、特定商品买满100元打8折。
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="3" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【任选折(混合)】</q-item-label>
                            <q-item-label caption>买满任意数量享受不同折扣，例如：某几个类别\品牌\商品任选2件8折，任选3件7折。 </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                      <div v-else>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="1" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【直接折扣】</q-item-label>
                            <q-item-label caption>针对选择的范围，进行直接折扣，例如：全场打95折、某一类别\品牌打9折、特定商品打8折。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="2" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满多少金额折扣】</q-item-label>
                            <q-item-label caption>
                              针对选择的范围，买满多少金额进行折扣，例如：全场买满100元打95折、某一类别\品牌买满100元 打9折、特定商品买满100元打8折。
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="3" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【件数折】</q-item-label>
                            <q-item-label caption
                              >针对选择的范围，买满多少数量进行折扣，例如：全场买满10个打95折、某一类别\品牌买满10个打9
                              折、特定商品买满10个打8折。编码重复录入，即可实现量贩促销。
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                    </div>
                    <div v-if="dataForm.ppi_discounts_model == '2'">
                      <div v-if="dataForm.ppi_blend == 1">
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="1" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【直接特价(混合)】</q-item-label>
                            <q-item-label caption> 选择的商品直接特价。 </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="2" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【件数特价(混合)】</q-item-label>
                            <q-item-label caption> 选择的商品买满一定数量时执行新价格，例如：原价150元的玉兰油买满2瓶则每瓶特价140元。 </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="3" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【偶数特价(混合)】</q-item-label>
                            <q-item-label caption>
                              选择的商品购买数量为双数时，对逢偶数的商品做特价优惠，而逢奇数的商品保持原价，
                              例如：原价50的饮料买第一杯原价，第二杯特价，第三杯原价，第四杯特价，以此类推。
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="5" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【任意选（混合）】</q-item-label>
                            <q-item-label caption>任意选择N件M元，比如某个类别的商品任意选择3件100元。 </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                      <div v-else>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="1" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【直接特价】</q-item-label>
                            <q-item-label caption> 选择的商品直接特价。 </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="2" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【件数特价】</q-item-label>
                            <q-item-label caption> 选择的商品买满一定数量时执行新价格，例如：原价150元的玉兰油买满2瓶则每瓶特价140元。 </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="3" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【偶数特价】</q-item-label>
                            <q-item-label caption>
                              选择的商品购买数量为双数时，对逢偶数的商品做特价优惠，而逢奇数的商品保持原价，
                              例如：原价50的饮料买第一杯原价，第二杯特价，第三杯原价，第四杯特价，以此类推。
                            </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item tag="label" v-ripple v-if="dataForm.ppi_discounts_scope == '4'">
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="4" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【条件组合特价】</q-item-label>
                            <q-item-label caption> 设定组合商品特价销售 </q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="5" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【任意选】</q-item-label>
                            <q-item-label caption> 根据指定范围，任意选择N件M元，比如某个类别的商品任意选择3件100元。 </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                    </div>
                    <div v-if="dataForm.ppi_discounts_model == '3'">
                      <div v-if="dataForm.ppi_blend == 1">
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="1" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满N元减M元(倍数减)（混合）】</q-item-label>
                            <q-item-label caption> 买满一定金额，减一定金额，按倍数减，例如买满100减20，那么买满200减20*2。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="2" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满N元减M元（混合）】</q-item-label>
                            <q-item-label caption> 买满一定金额，减一定金额，固定直减，例如买满100减10，那么买满200还是减10。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="3" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满N元加M元送商品（混合）】</q-item-label>
                            <q-item-label caption>
                              买满一定金额，加一定金额，赠送商品，例如买满100元加10元送商品A或者B，加20元送商品C或者D。
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="4" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满多少个商品送赠品（混合）】</q-item-label>
                            <q-item-label caption> 买满一定数量，赠送商品，例如买1个牙膏送赠品A或者B，买2个牙膏送赠品A或者B。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="5" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满多少个商品送低价商品（混合）】</q-item-label>
                            <q-item-label caption> 买满一定数量的商品送低价商品，如：买5送2，赠送最低价的那2个商品。 </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                      <div v-else>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="1" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满N元减M元(倍数减)】</q-item-label>
                            <q-item-label caption> 买满一定金额，减一定金额，按倍数减，例如买满100减20，那么买满200减20*2。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="2" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满N元减M元】</q-item-label>
                            <q-item-label caption> 买满一定金额，减一定金额，固定直减，例如买满100减10，那么买满200还是减10。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="3" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满N元加M元送商品】</q-item-label>
                            <q-item-label caption>
                              买满一定金额，加一定金额，赠送商品，例如买满100元加10元送商品A或者B，加20元送商品C或者D。
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="4" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满多少个商品送赠品】</q-item-label>
                            <q-item-label caption> 买满一定数量，赠送商品，例如买1个牙膏送赠品A或者B，买2个牙膏送赠品A或者B。 </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                          <q-item-section avatar>
                            <q-radio v-model="dataForm.ppi_discounts_type" val="5" color="primary" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>【买满多少个商品送低价商品】</q-item-label>
                            <q-item-label caption> 买满一定数量的商品送低价商品，如：买5送2，赠送最低价的那2个商品。 </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                    </div>
                  </q-list>
                </div>
              </q-card>
              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="text-h6 q-pa-xs q-pl-lg">促销明细</div>
                <q-separator />
                <div class="row q-py-lg q-px-md q-col-gutter-md" v-if="dataForm.ppi_discounts_scope == '1'">
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_discounts_model == '1'">
                    <div class="row q-mt-md q-ml-xs" v-if="dataForm.ppi_discounts_type != '1'">
                      <q-btn-group unelevated>
                        <q-btn color="primary" label="添加明细" @click="addSpecification" unelevated icon="las la-plus-square" />
                      </q-btn-group>
                    </div>
                    <div class="row" v-for="(item, normIndex) in detailData" :key="normIndex">
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '2'">
                        <q-input
                          v-model="item.ppd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          v-model="item.ppd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="item.ppd_discounts"
                          outlined
                          bottom-slots
                          dense
                          label="折扣"
                          placeholder="请输入折扣"
                          lazy-rules
                          :rules="[
                            (val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式',
                            (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                          ]"
                        >
                          <template v-slot:append> % </template>
                          <template v-slot:hint> 范围：大于等于0，小于等于100，保留小数点后两位 </template>
                        </q-input>
                      </div>
                      <div class="col-md-1" v-if="dataForm.ppi_discounts_type != '1'">
                        <div class="q-pl-none q-mt-lg">
                          <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_discounts_model == '2'">
                    <div class="row q-mt-md q-ml-xs" v-if="dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '5'">
                      <q-btn-group unelevated>
                        <q-btn color="primary" label="添加明细" @click="addSpecification" unelevated icon="las la-plus-square" />
                      </q-btn-group>
                    </div>

                    <div class="row" v-for="(item, normIndex) in detailData" :key="normIndex">
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '5'">
                        <q-input
                          v-model="item.ppd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="item.ppd_special_price"
                          outlined
                          bottom-slots
                          dense
                          label="金额"
                          placeholder="请输入金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-1" v-if="dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '5'">
                        <div class="q-pl-none q-mt-lg">
                          <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_discounts_model == '3'">
                    <div class="row q-mt-md q-ml-xs">
                      <q-btn-group unelevated>
                        <q-btn color="primary" label="添加明细" @click="addSpecification" unelevated icon="las la-plus-square" />
                      </q-btn-group>
                    </div>
                    <div class="row" v-for="(item, normIndex) in detailData" :key="normIndex">
                      <div
                        class="col-md-5 col-12"
                        v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '3'"
                      >
                        <q-input
                          v-model="item.ppd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '4' || dataForm.ppi_discounts_type == '5'">
                        <q-input
                          v-model="item.ppd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '5'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="item.ppd_minus_amount"
                          outlined
                          bottom-slots
                          dense
                          label="赠送数量"
                          placeholder="请输入赠送数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置赠送数量']"
                        />
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="item.ppd_minus_amount"
                          outlined
                          bottom-slots
                          dense
                          label="减去金额"
                          placeholder="请输入减去金额"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置减去金额']"
                        />
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="item.ppd_special_price"
                          outlined
                          bottom-slots
                          dense
                          label="增加金额"
                          placeholder="请输入金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置增加金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '增加金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-1">
                        <div class="q-pl-none q-mt-lg">
                          <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row q-py-lg q-px-md q-col-gutter-md" v-if="dataForm.ppi_discounts_scope == '2'">
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '1'">
                    <div class="row">
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '2'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_discounts"
                          outlined
                          bottom-slots
                          dense
                          label="折扣"
                          placeholder="请输入折扣"
                          lazy-rules
                          :rules="[
                            (val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式',
                            (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                          ]"
                        >
                          <template v-slot:append> % </template>
                          <template v-slot:hint> 范围：大于等于0，小于等于100，保留小数点后两位 </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '2'">
                    <div class="row">
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '5'||dataForm.ppi_discounts_type == '2'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_special_price"
                          outlined
                          bottom-slots
                          dense
                          label="特价金额"
                          placeholder="请输入特价金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置特价金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '特价金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '3'">
                    <div class="row">
                      <div
                        class="col-md-5 col-12"
                        v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '3'"
                      >
                        <q-input
                          v-model="blendDiscount.pbd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>

                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_minus_amount"
                          outlined
                          bottom-slots
                          dense
                          label="减去金额"
                          placeholder="请输入减去金额"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置减去金额']"
                        />
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_add_amount"
                          outlined
                          bottom-slots
                          dense
                          label="增加金额"
                          placeholder="请输入金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置增加金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '增加金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '4' || dataForm.ppi_discounts_type == '5'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '5'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_give_number"
                          outlined
                          bottom-slots
                          dense
                          label="赠送数量"
                          placeholder="请输入赠送数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置赠送数量']"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 row q-py-lg q-col-gutter-md">
                    <div class="col-md-2 col-12 q-pt-none">
                      <q-select outlined dense v-model="type" :options="typeData" option-label="gt_name" label="选择商品分类" />
                    </div>
                    <div class="col-md-2 col-12 q-pt-none">
                      <q-select outlined dense v-model="brand" :options="brandData" option-label="cp_name" label="选择品牌" />
                    </div>
                    <div class="col-md-2 col-12 q-pt-none">
                      <q-btn-group unelevated>
                        <q-btn color="primary" label="添加明细" @click="addTypeDiscounts" unelevated icon="las la-plus-square" />
                      </q-btn-group>
                    </div>
                  </div>
                  <div class="col-md-12 col-12 q-pt-none">
                    <div class="row" v-for="(item, normIndex) in detailData" :key="normIndex">
                      <div class="col-md-2 col-12">
                        <q-input
                          v-model="item.ppd_type_name"
                          outlined
                          bottom-slots
                          dense
                          label="分类名称"
                          class="q-mt-md"
                          readonly
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '类别名称']"
                        />
                      </div>
                      <div class="col-md-1 col-12 q-mx-sm">
                        <q-input v-model="item.ppd_brand_name" outlined bottom-slots dense label="品牌名称" class="q-mt-md" readonly />
                      </div>
                      <div v-if="dataForm.ppi_blend == 0">
                        <div v-if="dataForm.ppi_discounts_model == '1'">
                          <div class="col-md-2 col-12" v-if="dataForm.ppi_discounts_type == '2'">
                            <q-input
                              v-model="item.ppd_meet_amount"
                              outlined
                              bottom-slots
                              dense
                              label="买满金额"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>
                          <div class="col-md-2 col-12" v-if="dataForm.ppi_discounts_type == '3'">
                            <q-input
                              v-model="item.ppd_meet_number"
                              outlined
                              bottom-slots
                              dense
                              label="买满数量"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满数量"
                              lazy-rules
                              :rules="[
                                (val) => (val && val.length > 0) || '请设置买满数量',
                                (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量',
                              ]"
                            >
                              <template v-slot:append>件</template>
                            </q-input>
                          </div>
                          <div class="col-2">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_discounts"
                              outlined
                              bottom-slots
                              dense
                              label="折扣"
                              placeholder="请输入折扣"
                              lazy-rules
                              :rules="[
                                (val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式',
                                (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                              ]"
                            >
                              <template v-slot:append> % </template>
                              <template v-slot:hint> 范围：大于等于0，小于等于100，保留小数点后两位 </template>
                            </q-input>
                          </div>
                        </div>
                        <div v-if="dataForm.ppi_discounts_model == '2'">
                          <div class="col-md-2 col-12" v-if="dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '5'">
                            <q-input
                              v-model="item.ppd_meet_number"
                              outlined
                              bottom-slots
                              dense
                              label="买满数量"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满数量"
                              lazy-rules
                              :rules="[
                                (val) => (val && val.length > 0) || '请设置买满数量',
                                (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量',
                              ]"
                            >
                              <template v-slot:append>件</template>
                            </q-input>
                          </div>

                          <div class="col-2">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_special_price"
                              outlined
                              bottom-slots
                              dense
                              label="金额"
                              placeholder="请输入金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>
                        </div>

                        <div v-if="dataForm.ppi_discounts_model == '3'">
                          <div
                            class="col-md-2 col-12"
                            v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '3'"
                          >
                            <q-input
                              v-model="item.ppd_meet_amount"
                              outlined
                              bottom-slots
                              dense
                              label="买满金额"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>

                          <div class="col-2" v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2'">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_minus_amount"
                              outlined
                              bottom-slots
                              dense
                              label="减去金额"
                              placeholder="请输入减去金额"
                              lazy-rules
                              :rules="[(val) => (val && val.length > 0) || '请设置减去金额']"
                            />
                          </div>
                          <div class="col-2" v-if="dataForm.ppi_discounts_type == '3'">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_special_price"
                              outlined
                              bottom-slots
                              dense
                              label="增加金额"
                              placeholder="请输入金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置增加金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '增加金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>
                          <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '4' || dataForm.ppi_discounts_type == '5'">
                            <q-input
                              v-model="item.ppd_meet_number"
                              outlined
                              bottom-slots
                              dense
                              label="买满数量"
                              class="q-mt-md"
                              placeholder="请输入买满数量"
                              lazy-rules
                              :rules="[
                                (val) => (val && val.length > 0) || '请设置买满数量',
                                (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量',
                              ]"
                            >
                              <template v-slot:append>件</template>
                            </q-input>
                          </div>
                          <div class="col-5" v-if="dataForm.ppi_discounts_type == '5'">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_minus_amount"
                              outlined
                              bottom-slots
                              dense
                              label="赠送数量"
                              placeholder="请输入赠送数量"
                              lazy-rules
                              :rules="[(val) => (val && val.length > 0) || '请设置赠送数量']"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="col-md-1">
                        <div class="q-pl-none q-mt-lg">
                          <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row q-py-lg q-px-md q-col-gutter-md" v-if="dataForm.ppi_discounts_scope == '3'">
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '1'">
                    <div class="row">
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '2'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_discounts"
                          outlined
                          bottom-slots
                          dense
                          label="折扣"
                          placeholder="请输入折扣"
                          lazy-rules
                          :rules="[
                            (val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式',
                            (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                          ]"
                        >
                          <template v-slot:append> % </template>
                          <template v-slot:hint> 范围：大于等于0，小于等于100，保留小数点后两位 </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '2'">
                    <div class="row">
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '5'||dataForm.ppi_discounts_type == '2'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_special_price"
                          outlined
                          bottom-slots
                          dense
                          label="特价金额"
                          placeholder="请输入特价金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置特价金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '特价金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '3'">
                    <div class="row">
                      <div
                        class="col-md-5 col-12"
                        v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '3'"
                      >
                        <q-input
                          v-model="blendDiscount.pbd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>

                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_minus_amount"
                          outlined
                          bottom-slots
                          dense
                          label="减去金额"
                          placeholder="请输入减去金额"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置减去金额']"
                        />
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_add_amount"
                          outlined
                          bottom-slots
                          dense
                          label="增加金额"
                          placeholder="请输入金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置增加金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '增加金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '4' || dataForm.ppi_discounts_type == '5'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '5'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_give_number"
                          outlined
                          bottom-slots
                          dense
                          label="赠送数量"
                          placeholder="请输入赠送数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置赠送数量']"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 row q-py-lg q-col-gutter-md">
                    <div class="col-md-5 col-12 q-pt-none">
                      <q-select outlined dense v-model="brand" :options="brandData" option-label="cp_name" label="选择品牌" />
                    </div>
                    <div class="col-md-4 col-12 q-pt-none">
                      <q-btn-group unelevated>
                        <q-btn color="primary" label="添加明细" @click="addBrandDiscounts" unelevated icon="las la-plus-square" />
                      </q-btn-group>
                    </div>
                  </div>
                  <div class="col-md-10 col-12 q-pt-none">
                    <div class="row" v-for="(item, normIndex) in detailData" :key="normIndex">
                      <div class="col-md-4 col-12">
                        <q-input
                          v-model="item.ppd_brand_name"
                          outlined
                          bottom-slots
                          dense
                          label="品牌名称"
                          class="q-mt-md"
                          readonly
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '品牌名称']"
                        />
                      </div>
                      <div v-if="dataForm.ppi_blend == 0">
                        <div v-if="dataForm.ppi_discounts_model == '1'">
                          <div class="col-md-3 col-12" v-if="dataForm.ppi_discounts_type == '2'">
                            <q-input
                              v-model="item.ppd_meet_amount"
                              outlined
                              bottom-slots
                              dense
                              label="买满金额"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>
                          <div class="col-md-3 col-12" v-if="dataForm.ppi_discounts_type == '3'">
                            <q-input
                              v-model="item.ppd_meet_number"
                              outlined
                              bottom-slots
                              dense
                              label="买满数量"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满数量"
                              lazy-rules
                              :rules="[
                                (val) => (val && val.length > 0) || '请设置买满数量',
                                (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量',
                              ]"
                            >
                              <template v-slot:append>件</template>
                            </q-input>
                          </div>
                          <div class="col-3">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_discounts"
                              outlined
                              bottom-slots
                              dense
                              label="折扣"
                              placeholder="请输入折扣"
                              lazy-rules
                              :rules="[
                                (val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式',
                                (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                              ]"
                            >
                              <template v-slot:append> % </template>
                              <template v-slot:hint> 范围：大于等于0，小于等于100，保留小数点后两位 </template>
                            </q-input>
                          </div>
                        </div>
                        <div v-if="dataForm.ppi_discounts_model == '2'">
                          <div class="col-md-3 col-12" v-if="dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '5'">
                            <q-input
                              v-model="item.ppd_meet_number"
                              outlined
                              bottom-slots
                              dense
                              label="买满数量"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满数量"
                              lazy-rules
                              :rules="[
                                (val) => (val && val.length > 0) || '请设置买满数量',
                                (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量',
                              ]"
                            >
                              <template v-slot:append>件</template>
                            </q-input>
                          </div>
                          <div class="col-3">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_special_price"
                              outlined
                              bottom-slots
                              dense
                              label="金额"
                              placeholder="请输入金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>
                        </div>
                        <div v-if="dataForm.ppi_discounts_model == '3'">
                          <div
                            class="col-md-4 col-12"
                            v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '3'"
                          >
                            <q-input
                              v-model="item.ppd_meet_amount"
                              outlined
                              bottom-slots
                              dense
                              label="买满金额"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>
                          <div class="col-4" v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2'">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_minus_amount"
                              outlined
                              bottom-slots
                              dense
                              label="减去金额"
                              placeholder="请输入减去金额"
                              lazy-rules
                              :rules="[(val) => (val && val.length > 0) || '请设置减去金额']"
                            />
                          </div>
                          <div class="col-4" v-if="dataForm.ppi_discounts_type == '3'">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_special_price"
                              outlined
                              bottom-slots
                              dense
                              label="增加金额"
                              placeholder="请输入金额"
                              lazy-rules
                              :rules="[(val) => !!val || '请设置增加金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '增加金额为非负两位以内小数']"
                            >
                              <template v-slot:append> 元</template>
                            </q-input>
                          </div>
                          <div class="col-md-4 col-12" v-if="dataForm.ppi_discounts_type == '4' || dataForm.ppi_discounts_type == '5'">
                            <q-input
                              v-model="item.ppd_meet_number"
                              outlined
                              bottom-slots
                              dense
                              label="买满数量"
                              class="q-mt-md q-mx-sm"
                              placeholder="请输入买满数量"
                              lazy-rules
                              :rules="[
                                (val) => (val && val.length > 0) || '请设置买满数量',
                                (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量',
                              ]"
                            >
                              <template v-slot:append>件</template>
                            </q-input>
                          </div>
                          <div class="col-4" v-if="dataForm.ppi_discounts_type == '5'">
                            <q-input
                              class="q-mt-md q-mx-sm"
                              v-model="item.ppd_minus_amount"
                              outlined
                              bottom-slots
                              dense
                              label="赠送数量"
                              placeholder="请输入赠送数量"
                              lazy-rules
                              :rules="[(val) => (val && val.length > 0) || '请设置赠送数量']"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="col-md-1">
                        <div class="q-pl-none q-mt-lg">
                          <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="dataForm.ppi_discounts_scope == '4'">
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '1'">
                    <div class="row">
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '2'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_discounts"
                          outlined
                          bottom-slots
                          dense
                          label="折扣"
                          placeholder="请输入折扣"
                          lazy-rules
                          :rules="[
                            (val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式',
                            (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                          ]"
                        >
                          <template v-slot:append> % </template>
                          <template v-slot:hint> 范围：大于等于0，小于等于100，保留小数点后两位 </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '2'">
                    <div class="row">
                     
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '5'||dataForm.ppi_discounts_type == '2'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_special_price"
                          outlined
                          bottom-slots
                          dense
                          label="特价金额"
                          placeholder="请输入特价金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置特价金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '特价金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-12 q-pt-none" v-if="dataForm.ppi_blend == 1 && dataForm.ppi_discounts_model == '3'">
                    <div class="row">
                      <div
                        class="col-md-5 col-12"
                        v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2' || dataForm.ppi_discounts_type == '3'"
                      >
                        <q-input
                          v-model="blendDiscount.pbd_meet_amount"
                          outlined
                          bottom-slots
                          dense
                          label="买满金额"
                          class="q-mt-md"
                          placeholder="请输入买满金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置买满金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '买满金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>

                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '1' || dataForm.ppi_discounts_type == '2'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_minus_amount"
                          outlined
                          bottom-slots
                          dense
                          label="减去金额"
                          placeholder="请输入减去金额"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置减去金额']"
                        />
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '3'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_add_amount"
                          outlined
                          bottom-slots
                          dense
                          label="增加金额"
                          placeholder="请输入金额"
                          lazy-rules
                          :rules="[(val) => !!val || '请设置增加金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '增加金额为非负两位以内小数']"
                        >
                          <template v-slot:append> 元</template>
                        </q-input>
                      </div>
                      <div class="col-md-5 col-12" v-if="dataForm.ppi_discounts_type == '4' || dataForm.ppi_discounts_type == '5'">
                        <q-input
                          v-model="blendDiscount.pbd_meet_number"
                          outlined
                          bottom-slots
                          dense
                          label="买满数量"
                          class="q-mt-md"
                          placeholder="请输入买满数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置买满数量', (val) => /^[1-9]\d*$/.test(val) || '请输入正确的买满数量']"
                        >
                          <template v-slot:append>件</template>
                        </q-input>
                      </div>
                      <div class="col-5" v-if="dataForm.ppi_discounts_type == '5'">
                        <q-input
                          class="q-mt-md q-mx-sm"
                          v-model="blendDiscount.pbd_give_number"
                          outlined
                          bottom-slots
                          dense
                          label="赠送数量"
                          placeholder="请输入赠送数量"
                          lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '请设置赠送数量']"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="q-gutter-x-xs row">
                    <div class="col-12 col-md-8 q-mr-xs">
                      <q-radio dense v-model="dataForm.ppi_goods_type" val="1" @input="changType" label="按整款" />
                      <q-radio dense v-model="dataForm.ppi_goods_type" val="2" @input="changType" label="按SKU" />
                      <q-btn
                        color="primary"
                        class="q-ma-sm"
                        v-if="dataForm.ppi_goods_type == '1'"
                        @click="chooseWxgoods"
                        unelevated
                        label="选择商品"
                      />
                      <q-btn color="primary" class="q-ma-sm" v-if="dataForm.ppi_goods_type == '2'" @click="selectBut" unelevated label="选择商品" />
                      <q-btn
                        :disabled="dataListSelections.length > 0 ? false : true"
                        @click="delGoodsRow"
                        v-if="authorityMeta('bind')"
                        color="red"
                        class="col-12 col-md-1"
                        unelevated
                        label="批量删除"
                      />
                      <q-btn
                        color="primary"
                        class="q-ma-sm"
                        v-if="dataForm.ppi_discounts_model == '1'"
                        @click="showDiscountsStatus = true"
                        unelevated
                        label="全部折扣"
                      />
                      <q-btn class="q-ma-sm" color="green" @click="batchImport()" unelevated>Xlxs 文件批量导入</q-btn>
                    </div>
                  </div>
                  <div class="col-shrink q-px-xs q-py-none bg-grey-2" style="height: 400px; min-height: 400px">
                    <ag-grid-vue
                      ref="agGridTable"
                      :gridOptions="gridOptions"
                      class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
                      :columnDefs="columnDefs"
                      :suppressMovableColumns="true"
                      :rowData="detailData"
                      rowSelection="multiple"
                      @first-data-rendered="onFirstDataRendered"
                      rowHeight="40"
                      :rowDragManaged="true"
                      colResizeDefault="shift"
                      :animateRows="false"
                      :floatingFilter="false"
                      :enableCharts="true"
                      :enableRangeSelection="true"
                      :enableCellTextSelection="true"
                      :suppressRowTransform="true"
                      :suppressCellSelection="true"
                      :suppressRowClickSelection="true"
                      :rowMultiSelectWithClick="true"
                      :singleClickEdit="true"
                      :stopEditingWhenGridLosesFocus="true"
                      :localeText="localeText"
                      :context="context"
                      @rowSelected="rowSelectedAg"
                      @gridReady="onFirstDataRendered"
                    ></ag-grid-vue>
                  </div>
                </div>

                <div v-if="dataForm.ppi_discounts_model == '3' && (dataForm.ppi_discounts_type == '3' || dataForm.ppi_discounts_type == '4')">
                  <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                    <div class="text-subtitle1 q-pa-xs q-pl-lg">赠送商品</div>
                    <q-separator />
                    <div class="col-shrink q-px-xs q-py-none" style="height: 400px; min-height: 400px">
                      <give-goods
                        ref="givwgoodsList"
                        :goodsData="goodsData"
                        @giveBack="giveGoodsBack"
                        @goodsType="changGoodsType"
                        @delGiveGoodsRow="delGiveGoodsRow"
                      ></give-goods>
                    </div>
                  </q-card>
                </div>

                <choose-goods-spe ref="specificationTree" v-show="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData"></choose-goods-spe>
                <choose-goods
                  v-if="chooseVisible"
                  ref="chooseGoodsList"
                  @getChooseGoods="receivingAdministrator"
                  @closeChooseGoods="closeChooseGoods"
                ></choose-goods>
                <upload-table-goods-info v-if="goodsUploadStatus" ref="returnTypes" @closeUpload="uploadTable"> </upload-table-goods-info>
              </q-card>
            </div>
            <div v-show="tab == '3'">
              <div class="col-shrink q-px-xs q-py-none bg-grey-2" style="height: 500px; min-height: 500px">
                <special-goods
                  ref="givwgoodsList"
                  :specialGoods="specialGoods"
                  @giveBack="specialGoodsBack"
                  @goodsType="changSpecialGoodsType"
                  @delSpecialGoodsRow="delSpecialGoodsRow"
                ></special-goods>
              </div>
            </div>

            <q-dialog v-model="showDiscountsStatus">
              <q-card
                :style="{
                  width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
                  'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
                }"
              >
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">批量折扣</div>

                  <q-space />
                  <q-btn icon="close" @click="showDiscountsStatus = false" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section>
                  <div class="row">
                    <div class="col-md-6 col-12">
                      <q-input
                        v-model="discountNumber"
                        standout
                        dense
                        outlined
                        label="折扣"
                        class="q-mr-md"
                        :rules="[(val) => !!val || '请输入折扣', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '折扣为非负两位以内小数']"
                      >
                      </q-input>
                    </div>
                    <div class="col-md-4 col-12">
                      <q-btn label="确定" unelevated color="primary" @click="setDiscounts" class="text-right q-px-xl" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated :disable="btnDisable" v-if="authorityMeta('save')" label="保存" @click="saveData()" color="primary" class="q-px-xl" />
        <q-btn unelevated label="返回" type="reset" color="grey" class="q-px-xl" :to="{ name: 'promotionIndex' }" />
      </div>
    </div>
  </q-page>
</template>

<script>
import ChooseGoods from './ChooseGoods.vue';
import ChooseGoodsSpe from './ChooseGoodsSpe.vue';
import GiveGoods from './GiveGoods.vue';
import SpecialGoods from './SpecialGoods.vue';
export default {
  name: 'AddConfig',
  components: {
    ChooseGoods,
    ChooseGoodsSpe,
    GiveGoods,
    SpecialGoods,
  },
  data() {
    return {
      dataId: 0,
      tab: '1',
      showGoodsList: false,
      goodsUploadStatus: false,
      showDiscountsStatus: false,
      chooseVisible: false,
      btnDisable: false,
      startTime: '',
      endTime: '',
      dataForm: {
        ppi_name: '',
        ppi_number: '',
        ppi_time_id: '',
        ppi_start_time: '',
        ppi_end_time: '',
        ppi_is_member: '',
        ppi_status: '1',
        ppd_goods_type: '1',
        ppi_discounts_model: '1',
        ppi_discounts_type: '1',
        ppi_discounts_scope: '1',
        ppi_level_id: '',
        ppi_week_limit: '',
        ppi_note: '',
        ppi_online_status: '1',
        ppi_offline_status: '1',
        ppi_special_date: '1',
        ppi_month_limit: '1',
        ppi_goods_type: '1',
        ppi_special_goods_type: '1',
        ppi_blend: '0',
      },
      detailData: [
        {
          ppd_discounts: '',
          ppd_meet_amount: '',
          ppd_meet_number: '',
        },
      ],
      blendDiscount: {
        pbd_meet_amount: '',
        pbd_meet_number: '',
        pbd_discounts: '',
        pbd_special_price: '',
        pbd_minus_amount: '',
        pbd_add_amount: '',
        pbd_give_number: '',
      },
      goodsData: [],
      specialGoods: [],
      libInStoreList: [],
      selectStoreData: [],
      memberCardLevelDatas: [
        {
          value: 'all',
          label: '不限',
          id: 0,
        },
      ],
      type: '',
      typeData: [],
      brand: '',
      brandData: [],
      columnDefs: [],
      dataListSelections: [],
      context: '',
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      discountNumber: '',
      timeData: [],
      week_limit: [],
      month_limit: [],
      store_limit: [],
      leve_limit: [],
      weekOptions: this.$store.state.promotion.weekOptions,
      monthOptions: this.$store.state.promotion.monthOptions,
    };
  },
  watch: {
    'dataForm.ppi_discounts_type'(val) {
      this.getBrand();
      this.getType();
      if (this.dataForm.ppi_discounts_scope == 4) {
        setTimeout(() => {
          this.restColumnData();
        }, 100);
      }
    },
    'dataForm.ppi_blend'(val) {
      if (this.dataForm.ppi_discounts_scope == 4) {
        setTimeout(() => {
          this.restColumnData();
        }, 100);
      }
    },
    'dataForm.ppi_discounts_model'(val) {
      if (parseInt(val) == 1) {
        if (this.dataForm.ppi_discounts_scope == '1') {
          if (this.dataForm.ppi_discounts_type == 1) {
            this.detailData = [
              {
                ppd_discounts: '',
                ppd_meet_amount: '',
                ppd_meet_number: '',
              },
            ];
          }
        }
      }
      if (parseInt(val) == 2) {
        if (this.dataForm.ppi_discounts_scope == '1') {
          if (this.dataForm.ppi_discounts_type == '1' || this.dataForm.ppi_discounts_type == '3') {
            this.detailData = [
              {
                ppd_discounts: '',
                ppd_meet_amount: '',
                ppd_meet_number: '',
              },
            ];
          }
        }
      }
      if (parseInt(this.dataForm.ppi_discounts_scope) == 4) {
        setTimeout(() => {
          this.restColumnData();
        }, 100);
      }
    },
  },

  mounted() {
    this.getTime();
    this.getBrand();
    this.getType();
    this.getLevel();
  },
  computed: {},
  created() {
    if (this.$route.query.id) {
      this.getItem(this.$route.query.id);
    }
    this.getLibInStoreData();
  },
  methods: {
    getLevel() {
      this.$store.dispatch('level/getAllData').then((res) => {
        if (res.code == 200) {
          const data = res.data;

          if (data) {
            if (data.length > 0) {
              this.specNewsDataBak = [];
              for (let i = 0; i < data.length; i++) {
                const person = {
                  value: '',
                  label: '',
                  id: '',
                };
                person.label = data[i].mcl_level_name;
                person.value = 'level_' + data[i].id;
                person.id = data[i].id;
                this.specNewsDataBak.push(person);
              }
              this.memberCardLevelDatas = this.memberCardLevelDatas.concat(this.specNewsDataBak);
            }
          }
        }
      });
    },
    getType() {
      this.$store
        .dispatch('goodstype/getTreeList')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typeData = res.data;
              this.reschType();
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
            color: 'red',
          });
        });
    },
    reschType() {
      this.detailData.forEach((value, index) => {
        const data = this.typeData.findIndex(function (x) {
          return x.id == value.ppd_type_id;
        });
        if (data > -1) {
          this.typeData.splice(data, 1);
        }
      });
    },
    getTime() {
      this.$store
        .dispatch('promotion/getTimeListData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.timeData = res.data;
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
            color: 'red',
          });
        });
    },
    selectTime() {
      const that = this;
      if (that.dataForm.ppi_time_id > 0) {
        const data = that.timeData.find(function (x) {
          return x.id == that.dataForm.ppi_time_id;
        });
        that.startTime = that.$q_date.formatDate(data.ppt_start_time * 1000, 'YYYY-MM-DD');
        that.endTime = that.$q_date.formatDate(data.ppt_end_time * 1000, 'YYYY-MM-DD');
      }
    },
    getBrand() {
      const obj = {
        type: 'brand',
        status: 1,
      };
      this.$store
        .dispatch('goodsProperty/getPropertyList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.brandData = res.data ? res.data : [];
            this.reschBrand();
          }
        })
        .catch((error) => {});
    },
    reschBrand() {
      this.detailData.forEach((value, index) => {
        const data = this.brandData.findIndex(function (x) {
          return x.id == value.ppd_brand_id;
        });
        if (data > -1) {
          this.brandData.splice(data, 1);
        }
      });
    },
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          var obj = [
            {
              id: 'all',
              name: '全部',
            },
          ];
          this.libInStoreList = obj.concat(res.data ? res.data : []);
        }
      });
    },
    selectStore(value) {
      if (value.indexOf('all') >= 0) {
        this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
          if (res.code == 200 && res.data) {
            if (res.data.length > 0) {
              const obj = res.data.map((item) => {
                return item.id;
              });
              this.store_limit = obj;
            }
          }
        });
      }
    },
    getItem(val) {
      if (val > 0) {
        this.dataId = this.$route.query.id;
        this.$store.dispatch('promotion/getItem', val).then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data ? res.data : {};
            this.detailData = res.data.detail;
            this.blendDiscount = res.data.blendDiscount;

            if (res.data.goodsData.length > 0) {
              this.goodsData = res.data.goodsData;
            }
            if (res.data.specialGoods.length > 0) {
              this.specialGoods = res.data.specialGoods;
            }
            this.week_limit = res.data.ppi_week_limit.split(',');
            if (res.data.ppi_month_limit) {
              this.month_limit = res.data.ppi_month_limit.split(',');
            }
            if (res.data.ppi_store_limit) {
              this.store_limit = res.data.ppi_store_limit.split(',');
            }
            if (res.data.ppi_is_member) {
              this.leve_limit = res.data.ppi_is_member.split(',');
            }

            this.startTime = this.$q_date.formatDate(res.data.ppi_start_time * 1000, 'YYYY-MM-DD');
            this.endTime = this.$q_date.formatDate(res.data.ppi_end_time * 1000, 'YYYY-MM-DD');

            if (this.dataForm.ppi_discounts_scope == '4') {
              setTimeout(() => {
                this.editColumnData(res.data.detail);
              }, 200);
            }
          }
        });
      }
    },
    changScope(val) {
      if (parseInt(val) == 1) {
        if (this.dataForm.ppi_discounts_model == '1') {
          if (this.dataForm.ppi_discounts_type == '1') {
            this.detailData = [
              {
                ppd_discounts: '',
                ppd_meet_amount: '',
                ppd_meet_number: '',
              },
            ];
          }
        }
        if (this.dataForm.ppi_discounts_model == '2') {
          if (this.dataForm.ppi_discounts_type == '1' || this.dataForm.ppi_discounts_type == '3') {
            this.detailData = [
              {
                ppd_discounts: '',
                ppd_meet_amount: '',
                ppd_meet_number: '',
              },
            ];
          }
        }
      }
      if (parseInt(val) == 2 || parseInt(val) == 3) {
        setTimeout(() => {
          this.detailData = [];
          this.getBrand();
          this.getType();
        }, 100);
      }
      if (parseInt(val) == 4) {
        setTimeout(() => {
          this.restColumnData();
        }, 100);
      }
    },
    changType() {
      this.detailData = [];
    },
    restColumnData() {
      this.detailData = [];
      this.gridOptions.api.setColumnDefs([]);
      if (this.dataForm.ppi_discounts_model == '1') {
        var columnData = [
          {
            headerName: '',
            field: '',
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: this.nowpx(0.01) + 'px',
          },
          {
            headerName: '商品名称',
            field: 'ppd_goods_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.13) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = [];
              const data = p.data;
              data.ppd_goods_name = Math.floor(Math.random() * 20000 + 20000);
              itemsToUpdate.push(data);
              const res = p.api.applyTransaction({ update: itemsToUpdate });
            },
          },
          {
            headerName: '规格',
            field: 'ppd_spe_name',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },

          {
            headerName: '编码',
            field: 'ppd_code',
            filter: false,
            width: this.nowpx(0.09) + 'px',
          },
          {
            headerName: '售价',
            field: 'ppd_price',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
        ];
        if (this.dataForm.ppi_blend == 0) {
          if (this.dataForm.ppi_discounts_type == '2') {
            columnData.push({
              headerName: '买满金额',
              field: 'ppd_meet_amount',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          if (this.dataForm.ppi_discounts_type == '3') {
            columnData.push({
              headerName: '买满数量',
              field: 'ppd_meet_number',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          columnData.push({
            headerName: '折扣',
            field: 'ppd_discounts',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px',
          });
        }
      }
      if (this.dataForm.ppi_discounts_model == '2') {
        var columnData = [
          {
            headerName: '',
            field: '',
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: this.nowpx(0.01) + 'px',
          },
          {
            headerName: '商品名称',
            field: 'ppd_goods_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.13) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = [];
              const data = p.data;
              data.ppd_goods_name = Math.floor(Math.random() * 20000 + 20000);
              itemsToUpdate.push(data);
              const res = p.api.applyTransaction({ update: itemsToUpdate });
            },
          },
          {
            headerName: '规格',
            field: 'ppd_spe_name',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
          {
            headerName: '编码',
            field: 'ppd_code',
            filter: false,
            width: this.nowpx(0.09) + 'px',
          },
          {
            headerName: '售价',
            field: 'ppd_price',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
        ];
        if (this.dataForm.ppi_blend == 0) {
          if (this.dataForm.ppi_discounts_type == '2' || this.dataForm.ppi_discounts_type == '5') {
            columnData.push({
              headerName: '买满数量',
              field: 'ppd_meet_number',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          columnData.push({
            headerName: '特价',
            field: 'ppd_special_price',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px',
          });
          if (this.dataForm.ppi_discounts_type == '4') {
            columnData.push({
              headerName: '组别',
              field: 'ppd_group_number',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
        }
      }
      if (this.dataForm.ppi_discounts_model == '3') {
        if (this.dataForm.ppi_discounts_scope == '4') {
          var columnData = [
            {
              headerName: '',
              field: '',
              headerCheckboxSelectionFilteredOnly: true,
              headerCheckboxSelection: true,
              checkboxSelection: true,
              width: this.nowpx(0.01) + 'px',
            },
            {
              headerName: '商品名称',
              field: 'ppd_goods_name',
              filter: false, // 是否过滤
              width: this.nowpx(0.13) + 'px',
              onCellValueChanged: function (p) {
                const itemsToUpdate = [];
                const data = p.data;
                data.ppd_goods_name = Math.floor(Math.random() * 20000 + 20000);
                itemsToUpdate.push(data);
                const res = p.api.applyTransaction({ update: itemsToUpdate });
              },
            },
            {
              headerName: '规格',
              field: 'ppd_spe_name',
              filter: false,
              width: this.nowpx(0.06) + 'px',
            },
            {
              headerName: '编码',
              field: 'ppd_code',
              filter: false,
              width: this.nowpx(0.09) + 'px',
            },
            {
              headerName: '售价',
              field: 'ppd_price',
              filter: false,
              width: this.nowpx(0.06) + 'px',
            },
          ];
          if (this.dataForm.ppi_blend == 0) {
            if (this.dataForm.ppi_discounts_type == '1' || this.dataForm.ppi_discounts_type == '2' || this.dataForm.ppi_discounts_type == '3') {
              columnData.push({
                headerName: '买满金额',
                field: 'ppd_meet_amount',
                filter: false,
                editable: true,
                singleClickEdit: true,
                onCellValueChanged: this.changeNumber,
                width: this.nowpx(0.06) + 'px',
              });
            }

            if (this.dataForm.ppi_discounts_type == '1' || this.dataForm.ppi_discounts_type == '2') {
              columnData.push({
                headerName: '减去金额',
                field: 'ppd_minus_amount',
                filter: false,
                editable: true,
                singleClickEdit: true,
                onCellValueChanged: this.changeNumber,
                width: this.nowpx(0.06) + 'px',
              });
            }
            if (this.dataForm.ppi_discounts_type == '3') {
              columnData.push({
                headerName: '增加金额',
                field: 'ppd_special_price',
                filter: false,
                editable: true,
                singleClickEdit: true,
                onCellValueChanged: this.changeNumber,
                width: this.nowpx(0.06) + 'px',
              });
            }
            if (this.dataForm.ppi_discounts_type == '4' || this.dataForm.ppi_discounts_type == '5') {
              columnData.push({
                headerName: '买满数量',
                field: 'ppd_meet_number',
                filter: false,
                editable: true,
                singleClickEdit: true,
                onCellValueChanged: this.changeNumber,
                width: this.nowpx(0.06) + 'px',
              });
            }
            if (this.dataForm.ppi_discounts_type == '5') {
              columnData.push({
                headerName: '赠送数量',
                field: 'ppd_minus_amount',
                filter: false,
                editable: true,
                singleClickEdit: true,
                onCellValueChanged: this.changeNumber,
                width: this.nowpx(0.06) + 'px',
              });
            }
          }
        }
      }
      this.gridOptions.api.setColumnDefs(columnData);
      this.gridOptions.api.sizeColumnsToFit();
      // if (this.$route.query.id) {
      //   this.getItem(this.$route.query.id);
      // }
    },
    editColumnData(data) {
      this.gridOptions.api.setColumnDefs([]);
      if (this.dataForm.ppi_discounts_model == '1') {
        var columnData = [
          {
            headerName: '',
            field: '',
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: this.nowpx(0.01) + 'px',
          },
          {
            headerName: '商品名称',
            field: 'ppd_goods_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.13) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = [];
              const data = p.data;
              data.ppd_goods_name = Math.floor(Math.random() * 20000 + 20000);
              itemsToUpdate.push(data);
              const res = p.api.applyTransaction({ update: itemsToUpdate });
            },
          },
          {
            headerName: '规格',
            field: 'ppd_spe_name',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
          {
            headerName: '编码',
            field: 'ppd_code',
            filter: false,
            width: this.nowpx(0.09) + 'px',
          },
          {
            headerName: '售价',
            field: 'ppd_price',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
        ];
        if (this.dataForm.ppi_blend == 0) {
          if (this.dataForm.ppi_discounts_type == '2') {
            columnData.push({
              headerName: '买满金额',
              field: 'ppd_meet_amount',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          if (this.dataForm.ppi_discounts_type == '3') {
            columnData.push({
              headerName: '买满数量',
              field: 'ppd_meet_number',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          columnData.push({
            headerName: '折扣',
            field: 'ppd_discounts',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px',
          });
        }
      }
      if (this.dataForm.ppi_discounts_model == '2') {
        var columnData = [
          {
            headerName: '',
            field: '',
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: this.nowpx(0.01) + 'px',
          },
          {
            headerName: '商品名称',
            field: 'ppd_goods_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.13) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = [];
              const data = p.data;
              data.ppd_goods_name = Math.floor(Math.random() * 20000 + 20000);
              itemsToUpdate.push(data);
              const res = p.api.applyTransaction({ update: itemsToUpdate });
            },
          },
          {
            headerName: '规格',
            field: 'ppd_spe_name',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
          {
            headerName: '编码',
            field: 'ppd_code',
            filter: false,
            width: this.nowpx(0.09) + 'px',
          },
          {
            headerName: '售价',
            field: 'ppd_price',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
        ];
        if (this.dataForm.ppi_blend == 0) {
          if (this.dataForm.ppi_discounts_type == '2' || this.dataForm.ppi_discounts_type == '5') {
            columnData.push({
              headerName: '买满数量',
              field: 'ppd_meet_number',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          columnData.push({
            headerName: '特价',
            field: 'ppd_special_price',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px',
          });
          if (this.dataForm.ppi_discounts_type == '4') {
            columnData.push({
              headerName: '组别',
              field: 'ppd_group_number',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
        }
      }
      if (this.dataForm.ppi_discounts_model == '3' && this.dataForm.ppi_discounts_scope == '4') {
        var columnData = [
          {
            headerName: '',
            field: '',
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: this.nowpx(0.01) + 'px',
          },
          {
            headerName: '商品名称',
            field: 'ppd_goods_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.13) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = [];
              const data = p.data;
              data.ppd_goods_name = Math.floor(Math.random() * 20000 + 20000);
              itemsToUpdate.push(data);
              const res = p.api.applyTransaction({ update: itemsToUpdate });
            },
          },
          {
            headerName: '规格',
            field: 'ppd_spe_name',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
          {
            headerName: '编码',
            field: 'ppd_code',
            filter: false,
            width: this.nowpx(0.09) + 'px',
          },
          {
            headerName: '售价',
            field: 'ppd_price',
            filter: false,
            width: this.nowpx(0.06) + 'px',
          },
        ];
        if (this.dataForm.ppi_blend == 0) {
          if (this.dataForm.ppi_discounts_type == '1' || this.dataForm.ppi_discounts_type == '2' || this.dataForm.ppi_discounts_type == '3') {
            columnData.push({
              headerName: '买满金额',
              field: 'ppd_meet_amount',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }

          if (this.dataForm.ppi_discounts_type == '1' || this.dataForm.ppi_discounts_type == '2') {
            columnData.push({
              headerName: '减去金额',
              field: 'ppd_minus_amount',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          if (this.dataForm.ppi_discounts_type == '3') {
            columnData.push({
              headerName: '增加金额',
              field: 'ppd_special_price',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          if (this.dataForm.ppi_discounts_type == '4' || this.dataForm.ppi_discounts_type == '5') {
            columnData.push({
              headerName: '买满数量',
              field: 'ppd_meet_number',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
          if (this.dataForm.ppi_discounts_type == '5') {
            columnData.push({
              headerName: '赠送数量',
              field: 'ppd_minus_amount',
              filter: false,
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeNumber,
              width: this.nowpx(0.06) + 'px',
            });
          }
        }
      }

      this.gridOptions.api.setColumnDefs(columnData);
      this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.api.redrawRows();
      this.detailData = data;
    },
    delGoodsRow() {
      const selRows = this.gridOptions.api.getSelectedNodes(); // 获取选中的行
      if (selRows.length > 0) {
        const obj = selRows.map((item) => {
          return item.childIndex;
        });
        this.detailData.splice(obj, 1);
      }
      this.dataListSelections = [];
    },
    delGiveGoodsRow(data) {
      if (data) {
        this.goodsData.splice(data, 1);
      }
    },
    delSpecialGoodsRow(data) {
      if (data) {
        this.specialGoods.splice(data, 1);
      }
    },
    saveData() {
      this.$refs.configDataRef.validate().then((success) => {
        if (success) {
          const dataForm = this.dataForm;
          if (this.startTime) {
            dataForm.ppi_start_time = this.$q_date.formatDate(this.startTime, 'X');
          } else {
            dataForm.ppi_start_time = this.$q_date.formatDate(new Date(), 'X');
          }
          if (this.endTime) {
            dataForm.ppi_end_time = this.$q_date.formatDate(this.endTime, 'X');
          } else {
            dataForm.ppi_end_time = this.$q_date.formatDate(new Date(), 'X');
          }

          if (dataForm.ppi_end_time <= dataForm.ppi_start_time) {
            this.$q.notify({
              message: '失败',
              caption: '结束时间不得大于等于开始时间,请重新选择',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right',
            });
            this.buttonDisable = false;
            return false;
          }
          this.dataForm.ppi_week_limit = this.week_limit;
          this.dataForm.ppi_month_limit = this.month_limit;
          this.dataForm.ppi_store_limit = this.store_limit;
          this.dataForm.ppi_is_member = this.leve_limit;
          this.btnDisable = true;
          const obj = {
            ...this.dataForm,
            id: this.dataId,
            blendDiscount: this.blendDiscount,
            detailData: this.detailData,
            goodsData: this.goodsData,
            specialGoods: this.specialGoods,
          };
          this.$store
            .dispatch('promotion/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}促销方案`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green',
                });
                this.btnDisable = false;
                this.$router.push({ name: 'promotionIndex' });
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red',
                });
                this.btnDisable = false;
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red',
              });
              this.btnDisable = false;
            });
        }
      });
    },
    oneKeyGenerateCode() {
      const Rand = Math.random();
      const mineId = Math.round(Rand * 100000000);
      const newDate = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmm');
      this.dataForm.ppi_number = 'CS-' + newDate + mineId;
    },
    // 添加
    addSpecification() {
      const layoutArray = this.detailData;
      const newlayout = {
        ppd_discounts: '',
        ppd_meet_amount: '',
        ppd_meet_number: '',
        ppd_special_price: '',
      };
      layoutArray.push(newlayout);
    },
    addTypeDiscounts() {
      const type = this.type;
      if (type) {
        const layoutArray = this.detailData;
        const newlayout = {
          ppd_discounts: '100',
          ppd_special_price: '',
          ppd_meet_amount: '',
          ppd_meet_number: '',
          ppd_type_id: type.id,
          ppd_type_name: type.gt_name,
        };
        if (this.brand) {
          newlayout.ppd_brand_id = this.brand.id;
          newlayout.ppd_brand_name = this.brand.cp_name;
          this.brand = '';
        }

        layoutArray.push(newlayout);
        this.type = null;
      }
      this.reschConfig();
    },
    reschConfig() {
      this.detailData.forEach((value, index) => {
        const data = this.typeData.findIndex(function (x) {
          return x.id == value.ppd_type_id;
        });
        if (data > -1) {
          this.typeData.splice(data, 1);
        }
      });
    },
    addBrandDiscounts() {
      const brand = this.brand;
      if (brand) {
        const layoutArray = this.detailData;
        const newlayout = {
          ppd_discounts: '100',
          ppd_special_price: '',
          ppd_meet_amount: '',
          ppd_meet_number: '',
          ppd_brand_id: brand.id,
          ppd_brand_name: brand.cp_name,
        };
        layoutArray.push(newlayout);
        this.brand = null;
      }
      this.reschBrandConfig();
    },
    setDiscounts() {
      if (this.discountNumber && this.detailData.length > 0) {
        this.detailData.forEach((item) => {
          item.ppd_discounts = this.discountNumber;
        });
        this.gridOptions.api.setRowData(this.detailData);
      }
      this.showDiscountsStatus = false;
      this.discountNumber = '';
    },
    // 格式化保留小数点后两位数据
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    changeNumber(p) {
      const row = p.data;
      let ppd_discounts = this.formatAmount(row.ppd_discounts);
      if (ppd_discounts == 0) {
        ppd_discounts = 100;
      }
      const itemsToUpdate = [];
      const regu = /^[1-9]\d*$/;
      if (row.ppd_meet_number && !regu.test(row.ppd_meet_number)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }
      const regu6 = /^[1-9]\d*$/;
      if (row.ppd_group_number && !regu6.test(row.ppd_group_number)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
        });
        row.ppd_group_number = 1;
        return false;
      }

      const regu2 = /^[0-9]+\.?[0-9]{0,2}$/;
      if (row.ppd_meet_amount && !regu2.test(row.ppd_meet_amount)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }

      const regu3 = /^([1-9][0-9]{0,1}|100)$/;
      if (row.ppd_discounts && !regu3.test(row.ppd_discounts)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }
      const regu4 = /^[0-9]+\.?[0-9]{0,2}$/;
      if (row.ppd_special_price && !regu4.test(row.ppd_special_price)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }

      const regu5 = /^[0-9]+\.?[0-9]{0,2}$/;
      if (row.ppd_minus_amount && !regu5.test(row.ppd_minus_amount)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }

      itemsToUpdate.push(row);
      p.api.applyTransaction({ update: itemsToUpdate });
      if (!p.newValue || p.newValue == p.oldValue) {
        return false;
      }
    },
    reschBrandConfig() {
      this.detailData.forEach((value, index) => {
        const data = this.brandData.findIndex(function (x) {
          return x.id == value.ppd_brand_id;
        });
        if (data > -1) {
          this.brandData.splice(data, 1);
        }
      });
    },
    giveGoodsBack(val) {
      this.goodsData = val;
    },
    changGoodsType(val) {
      this.goodsData = [];
    },
    specialGoodsBack(val) {
      this.specialGoods = val;
    },
    changSpecialGoodsType(val) {
      this.specialGoods = [];
    },

    // 批量导入
    batchImport() {
      this.goodsUploadStatus = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('goods');
        }, 500);
      });
    },
    uploadTable(data) {
      this.goodsUploadStatus = false;
      if (data && data.length > 0) {
        const specNewsDataBak = [];
        const list = this.detailData.map((item) => {
          return parseInt(item.ppd_goods_id);
        });

        for (let i = 0; i < data.length; i++) {
          if (list.indexOf(parseInt(data[i].id)) == -1) {
            const person = {};
            person.ppd_goods_name = data[i][2];
            person.ppd_code = data[i][1];
            if (this.dataForm.ppi_goods_type == '2') {
              person.ppd_spe_name = data[i][3];
            }
            person.ppd_price = data[i][4];
            specNewsDataBak.push(person);
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: data[i][2] + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
            });
          }
        }
        this.detailData = this.detailData.concat(specNewsDataBak);
      }
    },

    // 删除
    deleteSpecification(mainKey) {
      setTimeout(() => {
        this.detailData.splice(mainKey, 1);
      }, 100);
    },
    selectBut() {
      this.showGoodsList = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1);
        }, 500);
      });
    },
    // 选择商品
    chooseWxgoods() {
      this.chooseVisible = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.chooseGoodsList.getInquireType([1, 2]);
        }, 500);
      });
    },
    // 选择返回的数据
    receivingAdministrator(data) {
      if (data && data.length > 0) {
        const specNewsDataBak = [];
        const list = this.detailData.map((item) => {
          return parseInt(item.ppd_goods_id);
        });
        for (let i = 0; i < data.length; i++) {
          if (list.indexOf(parseInt(data[i].id)) == -1) {
            const person = {};
            person.ppd_goods_id = data[i].id;
            person.ppd_goods_name = data[i].goo_name;
            person.ppd_code = data[i].goo_code;
            person.ppd_price = data[i].goo_price;
            specNewsDataBak.push(person);
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: data[i].goo_name + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
            });
          }
        }
        this.detailData = this.detailData.concat(specNewsDataBak);
      }
    },
    // 关闭
    closeChooseGoods() {
      this.chooseVisible = false;
    },
    // 获取选中规格商品数据
    getSelectedGoodsData(data, status = false) {
      this.showGoodsList = status;
      const that = this;
      if (data && data.length > 0) {
        const specNewsDataBak = [];
        const list = this.detailData.map((item) => {
          return parseInt(item.ppd_sep_id);
        });
        for (let i = 0; i < data.length; i++) {
          if (list.indexOf(parseInt(data[i].id)) == -1) {
            const person = {};
            person.ppd_goods_id = data[i].goods_id;
            person.ppd_goods_name = data[i].goo_name;
            person.ppd_sep_id = data[i].id;
            person.ppd_spe_name = data[i].specificationName;
            person.ppd_code = data[i].goo_code;
            person.ppd_price = data[i].goo_price;
            person.ppd_discounts = 100;

            specNewsDataBak.push(person);
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: data[i].goo_name + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
            });
          }
        }
        this.detailData = this.detailData.concat(specNewsDataBak);
      }
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    },
    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows();
    },
    authorityMeta(key) {
      return true;
      // if (this.$route.meta) {
      //   const newArr = this.$route.meta.map((obj) => {
      //     return obj.id
      //   })
      //   if (newArr.indexOf(key) >= 0) {
      //     return true
      //   }
      // }
      // return false
    },
  },
};
</script>
