<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-tabs
        v-model="typeTab"
        @input="changeTemplate"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab :name="item.name" :label="item.label" :key="key" v-for="(item, key) in templateTypeData" />
      </q-tabs>
    </div>

    <div class="col-shrink full-height">
      <consume-template ref="templatModelRef" :templatModel="typeTab" />
    </div>
  </div>
</template>

<script>
import ConsumeTemplate from './components/ConsumeTemplate'

export default {
  name: 'index',
  components: {
    ConsumeTemplate
  },
  data () {
    return {
      typeTab: 'consume',
      templateTypeData: [
        {
          label: '消费收银',
          name: 'consume'
        },
        {
          label: '快速消费',
          name: 'quickConsume'
        },

        {
          label: '会员充值',
          name: 'rechargeMoney'
        },

        {
          label: '储值扣费',
          name: 'deductMoney'
        },
        {
          label: '积分操作',
          name: 'deductPoint'
        }
      ]
    }
  },
  mounted () {
    this.changeTemplate()
  },
  computed: {},
  created () {
    this.context = this
  },
  methods: {
    changeTemplate () {
      this.$refs.templatModelRef.setTemplatModel(this.typeTab)
    }
  }
}
</script>

<style scoped></style>
