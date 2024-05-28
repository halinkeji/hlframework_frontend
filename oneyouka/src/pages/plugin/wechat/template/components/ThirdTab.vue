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
        label="添加新模版"
        class="q-px-sm"
        @click="add = true"
      />
      <q-dialog v-model="add" persistent>
        <q-card style="width: 1200px; max-width: 80vw;" class="q-px-md q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">新增模板</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup size="12px" />
          </q-toolbar>
          <div class="row q-mt-sm q-col-gutter-md ">
            <div class="col-md-6 col-12">
              <div class="row items-center">
                <div class="col-2">
                  模板名称<span class="text-red q-ml-xs">*</span>
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="name"
                    dense
                    :rules="[val => !!val || '模板名称是必填项']"
                    class="q-pb-none"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  模板消息ID<span class="text-red q-ml-xs">*</span>
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="message"
                    dense
                    :rules="[val => !!val || '模板消息ID是必填项']"
                    class="q-pb-none"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  头部标题
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    class="bg-white"
                    v-model="title"
                    dense
                    bottom-slots
                    square
                  >
                    <template v-slot:prepend>
                      <q-icon name="ion-color-palette" class="cursor-pointer">
                        <q-menu>
                          <q-color v-model="hex"> </q-color>
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:hint>
                      对填充模板first.DATA的值
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  自定义键值
                </div>
                <div class="col-10" v-if="a == 0">
                  请选择模板
                </div>
                <div class="col-10" v-if="a == 1">
                  <div class="row q-mt-sm">
                    <div class="col-12">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="key1"
                        dense
                        class="q-pb-none"
                      >
                      </q-input>
                    </div>
                  </div>
                  <div class="row q-mt-sm">
                    <div class="col-12">
                      <q-input
                        outlined
                        class="bg-white"
                        v-model="choose1"
                        dense
                        bottom-slots
                        square
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="ion-color-palette"
                            class="cursor-pointer"
                          >
                            <q-menu>
                              <q-color v-model="hex2"> </q-color>
                            </q-menu>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row q-mt-sm">
                    <div class="col-12">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="key2"
                        dense
                        class="q-pb-none"
                      >
                      </q-input>
                    </div>
                  </div>
                  <div class="row q-mt-sm">
                    <div class="col-12">
                      <q-input
                        outlined
                        class="bg-white"
                        v-model="choose2"
                        dense
                        bottom-slots
                        square
                      >
                        <template v-slot:prepend>
                          <q-icon
                            name="ion-color-palette"
                            class="cursor-pointer"
                          >
                            <q-menu>
                              <q-color v-model="hex3"> </q-color>
                            </q-menu>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <q-btn unelevated color="primary" label="增加一条键" />
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  尾部描述
                </div>
                <div class="col-10">
                  <q-input
                    outlined
                    class="bg-white"
                    v-model="end"
                    dense
                    bottom-slots
                    square
                  >
                    <template v-slot:prepend>
                      <q-icon name="ion-color-palette" class="cursor-pointer">
                        <q-menu>
                          <q-color v-model="hex1"> </q-color>
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:hint>
                      对填充模板first.DATA的值
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  消息链接
                </div>
                <div class="col-7">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="link"
                    dense
                    class="q-pb-none"
                  >
                  </q-input>
                </div>
                <div class="col-3">
                  <q-btn
                    unelevated
                    color="primary"
                    label="选择连接"
                    class="full-height full-width"
                    icon-right=" keyboard_arrow_down "
                  >
                    <q-popup-proxy>
                      <q-list bordered separator>
                        <q-item v-ripple clickable>
                          <q-item-section>系统菜单</q-item-section>
                        </q-item>
                        <q-item v-ripple clickable>
                          <q-item-section>微页面</q-item-section>
                        </q-item>
                        <q-item v-ripple clickable>
                          <q-item-section>文章及分类</q-item-section>
                        </q-item>
                        <q-item v-ripple clickable>
                          <q-item-section>消息回复</q-item-section>
                        </q-item>
                        <q-item v-ripple clickable>
                          <q-item-section>一键导航</q-item-section>
                        </q-item>
                        <q-item v-ripple clickable>
                          <q-item-section>一键拨号</q-item-section>
                        </q-item>
                      </q-list>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12">
              <q-btn
                unelevated
                color="amber"
                label="简易帮助"
                icon="error"
                @click="help = true"
              />
              <!-- 简易帮助弹窗 -->
              <q-dialog v-model="help" persistent>
                <q-card
                  style="width: 400px; max-width: 80vw;"
                  class="q-px-md q-py-sm"
                >
                  <q-toolbar class="q-px-none">
                    <q-toolbar-title class="text-subtitle1"
                      >操作帮助</q-toolbar-title
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
                  <div class="q-ma-sm text-bold">
                    如模板详情为:first.DATA
                  </div>
                  <div class="q-ma-sm">
                    订单金额：keyword1.DATA
                  </div>
                  <div class="q-ma-sm">
                    商品详情：keyword2.DATA
                  </div>
                  <div class="q-ma-sm">
                    收货信息：keyword3.DATA
                  </div>
                  <div class="q-ma-sm">
                    emark.DATA
                  </div>
                  <div class="q-ma-sm text-bold">
                    头部标题：first.DATA
                  </div>
                  <div class="q-ma-sm">
                    键名：keyword1/keyword2
                  </div>
                  <div class="q-ma-sm">
                    键值： 您要设置的模板项的值
                  </div>
                  <div class="q-ma-sm">
                    尾部描述：remark.DATA
                  </div>
                  <div class="row q-my-md">
                    <q-space />
                    <q-btn unelevated color="primary" label="确定" />
                  </div>
                </q-card>
              </q-dialog>
              <q-card flat style="border:1px solid #26a69a " class="q-mt-sm ">
                <div class="bg-teal-5 q-pl-sm text-white text-subtitle1">
                  快速添加模板
                </div>
                <div class="row q-pa-md">
                  <div class="col-9">
                    <q-input
                      outlined
                      bottom-slots
                      v-model="mbText"
                      label="模板编号"
                      dense
                      class="q-pb-none"
                    >
                    </q-input>
                  </div>
                  <div class="col-3">
                    <q-btn
                      unelevated
                      color="primary"
                      label="快速添加模板"
                      class="full-height full-width"
                    />
                  </div>
                </div>
              </q-card>
              <q-card flat style="border:1px solid #26a69a " class="q-mt-sm ">
                <div class="bg-teal-5 q-pl-sm text-white text-subtitle1">
                  选择已有模板
                </div>
                <div class="row q-pa-md">
                  <div class="col-12">
                    <q-select
                      outlined
                      dense
                      v-model="model"
                      :options="options"
                      label="请选择"
                    />
                  </div>

                  <div class="q-mt-sm">
                    <q-btn
                      unelevated
                      color="green"
                      label="选择模板"
                      @click="a = 1"
                    />
                    <q-btn
                      unelevated
                      color="grey"
                      label="删除模板"
                      class="q-ml-sm"
                    />
                  </div>
                </div>
              </q-card>
              <q-card flat style="border:1px solid #26a69a " class="q-mt-sm ">
                <div class="bg-teal-5 q-pl-sm text-white text-subtitle1">
                  选择已有模板
                </div>
                <div class="row q-pa-md">
                  <div class="col-12">
                    <q-select
                      outlined
                      dense
                      v-model="modelOne"
                      :options="optionsOne"
                    />
                  </div>
                  <div class="q-mt-sm">
                    点击变量后会自动插入选择的文本框的焦点位置，在发送给粉丝时系统会自动替换对应变量值<span
                      class="text-red"
                    >
                      群发消息变量仅支持群发时使用，触发消息变量仅支持触发消息时使用。
                    </span>
                  </div>
                </div>
              </q-card>
              <q-card flat style="border:1px solid #26a69a " class="q-mt-sm ">
                <div class="bg-teal-5 q-pl-sm text-white text-subtitle1">
                  选择已有模板
                </div>
                <div class="q-mt-sm q-pa-md">
                  <div>
                    first.DATA
                  </div>
                  <div>
                    消费金额：keyword1.DATA
                  </div>
                  <div>
                    获得{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}：keyword2.DATA
                  </div>
                  <div>
                    消费门店：keyword3.DATA
                  </div>
                  <div>
                    当前金额：keyword4.DATA
                  </div>
                  <div>
                    当前{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}：keyword5.DATA
                  </div>
                  <div>
                    remark.DATA
                  </div>
                </div>
              </q-card>
            </div>
          </div>
          <div class="row q-my-md">
            <q-space />
            <q-btn outline unelevated color="grey-7" label="取消" />
            <q-btn unelevated color="primary" label="保存" class="q-ml-sm" />
          </div>
        </q-card>
      </q-dialog>
    </div>
    <hl-auto-height class="q-mt-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
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
      </template>
    </hl-auto-height>
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
import AgThirdUse from './AgThirdUse'
export default {
  name: 'ThirdTab',
  components: { AgThirdUse },
  data () {
    return {
      text: '',
      name: '',
      help: false,
      a: 0,
      message: '',
      mbText: '',
      link: '',
      title: '',
      hex: 'blue',
      choose1: '',
      hex2: 'blue',
      end: '',
      key1: 'keyword1',
      key2: 'keyword2',
      choose2: '',
      hex3: 'blue',
      hex1: 'blue',
      model: null,
      options: ['会员消费提醒', '会员消费提醒'],
      modelOne: '选择模板变量类型',
      optionsOne: ['选择模板变量类型', '群发消息变量', '触发消息变量'],
      add: false,
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
          filter: false // 是否过滤
        },
        {
          headerName: '操作',
          field: 'use',
          filter: false,
          cellRendererFramework: 'AgThirdUse',
          width: 100
        }
      ],
      gridOptions: {},
      contacts: [
        {
          name: '申请确认通知',
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
    sizeChangeHandle (val) {

    },
    currentChangeHandle (val) {

    }
  }
}
</script>

<style></style>
