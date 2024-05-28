<template>
  <div>
    <q-chip v-if="params.data.jo_state == -1" outline color="negative" square text-color="white" class="q-ml-none">
      已删除
    </q-chip>
    <q-chip v-if="params.data.jo_state == '1'" outline color="secondary" square text-color="white" class="q-ml-none">
      待支付
    </q-chip>
    <q-chip v-if="params.data.jo_state == '2'" outline color="primary" square text-color="white" class="q-ml-none">
      待确认
    </q-chip>
    <q-chip v-if="params.data.jo_state == '3'" outline color="warning" square text-color="white" class="q-ml-none">
      {{ params.data.jo_type == 1 ? '待发货' : '待打包' }}
    </q-chip>
    <q-chip v-if="params.data.jo_state == '4'" outline color="warning" square text-color="white" class="q-ml-none">
      {{ params.data.jo_type == 1 ? '待收货' : '待自取' }}
    </q-chip>
    <q-chip v-if="params.data.jo_state == '5'" outline color="positive" square text-color="white" class="q-ml-none">
      待评价
    </q-chip>
    <q-chip v-if="params.data.jo_state == '6'" outline color="positive" square text-color="white" class="q-ml-none">
      已完成
    </q-chip>
    <q-chip v-if="params.data.jo_state == '7'" outline color="negative" square text-color="white" class="q-ml-none">
      已取消
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
