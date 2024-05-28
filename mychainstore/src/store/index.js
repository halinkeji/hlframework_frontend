import Vue from 'vue'
import Vuex from 'vuex'

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


import commonShift from './shift'
import commonKzls from './kzls'

import rewardPosition from './reward/position' 
import rewardLabel from './reward/label' 
import reserve from './reserve'
import pattern from './pattern' 
import comment from './comment'

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
import erpTurn from './erp/turn'

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
import merchant from './set/merchant' 
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

import checkin from './plugin/checkin/' 
import paidreg from './plugin/paidreg' 
import formfield from './plugin/formfield' 

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
import track from './plugin/track'
import hyryx from './plugin/hyryx'
import zzyx from './plugin/zzyx'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
const Store = new Vuex.Store({
  modules: {
    example,
    pmerchantManage,
    smsMarket,
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
    commonShift,
    commonKzls,
    sale,
    erpin,
    erpnumber,
    repayment,
    payment,
    warningRules,
    erpdepot,
    erpTurn,
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
    wxPay,
    aliPay,
    rfidPlugin,
    cloudprinter,
    hlCoupon,
    integralset,
    merchant,
    // 职员绩效

    rewardPosition,
    rewardLabel,
    reserve,
    pattern,
    comment,

    // 插件 start
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

    wxapp,
    checkin,
    formfield,
    paidreg,
    market,
    receipt,
    zfk,
    fxzx,
    hyjc,
    track,
    mezs,
    bmtk,
    kmjh,
    speaker,
    partner,
    hyryx,
    zzyx

  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
})
export default function (/* { ssrContext } */) {
  return Store
}
