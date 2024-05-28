<template>
  <q-expansion-item icon="subdirectory_arrow_right" clickable expand-separator :content-inset-level="0.2" :group="menu.pid" v-if="menu.child.length > 0">
    <template v-slot:header class="full-width">
      <q-item v-close-popup dense clickable class="q-pa-none" @click="getNowItem(menu)">
        <q-item-section side>
          <q-badge color="primary" class="q-pr-xs" v-if="parseInt(menu.gt_goods_type) == 1">
            实
          </q-badge>
          <q-badge color="positive" class="q-pr-xs" v-if="parseInt(menu.gt_goods_type) == 2">
            服
          </q-badge>
          <q-badge color="negative" class="q-pr-xs" v-if="parseInt(menu.gt_goods_type) == 3">
            套
          </q-badge>
        </q-item-section>
        <q-item-section>
          {{ menu.gt_name }}
        </q-item-section>
      </q-item>

      <q-space />
    </template>
    <!-- <q-menu anchor="top end" self="top start" v-if="menu.length > 0"> -->
    <q-list :style="{ width: list_width + 'px' }">
      <q-separator />

      <div v-for="item in menu.child">
        <item-menu v-if="item.child.length > 0" :list_width="list_width" :menu="item" @click="getNowItem(menu)"></item-menu>

        <q-item v-else @click="getNowItem(item)" v-close-popup="item.child.length > 0 ? false : true" clickable>
          <q-item-section side>
            <q-icon size="15px" color="primary" name="subdirectory_arrow_right"> </q-icon>
          </q-item-section>
          <q-item-section side>
            <q-badge color="primary" class="q-pr-xs" v-if="parseInt(item.gt_goods_type) == 1">
              实
            </q-badge>
            <q-badge color="positive" class="q-pr-xs" v-if="parseInt(item.gt_goods_type) == 2">
              服
            </q-badge>
            <q-badge color="negative" class="q-pr-xs" v-if="parseInt(item.gt_goods_type) == 3">
              套
            </q-badge>
          </q-item-section>
          <q-item-section>
            {{ item.gt_name }}
          </q-item-section>
          <q-item-section side v-if="item.child.length > 0">
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
      </div>
    </q-list>

    <!-- </q-menu> -->
  </q-expansion-item>
</template>

<script>
export default {
  name: 'ItemMenu',
  props: ['menu', 'list_width'],
  data () {
    return {}
  },
  created: function () {},
  mounted () {},

  methods: {
    getNowItem (item) {
      this.$emit('getItem', item)
    }
  }
}
</script>
