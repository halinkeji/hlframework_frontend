<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog"  full-height persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
      class="fit column no-wrap"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">{{ roomGroupData.id > 0 ? '修改' : '新增' }}计费模式</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="full-height">
        <q-scroll-area class="fit">
          <q-form ref="roomGroupDataRef" class="row q-col-gutter-sm">
            <div class="col-12">
              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label>状态</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="positive" v-model="roomGroupData.qcr_status" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
            </div>

            <div class="col-6">
              <q-input outlined dense v-model="roomGroupData.qcr_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
            </div>

            <div class="col-6 row q-gutter-xs">
              <div class="col">
                <q-select borderless outlined bottom-slots v-model="roomGroupData.qcr_begin_limit_minutes" :options="fiftyNineMinutes" dense>
                  <template v-slot:before>
                    <span class="text-subtitle2 text-dark"> 开单后： </span>
                  </template>
                  <template v-slot:after>
                    <span class="text-subtitle2 text-dark">分钟之内，按</span>
                  </template>
                </q-select>
              </div>

              <div class="col">
                <q-input
                  v-model="roomGroupData.qcr_begin_limit_amount"
                  standout
                  borderless
                  dense
                  outlined
                  :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                >
                  <template v-slot:after>
                    <span class="text-subtitle2 text-dark">元</span>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="col-12">
              <q-item>
                <q-item-section avatar>
                  <q-item-label>选择计费模式</q-item-label>
                </q-item-section>

                <q-item-section class="row">
                  <q-option-group
                    v-model="roomGroupData.qcr_type"
                    :options="[
                      {
                        label: '按小时计费',
                        value: '1',
                      },
                      {
                        label: '按包段计费',
                        value: '2',
                      },
                      {
                        label: '按包场计费',
                        value: '3',
                      },
                      {
                        label: '分时段计费',
                        value: '4',
                      },
                    ]"
                    color="primary"
                    inline
                  />
                </q-item-section>
              </q-item>

              <q-tab-panels v-model="roomGroupData.qcr_type" animated>
                <q-tab-panel name="1" class="row">
                  <div class="col-6">
                    <q-input
                      v-model="oneHourConfig.everyHourAmount"
                      standout
                      dense
                      outlined
                      :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                    >
                      <template v-slot:prepend>
                        <span class="text-subtitle2 text-dark">每小时</span>
                      </template>

                      <template v-slot:append>
                        <span class="text-subtitle2 text-dark">元</span>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12 text-primary text-subtitle2 text-weight-bold">
                    超出1小时的计费方式
                    <q-separator />
                  </div>
                  <div class="col-12">
                    <q-radio v-model="oneHourConfig.exceedOneHourType" val="1" label="消费超出1小时，按实际分钟数计费。" />
                  </div>

                  <div class="col-12">
                    <q-radio v-model="oneHourConfig.exceedOneHourType" val="2" label="消费超出1小时，按超出分钟数区间计费。" />
                  </div>

                  <q-card class="bg-grey-2" flat v-if="parseInt(oneHourConfig.exceedOneHourType) == 2">
                    <q-card-section class="row items-center">
                      <div class="col-auto">
                        <q-select borderless outlined v-model="oneHourConfig.freeMinutes" :options="fiftyNineMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟之内免费； 超过<span class="text-subtitle2 text-weight-bold text-primary"> {{ oneHourConfig.freeMinutes }} </span>分钟至
                      </div>
                      <div class="col-auto">
                        <q-select borderless outlined v-model="oneHourConfig.exceedMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">分钟，按</div>
                      <div class="col-auto q-px-sm">
                        <q-select borderless outlined v-model="oneHourConfig.cycleMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟计费；超过
                        <span class="text-subtitle2 text-weight-bold text-primary"> {{ oneHourConfig.exceedMinutes }} </span> 分钟，按<span
                          class="text-subtitle2 text-weight-bold text-primary"
                        >
                          {{ oneHourConfig.cycleMinutes }} </span
                        >分钟计费；
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="2" class="row">
                  <div class="col-8 row q-gutter-xs">
                    <div class="col">
                      <q-select borderless outlined bottom-slots v-model="qcrTimePeriodConfig.setHourAmount" :options="fiftyNineMinutes" dense>
                        <template v-slot:after>
                          <span class="text-subtitle2 text-dark">小时</span>
                        </template>
                        <template v-slot:before>
                          <span class="text-subtitle2 text-dark">每</span>
                        </template>
                      </q-select>
                    </div>

                    <div class="col">
                      <q-input
                        v-model="qcrTimePeriodConfig.everyHourAmount"
                        standout
                        borderless
                        dense
                        outlined
                        :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                      >
                        <template v-slot:after>
                          <span class="text-subtitle2 text-dark">元</span>
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <div class="col-12 text-primary text-subtitle2 text-weight-bold">
                    超出{{ qcrTimePeriodConfig.setHourAmount }}小时的计费方式
                    <q-separator />
                  </div>

                  <div class="col-12">
                    <q-radio v-model="qcrTimePeriodConfig.exceedOneHourType" val="1">
                      消费超出{{ qcrTimePeriodConfig.setHourAmount }}小时，按实际分钟数计费。
                    </q-radio>
                  </div>

                  <div class="col-12 row ">
                    <q-radio v-model="qcrTimePeriodConfig.exceedOneHourType" val="2"></q-radio>

                     <div class="row items-center">
                        <div class="col-auto q-pb-md q-px-sm">消费超出{{ qcrTimePeriodConfig.setHourAmount }}小时，按每</div>

                        <div class="col-auto">
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="qcrTimePeriodConfig.exceedEveryHourAmount"
                            :options="fiftyNineMinutes"
                            dense
                          />
                        </div>

                        <div class="col-auto q-pb-md q-px-sm">分钟</div>

                        <div class="col-auto">
                          <q-input
                            v-model="qcrTimePeriodConfig.exceedHourAmount"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                            <template v-slot:append>
                              <span class="text-subtitle2 text-dark">元</span>
                            </template>
                          </q-input>
                        </div>
                      </div>
                  </div>

                  <div class="col-12 row">
                    <q-radio v-model="qcrTimePeriodConfig.exceedOneHourType" val="3"></q-radio>

                     <div class="row items-center">
                        <div class="col-auto q-pb-md q-px-sm">消费超出{{ qcrTimePeriodConfig.setHourAmount }}小时，按每小时</div>

                        <div class="col-auto">
                          <q-input
                            v-model="qcrTimePeriodConfig.exceedEveryHourMoney"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                          </q-input>
                        </div>

                        <div class="col-auto q-pb-md q-px-sm">元计费，超出的分钟数按区间计费。</div>
                      </div>
                  </div>

                  <q-card class="bg-grey-2" flat v-if="parseInt(qcrTimePeriodConfig.exceedOneHourType) == 3">
                    <q-card-section class="row items-center">
                      <div class="col-auto">
                        <q-select borderless outlined v-model="qcrTimePeriodConfig.freeMinutes" :options="fiftyNineMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟之内免费； 超过<span class="text-subtitle2 text-weight-bold text-primary"> {{ qcrTimePeriodConfig.freeMinutes }} </span
                        >分钟至
                      </div>
                      <div class="col-auto">
                        <q-select borderless outlined v-model="qcrTimePeriodConfig.exceedMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">分钟，按</div>
                      <div class="col-auto q-px-sm">
                        <q-select borderless outlined v-model="qcrTimePeriodConfig.cycleMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟计费；超过
                        <span class="text-subtitle2 text-weight-bold text-primary"> {{ qcrTimePeriodConfig.exceedMinutes }} </span> 分钟，按<span
                          class="text-subtitle2 text-weight-bold text-primary"
                        >
                          {{ qcrTimePeriodConfig.cycleMinutes }} </span
                        >分钟计费；
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="3" class="row">
                  <div class="col-12">
                    <q-list>
                      <q-item v-for="(i, k) in fullSessionConfig.sessionList" :key="k">
                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.startTime"
                            :options="twentyFourMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            :disable="k > 0 ? true : false"
                            @input="inputSessionListStart(k)"
                          >
                            <template v-slot:before>
                              <span class="text-subtitle2 text-dark">场次{{ k + 1 }}：</span>
                            </template>
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">至</span>
                            </template>
                          </q-select>
                        </q-item-section>

                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.endtime"
                            :options="fortyEightMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            @input="changeFullSessionList(k)"
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-input
                            v-model="i.useAmount"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                            <template v-slot:append>
                              <span class="text-subtitle2 text-dark">元</span>
                            </template>
                          </q-input>
                        </q-item-section>

                        <q-item-section top>
                          <q-checkbox v-model="i.isMaintain" :true-value="1" :false-value="0"> 清洁场次 </q-checkbox>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>

                  <div class="col-12 text-primary text-subtitle2 text-weight-bold">
                    跨场的计费方式
                    <q-separator />
                  </div>

                  <div class="col-12 q-mt-sm">
                    <q-radio v-model="fullSessionConfig.exceedOneHourType" val="1">
                      <div class="full-width row items-center">
                        <div class="col-auto">
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="fullSessionConfig.oneFreeMinutes"
                            :options="sixtyMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                          />
                        </div>

                        <div class="col-auto q-pb-md q-px-sm">分钟之内免费； 超过{{ fullSessionConfig.oneFreeMinutes }}分钟加收下一场包场费用；</div>
                      </div>
                    </q-radio>
                  </div>

                  <div class="col-12 row">
                    <q-radio v-model="fullSessionConfig.exceedOneHourType" val="2"></q-radio>

                    <div class="row items-center">
                        <div class="col-auto q-pb-md q-px-sm">消费超出1个场次，按实际分钟数计费。每小时</div>

                        <div class="col-auto">
                          <q-input
                            v-model="fullSessionConfig.exceedHourAmount"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                            <template v-slot:append>
                              <span class="text-subtitle2 text-dark">元</span>
                            </template>
                          </q-input>
                        </div>
                      </div>
                  </div>

                  <div class="col-12 row">
                    <q-radio v-model="fullSessionConfig.exceedOneHourType" val="3"></q-radio>
                     <div class=" row items-center">
                        <div class="col-auto q-pb-md q-px-sm">消费超出1个场次，按每小时</div>

                        <div class="col-auto">
                          <q-input
                            v-model="fullSessionConfig.exceedEveryHourMoney"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                            <template v-slot:append>
                              <span class="text-subtitle2 text-dark">元</span>
                            </template>
                          </q-input>
                        </div>

                        <div class="col-auto q-pb-md q-px-sm">元计费，超出的分钟数按区间计费。</div>
                      </div>
                  </div>

                  <q-card class="bg-grey-2" flat v-if="parseInt(fullSessionConfig.exceedOneHourType) == 3">
                    <q-card-section class="row items-center">
                      <div class="col-auto">
                        <q-select borderless outlined v-model="fullSessionConfig.freeMinutes" :options="fiftyNineMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟之内免费； 超过<span class="text-subtitle2 text-weight-bold text-primary"> {{ fullSessionConfig.freeMinutes }} </span
                        >分钟至
                      </div>
                      <div class="col-auto">
                        <q-select borderless outlined v-model="fullSessionConfig.exceedMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">分钟，按</div>
                      <div class="col-auto q-px-sm">
                        <q-select borderless outlined v-model="fullSessionConfig.cycleMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟计费；超过
                        <span class="text-subtitle2 text-weight-bold text-primary"> {{ fullSessionConfig.exceedMinutes }} </span> 分钟，按<span
                          class="text-subtitle2 text-weight-bold text-primary"
                        >
                          {{ fullSessionConfig.cycleMinutes }} </span
                        >分钟计费；
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="4" class="row">
                  <div class="col-12">
                    <q-radio v-model="timeSectionConfig.timeType" val="1" label="分时段按小时计费" />
                    <q-radio v-model="timeSectionConfig.timeType" val="2" label="分时段按包段计费" />
                    <q-radio v-model="timeSectionConfig.timeType" val="3" label="分时段按分钟计费" />
                  </div>

                  <div class="col-12" v-if="parseInt(timeSectionConfig.timeType) == 1">
                    <q-list>
                      <q-item v-for="(i, k) in timeSectionConfig.sessionList" :key="k">
                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.startTime"
                            :options="twentyFourMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            :disable="k > 0 ? true : false"
                            @input="inputTimeFrameHourListStart(k)"
                          >
                            <template v-slot:before>
                              <span class="text-subtitle2 text-dark">场次{{ k + 1 }}：</span>
                            </template>
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">至</span>
                            </template>
                          </q-select>
                        </q-item-section>

                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.endtime"
                            :options="fortyEightMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            @input="changeTimeFrameHourList(k)"
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-input
                            v-model="i.useAmount"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                            <template v-slot:before>
                              <span class="text-subtitle2 text-dark">每小时</span>
                            </template>
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">元</span>
                            </template>
                          </q-input>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col-12" v-if="parseInt(timeSectionConfig.timeType) == 2">
                    <q-item>
                      <q-item-section>
                        <q-select
                          borderless
                          outlined
                          bottom-slots
                          v-model="timeSectionConfig.periodHoursInner"
                          :options="wholeDayHour"
                          dense
                          map-options
                          emit-value
                        >
                          <template v-slot:before>
                            <span class="text-subtitle2 text-dark">消费</span>
                          </template>
                          <template v-slot:after>
                            <span class="text-subtitle2 text-dark">小时内，按每小时</span>
                          </template>
                        </q-select>
                      </q-item-section>

                      <q-item-section>
                        <q-input
                          v-model="timeSectionConfig.periodEveryHoursInner"
                          standout
                          dense
                          outlined
                          :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                        >
                          <template v-slot:after>
                            <span class="text-subtitle2 text-dark"> 元计算，超过{{ timeSectionConfig.periodHoursInner }}小时按照包段计费。</span>
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-list>
                      <q-item v-for="(i, k) in timeSectionConfig.timeFrameList" :key="k">
                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.startTime"
                            :options="twentyFourMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            :disable="k > 0 ? true : false"
                            @input="inputTimeFramePeriodListStart(k)"
                          >
                            <template v-slot:before>
                              <span class="text-subtitle2 text-dark">场次{{ k + 1 }}：</span>
                            </template>
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">至</span>
                            </template>
                          </q-select>
                        </q-item-section>

                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.endtime"
                            :options="fortyEightMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            @input="changeTimeFramePeriodList(k)"
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-select borderless outlined bottom-slots v-model="i.everyHour" :options="wholeDayHour" dense emit-value map-options>
                            <template v-slot:before>
                              <span class="text-subtitle2 text-dark">每</span>
                            </template>
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">小时</span>
                            </template>
                          </q-select>
                        </q-item-section>

                        <q-item-section>
                          <q-input
                            v-model="i.useAmount"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">元</span>
                            </template>
                          </q-input>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col-12" v-if="parseInt(timeSectionConfig.timeType) == 3">
                    <q-list>
                      <q-item v-for="(i, k) in timeSectionConfig.timeMinutesList" :key="k">
                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.startTime"
                            :options="twentyFourMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            :disable="k > 0 ? true : false"
                            @input="inputTimeFramMinutesListStart(k)"
                          >
                            <template v-slot:before>
                              <span class="text-subtitle2 text-dark">场次{{ k + 1 }}：</span>
                            </template>
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">至</span>
                            </template>
                          </q-select>
                        </q-item-section>

                        <q-item-section>
                          <q-select
                            borderless
                            outlined
                            bottom-slots
                            v-model="i.endtime"
                            :options="fortyEightMinutes"
                            dense
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            @input="changeTimeFrameMinutesList(k)"
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-select borderless outlined bottom-slots v-model="i.everyMinute" :options="fiftyNineMinutes" dense emit-value map-options>
                            <template v-slot:before>
                              <span class="text-subtitle2 text-dark">每</span>
                            </template>
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">分钟</span>
                            </template>
                          </q-select>
                        </q-item-section>

                        <q-item-section>
                          <q-input
                            v-model="i.useAmount"
                            standout
                            dense
                            outlined
                            :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                          >
                            <template v-slot:after>
                              <span class="text-subtitle2 text-dark">元</span>
                            </template>
                          </q-input>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>

                  <div class="col-12 text-primary text-subtitle2 text-weight-bold">
                    {{ parseInt(timeSectionConfig.timeType) == 3 ? '超出分钟数的计费方式' : '跨时段计费方式' }}
                    <q-separator />
                  </div>

                  <div class="col-8 row q-gutter-xs q-mt-sm" v-if="parseInt(timeSectionConfig.timeType) == 3">
                    <div class="col">
                      <q-select borderless outlined bottom-slots v-model="timeSectionConfig.exceedMinutesInner" :options="fiftyNineMinutes" dense>
                        <template v-slot:after>
                          <span class="text-subtitle2 text-dark">分钟内，按每分钟</span>
                        </template>
                      </q-select>
                    </div>

                    <div class="col">
                      <q-input
                        v-model="timeSectionConfig.exceedMinutesAmount"
                        standout
                        borderless
                        dense
                        outlined
                        :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                      >
                        <template v-slot:after>
                          <span class="text-subtitle2 text-dark">元计算，超过{{ timeSectionConfig.exceedMinutesInner }}分钟按分钟段计算。</span>
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <div class="col-12 q-mt-sm" v-if="parseInt(timeSectionConfig.timeType) == 1 || parseInt(timeSectionConfig.timeType) == 2">
                    <q-radio v-model="timeSectionConfig.exceedOneHourType" val="1"> 消费超出时段，按实际分钟数计费。 </q-radio>
                  </div>

                  <div class="col-12" v-if="parseInt(timeSectionConfig.timeType) == 1 || parseInt(timeSectionConfig.timeType) == 2">
                    <q-radio v-model="timeSectionConfig.exceedOneHourType" val="3"> 消费超出时段，按超出分钟数区间计费。 </q-radio>
                  </div>

                  <q-card
                    class="bg-grey-2"
                    flat
                    v-if="
                      parseInt(timeSectionConfig.exceedOneHourType) == 3 &&
                      (parseInt(timeSectionConfig.timeType) == 1 || parseInt(timeSectionConfig.timeType) == 2)
                    "
                  >
                    <q-card-section class="row items-center">
                      <div class="col-auto">
                        <q-select borderless outlined v-model="timeSectionConfig.freeMinutes" :options="fiftyNineMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟之内免费； 超过<span class="text-subtitle2 text-weight-bold text-primary"> {{ timeSectionConfig.freeMinutes }} </span
                        >分钟至
                      </div>
                      <div class="col-auto">
                        <q-select borderless outlined v-model="timeSectionConfig.exceedMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">分钟，按</div>
                      <div class="col-auto q-px-sm">
                        <q-select borderless outlined v-model="timeSectionConfig.cycleMinutes" :options="sixtyMinutes" dense />
                      </div>
                      <div class="col-auto q-px-sm">
                        分钟计费；超过
                        <span class="text-subtitle2 text-weight-bold text-primary"> {{ timeSectionConfig.exceedMinutes }} </span> 分钟，按<span
                          class="text-subtitle2 text-weight-bold text-primary"
                        >
                          {{ timeSectionConfig.cycleMinutes }} </span
                        >分钟计费；
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <div class="col-8">
              <q-item>
                <q-item-section top avatar>
                  <q-checkbox v-model="extraAmountConfig.status" val="1" :true-value="1" :false-value="0" label="加收服务费" />
                </q-item-section>

                <q-item-section>
                  <q-select
                    borderless
                    outlined
                    bottom-slots
                    v-model="extraAmountConfig.startTime"
                    :options="twentyFourMinutes"
                    dense
                    map-options
                    emit-value
                    option-label="label"
                    option-value="value"
                  >
                    <template v-slot:after>
                      <span class="text-subtitle2 text-dark">至</span>
                    </template>
                  </q-select>
                </q-item-section>

                <q-item-section>
                  <q-select
                    borderless
                    outlined
                    bottom-slots
                    v-model="extraAmountConfig.endtime"
                    :options="fortyEightMinutes"
                    dense
                    map-options
                    emit-value
                    option-label="label"
                    option-value="value"
                  />
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12">
              <q-card class="bg-grey-2" flat v-if="parseInt(extraAmountConfig.status) == 1">
                <q-item>
                  <q-item-section avatar top>
                    <q-radio v-model="extraAmountConfig.userType" val="1"></q-radio>
                  </q-item-section>
                  <q-item-section>
                    <q-select borderless outlined bottom-slots v-model="extraAmountConfig.exceedMinutesInner" :options="fiftyNineMinutes" dense>
                      <template v-slot:before>
                        <span class="text-subtitle2 text-dark"> 每满 </span>
                      </template>
                      <template v-slot:after>
                        <span class="text-subtitle2 text-dark">分钟</span>
                      </template>
                    </q-select>
                  </q-item-section>
                  <q-item-section>
                    <q-input
                      v-model="extraAmountConfig.exceedMinutesAmount"
                      standout
                      borderless
                      dense
                      outlined
                      :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                    >
                      <template v-slot:after>
                        <span class="text-subtitle2 text-dark">元</span>
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                  <q-item-section avatar top>
                    <q-radio v-model="extraAmountConfig.userType" val="2"></q-radio>
                  </q-item-section>

                  <q-item-section top>
                    <q-input
                      v-model="extraAmountConfig.everyHourAmount"
                      standout
                      borderless
                      dense
                      outlined
                      :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                    >
                      <template v-slot:before>
                        <span class="text-subtitle2 text-dark">每小时</span>
                      </template>
                      <template v-slot:after>
                        <span class="text-subtitle2 text-dark">元</span>
                      </template>
                    </q-input>
                  </q-item-section>

                  <q-item-section top>
                    <q-select bottom-slots borderless outlined v-model="extraAmountConfig.freeMinutes" :options="fiftyNineMinutes" dense>
                      <template v-slot:after>
                        <span class="text-subtitle2 text-dark">
                          分钟之内免费； 超过<span class="text-subtitle2 text-weight-bold text-primary"> {{ extraAmountConfig.freeMinutes }} </span>
                        </span>
                      </template>
                    </q-select>
                  </q-item-section>

                  <q-item-section top>
                    <q-select bottom-slots borderless outlined v-model="extraAmountConfig.exceedMinutes" :options="sixtyMinutes" dense>
                      <template v-slot:before>
                        <span class="text-subtitle2 text-dark"> 分钟至 </span>
                      </template>
                      <template v-slot:after>
                        <span class="text-subtitle2 text-dark"> 分钟，按 </span>
                      </template>
                    </q-select>
                  </q-item-section>

                  <q-item-section top>
                    <q-select bottom-slots borderless outlined v-model="extraAmountConfig.cycleMinutes" :options="sixtyMinutes" dense>
                      <template v-slot:after>
                        <span class="text-subtitle2 text-dark"> 分钟计费 </span>
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </q-form>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-center row q-gutter-sm">
        <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData">
          保存
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddRoomGroup',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      roomGroupData: {
        qcr_name: '',
        qcr_max_amount: '',
        qcr_type: '1',
        qcr_begin_limit_minutes: '0',
        qcr_begin_limit_amount: '0',
        qcr_one_hour_config: {},
        qcr_time_period_config: {},
        qcr_full_session_config: {},
        qcr_extra_amount_config: {},
        qcr_time_section_config: {},
        qcr_status: '1'
      },

      roomGroupId: 0,
      oneHourConfig: {
        everyHourAmount: '',
        exceedOneHourType: '1',
        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30'
      },
      qcrTimePeriodConfig: {
        exceedOneHourType: '1',
        setHourAmount: '8',
        everyHourAmount: '15',
        exceedEveryHourAmount: '3',
        exceedHourAmount: '0',
        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30',
        exceedEveryHourMoney: '0'
      },
      fullSessionConfig: {
        sessionList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0,
            isMaintain: 0
          }
        ],
        exceedOneHourType: '1',
        setHourAmount: '8',
        everyHourAmount: '15',
        exceedEveryHourAmount: '3',
        exceedHourAmount: '0',
        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30',
        oneFreeMinutes: '30',
        exceedEveryHourMoney: '0'
      },
      timeSectionConfig: {
        timeType: '1',
        sessionList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0
          }
        ],
        timeFrameList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0,
            everyHour: 4
          }
        ],

        timeMinutesList: [
          {
            startTime: 0,
            endtime: 24,
            useAmount: 0,
            everyMinute: 5
          }
        ],

        periodHoursInner: '1',
        periodEveryHoursInner: '0',

        exceedOneHourType: '1',

        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30',
        oneFreeMinutes: '30',

        exceedMinutesInner: 0,
        exceedMinutesAmount: '0'
      },
      extraAmountConfig: {
        status: 0,
        startTime: 0,
        endtime: 24,

        userType: '1',
        exceedMinutesInner: 0,
        exceedMinutesAmount: '0',

        freeMinutes: '15',
        exceedMinutes: '30',
        cycleMinutes: '30',
        oneFreeMinutes: '30',

        everyHourAmount: '0'
      },

      fiftyNineMinutes: [],
      sixtyMinutes: [],
      fortyEightMinutes: [],
      twentyFourMinutes: [],
      wholeDayHour: []
    }
  },
  created () {
    for (var i = 1; i <= 59; i++) {
      this.fiftyNineMinutes.push(i)
    }

    for (var i = 1; i <= 60; i++) {
      this.sixtyMinutes.push(i)
    }

    for (var i = 0; i < 24; i++) {
      this.twentyFourMinutes.push({
        label: i + '点',
        value: i
      })
      this.fortyEightMinutes.push({
        label: i + '点',
        value: i
      })
    }

    for (var i = 1; i <= 24; i++) {
      this.wholeDayHour.push(i)
    }

    for (var i = 0; i < 24; i++) {
      this.fortyEightMinutes.push({
        label: '次日' + i + '点',
        value: i + 24
      })
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true

      this.roomGroupId = id
      if (id > 0) {
        this.getItem()
      }
    },

    getItem () {
      this.$store
        .dispatch('chargeRule/getRoomGroupItem', this.roomGroupId)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.roomGroupData = res.data
            if (this.roomGroupData && this.roomGroupData.qcr_one_hour_config) {
              this.oneHourConfig = this.roomGroupData.qcr_one_hour_config
            }
            if (this.roomGroupData && this.roomGroupData.qcr_time_period_config) {
              this.qcrTimePeriodConfig = this.roomGroupData.qcr_time_period_config
            }
            if (this.roomGroupData && this.roomGroupData.qcr_full_session_config) {
              this.fullSessionConfig = this.roomGroupData.qcr_full_session_config
            }

            if (this.roomGroupData && this.roomGroupData.qcr_time_section_config) {
              this.timeSectionConfig = this.roomGroupData.qcr_time_section_config
            }

            if (this.roomGroupData && this.roomGroupData.qcr_extra_amount_config) {
              this.extraAmountConfig = this.roomGroupData.qcr_extra_amount_config
            }
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
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    setData () {
      this.$refs.roomGroupDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true

          if (parseInt(this.roomGroupData.qcr_type) == 1) {
            this.roomGroupData.qcr_one_hour_config = this.oneHourConfig
          }
          if (parseInt(this.roomGroupData.qcr_type) == 2) {
            this.roomGroupData.qcr_time_period_config = this.qcrTimePeriodConfig
          }
          if (parseInt(this.roomGroupData.qcr_type) == 3) {
            this.roomGroupData.qcr_full_session_config = this.fullSessionConfig
          }
          if (parseInt(this.roomGroupData.qcr_type) == 4) {
            this.roomGroupData.qcr_time_section_config = this.timeSectionConfig
          }

          this.roomGroupData.qcr_extra_amount_config = this.extraAmountConfig

          const params = {
            ...this.roomGroupData
          }
          this.$store
            .dispatch('chargeRule/saveChargeRule', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.roomGroupData.id > 0 ? '修改' : '新增'}` + '包间成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
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
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.roomGroupData.id = ''
      this.roomGroupData = {
        dt_name: '',
        dt_sort: '0',
        dt_box_price: '0',
        dt_description: '',
        dt_min_consume: '0',
        dt_extra_consume: '0',
        dt_deposit: '0'
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    },

    getPrinterList () {
      this.$store
        .dispatch('dishes/getPrinterList')
        .then((res) => {
          if (res.code == 200) {
            this.printerList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 按包场计费
    inputSessionListStart (key) {
      const fullSessionConfig = this.fullSessionConfig
      if (fullSessionConfig && fullSessionConfig.sessionList && fullSessionConfig.sessionList.length > 0) {
        const sessionList = JSON.parse(JSON.stringify(fullSessionConfig.sessionList))

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = sessionList.length - spliceIndex

        if (spliceLength > 0) {
          sessionList.splice(spliceIndex, spliceLength)
        }

        const initArr = sessionList[0]

        sessionList[0].endtime = initArr.startTime + 24

        this.fullSessionConfig.sessionList = sessionList
      }
    },

    // 按包场计费
    changeFullSessionList (key) {
      const that = this
      const fullSessionConfig = this.fullSessionConfig
      if (fullSessionConfig && fullSessionConfig.sessionList && fullSessionConfig.sessionList.length > 0) {
        const sessionList = JSON.parse(JSON.stringify(fullSessionConfig.sessionList))

        // 1、第一个场次 开始时间 和 最后一个场次 的结束时间  必须一致

        // 2、第一个场次 开始时间 和 最后一个场次 的结束时间  时间不能间隔大于 48个小时

        // 2.1、结束时间 大于 开始时间

        // 3、根据key 删除 key之后的数组元素

        // 4、编辑时 无法新增时将最后的元素改为 最大值

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = sessionList.length - spliceIndex

        if (spliceLength > 0) {
          sessionList.splice(spliceIndex, spliceLength)
        }
        this.$nextTick(() => {
          const finallyData = sessionList[sessionList.length - 1]
          const initArr = sessionList[0]
          const currentSessionObject = sessionList[key]

          if (sessionList.length > 0) {
            if (finallyData.endtime - initArr.startTime <= 24 && currentSessionObject.endtime > currentSessionObject.startTime) {
              sessionList.push({
                startTime: finallyData.endtime,
                endtime: initArr.startTime + 24,
                useAmount: 0,
                isMaintain: 0
              })
            } else {
              sessionList[sessionList.length - 1].endtime = initArr.startTime + 24
            }
          } else {
            if (currentSessionObject.endtime < currentSessionObject.startTime || finallyData.endtime - initArr.startTime >= 24) {
              sessionList[sessionList.length - 1].endtime = initArr.startTime + 24
            }
          }
          that.fullSessionConfig.sessionList = sessionList
        })
      }
    },

    // 分时段按小时计费
    inputTimeFrameHourListStart (key) {
      const timeSectionConfig = this.timeSectionConfig
      if (timeSectionConfig && timeSectionConfig.sessionList && timeSectionConfig.sessionList.length > 0) {
        const sessionList = JSON.parse(JSON.stringify(timeSectionConfig.sessionList))

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = sessionList.length - spliceIndex

        if (spliceLength > 0) {
          sessionList.splice(spliceIndex, spliceLength)
        }

        const initArr = sessionList[0]

        sessionList[0].endtime = initArr.startTime + 24

        this.timeSectionConfig.sessionList = sessionList
      }
    },

    // 分时段按小时计费
    changeTimeFrameHourList (key) {
      const that = this
      const timeSectionConfig = this.timeSectionConfig
      if (timeSectionConfig && timeSectionConfig.sessionList && timeSectionConfig.sessionList.length > 0) {
        const sessionList = JSON.parse(JSON.stringify(timeSectionConfig.sessionList))

        // 1、第一个场次 开始时间 和 最后一个场次 的结束时间  必须一致

        // 2、第一个场次 开始时间 和 最后一个场次 的结束时间  时间不能间隔大于 48个小时

        // 2.1、结束时间 大于 开始时间

        // 3、根据key 删除 key之后的数组元素

        // 4、编辑时 无法新增时将最后的元素改为 最大值

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = sessionList.length - spliceIndex

        if (spliceLength > 0) {
          sessionList.splice(spliceIndex, spliceLength)
        }
        this.$nextTick(() => {
          const finallyData = sessionList[sessionList.length - 1]
          const initArr = sessionList[0]
          const currentSessionObject = sessionList[key]

          if (sessionList.length > 0) {
            if (finallyData.endtime - initArr.startTime <= 24 && currentSessionObject.endtime > currentSessionObject.startTime) {
              sessionList.push({
                startTime: finallyData.endtime,
                endtime: initArr.startTime + 24,
                useAmount: 0,
                isMaintain: 0
              })
            } else {
              sessionList[sessionList.length - 1].endtime = initArr.startTime + 24
            }
          } else {
            if (currentSessionObject.endtime < currentSessionObject.startTime || finallyData.endtime - initArr.startTime >= 24) {
              sessionList[sessionList.length - 1].endtime = initArr.startTime + 24
            }
          }
          that.timeSectionConfig.sessionList = sessionList
        })
      }
    },

    // 分时段按包段计费
    inputTimeFramePeriodListStart (key) {
      const timeSectionConfig = this.timeSectionConfig
      if (timeSectionConfig && timeSectionConfig.timeFrameList && timeSectionConfig.timeFrameList.length > 0) {
        const timeFrameList = JSON.parse(JSON.stringify(timeSectionConfig.timeFrameList))

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = timeFrameList.length - spliceIndex

        if (spliceLength > 0) {
          timeFrameList.splice(spliceIndex, spliceLength)
        }

        const initArr = timeFrameList[0]

        timeFrameList[0].endtime = initArr.startTime + 24

        this.timeSectionConfig.timeFrameList = timeFrameList
      }
    },

    // 分时段按包段计费
    changeTimeFramePeriodList (key) {
      const that = this
      const timeSectionConfig = this.timeSectionConfig
      if (timeSectionConfig && timeSectionConfig.timeFrameList && timeSectionConfig.timeFrameList.length > 0) {
        const timeFrameList = JSON.parse(JSON.stringify(timeSectionConfig.timeFrameList))

        // 1、第一个场次 开始时间 和 最后一个场次 的结束时间  必须一致

        // 2、第一个场次 开始时间 和 最后一个场次 的结束时间  时间不能间隔大于 48个小时

        // 2.1、结束时间 大于 开始时间

        // 3、根据key 删除 key之后的数组元素

        // 4、编辑时 无法新增时将最后的元素改为 最大值

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = timeFrameList.length - spliceIndex

        if (spliceLength > 0) {
          timeFrameList.splice(spliceIndex, spliceLength)
        }
        this.$nextTick(() => {
          const finallyData = timeFrameList[timeFrameList.length - 1]
          const initArr = timeFrameList[0]
          const currentSessionObject = timeFrameList[key]

          if (timeFrameList.length > 0) {
            if (finallyData.endtime - initArr.startTime <= 24 && currentSessionObject.endtime > currentSessionObject.startTime) {
              timeFrameList.push({
                startTime: finallyData.endtime,
                endtime: initArr.startTime + 24,
                useAmount: 0,
                everyHour: 4
              })
            } else {
              timeFrameList[timeFrameList.length - 1].endtime = initArr.startTime + 24
            }
          } else {
            if (currentSessionObject.endtime < currentSessionObject.startTime || finallyData.endtime - initArr.startTime >= 24) {
              timeFrameList[timeFrameList.length - 1].endtime = initArr.startTime + 24
            }
          }
          that.timeSectionConfig.timeFrameList = timeFrameList
        })
      }
    },

    // 分时段按分钟计费
    inputTimeFramMinutesListStart (key) {
      const timeSectionConfig = this.timeSectionConfig
      if (timeSectionConfig && timeSectionConfig.timeMinutesList && timeSectionConfig.timeMinutesList.length > 0) {
        const timeMinutesList = JSON.parse(JSON.stringify(timeSectionConfig.timeMinutesList))

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = timeMinutesList.length - spliceIndex

        if (spliceLength > 0) {
          timeMinutesList.splice(spliceIndex, spliceLength)
        }

        const initArr = timeMinutesList[0]

        timeMinutesList[0].endtime = initArr.startTime + 24

        this.timeSectionConfig.timeMinutesList = timeMinutesList
      }
    },

    // 分时段按分钟计费
    changeTimeFrameMinutesList (key) {
      const that = this
      const timeSectionConfig = this.timeSectionConfig
      if (timeSectionConfig && timeSectionConfig.timeMinutesList && timeSectionConfig.timeMinutesList.length > 0) {
        const timeMinutesList = JSON.parse(JSON.stringify(timeSectionConfig.timeMinutesList))

        // 1、第一个场次 开始时间 和 最后一个场次 的结束时间  必须一致

        // 2、第一个场次 开始时间 和 最后一个场次 的结束时间  时间不能间隔大于 48个小时

        // 2.1、结束时间 大于 开始时间

        // 3、根据key 删除 key之后的数组元素

        // 4、编辑时 无法新增时将最后的元素改为 最大值

        const spliceIndex = key == 0 ? 1 : key + 1

        const spliceLength = timeMinutesList.length - spliceIndex

        if (spliceLength > 0) {
          timeMinutesList.splice(spliceIndex, spliceLength)
        }
        this.$nextTick(() => {
          const finallyData = timeMinutesList[timeMinutesList.length - 1]
          const initArr = timeMinutesList[0]
          const currentSessionObject = timeMinutesList[key]

          if (timeMinutesList.length > 0) {
            if (finallyData.endtime - initArr.startTime <= 24 && currentSessionObject.endtime > currentSessionObject.startTime) {
              timeMinutesList.push({
                startTime: finallyData.endtime,
                endtime: initArr.startTime + 24,
                useAmount: 0,
                everyMinute: 5
              })
            } else {
              timeMinutesList[timeMinutesList.length - 1].endtime = initArr.startTime + 24
            }
          } else {
            if (currentSessionObject.endtime < currentSessionObject.startTime || finallyData.endtime - initArr.startTime >= 24) {
              timeMinutesList[timeMinutesList.length - 1].endtime = initArr.startTime + 24
            }
          }
          that.timeSectionConfig.timeMinutesList = timeMinutesList
        })
      }
    }
  }
}
</script>
