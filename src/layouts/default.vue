<template>
  <el-container class="default-layout">
    <el-header class="default-layout-header">
      <div class="default-layout-header-logo">
        <svg-icon class="logo-icon" icon-class="dr-logo" />
        <h1>DEEPEXI 数字化零售平台</h1>
      </div>
      <el-dropdown class="user-operate" @command="handleDropdown">
        <span class="el-dropdown-link">
          {{ user.username || 'guest' }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="LOGOUT">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container class="default-layout-container">
      <div :class="{collapsed: isCollapse}" class="nav-menu">
        <ul class="nav-menu__main">
          <li
            v-for="menu in menuList"
            :key="menu.id"
            :class="{active: currentMainPath == menu.name}"
            @click="mainNavClick(menu)"
          >
            <icon-font :icon="menu.iconUrl" prefix></icon-font>
            <span v-show="!isCollapse">{{ menu.name }}</span>
          </li>
          <p class="collapse-btn">
            <span class="iconfont iconshouqi" @click="toggleMenuShow"></span>
          </p>
        </ul>

        <transition name="slide">
          <ul v-show="!isCollapse && subMenuList.length > 0" class="nav-menu__sub">
            <li
              v-for="subMenu in subMenuList"
              :key="subMenu.id"
              :class="{active: currentSubPath == subMenu.name}"
              @click="subNavClick(subMenu)"
            >
              <span>{{ subMenu.name }}</span>
            </li>
          </ul>
        </transition>
      </div>

      <el-container class="default-layout-main">
        <el-header v-if="$route.path !== '/'" height="50px" class="default-layout-crumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(crumb, i) in breadcrumbList" :key="crumb.name">
              <span v-if="i == breadcrumbList.length - 1">
                {{
                crumb.meta.title || crumb.name
                }}
              </span>
              <nuxt-link v-else :to="{path: crumb.path}">
                {{
                crumb.meta.title || crumb.name
                }}
              </nuxt-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main class="default-layout-content">
          <section style="width: 100%; min-height: 100%; background: #fff; position:relative;">
            <nuxt></nuxt>
          </section>
        </el-main>
        <el-footer class="default-layout-footer" height="50px">
          <copyright></copyright>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Copyright from '@/components/copyright.vue'
import MenuItem from '@/components/menu-item.vue'

export default {
  components: {
    Copyright,
    MenuItem,
  },
  data() {
    return {
      currentMainPath: '',
      currentSubPath: '',
      isCollapse: false,
      subMenuList: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.user || {}
    },
    menuList() {
      return this.$store.state.menuList
    },
    breadcrumbList() {
      return this.$store.state.breadcrumbList
    },
    path() {
      return this.$route.path
    },
  },
  methods: {
    handleDropdown(e) {
      this.$store.commit('LOGOUT')
    },
    toggleMenuShow() {
      this.isCollapse = !this.isCollapse
    },
    gotoRoute(path) {
      if (this.path != path) {
        this.$router.push({path})
      }
    },
    mainNavClick(menu) {
      this.currentMainPath = menu.name
      this.subMenuList = menu.children || []
      const defaultMenu = this.subMenuList[0]

      if (defaultMenu) {
        // 默认进入第一个路由
        this.currentSubPath = defaultMenu.name
        this.gotoRoute(defaultMenu.pathUrl)
      } else {
        // 如果没有二级菜单，点击就进去路由
        menu.pathUrl && this.gotoRoute(menu.pathUrl)
      }
    },
    subNavClick(subMenu) {
      this.currentSubPath = subMenu.name
      this.gotoRoute(subMenu.pathUrl)
    },
  },
}
</script>

<style lang="less">
.default-layout {
  height: 100vh;

  &-header {
    background-color: #192e56;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-logo {
      display: flex;
      align-items: center;

      .logo-icon {
        margin-right: 10px;
        width: 22px !important;
        height: 22px !important;
      }

      h1 {
        font-size: 18px;
        color: #fff;
        font-weight: 400;
      }
    }

    .user-operate {
      float: right;
      line-height: 60px;

      .el-dropdown-link {
        color: #fff !important;
      }
    }
  }

  &-container {
    height: calc(100vh - 60px);
  }

  .default-layout-sider {
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.15);
    z-index: 10;
  }

  .default-layout-main {
    background-color: #f0f2f5;

    .default-layout-crumb {
      background-color: #fff;
      box-shadow: 0 1px 0 0 rgba(232, 232, 232, 1);
      display: flex;

      .el-breadcrumb {
        flex: 1;
        align-items: center;
        display: flex;
      }
    }

    .default-layout-content {
      min-height: calc(100vh - 160px);
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px 20px 0 20px;
    }
  }

  &-footer {
    overflow: hidden;
  }

  .nav-menu {
    display: flex;
    font-size: 14px;

    &.collapsed {
      .collapse-btn {
        transform: rotate(180deg);
      }

      .nav-menu__main {
        min-width: 30px;

        li {
          min-width: 30px;
        }
      }
    }

    &__main {
      box-sizing: border-box;
      display: inline-block;
      padding-left: 6px;
      min-width: 80px;
      position: relative;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.15);

      .collapse-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
        transition: transform 0.5s ease;
        transform: rotate(0deg);

        .iconfont {
          color: #8c8e9a;
          cursor: pointer;
        }
      }

      li {
        height: 40px;
        margin: 10px 0;
        padding: 0 6px 0 10px;
        display: flex;
        align-items: center;
        min-width: 74px;
        cursor: pointer;

        .iconfont {
          color: #2878ff;
          margin-right: 4px;
        }

        span {
          white-space: nowrap;
        }

        &.active {
          background: #2878ff;
          border-radius: 100px 0 0 100px;
          color: #fff;

          .iconfont {
            color: #fff;
          }
        }
      }
    }

    &__sub {
      display: inline-block;
      padding: 10px;
      min-width: 120px;
      box-sizing: border-box;
      box-shadow: 2px 0px 4px -3px rgba(0, 0, 0, 0.15);
      z-index: 1;
      
      li {
        height: 50px;
        padding: 9px 0 9px 2px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        min-width: 100px;
        white-space: nowrap;
        cursor: pointer;

        span {
          display: block;
          width: 100%;
          height: 100%;
          padding: 0 5px 0 8px;
          line-height: 32px;
          border-radius: 4px;
        }

        &.active {
          span {
            color: #2878ff;
            background: rgba(40, 120, 255, 0.08);
          }
        }
      }
    }
  }
}
</style>
