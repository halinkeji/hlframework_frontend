<template>
  <q-page class="q-pa-md">
    <q-card flat class=" q-pa-md ">
      <q-form ref="dataRef">
        <hl-card-reading
          ref="memberCardReading"
          navType="horizontal"
          v-if="!dataFrom.id"
          @refreshDataList="getMemberInfo"
        ></hl-card-reading>

        <div class="row justify-around q-my-lg">
          <div class="col-12 col-md-5 ">
            <q-input
              outlined
              dense
              v-model="dataFrom.ptc_contract_number"
              label="合同编号"
              lazy-rules
              :rules="[val => !!val || '请输入编号']"
            >
              <template v-slot:after>
                <q-btn
                  unelevated
                  color="primary"
                  dense
                  class="full-height q-px-xl"
                  @click="oneKeyCoding()"
                  label="一键生成编号"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-5 ">
            <q-select
              dense
              outlined
              class="col-12 col-md-5 "
              v-model="dataFrom.ptc_pay_type"
              :options="statusData"
              label="缴纳类型"
              emit-value
              map-options
              lazy-rules
              :rules="[val => !!val || '请输入编号']"
            />
          </div>
        </div>

        <div class="row justify-around q-my-lg">
          <q-input
            class="col-12 col-md-5 "
            outlined
            dense
            v-model="dataFrom.ptc_contract_amount"
            @change="countFee"
            lazy-rules
            :rules="[
              val =>
                /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(val) || '请输入金额'
            ]"
            label="合同金额"
          />
          <q-input
            class="col-12 col-md-5 "
            outlined
            dense
            @change="countFee"
            v-model="dataFrom.ptc_pay_ratio"
            lazy-rules
            :rules="[
              val =>
                /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(val) || '请输入费率'
            ]"
            label="信息费率"
          >
            <template v-slot:append>
              %
            </template>
          </q-input>
        </div>
        <div class="row justify-around q-my-lg">
          <q-input
            class="col-12 col-md-5 "
            outlined
            dense
            v-model="dataFrom.ptc_client_phone"
            lazy-rules
            :rules="[val => /^[1][0-9][0-9]{9}$/.test(val) || '请输入手机号']"
            label="客户手机号"
          />
          <q-input
            class="col-12 col-md-5 "
            outlined
            dense
            v-model="dataFrom.ptc_client_name"
            lazy-rules
            :rules="[val => !!val || '请输入客户姓名']"
            label="客户姓名"
          />
        </div>
        <div class="row justify-around q-my-lg">
          <q-input
            class="col-12 col-md-5 "
            outlined
            dense
            v-model="dataFrom.ptc_client_company"
            lazy-rules
            :rules="[val => !!val || '请输入公司名称']"
            label="公司名称"
          />
          <q-input
            outlined
            dense
            class="col-12 col-md-5 "
            v-model="dataFrom.ptc_sales_name"
            label="销售人员姓名"
            lazy-rules
            :rules="[val => !!val || '请输入销售员姓名']"
          />
        </div>

        <div class="row">
          <div class="q-ml-xl row col-8">
            <q-input
              :rows="3"
              dense
              outlined
              label="货物信息"
              v-model="dataFrom.ptc_goods_content"
              type="textarea"
              class="q-mb-md col-12 q-ml-md"
            />

            <q-input
              :rows="2"
              dense
              outlined
              class="q-mb-md col-12 q-ml-md"
              label="备注"
              v-model="dataFrom.ptc_remarks"
              type="textarea"
            />
          </div>
          <div class="col-md-3 col-12 text-center">
            <div class="col-md-3 col-12">
              <h5 class="q-ma-sm q-ml-lg">
                信息费:{{ dataFrom.ptc_info_cost }}
              </h5>
            </div>
          </div>
        </div>
        <div class="row q-ml-xl">
          <div class="q-ml-md">
            <q-img
              v-if="dataFrom.ptc_cover_image.length <= 0"
              width="100px"
              height="100px"
            >
              <template>
                <div
                  class="absolute-full flex flex-center bg-grey-3  text-dark"
                >
                  <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                </div> </template
            ></q-img>
            <q-img
              v-for="(item, key) in dataFrom.ptc_cover_image"
              :key="key"
              :src="
                `${$q.localStorage.getItem('chainstore_system_local').attachment.cdn_url}` + item
              "
              width="130px"
              height="130px"
              v-else
            >
              <q-btn
                round
                size="md"
                color="red"
                :ripple="false"
                flat
                class="absolute-top-right"
                icon="delete_forever"
                v-if="!dataFrom.id"
                @click="delLoopImage(key)"
              ></q-btn>
              <template v-slot:error>
                <div
                  class="absolute-full flex flex-center bg-grey-3  text-dark"
                >
                  <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                </div>
              </template>
            </q-img>
            <div class="q-mt-sm">
              <p>合同图片,最多为5张</p>
            </div>
            <q-btn
              class="q-mt-sm"
              unelevated
              v-if="!dataFrom.id"
              color="primary"
              @click="clickImage()"
              label="上传合同图片"
            />
          </div>
        </div>
        <div align="right" class="q-mt-xl">
          <q-btn
            unelevated
            label="确认"
            color="primary"
            v-if="!dataFrom.id"
            :disable="dataFrom.ptc_member_id < 1 || addButtonDisabled"
            @click="setData"
          />
          <q-btn
            unelevated
            label="关闭"
            class="q-ml-sm"
            color="grey"
            :to="{ name: 'trade' }"
          />
        </div>
      </q-form>
      <upload-img
        v-if="uploadImgStatus"
        @imageData="getImageData"
        :multiple="multiple"
        @closeUpload="closeUpload"
      ></upload-img>
    </q-card>
  </q-page>
