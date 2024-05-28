import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'
import pmerchantManage from './pmerchant'
import smsMarket from './sms-market'
import commonShift from './shift'
import commonKzls from './kzls'
import merchant from './set/merchant'

import member from './member/member'
import level from './member/level'
import membertag from './member/tag' 
import memberAddress from './member/address' 

import settings from './set/settings'
import components from './components'
import invoice from './set/invoice'
import fixed from './set/fixed' 
import storenews from './set/storenews'
import rechargepackages from './set/rechargepackages'
import integralset from './set/integralset'
import charts from './set/charts'

import deductPoint from './service/deductpoint'
import deductMoney from './service/deductmoney'
import recharge from './service/rechargemoney'
import quickConsume from './service/quickconsume'


import upload from './upload'
import role from './rbac/role'
import user from './rbac/user'

import wechatSet from './plugin/wechat/set' 
import wechatRule from './plugin/wechat/rule' 
import wechatMenu from './plugin/wechat/menu' 
import wechatFans from './plugin/wechat/fans' 
import wechatTemplate from './plugin/wechat/template'
import wechatWxsend from './plugin/wechat/wxsend' 
import wechatCard from './plugin/wechat/card'


import wxPay from './plugin/wxpay' 
import aliPay from './plugin/alipay' 

import rfidPlugin from './plugin/rfid' 
import cloudprinter from './plugin/cloudprinter'
import hlCoupon from './plugin/hlcoupon' 
import wxapp from './plugin/wxapp'

import jfOrder from './plugin/jfmall/jforder' 
import jfAd from './plugin/jfmall/jfad' 
import jfSetting from './plugin/jfmall/setting' 
import jfGoods from './plugin/jfmall/goods' 
import jfExchange from './plugin/jfmall/exchange'
import jfFreight from './plugin/jfmall/freight'
import jfMessage from './plugin/jfmall/message'
import jfType from './plugin/jfmall/type' 
import jfLable from './plugin/jfmall/lable' 
import jfBrowse from './plugin/jfmall/browse' 
import jfCollect from './plugin/jfmall/collect'
import jfComment from './plugin/jfmall/comment' 

import paidreg from './plugin/paidreg'
import formfield from './plugin/formfield' 

import mezs from './plugin/mezs' 

import kmjh from './plugin/kmjh'
import speaker from './plugin/speaker' 
import receipt from './plugin/receipt' 
import zfk from './plugin/zfk'
import hyjc from './plugin/hyjc'
import hyryx from './plugin/hyryx'

import desk from './desk'
import dishes from './dishes'
import consumeorder from './service/consumeorder'
import orderlist from './set/orderlist'
import reserveorder from './reserveorder'
import fastfood from './service/fastfood'
import reward from './reward'
import fooderp from './fooderp'
import materialManage from './material'
import foodPaihao from './paihao'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {

      example,
      pmerchantManage,
      smsMarket,
      components,
      deductPoint,
      deductMoney,
      recharge,
      quickConsume,
      invoice,
      charts,
      fixed,
      rechargepackages,
      settings,
      integralset,
      merchant,
      level,
      member,
      membertag,
      memberAddress,
      storenews,
      upload,
      role,
      user,
      commonShift,
      commonKzls,
      wechatSet,
      wechatRule,
      wechatFans,
      wechatTemplate,
      wechatMenu,
      wechatWxsend,
      wechatCard,
      wxapp,
      wxPay,
      aliPay,
      rfidPlugin,
      cloudprinter,
      hlCoupon,
      // 积分商城
      jfAd,
      jfGoods,
      jfOrder,
      jfFreight,
      jfMessage,
      jfSetting,
      jfLable,
      jfBrowse,
      jfCollect,
      jfComment,
      jfType,
      jfExchange,

      paidreg,
      formfield,
      mezs,
      kmjh,
      speaker,
      receipt,
      zfk,
      hyjc,
      hyryx,

      desk,
      dishes,
      consumeorder,
      orderlist,
      reserveorder,
      fastfood,
      reward,
      fooderp,
      materialManage,
      foodPaihao
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
