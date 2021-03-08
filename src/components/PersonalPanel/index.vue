<template>
  <div class="personal-panel">
    <div class="personal-desc" :style="{ background: this.$store.state.app.themeColor }">
      <div class="avatar-container">
        <img class="avatar" :src="user.avatar" />
      </div>
      <div class="name-role">
        <span class="sender">{{ user.name }} - {{ user.role }}</span>
      </div>
      <div class="registe-info">
        <span class="registe-info">
          <li class="fa fa-clock-o"></li>
          {{dateFormat(user.createTime)}}
        </span>
      </div>
    </div>
    <!-- <div class="personal-relation">
      <span class="relation-item">followers</span>
      <span class="relation-item">watches</span>
      <span class="relation-item">friends</span>
    </div> -->
    <div class="main-operation">
      <span class="main-operation-item" @click="openPersonCenter">
        <el-button size="small" icon="fa fa-male"> 个人中心</el-button>
      </span>
      <span class="main-operation-item" @click="openupdatePasswordDialog">
        <el-button size="small" icon="fa fa-key"> 修改密码</el-button>
      </span>
    </div>
    <div class="other-operation">
      <div class="other-operation-item" @click="clearCache">
        <li class="fa fa-eraser"></li>
        清除缓存
      </div>
      <div class="other-operation-item" @click="openOnlinePage">
        <li class="fa fa-user"></li>
        在线人数 {{onlineUser}}
      </div>
      <div class="other-operation-item">
        <li class="fa fa-bell"></li>
        访问次数 {{accessTimes}}
      </div>
      <div class="other-operation-item">
        <li class="fa fa-undo"></li>
          备份恢复
      </div>
    </div>
    <div class="personal-footer" @click="logout">
      <li class="fa fa-sign-out"></li>
       退出
    </div>
    <!--修改密码界面-->
    <el-dialog title="修改密码" width="40%" :visible.sync="updatePwdDialogVisible" :close-on-click-modal="false"
      :modal="false">
      <el-form :model="updatePwdDataForm" label-width="100px" :rules="updatePwdDataFormRules" ref="updatePwdDataForm"
        :size="size">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="updatePwdDataForm.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="updatePwdDataForm.newPassword" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="comfirmPassword">
          <el-input v-model="updatePwdDataForm.comfirmPassword" type="password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="updatePwdDialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click.native="updatePassword" :loading="updatePwdLoading">
          确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="个人中心" width="40%" :visible.sync="personCenterDialogVisible" :close-on-click-modal="false"
      :modal="false">
      <el-form label-width="80px" :size="size">
        <avatar :imageUrl="dataForm.avatar" @onremove="onremove" @onsuccess="onsuccess"></avatar>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="personCenterDialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" @click.native="updatePersonal" :loading="updatePersonalLoading">
          确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findPage } from "@/api/loginlog"
