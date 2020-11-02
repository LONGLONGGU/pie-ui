<template>
  <div :class="tdClass">
    <span class="before-line" v-if="root !== 0 && nodes !== 1" :style="{'left':model.bLeft + 'px'}"></span>
    <table>
      <tr>
        <td :colspan="colSpan">
          <table>
            <tr class="leve" :class="levelClass" :style="classObject(model)">
              <td class="td1">
                <div class="td-title" @dblclick="handlerExpand(model)">
                  <span v-if="model.children.length > 0" class="tree-close" :class="{'tree-open':model.isExpand}"
                    @click="handlerExpand(model)"></span>
                  <a class="ellipsis">
                    <i class="t-icon m-dep"></i>
                    <span :title="model.ObjectName">{{model.ObjectName}}</span>
                  </a>
                </div>
              </td>
              <!-- <td class="td2">
                {{model.ResponsibleName}}
              </td> -->
              <td class="td3">{{model.CreateTime|formatDate}}</td>
              <td class="td4">
                <span :title="model.Experience" class="ellipsis">{{model.Experience}}</span>
              </td>
              <td class="td5">{{model.BelongTo}}天</td>
              <td class="td6">
                <el-button icon=" fa fa-plus" size="mini" @click="actionFunc(model)"></el-button>
                <el-button icon="fa fa-edit" size="mini" @click="actionFunc(model)"></el-button>
                <el-button size="mini" icon="el-icon-delete" @click="deleteFunc(model)"></el-button>
                <!-- <a class="reset" href="javascript:;" @click="actionFunc(model)">编辑</a>
                <i class="line"></i>
                <a class="delete" href="javascript:;" @click="deleteFunc(model)">删除</a> -->
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div v-show="model.isExpand" class="other-node" :class="otherNodeClass">
      <tree-item v-for="(m, i) in model.children" :key="String('child_node'+i)" :num='i' :root="1"
        @actionFunc="actionFunc" @deleteFunc="deleteFunc" @handlerExpand="handlerExpand"
        :nodes.sync='model.children.length' :trees.sync='trees' :model.sync="m">
      </tree-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeItem',
  props: ['model', 'num', 'nodes', 'root', 'trees'],
  data () {
    return {
      parentNodeModel: null
    }
  },
  computed: {
    colSpan () {
      return this.root === 0 ? '' : 6
    },
    tdClass () {
      return this.root === 0 ? 'td-border' : 'not-border'
    },
    levelClass () {
      return this.model ? 'leve-' + this.model.level : ''
    },
    childNodeClass () {
      return this.root === 0 ? '' : 'child-node'
    },
    otherNodeClass () {
      return this.model ? 'other-node-' + this.model.level : ''
    }
  },
  watch: {
    // 'model': {
    // 	handler() {
    // 		console.log('对象变化', this.model.isExpand)
    // 	},
    // 	deep: true
    // }
  },
  methods: {
    classObject (data) {
      // console.log(data)
      // console.log(data)
      // let start = 30;
      // let end = 70;
      let initialColor = '#FFFFFF';
      let interimClolor = '#FFF68F';
      let finally1 = '#FF4500';
      let percent = (data.BelongTo / 30).toFixed(2) * 100
      // start = 100 - percent
      // end = percent
      if (percent <= 40) {
        return 'background: linear-gradient(80deg, #00FA9A ' + 30 + '%, ' + initialColor + ' ' + 70 + '%);';
      } else if (percent <= 80) {
        return 'background: linear-gradient(80deg, #00FA9A ' + 30 + '%, ' + interimClolor + ' ' + 70 + '%);';
      } else if (percent <= 90) {
        return 'background: linear-gradient(80deg, #00FA9A ' + 30 + '%, ' + finally1 + ' ' + 70 + '%);';
      }

    },
    getParentNode (m) {
      // 查找点击的子节点
      var recurFunc = (data, list) => {
        data.forEach((l) => {
          if (l.id === m.id) this.parentNodeModel = list
          if (l.children) {
            recurFunc(l.children, l)
          }
        })
      }
      recurFunc(this.trees, this.trees)
    },
    handlerExpand (m) {
      this.$emit('handlerExpand', m)
    },
    deleteFunc (m) {
      this.$emit('deleteFunc', m)
      // this.getParentNode(m)
      // console.log(this.parentNodeModel)
      // if (this.parentNodeModel.hasOwnProperty('children')) {
      // 	console.log('父级是跟节点', this.parentNodeModel)
      // 	this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(m), 1)
      // } else if (this.parentNodeModel instanceof Array) {
      // 	console.log('跟节点', this.parentNodeModel)
      // 	this.parentNodeModel.splice(this.parentNodeModel.indexOf(m), 1)
      // }
    },
    actionFunc (m) {
      this.$emit('actionFunc', m)
    }
  },
  filters: {
    formatDate: function (date) {
      // 后期自己格式化
      return date //Utility.formatDate(date, 'yyyy/MM/dd')
    }
  }
}
</script>
