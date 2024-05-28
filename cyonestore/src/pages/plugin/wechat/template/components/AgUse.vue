<template>
  <div>
    <div class="q-gutter-sm" v-if="this.params.data.state != 2">
      <q-btn unelevated color="red" label="开始发送" @click="start = true" />
      <q-btn unelevated color="primary" label="重置发送" />
      <q-btn unelevated color="red" label="只重置发送失败" />
      <q-btn unelevated color="primary" label="编辑任务" @click="medium = true" />
      <q-btn unelevated color="red" label="删除任务" />
      <q-btn unelevated color="primary" label="查看发送日志" @click="see = true" />
      <!-- 开始发送弹窗 -->
      <q-dialog v-model="start" persistent>
        <q-card style="width: 800px; max-width: 80vw;" class="q-px-md q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">开始发送</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup size="12px" />
          </q-toolbar>
          <div class="row q-mt-sm q-col-gutter-md">
            <div class="col-md-6 col-12 q-pt-none">
              <div class="row items-center">
                <div class="col-2">
                  任务名称
                </div>
                <div class="col-10">
                  <q-input standout v-model="nameText" dense disable class="q-pb-none"> </q-input>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12 q-pt-none">
              <div class="items-center row">
                <span>发送状态</span>
                <q-chip square color="orange" text-color="white" class="q-ml-md">
                  准备开始
                </q-chip>
                <!-- <q-chip square color="orange" text-color="white" class="q-ml-md">
                  已完成
                </q-chip> -->
              </div>
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col">进程数：<span class="text-h5 text-primary q-ml-sm ">0</span></div>
            <div class="col">发送总条数：<span class="text-h5 text-primary q-ml-sm ">0</span></div>
            <div class="col">未发送总条数：<span class="text-h5 text-primary q-ml-sm ">0</span></div>
            <div class="col">发送成功条数：<span class="text-h5 text-green q-ml-sm ">0</span></div>
            <div class="col">发送失败条数：<span class="text-h5 text-red q-ml-sm ">0</span></div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-1">
              发送进度
            </div>
            <div class="col-11">
              <q-linear-progress size="20px" :value="progress1" rounded color="primary">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="primary" :label="progressLabel1" />
                </div>
              </q-linear-progress>
            </div>
          </div>
          <div class="row q-my-lg q-col-gutter-md">
            <div class="col">
              <q-btn unelevated color="green" label="开始" class="full-width" />
            </div>
            <div class="col">
              <q-btn unelevated color="red" label="暂停" class="full-width" />
            </div>
            <div class="col">
              <q-btn unelevated color="amber" label="定时" class="full-width" @click="time = true" />
            </div>
            <q-dialog v-model="time">
              <q-card style="width: 400px; max-width: 80vw;" class="q-px-md q-py-sm">
                <div class="text-center q-mt-md">
                  多少分钟后发送
                </div>
                <div class="q-mt-sm">
                  <q-input outlined bottom-slots v-model="sjText" dense> </q-input>
                </div>
                <div class="row text-center">
                  <div class="col q-gutter-md">
                    <q-btn unelevated color="primary" label="确定" class="q-px-lg" v-close-popup />
                    <q-btn unelevated color="primary" label="取消" class="q-px-lg" v-close-popup />
                  </div>
                </div>
              </q-card>
            </q-dialog>
            <div class="col">
              <q-btn unelevated color="primary" label="返回菜单" class="full-width" />
            </div>
          </div>
        </q-card>
      </q-dialog>
      <!-- 编辑任务弹窗 -->
      <q-dialog v-model="medium" persistent>
        <q-card style="width: 1200px; max-width: 80vw;" class="q-px-md q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">新增群发任务</q-toolbar-title>
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
                <div class="col-2">任务名称<span class="text-red-8 q-pl-xs">*</span></div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="nameText" dense class="q-pb-none" label="任务名称，例：优惠券群发通知" :rules="[(val) => !!val || '任务名称是必填项']"> </q-input>
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
              <q-option-group v-model="group" :options="options" color="primary" inline class="q-ml-sm" />
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
                <div class="col-2">选择模板<span class="text-red-8 q-pl-xs">*</span></div>
                <div class="col-10">
                  <q-select outlined dense v-model="modelOne" :options="optionsOne" class="q-pb-none" :rules="[(val) => !!val || '模板是必填项']" label="点击这里选择任务" />
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="bzText" dense type="textarea"> </q-input>
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
                  <q-option-group v-model="groupOne" :options="optionsTwo" color="primary" inline class="q-ml-sm" />
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupOne == '1'">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="wzText" dense type="textarea"> </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupOne == '2'">
                <div class="col-2">
                  语音ID
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="mtText" class="q-pb-none" dense>
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
                <div class="col-2">选择模板<span class="text-red-8 q-pl-xs">*</span></div>
                <div class="col-10">
                  <q-select outlined dense v-model="modelT" :options="optionsT" class="q-pb-none" :rules="[(val) => !!val || '模板是必填项']" label="点击这里选择任务" />
                </div>
              </div>
              <div class="row items-center">
                <div class="col-2.5">
                  客服消息类型
                </div>
                <div class="col-9.5">
                  <q-option-group v-model="groupF" :options="optionsF" color="primary" inline class="q-ml-sm" />
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupF == '1'">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="wzText" dense type="textarea"> </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupF == '2'">
                <div class="col-2">
                  语音ID
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="yyText" class="q-pb-none" dense>
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
              <q-option-group v-model="groupState" :options="optionsState" color="primary" inline class="q-ml-sm" />
            </div>
          </div>
          <div class="row items-center q-mt-md" v-if="groupState == '1'">
            <div class="col-1">
              请输入文字内容
            </div>
            <div class="col-11">
              <q-input outlined bottom-slots v-model="box" dense type="textarea"> </q-input>
            </div>
          </div>
          <div class="row items-center q-mt-md" v-if="groupState == '2'">
            <div class="col-2">
              <q-btn unelevated color="primary" class="full-width full-height" label="点击选择会员" @click="choose = true" />

              <q-dialog v-model="choose" persistent>
                <q-card style="width:1000px; max-width: 80vw;" class="q-px-md q-py-sm">
                  <q-toolbar class="q-px-none">
                    <q-toolbar-title class="text-subtitle1">选择微信公众号端管理员</q-toolbar-title>
                    <q-btn flat round dense icon="close" v-close-popup size="12px" />
                  </q-toolbar>
                  <div class="row q-col-gutter-sm">
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="code" dense label="请输入卡号" class="q-pb-none"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="real" class="q-pb-none" dense label="请输入会员真实姓名"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="nctext" class="q-pb-none" dense label="请输入会员昵称"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots class="q-pb-none" v-model="number" dense label="请输入手机号"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="gzh" class="q-pb-none" dense label="请输入公众号openid"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots class="q-pb-none" v-model="xcx" dense label="请输入小程序openid"> </q-input>
                    </div>
                  </div>
                  <div class="q-mt-sm">
                    <q-btn unelevated color="primary" label="查询" class="q-px-lg" />
                    <q-btn unelevated color="amber" label="重置" class="q-ml-sm q-px-lg" />
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
                    :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
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
              <q-select outlined dense v-model="modelFan" :options="optionsFan" label="请选择粉丝标签" />
            </div>
          </div>
          <div class="row q-mt-md">
            <q-space />
            <q-btn outline unelevated color="grey-7" label="取消" />
            <q-btn unelevated color="blue-6" label="保存" class="q-ml-sm" />
          </div>
        </q-card>
      </q-dialog>
      <!-- 查看发送日志 -->
      <q-dialog v-model="see" persistent>
        <q-card style="width: 800px; max-width: 80vw;" class="q-px-md q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">发送日志</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup size="12px" />
          </q-toolbar>
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-select outlined dense v-model="modelCho" :options="optionsCho" label="类型选择" class="q-pb-none" />
            </div>
            <div class="col-4">
              <q-input outlined bottom-slots v-model="openid" dense class="q-pb-none" label="请输入openid"> </q-input>
            </div>
            <div class="col-4">
              <q-btn unelevated color="primary" label="查询" class="full-height" />
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
    <div class="q-gutter-sm" v-if="this.params.data.state == 2">
      <q-btn unelevated color="primary" label="生成发送列表" />
      <q-btn unelevated color="red" label="开始发送" @click="start = true" />
      <q-btn unelevated color="primary" label="重置发送" />
      <q-btn unelevated color="red" label="只重置发送失败" />
      <q-btn unelevated color="primary" label="编辑任务" @click="medium = true" />
      <q-btn unelevated color="red" label="删除任务" />
      <q-btn unelevated color="primary" label="查看发送日志" @click="see = true" />
      <!-- 开始发送弹窗 -->
      <q-dialog v-model="start" persistent>
        <q-card style="width: 800px; max-width: 80vw;" class="q-px-md q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">开始发送</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup size="12px" />
          </q-toolbar>
          <div class="row q-mt-sm q-col-gutter-md">
            <div class="col-md-6 col-12 q-pt-none">
              <div class="row items-center">
                <div class="col-2">
                  任务名称
                </div>
                <div class="col-10">
                  <q-input standout v-model="nameText" dense disable class="q-pb-none"> </q-input>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12 q-pt-none">
              <div class="items-center row">
                <span>发送状态</span>
                <q-chip square color="orange" text-color="white" class="q-ml-md">
                  准备开始
                </q-chip>
                <!-- <q-chip square color="orange" text-color="white" class="q-ml-md">
                  已完成
                </q-chip> -->
              </div>
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col">进程数：<span class="text-h5 text-primary q-ml-sm ">0</span></div>
            <div class="col">发送总条数：<span class="text-h5 text-primary q-ml-sm ">0</span></div>
            <div class="col">未发送总条数：<span class="text-h5 text-primary q-ml-sm ">0</span></div>
            <div class="col">发送成功条数：<span class="text-h5 text-green q-ml-sm ">0</span></div>
            <div class="col">发送失败条数：<span class="text-h5 text-red q-ml-sm ">0</span></div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-1">
              发送进度
            </div>
            <div class="col-11">
              <q-linear-progress size="20px" :value="progress1" rounded color="primary">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="primary" :label="progressLabel1" />
                </div>
              </q-linear-progress>
            </div>
          </div>
          <div class="row q-my-lg q-col-gutter-md">
            <div class="col">
              <q-btn unelevated color="green" label="开始" class="full-width" />
            </div>
            <div class="col">
              <q-btn unelevated color="red" label="暂停" class="full-width" />
            </div>
            <div class="col">
              <q-btn unelevated color="amber" label="定时" class="full-width" @click="time = true" />
            </div>
            <q-dialog v-model="time">
              <q-card style="width: 400px; max-width: 80vw;" class="q-px-md q-py-sm">
                <div class="text-center q-mt-md">
                  多少分钟后发送
                </div>
                <div class="q-mt-sm">
                  <q-input outlined bottom-slots v-model="sjText" dense> </q-input>
                </div>
                <div class="row text-center">
                  <div class="col q-gutter-md">
                    <q-btn unelevated color="primary" label="确定" class="q-px-lg" v-close-popup />
                    <q-btn unelevated color="primary" label="取消" class="q-px-lg" v-close-popup />
                  </div>
                </div>
              </q-card>
            </q-dialog>
            <div class="col">
              <q-btn unelevated color="primary" label="返回菜单" class="full-width" />
            </div>
          </div>
        </q-card>
      </q-dialog>
      <!-- 编辑任务弹窗 -->
      <q-dialog v-model="medium" persistent>
        <q-card style="width: 1200px; max-width: 80vw;" class="q-px-md q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title class="text-subtitle1">新增群发任务</q-toolbar-title>
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
                <div class="col-2">任务名称<span class="text-red-8 q-pl-xs">*</span></div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="nameText" dense class="q-pb-none" label="任务名称，例：优惠券群发通知" :rules="[(val) => !!val || '任务名称是必填项']"> </q-input>
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
              <q-option-group v-model="group" :options="options" color="primary" inline class="q-ml-sm" />
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
                <div class="col-2">选择模板<span class="text-red-8 q-pl-xs">*</span></div>
                <div class="col-10">
                  <q-select outlined dense v-model="modelOne" :options="optionsOne" class="q-pb-none" :rules="[(val) => !!val || '模板是必填项']" label="点击这里选择任务" />
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="bzText" dense type="textarea"> </q-input>
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
                  <q-option-group v-model="groupOne" :options="optionsTwo" color="primary" inline class="q-ml-sm" />
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupOne == '1'">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="wzText" dense type="textarea"> </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupOne == '2'">
                <div class="col-2">
                  语音ID
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="mtText" class="q-pb-none" dense>
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
                <div class="col-2">选择模板<span class="text-red-8 q-pl-xs">*</span></div>
                <div class="col-10">
                  <q-select outlined dense v-model="modelT" :options="optionsT" class="q-pb-none" :rules="[(val) => !!val || '模板是必填项']" label="点击这里选择任务" />
                </div>
              </div>
              <div class="row items-center">
                <div class="col-2.5">
                  客服消息类型
                </div>
                <div class="col-9.5">
                  <q-option-group v-model="groupF" :options="optionsF" color="primary" inline class="q-ml-sm" />
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupF == '1'">
                <div class="col-2">
                  请输入文字内容
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="wzText" dense type="textarea"> </q-input>
                </div>
              </div>
              <div class="row items-center q-mt-lg" v-if="groupF == '2'">
                <div class="col-2">
                  语音ID
                </div>
                <div class="col-10">
                  <q-input outlined bottom-slots v-model="yyText" class="q-pb-none" dense>
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
              <q-option-group v-model="groupState" :options="optionsState" color="primary" inline class="q-ml-sm" />
            </div>
          </div>
          <div class="row items-center q-mt-md" v-if="groupState == '1'">
            <div class="col-1">
              请输入文字内容
            </div>
            <div class="col-11">
              <q-input outlined bottom-slots v-model="box" dense type="textarea"> </q-input>
            </div>
          </div>
          <div class="row items-center q-mt-md" v-if="groupState == '2'">
            <div class="col-2">
              <q-btn unelevated color="primary" class="full-width full-height" label="点击选择会员" @click="choose = true" />

              <q-dialog v-model="choose" persistent>
                <q-card style="width:1000px; max-width: 80vw;" class="q-px-md q-py-sm">
                  <q-toolbar class="q-px-none">
                    <q-toolbar-title class="text-subtitle1">选择微信公众号端管理员</q-toolbar-title>
                    <q-btn flat round dense icon="close" v-close-popup size="12px" />
                  </q-toolbar>
                  <div class="row q-col-gutter-sm">
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="code" dense label="请输入卡号" class="q-pb-none"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="real" class="q-pb-none" dense label="请输入会员真实姓名"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="nctext" class="q-pb-none" dense label="请输入会员昵称"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots class="q-pb-none" v-model="number" dense label="请输入手机号"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots v-model="gzh" class="q-pb-none" dense label="请输入公众号openid"> </q-input>
                    </div>
                    <div class="col-md-2 col-6">
                      <q-input outlined bottom-slots class="q-pb-none" v-model="xcx" dense label="请输入小程序openid"> </q-input>
                    </div>
                  </div>
                  <div class="q-mt-sm">
                    <q-btn unelevated color="primary" label="查询" class="q-px-lg" />
                    <q-btn unelevated color="amber" label="重置" class="q-ml-sm q-px-lg" />
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
              <q-select outlined dense v-model="modelFan" :options="optionsFan" label="请选择粉丝标签" />
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
  </div>
