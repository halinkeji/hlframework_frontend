<template>
  <q-dialog v-model="pendingOrderDialog" maximized @hide="$emit('hidePendingOrderDialog')">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>挂单信息

            {{ member_id }}
          </q-toolbar-title>
          <q-btn flat v-close-popup round dense @click="hidePendingOrderDialog" icon="close" />
        </q-toolbar>
      </q-header>
      <q-footer class="row bg-grey-3 items-center">
        <div class="col-6">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-btn outline @click="page.page--;getHangUpList()" :disable="page.page <= 1" color="primary" icon="arrow_back_ios" label="上一页" />
              </q-item-section>
              <q-item-section class="flex-center">
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
              </q-item-section>
              <q-item-section side>
                <q-btn outline @click="page.page++;getHangUpList()"  :disable="page.page >= maxPage" color="primary" icon="arrow_forward_ios" label="下一页" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-6">
          <q-btn color="deep-orange" unelevated class="q-mx-sm" :disable="!currentHangInfo.id" @click="solutionsHanging" label="去结账" />
          <q-btn color="white" text-color="black" class="q-mx-sm" :disable="!currentHangInfo.id" @click="deleteHangData" outline label="删除挂单" />
        </div>
      </q-footer>
      <q-page-container>
        <q-page padding>
          <div class="row full-height">
            <div class="col-6 q-px-sm">
              <q-table
                bordered
                title="挂单列表"
                flat
                class="full-height"
                hide-pagination
                @row-click="getHangDetailsBut"
                :data="hangUpListData"
                :columns="columns"
                row-key="id"
                 :pagination="page"
              >
                <template v-slot:no-data>
                  <div class="full-width row flex-center   q-gutter-sm">
                    <q-icon size="2em" name="subject" />
                    <span> 暂无挂单数据 </span>
                  </div>
                </template>

              </q-table>
            </div>
            <div class="col-6 q-px-sm">
              <q-table bordered title="挂单详情" hide-pagination :data="hangDetailDataList" :columns="orderDetailcolumns" row-key="name" flat>
                <template v-slot:no-data>
                  <div class="full-width row flex-center  q-gutter-sm">
                    <q-icon size="2em" name="folder_open" />
                    <span> 暂无详情 </span>
                  </div>
                </template>
              </q-table>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
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
          name: 'chu_hangUpCode',
          label: '挂单条码',
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
        }
      ],
      orderDetailcolumns: [
        {
          label: '商品名称',
          align: 'left',
          field: 'chud_goo_name'
        },
        {
          align: 'left',
          label: '售价',
          field: 'chud_goo_price'
        },
        {
          label: '会员价',
          align: 'left',
          field: 'chud_memberPrice'
        },
        { label: '数量', align: 'left', field: 'chud_consumeNumber' },
        {
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
      currentHangInfo: {}
    }
  },
  computed: {
    maxPage () {
      return Math.ceil(this.page.pageTotal / this.page.rowsPerPage) && Math.ceil(this.page.pageTotal / this.page.rowsPerPage) != 'Infinity'
        ? Math.ceil(this.page.pageTotal / this.page.rowsPerPage)
        : 1
    }
  },
  created () {

  },
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
        .then((res) => {
          if (res.code == 200) {
            this.hangUpListData = res.data ? res.data.list : []
            if (this.hangUpListData && this.hangUpListData.length > 0) {
              this.getHangDetailsBut(null, this.hangUpListData[0], null)
            }
            this.page.pageTotal = res.data.page.totalCount
            this.$emit('hangUpListData', this.hangUpListData)
          }
        })
        .catch((error) => {})
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
            isValid: (val) => !!val,
            type: 'textarea'
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          this.hangUpBut(data, shoppingCarList, pendingOrderId)
        })
    },

    // 挂单
    hangUpBut (data, shoppingCarList, pendingOrderId) {
      const buffer_data = _.map(shoppingCarList, 'id')

      const obj = {
        member_id: parseInt(this.member_id),
        chu_memberCardNum: this.currentMemberInfo ? this.currentMemberInfo.mem_memberCardNum : '',
        chu_memberName: this.currentMemberInfo ? this.currentMemberInfo.mem_memberName : '',
        chu_hangUpNote: data,
        buffer_data,
        pendingOrderId
      }

      this.$store.dispatch('consume/addhang', obj).then((res) => {
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
    getHangDetailsBut (evt, row, index) {
      this.currentHangInfo = row
      const obj = {
        consumehangup_id: row.id,
        member_id: parseInt(this.member_id)
      }
      this.$store
        .dispatch('consume/getShoppingCartList', obj)
        .then((res) => {
          this.hangDetailDataList = res.data ? res.data : []
        })
        .catch((error) => {})
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
            .then((res) => {
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
            .catch((error) => {})
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
