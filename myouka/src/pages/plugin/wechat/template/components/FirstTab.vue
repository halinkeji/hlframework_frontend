<template>
  <div>
    <div class="row q-py-sm q-gutter-sm ">
      <div class="col-md-2 col-12 q-pt-none">
        <q-input
          outlined
          bottom-slots
          v-model="text"
          dense
          class="q-py-none"
          label="请输入任务名称"
        >
        </q-input>
      </div>
      <q-btn unelevated color="primary" label="搜索" class="q-px-lg" />
      <q-btn
        unelevated
        color="amber"
        label="重置"
        class="q-px-lg"
        @click="text = ''"
      />
      <q-btn
        unelevated
        color="primary"
        label="添加群发任务"
        @click="medium = true"
      />
      <!-- 弹窗 -->
      <q-dialog v-model="medium" persistent>
        <q-card style="width: 1200px; max-width: 80vw;" class="q-px-md q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1"
              >新增群发任务</q-toolbar-title
            >
            <q-btn flat round dense icon="close" v-close-popup size="12px" />
          </q-toolbar>
          <div class="bg-red-1 q-pa-md text-red" style="border-radius:5px">
            <div>
              <q-icon name=" report" />
              根据选择的用户群体不同，发送时间会不相同，发送期间请耐心等待!
            </div>
            <div>
              <q-icon name=" report" />
              模板消息群发有风险，请谨慎使用，大用户量建议使用公众平台推送!
            </div>
            <div>
              <q-icon name=" report" />
              选择进程时，发送人数必须大于进程数，否则的话导致无法正常发送!
            </div>
          </div>
          <div class="row q-mt-lg q-col-gutter-md">
            <div class="col-md-6 col-12 q-pt-none">
              <div class="row items-center">
                <div class="col-2">
                  任务名称<span class="text-red-8 q-pl-xs">*</span>
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="nameText"
                    dense
                    class="q-pb-none"
                    label="任务名称，例：优惠券群发通知"
                    :rules="[val => !!val || '任务名称是必填项']"
                  >
                  </q-input>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12 q-pt-none">
              <div class="row items-center">
                <div class="col-2">
                  发送进程数
                </div>
                <div class="col-10">
                  <q-select outlined dense v-model="model" :options="options" />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-center q-mt-md">
            <div class="col-2.5">
              发送消息类型
            </div>
            <div class="col-9.5">
              <q-option-group
                v-model="group"
                :options="options"
                color="primary"
                inline
                class="q-ml-sm"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-1"></div>
            <div class="col q-ml-lg q-my-sm">
              混合消息发送方式为先发送客服消息,如果发送失败再次发送模板消息!
            </div>
          </div>
          <div class="row q-mt-lg" v-if="group == '1'">
            <div class="col-md-6 col-12 q-pt-none">
              <div class="row items-center">
                <div class="col-2">
                  选择模板<span class="text-red-8 q-pl-xs">*</span>
                </div>
                <div class="col-10">
                  <q-select
                    outlined
                    dense
                    v-model="modelOne"
                    :options="optionsOne"
                    class="q-pb-none"
                    :rules="[val => !!val || '模板是必填项']"
                    label="点击这里选择任务"
                  />
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="bzText"
                    dense
                    type="textarea"
                  >
                  </q-input>
                </div>
              </div>
            </div>
          </div>
          <div class="row q-mt-lg items-center" v-if="group == '2'">
            <div class="col-md-6 col-12 q-pt-none">
              <div class="row items-center">
                <div class="col-2.5">
                  客服消息类型
                </div>
                <div class="col-9.5">
                  <q-option-group
                    v-model="groupOne"
                    :options="optionsTwo"
                    color="primary"
                    inline
                    class="q-ml-sm"
                  />
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupOne == '1'">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="wzText"
                    dense
                    type="textarea"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupOne == '2'">
                <div class="col-2">
                  语音ID
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="mtText"
                    class="q-pb-none"
                    dense
                  >
                    <template v-slot:append>
                      <div class="q-pl-none">
                        <span class="text-subtitle1">选择媒体文件</span>
                      </div>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
          <div class="row q-mt-lg" v-if="group == '3'">
            <div class="col-md-6 col-12 q-pt-none">
              <div class="row items-center">
                <div class="col-2">
                  选择模板<span class="text-red-8 q-pl-xs">*</span>
                </div>
                <div class="col-10">
                  <q-select
                    outlined
                    dense
                    v-model="modelT"
                    :options="optionsT"
                    class="q-pb-none"
                    :rules="[val => !!val || '模板是必填项']"
                    label="点击这里选择任务"
                  />
                </div>
              </div>
              <div class="row items-center">
                <div class="col-2.5">
                  客服消息类型
                </div>
                <div class="col-9.5">
                  <q-option-group
                    v-model="groupF"
                    :options="optionsF"
                    color="primary"
                    inline
                    class="q-ml-sm"
                  />
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupF == '1'">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="wzText"
                    dense
                    type="textarea"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupF == '2'">
                <div class="col-2">
                  语音ID
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="yyText"
                    class="q-pb-none"
                    dense
                  >
                    <template v-slot:append>
                      <div class="q-pl-none">
                        <span class="text-subtitle1">选择媒体文件</span>
                      </div>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
          <div class="row items-center q-mt-md">
            <div class="col-2.5">
              发送消息类型
            </div>
            <div class="col-9.5">
              <q-option-group
                v-model="groupState"
                :options="optionsState"
                color="primary"
                inline
                class="q-ml-sm"
              />
            </div>
          </div>
          <div class="row items-center q-mt-md" v-if="groupState == '1'">
            <div class="col-1">
              请输入文字内容
            </div>
            <div class="col-11">
              <q-input
                outlined
                bottom-slots
                v-model="box"
                dense
                type="textarea"
              >
              </q-input>
            </div>
          </div>
          <div class="row items-center q-mt-md" v-if="groupState == '2'">
            <div class="col-2">
              <q-btn
                unelevated
                color="primary"
                class="full-width full-height"
                label="点击选择会员"
                @click="choose = true"
              />

              <q-dialog v-model="choose" persistent>
                <q-card
                  style="width:1000px; max-width: 80vw;"
                  class="q-px-md q-py-sm"
                >
                  <q-toolbar class="q-px-none">
                    <q-toolbar-title class="text-subtitle1"
                      >选择微信公众号端管理员</q-toolbar-title
                    >
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      v-close-popup
                      size="12px"
                    />
                  </q-toolbar>
                  <div class="row q-col-gutter-sm">
                    <div class="col-md-2 col-6">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="code"
                        dense
                        label="请输入卡号"
                        class="q-pb-none"
                      >
                      </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="real"
                        class="q-pb-none"
                        dense
                        label="请输入会员真实姓名"
                      >
                      </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="nctext"
                        class="q-pb-none"
                        dense
                        label="请输入会员昵称"
                      >
                      </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input
                        outlined
                        bottom-slots
                        class="q-pb-none"
                        v-model="number"
                        dense
                        label="请输入手机号"
                      >
                      </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="gzh"
                        class="q-pb-none"
                        dense
                        label="请输入公众号openid"
                      >
                      </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input
                        outlined
                        bottom-slots
                        class="q-pb-none"
                        v-model="xcx"
                        dense
                        label="请输入小程序openid"
                      >
                      </q-input>
                    </div>
                  </div>
                  <div class="q-mt-sm">
                    <q-btn
                      unelevated
                      color="primary"
                      label="查询"
                      class="q-px-lg"
                    />
                    <q-btn
                      unelevated
                      color="amber"
                      label="重置"
                      class="q-ml-sm q-px-lg"
                    />
                  </div>
                  <hl-auto-height class="q-mt-sm">
                    <template slot="body">
                      <ag-grid-vue
                        ref="agGridTable"
                        :gridOptions="gridOptionsOne"
                        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
                        :columnDefs="columnDefsOne"
                        :suppressMovableColumns="true"
                        :stopEditingWhenGridLosesFocus="true"
                        :suppressRowDeselection="true"
                        :defaultColDef="defaultColDefOne"
                        @first-data-rendered="adaptiveTableOne"
                        :rowData="contactsOne"
                        rowSelection="multiple"
                        :rowDragManaged="true"
                        colResizeDefault="shift"
                        :animateRows="false"
                        rowHeight="60"
                        :floatingFilter="false"
                        :enableCellTextSelection="true"
                        :suppressCellSelection="true"
                        :suppressRowClickSelection="true"
                        :suppressRowTransform="true"
                      ></ag-grid-vue>
                    </template>
                  </hl-auto-height>
                  <hl-pagination
                    @size-change="sizeChangeHandleOne"
                    @current-change="currentChangeHandleOne"
                    :current-page="pageOne.pageIndex"
                    :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
                    :page-size="pageOne.pageSize"
                    :total="pageOne.pageTotal"
                  ></hl-pagination>
                </q-card>
              </q-dialog>
            </div>
            <div class="col-10">
              <q-input v-model="huiyuan" disable standout dense> </q-input>
            </div>
          </div>
          <div class="row items-center q-mt-md" v-if="groupState == '3'">
            <div class="col-1">
              选择粉丝标签
            </div>
            <div class="col-11">
              <q-select
                outlined
                dense
                v-model="modelFan"
                :options="optionsFan"
                label="请选择粉丝标签"
              />
            </div>
          </div>
          <div class="row q-mt-md">
            <q-space />
            <q-btn outline unelevated color="grey-7" label="取消" />
            <q-btn unelevated color="blue-6" label="保存" class="q-ml-sm" />
          </div>
        </q-card>
      </q-dialog>
    </div>
    <div style="height: 636px">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        @first-data-rendered="adaptiveTable"
        :rowData="contacts"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="60"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :suppressRowTransform="true"
      ></ag-grid-vue>
    </div>
    <hl-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.pageIndex"
      :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
      :page-size="page.pageSize"
      :total="page.pageTotal"
    ></hl-pagination>
  </div>
