<template>
  <q-dialog v-model="checkoutPopupStatus" @hide="closeCheckoutPopup">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
        height: parseInt(this.$q.screen.height * 0.8) + 'px',
        'min-height': parseInt(this.$q.screen.height * 0.6) + 'px',
        'max-height': parseInt(this.$q.screen.height * 0.9) + 'px',
      }"
      flat
      class="bg-grey-3"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-pa-sm">
          <q-bar class="bg-white">
            收银结账
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">取消</q-tooltip>
            </q-btn>
          </q-bar>
        </div>

        <div class="col-shrink full-height bg-blue-grey-1 q-mt-xs">
          <q-scroll-area class="fit full-height row">
            <div class="row">
              <div class="col-12 col-md-7 q-pr-xs">
                <q-card flat square class="full-width q-mb-xs" v-if="memberInfo.id">
                  <q-item class="text-center">
                    <q-item-section avatar>

                      <q-avatar v-if="memberInfo.coverImage && memberInfo.coverImage.id" text-color="white">
                        <img :src="$q.localStorage.getItem('onlystore_system_local').attach_url + memberInfo.coverImage.path" />
                      </q-avatar>
                      <q-avatar color="grey" text-color="white" v-else icon="person" />
                    </q-item-section>

                    <q-item-section class="text-left">
                      <q-item-label lines="1"
                        >{{ memberInfo.mem_memberName }} <span v-if="memberInfo.mem_memberRealName"> ({{ memberInfo.mem_memberRealName }})</span>
                      </q-item-label>
                      <q-item-label> <span class="text-caption">卡号：</span> {{ memberInfo.mem_memberCardNum }}</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption lines="1">会员级别</q-item-label>
                      <q-item-label class="text-subtitle2">{{
                        memberInfo.memberLevel ? memberInfo.memberLevel.mcl_level_name : '无等级'
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption lines="1">{{
                        $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit
                      }}</q-item-label>
                      <q-item-label class="text-h5">{{ formatAmount(memberInfo.mem_memberMoneyCount) }} </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption lines="1">{{
                        $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit
                      }}</q-item-label>
                      <q-item-label class="text-h5">{{ formatAmount(memberInfo.mem_memberPointsCount) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>

                <div class="row q-col-gutter-xs q-mt-xs">
                  <div class="col-md-6 col-12" v-if="zfkMainInfo.useBalance > 0">
                    <q-item class="bg-white q-my-xs rounded-borders q-pa-sm">
                      <q-item-section>
                        <q-item-label>
                          主卡{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit }}:
                          <span class="text-subtitle1 text-weight-bold text-red">{{ zfkMainInfo.useBalance }}</span>
                          {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneyUnit }}
                        </q-item-label>
                        <q-item-label caption
                          >开启使用主卡{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit }}</q-item-label
                        >
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle color="primary" v-model="zfkUseMainBalanceStatus" :true-value="1" :false-value="0" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-md-6 col-12" v-if="zfkMainInfo.useIntegral > 0">
                    <q-item class="bg-white q-my-xs rounded-borders q-pa-sm">
                      <q-item-section>
                        <q-item-label>
                          主卡{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}:
                          <span class="text-subtitle1 text-weight-bold text-red">{{ zfkMainInfo.useIntegral }}</span>
                        </q-item-label>
                        <q-item-label caption
                          >开启使用主卡{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}</q-item-label
                        >
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle color="primary" v-model="zfkUseMainIntegralStatus" :true-value="1" :false-value="0" />
                      </q-item-section>
                    </q-item>
                  </div>
                </div>

                <q-card flat square class="full-width" v-if="paymentMethodData.length > 0">
                  <q-card-section class="row q-pa-xs">
                    <div class="col-3 text-center" v-for="(v, k) in paymentMethodData">
                      <div @click="selectPaymentMethod(v, k)">
                        <q-img
                          :src="v.iconImage && v.iconImage.id ? $q.localStorage.getItem('onlystore_system_local').attach_url + v.iconImage.path : ''"
                          ratio="1"
                          width="60px"
                          :class="{
                            'checkout-border': v.selectStatus,
                          }"
                        >
                          <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
                            </div>
                          </template>
                        </q-img>
                        <!-- <q-icon
                          size="60px"
                          :name="v.icon"
                        ></q-icon> -->
                        <!-- ({{ v.fast }}) -->
                        <q-item-label
                          caption
                          lines="1"
                          :class="{
                            'text-primary': v.selectStatus,
                          }"
                          class="q-py-xs"
                          >{{ v.name }}</q-item-label
                        >
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card flat square class="full-width q-mt-xs q-pa-sm">
                  <q-input dense outlined label="备注" v-model="sc_note" clearable type="textarea" :rows="2" />
                  <q-checkbox dense v-model="printInvoiceStatus" label="小票打印机" color="blue-8" />
                </q-card>
              </div>
              <div class="col-12 col-md-5">
                <q-card flat square class="full-width text-h6">
                  <div class="row justify-between q-py-xs">
                    <div class="col-4 q-pl-md">应付金额</div>
                    <div class="col-4 text-right q-pr-md">
                      {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ sc_handleMoneyCount }}
                    </div>
                  </div>

                  <div class="row justify-between q-py-xs" v-if="sc_rulePaymentCount">
                    <div class="col-4 q-pl-md">商家优惠</div>
                    <div class="col-4 text-red text-right q-pr-md">
                      -{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ sc_rulePaymentCount }}
                    </div>
                  </div>
                  <div class="row justify-between q-py-xs" v-if="hyryxPaymentCount">
                    <div class="col-4 q-pl-md">会员日优惠</div>
                    <div class="col-4 text-red text-right q-pr-md">
                      -{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ hyryxPaymentCount }}
                    </div>
                  </div>

                  <div class="row justify-between q-py-xs" v-if="hyryxGiveIntegral">
                    <div class="col-4 q-pl-md">会员日赠送</div>
                    <div class="col-4 text-primary text-right q-pr-md">
                      {{ hyryxGiveIntegral }}
                      <span class="text-body1">{{
                        $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit
                      }}</span>
                    </div>
                  </div>

                  <div class="row justify-between q-py-xs" v-if="sc_couponPaymentCount">
                    <div class="col-4 q-pl-md">优惠券</div>
                    <div class="col-4 text-red text-right q-pr-md">
                      -{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ sc_couponPaymentCount }}
                    </div>
                  </div>
                  <div class="row justify-between q-py-xs" v-if="sc_rounding_amount">
                    <div class="col-4 q-pl-md">抹零</div>
                    <div class="col-4 text-red text-right q-pr-md">
                      -{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ sc_rounding_amount }}
                    </div>
                  </div>
                  <div class="row justify-between q-py-xs" v-if="sc_change_amount">
                    <div class="col-4 q-pl-md">现金找零</div>
                    <div class="col-4 text-red text-right q-pr-md">
                      {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ sc_change_amount }}
                    </div>
                  </div>
                  <div class="row justify-between q-py-xs" v-if="ruleGiveIntegral">
                    <div class="col-4 q-pl-md">赠送</div>
                    <div class="col-4 text-primary text-right q-pr-md">
                      {{ ruleGiveIntegral }}
                      <span class="text-body1">{{
                        $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit
                      }}</span>
                    </div>
                  </div>

                  <div class="row justify-between q-py-xs">
                    <div class="col-4 q-pl-md">实付金额</div>
                    <div class="col-4 text-right q-pr-md">
                      {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ sc_realMoneyCount }}
                    </div>
                  </div>
                </q-card>

                <q-card flat square class="full-width text-h6 q-pa-sm q-mt-xs">
                  <div class="q-py-sm">
                    <q-input outlined dense v-model="sc_rounding_amount" label="抹零" @clear="clearRoundingInput" readonly>
                      <template v-slot:append>
                        <q-icon
                          color="grey"
                          v-if="sc_rounding_amount"
                          @click="
                            sc_rounding_amount = 0;
                            roundingOperate();
                          "
                          name="cancel"
                        ></q-icon>
                      </template>

                      <template v-slot:after>
                        <q-btn
                          :unelevated="roundingType == 'yuan'"
                          :outline="roundingType != 'yuan'"
                          color="primary"
                          @click="openChangePrice"
                          label="改价"
                        />
                        <q-btn
                          :unelevated="roundingType == 'jiao'"
                          :outline="roundingType != 'jiao'"
                          color="primary"
                          @click="
                            roundingType = 'jiao';
                            roundingOperate();
                          "
                          label="抹角"
                        />
                        <q-btn
                          :unelevated="roundingType == 'fen'"
                          :outline="roundingType != 'fen'"
                          color="primary"
                          @click="
                            roundingType = 'fen';
                            roundingOperate();
                          "
                          label="抹分"
                        />
                      </template>
                    </q-input>
                  </div>

                  <div class="q-py-sm" v-if="discount_rule_config && discount_rule_config.lenght > 0">
                    <q-select
                      outlined
                      v-model="discountRule"
                      :options="discount_rule_config"
                      label="商家优惠"
                      dense
                      clearable
                      @input="inputDiscountRule"
                      option-label="ic_name"
                      options-selected-class="text-deep-orange"
                      @clear="clearRoundingInput"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.ic_name }}</q-item-label>
                            <q-item-label caption>
                              折扣: <span class="text-subtitle1 text-red">{{ formatAmount(scope.opt.ic_discount_ratio) }}</span> 折 ，{{
                                $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit
                              }}比例: 1{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneyUnit }} =
                              <span class="text-subtitle1 text-red"> {{ formatAmount(scope.opt.ic_integral_ratio) }} </span
                              >{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="q-py-sm" v-if="hyryxRuleData.length > 0">
                    <q-select
                      outlined
                      v-model="hyryxDiscountValue"
                      :options="hyryxRuleData"
                      label="会员日"
                      dense
                      clearable
                      @input="hyryxDiscountRule"
                      option-label="phr_name"
                      options-selected-class="text-deep-orange"
                      @clear="clearRoundingInput"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.phr_name }}</q-item-label>
                            <q-item-label caption>
                              折扣: <span class="text-subtitle1 text-red">{{ parseInt(scope.opt.phr_discount_proportion) }}</span> 折 ，
                              <span class="text-subtitle1 text-red"> {{ formatAmount(scope.opt.phr_integral_multiple) }} </span> 倍{{
                                $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit
                              }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="q-py-sm" v-if="couponList.length > 0">
                    <q-select
                      outlined
                      v-model="selectCoupon"
                      :options="couponList"
                      label="优惠券"
                      dense
                      @input="inputUseCoupon"
                      option-label="cmd_type_name"
                      options-selected-class="text-deep-orange"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.cmd_type_name }}</q-item-label>
                            <q-item-label caption>{{ couponText(scope.opt.coupon) }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:append>
                        <q-icon v-if="selectCoupon" name="close" @click="clearInputUseCoupon" class="cursor-pointer" />
                      </template>
                    </q-select>
                  </div>
                  <div class="q-py-sm" v-if="userInfoList.length > 0">
                    <q-select
                      outlined
                      v-model="personnel_id"
                      :options="userInfoList"
                      label="选择员工"
                      dense
                      clearable
                      option-label="pru_name"
                      option-value="id"
                      emit-value
                      map-options
                      options-selected-class="text-deep-orange"
                    >
                    </q-select>
                  </div>
                </q-card>

                <q-card flat square class="full-width text-h6 q-pa-sm q-mt-xs" v-if="nowPaymentMethod && nowPaymentMethod.length > 0">
                  <div class="row justify-between">
                    <div
                      class="col-6 q-py-sm"
                      v-for="(v, k, i) in nowPaymentMethod"
                      :class="{
                        'q-pr-sm': k % 2 == 0 ? true : false,
                      }"
                    >
                      <q-input
                        dense
                        ref="payMoneyRef"
                        outlined
                        v-model="v.value"
                        @change="confirmSelectPay(nowPaymentMethod, v)"
                        :label="v.name"
                        :readonly="v.key == 'cashPay'"
                      >
                        <template v-slot:append>
                          <span class="text-body1 text-dark">{{
                            $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneyUnit
                          }}</span>
                        </template>
                      </q-input>

                      <div class="text-red text-body2" v-if="v.key == 'rechargePay'">
                        <!-- 总{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit }} :{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ memberInfo.mem_memberMoneyCount }}  -->
                        获赠:{{ useMoneyGivePoint }}{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}
                      </div>
                      <div class="text-red text-body2" v-if="v.key == 'pointPay'">
                        <!-- 已用{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}：{{ useDiscountPoint }}， -->
                        可用:{{ totalAvailableAmount
                        }}{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }} ({{
                          $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}
                        1 = {{ pay_config.pointUseCashSRatio }}
                        {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }})
                        <!-- (总{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }} ： {{ memberInfo.mem_memberPointsCount }}) -->
                      </div>
                      <div class="q-mt-sm text-body2" v-if="v.key == 'cashPay'">
                        <div class="text-red text-body2">
                          实收:{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                          {{ formatAmount(sc_real_payment_cash) }}，
                          <span v-if="formatAmount(formatAmount(sc_real_payment_cash) - formatAmount(v.value)) > 0">
                            找零:{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                            {{ formatAmount(formatAmount(sc_real_payment_cash) - formatAmount(v.value)) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </q-scroll-area>
        </div>

        <div class="col-shrink bg-white text-center q-py-sm q-mt-xs">
          <q-btn
            unelevated
            @click="computeReceivePayment"
            :disabled="countTotalPayMoney() == formatAmount(sc_handleMoneyCount) ? false : true"
            color="primary"
            class="q-px-xl"
            label="结 账"
          />
        </div>
      </div>
    </q-card>

    <q-dialog v-model="payCodeDialogStatus">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
        flat
      >
        <q-card-section>输入付款码</q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            :autofocus="true"
            @submit="
              () => {
                return false;
              }
            "
            class="q-gutter-md"
            ref="payCodeFormRef"
          >
            <div class="row">
              <div class="col-12 q-mt-sm">
                <q-input
                 type="number"
                  ref="payCodeInputRef"
                  dense
                  square
                  @keyup.enter="scanQrCode"
                  outlined
                  v-model="currentChannelPayCode"
                  :label="nowNeedPayCode.name"
                  :rules="[(val) => !!val || '请填写付款码']"
                >
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions vertical align="center" class="q-px-md">
          <q-btn unelevated color="primary" @click="scanQrCode" class="full-width q-mx-sm">结账</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="cashPayDialog" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
        flat
      >
        <q-card-section>请输入实收现金</q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            :autofocus="true"
            @submit="
              () => {
                return false;
              }
            "
            class="q-gutter-md"
            ref="payCashFormRef"
          >
            <div class="row">
              <div class="col-12 q-mt-sm">
                <q-input
                  ref="payCashInputRef"
                  dense
                  square
                  @keyup.enter="cashSettlement"
                  outlined
                  v-model="sc_real_payment_cash"
                  label="实收现金"
                  :rules="[(val) => !!val || '请填写实收现金']"
                >
                  <template v-slot:hint>
                    <span class="text-red text-h6"> 剩余支付{{ formatAmount(sc_handleMoneyCount - countTotalPayMoney()) }}</span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <div class="q-pa-sm text-center q-gutter-sm">
          <q-btn unelevated color="primary" @click="cashSettlement" class="q-px-xl">确认</q-btn>
          <q-btn unelevated color="grey" @click="cancelCashSettlement" class="q-px-xl">取消</q-btn>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="changeRealPriceDialog" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
        flat
      >
        <q-card-section>请输入新价格</q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            :autofocus="true"
            @submit="
              () => {
                return false;
              }
            "
            class="q-gutter-md"
            ref="payCashFormRef"
          >
            <div class="row">
              <div class="col-12 q-mt-sm">
                <q-input
                  ref="currentRealPriceInput"
                  dense
                  square
                  @keyup.enter="roundingSettlement"
                  outlined
                  v-model="currentRealPrice"
                  :rules="[(val) => !!val || '请填写新价格']"
                >
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <div class="q-pa-sm text-center q-gutter-sm">
          <q-btn unelevated color="primary" @click="roundingSettlement" class="q-px-xl">确认</q-btn>
          <q-btn unelevated color="grey" @click="cancelChangeRealPrice" class="q-px-xl">取消</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      printInvoiceStatus: true,
      checkoutPopupStatus: false,
      paymentMethodData: [],
      nowPaymentMethod: [],
      pay_config: {},
      discount_rule_config: [],
      memberInfo: {},
      remarksIndex: '',
      couponIndex: '',
      sc_consumeType: '',

      member_id: 0,
      sc_memberCardNum: '',
      sc_memberName: '',
      sc_getPoint: 0,
      sc_handleMoneyCount: 0,
      sc_realMoneyCount: 0,
      sc_note: '',
      sc_payStatus: 2,
      personnel_id: '',
      userInfoList: [],
      useDiscountPoint: 0,
      consumeGivePoint: 0,
      useDiscountMoney: 0,
      useMoneyGivePoint: 0,
      totalAvailableAmount: 0,
      sc_pay_status: 0,
      defaultNeedPayCode: ['aliPay', 'wxPay'],
      nowNeedPayCode: {},
      payCodeDialogStatus: false,
      return_param: {},
      buffer_id: 0,
      sc_wechatPaymentCount: 0,
      discountRule: '',
      sc_rulePaymentCount: 0,
      ruleGiveIntegral: 0,
      sc_invoiceCode: '',
      couponList: [],
      selectCoupon: '',
      useCouponId: 0,
      sc_couponPaymentCount: 0,
      roundingType: 'yaun',
      sc_rounding_amount: 0,
      sc_real_payment_cash: 0,
      sc_change_amount: 0,
      cashPayDialog: false,
      zfkUseMainBalanceStatus: 0,
      zfkUseMainIntegralStatus: 0,
      zfkMainInfo: {},
      changeRealPriceDialog: false,
      currentRealPrice: 0,
      hyryxRuleData: [],
      hyryxPaymentCount: 0,
      hyryxDiscountValue: '',
      hyryxGiveIntegral: 0,
      storeBaseConfig: {},
      currentChannelPayCode: ''
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    checkoutPageReceive (consumeType, money, member_id, return_param = {}) {
      this.sc_consumeType = consumeType
      this.return_param = return_param
      this.member_id = member_id
      this.sc_handleMoneyCount = money
      this.sc_realMoneyCount = money
      this.checkoutPopupStatus = true

      this.storeBaseConfig = this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig

      this.$nextTick(() => {
        this.getChectoutSettle(consumeType, member_id, return_param)
      })
    },

    getChectoutSettle (consumeType = null, member_id = null, return_param = null) {
      const obj = {
        member_id: member_id,
        consumeType: consumeType,
        sc_handleMoneyCount: this.sc_handleMoneyCount,
        ...return_param
      }
      this.$store
        .dispatch('components/checkoutPlugin', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.memberInfo) {
              this.memberInfo = res.data.memberInfo
            }

            if (res.data.discount_rule_config) {
              this.discount_rule_config = res.data.discount_rule_config
            }

            if (res.data.pay_config) {
              this.pay_config = res.data.pay_config
            }

            if (res.data.other_settle_config && res.data.other_settle_config.couponList) {
              this.couponList = res.data.other_settle_config.couponList
            }
            if (res.data.other_settle_config && res.data.other_settle_config.userInfoList) {
              this.userInfoList = res.data.other_settle_config.userInfoList
            }
            // if (res.data.other_settle_config && res.data.other_settle_config.zfkMainInfo) {
            //   this.zfkMainInfo = res.data.other_settle_config.zfkMainInfo
            // }

            // if (res.data.other_settle_config && res.data.other_settle_config.hyryxRuleData) {
            //   this.hyryxRuleData = res.data.other_settle_config.hyryxRuleData
            // }

            if (res.data.payment) {
              this.paymentMethodModel(res.data.payment, res.data.pay_config)
            }
          }
        })
        .catch((error) => {})
    },

    paymentMethodModel (payment = null, pay_config = null) {
      const that = this

      _(payment).forEach(function (v) {
        switch (v.key) {
          case 'rechargePay':
            if (parseInt(pay_config.moneyCashSwitch) == 1 && that.formatAmount(pay_config.moneyCashRatio) > 0 && parseInt(that.member_id) > 0) {
              v.show_status = true
            } else {
              v.show_status = false
            }

            break
          case 'pointPay':
            if (
              parseInt(pay_config.pointCashSwitch) == 1 &&
              that.formatAmount(pay_config.pointCashRatio) > 0 &&
              parseInt(pay_config.pointUseCashSwitch) == 1 &&
              that.formatAmount(pay_config.pointUseCashSRatio) > 0 &&
              parseInt(that.member_id) > 0
            ) {
              v.show_status = true
            } else {
              v.show_status = false
            }
            break
          default:
            v.show_status = true
        }
      })

      that.$nextTick(() => {
        that.paymentMethodData = payment
      })
    },

    selectPaymentMethod (v, k) {
      if (!v.show_status) {
        return false
      }
      v.selectStatus = !v.selectStatus

      const nowPaymentMethod = this.nowPaymentMethod

      if (!v.selectStatus) {
        this.cancelSelectPay(nowPaymentMethod, v.key)
      } else {
        this.confirmSelectPay(nowPaymentMethod, v, 'add')
      }
    },

    confirmSelectPay (nowPaymentMethod = null, v = null, changeModel = 'change') {
      v.value = this.formatAmount(v.value)
      const that = this
      const handleMoneyCount = this.sc_handleMoneyCount
      const countTotalPayMoney = this.countTotalPayMoney()
      const pay_config = this.pay_config

      let nowPayMoney = this.formatAmount(handleMoneyCount - countTotalPayMoney)
      if (changeModel == 'change') {
        nowPayMoney = this.formatAmount(this.formatAmount(nowPayMoney) + this.formatAmount(v.value))
      }
      if (changeModel == 'add') {
        v.value = nowPayMoney
      }

      if (v.key == 'rechargePay') {
        const memberMoneyCount =
          parseInt(this.zfkUseMainBalanceStatus) == 1
            ? that.formatAmount(this.zfkMainInfo.useBalance)
            : that.formatAmount(this.memberInfo.mem_memberMoneyCount)

        if (this.formatAmount(pay_config.moneyCashRatio) > 0 && parseInt(pay_config.moneyCashSwitch) == 1 && memberMoneyCount > 0) {
          const needMemberMoney = this.formatAmount(memberMoneyCount * (pay_config.moneyCashRatio * 0.01))

          // 如果本次需要金额小于等于
          const useMemberMoney = needMemberMoney <= memberMoneyCount ? needMemberMoney : memberMoneyCount

          if (useMemberMoney >= nowPayMoney) {
            v.value = this.formatAmount(v.value) < this.formatAmount(nowPayMoney) ? this.formatAmount(v.value) : this.formatAmount(nowPayMoney)
          }
          if (v.value > useMemberMoney) {
            v.value = this.formatAmount(useMemberMoney)
          }
          const useDiscountMoney = that.formatAmount(v.value)

          if (parseInt(pay_config.moneyGivePointSwitch) == 1 && that.formatAmount(pay_config.moneyGivePointRatio) > 0) {
            const integralConvert =
              this.storeBaseConfig && this.storeBaseConfig.consume_base_integralConvert ? this.storeBaseConfig.consume_base_integralConvert : 1

            that.useMoneyGivePoint = that.formatAmount(that.formatAmount(pay_config.moneyGivePointRatio) * (integralConvert * useDiscountMoney))
          }
          this.useDiscountMoney = useDiscountMoney
        } else {
          v.value = 0
        }
      }

      if (v.key == 'pointPay') {
        const memberPointsCount =
          parseInt(this.zfkUseMainIntegralStatus) == 1
            ? that.formatAmount(this.zfkMainInfo.useIntegral)
            : that.formatAmount(this.memberInfo.mem_memberPointsCount)
        if (
          parseInt(pay_config.pointCashSwitch) == 1 &&
          that.formatAmount(pay_config.pointCashRatio) > 0 &&
          parseInt(pay_config.pointUseCashSwitch) == 1 &&
          that.formatAmount(pay_config.pointUseCashSRatio) > 0 &&
          parseInt(that.member_id) > 0 &&
          memberPointsCount > 0
        ) {
          const pointCashRatio = pay_config.pointCashRatio
          const pointUseCashSRatio = pay_config.pointUseCashSRatio

          const totalAvailableAmount = this.formatAmount(memberPointsCount * (pointCashRatio * 0.01) * (1 / pointUseCashSRatio))

          if (v.value > totalAvailableAmount || changeModel == 'add') {
            v.value = totalAvailableAmount
          }
          if (totalAvailableAmount >= nowPayMoney) {
            // v.value = nowPayMoney
            v.value = this.formatAmount(v.value) < this.formatAmount(nowPayMoney) ? this.formatAmount(v.value) : this.formatAmount(nowPayMoney)
          }
          this.useDiscountPoint = this.formatAmount(v.value * pointUseCashSRatio)

          this.totalAvailableAmount = this.formatAmount(memberPointsCount * (pointCashRatio * 0.01))
        } else {
          v.value = 0
        }
      }

      if (this.defaultNeedPayCode.indexOf(v.key) > -1 || v.channel == 'hlpay') {
        if (
          _.findIndex(this.nowPaymentMethod, function (o) {
            return that.defaultNeedPayCode.indexOf(o.key) > -1
          }) > -1
        ) {
          this.$q.notify({
            message: '错误',
            caption: '刷卡支付只能选择一种',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'center'
          })
          v.selectStatus = false

          return false
        }

        if (
          _.findIndex(this.nowPaymentMethod, function (o) {
            return o.channel == 'hlpay'
          }) > -1
        ) {
          this.$q.notify({
            message: '错误',
            caption: '刷卡支付只能选择一种',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'center'
          })
          v.selectStatus = false

          return false
        }
      }

      // if (v.channel == 'hlpay') {
      //   if (_.findIndex(this.nowPaymentMethod, function (o) {
      //     return o.channel == 'hlpay'
      //   }) > -1) {
      //     this.$q.notify({
      //       message: '错误',
      //       caption: '刷卡支付只能选择一种',
      //       icon: 'ion-close-circle-outline',
      //       color: 'red',
      //       timeout: 500,
      //       position: 'center'
      //     })
      //     v.selectStatus = false

      //     return false
      //   }
      // }

      if (parseInt(pay_config.pointSwitch) == 1 && that.formatAmount(pay_config.pointRatio) > 0) {
        this.consumeGivePoint = this.formatAmount(pay_config.pointRatio * countTotalPayMoney)
      }

      if (countTotalPayMoney > handleMoneyCount) {
        this.$q.notify({
          message: '失败',
          caption: '汇总金额大于应付金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        v.value = 0
        return false
      }

      if (changeModel == 'add') {
        if (v.key == 'cashPay') {
          this.cashPayDialog = true
          this.sc_real_payment_cash = 0
          this.sc_change_amount = 0

          this.$nextTick(() => {
            this.focusCashPayInput()
          })

          return false
        }
        nowPaymentMethod.push({
          value: v.value,
          name: v.name,
          key: v.key,
          channel: v.channel
        })
        this.$nextTick(() => {
          this.nowPaymentMethod = nowPaymentMethod
          if (this.nowPaymentMethod) {
            const ref_index = this.nowPaymentMethod.length
            setTimeout(() => {
              if (ref_index > 0) {
                this.$refs.payMoneyRef[ref_index - 1].focus()
              }
            }, 200)
          }
        })
      }
    },

    cancelSelectPay (nowPaymentMethod = null, key = null) {
      const that = this
      const payment_index = _.findIndex(nowPaymentMethod, function (o) {
        return o.key == key
      })

      switch (key) {
        case 'rechargePay':
          that.useMoneyGivePoint = 0

          break
        case 'pointPay':
          that.useDiscountPoint = 0
          break
        default:
        // 默认代码块;
      }
      if (payment_index > -1) {
        nowPaymentMethod.splice(payment_index, 1)
        this.nowPaymentMethod = nowPaymentMethod
      }
      const paymentMethodData = that.paymentMethodData
      const paymentMethodIndex = _.findIndex(paymentMethodData, function (o) {
        return o.key == key
      })

      if (paymentMethodIndex > -1 && that.paymentMethodData[paymentMethodIndex]) {
        that.paymentMethodData[paymentMethodIndex].selectStatus = false
      }
    },

    countTotalPayMoney () {
      const that = this
      const obj = this.nowPaymentMethod
      let totalMoney = 0
      const sc_rulePaymentCount = this.formatAmount(this.sc_rulePaymentCount)
      const sc_couponPaymentCount = this.formatAmount(this.sc_couponPaymentCount)
      const sc_rounding_amount = this.formatAmount(this.sc_rounding_amount)
      const hyryxPaymentCount = this.formatAmount(this.hyryxPaymentCount)

      _(obj).forEach(function (v) {
        totalMoney += that.formatAmount(v.value)
      })

      return this.formatAmount(totalMoney + sc_rulePaymentCount + sc_couponPaymentCount + sc_rounding_amount + hyryxPaymentCount)
    },

    refreshBut () {
      this.deductAmount = ''
      this.remarksIndex = ''
    },

    closeCheckoutPopup () {
      this.$nextTick(() => {
        this.checkoutPopupStatus = false
      })
      this.$emit('closeCheckoutPopup')

      // console.log("cD", this.$refs.cccccc);
    },

    computeReceivePayment () {
      const that = this
      this.buffer_id = 0
      const return_param = {
        ...this._data
      }

      this.$store
        .dispatch('components/buffer', return_param)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.buffer_id = res.data.id

            const nowPaymentMethod = this.nowPaymentMethod
            const localScanIndex = _.findIndex(nowPaymentMethod, function (o) {
              return that.defaultNeedPayCode.indexOf(o.key) > -1
            })
            const hlpayIndex = _.findIndex(nowPaymentMethod, function (o) {
              return o.channel == 'hlpay'
            })

            if (localScanIndex > -1) {
              this.payCodeDialogStatus = true
              this.focusPayCodeInput()
              that.nowNeedPayCode = nowPaymentMethod[localScanIndex]
              return false
            } else if (hlpayIndex > -1) {
              this.payCodeDialogStatus = true
              this.focusPayCodeInput()
              that.nowNeedPayCode = nowPaymentMethod[hlpayIndex]
              return false
            } else {
              that.paySuccessCallBack(1)
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: '结账失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    focusPayCodeInput () {
      setTimeout(() => {
        const payCodeInputRef = this.$refs.payCodeInputRef

        if (payCodeInputRef) {
          payCodeInputRef.focus()
        }
      }, 500)
    },

    focusCashPayInput () {
      const payCashInputRef = this.$refs.payCashInputRef
      setTimeout(() => {
        if (payCashInputRef) {
          payCashInputRef.focus()
        }
      }, 500)
    },

    scanQrCode () {
      const that = this
      this.focusPayCodeInput()
      this.$refs.payCodeFormRef.validate().then((success) => {
        if (success) {
          const nowNeedPayCode = this.nowNeedPayCode

          that.callScanCodePay(nowNeedPayCode)
        }
      })
    },

    callScanCodePay (item) {
      const obj = {
        payKey: item.key,
        auth_code: this.currentChannelPayCode,
        total_fee: item.value,
        sc_consumeType: this.sc_consumeType,
        buffer_id: this.buffer_id,
        channelType: item.channel
      }

      this.$q.loading.show({
        message: item.name + '正在结算'
      })
      this.$store
        .dispatch('components/scan', obj)
        .then((res) => {
          if (res.code == 100 || res.code == 200) {
            setTimeout(() => {
              this.sc_invoiceCode = res.data.order_no

              this.verificationPayMentOrder(res.data.order_no, item, item.key)
            }, 3000)
          } else {
            this.$q.loading.hide()
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.loading.hide()
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 1500,
            position: 'top-right'
          })
        })
    },

    verificationPayMentOrder (order_no, item, payKey) {
      const that = this
      const obj = {
        payKey: payKey,
        order_no: order_no,
        channelType: item.channel
      }
      this.$store
        .dispatch('components/verify', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$nextTick(() => {
              this.$q.loading.hide()
              let type = 1
              if (res.data.is_async_notice && res.data.is_async_notice == 'Y') {
                type = 0
              }
              this.paySuccessCallBack(type)
            })
          } else if (res.code == 100) {
            setTimeout(() => {
              this.verificationPayMentOrder(order_no, item, payKey)
            }, 3000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1500,
              position: 'top-right'
            })
            this.$q.loading.hide()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 1500,
            position: 'top-right'
          })
          this.$q.loading.hide()
        })
    },

    // 去结算
    paySuccessCallBack (type) {
      const handleMoneyCount = this.sc_handleMoneyCount
      const countTotalPayMoney = this.countTotalPayMoney()
      if (countTotalPayMoney > handleMoneyCount) {
        this.$q.notify({
          message: '失败',
          caption: '汇总金额大于应付金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      if (parseInt(this.buffer_id) <= 0) {
        this.$q.notify({
          message: '失败',
          caption: '结账失败',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })

        return false
      }

      this.$nextTick(() => {
        this.checkoutPopupStatus = false
      })
      const sc_wechatPaymentCount = this.sc_wechatPaymentCount

      setTimeout(() => {
        this.$emit('paySuccessCallBack', {
          buffer_id: this.buffer_id,
          type,
          sc_wechatPaymentCount,
          nowNeedPayCode: this.nowNeedPayCode,
          sc_invoiceCode: this.sc_invoiceCode
        })
      }, 200)
    },

    inputDiscountRule () {
      const discountRule = this.discountRule
      if (discountRule) {
        if (this.formatAmount(discountRule.ic_discount_ratio) && this.formatAmount(discountRule.ic_discount_ratio) < 100) {
          this.sc_rulePaymentCount = this.formatAmount(
            this.sc_handleMoneyCount - this.formatAmount(this.sc_handleMoneyCount * (discountRule.ic_discount_ratio * 0.01))
          )
          // this.sc_realMoneyCount = this.formatAmount(this.sc_handleMoneyCount - this.sc_rulePaymentCount)
        }

        if (discountRule.ic_integral_ratio) {
          this.ruleGiveIntegral = this.formatAmount(this.formatAmount(discountRule.ic_integral_ratio) * this.formatAmount(this.sc_realMoneyCount))
        }
      } else {
        // this.sc_realMoneyCount = this.sc_handleMoneyCount
        this.ruleGiveIntegral = 0
        this.sc_rulePaymentCount = 0
      }
      this.clearRoundingInput()
      this.computeRealMoneyCount()
    },

    couponText (val) {
      if (parseInt(val.cou_type) == 1) {
        return val.cou_rebate * 0.1 + '折'
      }
      if (parseInt(val.cou_type) == 2) {
        return '满' + val.cou_fill + '减' + val.cou_minus
      }

      return val.cou_extra
    },

    inputUseCoupon () {
      const that = this
      const selectCoupon = that.selectCoupon
      const couponInfo = selectCoupon.coupon
      const handleMoneyCount = this.sc_handleMoneyCount
      if (parseInt(couponInfo.cou_type) == 1) {
        this.sc_couponPaymentCount = this.formatAmount(
          handleMoneyCount - this.formatAmount(this.formatAmount(couponInfo.cou_rebate * 0.01) * handleMoneyCount)
        )
        this.useCouponId = parseInt(selectCoupon.id)
      } else if (parseInt(couponInfo.cou_type) == 2) {
        if (handleMoneyCount >= this.formatAmount(couponInfo.cou_fill)) {
          this.sc_couponPaymentCount = this.formatAmount(couponInfo.cou_minus)
          this.useCouponId = parseInt(selectCoupon.id)
        } else {
          this.$q.notify({
            message: '失败',
            caption: '本次消费不符合优惠券规则',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
          this.sc_couponPaymentCount = 0
          this.useCouponId = 0
          this.selectCoupon = ''
        }
      } else {
        that.sc_couponPaymentCount = 0
        that.useCouponId = 0
      }

      this.computeRealMoneyCount()
      this.inputDiscountRuleIntegral()
      this.hyryxDiscountRuleIntegral()
      // this.sc_realMoneyCount = this.formatAmount(this.sc_handleMoneyCount - this.sc_couponPaymentCount)
    },

    clearInputUseCoupon () {
      const that = this
      this.selectCoupon = ''
      that.sc_couponPaymentCount = 0
      that.useCouponId = 0
      this.computeRealMoneyCount()
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    // 计算实付金额
    computeRealMoneyCount () {
      const handleMoneyCount = this.formatAmount(this.sc_handleMoneyCount)
      const rulePaymentCount = this.formatAmount(this.sc_rulePaymentCount) // 规则优惠
      const couponPaymentCount = this.formatAmount(this.sc_couponPaymentCount) // 卡券优惠
      const roundingAmount = this.formatAmount(this.sc_rounding_amount) // 抹零
      const hyryxPaymentCount = this.formatAmount(this.hyryxPaymentCount) // 会员日优惠

      this.sc_realMoneyCount = this.formatAmount(handleMoneyCount - rulePaymentCount - couponPaymentCount - roundingAmount - hyryxPaymentCount)
    },

    // 抹零操作
    roundingOperate () {
      const realMoneyCount = this.formatAmount(this.sc_realMoneyCount + this.sc_rounding_amount)

      switch (this.roundingType) {
        // case 'yuan':
        //   this.sc_rounding_amount = this.formatAmount(this.formatAmount(unit) + this.formatAmount(realMoneyCount - parseInt(realMoneyCount)))
        //   break
        case 'jiao':
          this.sc_rounding_amount = this.formatAmount(realMoneyCount - parseInt(realMoneyCount))
          break
        case 'fen':
          this.sc_rounding_amount = this.formatAmount(
            this.formatAmount(this.formatAmount(realMoneyCount * 100) - parseInt(this.formatAmount(realMoneyCount * 100) / 10) * 10) / 100
          )
          break
      }

      if (this.formatAmount(this.sc_rounding_amount) > this.formatAmount(realMoneyCount)) {
        this.sc_rounding_amount = 0
        this.$q.notify({
          message: '错误',
          caption: '已超过结算金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
      this.sc_change_amount = 0
      this.nowPaymentMethod = []

      this.resetPaymentMethodData()
      this.computeRealMoneyCount()
      this.inputDiscountRuleIntegral()
      this.hyryxDiscountRuleIntegral()
    },

    cashSettlement () {
      const nowPaymentMethod = this.nowPaymentMethod
      this.$refs.payCashFormRef.validate().then((success) => {
        if (success) {
          let nowPayMoney = this.formatAmount(this.sc_handleMoneyCount - this.countTotalPayMoney())
          // console.log('this.sc_realMoneyCount', this.sc_realMoneyCount, 'this.countTotalPayMoney()', this.countTotalPayMoney())
          nowPayMoney = nowPayMoney >= this.sc_real_payment_cash ? this.sc_real_payment_cash : nowPayMoney

          nowPaymentMethod.push({
            value: nowPayMoney,
            name: '现金支付',
            key: 'cashPay'
          })
          this.$nextTick(() => {
            this.cashPayDialog = false
            this.nowPaymentMethod = nowPaymentMethod
            if (this.nowPaymentMethod) {
              this.sc_change_amount = this.formatAmount(this.sc_real_payment_cash - nowPayMoney)
              const ref_index = this.nowPaymentMethod.length
              setTimeout(() => {
                if (ref_index > 0) {
                  this.$refs.payMoneyRef[ref_index - 1].focus()
                }
              }, 200)
            }
          })
        }
      })
    },

    clearRoundingInput () {
      this.roundingType = 'none'
      this.sc_rounding_amount = 0
      this.roundingOperate()
      this.resetPaymentMethodData()
    },

    resetPaymentMethodData () {
      const that = this
      const paymentMethodData = that.paymentMethodData
      _(paymentMethodData).forEach(function (v) {
        v.selectStatus = false
      })
      that.useMoneyGivePoint = 0
      that.useDiscountMoney = 0
      that.useDiscountPoint = 0
      that.$nextTick(() => {
        that.paymentMethodData = paymentMethodData
      })
    },

    cancelCashSettlement () {
      this.cashPayDialog = false
      this.cancelSelectPay(this.nowPaymentMethod, 'cashPay')
    },

    openChangePrice () {
      this.changeRealPriceDialog = true
      const currentRealPriceInput = this.$refs.currentRealPriceInput
      setTimeout(() => {
        if (currentRealPriceInput) {
          currentRealPriceInput.focus()
        }
      }, 500)
    },

    roundingSettlement () {
      const realMoneyCount = this.formatAmount(this.sc_realMoneyCount + this.sc_rounding_amount)
      this.$refs.payCashFormRef.validate().then((success) => {
        if (success) {
          this.roundingType = 'yuan'
          if (this.currentRealPrice > realMoneyCount) {
            this.currentRealPrice = ''
            this.$q.notify({
              message: '错误',
              caption: '改价后金额不得大于实付金额',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          this.sc_rounding_amount = this.formatAmount(realMoneyCount - this.currentRealPrice)

          this.roundingOperate()
          this.cancelChangeRealPrice()
        }
      })
    },

    cancelChangeRealPrice () {
      this.changeRealPriceDialog = false
      this.currentRealPrice = 0
    },

    // 会员营销
    hyryxDiscountRule () {
      const hyryxDiscountValue = this.hyryxDiscountValue
      if (hyryxDiscountValue) {
        if (this.formatAmount(hyryxDiscountValue.phr_discount_proportion) && this.formatAmount(hyryxDiscountValue.phr_discount_proportion) < 100) {
          this.hyryxPaymentCount = this.formatAmount(
            this.sc_handleMoneyCount - this.formatAmount(this.sc_handleMoneyCount * (hyryxDiscountValue.phr_discount_proportion * 0.01))
          )
        }

        if (hyryxDiscountValue.phr_integral_multiple) {
          const integralConvert =
            this.storeBaseConfig && this.storeBaseConfig.consume_base_integralConvert ? this.storeBaseConfig.consume_base_integralConvert : 1
          this.hyryxGiveIntegral = this.formatAmount(
            this.formatAmount(hyryxDiscountValue.phr_integral_multiple) * this.formatAmount(integralConvert * this.sc_realMoneyCount)
          )
        }
      } else {
        // this.sc_realMoneyCount = this.sc_handleMoneyCount
        this.hyryxGiveIntegral = 0
        this.hyryxPaymentCount = 0
      }

      this.clearRoundingInput()
      this.computeRealMoneyCount()
    },

    // 会员营销
    hyryxDiscountRuleIntegral () {
      const hyryxDiscountValue = this.hyryxDiscountValue
      if (hyryxDiscountValue) {
        if (hyryxDiscountValue.phr_integral_multiple) {
          const integralConvert =
            this.storeBaseConfig && this.storeBaseConfig.consume_base_integralConvert ? this.storeBaseConfig.consume_base_integralConvert : 1
          this.hyryxGiveIntegral = this.formatAmount(
            this.formatAmount(hyryxDiscountValue.phr_integral_multiple) * this.formatAmount(integralConvert * this.sc_realMoneyCount)
          )
        }
      }
    },

    inputDiscountRuleIntegral () {
      const discountRule = this.discountRule
      if (discountRule) {
        if (discountRule.ic_integral_ratio) {
          this.ruleGiveIntegral = this.formatAmount(this.formatAmount(discountRule.ic_integral_ratio) * this.formatAmount(this.sc_realMoneyCount))
        }
      }
    }
  }
}
</script>
<style scoped>
.checkout-border {
  border: 2px solid #027be3;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
