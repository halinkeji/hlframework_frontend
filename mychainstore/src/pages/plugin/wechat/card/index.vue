<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink q-pa-sm full-height bg-grey-2">
        <div class="row fit">
          <div class="col-12 col-md-3 q-px-xs">
            <q-card flat bordered class="bg-grey-3" style="width: 100%; height: 600px">
              <img src="/mobile-header-bg.png" style="width: 100%; height: 60px" />

              <div class="q-pt-lg bg-white">
                <div
                  class="q-pt-md"
                  :style="{
                    backgroundImage:
                      parseInt(cardFormInfo.mc_bg_type) == 1
                        ? `url('${$q.localStorage.getItem('mychainstore_system_local').systemInfo.site_url}/attachment/${cardFormInfo.mc_bg_img_local}')`
                        : '',
                    backgroundColor: parseInt(cardFormInfo.mc_bg_type) != 1 && bg_color ? bg_color : '#63b359',
                  }"
                  style="width: 90%; height: 160px; margin: 0 auto; border-radius: 20px; background-size: cover"
                >
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar class="bg-grey">
                        <q-img :src="`${$q.localStorage.getItem('mychainstore_system_local').attach_url}` + cardFormInfo.mc_logo_url">
                          <template v-if="!cardFormInfo.mc_logo_url">
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
                            </div>
                          </template>

                          <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
                            </div>
                          </template>
                        </q-img>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section class="text-white text-subtitle1">
                      <q-item-label lines="1">{{ cardFormInfo.mc_brand_name }}</q-item-label>
                      <q-item-label lines="1">{{ cardFormInfo.mc_title }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <img
                        src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=274679551,3980539980&fm=26&gp=0.jpg"
                        style="width: 40px; height: 40px"
                      />
                    </q-item-section>
                  </q-item>
                  <div class="row q-pa-md q-mt-md text-white text-subtitle1">
                    <div class="col-11">{{ cardFormInfo.mc_service_phone }}</div>
                    <div class="col-1">
                      <q-icon name="las la-exclamation-circle" size="22px" />
                    </div>
                  </div>
                </div>
                <q-list separator class="q-pt-sm">
                  <q-item class="q-py-sm">
                    <q-item-section class="text-subtitle1">适用门店</q-item-section>
                    <q-item-section side><q-icon name="las la-angle-right" /></q-item-section>
                  </q-item>
                  <q-separator class="q-mx-sm" />
                  <q-item class="q-py-sm">
                    <q-item-section class="text-subtitle1">公众号</q-item-section>
                    <q-item-section side><q-icon name="las la-angle-right" /></q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-list separator class="q-mt-md">
                <q-item class="q-py-sm bg-white" :key="index" v-for="(i, index) in cardFormInfo.mc_cell_data">
                  <q-item-section class="text-subtitle1">{{ i.name }}</q-item-section>
                  <q-item-section class="text-subtitle1">
                    <q-item-label caption> {{ i.tips }}</q-item-label>
                  </q-item-section>
                  <q-item-section side><q-icon name="las la-angle-right" /></q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
          <div class="col-12 col-md-9 q-px-xs">
            <q-scroll-area class="fit full-height">
              <q-form ref="cardFormInfoRef">
                <q-card flat bordered class="bg-white q-px-md q-pb-md">
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <q-icon name="las la-square-full" color="primary" class="q-px-xs flex flex-center"></q-icon>
                    基本信息
                  </div>
                  <q-separator inset class="q-my-sm" />
                  <q-item>
                    <q-item-section>
                      <q-item-label>是否启用卡包</q-item-label>
                      <q-item-label caption> 开启后保存将对应创建卡包,否则只保存卡包信息 </q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-toggle color="primary" v-model="cardFormInfo.mc_status" :false-value="'0'" :true-value="'1'" />
                    </q-item-section>
                  </q-item>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">商户</div>
                    <div class="col-12 col-md-6">
                      <div>
                        <q-img
                          :src="`${$q.localStorage.getItem('mychainstore_system_local').attach_url}` + cardFormInfo.mc_logo_url"
                          style="width: 60px; height: 60px"
                        >
                          <template v-if="!cardFormInfo.mc_logo_url">
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="30px"> </q-icon>
                            </div>
                          </template>
                          <q-btn
                            round
                            size="md"
                            color="red"
                            v-else
                            :ripple="false"
                            flat
                            class="absolute-top-right"
                            icon="delete_forever"
                            @click="delImage"
                          ></q-btn>
                          <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="30px"> </q-icon>
                            </div>
                          </template>
                        </q-img>
                      </div>
                      <div class="text-grey">建议像素为300*300。</div>
                      <div>
                        <q-btn @click="clickImage('mc_logo_url')" unelevated color="primary" label="选择图片" />
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">卡券封面</div>
                    <div class="col-12 col-md-6">
                      <q-option-group v-model="cardFormInfo.mc_bg_type" :options="options" color="primary" inline size="sm" />

                      <div v-if="parseInt(cardFormInfo.mc_bg_type) == 1">
                        <div>
                          <q-img
                            :src="
                              `${$q.localStorage.getItem('mychainstore_system_local').systemInfo.site_url}` +
                              '/attachment/' +
                              cardFormInfo.mc_bg_img_local
                            "
                            style="width: 120px; height: 60px"
                            :ratio="9 / 3"
                          >
                            <template v-if="!cardFormInfo.mc_bg_img_local">
                              <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                                <q-icon name="wallpaper" color="grey" size="30px"> </q-icon>
                              </div>
                            </template>

                            <template v-slot:error>
                              <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                                <q-icon name="wallpaper" color="grey" size="30px"> </q-icon>
                              </div>
                            </template>
                          </q-img>
                        </div>
                        <div class="text-grey">
                          请参照
                          <a
                            style="text-decoration: none"
                            class="text-blue"
                            target="_blank"
                            href="https://mp.weixin.qq.com/cgi-bin/readtemplate?t=cardticket/card_cover_tmpl&type=info&lang=zh_CN"
                            >图片规范</a
                          >
                          上传
                        </div>
                        <div>
                          <q-btn unelevated @click="openImageDialog" color="primary" label="选择图片" />
                        </div>
                      </div>
                      <div v-if="parseInt(cardFormInfo.mc_bg_type) == 2">
                        <q-select
                          dense
                          class="q-mb-sm"
                          outlined
                          emit-value
                          map-options
                          v-model="cardFormInfo.mc_bg_color"
                          :options="$store.state.wechatCard.bg_color"
                          label="颜色"
                        >
                          <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                            <q-icon
                              v-bind="itemProps"
                              v-on="itemEvents"
                              name="brightness_1"
                              size="md"
                              class="q-mt-md"
                              @click="bg_color = opt.name"
                              :style="{
                                color: opt.name,
                              }"
                            />
                          </template>
                          <template v-slot:selected-item="scope">
                            <q-icon
                              class="q-px-md"
                              name="brightness_1"
                              size="sm"
                              :style="{
                                color: scope.opt.name,
                              }"
                            />
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">商铺名称</div>
                    <div class="col-12 col-md-6">
                      <div class="text-grey">
                        <q-input
                          outlined
                          bottom-slots
                          v-model="cardFormInfo.mc_brand_name"
                          maxlength="12"
                          dense
                          counter
                          :disable="cardFormInfo.mc_card_id ? true : false"
                          class="q-pb-none"
                          :rules="[(val) => !!val || '请填写商户名称']"
                        >
                          <template v-slot:hint> 字数上限为12个汉字<span class="text-red">(不可修改)</span> </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">会员卡标题</div>
                    <div class="col-12 col-md-6">
                      <div class="text-grey">
                        <q-input
                          outlined
                          bottom-slots
                          v-model="cardFormInfo.mc_title"
                          maxlength="9"
                          dense
                          counter
                          class="q-pb-none"
                          :rules="[(val) => !!val || '请填写会员卡标题']"
                        >
                          <template v-slot:hint> 建议会员卡标题包含商户名或服务内容，如腾讯会员黄卡尊享卡。字数上限为9个汉字 </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">库存总量</div>
                    <div class="col-12 col-md-6">
                      <div class="text-grey">
                        <q-input
                          outlined
                          bottom-slots
                          v-model="cardFormInfo.mc_quantity"
                          dense
                          :disable="cardFormInfo.mc_card_id ? true : false"
                          counter
                          :rules="[(val) => /^[1-9]\d{0,8}$/.test(val) || '请填写0-100000000之间的数字']"
                          type="number"
                          class="q-pb-none"
                        >
                          <template v-slot:hint> 不支持填写0，上限为100000000 </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <q-icon name="las la-square-full" color="primary" class="q-px-xs flex flex-center"></q-icon>
                    会员卡详情
                  </div>
                  <q-separator inset class="q-my-sm" />
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">特权说明</div>
                    <div class="col-12 col-md-6">
                      <q-input
                        outlined
                        v-model="cardFormInfo.mc_prerogative"
                        dense
                        :placeholder="`注：1、上文设置中，如已经填写“${
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit
                        }优惠”“折扣优惠”的内容，将会自动在用户会员卡详情展示，无需重复填写。2、建议填写其他特权，举例：100${
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit
                        }可兑换精美礼品；会员日可享受折上折优惠等`"
                        type="textarea"
                        :rules="[(val) => (val) => !!val || '请填写特权说明']"
                      >
                      </q-input>
                    </div>
                  </div>
                  <div class="row q-mt-sm text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">
                      使用须知
                      <div class="text-grey">（可选）</div>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input
                        outlined
                        v-model="cardFormInfo.mc_description"
                        dense
                        :placeholder="`注：1、上文设置中，如已经填写“${
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit
                        }优惠”“折扣优惠”的内容，将会自动在用户会员卡详情展示，无需重复填写。2、建议填写其他注意事项，举例：${
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit
                        }不支持兑换现金`"
                        type="textarea"
                        :rules="[(val) => (val) => !!val || '请填写使用须知']"
                      >
                      </q-input>
                    </div>
                  </div>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <q-icon name="las la-square-full" color="primary" class="q-px-xs flex flex-center"></q-icon>
                    商户介绍（选填）
                  </div>
                  <q-separator inset class="q-my-sm" />
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <div class="col-12 col-md-2">商家联系电话</div>
                    <div class="col-12 col-md-6">
                      <q-input
                        outlined
                        bottom-slots
                        maxlength="12"
                        v-model="cardFormInfo.mc_service_phone"
                        dense
                        class="q-pb-none"
                        :rules="[(val) => (val) => !!val || '请填写客服电话']"
                      >
                        <template v-slot:hint> 手机或固话 </template>
                      </q-input>
                    </div>
                  </div>

                  <div class="q-mt-sm q-pl-md">
                    <q-btn unelevated color="primary" label="添加自定义入口" @click="addEntrance" />
                  </div>

                  <div class="q-pl-md text-grey text-subtitle1">可配置图文消息、货架、网页链接，用户可查看详情或领取更多卡券。</div>

                  <div class="q-px-md" v-if="cardFormInfo.mc_cell_data.length > 0">
                    <q-card flat bordered>
                      <q-space />
                      <q-btn flat @click="deleteEntrance" color="primary" label="删除该入口" />
                      <q-card-section>
                        <div v-for="(i, index) in cardFormInfo.mc_cell_data">
                          <div class="row q-mt-sm text-subtitle1 q-pl-md">
                            <div class="col-12 col-md-2">入口名称</div>
                            <div class="col-12 col-md-6">
                              <q-input
                                outlined
                                bottom-slots
                                v-model="i.name"
                                maxlength="5"
                                dense
                                :rules="[(val) => (val) => !!val || '请填写入口名称']"
                                class="q-pb-none"
                              >
                              </q-input>
                            </div>
                          </div>
                          <div class="row q-mt-sm text-subtitle1 q-pl-md">
                            <div class="col-12 col-md-2">引导语</div>
                            <div class="col-12 col-md-6">
                              <q-input
                                outlined
                                bottom-slots
                                v-model="i.tips"
                                maxlength="6"
                                dense
                                :rules="[(val) => (val) => !!val || '请填写引导语']"
                                class="q-pb-none"
                              >
                              </q-input>
                            </div>
                          </div>

                          <div class="row q-mt-sm text-subtitle1 q-pl-md">
                            <div class="col-12 col-md-2">入口跳转链接</div>
                            <div class="col-12 col-md-6">
                              <q-input
                                outlined
                                bottom-slots
                                v-model="i.url"
                                dense
                                :rules="[(val) => /http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(val) || '请填写正确的入口跳转链接']"
                                class="q-pb-none"
                              >
                              </q-input>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <q-icon name="las la-square-full" color="primary" class="q-px-xs flex flex-center"></q-icon>
                    内容设置
                  </div>
                  <q-separator inset class="q-my-sm" />

                  <q-item>
                    <q-item-section>
                      <q-item-label>会员卡中部按钮开关</q-item-label>
                      <q-item-label caption>
                        开启后打开中部按钮显示与配置
                        <span class="text-red">开启后修改只能修改对应参数，不可关闭</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-toggle
                        color="primary"
                        v-model="cardFormInfo.mc_center_data.status"
                        :disable="cardFormInfo.mc_card_id ? true : false"
                        :false-value="'0'"
                        :true-value="'1'"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>会员卡中部的跳转按钮名称</q-item-label>
                      <q-item-label caption> 建议用作使用用途 </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        outlined
                        bottom-slots
                        v-model="cardFormInfo.mc_center_data.title"
                        dense
                        :disable="parseInt(cardFormInfo.mc_center_data.status) == 1 ? false : true"
                        class="q-pb-none"
                      >
                      </q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>会员卡中部按钮解释文字</q-item-label>
                      <q-item-label caption> 例:到店后使用 </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        outlined
                        bottom-slots
                        v-model="cardFormInfo.mc_center_data.sub_title"
                        dense
                        :disable="parseInt(cardFormInfo.mc_center_data.status) == 1 ? false : true"
                        class="q-pb-none"
                      >
                      </q-input>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>会员卡中部按钮对应跳转的url</q-item-label>
                      <q-item-label caption> 自定义url </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        outlined
                        bottom-slots
                        v-model="cardFormInfo.mc_center_data.url"
                        dense
                        :disable="parseInt(cardFormInfo.mc_center_data.status) == 1 ? false : true"
                        class="q-pb-none"
                        :rules="[(val) => /http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(val) || '请填写正确的自定义url']"
                      >
                      </q-input>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>卡包激活时必填项</q-item-label>
                      <q-item-label caption> 微信卡包激活时必填类型 </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <div class="row">
                        <div class="col-auto" v-for="(item, key) in $store.state.wechatCard.field_list">
                          <q-checkbox v-model="cardFormInfo.mc_common_field_id_list" :label="item.label" :val="item.value" />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                  <div class="row q-mt-lg text-subtitle1 q-pl-md items-center">
                    <q-icon name="las la-square-full" color="primary" class="q-px-xs flex flex-center"></q-icon>
                    链接设置
                  </div>
                  <q-separator inset class="q-my-sm" />
                  <div class="text-red q-px-md">(注意:因微信卡包设置问题，以下配置只能同时展示三个，如全部开启则随机选取三个配置进行展示)</div>
                  <q-item>
                    <q-item-section>
                      <q-item-label
                        >是否开启{{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit
                        }}<span class="text-red">(不可修改)</span></q-item-label
                      >
                      <q-item-label caption>
                        微信卡包内微信会员卡{{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit }}与系统{{
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit
                        }}同步，开启跳转链接
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-toggle
                        color="primary"
                        v-model="cardFormInfo.mc_supply_bonus"
                        :disable="cardFormInfo.mc_card_id ? true : false"
                        :false-value="'0'"
                        :true-value="'1'"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label
                        >是否开启{{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                        <span class="text-red">(不可修改)</span>
                      </q-item-label>
                      <q-item-label caption>
                        微信卡包内微信会员卡{{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}与系统{{
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit
                        }}同步，开启跳转链接 会员卡商户无需申请，可直接通过API接口，使用“{{
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit
                        }}展示”功能，将会员{{
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit
                        }}显示在微信会员卡首页。具有预付卡资质的商家可申请“{{
                          $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit
                        }}”功能，申请成功后，可通过API接口设置此入口，帮助会员通过微信支付为会员卡充值。
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-toggle
                        color="primary"
                        v-model="cardFormInfo.mc_supply_balance"
                        :false-value="'0'"
                        :true-value="'1'"
                        :disable="cardFormInfo.mc_card_id ? true : false"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>优惠券查看链接</q-item-label>
                      <q-item-label caption> 微信卡包内微信会员卡优惠券查看链接 </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-input outlined bottom-slots v-model="cardFormInfo.mc_coupon_link" dense class="q-pb-none"> </q-input>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>会员等级查看链接</q-item-label>
                      <q-item-label caption> 微信卡包内微信会员卡等级查看链接 </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-input outlined bottom-slots v-model="cardFormInfo.mc_level_link" dense class="q-pb-none"> </q-input>
                    </q-item-section>
                  </q-item>
                </q-card>
              </q-form>
            </q-scroll-area>
          </div>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn unelevated color="primary" @click="saveMemberCardInfo" icon="check" class="q-px-xl" label="保存" />
        <q-btn unelevated color="red" @click="deleteCardInfo" icon="delete_forever" class="q-px-xl" label="删除" />
      </div>
    </div>

    <q-uploader
      ref="qUploadedImgRef"
      color="white"
      text-color="black"
      accept=".jpg, image/*"
      flat
      :field-name="'file'"
      :multiple="false"
      :factory="factoryFn"
      hide-upload-btn
      class="fit uploader-height"
      v-show="false"
      @added="uploadBgImage"
    >
    </q-uploader>

    <upload-img v-if="uploadImgStatus" @imageData="getImageData" :multiple="multiple" @closeUpload="closeUpload"></upload-img>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'wechatMemberCard',
  data () {
    return {
      cardFormData: {
        mc_center_data: {
          title: '',
          sub_title: '',
          url: '',
          status: '0'
        },
        mc_status: '0',
        mc_bg_type: '1',
        mc_bg_color: '',
        mc_bg_img_wx: '',
        mc_bg_img_local: '',
        mc_brand_name: '',
        mc_title: '',
        mc_quantity: '',
        mc_service_phone: '',
        mc_logo_url: '',
        mc_prerogative: '',
        mc_description: '',
        // mc_service_statement: "",
        mc_cell_data: [],
        mc_supply_bonus: '0',
        mc_supply_balance: '0',
        mc_common_field_id_list: [],
        mc_level_link: '',
        mc_coupon_link: ''
      },
      cardFormInfo: {},
      multiple: false,
      options: [
        {
          label: '图片',
          value: '1'
        },
        {
          label: '颜色',
          value: '2'
        }
      ],
      bg_color: '',
      uploadImgStatus: false,
      imgField: ''
    }
  },
  mounted () {
    this.getCardInfo()
  },
  created () {
    this.cardFormInfo = this.cardFormData
    const lib_id = LocalStorage.getItem('mychainstore_account_info').lib_id

    const account_info = this.$q.localStorage.getItem('mychainstore_account_info')
    const system_local = this.$q.localStorage.getItem('mychainstore_system_local')

    if (account_info && system_local) {
      this.mc_member_link = system_local.systemInfo.site_url + '/m/mychainstore?id=' + lib_id
      this.cardFormInfo.mc_center_data.url = this.mc_member_link
      this.cardFormInfo.mc_level_link = system_local.systemInfo.site_url + '/m/mychainstore/level?id=' + lib_id
      this.cardFormInfo.mc_coupon_link = system_local.systemInfo.site_url + '/m/mychainstore/hlcoupon?id=' + lib_id
    }
  },
  computed: {},
  methods: {
    getCardInfo () {
      this.$store.dispatch('wechatCard/getData').then((res) => {
        if (res.code == 200 && res.data) {
          this.cardFormInfo = res.data

          this.cardFormInfo.mc_cell_data = this.cardFormInfo.mc_cell_data ? JSON.parse(this.cardFormInfo.mc_cell_data) : []

          this.cardFormInfo.mc_business_service = this.cardFormInfo.mc_business_service ? this.cardFormInfo.mc_business_service.split(',') : []

          this.cardFormInfo.mc_common_field_id_list = this.cardFormInfo.mc_common_field_id_list
            ? this.cardFormInfo.mc_common_field_id_list.split(',')
            : []

          this.cardFormInfo.mc_center_data = this.cardFormInfo.mc_center_data
            ? JSON.parse(this.cardFormInfo.mc_center_data)
            : {
                title: '',
                sub_title: '',
                url: this.mc_member_link,
                status: '1'
              }
        }
      })
    },
    saveMemberCardInfo () {
      const item = {
        ...this.cardFormInfo
      }

      this.$refs.cardFormInfoRef.validate().then((success) => {
        if (success) {
          this.$store.dispatch('wechatCard/setData', item).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: res.message,
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getCardInfo()
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
        }
      })
    },
    deleteCardInfo () {
      const that = this
      this.$q
        .dialog({
          title: '确认删除?',
          message: '删除后所有会员卡包数据将混乱，请谨慎操作',
          cancel: true,
          ok: {
            color: 'red'
          },
          persistent: true
        })
        .onOk(() => {
          that.$store
            .dispatch('wechatCard/deleteCardData', {
              cardId: that.cardFormInfo.mc_card_id
            })
            .then((res) => {
              if (res.code == 200) {
                that.$q.notify({
                  message: '成功',
                  caption: '删除成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                that.cardFormInfo = that.cardFormData
              } else {
                that.$q.notify({
                  message: '失败',
                  caption: '删除失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },
    addEntrance () {
      if (this.cardFormInfo && this.cardFormInfo.mc_cell_data && this.cardFormInfo.mc_cell_data.length < 1) {
        this.cardFormInfo.mc_cell_data.push({
          name: '入口名称',
          tips: '入口右侧提示语',
          url: ''
        })
      }
    },
    deleteEntrance () {
      this.cardFormInfo.mc_cell_data = []
    },
    getImageData (v) {
      this.uploadImgStatus = false
      const that = this
      if (v.length > 0) {
        this.cardFormInfo[this.imgField] = v[0].path
      }
    },
    closeUpload (v) {
      this.uploadImgStatus = false
    },
    clickImage (val) {
      this.imgField = val
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },

    openImageDialog () {
      this.$refs.qUploadedImgRef.pickFiles()
    },

    uploadBgImage () {
      this.$refs.qUploadedImgRef.upload()
    },

    factoryFn (file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('driver', 'local')
      this.$store
        .dispatch('upload/image', formData)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '上传图片成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })

            setTimeout(() => {
              this.cardFormInfo.mc_bg_img_local = res.data.path
              this.$refs.qUploadedImgRef.reset()
            }, 1000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: '上传图片失败，上传列表清空，请重新上传',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset()
            }, 1000)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
          setTimeout(() => {
            this.$refs.qUploadedImgRef.reset()
          }, 1000)
        })
    }
  }
}
</script>

<style scoped>
.my-picker {
  max-width: 200px;
}
</style>
