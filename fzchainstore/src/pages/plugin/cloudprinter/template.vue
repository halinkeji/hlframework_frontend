<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="typeTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="receipt" label="小票模板" />
          <q-tab name="label" label="标签模板" />
          <q-tab name="hangTag" label="吊牌模板" />
          <!-- <q-tab name="bill" label="票据模板" /> -->
        </q-tabs>
      </div>

      <div class="col-shrink full-height" v-if="typeTab == 'receipt'">
        <receipt-template />
      </div>
      <div class="col-shrink full-height" v-if="typeTab == 'bill'"></div>
      <div class="col-shrink full-height" v-if="typeTab == 'label'">
        <lable-template />
      </div>
      <div class="col-shrink full-height" v-if="typeTab == 'hangTag'">
        <hang-tag-template />
      </div>
    </div>
  </q-page>
</template>

<script>
import ReceiptTemplate from './ReceiptTemplate';
import LableTemplate from './LableTemplate';
import HangTagTemplate from './HangTagTemplate';

export default {
  name: 'index',
  components: {
    ReceiptTemplate,
    LableTemplate,
    HangTagTemplate,
  },
  data() {
    return {
      typeTab: 'receipt',
    };
  },
  mounted() {},
  computed: {},
  created() {},
  methods: {},
};
</script>

<style scoped></style>
