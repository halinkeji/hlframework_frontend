<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="turntab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="turn_return_out" label="借出" />
          <!-- <q-tab name="borrow_back" label="油站借回/取回" /> -->
          <!-- <q-tab name="turn_return_back" label="油站还出/还回" /> -->
          <!-- <q-tab name="return_out" label="关联还回" /> -->
          <q-tab name="return_back" label="借回" />
          <!-- <q-tab name="borrow_return_out" label="关联还出" /> -->
        </q-tabs>
      </div>

      <div class="col-shrink full-height" v-if="turntab == 'turn_return_out'">
        <lend-list />
      </div>

      <!-- <div class="col-shrink full-height" v-if="turntab == 'borrow_back'">
        <back-list />
      </div> -->

      <!-- <div class="col-shrink full-height" v-if="turntab == 'turn_return_back'">
        <return-out-list />
      </div> -->

      <!-- <div class="col-shrink full-height" v-if="turntab == 'return_out'">
        <link-return-out-list />
      </div> -->

       <div class="col-shrink full-height" v-if="turntab == 'return_back'">
        <link-lend-back />
      </div>

       <!-- <div class="col-shrink full-height" v-if="turntab == 'borrow_return_out'">
        <link-borrow-back />
      </div> -->
    </div>
  </q-page>
</template>
<script>
import LendList from './lend-out/LendList'
// import BackList from './lend-get/BackList'
// import ReturnOutList from './return-out/List'
// import LinkReturnOutList from './link-return-out/List'
import LinkLendBack from './link-lend-back/List'
// import LinkBorrowBack from './link-borrow-out/List'
export default {
  name: 'takeoil',
  components: {
    LendList,
    // BackList,
    // ReturnOutList,
    // LinkReturnOutList,
    LinkLendBack
    // LinkBorrowBack
  },
  data () {
    return {
      turntab: 'turn_return_out'
    }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>
