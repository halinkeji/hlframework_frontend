import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'
import pmerchantManage from './pmerchant'
import smsMarket from './sms-market'

import member from './member/member'
import level from './member/level'

import settings from './set/settings'
import components from './components'
import invoice from './set/invoice' 
import fixed from './set/fixed' 
import storenews from './set/storenews'
import rechargepackages from './set/rechargepackages' 
import returnGoods from './set/returngoods'


import consume from './service/consume'
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
import hlCoupon from './plugin/hlcoupon' 
import wxapp from './plugin/wxapp' 

import integralset from './set/integralset' 

import merchant from './set/merchant' 

import czzs from './plugin/czzs'

import checkin from './plugin/checkin/'

import paidreg from './plugin/paidreg' 
import formfield from './plugin/formfield' 
import scales from './plugin/scales' 
import cloudprinter from './plugin/cloudprinter' 
import membertag from './member/tag' 
import mezs from './plugin/mezs'
import bmtk from './plugin/bmtk' 

import kmjh from './plugin/kmjh'
import speaker from './plugin/speaker' 
import receipt from './plugin/receipt' 
import market from './plugin/market'

import partner from './plugin/partner' 
import reserve from './plugin/reserve' 

import clothingGroup from './clothing/group'
import clothingTag from './clothing/tag'
import clothingProperty from './clothing/property'
import clothingUnit from './clothing/unit'
import clothingType from './clothing/type'
import clothingStandard from './clothing/standard'
import clothingMarkup from './clothing/markup'
import clothingPriority from './clothing/priority'
import clothingCustomize from './clothing/customize'
import clothingFormat from './clothing/format'
import clothingDepot from './clothing/depot'
import clothingLocation from './clothing/location'
import clothingArchives from './clothing/archives'
import clothingShelf from './clothing/shelf'
import clothingConfig from './clothing/config'
import clothingSupplier from './clothing/supplier'
import erpPurchase from './erp/purchase'
import erpBuyer from './erp/buyer'
import erpOrder from './erp/order'
import erpOrderGoods from './erp/ordergoods'
import erpAllocation from './erp/allocation' 
import erpTransfer from './erp/transfer'
import erpCheck from './erp/check'
import erpOut from './erp/out' 
import erpPacking from './erp/packing'

import erpOrderin from './erp/orderin'
import erpPurchaseReturn from './erp/return/purchase' 
import erpStoreReturn from './erp/return/store' 
import erpStorein from './erp/return/storein' 
import erpStoreout from './erp/return/storeout'
import erpPurchaseOut from './erp/return/purchase-out'

import erpTransferOut from './erp/transferout'
import erpTransferIn from './erp/transferin'
import erpNumber from './erp/number'
import erpchange from './erp/change'
import erpChangeType from './erp/changetype'
import erpDirect from './erp/direct/order'
import erpDirectAllocation from './erp/direct/allocation'
import erpDirectOut from './erp/direct/out'
import erpDirectin from './erp/direct/in'

import erphistory from './erp/history'

import erpin from './erp/in'

import promotion from './plugin/promotion'

import charts from './set/charts'

import storeCredit from './set/storeCredit'
import exports from './file/exports'

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

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      example,
      pmerchantManage,
      smsMarket,
      components,
      deductPoint,
      consume,
      deductMoney,
      recharge,
      quickConsume,
      invoice,
      fixed,
      rechargepackages,
      returnGoods,
      settings,
      level,
      member,
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
      wxapp,
      wxPay,
      aliPay,
      rfidPlugin,
      hlCoupon,
      integralset,
      // 插件 start
      // 积分商城

      czzs,

      /*
        连锁新增
      */

      merchant,
      scales,
      formfield,

      mezs,
      checkin,

      paidreg,

      membertag,
      bmtk,
      kmjh,
      speaker,
      receipt,
      market,
      partner,
      reserve,
      clothingGroup,
      clothingTag,
      clothingProperty,
      clothingUnit,
      clothingType,
      clothingStandard,
      clothingMarkup,
      clothingPriority,
      clothingCustomize,
      clothingFormat,
      clothingDepot,
      clothingLocation,
      clothingArchives,
      clothingShelf,
      clothingConfig,
      clothingSupplier,
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
      erpOrderin,
      erpPurchaseReturn,
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
      erpPurchaseOut,

      storeCredit,
      cloudprinter,
      promotion,
      charts,
      exports,

      rewardPerformance,
      rewardWages,
      rewardIndicators,
      rewardPosition,
      reports,

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
      wxMallComment
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
