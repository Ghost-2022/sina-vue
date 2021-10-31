<!--suppress ALL -->
<template>
  <div class="login-container columnCC">
    <el-form ref="refloginForm" size="medium" class="login-form text-center" :rules="formRulesMixin">
      <div class="title-container">
        <h3 class="title text-center">{{ settings.title }}</h3>
      </div>
      <el-image style="width: 180px; height: 180px" :src="qrUrl" fit="scale-down">
        <template #error>
          <div class="image-slot" style="height: inherit; background-color: #f7f5fa">
            <i class="el-icon-picture-outline" style="vertical-align: middle"></i>
            <p>扫码登录</p>
          </div>
        </template>
      </el-image>
      <div class="tip-message">{{ tipMessage }}</div>
      <el-button :loading="loading" type="primary" class="login-btn" size="medium" @click.prevent="loginReq">
        Login
      </el-button>
    </el-form>
  </div>
</template>

<script>
/*可以设置默认的名字*/
export default {
  name: 'Login'
}
</script>

<script setup>
import { reactive, getCurrentInstance, watch, ref, onMounted } from 'vue'
import settings from '@/settings'
import { checkLoginStatus } from '@/api/user'
import { setToken } from '@/utils/auth'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
let { proxy } = getCurrentInstance()

let state = reactive({
  otherQuery: {},
  redirect: undefined
})

/* listen router change  */
const route = useRoute()
let getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

watch(
  route,
  (route) => {
    const query = route.query
    if (query) {
      state.redirect = query.redirect
      state.otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)

/*
 *  login relative
 * */
let loading = ref(false)
let tipMessage = ref('')
let qrUrl = ref('')
const store = useStore()
let timer = setInterval(() => {
  checkLoginStatus()
    .then((resp) => {
      console.log(resp)
      const { isLogin } = resp.data
      if (isLogin) {
        clearInterval(timer)
        setToken(isLogin)
        proxy.$router.push({ path: state.redirect || '/', query: state.otherQuery })
        ElMessage({ message: '登录成功', type: 'success' })
      }
    })
    .catch((err) => {})
}, 5000)

let loginReq = () => {
  loading.value = true
  store
    .dispatch('user/login')
    .then((resp) => {
      const { isLogin } = resp
      if (isLogin) {
        clearInterval(timer)
        setToken(isLogin)
        proxy.$router.push({ path: state.redirect || '/', query: state.otherQuery })
        ElMessage({ message: '登录成功', type: 'success' })
      } else {
        qrUrl.value = resp.image
        loading.value = false
      }
    })
    .catch((res) => {
      tipMessage.value = res.msg
      proxy.sleepMixin(30).then(() => {
        loading.value = false
      })
    })
}
onMounted(() => {
  loginReq()
})
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  height: 100vh;
  width: 100%;
  background-color: #2d3a4b;
  .login-form {
    margin-bottom: 20vh;
    width: 360px;
  }
  .title-container {
    .title {
      font-size: 22px;
      color: #eee;
      margin: 0px auto 25px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}

.svg-container {
  padding-left: 6px;
  color: $dark_gray;
  text-align: center;
  width: 30px;
}

//错误提示信息
.tip-message {
  color: #e4393c;
  height: 30px;
  margin-top: -12px;
  font-size: 12px;
}

//登录按钮
.login-btn {
  width: 100%;
  margin-bottom: 30px;
}
.show-pwd {
  width: 50px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  text-align: center;
}
</style>

<style lang="scss">
//css 样式重置 增加个前缀避免全局污染
.login-container {
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-input input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 10px 5px 10px 15px;
    color: #fff;
    height: 42px; //此处调整item的高度
    caret-color: #fff;
  }
}
</style>
