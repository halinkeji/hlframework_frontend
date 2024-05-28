<template>
  <q-dialog @hide="hideDetailDialog" v-model="detailDialogStatus">
    <q-card
      flat
      :style="{
        width: $q.screen.width * 0.5 + 'px',
        'min-width': $q.screen.width * 0.5 + 'px',
         height: $q.screen.height * 0.5 + 'px',
        'min-height': $q.screen.height * 0.5 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="row col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs q-pa-sm">
          <div class="text-subtitle2">核销订单</div>
          <q-space />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-form ref="orderFormRef">
            <q-input outlined v-model="jo_pickup_code" @keyup.enter="getItem"  label="自堤单号">
              <template v-slot:after>
                <q-btn color="deep-orange" size="lg" @click="getItem" label="查询" />
              </template>
            </q-input>

            <div v-if="orderData.orderDetail && orderData.orderDetail.length > 0">
              <q-table
                row-key="id"
                hide-bottom
                flat
                bordered
                class="q-mt-sm"
                title-classs="bg-brown"
                separator="cell"
                title="商品详情"
                title-class="text-subtitle2"
                :data="orderData.orderDetail"
                :columns="goodsColumns"
                :pagination="{
                  rowsPerPage: 0,
                }"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="coverImage" :props="props">
                      <q-avatar square>
                        <img
                          :src="
                            props.row.coverImage && props.row.coverImage.id
                              ? $q.localStorage.getItem('cychainstore_system_local').attach_url + props.row.coverImage.path
                              : ''
                          "
                          alt=""
                        />
                      </q-avatar>
                    </q-td>
                    <q-td key="goods_name" :props="props">
                      {{ props.row.goods_name }}
                      <span v-if="props.row.spe_id > 0">{{ props.row.goods_specification }}</span>
                    </q-td>
                    <q-td key="goods_selling_point" :props="props">
                      {{ props.row.goods_selling_point }}
                    </q-td>
                    <q-td key="goods_selling_saving" :props="props">
                      {{ props.row.goods_selling_saving }}
                    </q-td>
                    <q-td key="goods_number" :props="props">
                      {{ props.row.goods_number }}
                    </q-td>
                    <q-td key="goods_shipping" :props="props">
                      {{ props.row.goods_shipping }}
                    </q-td>

                    <q-td key="goods_member_price" :props="props">
                      {{ props.row.goods_member_price }}
                    </q-td>
                    <q-td key="goods_selling_price" :props="props">
                      {{ props.row.goods_selling_price }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-mt-xs q-py-sm q-pb-md text-center q-gutter-sm">
          <q-btn class="q-px-xl" unelevated label="核销" @click="updateState" color="primary" />
          <q-btn class="q-px-xl" unelevated label="关闭" @click="hideDetailDialog" color="grey" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DeliverGoods',
  data () {
    return {
      orderData: {},
      deliceryman: {},
      step: 0,
      orderStatusObject: {},
      detailDialogStatus: false,
      jo_pickup_code: '',
      goodsColumns: [
        {
          name: 'coverImage',
          label: '封面图',
          field: 'coverImage',
          align: 'center'
        },
        {
          name: 'goods_name',
          label: '名称',
          field: 'goods_name',
          align: 'center'
        },
        {
          name: 'goods_selling_point',
          label: '积分',
          field: 'goods_selling_point',
          align: 'center'
        },
        {
          name: 'goods_selling_saving',
          label: '储值',
          field: 'goods_selling_saving',
          align: 'center'
        },
        {
          name: 'goods_number',
          label: '数量',
          field: 'goods_number',
          align: 'center'
        },

        {
          name: 'goods_shipping',
          label: '运费',
          field: 'goods_shipping',
          align: 'center'
        },
        {
          name: 'goods_member_price',
          label: '会员价',
          field: 'goods_member_price',
          align: 'center'
        },
        {
          name: 'goods_selling_price',
          label: '售价',
          field: 'goods_selling_price',
          align: 'center'
        }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    hideDetailDialog () {
      this.detailDialogStatus = false
      this.$emit('operateSuccess')
    },
    init () {
      this.detailDialogStatus = true
    },
    getItem () {
      this.$store
        .dispatch('jfOrder/checkOrderDetail', {
          jo_pickup_code: this.jo_pickup_code
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.orderData = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: '未找到当前核销码或当前订单已被核销',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    updateState () {
      this.$refs.orderFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            order_id: this.orderData.id
          }
          this.$store
            .dispatch('jfOrder/setGetOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '核销成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })

                this.hideDetailDialog()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
