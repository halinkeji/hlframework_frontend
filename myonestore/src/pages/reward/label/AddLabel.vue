<template>
  <q-dialog v-model="dialogStatus">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-md q-py-xs">
          <div class="text-subtitle1">{{ currentlabelId ? '修改' : '新增' }}标签</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white ">
          <q-scroll-area class="fit full-height">
            <q-form ref="labelDataRef">
              <div class="q-mt-sm">
                <q-input
                  dense
                  outlined
                  stack-label
                  v-model="dataFrom.prl_label_name"
                  label="标签名称"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '请填写名称']"
                />
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-md-6 col-12">
                  <q-select
                    dense
                    outlined
                    stack-label
                    v-model="dataFrom.prl_mode"
                    :options="[
                      { label: '固定金额', value: '1' },
                      { label: '抽成比例', value: '2' },
                    ]"
                    @input="
                      dataFrom.prl_label_price = '';
                      dataFrom.prl_label_proportion = '';
                    "
                    label="绩效方式"
                    emit-value
                    map-options
                    lazy-rules
                    :rules="[(val) => !!val || '请选择绩效方式']"
                  />
                </div>
                <div v-if="dataFrom.prl_mode == '1'" class="col-md-6 col-12">
                  <q-input
                    outlined
                    dense
                    stack-label
                    v-model="dataFrom.prl_label_price"
                    label="固定金额"
                    lazy-rules
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入固定金额']"
                  >
                    <template v-slot:append>
                      <span class="text-dark text-body2">
                        {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span
                      >
                    </template>
                  </q-input>
                </div>
                <div v-if="dataFrom.prl_mode == '2'" class="col-md-6 col-12">
                  <q-input
                    outlined
                    dense
                    stack-label
                    class="q-pa-none q-mx-lg q-mb-lg"
                    v-model="dataFrom.prl_label_proportion"
                    label="抽成比例"
                    lazy-rules
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入抽成比例']"
                  >
                    <template v-slot:append>
                      <span class="text-dark text-body2">%</span>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-form>

            <q-card flat bordered class="my-card">
              <q-card-section class="q-pa-sm q-gutter-sm row items-center">
                <div class="text-subtitle2">
                  选择绑定员工
                </div>
                <q-space />
                <q-btn label="选择员工" unelevated @click="selectUser" color="primary"  />
                <q-btn label="一键清空" unelevated @click="cleanBindUser" color="red"  />
              </q-card-section>

              <q-table
                title-class="text-subtitle2"
                flat
                bordered
                :pagination="{
                  rowsPerPage: 0,
                }"
                :data="rewardBindUser"
                :columns="countColumnDefs"
                row-key="field"
                hide-bottom
                separator="cell"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="pru_name" class="text-center" :props="props">
                      {{ props.row.user && props.row.user.pru_name ? props.row.user.pru_name : '' }}
                    </q-td>
                    <q-td key="prp_name" class="text-center" :props="props">
                      {{ props.row.user && props.row.user.position && props.row.user.position.prp_name ? props.row.user.position.prp_name : '' }}
                    </q-td>
                    <q-td key="id" class="text-center" :props="props">
                      <q-btn @click="deleteBut(props.row.rowIndex)" unelevated color="red">删除</q-btn>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card>

             <q-card flat bordered class="my-card q-mt-sm">
              <q-card-section class="q-pa-sm q-gutter-sm row items-center">
                <div class="text-subtitle2">
                  选择绑定商品
                </div>
                <q-space />
                <q-btn label="选择商品" unelevated @click="selectGoods" color="primary"  />
                <q-btn label="一键清空" unelevated @click="cleanBindGoods" color="red"  />
              </q-card-section>

              <q-table
                title-class="text-subtitle2"
                flat
                bordered
                :pagination="{
                  rowsPerPage: 0,
                }"
                :data="bindGoodsData"
                :columns="goodsColumnDefs"
                row-key="field"
                hide-bottom
                separator="cell"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="goo_name" class="text-center" :props="props">
                      {{ props.row.goods && props.row.goods.goo_name ? props.row.goods.goo_name : '' }}
                    </q-td>
                    <q-td key="goo_code" class="text-center" :props="props">
                       {{ props.row.goods && props.row.goods.goo_code ? props.row.goods.goo_code : '' }}
                    </q-td>
                    <q-td key="id" class="text-center" :props="props">
                      <q-btn @click="deleteBindGoods(props.row.rowIndex)" unelevated color="red">删除</q-btn>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card>
          </q-scroll-area>
        </div>

        <hl-goods-table
            ref="specificationTree"
            v-if="showGoodsList"
            @getSelectedGoodsData="getSelectedGoodsData"
            @closeDialog="showGoodsList = false"
            rowSelection="multiple"
          ></hl-goods-table>

        <div class="row q-gutter-sm text-center justify-center q-mb-sm">
          <q-btn unelevated class="q-px-xl" label="保存" :disable="saveDisable" @click="setLabelData" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage" />
        </div>
        <select-user v-if="userStatus" ref="selectUserRef" @getSelectedUserData="saveUser"></select-user>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import SelectUser from './SelectUser'
