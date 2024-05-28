<template>
  <div>
    <div
      v-if="
        params.context &&
          params.context.goodsUnitData &&
          parseInt(params.context.goodsUnitData.gu_is_many) == 1
      "
    >
      <q-select
        v-model="params.data.unitId"
        emit-value
        map-options
        dense
        class="full-width"
        :options="params.context.speUnitData"
        option-value="id"
        option-label="gu_name"
        label="请选择"
      />
    </div>

    <div v-else class="text-center">
      <div v-if="params.context && params.context.goodsUnitData">
        {{ params.context.goodsUnitData.gu_name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AgSelectUnit',
  data () {
    return {
      options: []
    }
  },
  watch: {},
  methods: {}
}
</script>
