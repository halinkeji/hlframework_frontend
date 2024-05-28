<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <q-form ref="printerDataRef">
              <!-- <div class="row">
                <div class="col-9">
                  <q-banner inline-actions class="text-white bg-red">
                    提示：保存模版时，请把打印模板中的 参数换成左侧的变量。 例：
                    TEXT5,93,\"TSS24.BF2\",0,1,1,\"价格:￥999\[A]\"\n 中 999 换成 ${price}
                  </q-banner>
                </div>
              </div> -->
              <div class="row">
                <div class="col-2">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal>
                      <q-card-section class="q-pt-xs row">
                        <div class="text-subtitle2 q-mt-sm q-mb-xs col-12">标签用途：商品标签</div>
                        <div class="text-subtitle2 q-mt-sm q-mb-xs col-12">
                          <q-select
                            outlined
                            label="打印机类型"
                            v-model="lableTemplate.ccl_printer_modle"
                            :options="[
                              { label: '40*30', value: '1' },
                              { label: '30*70', value: '2' },
                            ]"
                            dense
                            emit-value
                            map-options
                          >
                            <template v-slot:before>
                              <span class="text-body2 text-black"> 标签纸尺寸： </span>
                            </template>
                          </q-select>
                        </div>
                        <div class="text-subtitle2 q-mt-sm q-mb-xs col-12">
                          <q-input outlined dense v-model="lableTemplate.ccl_printer_number">
                            <template v-slot:before>
                              <span class="text-body2 text-black"> 标签打印联数: </span>
                            </template></q-input
                          >
                        </div>
                        <div class="text-subtitle2 q-mt-sm q-mb-xs col-12">
                          <q-input outlined dense v-model="lableTemplate.ccl_lable_interval">
                            <template v-slot:before>
                              <span class="text-body2 text-black"> 标签间隙： </span>
                            </template></q-input
                          >
                        </div>
                      </q-card-section>
                    </q-card-section>
                    <q-separator />
                    <q-card-section horizontal>
                      <q-card-section class="q-pt-xs">
                        <div class="text-h6">标签内容</div>
                        <div class="text-subtitle2 q-mt-sm q-mb-xs" v-for="(item, key) in lableData" :key="key" @click="addMainMenu(key)">
                          {{ item.name }}{{ item.value }}
                        </div>
                      </q-card-section>
                    </q-card-section>

                    <q-separator />
                  </q-card>
                </div>
                <div class="col-4 q-pl-sm">
                  <q-card class="my-card" flat bordered>
                    <q-card-section class="q-pt-xs">
                      <div class="text-h6">标签模板</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section horizontal v-if="templateContent.length > 0">
                      <q-card-section>
                        <div class="text-subtitle2 q-mt-sm q-mb-xs" v-for="(item, key) in templateContent" :key="key">
                          <q-btn
                            outline
                            :class="normIndex == key ? 'noChange' : 'change active'"
                            :label="item.name + item.value"
                            @click="changeTemplate(key)"
                            class="full-width"
                          />
                        </div>
                      </q-card-section>

                      <q-separator vertical />
                      <q-card-section>
                        <!-- {{ sumContent.style }} -->
                        <div v-for="(item, keys) in sumContent.style" :key="keys">
                          <q-input outlined class="q-pb-sm" v-model="item.value" :label="item.lable" />
                        </div>

                        <div v-for="(i, keyc) in sumContent.css" :key="keyc">
                          <q-input outlined class="q-pb-sm" v-model="i.value" :label="i.lable" />
                        </div>

                        <q-btn label="删除" unelevated @click="deleteContent()" color="red" class="q-px-xl" v-if="sumContent" />
                      </q-card-section>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-4 q-pl-sm">
                  <q-card class="my-card" flat bordered>
                    <q-card-section class="q-pt-xs">
                      <div class="text-h6">标签样式</div>
                    </q-card-section>
                    <q-separator />

                    <!-- style="margin-bottom: 60px; padding-left: 43px" -->
                    <!-- {{ sysemData }} -->
                    <q-card
                      flat
                      bordered
                      :style="lableTemplate.ccl_printer_modle == 2 ? 'height: 245px; width: 125px;' : 'height: 120px; width: 160px;'"
                      style="margin: 0 auto"
                      class="my-card bg-grey-1 q-my-md"
                    >
                      <div v-for="(bit, btnKey) in sysemData" :key="btnKey">
                        <div :style="bit.style">{{ bit.name }}{{ bit.value }}</div>
                      </div>
                    </q-card>
                  </q-card>
                </div>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-md q-mt-xs text-center q-gutter-md">
          <q-btn label="提交" unelevated @click="saveData()" color="primary" class="q-px-xl" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'index',
  components: {},
  data() {
    return {
      lableData: [],
      sumContent: [],
      templateContent: [],
      normIndex: -1,
      lableTemplate: {
        ccl_content: [],
        ccl_name: '商品标签模板',
        ccl_printer_modle: '',
        ccl_model: 'label',
        ccl_printer_number: '',
        ccl_lable_interval: '',
      },
    };
  },
  mounted() {
    this.getItem();
    this.getLableTemple();
  },
 watch: {},
  computed: {
    sysemData() {
      var eachOptionData = this.templateContent;
      var print = [];
      if (eachOptionData) {
        eachOptionData.forEach((x) => {
          var sty = '';
          x.css.forEach((value) => {
            sty = sty + value.key + ':' + value.value + ';';
          });
          x.style.forEach((i) => {
            sty = sty + i.key + ':' + i.value + ';';
          });
          console.log('sty', sty);
          const data = {
            type: x.type,
            lable: x.lable,
            name: x.name,
            value: x.value,
            style: sty,
          };
          print.push(data);
        });
        return print;
      }
    },
  },
  created() {},
  methods: {
    getLableTemple() {
      this.$store.dispatch('cloudprinter/getLableTemple').then((res) => {
        if (res.code == 200) {
          this.lableData = res.data;
        }
      });
    },
    addMainMenu(key) {
      const newlayout = this.lableData[key];
      const menuArray = this.templateContent;
      if (menuArray) {
        const data = menuArray.findIndex(function(x) {
          return x.lable == newlayout.lable;
        });
        if (data <= -1) {
          menuArray.push(newlayout);
          this.sumContent = newlayout;
        }
      } else {
        this.lableTemplate.ccl_content.push(newlayout);
        this.sumContent = newlayout;
      }
    },
    changeTemplate(key) {
      var newlayout = this.templateContent[key];
      this.normIndex = key;
      this.sumContent = newlayout;
    },
    deleteContent() {
      setTimeout(() => {
        this.templateContent.splice(this.normIndex, 1);
      }, 100);
      this.sumContent = [];
    },
    getItem() {
      this.$store.dispatch('cloudprinter/getLableItem').then((res) => {
        if (res.code == 200 && res.data) {
          this.lableTemplate = res.data;
          this.templateContent = JSON.parse(res.data.ccl_content);
          this.sumContent = this.templateContent[0];
          this.normIndex = 0;
        }
      });
    },
    saveData() {
      this.$refs.printerDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            templateContent: this.templateContent,
            ...this.lableTemplate,
          };
          this.$store
            .dispatch('cloudprinter/setLableData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.$route.query.id > 0 ? '修改' : '新增'}` + '标签模板成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green',
                });

                this.getItem();
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red',
              });
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.change {
  border-right: 1px solid #e6e3e3;
  color: #979393;
  cursor: pointer;
}
.noChange {
  border: 1px solid rgb(48, 164, 218);
  color: rgb(48, 164, 218);
  cursor: pointer;
}
.active:hover {
  color: rgb(27, 26, 26);
  cursor: pointer;
}
.link:hover {
  color: #3296fa;
  cursor: pointer;
}
.foot-border {
  border-top: 1px solid #e6e3e3;
}
</style>
