<template>
  <q-expansion-item v-if="isExpansionItem(item)"
    :dense-toggle="level!==1"
    :content-inset-level="0.4"
    :group="uniqueOpened?('menu'+level):('menu' + randomAlphaNumber())"
    :expand-separator="level===1"
    :dense="false"
    :default-opened="false"
    :duration="300"
    @input="expansionItemInput"
  >
    <template v-slot:header>
      <q-item-section avatar v-if="item.icon">
        <q-icon :style="iconColor2(item.iconColor)" :name="item.icon" :size="level===1?'sm':'sm'"/>
      </q-item-section>

      <q-item-section>
        <q-item-label :style="iconColor2()">{{item.title}}</q-item-label>
        <q-item-label caption v-if="item.caption" :style="captionColor()">{{item.caption}}</q-item-label>
      </q-item-section>
    </template>

    <side-menu ref="menu" v-for="(child) in item.children" :key="child.path"
      :route-item="child" :base-path="item.path" :level="level+1">
    </side-menu>
  </q-expansion-item>

  <q-item v-else-if="isExternalItem(item)"
      :dense="false"
      :ref="'route-'+item.path"
      clickable tag="a" target="_blank"
      :href="item.path">
    <q-item-section avatar v-if="item.icon">
      <q-icon :style="iconColor2(item.iconColor)" :name="item.icon" :size="level===1?'sm':'sm'"/>
    </q-item-section>
    <q-item-section>
      <q-item-label :style="iconColor2()">{{item.title}}</q-item-label>
      <q-item-label caption v-if="item.caption" :style="captionColor()">{{item.caption}}</q-item-label>
    </q-item-section>
  </q-item>

  <q-item v-else-if="isRouteItem(item)"
    :dense="false"
    :ref="'route-'+item.path"
    :to="item.path"
    exact
    active-class="hl-sidebar-menu-active"
  >
    <q-item-section avatar v-if="item.icon">
      <q-icon :style="iconColor2(item.iconColor)" :name="item.icon" :size="level===1?'sm':'sm'"/>
    </q-item-section>
    <q-item-section>
      <q-item-label :style="iconColor2()">{{item.title}}</q-item-label>
      <q-item-label caption v-if="item.caption" :style="captionColor()">{{item.caption}}</q-item-label>
    </q-item-section>
  </q-item>

</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { random } from '@/utils/index'
import { isExternal } from '@/utils/validate'

export default {
  name: 'SideMenu',
  props: {
    /* 1..n，1代表最顶级菜单 */
    level: {
      type: Number,
      required: true
    },
    routeItem: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('settings', [
      'uniqueOpened',
      'colorMenuText'
    ]),
    iconColor2 () {
      return function (color) {
        let c = color
        if (!c) {
          c = this.colorMenuText
        }
        return {
          color: c
        }
      }
    },
    /*
     * 把 routeItem 转换成如下的简单格式
     * { path:/yy/xxx, name: xxx, title: xxx, caption: xxx, icon: xxx, iconColor:yyy, children: []  }
     */
    item () {
      const ri = this.routeItem
      if (!ri || ri.hidden) {
        return undefined
      }
      const meta = ri.meta || {}
      if (!ri.children || ri.children.length === 0) {
        return { path: this.resolvePath(ri.path), name: ri.name, title: meta.title, caption: meta.caption, icon: meta.icon, iconColor: meta.iconColor, position: ri.position }
      }
      let allChildHide = true
      for (const child of ri.children) {
        if (!child.hidden) {
          allChildHide = false
          break
        }
      }
      if (allChildHide) {
        return undefined
      }
      if (ri.children.length === 1 && !ri.alwaysShow) {
        const child = ri.children[0]
        const m = child.meta || {}
        if (isExternal(child.path)) {
          return { path: child.path, name: child.name, title: m.title, caption: meta.caption, icon: m.icon, iconColor: meta.iconColor, position: child.position }
        }
        return { path: path.resolve(this.resolvePath(ri.path), child.path), name: child.name, title: m.title, caption: meta.caption, icon: m.icon, iconColor: meta.iconColor, position: child.position }
      } else {
        return { path: this.resolvePath(ri.path), name: ri.name, title: meta.title, caption: meta.caption, icon: meta.icon, iconColor: meta.iconColor, children: ri.children, position: ri.position }
      }
    }
  },
  methods: {
    captionColor () {
      return {
        color: 'yellow'
      }
    },
    randomAlphaNumber () {
      return random() + ''
    },
    isRouteItem (item) {
      if (!item) {
        return undefined
      }

      if (parseInt(item.position) != 2) {
        return false
      }
      return item
    },
    isExternalItem (item) {
      if (!item) {
        return undefined
      }

      if (parseInt(item.position) != 2) {
        return false
      }
      if (item.path && isExternal(item.path)) {
        return true
      } else {
        return false
      }
    },
    isExpansionItem (item) {
      if (!item) {
        return undefined
      }

      if (parseInt(item.position) != 2) {
        return false
      }
      if (!item.children || item.children.length === 0) {
        return false
      }
      return true
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    iconColor (color) {
      if (color) {
        return color
      } else {
        return this.colorMenuText
      }
    },
    expansionItemInput (value) {
      // console.log(value)
    }
  }
}
</script>
