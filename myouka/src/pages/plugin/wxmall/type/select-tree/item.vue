<template>
  <q-expansion-item icon="subdirectory_arrow_right" clickable expand-separator :content-inset-level="0.2" :group="menu.wt_pid" v-if="menu.childData.length > 0">
    <template v-slot:header class="full-width">
      <q-item v-close-popup dense clickable class="q-pa-none" @click="getNowItem(menu)">
        <q-item-section>
          {{ menu.wt_name }}
        </q-item-section>
      </q-item>
      <q-space />
    </template>

    <q-list :style="{ width: list_width + 'px' }">
      <q-separator />

      <div v-for="item in menu.childData">

        <item-menu v-if="item.childData && item.childData.length > 0" :list_width="list_width" :menu="item" @getItem="getNowItem" @click="getNowItem(menu)"></item-menu>

        <q-item v-else @click="getNowItem(item)" v-close-popup="(item.childData && item.childData.length > 0) ? false : true" clickable>
          <q-item-section side>
            <q-icon size="15px" color="primary" name="subdirectory_arrow_right"> </q-icon>
          </q-item-section>

          <q-item-section>
            {{ item.wt_name }}
          </q-item-section>
          <q-item-section side v-if="item.childData && item.childData.length > 0">
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
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
