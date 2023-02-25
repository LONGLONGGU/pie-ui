<template>
  <div class="headbar">
    <div class="logo">
      <div>pie</div>
    </div>
    <div class="to-menu">
      <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal" background-color="rgb(20, 136, 154)" text-color="#fff" active-text-color="#fff" router>
        <el-menu-item v-for="item in topMenu" :key="item.path" :index="item.path">
          <!-- <i style="vertical-align: middle;margin-right: 5px;width: 24px;text-align: center; font-size: 18px;" :class="item.icon" /> -->
          <!-- {{ item.name }} -->
          <item :icon="item.icon" :title="item.name" />
        </el-menu-item>
      </el-menu>
    </div>
    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
    <span class="toolbar">
      <el-menu class="el-menu-demo" background-color="rgb(20, 136, 154)" active-text-color="rgb(20, 136, 154)" mode="horizontal">
        <el-menu-item v-popover:popover-message index="1">
          <!-- 我的私信 -->
          <el-badge :value="0" :max="99" class="badge">
            <li style="color:#fff;display: block;" class="fa fa-envelope-o fa-lg" />
          </el-badge>
          <el-popover ref="popover-message" placement="bottom-end" trigger="click">
            <message-panel />
          </el-popover>
        </el-menu-item>
        <el-menu-item v-popover:popover-notice index="2">
          <!-- 系统通知 -->
          <el-badge :value="0" :max="99" class="badge">
            <li style="color:#fff;display: block;" class="fa fa-bell-o fa-lg" />
          </el-badge>
          <el-popover ref="popover-notice" placement="bottom-end" trigger="click">
            <notice-panel />
          </el-popover>
        </el-menu-item>
        <el-menu-item v-popover:popover-personal index="3">
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar">{{ user.nickName }}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="user" />
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>
<script>
import { findByName, download } from '@/api/admin-server/user'
import { mapGetters } from 'vuex'
import store from '@/store'
import Item from '../Sidebar/Item'
import MessagePanel from '@/components/MessagePanel'
import NoticePanel from '@/components/NoticePanel'
import PersonalPanel from '@/components/PersonalPanel'

export default {
  components: {
    Item,
    MessagePanel,
    NoticePanel,
    PersonalPanel

  },
  data() {
    return {
      user: {
        id: 0,
        name: '',
        avatar: require('@/assets/user.png'),
        avatarId: 0,
        role: '',
        createTime: '',
        email: '',
        mobile: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'routes',
      'name'
    ]),
    topMenu() {
      const menus = []
      this.routes.forEach(item => {
        if (!item.hidden) {
          menus.push(item)
        }
      })
      return menus
    },
    // 选中激活菜单
    defaultActive: function () {
      let pathname = this.$route.path
      console.log(pathname)
      if (pathname.lastIndexOf('/') === 0) {
        pathname = pathname.substring(1)
      } else {
        pathname = pathname.substring(1)
        pathname = pathname.substring(0, pathname.indexOf('/'))
      }
      pathname = '/' + pathname
      const to = this.topMenu.filter(el => {
        return el.path === pathname
      })[0]
      if (to === undefined) return this.$route.path
      this.handleSelect(to)
      return pathname
    }
  },
  mounted() {
    findByName({ name: this.name }).then((res) => {
      const { id, name, nickName, avatarId, createTime, email, mobile } = res.data
      this.user.id = id
      this.user.name = name
      this.user.nickName = nickName
      this.user.avatarId = avatarId
      this.user.createTime = createTime
      this.user.email = email
      this.user.mobile = mobile
      if (this.user) {
        if (avatarId != null) {
          download(avatarId).then((response) => {
            this.user.avatar = response
          })
        } else {
          this.user.avatar = require('@/assets/user.png')
        }
      }
    })
  },
  methods: {
    handleSelect: function (to) {
      store.dispatch('permission/generateSideBarMenus', to)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.headbar {
  background-color: rgb(20, 136, 154);
  height: 60px;
  .logo {
    height: 60px;
    line-height: 60px;
    float: left;
    width: 210px;
    div {
      font-size: 25px;
      color: white;
      text-align: left;
      padding-left: 20px;
    }
  }
  .to-menu {
    float: left;
  }
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;

  &:focus {
    outline: none;
  }
  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;
    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.toolbar {
  float: right;
  background-color: rgb(20, 136, 154);
  height: 60px;
}
.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
}
</style>
