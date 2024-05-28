<template>
  <div>
    <q-btn
      icon="las la-trash-alt"
      color="red"
      outlined
      dense
      @click="deleteData()"
    ></q-btn>
  </div>
</template>

<script>
export default {
  name: "AgOperating",
  methods: {
    deleteData() {
      const obj = {
        id: this.params.data.id,
        type: 1,
        mId: this.params.context.hangData.member_id
      };
      this.$store.dispatch("pointsexchange/delData", obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: "成功",
            caption: "删除成功",
            icon: "ion-checkmark-circle-outline",
            color: "green",
            position: "top-right"
          });
          setTimeout(() => {
            this.params.context.getShoppingCartList();
          }, 100);
        }
      });
    }
  }
};
</script>
