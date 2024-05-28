<template>
  <div>
    <hl-table
      :listData="consumeData"
      :listColumns="listColumns"
      title="本班次流水记录/汇总"
    >
    </hl-table>
  </div>
</template>
<script>
export default {
  name: 'TotalCount',
  components: {},
  props: ['consumeData'],
  data () {
    return {
      listColumns: [
        {
          label: '类别',
          align: 'center',
          field: 'type'
        },
        {
          label: '交易总数',
          align: 'center',
          field: 'totalCount'
        },
        {
          label: '交易总额',
          align: 'center',
          field: 'totalAmount'
        },
        {
          label: '实付总额',
          align: 'center',
          field: 'totalRealAmount'
        },
        {
          label: '现金总收',
          align: 'center',
          field: 'cashAmount'
        },
        {
          label: '微信支付总收',
          align: 'center',
          field: 'wxpayTotal'
        },
        {
          label: '支付宝总收',
          align: 'center',
          field: 'alipayTotal'
        },
        {
          label: '个人微信总收',
          align: 'center',
          field: 'personalWxPay'
        },
        {
          label: '个人支付宝总收',
          align: 'center',
          field: 'personalAliPay'
        },
        {
          label: '银行卡总收',
          align: 'center',
          field: 'bankCardPay'
        },
        {
          label: '积分支付',
          align: 'center',
          field: 'pointPay'
        },
        {
          label: '储值支付',
          align: 'center',
          field: 'rechargePay'
        }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>
