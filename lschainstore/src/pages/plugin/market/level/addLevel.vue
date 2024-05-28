<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mb-xs " />
        {{ $route.query.id > 0 ? '修改' : '新增' }}
      </div>
      <q-card flat class="q-pa-md col-shrink q-pa-sm full-height">
        <q-scroll-area class="fit full-height">
          <q-form ref="levelRefs">
            <div class="row" v-if="defaultLevel == true">
              <div class="col-6 q-pr-md">
                <q-select
                  outlined
                  dense
                  v-model="levelData.pml_weights"
                  :options="levelOptions"
                  option-disable="disable"
                  label="请选择权重"
                  option-label="label"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || '请选择权重']"
                />
              </div>
              <div class="col-6 q-pr-sm">
                <q-select
                  outlined
                  dense
                  v-model="levelData.pml_status"
                  :options="statusOptions"
                  label="状态"
                  option-label="label"
                  emit-value
                  map-options
                />
              </div>
            </div>
            <div class="row q-mt-xs">
              <div class="col-6 q-pr-md">
                <q-input outlined dense v-model="levelData.pml_name" label="等级名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
              </div>
              <div class="col-6 q-pr-sm" v-if="defaultLevel == true">
                <q-select
                  outlined
                  dense
                  v-model="levelData.pml_type"
                  :options="upgradeTypeOptions"
                  label="请选择升级方式"
                  option-label="label"
                  emit-value
                  map-options
                >
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
                :color="levelData.pml_upgrade_property.indexOf(item.value) >= 0 ? 'primary' : 'grey'"
                v-for="(item, key) in tagList"
                :key="key"
              >
              </q-btn>
            </div>
            <div class="q-mt-md" v-if="levelData.pml_upgrade_property.length > 0">
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-md q-gutter-y-xs">
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pml_upgrade_property.indexOf(1) >= 0"
                    dense
                    label="分佣订单总额"
                    v-model="levelData.pml_order_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入分佣订单总额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(1)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pml_upgrade_property.indexOf(2) >= 0"
                    dense
                    label="分佣订单总数"
                    v-model="levelData.pml_order_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入分佣订单总数']"
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
                    v-if="levelData.pml_upgrade_property.indexOf(3) >= 0"
                    dense
                    label="一级分佣订单总额"
                    v-model="levelData.pml_one_order_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入一级分佣订单总额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(3)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pml_upgrade_property.indexOf(4) >= 0"
                    dense
                    label="一级分佣订单总数"
                    v-model="levelData.pml_one_order_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入一级分佣订单总数']"
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
                    v-if="levelData.pml_upgrade_property.indexOf(5) >= 0"
                    dense
                    label="自购分佣订单总额"
                    v-model="levelData.pml_self_order_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入自购分佣订单总额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(5)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    color="#f5f7fa"
                    v-if="levelData.pml_upgrade_property.indexOf(6) >= 0"
                    dense
                    label="自购分佣订单总数"
                    v-model="levelData.pml_self_order_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入自购分佣订单总数']"
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
                    v-if="levelData.pml_upgrade_property.indexOf(7) >= 0"
                    dense
                    label="下级总人数"
                    v-model="levelData.pml_son_member_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入下级总人数']"
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
                    v-if="levelData.pml_upgrade_property.indexOf(8) >= 0"
                    dense
                    label="下级分佣商人数"
                    v-model="levelData.pml_son_market_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入下级分佣商人数']"
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
                    v-if="levelData.pml_upgrade_property.indexOf(9) >= 0"
                    dense
                    label="一级下级人数"
                    v-model="levelData.pml_one_member_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入一级下级人数']"
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
                    v-if="levelData.pml_upgrade_property.indexOf(10) >= 0"
                    dense
                    label="一级下级分佣商"
                    v-model="levelData.pml_one_market_quantity"
                    :rules="[(val) => (!!val && /^[0-9]*$/.test(val)) || '请输入一级下级分佣商']"
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
                    v-if="levelData.pml_upgrade_property.indexOf(11) >= 0"
                    dense
                    label="已提现佣金金额"
                    v-model="levelData.pml_take_market_amount"
                    :rules="[(val) => (!!val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '请输入已提现佣金金额']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    </template>
                    <template v-slot:after>
                      <q-btn unelevated color="red" dense @click="delSelectData(11)" label="删除" class="q-ml-sm q-px-md full-height" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <q-tabs v-model="giveTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
              <q-tab name="0" label="新会员" v-if="parseInt(configData.pmc_level) >= 1" />
              <q-tab name="1" :label="configData.pmc_one_name" v-if="parseInt(configData.pmc_level) >= 1" />
              <q-tab name="2" :label="configData.pmc_two_name" v-if="parseInt(configData.pmc_level) >= 2" />
              <q-tab name="3" :label="configData.pmc_three_name" v-if="parseInt(configData.pmc_level) == 3" />
            </q-tabs>
            <q-tab-panels v-model="giveTab">
              <q-tab-panel name="0" class="q-pa-none" v-if="parseInt(configData.pmc_level) >= 1">
                <div class="q-mt-md ">

                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />绑定时赠送权益(新用户不赠送佣金)</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('bind')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="newBindPackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in newBindPackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'bind')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </q-tab-panel>
              <q-tab-panel name="1" class="q-pa-none" v-if="parseInt(configData.pmc_level) >= 1">
                <div class="q-mt-md ">

                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />绑定时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('bind')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="oneBindPackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in oneBindPackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'bind')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />首次消费时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('first')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="oneFirstConsumePackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in oneFirstConsumePackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'first')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />消费时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('consume')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="oneConsumePackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in oneConsumePackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'consume')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </q-tab-panel>
              <q-tab-panel name="2" class="q-pa-none" v-if="parseInt(configData.pmc_level) >= 2">
                <div class="q-mt-md ">

                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />绑定时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('bind')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="twoBindPackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in twoBindPackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'bind')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />首次消费时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('first')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="twoFirstConsumePackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in twoFirstConsumePackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'first')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />消费时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('consume')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="twoConsumePackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in twoConsumePackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'consume')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </q-tab-panel>
              <q-tab-panel name="3" class="q-pa-none" v-if="parseInt(configData.pmc_level) == 3">
                <div class="q-mt-md ">

                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />绑定时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('bind')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="threeBindPackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in threeBindPackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'bind')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />首次消费时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('first')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="threeFirstConsumePackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in threeFirstConsumePackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'first')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card flat bordered class="q-my-xs">
                    <q-card-section class="row items-center q-py-xs">
                      <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />消费时赠送权益</span>
                      <q-space />
                      <q-btn label="添加权益" unelevated @click="showPackage('consume')" color="primary" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section flat class="row" v-if="threeConsumePackageData.length > 0">
                      <div class="q-pa-xs col-4" v-for="(item, key) in threeConsumePackageData" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label>名称：{{ item.pmp_name }}</q-item-label>
                              <q-item-label>
                                佣金：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_amount }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                佣金比例：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_market_proportion }}</span>
                                <span class="text-orange"> %</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_balance }}</span>
                                <span class="text-orange"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                              </q-item-label>
                              <q-item-label>
                                赠送{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}：
                                <span class="text-h6 text-orange text-weight-bold">{{ item.pmp_give_integral }}</span>
                              </q-item-label>
                              <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                                有效期：
                                <q-badge color="red"> 永久有效</q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                                有效期：
                                <q-badge color="red">
                                  {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                                  至
                                  {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                                有效期：
                                <q-badge color="red">
                                  领取后{{ item.grp_startTime }}
                                  <span v-if="item.grp_endTime == 1">年 </span>
                                  <span v-if="item.grp_endTime == 2">季度 </span>
                                  <span v-if="item.grp_endTime == 3">月 </span>
                                  <span v-if="item.grp_endTime == 4">周 </span>
                                  <span v-if="item.grp_endTime == 5">天 </span>内有效
                                </q-badge>
                              </q-item-label>
                            </q-item-section>
                            <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delPackage(key, 'consume')" />
                          </q-item>
                          <q-expansion-item expand-separator :disable="!(item.count && item.count.length)" icon="payment" label="次卡">
                            <q-list v-if="item.count">
                              <q-item v-for="(i, k) in item.count" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.grp_name }} <span class="q-ml-sm text-caption">{{ getCountName(i.rechargeDetail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.timing && item.timing.length)" icon="access_time" label="计时卡">
                            <q-list v-if="item.timing">
                              <q-item v-for="(i, k) in item.timing" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.gtg_name }}<span class="q-ml-sm text-caption">{{ getTimingName(i.detail) }}</span>
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                          <q-expansion-item expand-separator :disable="!(item.coupon && item.coupon.length)" icon="las la-credit-card" label="优惠券">
                            <q-list v-if="item.coupon">
                              <q-item v-for="(i, k) in item.coupon" :key="k">
                                <q-item-section>
                                  <q-item-label>
                                    {{ i.cou_title }}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>
                                    <q-icon name="las la-archive" color="red" />
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-expansion-item>
                        </q-list>
                      </div>
                    </q-card-section>
                    <q-card-section flat v-else>
                      <div class="q-ml-md">
                        暂无赠送
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </q-tab-panel>
            </q-tab-panels>
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
                分佣商满足以下所设任意条件之一，均可升级到当前分销等级。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                满足所选全部条件
              </div>
              <div class="text-body1">
                分佣商满足以下所设全部条件，可升级到当前分销等级。
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
                分佣商通过引导下级消费或自购消费等方式产生的分销订单总额，大于等于设置金额，即满足条件。
              </div>

              <div class="text-subtitle1  text-weight-bold text-primary">
                分销订单总数
              </div>
              <div class="text-body1">
                分佣商通过引导下级消费或自购消费等方式产生的分销订单总数，大于等于设置数量，即满足条件。
              </div>
                <div class="text-subtitle1  text-weight-bold text-primary">
                一级分销订单总额
              </div>
              <div class="text-body1">
                所属分佣商一级会员消费产生的分销订单总额，大于等于设置金额，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                一级分销订单总数
              </div>
              <div class="text-body1">
                 所属分佣商一级会员消费产生的分销订单总数，大于等于设置总数，即满足条件。
              </div>
              <div class="text-subtitle1 text-weight-bold text-primary">
                自购分销订单总额
              </div>
              <div class="text-body1">
               分佣商自身消费产生的分销订单总额，大于等于设置总额，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                自购分销订单总数
              </div>
              <div class="text-body1">
                分佣商自身消费产生的分销订单总数，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                下级总人数
              </div>
              <div class="text-body1">
                分佣商下级（不区分一级、二级、三级）的会员，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                下级分佣商人数
              </div>
              <div class="text-body1">
                分佣商下级（不区分一级、二级、三级）的分佣商，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                一级下级人数
              </div>
              <div class="text-body1">
                分佣商一级下级的会员，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                一级下级分佣商
              </div>
              <div class="text-body1">
                分佣商一级下级的分佣商，大于等于设置总数，即满足条件。
              </div>

              <div class="text-subtitle1 text-weight-bold text-primary">
                已提现佣金金额
              </div>
              <div class="text-body1">
                分佣商通过分销产生的佣金，申请提现并成功到账金额，大于等于设置总额，即满足条件。
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
        <q-btn
          unelevated
          label="保存"
          :disable="addButtonDisabled"
          color="primary"
          class="q-px-xl"
          @click="setData"
        />
        <q-btn unelevated label="返回" class="q-px-xl" color="grey" :to="{ name: 'marketLevel' }" />
      </div>
    </div>
    <select-market-package ref="selectPackageRef" v-if="packagePoppupStatus" @dataList="hidePackagePoppup" />
  </q-page>