import { logout, download, updatePassword ,updatePersonal } from "@/api/user"
import { format } from "@/utils/datetime"
import avatar from "@/components/avatar"
import { removeToken } from '@/utils/auth'
export default {
  name: "PersonalPanel",
  components: {
    avatar
  },
  props: {
    user: {
      id: 0,
      name: "",
      avatar: "",
      role: "",
      createTime: "",
      email: "",
      mobile: ""
    }
  },
  data () {
    return {
      imageUrl: 9,
      onlineUser: 0,
      accessTimes: 0,
      size: 'small',
      updatePwdDialogVisible: false,
      personCenterDialogVisible: false,
      updatePwdLoading: false,
      updatePersonalLoading: false,
      updatePwdDataForm: {
        password: '',
        newPassword: '',
        comfirmPassword: ''
      },
      // 个人信息
      dataForm: {
        id: '',
        name: '',
        avatar: '',
        avatarId: 0,
        password: '',
        deptId: '',
        deptName: '',
        email: '',
        mobile: '',
        status: '',
        userRoles: []
      },
      updatePwdDataFormRules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        comfirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 打开个人中心
    openPersonCenter: function () {
      this.personCenterDialogVisible = true
      this.dataForm = this.user
      // alert('待开发')
    },
    // 打开修改密码对话框
    openupdatePasswordDialog: function () {
      this.updatePwdDialogVisible = true
    },
    // 修改密码
    updatePassword: function () {
      this.$refs.updatePwdDataForm.validate((valid) => {
        if (valid) {
          if (this.updatePwdDataForm.newPassword != this.updatePwdDataForm.comfirmPassword) {
            this.$message({ message: '新密码与确认新密码不一致', type: 'error' })
            return
          }
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.updatePwdLoading = true
            let params = { password: this.updatePwdDataForm.password, newPassword: this.updatePwdDataForm.newPassword }
            updatePassword(params).then((res) => {
              this.updatePwdLoading = false
              if (res.code == 200) {
                this.$message({ message: '操作成功', type: 'success' })
                this.$refs['updatePwdDataForm'].resetFields()
                this.logoutApi()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                this.$refs['updatePwdDataForm'].resetFields()
              }
            })
          })
        }
      })
    },//修改个人信息
    updatePersonal () {
      console.log(this.dataForm)
      this.updatePersonalLoading = true
      updatePersonal(this.dataForm).then((res) => {
        const { code } = res
        if(code === 200){
           this.$message({ message: '个人信息更新成功！', type: 'success' })
        }
        this.updatePersonalLoading = false
      })

    },
    // 退出登录
    logout () {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.logoutApi()
        })
        .catch(() => { })
    },
    // 清除缓存并退出登录
    clearCache () {
      this.$confirm("确认清除缓存并退出登录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.deleteCookie('token')// 清空Cookie里的token
          var storage = window.localStorage;
          storage.clear()
          window.location.reload()
          this.logoutApi()
        })
        .catch(() => { })
    },
    logoutApi () {
      sessionStorage.removeItem("user")
      logout().then((res) => {
        removeToken()
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        var storage = window.localStorage;
        storage.clear()
        window.location.reload()
      }).catch(function (res) {
        console.log(res)
      })
    },
    // 清除Cookie
    deleteCookie (name) {
      removeToken()
      var myDate = new Date()
      myDate.setTime(-1000) // 设置过期时间     
      document.cookie = name + "=''; expires=" + myDate.toGMTString();
    },
    // 获取在线用户数
    countOnlineUser () {
      let pageRequest = { pageNum: 1, pageSize: 10000000 }
      pageRequest.params = { userName: '', status: 'online' }
      findPage(pageRequest).then((res) => {
        this.onlineUser = res.data.content.length
      })
    },
    // 获取访问次数
    countAccessTimes () {
      let pageRequest = { pageNum: 1, pageSize: 10000000 }
      pageRequest.params = { userName: '', status: 'login' }
      findPage(pageRequest).then((res) => {
        this.accessTimes = res.data.content.length + 1
      })
    },
    openOnlinePage () {
      // 通过菜单URL跳转至指定路由
      this.$router.push('/sys/online')
    },
    // 时间格式化
    dateFormat (date) {
      return format(date)
    },
    //图片上传成功回调
    onsuccess (res, file) {
      console.log(res.data);
      console.log(file);
      download(res.data.id).then((response) => {
        this.dataForm.avatar = response
        this.dataForm.avatarId = res.data.id
      })
    },//删除图片回调
    onremove () {
      this.dataForm.avatar = ""
    }
  },
  mounted () {
    this.countOnlineUser()
    this.countAccessTimes()
  }
};
</script>

<style scoped>
.personal-panel {
  font-size: 14px;
  width: 280px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-width: 1px;
  border-style: solid;
  background: rgba(182, 172, 172, 0.1);
  margin: -14px;
}
.personal-desc {
  background: rgb(20, 136, 154) none repeat scroll 0% 0%;
  padding: 15px;
  color: #fff;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 90px;
}
.name-role {
  font-size: 16px;
  padding: 5px;
}
.personal-relation {
  font-size: 16px;
  padding: 12px;
  margin-right: 1px;
  background: rgba(200, 209, 204, 0.3);
}
.relation-item {
  padding: 12px;
}
.relation-item:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
}
.main-operation {
  padding: 8px;
  margin-right: 1px;
  /* background: rgba(175, 182, 179, 0.3); */
  border-color: rgba(201, 206, 206, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.main-operation-item {
  margin: 15px;
}
.other-operation {
  padding: 15px;
  margin-right: 1px;
  text-align: left;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.other-operation-item {
  padding: 12px;
}
.other-operation-item:hover {
  cursor: pointer;
  background: #9e94941e;
  color: rgb(19, 138, 156);
}
.personal-footer {
  margin-right: 1px;
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.personal-footer:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
  background: #b1a6a61e;
}
</style>
