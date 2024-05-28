import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'
import smsMarket from './sms-market'
import merchantManage from './merchant'
import marketingManage from './marketing'

import financeManage from './finance'

import goods from './goods/manage'
import goodstype from './goods/type'
import goodscount from './goods/count'
import goodsunit from './goods/unit'
import goodspackage from './goods/package'
import goodsTiming from './goods/timing'
import goodsTag from './goods/tag'

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
import blog from './set/blog'
import ad from './set/ad'
import rechargepackages from './set/rechargepackages' 
import integralset from './set/integralset' 
import charts from './set/charts'



import deductPoint from './service/deductpoint'
import deductMoney from './service/deductmoney'

import recharge from './service/rechargemoney'


import upload from './upload'
import role from './rbac/role'
import user from './rbac/user'

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

import kmjh from './plugin/kmjh'
import paidreg from './plugin/paidreg' 

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
      smsMarket,
      marketingManage,
      components,
      deductPoint,
      deductMoney,
      recharge,
      invoice,
      fixed,
      rechargepackages,
      settings,
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
      sale,
      erpin,
      erpnumber,
      repayment,
      payment,
      warningRules,
      erpdepot,
      level,
      member,
      memberAddress, 
      blog,
      ad,
      upload,
      role,
      user,

      wxapp,

      hlCoupon,
      integralset,
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

      membertag,

      charts,
      merchantManage,
      financeManage,
      kmjh,
      paidreg

    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
    // strict: false
  })
  return Store
}
