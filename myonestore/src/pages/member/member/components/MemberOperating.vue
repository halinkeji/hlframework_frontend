<template>
  <div>
    <vs-row vs-type="flex" vs-justify="space-between">
      <vs-button
        type="filled"
        class="mr-2"
        icon-pack="iconfont"
        icon="icon-qiandao"
        v-if="authorityMeta('edit')"
        :to="{ name: 'addMember', query: { memberId: this.params.data.id } }"
      ></vs-button>
      <vs-button
        color="red"
        type="filled"
        icon-pack="iconfont"
        v-if="authorityMeta('del')"
        icon="icon-delete1"
        @click.stop="confirmDeleteRecord"
      ></vs-button>
    </vs-row>
  </div>
</template>
<script>
export default {
  name: "MemberOperating",
  components: {},
  data() {
    return {
      memberId: ""
    };
  },
  watch: {},
  limitedTime: "",
  computed: {},
  created() {},
  mounted() {},
  methods: {
    editRecord() {
      this.$router
        .push({ name: "addMember", query: { memberId: this.params.data.id } })
        .catch(() => {});
    },
    confirmDeleteRecord() {
      this.$q
        .dialog({
          title: "是否确认",
          message: `确定删除 ${this.params.data.mem_memberName} 至回收站?`,
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
          let payload = {
            id: parseInt(this.params.data.id),
            mem_memberStatus: 2
          };
          this.$store
            .dispatch("member/setData", payload)
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
                  this.params.context.getUserList();
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
    deleteRecord() {
      this.showDeleteSuccess();
    },
    showDeleteSuccess() {
      this.$q.notify({
        message: "成功",
        caption: "会员删除成功！",
        icon: "ion-checkmark-circle-outline",
        color: "green",
        timeout: 500,
        position: "top-right"
      });
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