</template>

<script>
export default {
  name: 'AgUse',
  data () {
    return {
      start: false,
      nameText: '演示',
      progress1: 0.3,
      time: false,
      sjText: '',
      name: '',
      medium: false,
      see: false,
      bzText: '',
      openid: '',
      wzText: '',
      nrText: '',
      mtText: '',
      huiyuan: '',
      box: '',
      yyText: '',
      //   defaultColDef: {},
      //   page: {
      //     pageIndex: 1,
      //     pageSize: 50,
      //     pageTotal: 0
      //   },
      //   columnDefs: [
      //     {
      //       headerName: "openid", //列标题
      //       field: "name", //列与数据源对应的字段
      //       filter: false, //是否过滤
      //     },
      //     {
      //       headerName: "用户昵称",
      //       field: "send",
      //       filter: false,
      //     },
      //     {
      //       headerName: "状态",
      //       field: "nosend",
      //     },
      //     {
      //       headerName: "日志记录",
      //       field: "success",
      //       filter: false,
      //     },
      //   ],
      //   gridOptions: {},
      //   contacts: [
      //     {
      //       name: "o-q6Yjm_3c16OxXc5mMGDWrE5o-q6Yj",
      //       send: "鸡蛋碰石头",
      //       nosend: "0",
      //       success: "",
      //     },
      //   ],
      model: '1',
      options: ['1', '2', '3'],
      modelOne: null,
      optionsOne: ['申请确认通知', '会员消费提醒', this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit + '兑换成功通知'],
      modelT: null,
      optionsT: ['申请确认通知', '会员消费提醒', this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit + '兑换成功通知'],
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
      modelCho: null,
      optionsCho: ['全部', '未发送', '发送成功', '发送失败'],
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
  computed: {
    progressLabel1 () {
      return (this.progress1 * 100).toFixed(2) + '%'
    }
  },
  methods: {
    adaptiveTableOne (params) {
      params.api.sizeColumnsToFit()
    },
    sizeChangeHandleOne (val) {},
    currentChangeHandleOne (val) {}
  }
}
</script>

<style></style>
