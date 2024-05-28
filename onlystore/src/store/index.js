import Vue from 'vue'
import Vuex from 'vuex'
import websorket from './websorket'
import example from './module-example'
import pmerchantManage from './pmerchant'
import smsMarket from './sms-market'

import goods from './goods/manage'
import goodstype from './goods/type'
import goodscount from './goods/count'
import goodsunit from './goods/unit'
import goodspackage from './goods/package'
import goodsTiming from './goods/timing'
import goodsTag from './goods/tag'


import commonReward from './reward'
import commonShift from './shift'
import commonKzls from './kzls'

import supplier from './erp/supplier'
import supplierType from './erp/supplierType'
import erpCustomer from './erp/customer'
import erpCustomerGroup from './erp/customer-group'
import sale from './erp/sale'
import erpin from './erp/in'
import erpnumber from './erp/number'
import repayment from './erp/repayment'
import erpchange from './erp/change'
import payment from './erp/payment'
import warningRules from './erp/rules'
import erpdepot from './erp/depot'


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
import returnGoods from './set/returngoods'


import consume from './service/consume'
import deductPoint from './service/deductpoint'
import deductMoney from './service/deductmoney'
import addCount from './service/addcount'
import deductCount from './service/deductcount'
import recharge from './service/rechargemoney'
import addGroupCount from './service/addgroupcount'
import quickConsume from './service/quickconsume'
import addDuration from './service/addduration'
import deductDuration from './service/deductduration'
import addGroupDuration from './service/addgroupduration'


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
import wechatCustomize from './plugin/wechat/customize' 

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

import wxMallGoods from './plugin/wxmall/wxgoods' 
import wxMallOrder from './plugin/wxmall/wxorder'
import wxMallAd from './plugin/wxmall/wxad' 
import wxMallSetting from './plugin/wxmall/setting' 
import wxMallFreight from './plugin/wxmall/freight'
import wxMallType from './plugin/wxmall/wxtype' 
import wxMallLable from './plugin/wxmall/lable' 
import wxMallMessage from './plugin/wxmall/message'
import wxMallPromotion from './plugin/wxmall/promotion' 
import wxMallBrowse from './plugin/wxmall/browse' 
import wxMallCollect from './plugin/wxmall/collect' 
import wxMallComment from './plugin/wxmall/comment' 

import checkin from './plugin/checkin/' 

import paidreg from './plugin/paidreg' 
import formfield from './plugin/formfield' 
import scales from './plugin/scales' 

import mezs from './plugin/mezs' 
import bmtk from './plugin/bmtk' 

import kmjh from './plugin/kmjh'
import speaker from './plugin/speaker' 
import receipt from './plugin/receipt' 
import market from './plugin/market'

import partner from './plugin/partner'
import zfk from './plugin/zfk'
import fxzx from './plugin/fxzx'
import hyjc from './plugin/hyjc'
import wuliu from './plugin/wuliu'
import track from './plugin/track'
import hyryx from './plugin/hyryx'
import zzyx from './plugin/zzyx'
import reserve from './plugin/reserve'
import zzfwf from './plugin/zzfwf'
import nochina from './plugin/nochina'

import cdyy from './plugin/cdyy' 
import paihao from './plugin/paihao'
import apisupplier from './plugin/apisupplier'
import wuliuapi from './plugin/wuliuapi' 

import jskm from './plugin/jskm'
import csjz from './plugin/csjz' 
import allinpay from './plugin/allinpay'

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
      websorket,
      components,
      deductPoint,
      consume,
      deductMoney,
      addCount,
      deductCount,
      recharge,
      addGroupCount,
      quickConsume,
      addDuration,
      deductDuration,
      addGroupDuration,
      invoice,
      charts,
      fixed,
      rechargepackages,
      returnGoods,
      settings,
      integralset,
      goods,
      goodsunit,
      goodstype,
      goodspackage,
      goodscount,
      goodsTiming,
      goodsTag,
      supplier,
      supplierType,
      erpCustomer,
      erpCustomerGroup,
      erpchange,
      commonReward,
      commonShift,
      commonKzls,
      sale,
      erpin,
      erpnumber,
      repayment,
      payment,
      warningRules,
      erpdepot,
      level,
      member,
      membertag,
      memberAddress,
      storenews,
      upload,
      role,
      user,
      wechatSet,
      wechatRule,
      wechatFans,
      wechatTemplate,
      wechatMenu,
      wechatWxsend,
      wechatCard,
      wechatCustomize,
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
      // 会员商城
      wxMallGoods,
      wxMallAd,
      wxMallOrder,
      wxMallSetting,
      wxMallFreight,
      wxMallLable,
      wxMallMessage,
      wxMallPromotion,
      wxMallType,
      wxMallBrowse,
      wxMallCollect,
      wxMallComment,

      checkin,
      paidreg,
      formfield,
      scales,
      mezs,
      bmtk,
      kmjh,
      speaker,
      receipt,
      market,
      partner,
      zfk,
      fxzx,
      hyjc,
      wuliu,
      track,
      hyryx,
      zzyx,
      reserve,
      zzfwf,
      nochina,

      cdyy,
      paihao,
      apisupplier,
      wuliuapi,
      jskm,
      csjz,
      allinpay
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
    // strict: false
  })
  return Store
}
