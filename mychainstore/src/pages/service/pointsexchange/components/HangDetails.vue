<template>
  <div class="flex flex-wrap">
    <q-dialog v-model="hangDetails">
      <q-card style="width: 800px; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title class="text-center"> 挂单详情</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <div class="q-ma-sm">
          <q-table
            :data="hangDataList"
            :columns="integralData"
            row-key="name"
            hide-bottom
          />
        </div>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn
            label="解挂"
            @click="solutionsHanging()"
            color="primary"
            class="text-right"
            size="sm"
          />
          <q-btn
            label="取消"
            @click="hangDetails = false"
            class="text-right"
            size="sm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "xfsy",
  components: {},
  data() {
    return {
      hangDetails: false,
      hangDataList: [],
      consumehangup_id: 0,
      member_id: 0,
      integralData: [
        {
          label: "商品名称",
          align: "left",
          field: "chud_goo_name"
        },
        {
          align: "left",
          label: "售价",
          field: "chud_goo_price"
        },
        {
          label: "会员价",
          align: "left",
          field: "chud_memberPrice"
        },
        { label: "数量", align: "left", field: "chud_consumeNumber" },
        {
          label: "小计金额",
          align: "left",
          field: "chud_totalPrice"
        }
      ]
    };
  },

  mounted() {},
  created() {},
  computed: {},
  methods: {
    //挂单详情
    hangDetailsBut(val, memberId) {
      this.consumehangup_id = val;
      this.member_id = memberId;
      const obj = {
        consumehangup_id: val,
        page: 1,
        pSize: 100
      };
      this.$store
        .dispatch("consume/getShoppingCartList", obj)
        .then(res => {
          if (res.data) {
            this.hangDataList = res.data.list;
            this.hangDetails = true;
          } else {
            this.hangDataList = [];
          }
        })
        .catch(error => {});
    },
    //解挂
    solutionsHanging() {
      this.hangDetails = false;
      this.$emit("solutionsHanging", this.consumehangup_id, this.member_id);
    }
  }
};
</script>
<style lang="scss"></style>
