<template>
  <div>
    <q-chip v-if="parseInt(params.data.wo_state) == -1"   color="grey" text-color="white" class="q-ml-none">
      已删除
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 1"  color="secondary" text-color="white" class="q-ml-none">
      待付款
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 2"   color="primary" text-color="white" class="q-ml-none">
      待确认（已付款）
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 3"   color="warning" text-color="white" class="q-ml-none">
      {{ params.data.wo_type == 1 ? '待发货' : '待打包' }}
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 4"   color="warning" text-color="white" class="q-ml-none">
      {{ params.data.wo_type == 1 ? '待收货' : '待自取' }}
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 5"   color="positive" text-color="white" class="q-ml-none">
      待评价
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 6"   color="positive" text-color="white" class="q-ml-none">
      已完成
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 7"   color="negative" text-color="white" class="q-ml-none">
      已取消
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 8"   color="negative" text-color="white" class="q-ml-none">
      申请退货退款
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 9"   color="negative" text-color="white" class="q-ml-none">
      申请仅退款
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 10"   color="negative" text-color="white" class="q-ml-none">
      商家拒绝退款退货申请
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 11"   color="positive" text-color="white" class="q-ml-none">
      商家同意退款退货申请
    </q-chip>
    <q-chip v-if="parseInt(params.data.wo_state) == 12"   color="positive" text-color="white" class="q-ml-none">
      订单退款成功
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgType',
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>

<style></style>
