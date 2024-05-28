<template>
  <q-page class="fit">
    <div
      class="fit column no-wrap justify-between items-stretch content-stretch no-scroll"
    >
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs
          v-model="activeName"
          class="bg-white "
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-tab name="0" label="客户"> </q-tab>
          <q-tab name="1" label="客户分组"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2">
        <div v-if="activeName == '0'" class="fit">
          <erp-client></erp-client>
        </div>
        <div v-if="activeName == '1'" class="fit">
          <erp-client-group></erp-client-group>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import ErpClient from './components/ErpClient.vue'
import ErpClientGroup from './components/ErpClientGroup.vue'
export default {
  name: 'clientIndex',
  components: { ErpClient, ErpClientGroup },
  data () {
    return {
      activeName: '0'
    }
  },
  mounted () {},
  watch: {},
  created () {},
  computed: {},
  methods: {}
}
</script>
<style></style>
