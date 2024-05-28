<template>
  <q-dialog
    v-model="pendingOrderDialog"
    @hide="$emit('hidePendingOrderDialog')"
    class="fit"
  >
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px'
      }"
      class="fit column no-wrap justify-between items-stretch content-stretch no-scroll"
    >
      <div class="col-shrink bg-white row q-px-xs q-pb-md">
        <q-toolbar>
          <q-toolbar-title>挂单信息 </q-toolbar-title>
          <q-btn
            flat
            v-close-popup
            round
            dense
            @click="hidePendingOrderDialog"
            icon="close"
          />
        </q-toolbar>
      </div>

      <div class="col-shrink q-pa-sm full-height ">
        <q-scroll-area class="fit full-height">
          <div class="row full-height">
            <div class="col-12 q-px-sm">
              <q-table
                bordered
                title="挂单列表"
                flat
                class="full-height"
                hide-pagination
                :data="hangUpListData"
                :columns="columns"
                row-key="id"
                :pagination="page"
                separator="cell"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width>
                      <q-btn
                        size="sm"
                        color="primary"
                        round
                        dense
                        unelevated
                        @click="props.expand = !props.expand"
                        :icon="props.expand ? 'remove' : 'add'"
                      />
                    </q-td>
                    <q-td key="id" :props="props">
                      <q-checkbox
                        v-model="currentHangId"
                        :val="props.row.id"
                        @input="getHangDetailsBut(props.row)"
                      />
                    </q-td>
                    <q-td key="chu_hangUpCode" :props="props">
                      {{ props.row.chu_hangUpCode }}
                    </q-td>
                    <q-td key="chu_memberName" :props="props">
                      {{ props.row.chu_memberName }}
                    </q-td>
                    <q-td key="chu_memberCardNum" :props="props">
                      {{ props.row.chu_memberCardNum }}
                    </q-td>
                    <q-td key="chu_hangUpNote" :props="props">
                      {{ props.row.chu_hangUpNote }}
                    </q-td>
                    <q-td key="created_at" :props="props">
                      {{
                        $q_date.formatDate(
                          props.row.created_at * 1000,
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      }}
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <q-table
                        bordered
                        hide-pagination
                        :data="props.row.detail"
                        :columns="orderDetailcolumns"
                        row-key="name"
                        flat
                        separator="cell"
                      >
           <template v-slot:body="props">
                  <q-tr :props="props">

 <q-td key="chud_goo_name" :props="props">
                      {{ props.row.chud_goo_name }}
                    </q-td>
                    <q-td key="chud_goo_price" :props="props">
                    {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}  {{ props.row.chud_goo_price }}
                    </q-td>
                    <q-td key="chud_memberPrice" :props="props">
                      {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ props.row.chud_memberPrice }}
                    </q-td>
                    <q-td key="chud_consumeNumber" :props="props">
                      {{ props.row.chud_consumeNumber }}
                    </q-td>
                    <q-td key="chud_totalPrice" :props="props">
                   {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}  {{ props.row.chud_totalPrice }}
                    </q-td>
                  </q-tr>
           </template>

                        <template v-slot:no-data>
                          <div class="full-width row flex-center  q-gutter-sm">
                            <q-icon size="2em" name="folder_open" />
                            <span> 暂无详情 </span>
                          </div>
                        </template>
                      </q-table>
                    </q-td>
                  </q-tr>
                </template>

                <template v-slot:no-data>
                  <div class="full-width row flex-center   q-gutter-sm">
                    <q-icon size="2em" name="subject" />
                    <span> 暂无挂单数据 </span>
                  </div>
                </template>
              </q-table>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div
        class=" col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center"
      >
        <div class="col-6">
          <div class="row justify-between">
            <div class="col-4">
              <q-btn
                outline
                @click="
                  page.page--;
                  getHangUpList();
                "
                :disable="page.page <= 1"
                color="primary"
                icon="arrow_back_ios"
                label="上一页"
              />
            </div>
            <div class="col-4">
              <q-pagination
                v-model="page.page"
                :max="maxPage"
                direction-links
                boundary-links
                icon-first="skip_previous"
                icon-last="skip_next"
                icon-prev="fast_rewind"
                icon-next="fast_forward"
                @input="getHangUpList"
              />
            </div>
            <div class="col-4">
              <q-btn
                outline
                @click="
                  page.page++;
                  getHangUpList();
                "
                :disable="page.page >= maxPage"
                color="primary"
                icon="arrow_forward_ios"
                label="下一页"
              />
            </div>
          </div>
        </div>
        <div class="col-6 text-center q-gutter-md">
          <q-btn
            color="deep-orange"
            unelevated
            :disable="!currentHangInfo.id"
            @click="solutionsHanging"
            label="去结账"
          />
          <q-btn
            color="white"
            text-color="black"
            unelevated
            :disable="!currentHangInfo.id"
            @click="deleteHangData"
            outline
            label="删除挂单"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'PendingOrder',
  props: ['member_id', 'consumehangup_id', 'currentMemberInfo'],
  data () {
    return {
      pendingOrderDialog: false,
      pendingOrderRemarks: '',
      columns: [
        {
          name: 'expand',
          label: '',
          align: 'left',
          field: 'expand'
        },
        {
          name: 'id',
          label: '选择',
          align: 'left',
          field: 'id'
        },
        {
          name: 'chu_hangUpCode',
          label: '挂单编码',
          align: 'left',
          field: 'chu_hangUpCode'
        },
        {
          name: 'chu_memberName',
          label: '会员姓名',
          align: 'left',
          field: 'chu_memberName'
        },
        {
          name: 'chu_memberCardNum',
          label: '会员卡号',
          align: 'left',
          field: 'chu_memberCardNum'
        },
        {
          name: 'chu_hangUpNote',
          label: '挂单备注',
          align: 'left',
          field: 'chu_hangUpNote'
        },
        {
          name: 'created_at',
          label: '挂单日期',
          align: 'left',
          field: 'created_at'
          // sss:
        }
      ],
      orderDetailcolumns: [
        {
          name: 'chud_goo_name',
          label: '商品名称',
          align: 'left',
          field: 'chud_goo_name'
        },
        {
          name: 'chud_goo_price',
          align: 'left',
          label: '售价',
          field: 'chud_goo_price'
        },
        {
          name: 'chud_memberPrice',
          label: '会员价',
          align: 'left',
          field: 'chud_memberPrice'
        },
        { label: '数量', name: 'chud_consumeNumber', align: 'left', field: 'chud_consumeNumber' },
        {
          name: 'chud_totalPrice',
          label: '小计金额',
          align: 'left',
          field: 'chud_totalPrice'
        }
      ],
      hangUpListData: [],
      hangDetailDataList: [],
      page: {
        pageTotal: 0,
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      currentHangInfo: {},
      currentHangId: []
    }
  },
  computed: {
    maxPage () {
      return Math.ceil(this.page.pageTotal / this.page.rowsPerPage) &&
        Math.ceil(this.page.pageTotal / this.page.rowsPerPage) != 'Infinity'
        ? Math.ceil(this.page.pageTotal / this.page.rowsPerPage)
        : 1
    }
  },
  created () {},
  watch: {},
  methods: {
    openPendingOrderList (shoppingCarList = null, pendingOrderId = 0) {
      if (shoppingCarList && shoppingCarList.length > 0) {
        this.pendingOrder(shoppingCarList, pendingOrderId)
      } else {
        this.getHangUpList()
        this.pendingOrderDialog = true
      }
    },
    // 获取挂单列表数据
    getHangUpList () {
      const obj = {
        remarks: this.pendingOrderRemarks,
        member_id: parseInt(this.member_id),
        page: this.page.page,
        pSize: this.page.rowsPerPage
      }
      this.$store
        .dispatch('consume/getHangUpList', obj)
        .then(res => {
          if (res.code == 200) {
            this.hangUpListData = res.data ? res.data.list : []

            this.page.pageTotal = res.data.page.totalCount
          }
        })
        .catch(error => {})
    },

    // 挂单弹窗
    pendingOrder (shoppingCarList, pendingOrderId) {
      this.$q
        .dialog({
          title: '挂单备注',
          message: '例如:客户延迟付款',
          prompt: {
            model: '',
            outlined: true,
            isValid: val => !!val,
            type: 'textarea'
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          this.hangUpBut(data, shoppingCarList, pendingOrderId)
        })
    },

    // 挂单
    hangUpBut (data, shoppingCarList, pendingOrderId) {
      const buffer_data = _.map(shoppingCarList, 'id')

      const obj = {
        member_id: parseInt(this.member_id),
        chu_memberCardNum: this.currentMemberInfo
          ? this.currentMemberInfo.mem_memberCardNum
          : '',
        chu_memberName: this.currentMemberInfo
          ? this.currentMemberInfo.mem_memberName
          : '',
        chu_hangUpNote: data,
        buffer_data,
        pendingOrderId
      }

      this.$store.dispatch('consume/addhang', obj).then(res => {
        if (res.code == 200) {
          this.pendingOrderDialog = true
          this.getHangUpList()

          this.$q.notify({
            message: '成功',
            caption: '挂单成功',
            icon: 'ion-checkmark-circle-outline',
            color: 'green',
            position: 'top-center',
            timeout: 500
          })
          this.$emit('hangUpSuccess')
        } else {
          this.$q.notify({
            message: '失败',
            caption: '挂单操作失败！',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-center '
          })
        }
      })
    },

    // 解挂
    solutionsHanging () {
      this.pendingOrderDialog = false
      this.$emit('solutionsHanging', this.currentHangInfo)
    },

    // 获取挂单详情
    getHangDetailsBut (row) {
      this.currentHangInfo = row
      const obj = {
        consumehangup_id: row.id,
        member_id: parseInt(this.member_id)
      }
      this.currentHangId = [row.id]
      this.$store
        .dispatch('consume/getShoppingCartList', obj)
        .then(res => {
          this.hangDetailDataList = res.data ? res.data : []
        })
        .catch(error => {})
    },
    // 删除挂单
    deleteHangData () {
      this.$q
        .dialog({
          title: '确定',
          message: '确定删除此挂单',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          if (parseInt(this.currentHangInfo.id) <= 0) {
            this.$q.notify({
              message: '删除失败',
              caption: '请刷新重试',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'center'
            })
            return false
          }

          const obj = {
            id: this.currentHangInfo.id
          }
          this.$store
            .dispatch('consume/delhang', obj)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'center',
                  timeout: 500
                })
                setTimeout(() => {
                  this.hangDetailDataList = []
                  this.getHangUpList()
                }, 100)
              } else {
                this.$q.notify({
                  message: '删除失败',
                  caption: '请刷新重试',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'center'
                })
              }
            })
            .catch(error => {})
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },
    // 取消选择挂单
    hidePendingOrderDialog () {
      this.$emit('solutionsHanging', {})
    }
  }
}
</script>