export default {
  name: 'AddLabel',
  components: { SelectUser },
  data () {
    return {
      userStatus: false,
      saveDisable: false,
      dataFrom: {
        id: '',
        prl_mode: '1',
        prl_label_name: '',
        prl_label_price: '',
        prl_label_proportion: ''
      },
      rewardBindUser: [],
      gridOptions: {},
      context: null,
      bindGoodsData: [],
      countColumnDefs: [
        { name: 'pru_name', label: '名称', field: 'pru_name', align: 'cneter' },
        { name: 'prp_name', label: '职位', field: 'pru_name', align: 'cneter' },
        { name: 'id', label: '操作', field: 'id', align: 'cneter' }
      ],
      goodsColumnDefs: [
        { name: 'goo_name', label: '名称', field: 'goo_name', align: 'cneter' },
        { name: 'goo_code', label: '编码', field: 'goo_code', align: 'cneter' },
        { name: 'id', label: '操作', field: 'id', align: 'cneter' }
      ],

      dialogStatus: false,
      currentlabelId: 0,
      showGoodsList: false
    }
  },

  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    init (labelId) {
      this.dialogStatus = true
      if (labelId > 0) {
        this.currentlabelId = labelId
        this.getData()
      }
    },
    getData () {
      this.$store
        .dispatch('rewardLabel/getItem', this.currentlabelId)
        .then((res) => {
          if (res.code == 200) {
            this.dataFrom = res.data ? res.data.labelItem : this.dataFrom

            this.rewardBindUser = res.data ? res.data.userData : []
            this.bindGoodsData = res.data ? res.data.goodsData : []
          } else {
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
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setLabelData () {
      this.$refs.labelDataRef.validate().then((success) => {
        if (success) {
          this.saveDisable = true
          const data = {
            id: this.currentlabelId,
            ...this.dataFrom,
            rewardBindUser: this.rewardBindUser,
            bindGoodsData: this.bindGoodsData
          }
          this.$store
            .dispatch('rewardLabel/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: this.currentlabelId > 0 ? '修改' : '新增' + '成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: '成功',
                  color: 'green'
                })
                this.saveDisable = false
                this.hideNowPage()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.saveDisable = false
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.currentlabelId = 0
      this.$emit('colseDialog')
      this.dialogStatus = false
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    selectUser () {
      this.userStatus = true
      this.$nextTick(() => {
        this.$refs.selectUserRef.getUser()
      })
    },
    saveUser (data, val) {
      this.userStatus = val
      const that = this
      if (data && data.length > 0) {
        _.forEach(data, function (item, key) {
          const userIndex = _.find(that.rewardBindUser, function (o) {
            return o.prl_user_id == item.id
          })
          if (!userIndex || userIndex < 0) {
            that.rewardBindUser.push({
              user: {
                pru_name: item.pru_name,
                pru_telephone: item.pru_telephone,
                position: item.position
              },
              prl_user_id: item.id
            })
          }
        })
      }
    },

    selectGoods () {
      this.showGoodsList = true
      this.$nextTick(() => {
        this.$refs.specificationTree.getInquireType([1, 2])
      })
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data) {
        if (data.length > 0) {
          _.forEach(data, function (item, key) {
            const goodsIndex = _.find(that.bindGoodsData, function (o) {
              return o.goods_id == item.id
            })
            if (!goodsIndex || goodsIndex < 0) {
              that.bindGoodsData.push({
                goods: {
                  goo_name: item.goo_name,
                  goo_code: item.goo_code
                },
                goods_id: item.id
              })
            }
          })
        }
      }
    },

    deleteBut (index) {
      this.rewardBindUser.splice(index, 1)
    },
    deleteBindGoods (index) {
      this.bindGoodsData.splice(index, 1)
    },

    cleanBindUser () {
      this.rewardBindUser = []
    },
    cleanBindGoods () {
      this.bindGoodsData = []
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
