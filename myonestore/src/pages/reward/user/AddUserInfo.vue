<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.4) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-md q-py-xs">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}员工</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white ">
          <q-scroll-area class="fit full-height">
            <q-form ref="newsDataRef" class="q-gutter-md">
              <div class="q-ml-lg">
                <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />基础信息</div>
                <q-separator />
                <div class="row q-my-sm q-col-gutter-sm">
                  <div class="col-8 col-md-6">
                    <q-input
                      outlined
                      dense
                      label="员工名称"
                      :rules="[(val) => !!val || '必填项']"
                      v-model="dataForm.pru_name"
                      placeholder="请输入员工"
                    >
                      <template v-slot:hint>
                        填写员工名称
                      </template></q-input
                    >
                  </div>
                  <div class="col-8 col-md-6">
                    <q-input
                      outlined
                      dense
                      label="员工电话"
                      :rules="[
                        (val) => !!val || '请填写员工电话',
                        (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确',
                      ]"
                      v-model="dataForm.pru_telephone"
                      placeholder="请输入员工电话"
                    >
                      <template v-slot:hint>
                        填写员工电话
                      </template></q-input
                    >
                  </div>
                  <div class="col-8 col-md-6">
                    <q-select
                      class="col-12 col-md-2"
                      outlined
                      label="员工状态"
                      bottom-slots
                      v-model="dataForm.pru_status"
                      :options="[
                        { label: '开启', value: '1' },
                        { label: '关闭', value: '0' },
                      ]"
                      dense
                      emit-value
                      map-options
                    >
                      <template v-slot:hint> 员工状态 </template>
                    </q-select>
                  </div>
                  <div class="col-8 col-md-6 ">
                    <q-select
                      class="col-12 col-md-2"
                      outlined
                      label="职位"
                      bottom-slots
                      v-model="dataForm.position_id"
                      :options="positionDataList"
                      dense
                      option-label="prp_name"
                      option-value="id"
                      emit-value
                      :rules="[(val) => !!val || '请选择职位']"
                      map-options
                    >
                    </q-select>
                  </div>
                  <div class="col-8 col-md-6">
                    <q-input outlined dense label="简介" type="textarea" :rows="3" v-model="dataForm.pru_description"> </q-input>
                  </div>
                  <div class="col-8 col-md-6 text-center">
                    <hl-upload
                      :multiple="false"
                      :currentAttach="dataForm.coverImage"
                      @input="
                        (val) => {
                          $nextTick(() => {
                            dataForm.pru_avatar = val;
                          });
                        }
                      "
                      currentDescription="建议尺寸比例1:1"
                      currentTitle="头像"
                    />
                  </div>
                </div>
                <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />绑定设置</div>
                <q-separator />
                <div class="row q-my-sm q-col-gutter-sm">
                  <div class="col-8 col-md-6">
                    <q-input outlined dense label="绑定会员" maxlength="9" v-model="member" readonly>
                      <template v-slot:append>
                        <q-icon name="search" @click="addMember" />
                      </template>
                      <template v-slot:hint> 点击图标按钮绑定会员 </template>
                    </q-input>
                  </div>
                  <div class="col-8 col-md-6">
                    <q-input outlined dense label="绑定操作员" v-model="userName" readonly>
                      <template v-slot:append>
                        <q-icon name="search" @click="selectUser" />
                      </template>
                      <template v-slot:hint> 点击图标按钮绑定操作员 </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <q-card flat bordered class="my-card q-mt-sm">
                <q-card-section class="q-pa-sm q-gutter-sm row items-center">
                  <div class="text-subtitle2">
                    擅长服务
                  </div>
                  <q-space />
                  <q-btn label="选择商品" unelevated @click="selectGoods" color="primary" />
                  <q-btn label="一键清空" unelevated @click="cleanBindGoods" color="red" />
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
            </q-form>
          </q-scroll-area>
        </div>

        <div class="row q-gutter-sm text-center justify-center q-mb-sm">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData" :disable="saveStopData" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage" />
        </div>
      </div>
    </q-card>
    <select-user v-if="userStatus" ref="selectUserRef" @getSelectedUserData="getUserData"></select-user>
    <hl-choose-manager ref="chooseManagerList" @getChooseManageData="receivingAdministrator"></hl-choose-manager>
    <hl-goods-table
      ref="specificationTree"
      v-if="showGoodsList"
      @getSelectedGoodsData="getSelectedGoodsData"
      @closeDialog="showGoodsList = false"
      rowSelection="multiple"
    ></hl-goods-table>
  </q-dialog>
