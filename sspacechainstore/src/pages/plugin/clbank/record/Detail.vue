<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.9 + 'px',
        'min-width': $q.screen.width * 0.9 + 'px',
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-white">
        <div class="col-shrink bg-white q-px-xs row">
          <div class="text-subtitle2">寄存记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink full-height row">
          <div class="col-8 q-pb-md">
            <ag-grid-vue
              ref="agGridTableDetail"
              :gridOptions="gridOptionsDetail"
              class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
              :columnDefs="columnDefsDetail"
              :suppressMovableColumns="true"
              :rowData="clbankRecord"
              :rowDragManaged="true"
              colResizeDefault="shift"
              :animateRows="false"
              @first-data-rendered="onFirstDataRendered"
              @gridReady="onFirstDataRendered"
              :floatingFilter="false"
              :enableCellTextSelection="true"
              rowHeight="50"
              :context="context"
              rowSelection="multiple"
              :localeText="localeText"
              :stopEditingWhenGridLosesFocus="true"
              :suppressCellSelection="true"
              :suppressRowClickSelection="true"
            ></ag-grid-vue>
          </div>
          <div class="col-4 q-pa-sm">
            <q-list separator bordered>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ recordInfo.cr_order_no }}</q-item-label>
                  <q-item-label caption>首存单据号</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>{{ recordInfo.cr_order_number }}</q-item-label>
                  <q-item-label caption>首存序列号</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>{{ recordInfo.cr_member_name }} - {{ recordInfo.cr_member_card_number }}</q-item-label>
                  <q-item-label caption>昵称-卡号</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>{{ recordInfo.cr_member_real_name }} - {{ recordInfo.cr_member_mobile }}</q-item-label>
                  <q-item-label caption>真实姓名-联系电话</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ recordInfo.unit ? recordInfo.unit.cu_name : '' }} </q-item-label>
                  <q-item-label caption>材料名称</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ recordInfo.rule ? recordInfo.rule.cr_name : '' }} </q-item-label>
                  <q-item-label caption>利息规则({{ recordInfo.rule ? recordInfo.rule.cr_name : '' }})</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ initWeight }} </q-item-label>
                  <q-item-label caption>首存重量</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ takeInitWeight }} </q-item-label>
                  <q-item-label caption>已取的首存</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ interestCount }} </q-item-label>
                  <q-item-label caption>产生的利息</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ takeInterestCount }} </q-item-label>
                  <q-item-label caption>已取的利息</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ formatAmount(interestCount - takeInterestCount) }} </q-item-label>
                  <q-item-label caption>可取的利息</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-btn
                      rounded
                      color="primary"
                      unelevated
                      @click="takeInterestOperate"
                      :disable="formatAmount(interestCount - takeInterestCount) > 0 ? false : true"
                      label="取出"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">{{ formatAmount(initWeight - takeInitWeight) }} </q-item-label>
                  <q-item-label caption>可取的首存</q-item-label>
                </q-item-section>

                <q-item-section v-if="parseInt(recordInfo.cr_lock_end_time) <= currnetTimeStamp">
                  <q-item-label class="text-h6">
                    <q-btn
                      rounded
                      color="primary"
                      unelevated
                      @click="takeInitWeightOperate"
                      :disable="formatAmount(initWeight - takeInitWeight) > 0 ? false : true"
                      label="取出"
                    />
                  </q-item-label>
                </q-item-section>

                <q-item-section v-else>
                  <q-item-label class="text-subtitle2">
                    可在<span class="text-red"> {{ $q_date.formatDate(recordInfo.cr_lock_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span> 后取出
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <q-dialog v-model="takeInterestDialogStatus" persistent>
          <q-card style="min-width: 350px">

            <q-card-section>
              <div class="text-subtitle2">请输入本次要提取的利息</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form ref="interestTakeFromRef">
              <q-input dense :rules="[(val) => formatAmount(val) <= formatAmount(interestCount - this.takeInterestCount) || '本次提取利息大于可提取利息']" v-model="currentTakInterest" autofocus outlined  />
              </q-form>
            </q-card-section>

            <q-card-actions align="around" class="text-primary">
              <q-btn unelevated color="grey" class="q-px-md" @click="closeTakeInterest" label="取消" />
              <q-btn unelevated color="primary" class="q-px-md" @click="saveTakeInterest" label="保存"  />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="takeInitWeightDialogStatus" persistent>
          <q-card style="min-width: 350px">

            <q-card-section>
              <div class="text-subtitle2">请输入本次要提取的首存重量</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form ref="takeInitWeightFromRef">
              <q-input dense :rules="[(val) => formatAmount(val) <= formatAmount(initWeight - takeInitWeight) || '本次提取利息大于可提取利息']" v-model="currentTakeInitWeight" autofocus outlined  />
              </q-form>
            </q-card-section>

            <q-card-actions align="around" class="text-primary">
              <q-btn unelevated color="grey" class="q-px-md" @click="closeTakeInitWeight" label="取消" />
              <q-btn unelevated color="primary" class="q-px-md" @click="clickTakeInitWeightOperate" label="保存"  />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'clbankRecordDetail',
  components: {},
  data () {
    return {
      showDialog: true,
      recordId: '',
      gridOptions: {},
      gridOptionsDetail: {},
      detailRemarks: '',
      context: null,
      clbankRecord: [],

      columnDefsDetail: [
        {
          headerName: '利息返回模式',
          field: 'cr_operate_type',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.operateTypeObject[p.data.cr_operate_type]
          }
        },
        {
          headerName: '单据号',
          field: 'cr_order_no',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '序列号',
          field: 'cr_order_number',
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '操作数量',
          field: 'cr_change_weight',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '操作员',
          valueGetter: (p) => {
            if (p.data.user && p.data.user.username) {
              return p.data.user.username
            } else {
              return '未知'
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '操作时间',
          field: 'created_at',
          width: this.nowpx(0.12) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        }
      ],

      localeText: this.$ag_grid_localeText,
      operateTypeObject: this.$store.state.clbank.operateTypeObject,
      recordInfo: {},
      currnetTimeStamp: 0,

      interestCount: 0,
      takeInterestCount: 0,
      takeInitWeight: 0,
      initWeight: 0,
      takeInterestDialogStatus: false,
      currentTakInterest: '',
      takeInitWeightDialogStatus: false,
      currentTakeInitWeight: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    // 查询寄存单条记录
    init (id) {
      this.currnetTimeStamp = parseInt(new Date().getTime() / 1000)
      if (id > 0) {
        this.getItem(id)
      }
    },

    getItem (id) {
      this.$store
        .dispatch('clbank/getRecordDetail', { record_id: id })
        .then((res) => {
          if (res.code == 200) {
            this.interestCount = res.data && res.data.interestCount ? res.data.interestCount : 0
            this.takeInterestCount = res.data && res.data.takeInterestCount ? res.data.takeInterestCount : 0
            this.takeInitWeight = res.data && res.data.takeInitWeight ? res.data.takeInitWeight : 0
            this.initWeight = res.data && res.data.initWeight ? res.data.initWeight : 0
            this.recordInfo = res.data && res.data.recordInfo ? res.data.recordInfo : {}
            this.clbankRecord = res.data && res.data.clbankRecord ? res.data.clbankRecord : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
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

    hideNowPage () {
      this.$emit('dataList')
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 754
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },

    takeInterestOperate () {
      this.takeInterestDialogStatus = true
    },
    closeTakeInterest () {
      this.currentTakInterest = ''
      this.takeInterestDialogStatus = false
    },

    saveTakeInterest () {
      if (parseInt(this.recordInfo.id) <= 0) {
        this.$q.notify({
          message: '失败',
          caption: '提取错误，请刷新重试',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.$refs.interestTakeFromRef.validate().then((success) => {
        if (success) {
          const data = {
            cr_change_weight: this.currentTakInterest,
            record_id: this.recordInfo.id
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('clbank/saveTakeInterest', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '提取成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getItem(this.recordInfo.id)
                this.closeTakeInterest()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
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

    takeInitWeightOperate () {
      this.takeInitWeightDialogStatus = true
    },
    closeTakeInitWeight () {
      this.currentTakeInitWeight = ''
      this.takeInitWeightDialogStatus = false
    },
    clickTakeInitWeightOperate () {
      if (parseInt(this.recordInfo.id) <= 0) {
        this.$q.notify({
          message: '失败',
          caption: '提取错误，请刷新重试',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.$refs.takeInitWeightFromRef.validate().then((success) => {
        if (success) {
          const data = {
            cr_change_weight: this.currentTakeInitWeight,
            record_id: this.recordInfo.id
          }

          this.$store
            .dispatch('clbank/saveTakeInitWeight', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '提取成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getItem(this.recordInfo.id)
                this.closeTakeInitWeight()
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
