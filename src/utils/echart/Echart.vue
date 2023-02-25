<template>
  <div :id="elId" style="height:100%,width:100%" />
</template>

<script>
import echarts from "echarts";
import { merge, debounce } from "lodash";
// 引入公共样式
import baseOption from "./baseOption"

export default {
  data() {
    return {
      elId: "",
      vOption: {
        series: [],
      },
    };
  },
  props: {
    optionData: Object,
  },
  computed: {
    // 合并配置对象
    option() {
      return merge({}, baseOption, this.vOption, this.optionData);
    },
  },
  created() {
    this.elId = this.uuid();
  },
  mounted() {
    // 实例化echarts对象
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    optionData: {
      deep: true,
      handler: function() {
        this.$nextTick(() => {
          this.initChart();
        });
      },
    },
  },
  methods: {
  	// 生成唯一uuid做为唯一标识符
    uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    // 绘图
    initChart() {
      if(!document.getElementById(this.elId)) return
      this.chart = echarts.init(document.getElementById(this.elId));
      this.chart.setOption(this.option);
      const that = this;
      window.addEventListener(
        "resize",
        debounce(() => {    // 引入debounce，防止频繁更改浏览页尺寸出现页面抖动
          if (that.chart) {
            that.chart.resize();
          }
        }, 100)
      );
    },
  },
};
</script>
