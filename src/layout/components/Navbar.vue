<template>
  <div class="navbar rowBC">
    <div class="rowSC">
      <hamburger
        v-if="settings.showHamburger"
        :is-active="opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container" />
    </div>
    <!--nav title-->
    <div class="heardCenterTitle" v-if="settings.showTitle">{{ settings.title }}</div>
    <div class="right-menu rowSC" v-if="settings.ShowDropDown">
      <el-dropdown trigger="click" size="medium">
        <div class="avatar-wrapper">
          <img
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ nickName }}</el-dropdown-item>
            <el-dropdown-item divided @click="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import { computed, getCurrentInstance } from 'vue'
import settings from '@/settings'
import { ElMessage } from 'element-plus'
import { removeToken } from '@/utils/auth'
let { proxy } = getCurrentInstance()
const opened = computed(() => {
  return proxy.$store.state.app.sidebar.opened
})
const toggleSideBar = () => {
  proxy.$store.commit('app/M_toggleSideBar')
}

let nickName = localStorage.getItem('user')

/*
 * 退出登录
 * */
const loginOut = () => {
  removeToken()
  ElMessage({ message: '退出登录成功', type: 'success' })
  proxy.$router.push(`/login?redirect=${proxy.$route.fullPath}`)
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $navBarHeight;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

//logo
.avatar-wrapper {
  margin-top: 5px;
  position: relative;
  cursor: pointer;

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

//center-title
.heardCenterTitle {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 46%;
  font-weight: 600;
  font-size: 20px;
  transform: translate(-50%, -50%);
}

//drop-down
.right-menu {
  cursor: pointer;
  margin-right: 40px;
}
</style>
