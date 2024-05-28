<template>
  <q-dialog ref="kzlsItemRef" @hide="hideNowPage" v-model="showDialog">
    <q-card style="width: 768px; max-width: 90vw" class="q-pa-md">
      <q-form ref="kzlsItemRef">
        <q-card-section class="row q-pa-none">
          <span style="font-size: 18px">{{
            itemData.id > 0 ? "修改开支项" : "新增开支项"
          }}</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="q-mt-lg row items-center">
          <div class="col-2 ">
            <span class="row justify-end">选择类型</span>
          </div>
          <div class="q-pl-md col-3">
            <q-btn-toggle
              v-model="itemData.pki_status"
              spread
              class="my-custom-toggle"
              no-caps
              unelevated
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="[
                { label: '开支', value: '1' },
                { label: '收入', value: '2' }
              ]"
            />
          </div>
        </div>
        <div class="q-mt-lg row ">
          <div class="col-2 q-mt-md">
            <span class="row justify-end">开支项名称</span>
          </div>
          <div class="q-pl-md col-10">
            <q-input
              square
              class=" q-pr-sm q-mt-xs"
              outlined
              dense
              v-model="itemData.pki_name"
              placeholder="请输入开支项名称"
              lazy-rules
              :rules="[val => (val && val.length > 0) || '请填写开支项名称']"
            />
          </div>
        </div>
        <div align="right" class="q-mt-lg">
          <q-btn
            unelevated
            label="确认"
            :disable="addButtonDisabled"
            color="primary"
            @click="setData"
          />
          <q-btn
            unelevated
            label="关闭"
            class="q-ml-sm"
            color="grey"
            v-close-popup
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: "AddKzlsItem",
  data() {
    return {
      showDialog: true,
      addButtonDisabled: false,
      itemData: {
        pki_name: "",
        pki_status: "1",
        pki_type: "1"
      }
    };
  },
  created() {},
  methods: {
    //查询开支项单条
    init(id) {
      this.showDialog = true;
      if (id > 0) {
        this.$store
          .dispatch("kzls/getItemData", id)
          .then(res => {
            if (res.code == 200) {
              this.itemData = res.data ? res.data : {};
              this.itemData.pki_status = res.data.pki_status.toString(); //转字符串
            } else {
              this.$q.notify({
                message: "失败",
                icon: "ion-close-circle-outline",
                timeout: 500,
                position: "top-right",
                caption: "操作失败",
                color: "red"
              });
            }
          })
          .catch(error => {
            this.$q.notify({
              message: "失败",
              icon: "ion-close-circle-outline",
              timeout: 500,
              position: "top-right",
              caption: "系统错误",
              color: "red"
            });
          });
      }
    },
    //新增或修改开支项
    setData() {
      this.$refs.kzlsItemRef.validate().then(success => {
        if (success) {
          this.addButtonDisabled = true;
          this.showDialog = false;
          let data = {
            ...this.itemData
          };
          this.$store
            .dispatch("kzls/setData", data)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  message: "成功",
                  caption:
                    `${this.itemData.id > 0 ? "修改" : "新增"}` + "开支项成功",
                  icon: "ion-checkmark-circle-outline",
                  timeout: 500,
                  position: "top-right",
                  color: "green"
                });
              } else {
                this.$q.notify({
                  message: "失败",
                  caption: error.message,
                  color: "red",
                  icon: "ion-close-circle-outline",
                  timeout: 500,
                  position: "top-right"
                });
              }
            })
            .catch(error => {
              this.$q.notify({
                message: "失败",
                icon: "ion-close-circle-outline",
                timeout: 500,
                position: "top-right",
                caption: "系统错误",
                color: "red"
              });
            });
        }
      });
    },
    //关闭弹窗执行
    hideNowPage() {
      this.itemData.pki_status = "1";
      this.itemData.pki_name = "";
      this.itemData.id = "";
      this.$emit("dataList");
      this.addButtonDisabled = false;
    }
  }
};
</script>
<style>
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
