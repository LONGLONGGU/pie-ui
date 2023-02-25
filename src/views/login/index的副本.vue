<template>
  <div>
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">Login Form</h3>
        </div>

        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="account"
            v-model="loginForm.account"
            placeholder="account"
            name="account"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item prop="captcha">
              <span class="svg-container">
                <svg-icon icon-class="captcha" />
              </span>
              <el-input
                v-model="loginForm.captcha"
                placeholder="验证码"
                name="captcha"
                tabindex="2"
                auto-complete="on"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <img :src="captchaSrc" style="margin-right:20px;width: 100%;height: 52px;cursor: pointer" @click="getCaptchaInfo">
          </el-col>
        </el-row>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

        <div class="tips">
          <span style="margin-right:20px;">username: SuperAdmin</span>
          <span> password: 123456</span>
        </div>

      </el-form>
    </div>
    <div id="container" />
  </div>

</template>
<script>
import request from '@/utils/request'
import * as THREE from 'three'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        account: 'SuperAdmin',
        password: '123456',
        captcha: '',
        captToken: '',
        src: ''
      },
      base64Prefix: 'data:image/png;base64,',
      captchaSrc: '',
      loginRules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getCaptchaInfo()
    this.init()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((response) => {
            const { code, msg } = response
            if (code !== 200) {
              this.$message({ message: '登录失败, ' + msg, type: 'error' })
            }
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((error) => {
            console.log(error)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCaptcha() {
      this.captchaSrc = process.env.VUE_APP_BASE_API + '/pie-admin/captcha.jpg?picId=' + Math.random()
    },
    // 获取验证码信息
    getCaptchaInfo() {
      request({
        url: process.env.VUE_APP_BASE_API + '/pie-admin/getLoginCaptcha?picId=' + Math.random(),
        method: 'get'
      }).then(response => {
        const { capToken, imageInfo } = response.data
        this.captchaSrc = this.base64Prefix + imageInfo
        this.loginForm.captToken = capToken
      })
    },

    init() {
      const container = document.getElementById('container')
      const SCREEN_WIDTH = window.innerWidth
      const SCREEN_HEIGHT = window.innerHeight
      const r = 450
      let mouseY = 0
      let windowHalfY = window.innerHeight / 2
      let camera; let scene; let renderer
      init()
      animate()
      function init() {
        camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000)
        camera.position.z = 1000

        scene = new THREE.Scene()

        const parameters = [[0.25, 0xff7700, 1], [0.5, 0xff9900, 1], [0.75, 0xffaa00, 0.75], [1, 0xffaa00, 0.5], [1.25, 0x000833, 0.8],
          [3.0, 0xaaaaaa, 0.75], [3.5, 0xffffff, 0.5], [4.5, 0xffffff, 0.25], [5.5, 0xffffff, 0.125]]

        const geometry = createGeometry()

        for (let i = 0; i < parameters.length; ++i) {
          const p = parameters[ i ]

          const material = new THREE.LineBasicMaterial({ color: p[ 1 ], opacity: p[ 2 ] })
          const line = new THREE.LineSegments(geometry, material)
          line.scale.x = line.scale.y = line.scale.z = p[ 0 ]
          line.userData.originalScale = p[ 0 ]
          line.rotation.y = Math.random() * Math.PI
          line.updateMatrix()
          scene.add(line)
        }
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        document.body.appendChild(renderer.domElement)
        document.body.style.touchAction = 'none'
        document.body.addEventListener('pointermove', onPointerMove)

        window.addEventListener('resize', onWindowResize)

        setInterval(function() {
          const geometry = createGeometry()
          scene.traverse(function(object) {
            if (object.isLine) {
              object.geometry.dispose()
              object.geometry = geometry
            }
          })
        }, 1000)
      }
      function createGeometry() {
        const geometry = new THREE.BufferGeometry()
        const vertices = []

        const vertex = new THREE.Vector3()

        for (let i = 0; i < 1500; i++) {
          vertex.x = Math.random() * 2 - 1
          vertex.y = Math.random() * 2 - 1
          vertex.z = Math.random() * 2 - 1
          vertex.normalize()
          vertex.multiplyScalar(r)

          vertices.push(vertex.x, vertex.y, vertex.z)

          vertex.multiplyScalar(Math.random() * 0.09 + 1)

          vertices.push(vertex.x, vertex.y, vertex.z)
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        return geometry
      }
      function onWindowResize() {
        windowHalfY = window.innerHeight / 2

        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      function onPointerMove(event) {
        if (event.isPrimary === false) return

        mouseY = event.clientY - windowHalfY
      }
      function animate() {
        requestAnimationFrame(animate)
        render()
      }
      function render() {
        camera.position.y += (-mouseY + 200 - camera.position.y) * 0.05
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        container.appendChild(renderer.domElement)
        const time = Date.now() * 0.0001

        for (let i = 0; i < scene.children.length; i++) {
          const object = scene.children[ i ]

          if (object.isLine) {
            object.rotation.y = time * (i < 4 ? (i + 1) : -(i + 1))

            if (i < 5) {
              const scale = object.userData.originalScale * (i / 5 + 1) * (1 + 0.5 * Math.sin(7 * time))

              object.scale.x = object.scale.y = object.scale.z = scale
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  z-index: 99999;
  position: fixed;
  min-height: 100%;
  width: 100%;
  color:white;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
