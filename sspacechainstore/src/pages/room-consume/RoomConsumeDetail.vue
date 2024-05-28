<template>
  <div class="fit column justify-between no-wrap">
    <div class="col-shrink text-subtitle1 bg-white q-py-xs q-px-sm row items-center">
      台号：<span class="text-h6 text-weight-bold q-pr-md">{{ currentRoomName }}</span>

      顾客人数：<span class="text-h6 text-weight-bold q-pr-sm">{{ formatAmount(currentConsumeData.scb_people_number) }}</span>

     <span v-if="currentConsumeData.rewardUser && currentConsumeData.rewardUser.id">开台员工：</span> <span class="text-h6 text-weight-bold" v-if="currentConsumeData.rewardUser && currentConsumeData.rewardUser.id">{{ currentConsumeData.rewardUser && currentConsumeData.rewardUser.id ? currentConsumeData.rewardUser.pru_name : '' }}</span>

    </div>
    <q-separator />
    <div class="col-shrink bg-white q-py-sm">
      <div class="row q-col-gutter-sm q-px-sm">
        <div class="col-auto">
          <q-btn
            color="primary"
            unelevated
            icon="person_outline"
            :disable="parseInt(currentConsumeData.qrt_status) == 2 ? false : true"
            @click="openReadingDialog"
            label="会员"
            class="text-weight-bold"
          />
        </div>

        <div class="col-auto" v-if="currentConsumeData.showBtnStatus">
          <q-btn
            color="amber"
            :disable="parseInt(currentConsumeData.qrt_status) == 2 && currentConsumeData.consum_buffer_id ? false : true"
            unelevated
            icon="group_work"
            @click="changeRoomDialogOperate"
            label="更换桌台"
            class="text-weight-bold"

          >
          </q-btn>
        </div>
        <div class="col-auto" v-if="currentConsumeData.showBtnStatus">
          <q-btn color="orange"  unelevated icon="filter_2" @click="clickMergeDialog" label="合并账单" class="text-weight-bold"> </q-btn>
        </div>

        <div class="col-auto">
          <q-btn color="green" unelevated icon="watch_later" @click="roomBookDialogOperate" label="预订记录" class="text-weight-bold"> </q-btn>
        </div>

        <div class="col-auto" v-if="parseInt(currentConsumeData.qrt_status) == 2 && currentConsumeData.showBtnStatus" >
          <q-btn color="negative" @click="clickPauseRoomTimeOperate" unelevated icon="update" class="text-weight-bold" label="暂停计时"> </q-btn>
        </div>
        <div class="col-auto" v-if="parseInt(currentConsumeData.qrt_status) == 4">
          <q-btn color="primary" @click="overRoomPauseTimeOperate(3)" unelevated icon="update" class="text-weight-bold" label="恢复计时"> </q-btn>
        </div>
      </div>
    </div>
    <q-separator />
    <div class="col-shrink bg-white full-height row">
      <div class="col-10" v-if="parseInt(currentConsumeData.qrt_status) == 1">
        <div class="fit flex flex-center">
          <q-btn color="positive" @click="openRoomConsume" unelevated label="开台" icon="alarm_add" class="q-pa-md text-h6 text-weight-bold"> </q-btn>
        </div>
      </div>

      <div class="col-10" v-else>
        <q-scroll-area class="fit q-pa-xs">
          <div
            class="row q-col-gutter-xs q-px-sm q-mt-xs"
            v-if="parseInt(currentConsumeData.qrt_status) == 2 || parseInt(currentConsumeData.qrt_status) == 4"
          >
            <div
              class="col-12 q-mt-sm"
              v-if="
                currentConsumeData &&
                currentConsumeData.memberTimeCardData &&
                currentConsumeData.memberTimeCardData.length > 0 &&
                parseInt(currentConsumeData.scb_charge_mode) == 1
              "
            >
              <q-markup-table dense separator="cell" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">时卡</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">时卡名称</th>
                    <th class="text-center">剩余时长</th>
                    <th class="text-center">到期时间</th>
                    <th class="text-center">使用</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in currentConsumeData.memberTimeCardData">
                    <td class="text-center">
                      {{ item.tcm_name }}
                    </td>
                    <td class="text-center">{{ item.tcm_last_minutes }}分钟</td>
                    <td class="text-center">
                      {{ $q_date.formatDate(item.tcm_start_end * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                    </td>
                    <td class="text-center">

                      <q-btn
                        color="primary"
                        v-if="parseInt(currentConsumeData.scb_member_time_card_id) == parseInt(item.id)"
                        icon="radio_button_checked"
                        flat
                        dense
                        round
                      ></q-btn>

                      <q-btn
                        color="primary"
                        @click="changeTimeCardAmount(item.id)"
                        v-else
                        icon="radio_button_unchecked"
                        flat
                        dense
                        round
                      ></q-btn>

                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <div class="col-12 q-mt-sm" v-if="currentConsumeData && currentConsumeData.scb_member_id">
              <q-markup-table dense separator="cell" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">会员</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">会员昵称</th>
                    <th class="text-center">会员卡号</th>
                    <th class="text-center">会员电话</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">
                      {{ currentConsumeData && currentConsumeData.scb_member_nickname ? currentConsumeData.scb_member_nickname : '' }}
                    </td>
                    <td class="text-center">
                      {{ currentConsumeData && currentConsumeData.scb_member_card_number ? currentConsumeData.scb_member_card_number : '' }}
                    </td>
                    <td class="text-center">
                      {{ currentConsumeData && currentConsumeData.scb_member_phone_number ? currentConsumeData.scb_member_phone_number : '' }}
                    </td>

                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <div class="col-12 q-mt-sm">
              <q-markup-table dense separator="cell" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">台费</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">开台时间</th>
                    <th class="text-center">时长</th>
                    <th class="text-center">计费模式</th>
                    <th class="text-center">金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">{{ $q_date.formatDate(currentConsumeData.scb_create_time * 1000, 'YYYY-MM-DD HH:mm') }}</td>
                    <td class="text-center">{{ maintainTimeText($q_date.formatDate(new Date(), 'X'),currentConsumeData.scb_create_time) }}</td>
                    <td class="text-center">
                      {{ currentConsumeData.chargeRule && currentConsumeData.chargeRule.id ? currentConsumeData.chargeRule.qcr_name : '' }}
                    </td>
                    <td class="text-center">
                      <span class="text-weight-bold text-red q-px-sm">
                        {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        <span class="text-h6">{{ formatAmount(currentConsumeData.sci_room_total_amount) }} </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <div class="col-12 q-mt-sm">
              <q-markup-table dense separator="cell" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">预结账台费</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">离店时间</th>
                    <th class="text-center">时长</th>
                    <th class="text-center">预结账金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">{{ $q_date.formatDate(currentConsumeData.scb_leave_time * 1000, 'YYYY-MM-DD HH:mm') }}</td>
                    <td class="text-center">{{ maintainTimeText(currentConsumeData.scb_leave_time,currentConsumeData.scb_create_time) }}</td>
                    <td class="text-center">
                      <span class="text-weight-bold text-red q-px-sm">
                        {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        <span class="text-h6">{{ formatAmount(currentConsumeData.sci_room_before_amount) }} </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <div
              class="col-12 q-mt-sm"
              v-if="currentConsumeData && currentConsumeData.goodsShoppingList && currentConsumeData.goodsShoppingList.length > 0"
            >
              <q-markup-table dense separator="horizontal" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">消费</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">商品</th>
                    <th class="text-center">数量</th>
                    <th class="text-center">金额</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in currentConsumeData.goodsShoppingList">
                    <td class="text-center">
                      {{ item.cgb_goo_name }}
                      <span v-if="item.cgb_specificationName">/{{ item.cgb_specificationName }}</span>
                    </td>
                    <td class="text-center">{{ item.cgb_consumeNumber }}</td>
                    <td class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      {{ item.cgb_totalPrice }}
                    </td>
                    <td class="text-center">
                      <q-btn color="red" flat dense @click="delShoppingCarData(item)" label="删除" />
                    </td>
                  </tr>

                  <tr class="bg-blue-1">
                    <th class="text-left">总计</th>
                    <th class="text-center"></th>
                    <th class="text-center"></th>
                    <th class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      <span class="text-negative text-h6">{{ goodsShoppingTotalAmount }}</span>
                    </th>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <div
              class="col-12 q-mt-sm"
              v-if="currentConsumeData && currentConsumeData.goodsInvoiceDetailList && currentConsumeData.goodsInvoiceDetailList.length > 0"
            >
              <q-markup-table dense separator="horizontal" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">消费</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">商品</th>
                    <th class="text-center">数量</th>
                    <th class="text-center">金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in currentConsumeData.goodsInvoiceDetailList">
                    <td class="text-center">
                      {{ item.cid_goo_name }}
                      <span v-if="item.cid_specificationName">/{{ item.cid_specificationName }}</span>
                    </td>
                    <td class="text-center">{{ item.cid_consumeNumber }}</td>
                    <td class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      {{ item.cid_totalPrice }}
                    </td>
                  </tr>

                  <tr class="bg-blue-1">
                    <th class="text-left">总计</th>
                    <th class="text-center"></th>
                    <th class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      <span class="text-negative text-h6">{{ goodsInvoiceDetailTotalAmount }}</span>
                    </th>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <div
              class="col-12 q-mt-sm"
              v-if="currentConsumeData && currentConsumeData.changeRecordData && currentConsumeData.changeRecordData.length > 0"
            >
              <q-markup-table dense separator="horizontal" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">更换桌台记录</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">转台时间</th>
                    <th class="text-center">操作员工</th>
                    <th class="text-center">原桌台</th>
                    <th class="text-center">原计费模式</th>
                    <th class="text-center">新桌台</th>
                    <th class="text-center">新计费模式</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in currentConsumeData.changeRecordData">
                    <td class="text-center">
                      {{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm') }}
                    </td>

                    <td class="text-center">
                      {{ item.rewardUser && item.rewardUser.id ? item.rewardUser.pru_name : '' }}
                    </td>

                    <td class="text-center">
                      {{ item.rcr_before_room_name }}
                    </td>

                    <td class="text-center">
                      {{ item.rcr_before_charge_rule_name }}
                    </td>
                    <td class="text-center">
                      {{ item.rcr_after_room_name }}
                    </td>

                    <td class="text-center">
                      {{ item.rcr_after_charge_rule_name }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <div
              class="col-12 q-mt-sm"
              v-if="currentConsumeData && currentConsumeData.roomPauseRecord && currentConsumeData.roomPauseRecord.length > 0"
            >
              <q-markup-table dense separator="horizontal" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">暂停计时记录</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">暂停时间</th>
                    <th class="text-center">恢复时间</th>
                    <th class="text-center">暂停员工</th>
                    <th class="text-center">状态</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in currentConsumeData.roomPauseRecord">
                    <td class="text-center">
                      {{ $q_date.formatDate(item.crr_start_time * 1000, 'YYYY-MM-DD HH:mm') }}
                    </td>
                    <td class="text-center">
                      {{ $q_date.formatDate(item.crr_end_time * 1000, 'YYYY-MM-DD HH:mm') }}
                    </td>

                    <td class="text-center">
                      {{ item.rewardUser && item.rewardUser.id ? item.rewardUser.pru_name : '' }}
                    </td>

                    <td class="text-center">
                      <div v-if="parseInt(item.crr_status) == 1">暂停中</div>
                      <div v-if="parseInt(item.crr_status) == 2">到期自动恢复</div>
                      <div v-if="parseInt(item.crr_status) == 3">主动操作恢复</div>
                      <div v-if="parseInt(item.crr_status) == 4">作废</div>
                    </td>

                    <td class="text-center">
                      <q-btn color="red" v-if="parseInt(item.crr_status) == 1" flat dense @click="overRoomPauseTimeOperate(4)" label="作废" />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

           <div
              class="col-12 q-mt-sm"
              v-if="currentConsumeData && currentConsumeData.roomMergeRelationList && currentConsumeData.roomMergeRelationList.length > 0"
            >
              <q-markup-table dense separator="horizontal" flat bordered>
                <thead>
                  <tr>
                    <th colspan="5">
                      <div class="row no-wrap items-center">
                        <q-icon name="las la-square-full" color="primary"></q-icon>

                        <div class="text-subtitle2 q-ml-md text-dark">合并桌台</div>
                      </div>
                    </th>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-center">桌台</th>
                    <th class="text-center">商品消费</th>
                    <th class="text-center">桌台费</th>
                    <th class="text-center">总计</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in currentConsumeData.roomMergeRelationList">
                    <td class="text-center">
                      {{ item.roomTable && item.roomTable.id ? item.roomTable.qrt_name : '' }}
                    </td>
                    <td class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      {{  formatAmount(item.goods_total_amount) }}
                      </td>
                    <td class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      {{  formatAmount(item.sci_room_total_amount) }}
                      </td>
                    <td class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      {{ formatAmount(item.goods_total_amount) + formatAmount(item.sci_room_total_amount) }}
                    </td>
                    <td class="text-center">
                       <q-btn color="red"  flat dense @click="cancelMergeRelation(item.id)" label="取消" />
                    </td>
                  </tr>
                  <tr class="bg-blue-1">
                    <th class="text-left">总计</th>
                    <th class="text-center"></th>
                    <th class="text-center"></th>
                    <th class="text-center"></th>
                    <th class="text-center">
                      {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      <span class="text-negative text-h6">{{ mergeRelationTotalAmount }}</span>
                    </th>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

          </div>

          <div class="row q-gutter-xs q-px-sm q-mt-sm" v-if="parseInt(currentConsumeData.qrt_status) == 3">
            <q-item class="bg-grey-2 full-width">
              <q-item-section>
                <q-item-label class="text-dark" caption>开始时间</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">
                  {{ $q_date.formatDate(currentRoomData.qrt_maintain_start_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="bg-grey-2 full-width">
              <q-item-section>
                <q-item-label class="text-dark" caption>清洁时长</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">
                  {{ maintainTimeText($q_date.formatDate(new Date(), 'X'),currentRoomData.qrt_maintain_start_time) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="bg-grey-2 full-width" v-if="currentRoomData && currentRoomData.qrt_maintain_reward_id">
              <q-item-section>
                <q-item-label class="text-dark" caption>清洁员工</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">
                  <q-badge color="positive" outline>{{ currentRoomData.rewardUser ? currentRoomData.rewardUser.pru_name : '' }}</q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="bg-grey-2 full-width">
              <q-item-section>
                <q-item-label class="text-dark" caption>备注</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentRoomData.qrt_maintain_note }} </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-scroll-area>
      </div>

      <q-separator vertical />

      <div class="col q-pa-xs q-gutter-y-sm">
        <q-btn
          color="red"
          unelevated
          icon="las la-tools"
          label="清洁"
          :disable="parseInt(currentConsumeData.qrt_status) == 1 ? false : true"
          @click="maintainOperate"
          class="text-weight-bold full-width"
          v-if="parseInt(currentConsumeData.qrt_status) == 1 || parseInt(currentConsumeData.qrt_status) == 2"
        />

        <q-btn
          color="positive"
          unelevated
          icon="las la-tools"
          label="清洁完成"
          @click="overMaintainOperate"
          v-if="parseInt(currentConsumeData.qrt_status) == 3"
          class="text-weight-bold full-width"
        />

        <q-btn
          color="positive"
          :disable="parseInt(currentConsumeData.qrt_status) == 2 && currentConsumeData.scb_member_id > 0 ? false : true"
          unelevated
          icon="las la-poll-h"
          @click="openHyjcRecordDialog"
          class="text-weight-bold full-width"
          label="寄存"
        >
        </q-btn>

        <q-btn color="positive"  unelevated icon="las la-door-closed" @click="openTtlockDoor(currentConsumeData.srd_ttlock_lock_id)" v-if="parseInt(currentConsumeData.is_bind_device_id) > 0 && parseInt(currentConsumeData.srd_is_door_status) == 1 && currentConsumeData.srd_ttlock_lock_id" class="text-weight-bold full-width" label="开门"> </q-btn>

         <q-btn color="negative"  unelevated icon="las la-door-open" @click="lockTtlockDoor(currentConsumeData.srd_ttlock_lock_id)" v-if="parseInt(currentConsumeData.is_bind_device_id) > 0 && parseInt(currentConsumeData.srd_is_door_status) == 2 && currentConsumeData.srd_ttlock_lock_id"  class="text-weight-bold full-width" label="关门"> </q-btn>

        <!-- <q-btn color="teal" @click="sendSorketMessage('allOpen')" unelevated icon="las la-lock-open" class="text-weight-bold full-width" label="全通电"> </q-btn>

        <q-btn color="blue-grey" @click="sendSorketMessage('allColse')" unelevated icon="las la-lock" class="text-weight-bold full-width" label="全闭电"> </q-btn> -->

        <div v-for="(item,key) in currentConsumeData.relayListData">

          <q-btn color="positive" @click="sendSorketMessage('open',item.id)" unelevated  v-if="parseInt(item.drc_dev_status) == 2" class="text-weight-bold full-width" :label="item.drc_name + '-开'"> </q-btn>

           <q-btn color="red" @click="sendSorketMessage('colse',item.id)" unelevated  v-if="parseInt(item.drc_dev_status) == 1" class="text-weight-bold full-width" :label="item.drc_name + '-关'"> </q-btn>

        </div>

      </div>
    </div>

    <div
      class="col-shrink bg-white q-px-xs q-pb-md row items-center"
      v-if="parseInt(currentConsumeData.qrt_status) == 2 || parseInt(currentConsumeData.qrt_status) == 4"
    >
      <div class="col-12 q-mb-sm">
        <q-separator />
      </div>
      <div class="col-auto q-mr-sm">
        <div class="text-weight-bold text-red q-px-sm text-center">
          <span class="text-caption">应付金额</span>
          {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
          <span class="text-h6">{{ formatAmount(formatAmount(currentConsumeData.sci_room_total_amount) + formatAmount(goodsShoppingTotalAmount) + formatAmount(mergeRelationTotalAmount)) }}</span>
        </div>
      </div>

      <div class="col-auto q-mr-sm" v-if="parseInt(currentConsumeData.qrt_status) == 2 && parseInt(currentConsumeData.scb_invoice_id) == 0  && currentConsumeData.showBtnStatus">
        <q-btn
          color="negative"
          unelevated
          icon="las la-reply"
          label="撤单"
          @click="revokeRoomConsume"
          class="text-weight-bold"
        />
      </div>

      <div class="col-auto q-mr-sm" v-if="parseInt(currentConsumeData.qrt_status) == 2 && parseInt(currentConsumeData.scb_invoice_id) == 0">
        <q-btn
          color="positive"
          unelevated
          icon="add_circle"
          :disable="parseInt(currentConsumeData.qrt_status) == 2 || parseInt(currentConsumeData.qrt_status) == 4 ? false : true"
          :to="{ name: 'roomGoodsConsume', query: { currentRoomId: currentRoomId } }"
          label="增加消费"
          class="text-weight-bold"
        />
      </div>

      <div class="col-auto q-mr-sm" v-if="parseInt(currentConsumeData.qrt_status) == 2 && parseInt(currentConsumeData.scb_invoice_id) > 0">
        <q-btn
          color="orange"
          unelevated
          icon="las la-cash-register"
          label="提前退场"
          @click="overBookRoomSettleData"
          class="text-weight-bold"
        />
      </div>

       <div class="col-auto q-mr-sm" v-if="parseInt(currentConsumeData.qrt_status) == 2 && parseInt(currentConsumeData.scb_invoice_id) == 0  && currentConsumeData.showBtnStatus">
        <q-btn
          color="deep-orange"
          unelevated
          icon="las la-cash-register"
          label="结账"
          @click="openCheckoutCounterPage"
          class="text-weight-bold"
          :disable="formatAmount(formatAmount(currentConsumeData.sci_room_total_amount) + formatAmount(goodsShoppingTotalAmount)) > 0 ? false : true"
        />
       </div>

      <div class="col-auto q-mr-sm" v-if="parseInt(currentConsumeData.qrt_status) == 2 && parseInt(currentConsumeData.scb_invoice_id) == 0  && currentConsumeData.roomMergeRelationList && currentConsumeData.roomMergeRelationList.length <= 0  && currentConsumeData.showBtnStatus">
        <q-btn
          color="cyan-9"
          unelevated
          icon="las la-wallet"
          label="预结账"
          @click="openBeforeCheckoutCounterPage({checkType:'before'},formatAmount(formatAmount(currentConsumeData.sci_room_before_amount) + formatAmount(goodsShoppingTotalAmount)))"
          class="text-weight-bold"
          :disable="formatAmount(formatAmount(currentConsumeData.sci_room_before_amount) + formatAmount(goodsShoppingTotalAmount)) > 0 ? false : true"
        />
      </div>

      <!-- <div class="col-auto q-mr-sm" v-if="parseInt(currentConsumeData.qrt_status) == 2 && parseInt(currentConsumeData.scb_invoice_id) == 0">
        <q-btn
          color="deep-orange"
          unelevated
          icon="las la-cash-register"
          label="结账"
          @click="openGoodsCheckoutCounterPage"
          class="text-weight-bold"
        />

      </div> -->

    </div>

    <hl-dialog-card-reading ref="cardReadingRef" @refreshDataList="getMemberInfo" />

    <member-hyjc-record ref="memberHyjcDialogRef" v-if="memberHyjcDialogStatus" @closeDialog="closeMemberHyjcDialog" />
    <hl-checkout
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>

    <change-room ref="changeRoomDialogRef" v-if="changeRoomDialogStatus" @closeChangeRoomDialog="closeChangeRoomDialog" />

    <pause-time ref="pauseRoomTimeDialogRef" v-if="pauseRoomTimeDialogStatus" @closePauseRoomTimeDialog="closePauseRoomTimeDialog" />

    <before-checkout ref="beforeCheckoutDialogRef" v-if="beforeCheckoutDialogStatus" @confirmeBeforeCheckout="confirmeBeforeCheckout" @closeBeforeCheckoutDialog="closeBeforeCheckoutDialog" />

    <merge-room-dialog ref="mergeRoomDialogRef" v-if="mergeRoomStatus" @clickBookRoom="roomMergeDialogOperate" @closeBookRoomDialog="closeMergeRoomDialog" />

  </div>
</template>
<script>
import MemberHyjcRecord from '../hyjc/MemberRecord.vue'
import ChangeRoom from './ChangeRoom.vue'
import PauseTime from './PauseTime.vue'
import BeforeCheckout from './BeforeCheckout.vue'

import MergeRoomDialog from './MergeRoomDialog.vue'

export default {
  name: 'roomConsume',
  components: { MemberHyjcRecord, ChangeRoom, PauseTime, BeforeCheckout, MergeRoomDialog },
  data () {
    return {
      currentRoomName: '',
      currentRoomId: 0,
      currentRoomData: {},

      drawerDetail: false,

      maintainDetailDialogStatus: false,
      yuyueDialogStatus: false,
      openRoomConsumeDialog: false,

      chargeRuleListData: [],
      currentConsumeData: {},
      goodsConsumeDialogStatus: false,
      checkoutPageReceive: false,
      goodsShoppingTotalAmount: 0,
      memberHyjcDialogStatus: false,
      changeRoomDialogStatus: false,
      pauseRoomTimeDialogStatus: false,
      beforeCheckoutDialogStatus: false,
      goodsInvoiceDetailTotalAmount: 0,
      mergeRoomStatus: false,
      mergeRelationTotalAmount: 0,
      openDeviceStatus: 1,
      currentPayMode: ''
    }
  },
  mounted () {

  },
  watch: {
    websocketMsg (v, o) {
      if (v.relay_client_id) {
        this.changeRelayClientStatus(v)
      } else if (v.all_change) {
        this.changeAllRelayClientStatus(v)
      }
    }
  },
  created () {},
  computed: {
    websocketMsg () {
      return this.$store.state.websorket.msg
    }
  },
  methods: {
    changeAllRelayClientStatus (v) {
      this.currentConsumeData.relayListData = this.currentConsumeData.relayListData.map((value, index) => {
        value.drc_dev_status = parseInt(v.status)
        return value
      })
    },
    changeRelayClientStatus (v) {
      const relayListData = this.currentConsumeData.relayListData
      const index = _.findIndex(relayListData, function (o) { return parseInt(o.id) == parseInt(v.relay_client_id) })

      if (index > -1) {
        relayListData[index].drc_dev_status = parseInt(v.status)
        this.currentConsumeData.relayListData = relayListData
      }
    },

    init (currentRoomId, currentRoomData, currentRoomName, openRoom) {
      this.currentRoomId = currentRoomId
      this.currentRoomData = currentRoomData

      this.currentRoomName = currentRoomName
      this.$nextTick(() => {
        this.selectRoomObject()
      })
      if (openRoom == 'openRoom') {
        this.openDeviceStatus = 2
      }
    },

    openRoomConsume () {
      this.$emit('openRoomConsume')
    },

    roomBookDialogOperate () {
      this.$emit('roomBookDialogOperate')
    },

    maintainOperate () {
      this.$emit('maintainOperate')
    },

    openHyjcRecordDialog () {
      this.memberHyjcDialogStatus = true

      this.$nextTick(() => {
        this.$refs.memberHyjcDialogRef.init(this.currentRoomId, parseInt(this.currentConsumeData.scb_member_id))
      })
    },

    closeMemberHyjcDialog () {
      this.memberHyjcDialogStatus = false
    },

    changeRoomDialogOperate () {
      this.changeRoomDialogStatus = true
      this.$nextTick(() => {
        this.$refs.changeRoomDialogRef.init(
          this.currentConsumeData.consum_buffer_id,
          this.currentConsumeData.scb_room_table_id,
          this.currentConsumeData.scb_charge_rule_id,
          this.currentConsumeData.scb_room_group_id
        )
      })
    },

    clickPauseRoomTimeOperate () {
      this.pauseRoomTimeDialogStatus = true
      this.$nextTick(() => {
        this.$refs.pauseRoomTimeDialogRef.init(
          this.currentConsumeData.consum_buffer_id,
          this.currentConsumeData.scb_room_table_id,
          this.currentConsumeData.scb_charge_rule_id,
          this.currentConsumeData.scb_room_group_id
        )
      })
    },

    closeChangeRoomDialog () {
      this.changeRoomDialogStatus = false

      this.$nextTick(() => {
        this.$emit('closeConsumeDetailDialog')
      })
    },

    closePauseRoomTimeDialog () {
      this.pauseRoomTimeDialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeConsumeDetailDialog')
      })
    },

    clickBeforeCheckoutOperate () {
      this.beforeCheckoutDialogStatus = true
      this.$nextTick(() => {
        this.$refs.beforeCheckoutDialogRef.init(this.currentConsumeData.consum_buffer_id, this.currentConsumeData.scb_room_table_id)
      })
    },

    closeBeforeCheckoutDialog () {
      this.beforeCheckoutDialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeConsumeDetailDialog')
      })
    },

    // 预结账
    confirmeBeforeCheckout (value, amount) {
      this.beforeCheckoutDialogStatus = false
      this.$nextTick(() => {
        this.openBeforeCheckoutCounterPage(value, amount)
      })
    },

    // 预结账
    openBeforeCheckoutCounterPage (value, amount) {
      this.currentPayMode = 'before'

      const amountsPayable = amount
      this.checkoutPageReceive = true
      const return_param = {
        ...this.currentConsumeData,
        currentRoomId: this.currentRoomId,
        ...value
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive(
          'roomConsume',
          amountsPayable,
          parseInt(this.currentConsumeData.scb_member_id),
          return_param
        )
      })
    },

    getMemberInfo (item) {
      this.$nextTick(() => {
        this.setOpenRoomConsume({
          consum_buffer_id: this.currentConsumeData.consum_buffer_id,
          scb_member_id: item.id,
          scb_member_nickname: item.mem_memberName,
          scb_member_card_number: item.mem_memberCardNum,
          scb_member_phone_number: item.mem_memberMobile
        })
      })
    },

    // 开单
    setOpenRoomConsume (obj, item) {
      this.$store
        .dispatch('roomConsume/updateConsumeData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新信息成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })

            this.$nextTick(() => {
              this.selectRoomObject()
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

    // 关闭使用中房间详情弹窗
    colseRoomDialog () {
      this.openDeviceStatus = this.currentPayMode == 'before' ? 1 : 3
      this.drawerDetail = false
      this.$emit('closeConsumeDetailDialog')
    },

    // 转换时间差为时分秒
    maintainTimeText (a, currentTime) {
      if (currentTime > 0) {
        let text = ''
        const t = a - currentTime
        let h = parseInt(t / 60 / 60)
        let m = parseInt((t - h * 60 * 60) / 60)
        let s = parseInt(t % 60)
        // 三元表达式 补零 如果小于10 则在前边进行补零 如果大于10 则不需要补零
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        if (h > 0) {
          text += this.formatAmount(h) + '小时'
        }
        if (m > 0) {
          text += this.formatAmount(m) + '分钟'
        }
        if (h <= 0 && m <= 0) {
          text += parseInt(s) + '秒'
        }
        return text
      }
    },

    // 获取开单详情
    selectRoomObject () {
      const params = {
        currentRoomId: this.currentRoomId

      }
      this.$store
        .dispatch('roomConsume/getRoomDetail', params)
        .then((res) => {
          if (res.code == 200) {
            this.drawerDetail = true
            this.currentConsumeData = res.data

            this.$nextTick(() => {
              this.sumShoppingTotalAmount()
            })

            this.$nextTick(() => {
              this.sumInvoiceDetailTotalAmount()
            })
            this.$nextTick(() => {
              this.sumMergeRelationTotalAmount()
            })

            this.sendBindMessage()

            // this.currentRoomId = item.id
            // this.currentRoomData = item
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
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    sendBindMessage () {
      this.$store.dispatch('websorket/sendMessage', {
        type: 'bindRoom',
        room_id: this.currentConsumeData.id,
        openDeviceStatus: this.openDeviceStatus
      })
      this.openDeviceStatus = 1
    },

    sendSorketMessage (status, device_id) {
      this.$store.dispatch('websorket/sendMessage', {
        type: 'operation',
        status,
        room_id: this.currentConsumeData.id,
        device_id
      })
    },

    overBookRoomSettleData () {
      const params = {
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomConsume/overBookRoomSettleData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.colseRoomDialog()
            this.$nextTick(() => {
              this.selectRoomObject()
            })
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
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    revokeRoomConsume () {
      this.$q.dialog({
        title: '确认撤单',
        message: '停止计时，并将桌台恢复至空闲?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const params = {
          currentBufferId: this.currentConsumeData.consum_buffer_id
        }
        this.$store
          .dispatch('roomConsume/revokeRoomConsume', params)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '撤单成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })

              this.colseRoomDialog()
              this.$nextTick(() => {
                this.selectRoomObject()
              })
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
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    // 删除购物车信息
    delShoppingCarData (item) {
      const obj = {
        buff_id: item.id
      }
      this.$store.dispatch('roomConsume/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除' + res.message + '条数据',
            icon: 'ion-checkmark-circle-outline',
            color: 'green',
            position: 'top-right',
            timeout: 500
          })
          this.selectedShoppingCarInfo = {}

          this.selectRoomObject()
        } else {
          this.$q.notify({
            message: '失败',
            caption: res.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
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
    },

    openReadingDialog () {
      this.$nextTick(() => {
        this.$refs.cardReadingRef.openReaderDialog()
      })
    },

    // 结账
    openCheckoutCounterPage () {
      this.currentPayMode = 'normal'
      const amountsPayable = this.formatAmount(this.goodsShoppingTotalAmount + this.formatAmount(this.currentConsumeData.sci_room_total_amount) + this.formatAmount(this.mergeRelationTotalAmount))
      this.checkoutPageReceive = true
      const return_param = {
        ...this.currentConsumeData,
        currentRoomId: this.currentRoomId
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive(
          'roomConsume',
          amountsPayable,
          parseInt(this.currentConsumeData.scb_member_id),
          return_param
        )
      })
    },

    openGoodsCheckoutCounterPage () {
      const amountsPayable = this.formatAmount(this.goodsShoppingTotalAmount)
      this.checkoutPageReceive = true
      const return_param = {
        ...this.currentConsumeData,
        currentRoomId: this.currentRoomId
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive(
          'roomConsume',
          amountsPayable,
          parseInt(this.currentConsumeData.scb_member_id),
          return_param
        )
      })
    },

    sumShoppingTotalAmount () {
      this.goodsShoppingTotalAmount = 0
      if (this.currentConsumeData && this.currentConsumeData.goodsShoppingList) {
        this.currentConsumeData.goodsShoppingList.forEach((item, key) => {
          this.goodsShoppingTotalAmount += this.formatAmount(item.cgb_totalPrice)
        })
      }
    },

    sumInvoiceDetailTotalAmount () {
      this.goodsInvoiceDetailTotalAmount = 0
      if (this.currentConsumeData && this.currentConsumeData.goodsInvoiceDetailList) {
        this.currentConsumeData.goodsInvoiceDetailList.forEach((item, key) => {
          this.goodsInvoiceDetailTotalAmount += this.formatAmount(item.cid_totalPrice)
        })
      }
    },

    sumMergeRelationTotalAmount () {
      this.mergeRelationTotalAmount = 0
      if (this.currentConsumeData && this.currentConsumeData.roomMergeRelationList) {
        this.currentConsumeData.roomMergeRelationList.forEach((item, key) => {
          this.mergeRelationTotalAmount += this.formatAmount(this.formatAmount(item.goods_total_amount) + this.formatAmount(item.sci_room_total_amount))
        })
      }
    },

    paySuccessCallBack (v) {
      this.checkoutPageReceive = false
      this.$store
        .dispatch('roomConsume/orderSettle', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.colseRoomDialog()
            this.$nextTick(() => {
              this.selectRoomObject()
            })
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '结账错误',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },

    // 结束维修
    overMaintainOperate () {
      const params = {
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomConsume/overMaintainOperate', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '完成清洁',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.resetRoomList()
            this.$nextTick(() => {
              this.selectRoomObject()
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

    // 结束暂停
    overRoomPauseTimeOperate (status) {
      const params = {
        currentRoomId: this.currentRoomId,
        crr_status: status,
        consumeBufferId: this.currentConsumeData.consum_buffer_id
      }
      this.$store
        .dispatch('roomConsume/overRoomPauseTimeOperate', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '恢复计时成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.resetRoomList()
            this.$nextTick(() => {
              this.selectRoomObject()
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

    openTtlockDoor (lockId) {
      const params = {
        lockId
      }
      this.$store
        .dispatch('ttlockManage/openTtlockDoor', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '开门成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.resetRoomList()
            this.$nextTick(() => {
              this.selectRoomObject()
            })
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

    lockTtlockDoor (lockId) {
      const params = {
        lockId
      }
      this.$store
        .dispatch('ttlockManage/lockTtlockDoor', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '关门成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.resetRoomList()
            this.$nextTick(() => {
              this.selectRoomObject()
            })
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

    closeCheckoutPopup () {
      this.checkoutPageReceive = false
    },

    resetRoomList () {
      this.$emit('resetRoomList')
    },

    changeTimeCardAmount (e) {
      this.$nextTick(() => {
        this.setOpenRoomConsume({
          consum_buffer_id: this.currentConsumeData.consum_buffer_id,
          scb_member_time_card_id: this.currentConsumeData.scb_member_time_card_id ? e : 0
        })
      })
    },

    clickMergeDialog () {
      this.mergeRoomStatus = true
      this.$nextTick(() => {
        this.$refs.mergeRoomDialogRef.init(this.currentRoomId)
      })
    },
    closeMergeRoomDialog () {
      this.mergeRoomStatus = false
    },
    roomMergeDialogOperate (relationRoomId, currentRoomData, currentRoomName) {
      if (parseInt(relationRoomId) > 0 && parseInt(this.currentRoomId) > 0) {
        this.mergeRoomStatus = false
        const params = {
          rmr_current_room_id: parseInt(this.currentRoomId),
          rmr_relation_room_id: parseInt(relationRoomId)
        }
        this.$store
          .dispatch('roomConsume/setMergeRelation', params)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '合并账单成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.resetRoomList()
              this.$nextTick(() => {
                this.selectRoomObject()
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
    },

    // 结束暂停
    cancelMergeRelation (relationId) {
      const params = {
        relationId
      }
      this.$store
        .dispatch('roomConsume/cancelMergeRelation', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '取消桌台合并',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.resetRoomList()
            this.$nextTick(() => {
              this.selectRoomObject()
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

  }
}
</script>