</template>
<script>
import SelectMarketPackage from './SelectMarketPackage'
export default {
  name: 'marketAddLevel',
  components: {
    SelectMarketPackage
  },
  data () {
    return {
      useCaption: false,
      addButtonDisabled: false,
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      packagePoppupStatus: false,
      giveTab: '0',
      packageType: 'bind',
      configData: {
        pmc_level: ''
      },
      defaultLevel: false,
      levelData: {
        pml_weights: '',
        pml_name: '',
        pml_type: 1,
        pml_status: 1,
        pml_upgrade_property: [],
        pml_order_amount: '',
        pml_order_quantity: '',
        pml_one_order_amount: '',
        pml_one_order_quantity: '',
        pml_self_order_amount: '',
        pml_self_order_quantity: '',
        pml_son_member_quantity: '',
        pml_son_market_quantity: '',
        pml_one_member_quantity: '',
        pml_one_market_quantity: '',
        pml_take_market_amount: ''
      },

      newBindPackageData: [],
      newFirstConsumePackageData: [],
      newConsumePackageData: [],
      oneBindPackageData: [],
      oneFirstConsumePackageData: [],
      oneConsumePackageData: [],
      twoBindPackageData: [],
      twoFirstConsumePackageData: [],
      twoConsumePackageData: [],
      threeBindPackageData: [],
      threeFirstConsumePackageData: [],
      threeConsumePackageData: [],
      levelOptions: [],
      tagList: this.$store.state.market.tagList,
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
      ]
    }
  },
  created () {
    this.getConfigList()
    if (!this.levelData.pml_weights) {
      this.getLevelOption()
    }
  },
  mounted () {
    if (parseInt(this.$route.query.id) > 0) {
      this.init(this.$route.query.id)
    }
  },
  computed: {},
  methods: {
    getConfigList () {
      this.$store
        .dispatch('market/getConfigData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : this.configData
            this.configData.pmc_level = res.data ? parseInt(res.data.pmc_level) : ''
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
    getLevelOption (defaultLevel) {
      const params = {
        weights: this.levelData.pml_weights,
        default: defaultLevel
      }
      this.$store
        .dispatch('market/getLevelOption', params)
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
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('market/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.levelData = res.data.level ? res.data.level : {}
              this.levelData.pml_weights = res.data.level.pml_weights ? parseInt(res.data.level.pml_weights) : ''
              this.levelData.pml_type = res.data.level.pml_type ? parseInt(res.data.level.pml_type) : ''
              this.levelData.pml_status = res.data.level.pml_status ? parseInt(res.data.level.pml_status) : ''
              this.levelData.pml_upgrade_property = res.data.level.pml_upgrade_property
                ? res.data.level.pml_upgrade_property.split(',').map(Number)
                : []
              this.newBindPackageData = res.data.newBindPackageData ? res.data.newBindPackageData : []
              this.newFirstConsumePackageData = res.data.newFirstConsumePackageData ? res.data.newFirstConsumePackageData : []
              this.newConsumePackageData = res.data.newConsumePackageData ? res.data.newConsumePackageData : []
              this.oneBindPackageData = res.data.oneBindPackageData ? res.data.oneBindPackageData : []
              this.oneFirstConsumePackageData = res.data.oneFirstConsumePackageData ? res.data.oneFirstConsumePackageData : []
              this.oneConsumePackageData = res.data.oneConsumePackageData ? res.data.oneConsumePackageData : []
              this.twoBindPackageData = res.data.twoBindPackageData ? res.data.twoBindPackageData : []
              this.twoFirstConsumePackageData = res.data.twoFirstConsumePackageData ? res.data.twoFirstConsumePackageData : []
              this.twoConsumePackageData = res.data.twoConsumePackageData ? res.data.twoConsumePackageData : []
              this.threeBindPackageData = res.data.threeBindPackageData ? res.data.threeBindPackageData : []
              this.threeFirstConsumePackageData = res.data.threeFirstConsumePackageData ? res.data.threeFirstConsumePackageData : []
              this.threeConsumePackageData = res.data.threeConsumePackageData ? res.data.threeConsumePackageData : []
              if (parseInt(this.levelData.pml_weights) == 0) {
                this.getLevelOption(true)
              } else {
                this.getLevelOption()
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
            if (this.levelData.pml_upgrade_property.length == 0) {
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

          if (this.defaultLevel == false) {
            this.levelData.pml_weights = 0
          }
          this.addButtonDisabled = true
          const params = {
            ...this.levelData,
            newBindPackageData: this.newBindPackageData,
            newFirstConsumePackageData: this.newFirstConsumePackageData,
            newConsumePackageData: this.newConsumePackageData,
            oneBindPackageData: this.oneBindPackageData,
            oneFirstConsumePackageData: this.oneFirstConsumePackageData,
            oneConsumePackageData: this.oneConsumePackageData,
            twoBindPackageData: this.twoBindPackageData,
            twoFirstConsumePackageData: this.twoFirstConsumePackageData,
            twoConsumePackageData: this.twoConsumePackageData,
            threeBindPackageData: this.threeBindPackageData,
            threeFirstConsumePackageData: this.threeFirstConsumePackageData,
            threeConsumePackageData: this.threeConsumePackageData
          }
          this.$store
            .dispatch('market/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.levelData.id > 0 ? '修改' : '新增'}` + '分佣等级成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({ name: 'marketLevel' })
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
    // 选中的标签
    pushSelectedCondition (item) {
      const conditionPosition = this.levelData.pml_upgrade_property.indexOf(item.value)
      if (conditionPosition >= 0) {
        this.levelData.pml_upgrade_property.splice(conditionPosition, 1)
      } else {
        this.levelData.pml_upgrade_property.unshift(item.value)
      }
    },
    delSelectData (key) {
      switch (key) {
        case 1:
          this.levelData.pml_order_amount = ''
          break
        case 2:
          this.levelData.pml_order_quantity = ''
          break
        case 3:
          this.levelData.pml_one_order_amount = ''
          break
        case 4:
          this.levelData.pml_one_order_quantity = ''
          break
        case 5:
          this.levelData.pml_self_order_amount = ''
          break
        case 6:
          this.levelData.pml_self_order_quantity = ''
          break
        case 7:
          this.levelData.pml_son_member_quantity = ''
          break
        case 8:
          this.levelData.pml_son_market_quantity = ''
          break
        case 9:
          this.levelData.pml_one_member_quantity = ''
          break
        case 10:
          this.levelData.pml_one_market_quantity = ''
          break
        case 11:
          this.levelData.pml_take_market_amount = ''
          break
        default:
          return false
      }
      const conditionPosition = this.levelData.pml_upgrade_property.indexOf(key)
      this.levelData.pml_upgrade_property.splice(conditionPosition, 1)
    },
    showPackage (type) {
      this.packageType = type
      this.packagePoppupStatus = true
    },
    hidePackagePoppup (data) {
      if (parseInt(this.giveTab) == 0 && data) {
        if (this.packageType == 'bind') {
          this.newBindPackageData = this.newBindPackageData.concat(data)
        }
        if (this.packageType == 'first') {
          this.newFirstConsumePackageData = this.newFirstConsumePackageData.concat(data)
        }
        if (this.packageType == 'consume') {
          this.newConsumePackageData = this.newConsumePackageData.concat(data)
        }
      }
      if (parseInt(this.giveTab) == 1 && data) {
        if (this.packageType == 'bind') {
          this.oneBindPackageData = this.oneBindPackageData.concat(data)
        }
        if (this.packageType == 'first') {
          this.oneFirstConsumePackageData = this.oneFirstConsumePackageData.concat(data)
        }
        if (this.packageType == 'consume') {
          this.oneConsumePackageData = this.oneConsumePackageData.concat(data)
        }
      }
      if (parseInt(this.giveTab) == 2 && data) {
        if (this.packageType == 'bind') {
          this.twoBindPackageData = this.twoBindPackageData.concat(data)
        }
        if (this.packageType == 'first') {
          this.twoFirstConsumePackageData = this.twoFirstConsumePackageData.concat(data)
        }
        if (this.packageType == 'consume') {
          this.twoConsumePackageData = this.twoConsumePackageData.concat(data)
        }
      }
      if (parseInt(this.giveTab) == 3 && data) {
        if (this.packageType == 'bind') {
          this.threeBindPackageData = this.threeBindPackageData.concat(data)
        }
        if (this.packageType == 'first') {
          this.threeFirstConsumePackageData = this.threeFirstConsumePackageData.concat(data)
        }
        if (this.packageType == 'consume') {
          this.threeConsumePackageData = this.threeConsumePackageData.concat(data)
        }
      }
      this.packagePoppupStatus = false
    },
    delPackage (key, type) {
      if (parseInt(this.giveTab) == 0) {
        if (type == 'bind') {
          this.newBindPackageData.splice(key, 1)
        }
        if (type == 'first') {
          this.newFirstConsumePackageData.splice(key, 1)
        }
        if (type == 'consume') {
          this.newConsumePackageData.splice(key, 1)
        }
      }
      if (parseInt(this.giveTab) == 1) {
        if (type == 'bind') {
          this.oneBindPackageData.splice(key, 1)
        }
        if (type == 'first') {
          this.oneFirstConsumePackageData.splice(key, 1)
        }
        if (type == 'consume') {
          this.oneConsumePackageData.splice(key, 1)
        }
      }
      if (parseInt(this.giveTab) == 2) {
        if (type == 'bind') {
          this.twoBindPackageData.splice(key, 1)
        }
        if (type == 'first') {
          this.twoFirstConsumePackageData.splice(key, 1)
        }
        if (type == 'consume') {
          this.twoConsumePackageData.splice(key, 1)
        }
      }
      if (parseInt(this.giveTab) == 3) {
        if (type == 'bind') {
          this.threeBindPackageData.splice(key, 1)
        }
        if (type == 'first') {
          this.threeFirstConsumePackageData.splice(key, 1)
        }
        if (type == 'consume') {
          this.threeConsumePackageData.splice(key, 1)
        }
      }
    },
    // 获取次卡商品名
    getCountName (item) {
      let countName = ''
      if (item) {
        item.forEach(function (value, index) {
          if (index == 0) {
            countName += value.grc_goodsName + '(' + value.grc_count + ')'
          } else {
            countName += ',' + value.grc_goodsName + '(' + value.grc_count + ')'
          }
        })
        return countName
      }
      return ''
    },
    // 获取时卡商品名
    getTimingName (item) {
      let timingName = ''
      if (item) {
        item.forEach(function (value, index) {
          if (index == 0) {
            timingName += value.tgd_goods_name + '(' + value.tgd_time_compute_duration + '分钟' + ')'
          } else {
            timingName += ',' + value.tgd_goods_name + '(' + value.tgd_time_compute_duration + '分钟' + ')'
          }
        })
        return timingName
      }
      return ''
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
