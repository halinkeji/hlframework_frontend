<template>
  <div class="full-width text-center">
    <div class="q-mt-xs">
      <q-avatar size="100px" color="grey-3" v-if="avatarImage && avatarImage.path">
        <q-img :src="$q.localStorage.getItem('fzchainstore_system_local').attach_url + avatarImage.path" width="100%" :ratio="1">

        </q-img>
      </q-avatar>
      <q-avatar size="100px" font-size="52px" color="primary" text-color="white" icon="perm_identity" v-else />
    </div>

    <div class="q-mt-sm">
      <q-btn color="primary" icon="cloud_upload" @click="openDialog" unelevated label="更换头像" />
    </div>

    <q-dialog v-model="selectAvatarDialog" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="q-py-sm row items-center">
          <div class="text-subtitle2">更换头像</div>
          <q-space />

            <q-btn round flat dense color="dark" @click="selectAvatarDialog = false" icon="close" />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="defaultAvatarGroup && defaultAvatarGroup.length > 0">
          <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择默认头像
          </div>
          <div class="row q-gutter-sm">
            <div
              @click="checkAvatar(item)"
              class="text-center"
              v-for="(item, key) in defaultAvatarGroup"
              :key="`avatar-${key}`"
              size="100px"
              :class="item.id == avatarId ? 'check-border' : ''"
            >
              <q-img :src="$q.localStorage.getItem('fzchainstore_system_local').attach_url + item.path" width="100px" height="100px">
                <template v-if="!item.path">
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
              </q-img>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            自定义头像
          </div>
          <div >
            <hl-upload
              :multiple="false"
              :currentAttach="coverImage"
              @input="changeAvatarImage"
            />
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="center">
          <q-btn class="q-px-xl" color="primary" @click="confirmCheck" unelevated>确认</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  props: {
    coverImage: {
      type: Object
    }
  },
  data () {
    return {
      avatarImage: {},
      avatarId: 0,
      defaultAvatarGroup: [],
      selectAvatarDialog: false
    }
  },
  created () {
    const systemLocal = LocalStorage.getItem('fzchainstore_system_local')
    if (systemLocal && systemLocal.defaultAvatarGroup && systemLocal.defaultAvatarGroup.length > 0) {
      this.defaultAvatarGroup = systemLocal.defaultAvatarGroup
    }
  },
  watch: {
    coverImage (val) {
      this.avatarImage = val && val.id ? val : {}
    }
  },
  computed: {},
  mounted () {},

  methods: {
    openDialog () {
      this.selectAvatarDialog = true
      this.avatarId = this.coverImage && this.coverImage.id ? this.coverImage.id : 0
    },
    checkAvatar (item) {
      this.avatarId = item.id
      this.avatarImage = item
    },
    confirmCheck () {
      this.selectAvatarDialog = false
      this.$nextTick(() => {
        this.$emit('confirmCheck', this.avatarId)
      })
    },
    changeAvatarImage (val, obj) {
      this.$nextTick(() => {
        this.avatarId = val
        this.avatarImage = obj
      })
    }
  }
}
</script>
<style scoped>
.check-border {
  border: 3px solid #1976D2;
}
</style>