</template>
<script>
export default {
  name: 'addContract',
  data () {
    return {
      multiple: false,
      uploadImgStatus: false,
      addButtonDisabled: false,
      dataFrom: {
        id: '',
        ptc_type: 1,
        ptc_contract_amount: '',
        ptc_contract_number: '',
        ptc_cover_image: '',
        ptc_pay_type: '',
        ptc_info_cost: 0,
        ptc_pay_ratio: '',
        ptc_client_phone: '',
        ptc_client_company: '',
        ptc_sales_name: '',
        ptc_client_name: '',
        ptc_goods_content: '',
        ptc_remarks: '',
        ptc_member_id: 0
      },
      statusData: this.$store.state.tradeContract.statusData
    }
  },
  created () {
    if (this.$route.query.id > 0) {
      this.dataFrom.id = this.$route.query.id
      this.init(this.$route.query.id)
    }
  },
  mounted () {},
  computed: {},
  methods: {
    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.dataFrom = {
            id: '',
            ptc_type: 1,
            ptc_contract_amount: '',
            ptc_contract_number: '',
            ptc_cover_image: '',
            ptc_pay_type: '',
            ptc_info_cost: 0,
            ptc_pay_ratio: '',
            ptc_client_phone: '',
            ptc_client_company: '',
            ptc_sales_name: '',
            ptc_client_name: '',
            ptc_goods_content: '',
            ptc_remarks: '',
            ptc_member_id: 0
          }
          this.dataFrom.ptc_member_id = val.id
        }
      }
    },
    countFee () {
      const that = this
      this.dataFrom.ptc_info_cost = that.formatAmount(
        this.dataFrom.ptc_contract_amount * (this.dataFrom.ptc_pay_ratio * 0.01)
      )
    },
    getImageData (v) {
      this.uploadImgStatus = false
      var that = this
      if (v.lenght > 6) {
        this.$q.notify({
          message: '失败',
          caption: '图片最多选择6张',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }
      var that = this
      const ptc_cover_image = []
      if (that.multiple) {
        _(v).forEach(function (value, k) {
          if (k <= 4) {
            ptc_cover_image.push(value.path)
          }
        })
        that.dataFrom.ptc_cover_image = ptc_cover_image
      }
    },
    // 关闭
    closeUpload (v) {
      this.uploadImgStatus = false
    },
    // 上传图片弹出框展开
    clickImage () {
      this.multiple = true
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    // 删除图片
    delLoopImage (key) {
      setTimeout(() => {
        this.dataFrom.ptc_cover_image.splice(key, 1)
      }, 100)
    },
    oneKeyCoding () {
      this.dataFrom.ptc_contract_number = String(new Date().getTime())
    },
    init (id) {
      this.dataFrom.id = id
      if (id > 0) {
        this.$store.dispatch('tradeContract/getItemData', id).then(res => {
          if (res.code == 200) {
            this.dataFrom = res.data
            if (this.dataFrom.ptc_cover_image) {
              this.dataFrom.ptc_cover_image = this.dataFrom.ptc_cover_image.split(
                ','
              )
            } else {
              this.dataFrom.ptc_cover_image = []
            }
            this.dataFrom.ptc_pay_type = res.data.ptc_pay_type.toString()
          } else {
            this.$q.notify({
              message: '失败',
              caption: '查询失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
      }
    },
    setData () {
      this.$refs.dataRef.validate().then(success => {
        if (success) {
          this.addButtonDisabled = true
          const data = {
            ...this.dataFrom
          }
          this.$store.dispatch('tradeContract/setData', data).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '新增成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.$router.push({ name: 'trade' })
            } else {
              this.addButtonDisabled = false
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
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
