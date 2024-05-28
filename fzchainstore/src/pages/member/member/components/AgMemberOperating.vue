<template>
  <div>
    <q-btn
      color="primary"
      v-if="authorityMeta('edit')"
      :to="{ name: 'addMember', query: { memberId: params.data.id } }"
      >修改</q-btn
    >
    <q-btn
      @click="deleteBut"
      v-if="authorityMeta('del')"
      color="red"
      class="q-ml-sm"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: "AgMemberOperating",
  components: {},
  data() {
    return {
      memberId: ""
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    editRecord() {
      this.$router.push({
        name: "addMember",
        query: { memberId: this.params.data.id }
      });
    },
    deleteBut() {
      this.$q
        .dialog({
          title: "是否确认",
          message: `确定将会员删除至回收站吗`,
          cancel: true
        })
        .onOk(() => {
          if (parseInt(this.params.data.id) <= 0) {
            this.$q.notify({
              message: "失败",
              caption: "删除会员失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
            return false;
          }
          const obj = [{ id: this.params.data.id, mem_memberStatus: 2 }];
          this.$store
            .dispatch("member/allupdate", obj)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  message: "成功",
                  caption: "会员删除至回收站成功！",
                  icon: "ion-checkmark-circle-outline",
                  color: "green",
                  timeout: 500,
                  position: "top-right"
                });
                setTimeout(() => {
                  this.params.context.getMemberListData();
                }, 500);
              } else {
                this.$q.notify({
                  message: "失败",
                  caption: "会员删除至回收站失败，请联系管理员！",
                  icon: "ion-close-circle-outline",
                  color: "red",
                  timeout: 500,
                  position: "top-right"
                });
              }
            })
            .catch(error => {
              this.$q.notify({
                message: "失败",
                caption: "会员删除至回收站失败，请联系管理员！",
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
            });
        })
        .onCancel(() => {});
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        let new_arr = this.$route.meta.map(obj => {
          return obj.id;
        });
        if (new_arr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
