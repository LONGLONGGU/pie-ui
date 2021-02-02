<template>
  <el-row type="flex">
    <el-col :span="8">
      <!--工具栏-->
      <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="公众号账号" />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              label="查询"
              perms="sys:role:view"
              type="primary"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-check"
              label="保存"
              perms="sys:role:add"
              type="primary"
              @click="saveMenu"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-upload"
              label="发布"
              perms="sys:role:add"
              type="primary"
            />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="loading"
        :data="pageResult.content"
        highlight-current-row
        :size="size"
        style="width: 100%"
        @current-change="currentchange"
      >
        <el-table-column
          prop="id"
          label="ID"
        />
        <el-table-column
          prop="name"
          label="企业名称"
        />
        <el-table-column
          prop="account"
          label="公众号账号"
        />
      </el-table>
      <pagination
        v-show="pageRequest.total>0"
        :total="pageRequest.total"
        :page.sync="pageRequest.pageNum"
        :limit.sync="pageRequest.pageSize"
        @pagination="findPage"
      />
    </el-col>
    <el-col :span="16">
      <div class="public-account-management clearfix">
        <div class="left">
          <div class="menu clearfix">
            <div v-for="(item, i) of menu.button" :key="i" class="menu_bottom">
              <!-- 一级菜单 -->
              <div class="menu_item" :class="{'active': isActive == i}" @click="menuFun(i,item)">{{ item.name }}</div>
              <!--以下为二级菜单-->
              <div v-if="isSubMenuFlag == i" class="submenu">
                <div v-for="(subItem, k) in item.sub_button" :key="k" class="subtitle">
                  <div class="menu_subItem" :class="{'active': isSubMenuActive == i + '' +k}" @click="subMenuFun(item, subItem, i, k)">{{ subItem.name }}</div>
                </div>
                <!--  二级菜单加号， 当长度 小于  5 才显示二级菜单的加号  -->
                <div v-if="item.sub_button.length < 5" class="menu_bottom menu_addicon" @click="addSubMenu(item)"><i class="el-icon-plus" /></div>
              </div>
            </div>
            <!-- 一级菜单加号 -->
            <div v-if="menuKeyLength < 3" class="menu_bottom menu_addicon" @click="addMenu"><i class="el-icon-plus" /></div>
          </div>
        </div>
        <!--右边配置-->
        <div v-if="!showRightFlag" class="right">
          <div class="configure_page">
            <div class="delete_btn">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteMenu(tempObj)">删除当前菜单</el-button>
            </div>
            <div>
              <span>菜单名称：</span>
              <el-input v-model="tempObj.name" class="input_width" placeholder="请输入菜单名称" clearable />
            </div>

            <div>
              <div class="menu_content">
                <span>菜单内容：</span>
                <el-radio-group v-model="tempObj.type">
                  <!-- <el-radio :label="'media_id'">发送素材</el-radio> -->
                  <el-radio :label="'view'">跳转链接</el-radio>
                  <!-- <el-radio :label="'click'">发送关键词</el-radio>
                  <el-radio :label="'miniprogram'">小程序</el-radio> -->
                </el-radio-group>
              </div>
              <div class="configur_content">
                <div v-if="tempObj.type == 'media_id'" class="material">
                  <span>素材内容：</span>
                  <el-input v-model="tempObj.media_id" class="input_width" placeholder="素材名称" :disabled="true" />
                  <!--下面点击“选择素材”按钮，弹框框-->
                  <el-popover
                    v-model="visible2"
                    placement="left"
                    width="700"
                  >
                    <el-table
                      :data="tableData"
                      style="width: 100%"
                    >
                      <el-table-column
                        label="文件名"
                        width="600"
                      >
                        <template slot-scope="scope">
                          <el-popover trigger="hover" placement="top">
                            <p>文件名: {{ scope.row.name }}</p>
                            <div slot="reference" class="name-wrapper">
                              <el-tag size="medium">{{ scope.row.name }}</el-tag>
                            </div>
                          </el-popover>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                          >选择</el-button>
                        </template>
                      </el-table-column>
                    </el-table>

                    <el-button slot="reference" type="success">选择素材</el-button>
                  </el-popover>

                  <p class="blue">tips:需要调后台获取到内容，弹框出来，然后选择，把名字赋值上去！</p>
                </div>
                <div v-if="tempObj.type == 'view'">
                  <span>跳转链接：</span>
                  <el-input v-model="tempObj.url" class="input_width" placeholder="请输入链接" clearable />
                </div>
                <!-- <div v-if="tempObj.type == 'click'">
                  <div>
                    <span>关键词：</span>
                    <el-input v-model="tempObj.key" class="input_width" placeholder="请输入关键词" clearable />
                  </div>
                  <p class="blue">tips:这里需要配合关键词推送消息一起使用</p>
                </div> -->
                <div v-if="tempObj.type == 'miniprogram'">
                  <div class="applet">
                    <span>小程序的appid：</span>
                    <el-input v-model="tempObj.appid" class="input_width" placeholder="请输入小程序的appid" clearable />
                  </div>
                  <div>
                    <span>小程序的页面路径：</span>
                    <el-input v-model="tempObj.pagepath" class="input_width" placeholder="请输入小程序的页面路径，如：pages/index" clearable />
                  </div>
                  <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上哟！</p>
                </div>
              </div>
            </div>

          </div>
          <div>menu对象值：{{ menu }}</div>
        </div>
        <!--一进页面就显示的默认页面，当点击左边按钮的时候，就不显示了-->
        <div v-if="showRightFlag" class="right">
          <p>请选择菜单配置</p>
        </div>
      </div>
    </el-col>
  </el-row>

