<template>
  <q-dialog v-model="labelDialog" full-width full-height>
    <q-card class="fit">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">绩效标签</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="col-shrink q-pa-sm full-height bg-white ">
          <q-scroll-area class="fit full-height">
            <div class="q-pa-sm" v-for="(item, key) in labelList">

              <div class="q-mb-sm">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                <span v-if="consumType == 'consume'">
                  {{ item.chud_goo_name }}
                  <span class="text-red">x<span class="text-h6 ">{{ item.chud_consumeNumber }}</span></span>
                </span>
                <span v-if="consumType == 'addCount'">
                  {{ item.mrc_goodsName }}
                  <span class="text-red">x<span class="text-h6 ">{{ item.mrc_count }}</span></span>
                </span>
                <span v-if="consumType == 'addGroupCount'">
                  {{ item.mrc_goodsName }}
                  <span class="text-red">x<span class="text-h6 ">{{ item.mrc_count }}</span></span>
                </span>
                <span v-if="consumType == 'deductCount'">
                  {{ item.mrc_goodsName }}
                  <span class="text-red">x <span class="text-h6 "> {{ item.mrc_deductcount }}</span></span>
                </span>
                <span v-if="consumType == 'checkDeductCount'">
                  {{ item.mrc_goodsName }}
                  <span class="text-red">x <span class="text-h6 "> {{ item.mrc_deductcount }}</span></span>
                </span>

                <span v-if="consumType == 'addDuration'">
                  {{ item.rtb_goods_name }}
                  <span class="text-red">x <span class="text-h6 "> {{ item.compute_count }}</span></span>
                </span>

                <span v-if="consumType == 'addGroupDuration'">
                  {{ item.tgd_goods_name }}
                  <span class="text-red">x <span class="text-h6 "> {{ item.compute_count }}</span></span>
                </span>

                <span v-if="consumType == 'deductDuration'">
                  {{ item.mtr_goods_name }}
                  <span class="text-red">x <span class="text-h6 "> {{ item.compute_count }}</span></span>
                </span>
              </div>
              <div class="row full-width q-col-gutter-sm">
                <div class="col-2" v-for="(i, k) in item.goodsLabelList">
                <q-card flat bordered >
                  <q-card-section class="q-py-sm text-center">
                    <div class="text-subtitle1">{{ i.prl_label_name }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-pt-none">
                    <q-scroll-area
                      :style="{
                        height: $q.screen.height * 0.2 + 'px',
                        'max-height': $q.screen.height * 0.2 + 'px',
                      }"
                    >
                      <div class="row  q-mt-sm" v-for="(items, index) in i.labelList">
                        <div class="col-5">
                          {{ items.user ? items.user.pru_name : '操作员' }}
                        </div>
                        <div class="col-7" align="right">
                          <q-btn
                            unelevated
                            size="sm"
                            :disable="items.count <= 0"
                            @click="limitTotalCount(key, k, index, 2)"
                            round
                            text-color="dark"
                            color="grey-2"
                            icon="remove"
                          />
                          <span class="q-mx-md">
                            {{ items.count }}
                          </span>
                          <q-btn unelevated size="sm" color="primary" round @click="limitTotalCount(key, k, index, 1)" class="q-mr-sm" icon="add" />
                        </div>
                      </div>
                    </q-scroll-area>
                  </q-card-section>
                </q-card>
              </div>
              </div>
            </div>
          </q-scroll-area>
        </div>

        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
          <q-btn color="red" unelevated class="q-px-xl" @click="getLabelData">跳过</q-btn>
          <q-btn color="primary" unelevated class="q-px-xl" @click="getLabelData">确定</q-btn>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'SelectLabel',
  components: {},
  data () {
    return {
      labelList: [],
      shoppingCartsLit: [],
      labelDialog: false,
      consumType: ''
    }
  },
  created: {},
  mounted () {},
  methods: {
    openStaffLabel (val, consumType) {
      this.shoppingCartsLit = val
      this.consumType = consumType
      setTimeout(() => {
        this.getLabelList()
      }, 50)
    },
    getLabelList () {
      const obj = {
        shoppingCartsLit: this.shoppingCartsLit,
        consumType: this.consumType
      }
      this.$store
        .dispatch('rewardLabel/getGoodsConsume', obj)
        .then((res) => {
          if (res.code == 200) {
            this.labelList = res.data && res.data.length > 0 ? res.data : []
            if (this.labelList.length < 1) {
              this.getLabelData()
            } else {
              this.labelDialog = true
            }
          }
        })
        .catch((error) => {})
    },
    getLabelData () {
      this.labelDialog = false
      this.$emit('getRewardLabel', this.labelList)
    },

    limitTotalCount (index, i, k, type) {
      let count = 0
      if (type == 1) {
        this.labelList[index].goodsLabelList[i].labelList[k].count = parseInt(this.labelList[index].goodsLabelList[i].labelList[k].count + 1)
      } else {
        this.labelList[index].goodsLabelList[i].labelList[k].count = parseInt(this.labelList[index].goodsLabelList[i].labelList[k].count - 1)
      }
      if (this.labelList[index].goodsLabelList) {
        if (this.labelList[index].goodsLabelList[i].labelList) {
          if (this.labelList[index].goodsLabelList[i].labelList) {
            this.labelList[index].goodsLabelList[i].labelList.forEach((val) => {
              if (val.count) {
                count += val.count
              }
            })
          }
        }
        let consumeNumber = ''
        switch (this.consumType) {
          case 'consume':
            consumeNumber = parseInt(this.labelList[index].chud_consumeNumber)
            break
          case 'addCount':
            consumeNumber = parseInt(this.labelList[index].mrc_count)
            break
          case 'addGroupCount':
            consumeNumber = parseInt(this.labelList[index].mrc_count)
            break
          case 'deductCount':
            consumeNumber = parseInt(this.labelList[index].mrc_deductcount)
            break
          case 'checkDeductCount':
            consumeNumber = parseInt(this.labelList[index].mrc_deductcount)
            break
          case 'addDuration':
            consumeNumber = parseInt(this.labelList[index].compute_count)
            break
          case 'addGroupDuration':
            consumeNumber = parseInt(this.labelList[index].compute_count)
            break
          case 'deductDuration':
            consumeNumber = parseInt(this.labelList[index].compute_count)
            break
        }
        if (parseInt(count) > 0 && parseInt(count) > consumeNumber) {
          this.$nextTick(() => {
            this.labelList[index].goodsLabelList[i].labelList[k].count = 0
          })
          this.$q.notify({
            message: '超出购买数量',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top'
          })
        }
      }
    }
  }
}
</script>
