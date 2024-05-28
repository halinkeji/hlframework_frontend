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

import goodsCustomize from './goods/customize'
import goodsMarkup from './goods/markup'
import goodsPriority from './goods/priority'
import goodsProperty from './goods/property'


import supplier from './erp/supplier'
import supplierType from './erp/supplierType'

import warningRules from './erp/rules'
import erpdepot from './erp/depot'

import erpPurchase from './erp/purchase' 
import erpBuyer from './erp/buyer'
import erpOrder from './erp/order'
import erpOrderGoods from './erp/ordergoods' 
import erpAllocation from './erp/allocation'
import erpTransfer from './erp/transfer' 
import erpCheck from './erp/check'
import erpOut from './erp/out'
import erpPacking from './erp/packing' 
import erpWuliu from './erp/wuliu' 
import erpOrderin from './erp/orderin' 
import erpPurchaseReturn from './erp/return/purchase' 
import erpStoreReturn from './erp/return/store' 
import erpStorein from './erp/return/storein'
import erpStoreout from './erp/return/storeout' 
import erpPurchaseOut from './erp/return/purchase-out' 
import erpin from './erp/in' 
import erpTransferOut from './erp/transferout' 
import erpTransferIn from './erp/transferin'
import erpNumber from './erp/number'
import erpchange from './erp/change'
import erpDirect from './erp/direct/order'
import erpDirectAllocation from './erp/direct/allocation'
import erpDirectOut from './erp/direct/out'
import erpDirectin from './erp/direct/in'
import erpChangeType from './erp/changetype'
import warningProduct from './erp/warning/product'
import erphistory from './erp/history'

import member from './member/member'
import level from './member/level'
import membertag from './member/tag'

import settings from './set/settings'
import components from './components'
import invoice from './set/invoice' 
import fixed from './set/fixed' 
import storenews from './set/storenews'
import rechargepackages from './set/rechargepackages' 
import returnGoods from './set/returngoods'
import charts from './set/charts'

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


import exports from './file/exports'
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

import integralset from './set/integralset'

import merchant from './set/merchant' 

import kzls from './plugin/kzls' 

import czzs from './plugin/czzs'

import checkin from './plugin/checkin/' 
import zzpay from './plugin/zzpay'

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
import reserve from './plugin/reserve' 

import wuliu from './plugin/wuliu'
import zfk from './plugin/zfk'
import fxzx from './plugin/fxzx'
import hyjc from './plugin/hyjc'
import track from './plugin/track'

// import performance from './reward/performance'
import hyryx from './plugin/hyryx'
import zzfwf from './plugin/zzfwf'
import nochina from './plugin/nochina'
import zzyx from './plugin/zzyx'
import promotion from './plugin/promotion'

import storeCredit from './set/storeCredit'

import rewardPerformance from './reward/performance'
import rewardPosition from './reward/position'
import rewardWages from './reward/wages'
import rewardIndicators from './reward/indicators'

import reports from './set/reports'

import wxMallGoods from './wxmall/wxgoods' 
import wxMallOrder from './wxmall/wxorder' 
import wxMallAd from './wxmall/wxad' 
import wxMallSetting from './wxmall/setting' 
import wxMallFreight from './wxmall/freight' 
import wxMallType from './wxmall/wxtype' 
import wxMallLable from './wxmall/lable' 
import wxMallMessage from './wxmall/message' 
import wxMallPromotion from './wxmall/promotion' 
import wxMallBrowse from './wxmall/browse'
import wxMallCollect from './wxmall/collect' 
import wxMallComment from './wxmall/comment' 

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

    goodsCustomize,
    goodsMarkup,
    goodsPriority,
    goodsProperty,

    supplier,
    supplierType,

    warningRules,
    erpdepot,
    erpPurchase,
    erpBuyer,
    erpOrder,
    erpOrderGoods,
    erpAllocation,
    erpTransfer,
    erpTransferIn,
    erpTransferOut,
    erpCheck,
    erpPacking,
    erpOut,
    erpWuliu,
    erpOrderin,
    erpPurchaseReturn,
    erpPurchaseOut,
    erpStoreReturn,
    erpStorein,
    erpStoreout,
    erpNumber,
    erpin,
    erpchange,
    erpDirect,
    erpDirectAllocation,
    erpDirectOut,
    erpDirectin,
    erpChangeType,
    erphistory,
    warningProduct,
    level,
    member,
    storenews,
    exports,
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
    integralset,

    kzls,

    czzs,

    merchant,
    track,

    checkin,
    zzpay,
    formfield,
    paidreg,
    scales,

    membertag,
    mezs,
    bmtk,
    kmjh,
    speaker,
    receipt,
    market,
    partner,
    reserve,
    wuliu,
    charts,
    zfk,

    hyjc,
    fxzx,
    hyryx,
    zzfwf,
    nochina,
    zzyx,
    promotion,
    performance,
    storeCredit,
    rewardPerformance,
    rewardWages,
    rewardIndicators,
    rewardPosition,
    reports,

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
    wxMallComment

  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
})

export default function (/* { ssrContext } */) {
  return Store
}