</template>
<script>
import KtButton from '@/components/KtButton'
import Pagination from '@/components/Pagination'
import { findPage } from '@/api/wechatinfo'
import { findMenu, saveMenu } from '@/api/wechatmenu'
export default {
  components: {
    KtButton,
    Pagination
  },
  data() {
    return {
      size: 'small',
      filters: { name: '' },
      loading: false,
      pageRequest: { pageNum: 1, pageSize: 10, total: 0 },
      pageResult: {},
      showRightFlag: true, // 右边配置显示默认详情还是配置详情
      menu: {
        // // 一级菜单
        button: [
          // {
          //   type: 'click',
          //   name: '菜单1',
          //   // key: "menu1",关键词
          //   url: '', // 跳转链接
          //   media_id: '', // 素材名称--图文消息
          //   sub_button: [
          //     // {
          //     //   type: '', // media_id:素材内容; view:跳转链接
          //     //   name: '子菜单1',
          //     //   url: '', // 跳转链接
          //     //   media_id: '' // 素材名称--图文消息
          //     // }
          //   ]
          // }
        ]
      }, // 横向菜单
      isActive: -1, // 一级菜单点中样式
      isSubMenuActive: -1, // 一级菜单点中样式
      isSubMenuFlag: -1, // 二级菜单显示标志
      tempObj: {
        type: 'view', // media_id:素材内容; view:跳转链接
        name: '', // 菜单名称
        material: '', // 素材名称
        link: '' // 跳转链接
      }, // 右边临时变量，作为中间值牵引关系
      tempSelfObj: {
        // 一些临时值放在这里进行判断，如果放在tempObj，由于引用关系，menu也会多了多余的参数
        grand: '', // 1:表示一级菜单； 2:表示二级菜单
        index: '', // 表示一级菜单索引
        secondIndex: '' // 表示二级菜单索引
      },
      visible2: false, // 素材内容  "选择素材"按钮弹框显示隐藏
      tableData: [], // 素材内容弹框数据,
      wechatinfoId: null

    }
  },
  computed: {
    // menuObj的长度，当长度 小于  3 才显示一级菜单的加号
    menuKeyLength: function() {
      return this.menu.button.length
    }
  },
  created() {
    this.findPage()
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.loading = true
      this.pageRequest.params = { name: '', value: this.filters.name }
      findPage(this.pageRequest).then((res) => {
        this.loading = false
        this.pageResult = res.data
        this.pageRequest.total = this.pageResult.totalSize
        this.pageRequest.pageNum = this.pageResult.pageNum
        this.pageRequest.pageSize = this.pageResult.pageSize
      }).then(data != null ? data.callback : '')
    },
    currentchange(data) {
      this.wechatinfoId = data.id
      this.findMenu(data.id)
    },
    findMenu(id) {
      findMenu(id).then(response => {
        const { data } = response
        if (data !== null) {
          this.menu = JSON.parse(data.menu)
        } else {
          this.menu = { button: [] }
        }
      })
    },
    addMenu() {
      // 先判断1，再判断2,对象增加，会进行往下计算，所以必须先判断2，再判断1
      if (this.menuKeyLength === 2) {
        this.$set(this.menu.button, '2',
          {
            // type: "",
            name: '菜单3',
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
            sub_button: []
          }
        )
      }
      if (this.menuKeyLength === 1) {
        this.$set(this.menu.button, '1',
          {
            // type: "",
            name: '菜单2',
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
            sub_button: []
          }
        )
      }
      if (this.menuKeyLength === 0) {
        this.$set(this.menu.button, '0',
          {
            // type: "",
            name: '菜单1',
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
            sub_button: []
          }
        )
        // console.log(this.menu)
      }
    },
    // 一级菜单点击事件
    menuFun(i, item) {
      this.showRightFlag = false// 右边菜单隐藏
      // console.log(i);
      this.tempObj = item// 这个如果放在顶部，flag会没有。因为重新赋值了。
      this.tempSelfObj.grand = '1'// 表示一级菜单
      this.tempSelfObj.index = i// 表示一级菜单索引

      this.isActive = i // 一级菜单选中样式
      this.isSubMenuFlag = i // 二级菜单显示标志
      this.isSubMenuActive = -1 // 二级菜单去除选中样式
    },
    // 二级菜单点击事件
    // 二级菜单点击事件
    subMenuFun(item, subItem, index, k) {
      this.showRightFlag = false// 右边菜单隐藏
      this.tempObj = subItem// 将点击的数据放到临时变量，对象有引用作用
      this.tempSelfObj.grand = '2'// 表示二级菜单
      this.tempSelfObj.index = index// 表示一级菜单索引
      this.tempSelfObj.secondIndex = k// 表示二级菜单索引
      this.isSubMenuActive = index + '' + k // 二级菜单选中样式
      this.isActive = -1// 一级菜单去除样式
    },

    // 添加横向二级菜单
    addSubMenu(item) {
      const subMenuKeyLength = item.sub_button.length// 获取二级菜单key长度
      if (subMenuKeyLength === 4) {
        this.$set(item.sub_button, '4',
          {
            // type: "",
            name: '子菜单5'
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
          }
        )
      }
      if (subMenuKeyLength === 3) {
        this.$set(item.sub_button, '3',
          {
            // type: "",
            name: '子菜单4'
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
          }
        )
      }
      if (subMenuKeyLength === 2) {
        this.$set(item.sub_button, '2',
          {
            // type: "",
            name: '子菜单3'
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
          }
        )
      }
      if (subMenuKeyLength === 1) {
        this.$set(item.sub_button, '1',
          {
            // type: "",
            name: '子菜单2'
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
          }
        )
      }
      if (subMenuKeyLength === 0) {
        this.$set(item.sub_button, '0',
          {
            // type: "",
            name: '子菜单1'
            // url: "",//跳转链接
            // media_id:"",//素材名称--图文消息
          }
        )
      }
    },
    deleteMenu(obj) {
      this.deleteData()
    },
    saveMenu() {
      console.log(this.menu)
      const wechatMneu = { wechatinfoId: this.wechatinfoId, menu: JSON.stringify(this.menu) }
      saveMenu(wechatMneu).then(response => {
        this.$message({ message: '操作成功', type: 'success' })
      })
    },
    // 删除菜单数据
    deleteData() {
      // 一级菜单的删除方法
      if (this.tempSelfObj.grand === '1') {
        this.menu.button.splice(this.tempSelfObj.index, 1)
      }
      // 二级菜单的删除方法
      if (this.tempSelfObj.grand === '2') {
        this.menu.button[this.tempSelfObj.index].sub_button.splice(this.tempSelfObj.secondIndex, 1)
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    }

  }
}
</script>
<!--本组件样式-->
<style lang="scss" scoped="scoped">
  /* 公共颜色变量 */
  .clearfix{*zoom:1;}
  .clearfix::after{content: "";display: table; clear: both;}
  div{
    text-align: left;
  }
  .public-account-management{
    // min-width: 1200px;
    // width: 1200px;
    margin: 0 auto;
    .left{
      float: left;
      display: inline-block;
      width: 320px;
      height: 680px;
      margin-top: 20px;
      background: url("../../assets/iphone_backImg.png") no-repeat;
      background-size: 100% auto;
      padding: 525px 25px 90px;
      position: relative;
      box-sizing: border-box;
      /*第一级菜单*/
      .menu{
        .menu_bottom{
          position: relative;
          float: left;
          display: inline-block;
          box-sizing: border-box;
          width: 90px;
          /*height: 44px;*/
          /*line-height: 44px;*/
          text-align: center;
          background-color: #e2e2e2;
          border: 1px solid #ebedee;
          cursor: pointer;
          &.menu_addicon{
            height: 46px;
            line-height: 46px;
          }
          .menu_item{
            height: 44px;
            line-height: 44px;
            /*padding: 14px 0;*/
            text-align: center;
            box-sizing: border-box;
            &.active{
              border: 1px solid #2bb673;
            }
          }
          .menu_subItem{
            height: 44px;
            line-height: 44px;
            text-align: center;
            box-sizing: border-box;
            /*padding: 14px 0;*/
            &.active{
              border: 1px solid #2bb673;
            }
          }
        }
          i{
            color:#2bb673;
          }
        /*第二级菜单*/
        .submenu{
          position: absolute;
          width: 90px;
          bottom: 45px;
          .subtitle{
            background-color: #e8e7e7;
            box-sizing: border-box;
            margin-bottom: 2px;
          }
        }
      }
      .save_btn{
        position: absolute;
        bottom: -50px;
        left: 100px;
      }
    }
    /*右边菜单内容*/
    .right{
      float: left;
      width: 63%;
      background-color: #e8e7e7;
      padding: 25px 10px 0px 20px;
      margin-top: 20px;
      height: 680px;
      margin-left: 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      .configure_page{
        .delete_btn{
          text-align: right;
          margin-bottom: 15px;
        }
        .menu_content{
          margin-top: 20px;
        }
        .configur_content{
          margin-top: 20px;
        }
        .blue{
          color:#29b6f6;
          margin-top: 10px;
        }
        .applet{
          margin-bottom: 20px;
          span{
            margin-right: 18px;
          }
        }
        .material{
          .input_width{
            width: 30%;
          }
          .el-textarea{
            width: 80%
          }
        }
      }

    }
  }
</style>
<!--修改UI框架样式-->
<style lang="scss">
  .public-account-management{
    .el-input{
      width: 78%;;
    }
    .material{
      .el-button{
        float: right;
      }
    }
  }
</style>
