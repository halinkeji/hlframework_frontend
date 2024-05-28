<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        积分操作
      </div>
      <div class="col-shrink bg-white  full-height bg-grey-2  q-pt-xs ">
        <div class="row fit bg-white justify-around">
          <div class="col-12  col-md-4 q-px-xs q-pt-md">
            <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
          </div>
          <q-separator vertical inset />
          <q-form ref="submitFormRef" class="col-12  col-md-4  q-px-xs  q-pt-md">
            <q-card flat class="q-pa-md">
              <q-input
                outlined
                bottom-slots
                v-model="pointInput"
                lazy-rules
                class="text-h6"
                :rules="[(val) => !!val || '请填写数字', (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的数字']"
              >
                <template v-slot:prepend>
                  <div class="q-pl-none text-subtitle1">
                    增加/扣除
                  </div>
                </template>
              </q-input>

              <div class="q-pl-none text-subtitle1 text-right q-pb-sm">
                <q-checkbox dense class="q-mt-sm" v-model="printInvoiceStatus" label="打印小票" color="blue-8" />
              </div>
              <q-separator />
              <q-card-section class="q-py-sm" v-if="fixedMoneyList.length > 0">
                <div class="row">
                  <div class="col-6 col-md-3 q-mt-md q-px-xs" v-for="item in fixedMoneyList">
                    <q-btn unelevated rounded color="green" class="q-px-md full-width" :disable="memberId == 0" @click="pointInput = item.fm_parameter">
                      {{ item.fm_parameter }}
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>
      </div>

      <div class="col-shrink bg-white q-pb-md q-gutter-md text-center  q-mt-xs">
        <q-btn unelevated color="blue-6" class="q-px-xl" size="lg" label="增加" icon="las la-plus-circle" :disable="buttonDisabled" @click="pointChangeBut(1)" />
        <q-btn unelevated color="blue-6" class="q-px-xl" size="lg" label="扣除" icon="las la-minus-circle" :disable="buttonDisabled" @click="pointChangeBut(2)" />
        <q-btn unelevated color="red-5" class="q-px-xl" size="lg" label="清除" icon="las la-trash-alt" @click="pointInput = ''" :disable="pointInput == ''" />
        <q-btn unelevated color="amber-8" class="q-px-xl" size="lg" label="重置" @click="refreshBut()" icon="ion-refresh" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'deductPointIndex',
  components: {},
  data () {
    return {
      printInvoiceStatus: true,
      pointInput: '',
      buttonDisabled: false,
      memberId: 0,
      fixedMoneyList: []
    }
  },
  watch: {},
  mounted () {
    this.getFixedmoneyList()
  },
  created () {},
  computed: {},
  methods: {
    // 获取固定金额
    getFixedmoneyList () {
      const obj = {
        type: 1,
        page: 1,
        pSize: 200
      }
      this.$store
        .dispatch('fixed/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.fixedMoneyList = res.data.list
            } else {
              this.fixedMoneyList = []
            }
          }
        })
        .catch((error) => {})
    },
    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
        }
      }
    },
    // 1增加积分 /2扣除积分
    pointChangeBut (val) {
      this.$refs.submitFormRef.validate().then((success) => {
        if (success) {
          this.buttonDisabled = true
          const obj = {
            type: val,
            member_id: this.memberId,
            printInvoiceStatus: this.printInvoiceStatus,
            pointInput: this.pointInput
          }
          this.$store
            .dispatch('deductPoint/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: val == 1 ? '增加成功' : '扣除成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right'
                })
                this.buttonDisabled = false
                this.refreshBut()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: val == 1 ? '增加失败' : '扣除失败',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  position: 'top-right'
                })
                this.buttonDisabled = false
              }
            })
            .catch((error) => {
              this.buttonDisabled = false
            })
        }
      })
    },

    // 重置
    refreshBut () {
      this.pointInput = ''

      this.memberId = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
    },
    // 清除
    clearBut () {
      this.pointInput = ''
    }
  }
}
</script>

<style lang="scss"></style>