</template>

<script>
import SelectUser from './SelectUser'
export default {
  name: 'AddUserInfo',
  props: [],
  components: {
    SelectUser
  },
  data () {
    return {
      addStoreSidebar: false,
      userStatus: false,
      dataId: 0,
      dataForm: {
        pru_name: '',
        pru_telephone: '',
        pru_status: '1',
        pru_member_id: '',
        pru_user_id: '',
        pru_avatar: '',
        pru_description: ''
      },
      saveStopData: false,
      userName: '',
      member: '',
      positionDataList: [],
      uploadImgStatus: false,
      bindGoodsData: [],
      goodsColumnDefs: [
        { name: 'goo_name', label: '名称', field: 'goo_name', align: 'cneter' },
        { name: 'goo_code', label: '编码', field: 'goo_code', align: 'cneter' },
        { name: 'id', label: '操作', field: 'id', align: 'cneter' }
      ],
      showGoodsList: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    getUser (id) {
      this.addStoreSidebar = true
      this.getAllUserPosition()
      if (id > 0) {
        this.dataId = id
        this.$store.dispatch('rewardPosition/getUserItem', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.dataForm = res.data ? res.data : {}
            if (this.dataForm) {
              this.member = res.data.member ? res.data.member.mem_memberName : ''
              this.userName = res.data.user ? res.data.user.username : ''
            }
            this.bindGoodsData = res.data && res.data.bindGoodsData ? res.data.bindGoodsData : []
          } else {
            this.addStoreSidebar = false
          }
        })
      }
    },
    getAllUserPosition () {
      this.$store.dispatch('rewardPosition/getAllPositionData').then((res) => {
        if (res.code == 200) {
          this.positionDataList = res.data ? res.data : []
        }
      })
    },
    selectUser () {
      console.log()
      this.userStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.selectUserRef.getUser()
        }, 500)
      })
    },
    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.saveStopData = true
          this.addStoreSidebar = false
          const obj = {
            ...this.dataForm,
            id: this.dataId,
            bindGoodsData: this.bindGoodsData
          }
          this.$store
            .dispatch('rewardPosition/setUserData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '员工成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '操作失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.saveStopData = false
            })
        }
      })
    },
    getUserData (val) {
      this.userStatus = false
      if (val.length > 0) {
        this.dataForm.pru_user_id = parseInt(val[0].id)
        this.userName = val[0].username
      }
    },
    addMember () {
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    delMember () {
      this.member = ''
      this.clientFrom.member_id = 0
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        this.member = val[0].mem_memberName
        this.dataForm.pru_member_id = parseInt(val[0].id)
      }
    },
    hideNowPage () {
      this.addStoreSidebar = false
      this.saveStopData = false
      this.dataId = 0
      this.dataForm = {
        pru_name: '',
        pru_telephone: '',
        pru_status: '1',
        pru_member_id: '',
        pru_user_id: ''
      }
      this.member = ''
      this.userName = ''
      this.$emit('getMethods')
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
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
              return o.glu_goods_id == item.id
            })
            if (!goodsIndex || goodsIndex < 0) {
              that.bindGoodsData.push({
                goods: {
                  goo_name: item.goo_name,
                  goo_code: item.goo_code
                },
                glu_goods_id: item.id
              })
            }
          })
        }
      }
    },
    deleteBindGoods (index) {
      this.bindGoodsData.splice(index, 1)
    },
    cleanBindGoods () {
      this.bindGoodsData = []
    }
  }
}
</script>
