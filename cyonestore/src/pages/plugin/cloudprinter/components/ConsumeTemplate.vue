<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white ">
      <div class="fit row no-wrap  items-stretch content-stretch no-scroll ">
        <div class="col-3 ">
          <q-scroll-area class="fit full-height">
            <div class="printtop">
              <div v-for="(item, index, key) in defaultTemplateParams">
                <div v-if="item.status">
                  <div class="text-center" v-if="index == 'logo' || index == 'qrcode'">

                  </div>

                  <div class="text-center text-h6" v-else-if="index == 'title'">
                    {{ item.value }}
                  </div>
                  <div class="text-center" v-else-if="index == 'foot'">
                    {{ item.value }}
                  </div>
                  <div class="q-my-sm" v-else-if="index == 'foodsList'">
                    <div class="text-center">
                      {{ item.value }}
                    </div>
                    <div class="row q-pl-xl">
                      <div class="col">
                        名称
                      </div>
                      <div class="col">
                        售价
                      </div>
                      <div class="col">
                        数量
                      </div>
                      <div class="col">
                        小计
                      </div>
                    </div>
                    <div class="row q-pl-xl">
                      <div class="col">
                        商品名称
                      </div>
                      <div class="col">
                        99
                      </div>
                      <div class="col">
                        1
                      </div>
                      <div class="col">
                        99
                      </div>
                    </div>
                  </div>

                  <div class="q-pl-xl" v-else-if="index == 'rechargeMoneyDetail'">
                    <div>
                      充值金额 : 99
                    </div>
                    <div>
                      赠送金额 : 10
                    </div>
                    <div>
                      赠送积分 : 66
                    </div>
                  </div>

                  <div class="text-center q-my-sm" v-else-if="index == 'brcode'">
                    <q-img width="60%" src="https://cdn.halin.net/download/brcode.png"></q-img>
                  </div>
                  <div class="q-pl-xl" v-else-if="index == 'memberNumber'">
                    {{ item.label }} : {{ parseInt(item.value) == 1 ? '8888****888' : '88888888888' }}
                  </div>
                  <div class="q-pl-xl" v-else>{{ item.label }} : {{ item.value }}</div>
                </div>
              </div>
            </div>
            <div class="printfootr"></div>
          </q-scroll-area>
        </div>

        <div class="col-10 full-height">
          <q-form ref="printTemplateFormRef" class="fit">
            <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
              <q-scroll-area class="fit full-height">
                <q-card class="q-mt-sm items-center  q-pa-md" bordered flat>
                  <div class="row items-start">
                    <div class="col-3">
                      <q-input
                        outlined
                        dense
                        :rules="[(val) => (val && val > 0 && /(^[1-9]\d*$)/.test(val)) || '请输入正整数']"
                        v-model="templateForm.pct_quantity"
                        label="打印联数"
                      />
                    </div>
                    <div class="col-3 offset-1">
                      <q-select outlined dense v-model="templateForm.pct_page_width" :options="['48mm', '58mm', '76mm', '80mm', '88mm', '110mm', 'A4']" label="纸张" />
                    </div>
                  </div>
                </q-card>
                <q-card class="q-mt-sm items-center row q-pa-md" :key="key" bordered flat v-for="(item, index, key) in defaultTemplateParams">
                  <div class="col-1">
                    {{ item.label }}
                  </div>
                  <div class="col-11 row items-center">
                    <div class="col-2">
                      <q-checkbox label="状态" v-model="item.status" :true-value="1" :false-value="0" />
                    </div>
                    <div class="col-2">
                      <q-input
                        outlined
                        dense
                        :rules="[(val) => /^[0-9]*$/.test(val) || '请输入整数']"
                        @change="sortCompute(defaultTemplateParams)"
                        v-model="item.sort"
                        label="排序"
                      />
                    </div>

                    <div class="col-8 q-pl-lg">
                      <div v-if="index == 'logo' || index == 'qrcode'">
                         <!-- <hl-upload
                          :multiple="false"
                          :currentAttach="subData.coverImage"
                          @input="(val)=>{ $nextTick(()=>{ subData.bmt_cover_image = val })}"
                          currentDescription="建议尺寸比例1:1 根据打印机配置，部分打印机不支持图片显示"
                          currentTitle="logo图"
                        /> -->
                      </div>
                      <div class="row" v-if="index == 'title'">
                        <q-input outlined dense v-model="item.value" label="标题" />
                      </div>
                      <div class="row" v-if="index == 'telephone'">
                        <q-input outlined dense v-model="item.value" label="商家电话" />
                      </div>
                      <div class="row" v-if="index == 'foot'">
                        <q-input outlined dense v-model="item.value" label="自定义脚注" />
                      </div>
                      <div class="row" v-if="index == 'memberNumber'">
                        <q-checkbox label="隐藏部分卡号" v-model="item.value" :true-value="1" :false-value="0" />
                      </div>
                    </div>
                  </div>
                </q-card>
              </q-scroll-area>
            </div>
          </q-form>
        </div>
      </div>
     </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <q-btn class="q-px-xl" unelevated label="提交" @click="saveData" color="primary" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: ['templatModel'],
  components: {},
  data () {
    return {
      typeTab: '',
      templateForm: {
        pct_quantity: 1,
        pct_page_width: ''
      },
      defaultTemplateParams: {},
      currentFieldName: '',
      multiple: false,
      templateData: {
        consumeorder: {
          // logo: {
          //   label: 'logo',
          //   name: 'logo',
          //   sort: '0',
          //   status: 1,
          //   value: ''
          // },
          title: {
            label: '标题',
            name: 'title',
            sort: '1',
            status: 1,
            value: ''
          },
          cashier: {
            label: '收银员',
            name: 'cashier',
            sort: '2',
            status: 1,
            value: '张三'
          },
          billcode: {
            label: '单据号',
            name: 'billcode',
            sort: '3',
            status: 1,
            value: 'ZC11164586387010xxxxx974'
          },
          date: {
            label: '日期',
            name: 'date',
            sort: '4',
            status: 1,
            value: '2022年1月1日 20:00:00'
          },
          foodsList: {
            label: '商品列表',
            name: 'foodsList',
            sort: '5',
            status: 1,
            value: '**************商品**************'
          },
          payType: {
            label: '消费方式',
            name: 'payType',
            sort: '6',
            status: 1,
            value: '90'
          },

          handlepay: {
            label: '应收金额',
            name: 'handlepay',
            sort: '7',
            status: 1,
            value: '90'
          },
          realpay: {
            label: '实收金额',
            name: 'realpay',
            sort: '8',
            status: 1,
            value: '90'
          },
          paydetail: {
            label: '支付详情',
            name: 'paydetail',
            sort: '9',
            status: 1,
            value: '混合支付'
          },

          memberName: {
            label: '昵称',
            name: 'memberName',
            sort: '10',
            status: 1,
            value: '顾客'
          },
          memberNumber: {
            label: '会员卡号',
            name: 'memberNumber',
            sort: '11',
            status: 1,
            value: 1
          },
          memberMoneyCount: {
            label: '储值',
            name: 'memberMoneyCount',
            sort: '12',
            status: 1,
            value: 99
          },
          memberPointsCount: {
            label: '积分',
            name: 'memberPointsCount',
            sort: '13',
            status: 1,
            value: 88
          },
          memberNumberCount: {
            label: '次数',
            name: 'memberNumberCount',
            sort: '14',
            status: 1,
            value: 10
          },
          noMember: {
            label: '非会员',
            name: 'noMember',
            sort: '15',
            status: 1,
            value: '非会员'
          },

          note: {
            label: '备注',
            name: 'note',
            sort: '15',
            status: 1,
            value: '消费收银'
          },
          telephone: {
            label: '商家电话',
            name: 'telephone',
            sort: '16',
            status: 1,
            value: ''
          },
          foot: {
            label: '自定义脚注',
            name: 'foot',
            sort: '17',
            status: 1,
            value: ''
          },
          // qrcode: {
          //   label: '二维码',
          //   name: 'qrcode',
          //   sort: '18',
          //   status: 1
          // },
          brcode: {
            label: '订单条形码',
            name: 'brcode',
            sort: '19',
            status: 1
          }
        },
        quickConsume: {
          // logo: {
          //   label: 'logo',
          //   name: 'logo',
          //   sort: '0',
          //   status: 1,
          //   value: ''
          // },
          title: {
            label: '标题',
            name: 'title',
            sort: '1',
            status: 1,
            value: ''
          },
          cashier: {
            label: '收银员',
            name: 'cashier',
            sort: '2',
            status: 1,
            value: '张三'
          },
          billcode: {
            label: '单据号',
            name: 'billcode',
            sort: '3',
            status: 1,
            value: 'ZC11164586387010xxxxx974'
          },
          date: {
            label: '日期',
            name: 'date',
            sort: '4',
            status: 1,
            value: '2022年1月1日 20:00:00'
          },

          payType: {
            label: '消费方式',
            name: 'payType',
            sort: '6',
            status: 1,
            value: '90'
          },

          handlepay: {
            label: '应收金额',
            name: 'handlepay',
            sort: '7',
            status: 1,
            value: '90'
          },
          realpay: {
            label: '实收金额',
            name: 'realpay',
            sort: '8',
            status: 1,
            value: '90'
          },
          paydetail: {
            label: '支付详情',
            name: 'paydetail',
            sort: '9',
            status: 1,
            value: '混合支付'
          },

          memberName: {
            label: '昵称',
            name: 'memberName',
            sort: '10',
            status: 1,
            value: '顾客'
          },
          memberNumber: {
            label: '会员卡号',
            name: 'memberNumber',
            sort: '11',
            status: 1,
            value: 1
          },
          memberMoneyCount: {
            label: '储值',
            name: 'memberMoneyCount',
            sort: '12',
            status: 1,
            value: 99
          },
          memberPointsCount: {
            label: '积分',
            name: 'memberPointsCount',
            sort: '13',
            status: 1,
            value: 88
          },
          memberNumberCount: {
            label: '次数',
            name: 'memberNumberCount',
            sort: '14',
            status: 1,
            value: 10
          },
          noMember: {
            label: '非会员',
            name: 'noMember',
            sort: '15',
            status: 1,
            value: '非会员'
          },

          note: {
            label: '备注',
            name: 'note',
            sort: '15',
            status: 1,
            value: '消费收银'
          },
          telephone: {
            label: '商家电话',
            name: 'telephone',
            sort: '16',
            status: 1,
            value: ''
          },
          foot: {
            label: '自定义脚注',
            name: 'foot',
            sort: '17',
            status: 1,
            value: ''
          },
          // qrcode: {
          //   label: '二维码',
          //   name: 'qrcode',
          //   sort: '18',
          //   status: 1
          // },
          brcode: {
            label: '订单条形码',
            name: 'brcode',
            sort: '19',
            status: 1
          }
        },

        rechargeMoney: {
          // logo: {
          //   label: 'logo',
          //   name: 'logo',
          //   sort: '0',
          //   status: 1,
          //   value: ''
          // },
          title: {
            label: '标题',
            name: 'title',
            sort: '1',
            status: 1,
            value: ''
          },
          cashier: {
            label: '收银员',
            name: 'cashier',
            sort: '2',
            status: 1,
            value: '张三'
          },
          billcode: {
            label: '单据号',
            name: 'billcode',
            sort: '3',
            status: 1,
            value: 'ZC11164586387010xxxxx974'
          },
          date: {
            label: '日期',
            name: 'date',
            sort: '4',
            status: 1,
            value: '2022年1月1日 20:00:00'
          },
          rechargeMoneyDetail: {
            label: '充值详情',
            name: 'rechargeMoneyDetail',
            sort: '5',
            status: 1,
            value: '************充值详情************'
          },
          payType: {
            label: '消费方式',
            name: 'payType',
            sort: '6',
            status: 1,
            value: '90'
          },

          handlepay: {
            label: '应收金额',
            name: 'handlepay',
            sort: '7',
            status: 1,
            value: '90'
          },
          realpay: {
            label: '实收金额',
            name: 'realpay',
            sort: '8',
            status: 1,
            value: '90'
          },
          paydetail: {
            label: '支付详情',
            name: 'paydetail',
            sort: '9',
            status: 1,
            value: '混合支付'
          },

          memberName: {
            label: '昵称',
            name: 'memberName',
            sort: '10',
            status: 1,
            value: '顾客'
          },
          memberNumber: {
            label: '会员卡号',
            name: 'memberNumber',
            sort: '11',
            status: 1,
            value: 1
          },
          memberMoneyCount: {
            label: '储值',
            name: 'memberMoneyCount',
            sort: '12',
            status: 1,
            value: 99
          },
          memberPointsCount: {
            label: '积分',
            name: 'memberPointsCount',
            sort: '13',
            status: 1,
            value: 88
          },
          memberNumberCount: {
            label: '次数',
            name: 'memberNumberCount',
            sort: '14',
            status: 1,
            value: 10
          },
          noMember: {
            label: '非会员',
            name: 'noMember',
            sort: '15',
            status: 1,
            value: '非会员'
          },

          note: {
            label: '备注',
            name: 'note',
            sort: '15',
            status: 1,
            value: '消费收银'
          },
          telephone: {
            label: '商家电话',
            name: 'telephone',
            sort: '16',
            status: 1,
            value: ''
          },
          foot: {
            label: '自定义脚注',
            name: 'foot',
            sort: '17',
            status: 1,
            value: ''
          },
          // qrcode: {
          //   label: '二维码',
          //   name: 'qrcode',
          //   sort: '18',
          //   status: 1
          // },
          brcode: {
            label: '订单条形码',
            name: 'brcode',
            sort: '19',
            status: 1
          }
        },

        deductMoney: {
          // logo: {
          //   label: 'logo',
          //   name: 'logo',
          //   sort: '0',
          //   status: 1,
          //   value: ''
          // },
          title: {
            label: '标题',
            name: 'title',
            sort: '1',
            status: 1,
            value: ''
          },
          cashier: {
            label: '收银员',
            name: 'cashier',
            sort: '2',
            status: 1,
            value: '张三'
          },
          billcode: {
            label: '单据号',
            name: 'billcode',
            sort: '3',
            status: 1,
            value: 'ZC11164586387010xxxxx974'
          },
          date: {
            label: '日期',
            name: 'date',
            sort: '4',
            status: 1,
            value: '2022年1月1日 20:00:00'
          },
          deductMoneyData: {
            label: '扣除储值',
            name: 'deductMoneyData',
            sort: '5',
            status: 1,
            value: 10
          },
          payType: {
            label: '消费方式',
            name: 'payType',
            sort: '6',
            status: 1,
            value: '90'
          },

          handlepay: {
            label: '应收金额',
            name: 'handlepay',
            sort: '7',
            status: 1,
            value: '90'
          },
          realpay: {
            label: '实收金额',
            name: 'realpay',
            sort: '8',
            status: 1,
            value: '90'
          },
          paydetail: {
            label: '支付详情',
            name: 'paydetail',
            sort: '9',
            status: 1,
            value: '混合支付'
          },

          memberName: {
            label: '昵称',
            name: 'memberName',
            sort: '10',
            status: 1,
            value: '顾客'
          },
          memberNumber: {
            label: '会员卡号',
            name: 'memberNumber',
            sort: '11',
            status: 1,
            value: 1
          },
          memberMoneyCount: {
            label: '储值',
            name: 'memberMoneyCount',
            sort: '12',
            status: 1,
            value: 99
          },
          memberPointsCount: {
            label: '积分',
            name: 'memberPointsCount',
            sort: '13',
            status: 1,
            value: 88
          },
          memberNumberCount: {
            label: '次数',
            name: 'memberNumberCount',
            sort: '14',
            status: 1,
            value: 10
          },
          noMember: {
            label: '非会员',
            name: 'noMember',
            sort: '15',
            status: 1,
            value: '非会员'
          },

          note: {
            label: '备注',
            name: 'note',
            sort: '15',
            status: 1,
            value: '消费收银'
          },
          telephone: {
            label: '商家电话',
            name: 'telephone',
            sort: '16',
            status: 1,
            value: ''
          },
          foot: {
            label: '自定义脚注',
            name: 'foot',
            sort: '17',
            status: 1,
            value: ''
          },
          // qrcode: {
          //   label: '二维码',
          //   name: 'qrcode',
          //   sort: '18',
          //   status: 1
          // },
          brcode: {
            label: '订单条形码',
            name: 'brcode',
            sort: '19',
            status: 1
          }
        },
        deductPoint: {
          // logo: {
          //   label: 'logo',
          //   name: 'logo',
          //   sort: '0',
          //   status: 1,
          //   value: ''
          // },
          title: {
            label: '标题',
            name: 'title',
            sort: '1',
            status: 1,
            value: ''
          },
          cashier: {
            label: '收银员',
            name: 'cashier',
            sort: '2',
            status: 1,
            value: '张三'
          },
          billcode: {
            label: '单据号',
            name: 'billcode',
            sort: '3',
            status: 1,
            value: 'ZC11164586387010xxxxx974'
          },
          date: {
            label: '日期',
            name: 'date',
            sort: '4',
            status: 1,
            value: '2022年1月1日 20:00:00'
          },
          deductPointData: {
            label: '变更积分',
            name: 'deductPointData',
            sort: '5',
            status: 1,
            value: '+/-10'
          },
          payType: {
            label: '消费方式',
            name: 'payType',
            sort: '6',
            status: 1,
            value: '90'
          },

          handlepay: {
            label: '应收金额',
            name: 'handlepay',
            sort: '7',
            status: 1,
            value: '90'
          },
          realpay: {
            label: '实收金额',
            name: 'realpay',
            sort: '8',
            status: 1,
            value: '90'
          },
          paydetail: {
            label: '支付详情',
            name: 'paydetail',
            sort: '9',
            status: 1,
            value: '混合支付'
          },

          memberName: {
            label: '昵称',
            name: 'memberName',
            sort: '10',
            status: 1,
            value: '顾客'
          },
          memberNumber: {
            label: '会员卡号',
            name: 'memberNumber',
            sort: '11',
            status: 1,
            value: 1
          },
          memberMoneyCount: {
            label: '储值',
            name: 'memberMoneyCount',
            sort: '12',
            status: 1,
            value: 99
          },
          memberPointsCount: {
            label: '积分',
            name: 'memberPointsCount',
            sort: '13',
            status: 1,
            value: 88
          },
          memberNumberCount: {
            label: '次数',
            name: 'memberNumberCount',
            sort: '14',
            status: 1,
            value: 10
          },
          noMember: {
            label: '非会员',
            name: 'noMember',
            sort: '15',
            status: 1,
            value: '非会员'
          },

          note: {
            label: '备注',
            name: 'note',
            sort: '15',
            status: 1,
            value: '消费收银'
          },
          telephone: {
            label: '商家电话',
            name: 'telephone',
            sort: '16',
            status: 1,
            value: ''
          },
          foot: {
            label: '自定义脚注',
            name: 'foot',
            sort: '17',
            status: 1,
            value: ''
          },
          // qrcode: {
          //   label: '二维码',
          //   name: 'qrcode',
          //   sort: '18',
          //   status: 1
          // },
          brcode: {
            label: '订单条形码',
            name: 'brcode',
            sort: '19',
            status: 1
          }
        }
      }
    }
  },
  mounted () {
    this.getTemplatData()
  },

  computed: {},
  created () {},
  methods: {
    setTemplatModel (templatModel) {
      const templateData = this.templateData

      this.defaultTemplateParams = templateData[templatModel] ? templateData[templatModel] : {}

      this.$nextTick(() => {
        this.getTemplatData()
      })
    },
    getTemplatData () {
      const obj = {
        templatModel: this.templatModel
      }
      this.$store
        .dispatch('cloudprinter/getTemplate', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              const saveContent = res.data.pct_content ? JSON.parse(res.data.pct_content) : {}
              for (const i in this.defaultTemplateParams) {
                const data = saveContent[i] ? saveContent[i] : {}
                if (data.sort) {
                  this.defaultTemplateParams[i].sort = data.sort
                }
                if (data.sort) {
                  this.defaultTemplateParams[i].status = data.status
                }
                if (data.value) {
                  this.defaultTemplateParams[i].value = data.value
                }
              }
            }
            this.templateForm = res.data
              ? res.data
              : {
                  pct_quantity: 1,
                  pct_page_width: ''
                }
            this.sortCompute(this.defaultTemplateParams)
            // console.log(this.defaultTemplateParams.sort(this.compare('sort')))
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    sortCompute (templateParams) {
      const info = []
      for (const i in templateParams) {
        info.push({
          sort: templateParams[i].sort,
          key: i
        })
      }
      const newTemplate = info.sort(this.compare('sort'))
      this.defaultTemplateParams = {}
      if (newTemplate && newTemplate.length > 0) {
        for (let i = 0; i < newTemplate.length; i++) {
          this.defaultTemplateParams[newTemplate[i].key] = templateParams[newTemplate[i].key]
        }
      }
    },
    compare (property) {
      return function (a, b) {
        const value1 = a[property]
        const value2 = b[property]
        return value1 - value2
      }
    },

    // 提交
    saveData () {
      this.$refs.printTemplateFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.templateForm,
            pct_content: this.defaultTemplateParams,
            pct_model: this.templatModel
          }
          this.$store
            .dispatch('cloudprinter/saveTemplate', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
                  color: 'green'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },

    clearBut () {
      this.searchQuery = ''
      this.printerId = ''
      this.getList()
      this.dataListSelections = {}
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    }
  }
}
</script>
<style>
.printtop {
  width: 100%;
  min-height: 140px;
  height: auto;
  padding-top: 50px;
  background: url(https://img.yunvip123.com/CmemberFile/Image/Printtop-ico.png);
  background-position: center top;
  background-repeat: no-repeat;
  background-size: contain;
}
.printfootr {
  width: 100%;
  height: 35px;
  background: url(https://img.yunvip123.com/CmemberFile/Image/Printfootr-ico.png);
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