</template>

<script>
import AgState from './AgState'
import AgUse from './AgUse'
import AgImg from './AgImg'
import AgSelect from './AgSelect'
export default {
  name: 'FirstTab',
  components: { AgState, AgUse, AgImg, AgSelect },
  data () {
    return {
      text: '',
      nameText: '',
      medium: false,
      bzText: '',
      wzText: '',
      mtText: '',
      huiyuan: '',
      box: '',
      yyText: '',
      model: '1',
      options: ['1', '2', '3'],
      modelOne: null,
      optionsOne: ['申请确认通知', '会员消费提醒', this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit + '兑换成功通知'],
      modelT: null,
      optionsT: ['申请确认通知', '会员消费提醒', this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit + '兑换成功通知'],
      modelFan: null,
      optionsFan: ['未分组(2652)', '星标组(0)', '测试(0)'],
      group: '1',
      options: [
        {
          label: '发送模板消息',
          value: '1'
        },
        {
          label: '发送客服消息',
          value: '2'
        },
        {
          label: '发送混合消息',
          value: '3'
        }
      ],
      groupOne: '1',
      optionsTwo: [
        {
          label: '发送文字消息',
          value: '1'
        },
        {
          label: '发送语音消息',
          value: '2'
        }
      ],
      groupF: '1',
      optionsF: [
        {
          label: '发送文字消息',
          value: '1'
        },
        {
          label: '发送语音消息',
          value: '2'
        }
      ],
      groupState: '1',
      optionsState: [
        {
          label: '按openid发送',
          value: '1'
        },
        {
          label: '指定用户发送',
          value: '2'
        },
        {
          label: '按用户标签发送',
          value: '3'
        },
        {
          label: '全部发送',
          value: '4'
        }
      ],
      defaultColDef: {},
      page: {
        pageIndex: 1,
        pageSize: 50,
        pageTotal: 0
      },
      columnDefs: [
        {
          headerName: '任务名称', // 列标题
          field: 'name', // 列与数据源对应的字段
          filter: false, // 是否过滤
          width: 30
        },
        {
          headerName: '发送条数',
          field: 'send',
          filter: false,
          width: 20
        },
        {
          headerName: '未发送数',
          field: 'nosend',
          filter: false,
          width: 20
        },

        {
          headerName: '成功条数',
          field: 'success',
          filter: false,
          width: 20
        },
        {
          headerName: '失败条数',
          field: 'failure',
          filter: false,
          width: 20
        },
        {
          headerName: '状态',
          field: 'state',
          filter: false,
          width: 40,
          cellRendererFramework: 'AgState'
        },
        {
          headerName: '操作',
          field: 'use',
          filter: false,
          cellRendererFramework: 'AgUse'
        }
      ],
      gridOptions: {},
      contacts: [
        {
          name: '端午群发全部会员',
          send: '2160',
          nosend: '0',
          success: '2160',
          failure: '0',
          state: 0,
          use: ''
        },
        {
          name: '端午群发全部会员',
          send: '2160',
          nosend: '0',
          success: '2160',
          failure: '0',
          state: 1,
          use: ''
        },
        {
          name: '端午群发全部会员',
          send: '2160',
          nosend: '0',
          success: '2160',
          failure: '0',
          state: 2,
          use: ''
        }
      ],
      code: '',
      number: '',
      real: '',
      gzh: '',
      xcx: '',
      hyText: '',
      choose: false,
      nctext: '',
      defaultColDefOne: {},
      pageOne: {
        pageIndex: 1,
        pageSize: 50,
        pageTotal: 0
      },
      columnDefsOne: [
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 60
        },
        {
          headerName: '头像', // 列标题
          field: 'pic', // 列与数据源对应的字段
          filter: false, // 是否过滤
          cellRendererFramework: 'AgImg'
        },
        {
          headerName: '卡号',
          field: 'num',
          filter: false
        },
        {
          headerName: '手机号',
          field: 'phone',
          filter: false
        },

        {
          headerName: '昵称',
          field: 'name',
          filter: false
        },
        {
          headerName: '真实姓名',
          field: 'real',
          filter: false
        },
        {
          headerName: '公众号OpenId',
          field: 'gzh',
          filter: false
        },
        {
          headerName: '小程序OpenId',
          field: 'xcx',
          filter: false
        },
        {
          headerName: '操作',
          field: 'use',
          filter: false,
          cellRendererFramework: 'AgSelect'
        }
      ],
      gridOptionsOne: {},
      contactsOne: [
        {
          pic: '',
          num: '15167183602',
          phone: '15167183602',
          name: '行走的文字',
          real: '行走的文字',
          gzh: 'o-q6YjsxmRxt8v2uV6iJeL1rXALU',
          xcx: 'o-q6YjsxmRxt8v2uV6iJeL1rXALU',
          use: ''
        }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    sizeChangeHandle (val) {},
    currentChangeHandle (val) {},
    adaptiveTableOne (params) {
      params.api.sizeColumnsToFit()
    },
    sizeChangeHandleOne (val) {},
    currentChangeHandleOne (val) {}
  }
}
</script>

<style></style>
