<template>
  <q-page class="fit">
    <div class="fit row no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-1 bg-white q-px-xs q-py-sm text-h6">
        <q-tabs v-model="wxmallTab" dense class="text-grey" vertical active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="set" label="基础设置" />
          <q-tab name="delivery" label="配送设置" />
          <q-tab name="pay" label="消费设置" />
          <q-tab name="message" label="消息沟通/评论" />
        </q-tabs>
      </div>
      <div class="col-11 full-height bg-grey-2 q-mt-xs">
        <div style="overflow-y: scroll" class="fit full-height bg-white">
          <q-form ref="addSettingRef">
            <!-- 网站名称 -->
            <div class="row q-mt-sm" v-show="wxmallTab == 'set'">
              <div class="col-10 row">
                <div class="col-6 q-px-sm">
                  <q-input outlined label="商户名称" dense v-model="settingForm.ws_name" lazy-rules :rules="[(val) => !!val || '请输入商户名称']" />
                </div>
                <div class="col-6 q-px-sm">
                  <q-input
                    outlined
                    label="联系人"
                    dense
                    v-model="settingForm.ws_contact_people"
                    lazy-rules
                    :rules="[(val) => !!val || '请输入联系人名称']"
                  />
                </div>
                <div class="col-6 q-px-sm">
                  <q-input outlined label="联系电话" dense v-model="settingForm.ws_contact_phone" lazy-rules />
                  <!-- :rules="[(val) => /^1[3|4|5|7|8][0-9]{9}$/.test(val) || '请输入正确的联系电话']" -->
                </div>
                <div class="col-6 q-px-sm">
                  <q-input outlined label="地址" dense lazy-rules v-model="settingForm.ws_address" :rules="[(val) => !!val || '请输入地址']" />
                </div>

                <div class="col-6 q-px-sm">
                  <q-input outlined bottom-slots label="经度" v-model="settingForm.ws_lng" dense> </q-input>
                </div>
                <div class="col-6 q-px-sm">
                  <q-input outlined bottom-slots label="纬度" v-model="settingForm.ws_lat" dense>
                    <template v-slot:after>
                      <q-btn v-if="!addressMap" unelevated @click="showQqMap" color="blue-6" label="选择坐标" class="full-width q-pt-xs"></q-btn>
                      <q-btn v-if="addressMap" unelevated @click="addressMap = false" color="red" label="关闭选择" class="full-width q-pt-xs"
                    /></template>
                  </q-input>
                </div>
                <div class="col-6 q-px-sm">
                  <hl-qq-map @getAddressInfo="getAddressInfo" v-if="addressMap" ref="qqMap"></hl-qq-map>
                </div>
              </div>
              <div class="col-2 q-px-sm row text-center flex flex-center">
                <hl-upload
                  :multiple="false"
                  :currentAttach="settingForm.logoImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        settingForm.ws_logo = val;
                      });
                    }
                  "
                  currentTitle="商户logo"
                  currentDescription="建议尺寸比例1:1"
                />
              </div>
              <div class="col-10 q-px-sm">
                <hl-editor
                  @change="
                    (v) => {
                      settingForm.ws_description = v;
                    }
                  "
                  :content="settingForm.ws_description"
                  titleText="商户简介"
                  :minHeight="$q.screen.height * 0.4"
                ></hl-editor>
              </div>
            </div>

            <div class="q-mt-sm row" v-show="wxmallTab == 'delivery'">
              <div class="col-6">
                <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  发货设置
                </div>
                <q-separator class="q-mx-sm" />
                <div class="q-my-md full-width">
                  <q-item>
                    <q-item-section>
                      <q-item-label>配送方式</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-right">
                        <q-checkbox v-model="settingForm.ws_delivery_way" val="wuliu" label="物流配送" color="primary" />
                        <q-checkbox v-model="settingForm.ws_delivery_way" val="ziti" label="门店自提" color="primary" />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator class="q-mx-sm" />

                  <q-item>
                    <q-item-section>
                      <q-item-label>虚拟商品自动确认收货</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-right">
                        <q-toggle v-model="settingForm.ws_is_auto_delivery" true-value="1" false-value="0" />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <q-separator class="q-ma-sm" />
                <div class="row q-col-gutter-sm">
                  <div class="col-md-6 col-12">
                    <q-input outlined label="发货联系人" dense v-model="settingForm.ws_send_contact_people" lazy-rules />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input outlined label="发货电话" dense v-model="settingForm.ws_send_contact_phone" lazy-rules />
                  </div>
                  <div class="col-12">
                    <hl-address
                      :province="settingForm.ws_send_province"
                      :city="settingForm.ws_send_city"
                      :area="settingForm.ws_send_district"
                      @province="sendProvince"
                      @city="sendCity"
                      @area="sendArea"
                    ></hl-address>
                  </div>
                  <div class="col-12">
                    <q-input label="发货详细地址" outlined v-model="settingForm.ws_send_address" dense :error="false" />
                  </div>
                </div>
                <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  退货原因设置
                </div>
                <div class="row">
                  <q-item class="full-width" :key="`${key}-way`" v-for="(item, key) in settingForm.ws_refund_why">
                    <q-item-section>
                      <q-input outlined v-model="settingForm.ws_refund_why[key]" dense label="原因项" />
                    </q-item-section>

                    <q-item-section side>
                      <q-btn icon="las la-trash-alt" color="negative" @click="delRefundWhy(key)" round unelevated></q-btn>
                    </q-item-section>
                  </q-item>
                  <div class="row full-width justify-center">
                    <q-btn color="primary" label="新增原因项" @click="plusRefundWhy" unelevated />
                  </div>
                </div>

                <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  退货地址设置
                </div>
                <q-separator class="q-ma-sm" />
                <div class="row q-col-gutter-sm">
                  <div class="col-md-6 col-12">
                    <q-input outlined label="退货联系人" dense v-model="settingForm.ws_refund_contact_people" lazy-rules />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input outlined label="退货电话" dense v-model="settingForm.ws_refund_contact_phone" lazy-rules />
                  </div>
                  <div class="col-12">
                    <hl-address
                      :province="settingForm.ws_refund_province"
                      :city="settingForm.ws_refund_city"
                      :area="settingForm.ws_refund_district"
                      @province="refundProvince"
                      @city="refundCity"
                      @area="refundArea"
                    ></hl-address>
                  </div>
                  <div class="col-12">
                    <q-input label="退货详细地址" outlined v-model="settingForm.ws_refund_address" dense :error="false" />
                  </div>
                </div>
              </div>
            </div>

            <div class="q-mt-sm row" v-show="wxmallTab == 'message'">
              <div class="col-7">
                <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  微信公众号客服
                </div>
                <q-separator class="q-mx-sm q-mb-sm" />
                <div class="q-mb-md q-px-sm">
                  <q-input outlined label="企业ID" dense v-model="settingForm.ws_qw_wechat_corpId" lazy-rules />
                </div>
                <div class="q-mb-md q-px-sm">
                  <q-input outlined label="企微客服URL" dense v-model="settingForm.ws_qw_wechat_url" lazy-rules />
                </div>
              </div>

              <div class="col-7">
                <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  微信小程序客服
                </div>
                <q-separator class="q-mx-sm q-mb-sm" />
                <div class="q-mb-md q-px-sm col-6">
                  <q-input outlined label="企业ID" dense v-model="settingForm.ws_qw_wxapp_corpId" lazy-rules />
                </div>
                <div class="q-mb-md q-px-sm col-6">
                  <q-input outlined label="企微客服URL" dense v-model="settingForm.ws_qw_wxapp_url" lazy-rules />
                </div>
              </div>

              <div class="col-7">
                <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  消息通知设置
                </div>
                <q-separator class="q-mx-sm q-mb-sm" />
                <q-list separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>通知类型</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-center">微信模板消息</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item-label header>通知会员</q-item-label>
                  <q-separator />
                  <q-item>
                    <q-item-section>
                      <q-item-label>订单状态更新通知</q-item-label>
                      <q-item-label caption> 通知会员购买订单状态更新 </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-input outlined v-model="settingForm.ws_wechat_message_config.orderTemp" dense />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-toggle v-model="settingForm.ws_wechat_message_config.orderState" true-value="1" false-value="0" color="green" />
                        <q-btn round dense color="grey" flat icon="las la-question-circle">
                          <q-menu>
                            <q-card flat bordered>
                              <q-item>
                                <q-item-section>
                                  <q-item-label caption>编号</q-item-label>
                                  <q-item-label>OPENTM403153534</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-item>
                                <q-item-section>
                                  <q-item-label caption>行业</q-item-label>
                                  <q-item-label>IT科技 - 互联网|电子商务</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-item>
                                <q-item-section>
                                  <q-item-label caption>标题</q-item-label>
                                  <q-item-label>订单更新通知</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-card-section>
                                <div class="text-caption text-grey-8">消息示例</div>
                                您的订单已支付\已发货\已收货\已完成<br />
                                订单编号：GM1596997979799<br />
                                订单状态：已支付\已发货\已收货\已完成<br />
                                查看订单详情~<br />
                              </q-card-section>
                            </q-card>
                          </q-menu>
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />
                  <q-item-label header>通知商家</q-item-label>
                  <q-separator />
                  <q-item>
                    <q-item-section>
                      <q-item-label>订单状态更新通知</q-item-label>
                      <q-item-label caption> 通知管理员订单状态更新 </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-input outlined v-model="settingForm.ws_wechat_message_config.storeOrderTemp" dense />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-toggle v-model="settingForm.ws_wechat_message_config.storeOrderState" true-value="1" false-value="0" color="green" />
                        <q-btn round dense color="grey" flat icon="las la-question-circle">
                          <q-menu>
                            <q-card flat bordered>
                              <q-item>
                                <q-item-section>
                                  <q-item-label caption>编号</q-item-label>
                                  <q-item-label>OPENTM403153534</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-item>
                                <q-item-section>
                                  <q-item-label caption>行业</q-item-label>
                                  <q-item-label>IT科技 - 互联网|电子商务</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-item>
                                <q-item-section>
                                  <q-item-label caption>标题</q-item-label>
                                  <q-item-label>订单更新通知</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-card-section>
                                <div class="text-caption text-grey-8">消息示例</div>
                                商城订单已支付\已发货\已收货\已完成<br />
                                订单编号：GM1596997979799<br />
                                订单状态：已支付\已发货\已收货\已完成<br />
                                订单状态已变更，请及时处理！<br />
                              </q-card-section>
                            </q-card>
                          </q-menu>
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-7">
                <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                  <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                  评论打分项
                </div>
                <div class="row">
                  <q-item class="full-width">
                    <q-item-section>
                      <q-input outlined v-model="settingForm.ws_comment_item.one" dense label="评分项一" />
                    </q-item-section>
                  </q-item>

                  <q-item class="full-width">
                    <q-item-section>
                      <q-input outlined v-model="settingForm.ws_comment_item.two" dense label="评分项二" />
                    </q-item-section>
                  </q-item>

                  <q-item class="full-width">
                    <q-item-section>
                      <q-input outlined v-model="settingForm.ws_comment_item.three" dense label="评分项三" />
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>

            <div class="q-mt-sm row" v-show="wxmallTab == 'pay'">
              <div class="col-md-4 col-12 q-pr-md q-mt-md">
                <q-card bordered flat>
                  <q-card-section>
                    <span class="text-subtitle1"
                      >{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit }}支付单笔可用百分比</span
                    >
                    <q-toggle
                      v-model="settingForm.ws_pay_set.moneyCashSwitch"
                      color="green"
                      :true-value="'1'"
                      :false-value="'0'"
                      class="float-right"
                    />
                  </q-card-section>
                  <q-separator />
                  <div class="q-ma-md">
                    启用后，会员使用{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit
                    }}结账时，单笔可使用{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit
                    }}总额的百分比。如：增加计次结账，选择{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit
                    }}，会根据如下设置的百分比自动计算出本次交易可使用的{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit
                    }}金额数。<br />
                    示例：某会员张三一共有{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit }}100{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit
                    }}，商家设置的可用百分比为80，那么假设张三本次消费实付总金额300{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit
                    }}，则张三只能使用总{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit
                    }}的（100*80%=80{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit }}）。设置范围为1~100。
                  </div>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="settingForm.ws_pay_set.moneyCashRatio"
                    dense
                    class="q-px-md"
                    :rules="[
                      (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 1 && val <= 100 : true) || '请输入正确的数值',
                    ]"
                  >
                  </q-input>
                </q-card>
              </div>

              <div class="col-md-4 col-12 q-pr-md q-mt-md">
                <q-card bordered flat>
                  <q-card-section>
                    <span class="text-subtitle1"
                      >{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}支付单笔可用百分比</span
                    >
                    <q-toggle
                      v-model="settingForm.ws_pay_set.pointCashSwitch"
                      color="green"
                      :true-value="'1'"
                      :false-value="'0'"
                      class="float-right"
                    />
                  </q-card-section>
                  <q-separator />
                  <div class="q-ma-md">
                    启用后，会员使用{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}结账时，单笔可使用{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}总额的百分比。如：增加计次结账，选择{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}，会根据如下设置的百分比自动计算出本次交易可使用的{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}总数。<br />
                    示例：某会员张三一共有1000{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}，商家设置的可用百分比为80，则张三本单交易只能使用总{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}的（1000*80%=800{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}）。设置范围为1~100。
                  </div>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="settingForm.ws_pay_set.pointCashRatio"
                    dense
                    :rules="[
                      (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 1 && val <= 100 : true) || '请输入正确的数值',
                    ]"
                    class="q-px-md"
                  >
                  </q-input>
                </q-card>
              </div>
              <div class="col-md-4 col-12 q-pr-md q-mt-md">
                <q-card bordered flat>
                  <q-card-section>
                    <span class="text-subtitle1"
                      >{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}支付抵现换算比例</span
                    >
                    <q-toggle
                      v-model="settingForm.ws_pay_set.pointUseCashSwitch"
                      color="green"
                      :true-value="'1'"
                      :false-value="'0'"
                      class="float-right"
                    />
                  </q-card-section>
                  <q-separator />
                  <div class="q-ma-md">
                    启用后，会员使用{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}结账时，{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}换算货币比例。如：增加计次结账，选择{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}，会根据如下设置的比率自动计算出本次交易{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}可抵现总金额。<br />
                    示例：某会员张三本单消费可用{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}为 100
                    {{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}，商家设置{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}抵现换算比例为30 ，则张三本单交易按（30{{
                      $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit
                    }}
                    = 1{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit }}）换算可抵现总金额（100 × (1÷30))
                    = 3.33 {{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit }}）。 设置范围为大于等于1。
                  </div>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="settingForm.ws_pay_set.pointUseCashSRatio"
                    dense
                    class="q-px-md"
                    :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
                  >
                  </q-input>
                </q-card>
              </div>
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
          <q-btn class="q-px-xl" label="提交" :disable="submitDisable" @click="saveData()" color="primary" unelevated />
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'wxmllSetting',
  components: {},
  data () {
    return {
      settingForm: {
        ws_name: '',
        ws_logo: '',
        ws_description: '',
        ws_contact_people: '',
        ws_contact_phone: '',
        ws_address: '',
        ws_evaluation_rules: '',
        ws_service_description: '',
        ws_qw_wechat_url: '',
        ws_qw_wxapp_url: '',
        ws_qw_wechat_corpId: '',
        ws_qw_wxapp_corpId: '',
        ws_hot_tags: [],
        ws_delivery_way: [],
        ws_is_auto_delivery: '',
        ws_send_address: '',
        ws_send_province: '',
        ws_send_province_code: '',
        ws_send_city: '',
        ws_send_city_code: '',
        ws_send_district: '',
        ws_send_district_code: '',
        ws_refund_address: '',
        ws_refund_province: '',
        ws_refund_province_code: '',
        ws_refund_city: '',
        ws_refund_city_code: '',
        ws_refund_district: '',
        ws_refund_district_code: '',

        ws_lng: '',
        ws_lat: '',

        ws_refund_contact_people: '',
        ws_refund_contact_phone: '',
        ws_send_contact_people: '',
        ws_send_contact_phone: '',
        ws_wechat_message_config: {},
        ws_comment_item: {},
        ws_refund_why: {},
        ws_pay_set: {
          pointSwitch: 0,
          pointRatio: '',
          levelSwitch: 0,
          moneyCashSwitch: 0,
          moneyCashRatio: '',
          moneyGivePointSwitch: 0,
          moneyGivePointRatio: '',
          pointCashSwitch: 0,
          pointCashRatio: '',
          pointUseCashSwitch: 0,
          pointUseCashSRatio: ''
        }
      },
      submitDisable: false,
      multiple: false,
      uploadImgStatus: false,
      addressMap: false,
      currentTag: '',
      wxmallTab: 'set',
      messageConfig: {
        orderTemp: '',
        orderState: '0',
        storeOrderTemp: '',
        storeOrderState: '0'
      },
      commentItem: {
        one: '',
        two: '',
        three: ''
      }
    }
  },
  mounted () {},
  created () {
    this.getItem()
  },
  computed: {},
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('wxMallSetting/getItem', null).then((res) => {
        if (parseInt(res.code) == 200) {
          if (res.data) {
            this.settingForm = res.data ? res.data : {}
          }
          this.$nextTick(() => {
            this.setWechatMessage(res.data.ws_wechat_message_config || {})
          })
          this.$nextTick(() => {
            this.setCommentItem(res.data.ws_comment_item || {})
          })
        }
      })
    },
    setCommentItem (commentItem) {
      const currentCommentItem = {}
      for (const key in this.commentItem) {
        const item = commentItem && commentItem[key]
        currentCommentItem[key] = item || this.commentItem[key]
      }

      this.settingForm.ws_comment_item = currentCommentItem
    },
    setWechatMessage (messageConfig) {
      const wechatMessageConfig = {}
      for (const key in this.messageConfig) {
        const item = messageConfig && messageConfig[key]
        wechatMessageConfig[key] = item || this.messageConfig[key]
      }

      this.settingForm.ws_wechat_message_config = wechatMessageConfig
    },
    // 提交
    saveData () {
      this.$refs.addSettingRef.validate().then((success) => {
        if (success) {
          this.submitDisable = true
          const obj = {
            ...this.settingForm
          }
          this.$store
            .dispatch('wxMallSetting/setData', obj)
            .then((res) => {
              if (parseInt(res.code) == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '修改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.submitDisable = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.submitDisable = false
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
              this.submitDisable = false
            })
        }
      })
    },
    showQqMap () {
      this.addressMap = true
      this.$nextTick(() => {
        this.$refs.qqMap.modelMap(this.settingForm.ws_lat, this.settingForm.ws_lng)
      })
    },
    getAddressInfo (val) {
      if (val.ad_info) {
        const ad_info = val.ad_info

        // if (ad_info.adcode) {
        //   this.settingForm.ws_adcode = ad_info.adcode
        //   this.settingForm.ws_province = ad_info.province
        //   this.settingForm.ws_city = ad_info.city
        //   this.settingForm.ws_district = ad_info.district
        //   this.settingForm.ws_district_code = ad_info.adcode
        // }

        if (val.formatted_addresses && val.formatted_addresses.recommend) {
          this.settingForm.ws_address = val.formatted_addresses.recommend
        }

        if (ad_info.location) {
          this.settingForm.ws_lng = ad_info.location.lng.toString()
          this.settingForm.ws_lat = ad_info.location.lat.toString()
        }
      }
    },
    refundProvince (a) {
      this.settingForm.ws_refund_province = a.value
      this.settingForm.ws_refund_province_code = a.code
    },

    refundCity (a) {
      this.settingForm.ws_refund_city = a.value
      this.settingForm.ws_refund_city_code = a.code
    },

    refundArea (a) {
      this.settingForm.ws_refund_district = a.value
      this.settingForm.ws_refund_district_code = a.code
    },
    sendProvince (a) {
      this.settingForm.ws_send_province = a.value
      this.settingForm.ws_send_province_code = a.code
    },

    sendCity (a) {
      this.settingForm.ws_send_city = a.value
      this.settingForm.ws_send_city_code = a.code
    },

    sendArea (a) {
      this.settingForm.ws_send_district = a.value
      this.settingForm.ws_send_district_code = a.code
    },
    plusRefundWhy () {
      const refundWhy = this.settingForm.ws_refund_why
      refundWhy[this.randomString(5)] = ''

      this.settingForm.ws_refund_why = JSON.parse(JSON.stringify(refundWhy))
    },
    delRefundWhy (key) {
      const refundWhy = this.settingForm.ws_refund_why
      delete refundWhy[key]
      this.settingForm.ws_refund_why = JSON.parse(JSON.stringify(refundWhy))
    },
    randomString (length) {
      const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ''
      for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
      }
      return result
    }
  }
}
</script>
