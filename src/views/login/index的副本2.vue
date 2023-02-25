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
    <script id="vertexshader" type="x-shader/x-vertex">
      attribute float scale;
      void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = scale *1.0 * ( 200.0 / - mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
      }

    </script>

    <script id="fragmentshader" type="x-shader/x-fragment">
      uniform vec3 color;
      void main() {
      if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.49 ) discard;
      gl_FragColor = vec4(0.0,1.0,1.0,1.0);
      }
    </script>
  </div>

</template>
<script>
import request from '@/utils/request'
import * as THREE from 'three'
// import Stats from '@/utils/stats.module.js'
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
      const SEPARATION = 100; const AMOUNTX = 50; const AMOUNTY = 50
      let container
      let camera, scene, renderer
      var particles; var count = 0

      var mouseX = 0; var mouseY = 0

      var windowHalfX = window.innerWidth / 2
      var windowHalfY = window.innerHeight / 2
      init()
      animate()

      function init() {
        container = document.getElementById('container')

        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 10, 10000)
        camera.position.z = 1200
        camera.position.set(944, 206, -262)
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        camera.updateProjectionMatrix()
        camera.updateMatrixWorld(true)
        scene = new THREE.Scene()

        //

        const numParticles = AMOUNTX * AMOUNTY

        const positions = new Float32Array(numParticles * 3)
        const scales = new Float32Array(numParticles)

        let i = 0; let j = 0

        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[ i ] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2) // x
            positions[ i + 1 ] = 0 // y
            positions[ i + 2 ] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2) // z

            scales[ j ] = 1

            i += 3
            j++
          }
        }
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

        const material = new THREE.ShaderMaterial({

          uniforms: {
            color: { value: new THREE.Color(0, 128, 128) }
          },
          vertexShader: document.getElementById('vertexshader').textContent,
          fragmentShader: document.getElementById('fragmentshader').textContent

        })
        particles = new THREE.Points(geometry, material)
        scene.add(particles)
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.appendChild(renderer.domElement)

        // stats = new Stats()
        // container.appendChild(stats.dom)

        container.style.touchAction = 'none'
        container.addEventListener('pointermove', onPointerMove)
        window.addEventListener('resize', onWindowResize)
        container.appendChild(renderer.domElement)
      }

      function onWindowResize() {
        windowHalfX = window.innerWidth / 2
        windowHalfY = window.innerHeight / 2

        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      function onPointerMove(event) {
        if (event.isPrimary === false) return

        mouseX = event.clientX - windowHalfX
        mouseY = event.clientY - windowHalfY
      }

      function animate() {
        requestAnimationFrame(animate)
        render()
      }

      function render() {
        camera.position.x += (mouseX - camera.position.x) * 0.05
        camera.position.y += (-mouseY - camera.position.y) * 0.05
        camera.lookAt(scene.position)

        const positions = particles.geometry.attributes.position.array
        const scales = particles.geometry.attributes.scale.array

        let i = 0; let j = 0

        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[ i + 1 ] = (Math.sin((ix + count) * 0.3) * 50) +
										(Math.sin((iy + count) * 0.5) * 50)

            scales[ j ] = (Math.sin((ix + count) * 0.3) + 1) * 20 +
										(Math.sin((iy + count) * 0.5) + 1) * 20
            i += 3
            j++
          }
        }
        particles.geometry.attributes.position.needsUpdate = true
        particles.geometry.attributes.scale.needsUpdate = true

        renderer.render(scene, camera)
        count += 0.1
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
