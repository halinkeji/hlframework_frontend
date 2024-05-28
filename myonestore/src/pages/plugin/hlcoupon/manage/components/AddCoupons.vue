<template>
  <q-page class="fit">
    <q-form ref="couponsDataRef" class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        卡券{{ $route.query.type == 'edit' ? '编辑' : '新增' }}
      </div>
      <div class="col-shrink full-height q-mt-xs">
        <q-scroll-area class="fit full-height">
          <q-card flat bordered square class="rounded-borders">
            <q-card-section class="q-pa-xs q-px-md">
              <div class="text-subtitle2">基本信息</div>
            </q-card-section>
            <q-separator />

            <q-card-section class="row q-pa-sm">
              <div class="col-11 row q-col-gutter-sm">
                <div class="col-12 col-md-3">
                  <q-input
                    label="排序"
                    outlined
                    bottom-slots
                    :rules="[(val) => /^\d+$/.test(val) || '排序为非负整数']"
                    v-model="dataForm.cou_sort"
                    dense
                  >
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="dataForm.cou_status"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    :options="push"
                    outlined
                    dense
                    label="是否上架"
                    color="primary"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input outlined bottom-slots label="卡券标题" v-model="dataForm.cou_title" dense :rules="[(val) => !!val || '卡券标题是必填项']">
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-input outlined bottom-slots label="卡券副标题（可选）" v-model="dataForm.cou_sub_title" dense> </q-input>
                </div>

                <div class="col-12 col-md-3">
                  <q-input
                    outlined
                    bottom-slots
                    label="库存"
                    v-model="dataForm.cou_quantity"
                    dense
                    :rules="[(val) => !!val || '库存是必填项', (val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '库存只能是大于0的正整数']"
                  >
                    <template v-slot:hint> 说明：核销或者使用后扣除库存 </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-input outlined v-model="dataForm.cou_color" label="卡券颜色" dense>
                    <template v-slot:prepend>
                      <q-icon name="ion-color-palette" class="cursor-pointer">
                        <q-menu>
                          <q-color v-model="dataForm.cou_color" class="q-ml-md full-width"> </q-color>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    outlined
                    :rules="[(val) => !!val || '限领数量是必填项', (val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '限领数量只能是大于0的正整数']"
                    bottom-slots
                    v-model="dataForm.cou_get_limit"
                    dense
                    label="限领数量"
                  >
                    <template v-slot:append>
                      <div class="q-pl-none">
                        <span class="text-subtitle1">张</span>
                      </div>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-3">
                  <q-input outlined label="使用须知" bottom-slots type="textarea" rows="2" v-model="dataForm.cou_description" dense> </q-input>
                </div>
              </div>

              <div class="col text-center">
                <hl-upload
                  :multiple="false"
                  :currentAttach="dataForm.logoImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        dataForm.cou_logo = val;
                      });
                    }
                  "
                  currentTitle="卡券LOGO"
                />
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered square class="rounded-borders q-mt-xs">
            <q-card-section class="q-pa-xs q-px-md">
              使用设置
              <q-btn dense icon="las la-question-circle" color="warning" flat unelevated round @click="useCaption = true">
                <q-tooltip>使用说明</q-tooltip>
              </q-btn>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col">
                  <q-select
                    v-model="dataForm.cou_type"
                    outlined
                    dense
                    label="卡券类型"
                    :disable="$route.query.type == 'edit'"
                    :options="couponType"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                  />
                </div>

                <div class="col" v-if="dataForm.cou_type == 1">
                  <q-input
                    outlined
                    bottom-slots
                    :disable="$route.query.type == 'edit'"
                    label="折扣百分比"
                    v-model="dataForm.cou_rebate"
                    dense
                    :rules="[
                      (val) => (val >= 1 && val <= 100) || '请输入正确的折扣百分比格式',
                      (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                    ]"
                  >
                    <template v-slot:append v-if="dataForm.cou_type == 1">
                      <div class="q-pl-none">
                        <span class="text-subtitle1">%</span>
                      </div>
                    </template>
                    <template v-slot:hint v-if="dataForm.cou_type == 1"> 示例：填30就是3折，范围1~100。 </template>
                  </q-input>
                </div>

                <div class="col items-center row q-col-gutter-sm" v-if="dataForm.cou_type == 2">
                  <q-input
                    :disable="$route.query.type == 'edit'"
                    v-model="dataForm.cou_fill"
                    :rules="[
                      (val) => !!val || '必填项',
                      (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的数量',
                    ]"
                    outlined
                    bottom-slots
                    dense
                  >
                    <template v-slot:prepend>
                      <span class="text-subtitle1">满</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-subtitle1">
                        {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}
                      </span>
                    </template>
                  </q-input>

                  <q-input
                    :rules="[
                      (val) => !!val || '必填项',
                      (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的数量',
                    ]"
                    v-model="dataForm.cou_minus"
                    outlined
                    bottom-slots
                    dense
                    :disable="$route.query.type == 'edit'"
                  >
                    <template v-slot:prepend>
                      <span class="text-subtitle1">减</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-subtitle1">
                        {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}
                      </span>
                    </template>
                  </q-input>
                </div>

                <div class="col" v-if="dataForm.cou_type == 3 || dataForm.cou_type == 4 || dataForm.cou_type == 5">
                  <q-input
                    outlined
                    bottom-slots
                    :disable="$route.query.type == 'edit'"
                    label="优惠价"
                    v-model="dataForm.cou_discount_set"
                    dense
                    :rules="[
                    (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入保留两位小数的数字',
                    (val) => goodsTotalPrice >= val || '优惠价应小于商品参考价小计',

                    ]"
                  >
                  </q-input>
                </div>

                <div class="col" v-if="dataForm.cou_type == 3">
                  <q-input
                    :disable="$route.query.type == 'edit'"
                    outlined
                    label="礼品券说明"
                    bottom-slots
                    type="textarea"
                    :rows="2"
                    v-model="dataForm.cou_extra"
                    dense
                  >
                  </q-input>
                </div>

                <div class="col" v-if="dataForm.cou_type == 4">
                  <q-input
                    outlined
                    label="团购券详情"
                    :disable="$route.query.type == 'edit'"
                    bottom-slots
                    type="textarea"
                    :rows="2"
                    v-model="dataForm.cou_extra"
                    dense
                  >
                  </q-input>
                </div>

                <div class="col" v-if="dataForm.cou_type == 5">
                  <q-input
                    outlined
                    bottom-slots
                    :disable="$route.query.type == 'edit'"
                    label="优惠券详情"
                    type="textarea"
                    v-model="dataForm.cou_extra"
                    dense
                  >
                  </q-input>
                </div>

                <div class="col" v-if="dataForm.cou_type == 6">
                  <q-input
                    outlined
                    bottom-slots
                    :label="'会员获得' + `${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}`"
                    v-model="dataForm.cou_give_integral"
                    :disable="$route.query.type == 'edit'"
                    dense
                    :rules="[
                      (val) => !!val || '必填项',
                      (val) =>
                        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) ||
                        '请输入正确的' + `${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}`,
                    ]"
                  >
                  </q-input>
                </div>

                <div class="col" v-if="dataForm.cou_type == 7">
                  <q-input
                    outlined
                    bottom-slots
                    :label="`会员获得${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
                    v-model="dataForm.cou_give_balance"
                    :disable="$route.query.type == 'edit'"
                    dense
                    :rules="[
                      (val) => !!val || '必填项',
                      (val) =>
                        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) ||
                        '请输入正确的' + $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit,
                    ]"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-12 col-md-6 q-pr-sm">
                  <q-select
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    v-model="dataForm.cou_couponProperty"
                    :options="couponProp"
                    color="primary"
                    outlined
                    dense
                    label="卡券属性"
                    :disable="$route.query.type == 'edit'"
                  />
                </div>
              </div>
              <div class="row q-mt-sm q-col-gutter-xs">
                <div v-if="dataForm.cou_couponProperty == 2 || dataForm.cou_couponProperty == 5" class="col-12 col-md-4">
                  <q-input
                    outlined
                    bottom-slots
                    :label="`${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit}支付`"
                    v-model="dataForm.cou_use_balance"
                    dense
                    :rules="[
                      (val) => !!val || $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit + '支付是必填项',
                      (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的数字',
                    ]"
                  >
                  </q-input>
                </div>
                <div v-if="dataForm.cou_couponProperty == 4 || dataForm.cou_couponProperty == 5" class="col-12 col-md-4">
                  <q-input
                    outlined
                    label="支付金额"
                    bottom-slots
                    v-model="dataForm.cou_use_amount"
                    dense
                    :rules="[
                      (val) => !!val || '支付金额是必填项',
                      (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的金额',
                    ]"
                  >
                  </q-input>
                </div>
                <div v-if="dataForm.cou_couponProperty == 3 || dataForm.cou_couponProperty == 5" class="col-12 col-md-4">
                  <q-input
                    outlined
                    bottom-slots
                    :label="`${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}支付`"
                    v-model="dataForm.cou_use_integral"
                    dense
                    :rules="[
                      (val) =>
                        !!val || `${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}` + '支付是必填项',
                      (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的数字',
                    ]"
                  >
                  </q-input>
                </div>
              </div>

              <div class="row q-mt-sm">
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section class="q-pa-sm">
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ limitCouponTypeArr.indexOf(dataForm.cou_type) > -1 ? '请选择关联商品' : '可选择指定商品可用' }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn color="primary" unelevated @click="setSpecifyGoods" label="选择" />
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                    <q-separator v-if="bindProperty && bindProperty.goodsList && bindProperty.goodsList.length > 0" />
                    <q-card-section class="q-pa-none" v-if="bindProperty && bindProperty.goodsList && bindProperty.goodsList.length > 0">
                      <q-list separator >
                        <q-item class="q-pa-sm" :key="key" v-for="(item, key) in bindProperty.goodsList">
                          <q-item-section>
                            <q-item-label>名称：{{ item.goodsName }} <span v-if="item.specId > 0">-{{ item.specificationName }}</span>
                            </q-item-label>
                            <q-item-label>
                              价格：
                              <span class="text-orange">
                                {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                              </span>
                              <span class="text-h6 text-orange text-weight-bold">{{ item.goodsPrice }}</span>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section top side>
                            <q-btn round color="red" flat icon="las la-times-circle" @click="delGoods(key)" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                    <q-separator v-if="bindProperty && bindProperty.goodsList && bindProperty.goodsList.length > 0" />
                    <q-card-actions v-if="bindProperty && bindProperty.goodsList && bindProperty.goodsList.length > 0">
                      <q-item>
                        <q-item-section>
                          <q-item-label>商品参考价小计</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label>
                            <span class="text-orange">
                              {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                            </span>
                            <span class="text-h6 text-orange text-weight-bold">{{ goodsTotalPrice }}</span>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-card-actions>
                  </q-card>

                  <hl-specification-tree
                    ref="specificationTree"
                    v-show="showGoodsList"
                    @getSelectedGoodsData="getSelectedGoodsData"
                    @closeDialog="showGoodsList = false"
                  ></hl-specification-tree>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm" v-if="parseInt(dataForm.cou_couponProperty) == 8">
            <div class="q-pa-xs">
              <div class="text-subtitle2">营销推广</div>
              <div class="text-caption">提交审核后不可修改营销推广</div>
            </div>
            <q-separator />
            <div class="row q-pt-md q-col-gutter-sm">

              <div class="col-4">
                <q-input
                  label="推广数量"
                  outlined
                  bottom-slots
                  :rules="[
                    (val) => /^\d+$/.test(val) || '请输入正确的数量',
                    (val) => !!(parseInt(val) <= parseInt(dataForm.cou_quantity)) || '推广数量不能大于库存',
                  ]"
                  v-model="merchantForm.pc_market_quantity"
                  dense
                  :disable="merchantFormDisable"
                >
                </q-input>
              </div>

              <div class="col-4">
                <q-input
                  label="服务费"
                  outlined
                  bottom-slots
                  :rules="[
                    (val) => !!val || '必填项',
                    (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的数量',
                  ]"
                  v-model="merchantForm.pc_service_money"
                  dense
                  :disable="merchantFormDisable"
                  hint="说明：建议服务费大于等于1元/张卡券"
                >
                </q-input>
              </div>
            </div>
          </q-card>
          <q-card flat bordered square class="rounded-borders q-mt-xs">
            <q-card-section class="q-pa-xs q-px-md">
              <div class="text-subtitle2">时间规则</div>
            </q-card-section>
            <q-separator />

            <div class="row">
              <q-card-section class="col items-center q-col-gutter-sm q-pa-sm">
                <q-item>
                  <q-item-section side>
                    <q-item-label class="text-dark">有效期</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-option-group v-model="dataForm.cou_dateType" :options="optionsTre" color="primary" inline />
                  </q-item-section>
                </q-item>

                <div class="row q-col-gutter-sm">
                  <div class="col" v-if="dataForm.cou_dateType == 1">
                    <q-input outlined v-model="dataForm.cou_startTime" label="开始时间" :rules="[(val) => !!val || '请选择时间']" dense readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="dataForm.cou_startTime" mask="YYYY-MM-DD HH:mm" today-btn>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="关闭" color="primary" flat />
                              </div>
                            </q-date>
                          </q-menu>
                        </q-icon>
                      </template>
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-time v-model="dataForm.cou_startTime" mask="YYYY-MM-DD HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col" v-if="dataForm.cou_dateType == 1">
                    <q-input outlined v-model="dataForm.cou_endTime" label="结束时间" :rules="[(val) => !!val || '请选择时间']" dense readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="dataForm.cou_endTime" mask="YYYY-MM-DD HH:mm" today-btn>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="关闭" color="primary" flat />
                              </div>
                            </q-date>
                          </q-menu>
                        </q-icon>
                      </template>
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-time v-model="dataForm.cou_endTime" mask="YYYY-MM-DD HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col" v-if="dataForm.cou_dateType == 2">
                    <q-item class="full-width q-pa-none">
                      <q-item-section>
                        <q-input
                          v-model="dataForm.cou_limit_day_after_valid"
                          hint="填 ‘0’ 为领取后立即生效 "
                          label="领取后第"
                          bottom-slots
                          outlined
                          dense
                        >
                          <template v-slot:append>
                            <span class="text-dark text-subtitle2">天生效</span>
                          </template>
                        </q-input>
                      </q-item-section>

                      <q-item-section>
                        <q-input v-model="dataForm.cou_startDay" bottom-slots outlined label="自生效后:" dense> </q-input>
                      </q-item-section>

                      <q-item-section>
                        <q-select
                          outlined
                          dense
                          emit-value
                          map-options
                          v-model="dataForm.cou_endDay"
                          :options="timeOptions"
                          label="内有效"
                          placeholder="选择范围"
                          :rules="[(val) => !!val || '请选择类型']"
                        >
                        </q-select>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-card-section>
              <q-separator vertical inset />
              <q-card-section class="col items-center q-col-gutter-sm q-pa-sm">
                <q-item>
                  <q-item-section side>
                    <q-item-label class="text-dark">限时展示时间</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-option-group v-model="dataForm.cou_timing_show_mode" :options="optionsShowOptions" color="primary" inline />
                  </q-item-section>
                </q-item>

                <q-item v-if="parseInt(dataForm.cou_timing_show_mode) == 2">
                  <q-item-section side>
                    <q-item-label class="text-dark">指定日期</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-option-group v-model="dataForm.cou_show_week_set" :options="weekOptions" type="checkbox" color="primary" inline />
                  </q-item-section>
                </q-item>

                <div class="col-12 row q-col-gutter-sm">
                  <div class="col-auto" v-if="dataForm.cou_timing_show_mode != 0">
                    <q-input
                      outlined
                      v-model="dataForm.cou_show_start_time"
                      :rules="[(val) => !!val || '请选择时间']"
                      label="开始时间"
                      dense
                      readonly
                    >
                      <template v-slot:prepend>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-time v-model="dataForm.cou_show_start_time" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-auto" v-if="dataForm.cou_timing_show_mode != 0">
                    <q-input outlined v-model="dataForm.cou_show_end_time" :rules="[(val) => !!val || '请选择时间']" label="结束时间" dense readonly>
                      <template v-slot:prepend>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-time v-model="dataForm.cou_show_end_time" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-card>
        </q-scroll-area>
      </div>
      <q-dialog v-model="useCaption">
        <q-card
          :style="{
            width: parseInt(this.$q.screen.width * 0.5) + 'px',
            'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
            height: parseInt(this.$q.screen.width * 0.7) + 'px',
          }"
        >
          <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
            <div class="col-shrink bg-white row q-px-xs q-pa-sm">
              <div class="text-subtitle1">使用说明</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </div>

            <div class="col-shrink q-pa-sm full-height">
              <q-scroll-area class="fit full-height q-pa-sm">
                <div class="text-subtitle1">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  卡券类型说明
                </div>
                <q-separator />
                <div class="text-subtitle1 text-weight-bold text-primary">折扣券</div>
                <div class="text-body1">
                  选择折扣券类型时，需要填写折扣百分比。会员领取后可在收银台进行选择使用。例如：设置90%（9折），会员本次应付100元，100-（100 * 90%）=
                  10元 本次优惠10元实付90元
                </div>

                <div class="text-subtitle1 text-weight-bold text-primary">代金券</div>
                <div class="text-body1">
                  选择代金券类型时，需要填写满足金额与优惠金额（优惠金额不能大于满足金额）。会员领取后可在收银台进行选择使用。例如：设置满 100 减 10
                  元，会员本次应付200元，200 - 10 = 190元 本次优惠10元实付190元
                </div>

                <div class="text-subtitle1 text-weight-bold text-primary">礼品券</div>
                <div class="text-body1">
                  选择礼品券类型时，需要绑定指定商品（可绑定多条商品）。会员领取后可在消费收银功能通过购买的商品进行指定使用（商品价格归零）。
                </div>
                <div class="text-subtitle1 text-weight-bold text-primary">团购券</div>
                <div class="text-body1">
                  选择团购券类型时，需要绑定指定商品（可绑定多条商品），并设置团购价。会员领取后可在消费收银功能通过购买的商品进行指定使用（原价变为团购价）。
                </div>
                <div class="text-subtitle1 text-weight-bold text-primary">优惠券</div>
                <div class="text-body1">选择优惠券类型时，需要填写优惠详情。会员领取后根据优惠详情享受相关权益。</div>

                <div class="text-subtitle1 text-weight-bold text-primary">积分券</div>
                <div class="text-body1">选择积分券类型时，需要填写会员获得积分。卡券核销后自动为会员增加所设置积分。</div>

                <div class="text-subtitle1 text-weight-bold text-primary">储值券</div>
                <div class="text-body1">选择储值券类型时，需要填写会员获得储值。卡券核销后自动为会员增加所设置储值。</div>

                <div class="text-subtitle1 q-mt-sm">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  卡券属性说明
                </div>
                <q-separator />
                <div class="text-subtitle1 text-weight-bold text-primary">免费领取</div>
                <div class="text-body1">选择免费领取属性时，会员可在移动端（微信公众号、小程序）优惠券功能内，未领取列表，进行免费领取。</div>

                <div class="text-subtitle1 text-weight-bold text-primary">储值购买</div>
                <div class="text-body1">
                  选择储值购买属性时，需要设置储值支付金额。会员可在移动端（微信公众号、小程序）优惠券功能内，未领取列表，使用相应储值进行卡券购买。
                </div>
                <div class="text-subtitle1 text-weight-bold text-primary">积分兑换</div>
                <div class="text-body1">
                  选择积分兑换属性时，需要设置积分支付总额。会员可在移动端（微信公众号、小程序）优惠券功能内，未领取列表，使用相应积分进行卡券兑换。
                </div>

                <div class="text-subtitle1 text-weight-bold text-primary">主动购买</div>
                <div class="text-body1">
                  选择主动购买属性时，需要设置购买金额。会员可在移动端（微信公众号、小程序）优惠券功能内，未领取列表，通过在线支付进行卡券购买。
                </div>
                <div class="text-subtitle1 text-weight-bold text-primary">混合领取</div>
                <div class="text-body1">
                  选择混合领取属性时，需要同时设置“购买金额、储值支付、积分支付”三项参数。会员可在移动端（微信公众号、小程序）优惠券功能内，未领取列表，进行卡券购买。
                </div>

                <div class="text-subtitle1 text-weight-bold text-primary">其他属性</div>
                <div class="text-body1">
                  选择其他属性时，可在其他插件或功能进行绑定使用。例如：【开卡营销】插件，创建开卡套餐时可选择该属性卡券进行绑定。
                </div>

                <div class="text-subtitle1 text-weight-bold text-primary">主动群发</div>
                <div class="text-body1">选择主动群发属性时，可在PC端卡券管理列表进行批量群发卡券（可指定会员、指定会员组）。</div>
              </q-scroll-area>
            </div>

            <q-card-actions align="center">
              <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
            </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
      <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated label="提交" @click="saveBut()" color="primary" class="q-px-xl" />
        <q-btn unelevated label="返回" type="reset" :to="{ name: 'hlCoupon' }" color="grey" class="q-px-xl" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'AddCoupons',
  components: {},
  data () {
    return {
      push: [
        {
          label: '上架',
          value: 1
        },
        {
          label: '下架',
          value: 2
        }
      ],
      couponType: this.$store.state.hlCoupon.typeData,
      couponProp: this.$store.state.hlCoupon.propertyData,
      increase: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        }
      ],
      optionsTre: [
        {
          label: '固定日期',
          value: 1
        },
        {
          label: '相对日期',
          value: 2
        }
      ],

      optionsShowOptions: [
        {
          label: '关闭',
          value: 0
        },
        {
          label: '每日',
          value: 1
        },
        {
          label: '每周',
          value: 2
        }
      ],
      multiple: false,
      weekOptions: [
        {
          label: '周日',
          value: 0
        },
        {
          label: '周一',
          value: 1
        },
        {
          label: '周二',
          value: 2
        },
        {
          label: '周三',
          value: 3
        },
        {
          label: '周四',
          value: 4
        },
        {
          label: '周五',
          value: 5
        },
        {
          label: '每六',
          value: 6
        }
      ],
      dataForm: {
        cou_color: '#FF00FF',
        id: '',
        cou_type: 1,
        cou_couponProperty: 1,
        cou_title: '',
        cou_sub_title: '',
        cou_description: '',
        cou_dateType: 1,
        cou_startTime: this.$q_date.formatDate(new Date().getTime(), 'YYYY-MM-DD HH:mm'),
        cou_endTime: this.$q_date.formatDate(new Date().getTime(), 'YYYY-MM-DD HH:mm'),
        cou_logo: '',
        cou_startDay: 1,
        cou_endDay: 1,

        cou_limit_day_after_valid: 0,

        cou_discount_set: '',
        cou_show_start_time: '',
        cou_show_end_time: '',
        cou_timing_show_mode: 0,
        cou_show_week_set: [],

        cou_quantity: 300,
        cou_get_limit: 1,
        cou_status: 1,
        cou_rebate: '',
        cou_fill: '',
        cou_minus: '',
        cou_extra: '',
        cou_use_amount: '',
        cou_use_integral: '',
        cou_use_balance: '',
        cou_give_integral: '',
        cou_give_balance: '',
        cou_sort: 0
      },
      disabledStatus: false,
      couponsId: 0,
      bindProperty: {
        goodsList: []
      },
      showGoodsList: false,
      useCaption: false,
      timeOptions: [
        {
          value: 1,
          label: '年'
        },
        {
          value: 2,
          label: '季度'
        },
        {
          value: 3,
          label: '月'
        },
        {
          value: 4,
          label: '周'
        },
        {
          value: 5,
          label: '天'
        },
        {
          value: 6,
          label: '小时'
        }
      ],

      merchantForm: {
        pc_market_status: '1',
        pc_service_money: '',
        pc_market_quantity: '',
        pc_market_type: 'm'
      },
      marketStatusOption: [
        {
          label: '创建中',
          value: '1'
        },
        {
          label: '提交审核',
          value: '2'
        }
      ],
      merchantFormDisable: false,
      goodsTotalPrice: 0,
      limitCouponTypeArr: [3, 4, 5]
    }
  },

  created () {
    this.couponsId = this.$route.query.id
    if (this.couponsId > 0) {
      this.getItemData()
    }
  },
  mounted () {},
  computed: {},
  methods: {
    // 获取单条数据
    getItemData () {
      const obj = {
        id: this.couponsId
      }
      this.$store
        .dispatch('hlCoupon/getItemData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data
            this.dataForm.cou_startTime = this.$q_date.formatDate(this.dataForm.cou_startTime * 1000, 'YYYY-MM-DD HH:mm')
            this.dataForm.cou_endTime = this.$q_date.formatDate(this.dataForm.cou_endTime * 1000, 'YYYY-MM-DD HH:mm')
            this.dataForm.cou_status = parseInt(this.dataForm.cou_status)
            this.dataForm.cou_couponProperty = parseInt(this.dataForm.cou_couponProperty)

            this.dataForm.cou_dateType = parseInt(this.dataForm.cou_dateType)
            this.dataForm.cou_type = parseInt(this.dataForm.cou_type)
            this.dataForm.cou_startDay = parseInt(this.dataForm.cou_startDay)
            this.dataForm.cou_endDay = parseInt(this.dataForm.cou_endDay)

            this.dataForm.cou_timing_show_mode = parseInt(this.dataForm.cou_timing_show_mode)

            if (res.data.bindProperty) {
              this.bindProperty = res.data.bindProperty
            }

            this.$nextTick(() => {
              this.getTotalAmount()
            })
            if (res.data.pmerchantMarket) {
              this.merchantForm = res.data.pmerchantMarket && res.data.pmerchantMarket.id ? res.data.pmerchantMarket : {}
              if (this.$route.query.type == 'edit') {
                this.merchantFormDisable = !!(res.data.pmerchantMarket && res.data.pmerchantMarket.pc_market_status && (parseInt(res.data.pmerchantMarket.pc_market_status) == 3 || parseInt(res.data.pmerchantMarket.pc_market_status) == 2))

                if (res.data.pmerchantMarket && res.data.pmerchantMarket.pc_market_status && parseInt(res.data.pmerchantMarket.pc_market_status) == 3) {
                  this.marketStatusOption.push({
                    label: '推广中',
                    value: '3'
                  })
                }
              }
              if (this.$route.query.type == 'copy') {
                this.merchantForm.pc_market_status = '1'
              }
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
    // 保存
    saveBut () {
      this.$refs.couponsDataRef.validate().then((success) => {
        if (success) {
          this.disabledStatus = true
          const startTime = this.$q_date.formatDate(this.dataForm.cou_startTime, 'X')
          const endTime = this.$q_date.formatDate(this.dataForm.cou_endTime, 'X')
          if (endTime < startTime) {
            this.$q.notify({
              message: '失败',
              caption: '结束时间不得大于开始时间,请重新选择',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          if (this.limitCouponTypeArr.indexOf(this.dataForm.cou_type) > -1) {
            if (!(this.bindProperty && this.bindProperty.goodsList && this.bindProperty.goodsList.length > 0)) {
              this.$q.notify({
                message: '失败',
                caption: '请选择关联商品',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              return false
            }
          }
          this.merchantForm.pc_market_last_quantity = this.merchantForm.pc_market_quantity
          const obj = {
            ...this.dataForm,
            id: this.$route.query.type == 'edit' ? this.$route.query.id : 0,
            cou_startTime: startTime,
            cou_endTime: endTime,
            bindProperty: this.bindProperty,
            merchantForm: this.merchantForm
          }
          this.$store
            .dispatch('hlCoupon/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '添加成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.disabledStatus = false
                this.$router.push({ name: 'hlCoupon' })
              }
            })
            .catch((error) => {
              this.disabledStatus = false
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
    },

    setSpecifyGoods () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1])
        }, 500)
      })
    },

    // 获取商品小计
    getTotalAmount () {
      const that = this
      if (that.bindProperty && that.bindProperty.goodsList && that.bindProperty.goodsList.length > 0) {
        const goodsList = that.bindProperty.goodsList

        let goodsTotalPrice = 0
        goodsList.forEach(function (item) {
          goodsTotalPrice += that.formatAmount(item.goodsPrice)
        })

        this.goodsTotalPrice = goodsTotalPrice
      } else {
        this.goodsTotalPrice = 0
      }
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      const that = this
      this.showGoodsList = status
      let goodsList = []

      if (that.bindProperty && that.bindProperty.goodsList) {
        goodsList = that.bindProperty.goodsList
      }

      for (let i = 0; i < data.length; i++) {
        if (
          _.findIndex(goodsList, function (o) {
            return o.goodsId == data[i].goods_id && o.specId == data[i].id
          }) < 0
        ) {
          goodsList.push({
            goodsId: data[i].goods_id,
            specId: data[i].id,
            goodsName: data[i].goo_name,
            specificationName: data[i].specificationName,
            goodsPrice: data[i].goo_price
          })
        }
      }
      that.bindProperty.goodsList = goodsList
      this.$nextTick(() => {
        this.getTotalAmount()
      })
    },
    delGoods (key) {
      const that = this
      if (that.bindProperty && that.bindProperty.goodsList) {
        that.bindProperty.goodsList.splice(key, 1)
      }
      this.$nextTick(() => {
        this.getTotalAmount()
      })
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
