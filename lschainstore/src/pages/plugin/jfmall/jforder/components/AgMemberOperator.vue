<template>
  <div>
    <!-- 快递信息 -->
    <q-dialog v-model="popUp" persistent>
      <q-card style="width: 700px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">提交快递信息</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="popUp = false" />
        </q-card-section>
        <q-form ref="courierDataRef" class="q-my-md">
          <q-select class="q-px-sm q-mt-lg" outlined dense emit-label map-options v-model="courier.jol_courier_company" :options="company" label="快递公司"> </q-select>

          <q-input outlined class="q-px-sm q-mt-lg" v-model="courier.jol_courier_number" label="快递单号" dense :rules="[(val) => !!val || '快递单号是必填的']"> </q-input>
          <q-select class="q-px-sm q-mt-xs" outlined v-model="courier.deliver_id" :options="deliverData" dense option-value="id" option-label="dm_name" label="派送员" emit-value map-options />

          <div class="row q-mt-sm q-mb-sm">
            <q-space />
            <q-btn outline unelevated color="grey-7" label="关闭" @click="popUp = false" />
            <q-btn unelevated color="blue-6" label="提交" @click="submitCourier" class="q-ml-sm q-mr-sm" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- 核销 -->
    <q-dialog v-model="code" persistent>
      <q-card style="width: 700px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">自取订单核销</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="code = false" />
        </q-card-section>
        <q-form ref="courierDataRef" class="q-my-md">
          <q-input dense outlined class="q-px-sm q-mt-lg" v-model="pickupCode" label="核销码"> </q-input>
          <div class="row q-mt-sm q-mb-sm">
            <q-space />
            <q-btn outline unelevated color="grey-7" label="关闭" @click="code = false" />
            <q-btn unelevated color="blue-6" label="提交" @click="pickup()" class="q-ml-sm q-mr-sm" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- 评价 -->
    <q-dialog v-model="evaluation" persistent>
      <q-card style="width: 700px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">订单评价详情</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="evaluation = false" />
        </q-card-section>
        <div class="bg-white q-px-sm q-pt-sm">
          <div class="row">
            <div class="col-2 q-pt-xs">物流包装</div>
            <div class="col-10 q-pl-sm">
              <q-rating v-model="evaluationData.je_package_evaluation" size="2em" :max="5" color="red" readonly />
            </div>
          </div>
          <div class="row q-py-sm">
            <div class="col-2 q-pt-xs">物流速度</div>
            <div class="col-10 q-pl-sm">
              <q-rating v-model="evaluationData.je_speed_evaluation" :max="5" size="2em" color="red" readonly />
            </div>
          </div>
          <div class="row q-pb-sm" style="border-bottom: 1px solid #f2f2f2">
            <div class="col-2 q-pt-xs">客服服务</div>
            <div class="col-10 q-pl-sm">
              <q-rating v-model="evaluationData.je_steward_evaluation" :max="5" size="2em" color="red" readonly />
            </div>
          </div>
        </div>
        <div class="q-px-sm q-pt-sm">评价：{{ evaluationData.je_overall_evaluation }}</div>
        <div class="q-px-sm q-pt-sm" v-if="evaluationData.je_loop_image">
          商品图片：
          <div class="row">
            <div v-for="item in evaluationData.je_loop_image" class="col-4 text-center q-my-sm">
              <q-img :src="item" width="100px" height="100px" />
            </div>
          </div>
        </div>
        <div class="row q-mt-sm q-mb-sm">
          <q-space />
          <q-btn outline unelevated color="grey-7 q-mr-sm" label="关闭" @click="evaluation = false" />
        </div>
      </q-card>
    </q-dialog>
    <q-btn v-if="params.data.jo_state == 2" @click="params.context.updateState(params.data.id, 3)" unelevated  color="primary" class="q-mr-md">
      确认订单
    </q-btn>
    <q-btn v-if="params.data.jo_state == 3 && params.data.jo_type == 1" @click="addCourier" unelevated  color="primary" class="q-mr-md">商品出库 </q-btn>
    <q-btn v-if="params.data.jo_state == 3 && params.data.jo_type == 2" @click="params.context.updateState(params.data.id, 4)" unelevated  color="primary" class="q-mr-md">商品打包 </q-btn>
    <q-btn v-if="params.data.jo_state == 6" unelevated color="info"  class="q-mr-md" @click="seeEvaluation()">查看评价 </q-btn>
    <q-btn v-if="params.data.jo_state == 4 && params.data.jo_type == 2" @click="code = true" unelevated  color="negative" class="q-mr-md">自取核销 </q-btn>
    <q-btn v-if="params.data.jo_state < 3 && params.data.jo_state != -1" unelevated color="red" label="取消订单"  @click="params.context.updateState(params.data.id, 7)" class="q-mr-md" />
    <q-btn unelevated color="amber-6"  @click="$router.push({ name: 'jfOrderDetail', query: { id: params.data.id } })">查看详情 </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      evaluationData: {},
      evaluation: false,
      code: false,
      popUp: false,
      pickupCode: '',
      company: [
        {
          value: 1,
          label: '圆通速递'
        },
        {
          value: 2,
          label: '韵达速递'
        },
        {
          value: 3,
          label: '顺丰速递'
        },
        {
          value: 4,
          label: '中通速递'
        },
        {
          value: 5,
          label: '申通速递'
        },
        {
          value: 6,
          label: 'EMS'
        },
        {
          value: 7,
          label: '百世快递'
        },
        {
          value: 8,
          label: '天天快递'
        },
        {
          value: 9,
          label: '全峰快递'
        },
        {
          value: 10,
          label: '宅急送'
        },
        {
          value: 11,
          label: '京东快递'
        }
      ],
      courier: {
        jol_courier_company: '',
        jol_courier_number: ''
      },
      deliverData: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    addCourier () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '是否要进行出库',
          cancel: true
        })
        .onOk(() => {
          this.getDeliverData()
          this.courier.jol_courier_number = ''
          this.courier.jol_courier_company = ''
          this.popUp = true
        })
    },
    submitCourier () {
      if (this.courier.jol_courier_number.length == 0 || this.courier.jol_courier_company.length == 0) {
        this.$q.notify({
          message: '注意',
          caption: '请填写完整物流信息',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.$q
        .dialog({
          title: '是否确认',
          message: '确认提交物流信息',
          cancel: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id,
            state: 4,
            jol_courier_number: this.courier.jol_courier_number,
            jol_courier_company: this.courier.jol_courier_company.label,
            deliver_id: this.courier.deliver_id
          }
          this.$store
            .dispatch('jforder/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '订单出库成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getOrder()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: '请联系管理员',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
    },
    getDeliverData () {
      this.$store
        .dispatch('delivery/getDelivery')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deliverData = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: '请联系管理员',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    pickup () {
      if (this.pickupCode == this.params.data.jo_pickup_code) {
        this.params.context.updateState(this.params.data.id, 5)
        this.code = false
      } else {
        this.$q.notify({
          message: '失败',
          caption: '请输入正确的核销码',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
    },
    seeEvaluation () {
      this.$store
        .dispatch('evaluation/getItem', this.params.data.id)
        .then((res) => {
          if (res.code == 200) {
            this.evaluationData = res.data ? res.data : {}
            if (res.data.je_loop_image) {
              this.evaluationData.je_loop_image = res.data.je_loop_image.split(',')
            }
            this.evaluation = true
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: '操作失败',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>

<style></style>
