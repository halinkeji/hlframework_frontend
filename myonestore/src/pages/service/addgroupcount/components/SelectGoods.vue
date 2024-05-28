<template>
  <q-dialog
    fullscreen
    v-model="packagePopup"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">选择套餐</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="row">
        <div class="col" v-for="item in packageList" :key="item.id">
          <q-card bordered flat class="q-ma-sm">
            <q-card-section>
              <span class="text-subtitle1">{{ item.grp_name }}</span>

              <q-chip
                square
                color="amber-8"
                text-color="white"
                class="q-mx-md float-right"
              >
                <span>{{ item.grp_packagePrice }}</span>
              </q-chip>
            </q-card-section>
            <q-separator />
            <div style="height:300px" class="con-example-images">
              <q-card
                class="q-ma-sm"
                v-for="data in item.rechargeDetail"
                :key="data.id"
              >
                <div class="row q-ma-sm">
                  <div class="col-10">
                    {{ data.grc_goodsName }}
                    {{
                      data.grc_specificationName
                        ? "-" + data.grc_specificationName
                        : ""
                    }}
                  </div>
                  <div class="col-2 text-right  text-red">
                    {{ data.grc_count }}次
                  </div>
                  <div class="col-12 q-mt-sm  text-green-13">
                    <span v-if="data.grc_setusedatetype == 1">无限制</span>
                    <span v-if="data.grc_setusedatetype == 2"
                      >使用限制为{{ data.grc_num }}次/年</span
                    >
                    <span v-if="data.grc_setusedatetype == 3"
                      >使用限制为{{ data.grc_num }}次/季度</span
                    >
                    <span v-if="data.grc_setusedatetype == 4"
                      >使用限制为{{ data.grc_num }}次/月</span
                    >
                    <span v-if="data.grc_setusedatetype == 5"
                      >使用限制为{{ data.grc_num }}次/周</span
                    >
                    <span v-if="data.grc_setusedatetype == 6"
                      >使用限制为{{ data.grc_num }}次/天</span
                    >
                  </div>
                </div>
              </q-card>
            </div>
            <div class="row q-ma-lg">
              <q-chip color="positive" class="text-center" text-color="white">
                <span v-if="item.grp_timeType == 3">
                  指定时间内有效，有效期为
                  {{
                    $q_date.formatDate(
                      item.grp_startTime * 1000,
                      "YYYY-MM-DD "
                    )
                  }}到
                  {{
                    $q_date.formatDate(item.grp_endTime * 1000, "YYYY-MM-DD ")
                  }}内有效
                </span>
                <span v-if="item.grp_timeType == 2">
                  <span v-if="item.grp_endTime == 1"
                    >相对时间内有效，有效期不限制</span
                  >
                  <span v-if="item.grp_endTime == 2"
                    >相对时间内有效，有效期为{{
                      item.grp_startTime
                    }}年内有效</span
                  >
                  <span v-if="item.grp_endTime == 3"
                    >相对时间内有效，有效期为{{
                      item.grp_startTime
                    }}季度内有效</span
                  >
                  <span v-if="item.grp_endTime == 4"
                    >相对时间内有效，有效期为{{
                      item.grp_startTime
                    }}月内有效</span
                  >
                  <span v-if="item.grp_endTime == 5"
                    >相对时间内有效，有效期为{{
                      item.grp_startTime
                    }}周内有效</span
                  >
                  <span v-if="item.grp_endTime == 6"
                    >相对时间内有效，有效期为{{
                      item.grp_startTime
                    }}天内有效</span
                  >
                </span>
                <span v-if="item.grp_timeType == 1">永久有效</span>
              </q-chip>
            </div>

            <q-card-actions align="right" class="q-pb-md">
              <q-btn
                label="加入购物车"
                @click="addShoppingCart(item.id)"
                color="primary"
                class="text-right"
                size="sm"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
      <q-card-section> </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: "SelectGoods",
  components: {},

  data() {
    return {
      packageList: [],
      memberId: 0,
      maximizedToggle: true,

      packagePopup: false
    };
  },

  mounted() {},
  created() {},
  computed: {},
  methods: {
    info(mId) {
      this.memberId = mId;
      this.packagePopup = true;
      this.getCountPackageList();
    },
    //获取充次套餐商品
    getCountPackageList() {
      const obj = {};
      this.$store
        .dispatch("addGroupCount/getCountPackageList", obj)
        .then(res => {
          if (res.code == 200) {
            this.packageList = res.data.list;
            this.page.pageTotal = res.data.page.totalCount;
          }
        })
        .catch(error => {});
    },
    //添加至购物车
    addShoppingCart(packageId) {
      this.showGoodsList = false;
      if (packageId > 0) {
        const obj = {
          mId: this.memberId,
          packageId: packageId
        };
        this.$store
          .dispatch("addGroupCount/addShoppingCart", obj)
          .then(res => {
            if (res.data.code == 0) {
              this.$emit("refreshDataList");
              this.packagePopup = false;
            } else {
              this.$q.notify({
                message: "失败",
                caption: "操作失败",
                icon: "ion-close-circle-outline",
                color: "red",
                position: "top-right"
              });
              this.disabled = false;
            }
          })
          .catch(error => {});
      }
    }
  }
};
</script>

<style lang="stylus">
.con-example-images {
  max-height: 300px;
  overflow: auto;
}
</style>
