<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pa-sm text-left q-gutter-sm q-mb-xs">
        <q-btn color="grey" unelevated :to="{ name: 'erpOrder' }" label="返回" />
        <q-btn
          color="warning"
          :disable="patchOrderData.cep_status < 2 ? false : true"
          v-if="authorityMeta('hangup')"
          @click="hangupOrderData"
          unelevated
          label="挂起"
        />
        <q-btn
          color="primary"
          :disable="patchOrderData.cep_status == 1 || patchOrderData.cep_status == 5 ? false : true"
          v-if="patch_order_id"
          @click="saveOrderData"
          unelevated
          label="保存"
        />

        <q-btn
          color="primary"
          :disable="patchOrderData.cep_total_purchase_num > 0 ? false : true"
          v-if="!patch_order_id"
          @click="addOrderData"
          unelevated
          label="保存"
        />
        <q-btn
          color="primary"
          :disable="patchOrderData.cep_status == 1 ? false : true"
          v-if="authorityMeta('confirm')"
          @click="confirmOrderData"
          unelevated
          label="确认"
        />
        <q-btn
          color="positive"
          :disable="patchOrderData.cep_status == 2 ? false : true"
          v-if="authorityMeta('audit')"
          @click="auditOrderData"
          unelevated
          label="审核"
        />
        <q-btn
          color="red"
          :disable="patchOrderData.cep_status == 2 ? false : true"
          v-if="authorityMeta('cancel')"
          @click="cancelOrderConfirmData"
          unelevated
          label="取消确定"
        />
        <q-btn
          color="red"
          :disable="patchOrderData.cep_status == 1 ? false : true"
          v-if="authorityMeta('close')"
          @click="closeOrderData"
          unelevated
          label="作废"
        />
      </div>
      <div class="col-shrink bg-white q-pa-sm full-height">
        <q-scroll-area class="fit full-height">
          <q-form ref="dataFormRef" class="row q-gutter-sm ">
            <div class="col-6">
              <q-card flat bordered>
                <q-card-section>
                  <div v-if="is_main_store">
                    <q-select
                      outlined
                      option-value="id"
                      option-label="name"
                      emit-value
                      map-options
                      v-model="patchOrderData.cep_order_store_id"
                      :options="libInStoreList"
                      dense
                      @input="getStoreCredit"
                      label="订货店铺"
                      lazy-rules
                      :disable="patchOrderData.cep_order_store_id ? true : false"
                      :rules="[(val) => !!val || '请选择订货店铺']"
                    />
                  </div>

                  <q-select
                    outlined
                    option-value="id"
                    option-label="cd_name"
                    emit-value
                    map-options
                    v-model="patchOrderData.cep_depot_id"
                    :options="depotData"
                    @input="selectDepot"
                    dense
                    :disable="patchOrderData.cep_depot_id ? true : false"
                    label="请选择仓库"
                    lazy-rules
                    :rules="[(val) => !!val || '请选择仓库']"
                  />
                </q-card-section>

                <q-separator />
                <q-card-section class="q-pa-none">
                  <q-item>
                    <q-item-section>
                      <hl-select-tree
                        :list_width="400"
                        @getItem="
                          (i) => {
                            currentTypeData = i;
                          }
                        "
                        @resetValue="currentTypeData = ''"
                        :dataList="typeData"
                        textName="请选择分类"
                        :inputLabel="'gt_name'"
                        :inputValue="'id'"
                        :showValue="currentTypeData"
                        ref="typeSelectTreeRef"
                      />
                    </q-item-section>

                    <q-item-section side top v-if="patchOrderData.cep_status < 2">
                      <q-btn color="primary" label="添加品类" @click="addSpecification" unelevated />
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-separator />
                <q-card-section>
                  <div class="row q-gutter-sm" v-for="(normItem, normIndex) in linkTypeBufferData" :key="normIndex">
                    <div class="col">
                      <q-input v-model="normItem.cel_type_name" outlined bottom-slots dense label="订购品类" readonly lazy-rules disable />
                    </div>
                    <div class="col">
                      <q-input
                        v-model="normItem.cel_number"
                        outlined
                        bottom-slots
                        :disable="patchOrderData.cep_status < 2 ? false : true"
                        dense
                        label="订购数量"
                        placeholder="请输入订购数量"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '请输入订购数量']"
                        @input="getDataColumnSum"
                      >
                        <template v-if="patchOrderData.cep_status < 2" v-slot:after>
                          <q-btn @click="deleteSpecification(normIndex)" color="red" flat icon="delete" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card-section>

                <q-separator />
                <q-card-actions class="q-pa-none">
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-primary text-weight-bold">{{ patchOrderData.cep_total_purchase_num }}</q-item-label>
                      <q-item-label caption>总数量</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-actions>
              </q-card>
            </div>

            <div class="col-6 ">
              <q-input
                :disable="patchOrderData.cep_status < 2 ? false : true"
                type="textarea"
                outlined
                v-model="patchOrderData.cep_note"
                label="备注"
                dense
                :rows="2"
              />
            </div>
          </q-form>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'AddType',
  data () {
    return {
      submitDisabled: false,
      currentTypeData: {},
      patchOrderData: {
        cep_status: 1,
        cep_type: 22,
        cep_total_purchase_num: '',
        cep_note: ''
      },
      typeData: [],
      linkTypeBufferData: [],
      patch_order_id: 0,
      libInStoreList: [],
      depotData: [],
      storeCreditData: {}

    }
  },
  created () {
    this.getType()

    this.getDepotList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    } else {
      const accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')
      if (accountInfo) {
        this.patchOrderData.cep_order_store_id = accountInfo.store_id
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.patch_order_id = this.$route.query.id
      this.getItem()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    // 获取补货详情
    getItem () {
      const obj = {
        id: this.patch_order_id
      }
      this.$store
        .dispatch('erpOrder/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.patchOrderData = res.data.orderData && res.data.orderData.id ? res.data.orderData : {}
            this.linkTypeBufferData = res.data.linkTypeBufferData && res.data.linkTypeBufferData.length > 0 ? res.data.linkTypeBufferData : []

            this.$nextTick(() => {
              this.getDataColumnSum()
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
    },

    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },

    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data
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
    },

    selectDepot () {
      const that = this
      if (that.patchOrderData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.patchOrderData.cep_depot_id
        })
        that.patchOrderData.cep_depot_code = data.cd_code
        that.patchOrderData.cep_depot_name = data.cd_name
      }
    },

    getStoreCredit () {
      // const obj = {
      //   store: this.orderData.store_id
      // }
      this.$store
        .dispatch('storeCredit/getItemData', this.patchOrderData.cep_order_store_id)
        .then((res) => {
          if (res.code == 200) {
            this.storeCreditData = res.data ? res.data : []
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
    },
    getType () {
      this.$store
        .dispatch('goodstype/getTreeList')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typeData = res.data
            }
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
    },

    hangupOrderData () {
      this.saveDataOperate('挂起', 5)
    },

    saveOrderData () {
      this.saveDataOperate('保存', 1)
    },

    addOrderData () {
      this.$refs.dataFormRef.validate().then(success => {
        if (success) {
          if (!this.linkTypeBufferData && this.linkTypeBufferData.length <= 0) {
            this.$q.notify({
              message: '添加失败',
              caption: '请添加品目',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            return false
          }
          const obj = {
            ...this.patchOrderData,
            linkTypeBufferData: this.linkTypeBufferData
          }
          this.$store
            .dispatch('erpOrder/createDetailOrderData', obj)
            .then((res) => {
              if (res.code == 200 && res.data) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '创建补货单成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })

                this.$nextTick(() => {
                  this.patch_order_id = res.data.id
                  this.getItem()
                })
              } else {
                this.$q.notify({
                  message: '添加失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {})
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },

    confirmOrderData () {
      this.saveDataOperate('确认', 2)
    },

    auditOrderData () {
      this.saveDataOperate('审核', 3)
    },

    cancelOrderConfirmData () {
      this.saveDataOperate('取消确定', -2)
    },

    closeOrderData () {
      this.saveDataOperate('作废', 4)
    },

    cancelAudit () {
      this.saveDataOperate('取消审核', -3)
    },

    saveDataOperate (text, cepStatus) {
      if (this.linkTypeBufferData.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择补货品目!',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: text + '补货单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            patch_order_id: this.patch_order_id,
            ...this.patchOrderData,
            cepStatus,
            linkTypeBufferData: this.linkTypeBufferData
          }
          this.$store
            .dispatch('erpOrder/setChangePatchOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: text + '成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.getItem()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
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
        })
    },

    // 添加
    addSpecification () {
      const that = this
      const type = that.currentTypeData
      if (type) {
        const data = that.linkTypeBufferData.find(function (x) {
          return x.cel_type_id == that.currentTypeData.id
        })
        if (!data) {
          const layoutArray = that.linkTypeBufferData
          const newlayout = {
            cel_number: '',
            cel_type_id: type.id,
            cel_type_name: type.gt_name
          }
          layoutArray.push(newlayout)
          this.$refs.typeSelectTreeRef.resetValueData()
        } else {
          this.$q.notify({
            message: '失败',
            caption: '已存在此类目',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.$refs.typeSelectTreeRef.resetValueData()
        }
      }
    },
    // 删除
    deleteSpecification (mainKey) {
      this.linkTypeBufferData.splice(mainKey, 1)
      this.$nextTick(() => {
        this.getDataColumnSum()
      })
    },
    getDataColumnSum () {
      this.patchOrderData.cep_total_purchase_num = 0
      const tableData = this.linkTypeBufferData
      let inTotalNum = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.cel_number)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.cel_number)
        }
      })
      this.patchOrderData.cep_total_purchase_num = this.formatAmount(inTotalNum)
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
