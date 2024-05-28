<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-sm">
      <q-tabs v-model="tab" dense indicator-color="primary" active-color="primary" class="text-grey-8" align="left" inline-label>
        <q-tab name="1" label="会员" />
        <q-tab name="2" label="商家" />
      </q-tabs>
    </div>

    <div class="col-shrink full-height q-pa-xs bg-grey-2">
      <q-scroll-area class="fit full-height">
        <q-tab-panels class="bg-grey-2" v-model="tab" animated>
          <q-tab-panel name="1" class="q-pa-none">
            <div class="q-col-gutter-md row ">
              <div class="col-md-4 col-12">
                <q-card flat bordered class="q-pa-md text-subtitle1">
                  <div class="row items-center">
                    <div class="col">
                      消费账单提醒
                    </div>
                    <div class="col text-right">
                      OPENTM407391371
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="text-center">#账单更新#</div>
                  <div class="q-mt-sm">
                    账本：{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit }}账单/{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}账单 <br />时间：#2016年10月01日# <br />#备注：北京复兴门百货店提醒您，认真核对账单，如有疑问请致电13912345678，我们将竭诚为您服务！#
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="q-my-md">
                    使用位置：<q-chip square color="primary" text-color="white">
                      {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit }}变更
                    </q-chip>
                    <q-chip square color="amber" text-color="white">
                      {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}变更
                    </q-chip>
                  </div>
                </q-card>
              </div>
              <div class="col-md-4 col-12">
                <q-card flat bordered class="q-pa-md text-subtitle1">
                  <div class="row items-center">
                    <div class="col">
                      会员级别变更提醒
                    </div>
                    <div class="col text-right">
                      TM00891
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="text-center">
                    # 亲爱的张先生，恭喜你成功升级为VIP会员。#
                  </div>
                  <div class="q-mt-sm">原先等级：#普通# <br />当前等级：#VIP# <br />时间：#2013年9月30日 17:58# <br />#您可继续享有普通会员专属优惠及服务。#。</div>
                  <q-separator class="q-my-sm" />
                  <div class="q-my-md">
                    使用位置：<q-chip square color="primary" text-color="white">
                      会员管理升级
                    </q-chip>
                    <q-chip square color="amber" text-color="white">
                      自助升级
                    </q-chip>
                  </div>
                </q-card>
              </div>
              <div class="col-md-4 col-12">
                <q-card flat bordered class="q-pa-md text-subtitle1">
                  <div class="row items-center">
                    <div class="col">
                      核销成功提醒
                    </div>
                    <div class="col text-right">
                      OPENTM409521536
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="text-center">
                    # 您的订单已成功核销。#
                  </div>
                  <div class="q-mt-sm">核销项目：#香薰按肩项目券# <br />核销时间：#2017年3月10日 15:00:00# <br />核销门店：#示例会所# <br />#感谢您的使用#！</div>
                  <q-separator class="q-my-sm" />
                  <div class="q-my-md">
                    使用位置：<q-chip square color="primary" text-color="white">
                      PC端卡券核销
                    </q-chip>
                    <q-chip square color="amber" text-color="white">
                      PC端订单核销
                    </q-chip>
                  </div>
                </q-card>
              </div>

              <div class="col-md-4 col-12">
                <q-card flat bordered class="q-pa-md text-subtitle1">
                  <div class="row items-center">
                    <div class="col">
                      办理成功通知
                    </div>
                    <div class="col text-right">
                      OPENTM409797795
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="text-center">
                    # 您好，您的卡券已办理成功。#
                  </div>
                  <div class="q-mt-sm">商户名称：#XXX美容院# <br />卡券名称：#3折卡# <br />有效期：#2017/1/1到2018/1/1# <br />办理时间：#2017/2/1# <br />感谢您的支持，谢谢！</div>
                  <q-separator class="q-my-sm" />
                  <div class="q-my-md">
                    使用位置：<q-chip square color="primary" text-color="white">
                      PC端卡券派发
                    </q-chip>
                    <q-chip square color="amber" text-color="white">
                      微信端卡券领取
                    </q-chip>
                  </div>
                </q-card>
              </div>
              <div class="col-md-4 col-12">
                <q-card flat bordered class="q-pa-md text-subtitle1">
                  <div class="row items-center">
                    <div class="col">
                      会员注册成功提醒
                    </div>
                    <div class="col text-right">
                      OPENTM207207788
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="text-center">
                    #会员注册成功，欢迎您成为某商户的尊贵会员。#
                  </div>
                  <div class="q-mt-sm">会员昵称：哇咔 <br />会员卡：钻石卡 <br />注册时间：2015-08-06 18:36 <br />出示会员卡即可享受会员权益。</div>
                  <q-separator class="q-my-sm" />
                  <div class="q-my-md">
                    使用位置：<q-chip square color="primary" text-color="white">
                      微信端会员激活
                    </q-chip>
                    <q-chip square color="amber" text-color="white">
                      微信端会员注册
                    </q-chip>
                  </div>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="2" class="q-pa-none">
            <div class="q-col-gutter-md row ">
              <div class="col-md-4 col-12">
                <q-card flat bordered class="q-pa-md text-subtitle1">
                  <div class="row items-center">
                    <div class="col">
                      新会员加入通知
                    </div>
                    <div class="col text-right">
                      OPENTM202967310
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="text-center">
                    #恭喜您，有新会员加入。#
                  </div>
                  <div class="q-mt-sm">会员编号：#123456# <br />加入时间：#2015-03-10 22:19# <br />感谢您的努力！</div>
                  <q-separator class="q-my-sm" />
                  <div class="q-my-md">
                    使用位置：<q-chip square color="primary" text-color="white">
                      微信端会员注册
                    </q-chip>
                    <q-chip square color="amber" text-color="white">
                      会员激活
                    </q-chip>
                  </div>
                </q-card>
              </div>
              <div class="col-md-4 col-12">
                <q-card flat bordered class="q-pa-md text-subtitle1">
                  <div class="row items-center">
                    <div class="col">
                      收款成功通知
                    </div>
                    <div class="col text-right">
                      OPENTM408727351
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="text-center">
                    #您好,您有一笔订单收款成功。#
                  </div>
                  <div class="q-mt-sm">到账金额：#{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}20.00# <br />支付方式：#微信支付# <br />支付时间：#2017-01-01 12:12:12# <br />订单编号：#12345678900# <br />详情请前往门店账户{{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}查看.</div>
                  <q-separator class="q-my-sm" />
                  <div class="q-my-md">
                    使用位置：<q-chip square color="primary" text-color="white">
                      PC端业务收款
                    </q-chip>
                    <q-chip square color="amber" text-color="white">
                      微信端充值
                    </q-chip>
                    <q-chip square color="red" text-color="white">
                      微信端充次
                    </q-chip>
                  </div>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionTab',
  data () {
    return {
      tab: '1'
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>

<style></style>
