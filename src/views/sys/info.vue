<template>
  <el-container>
    <el-header>
      <el-date-picker
        v-model="timeRange"
        value-format="yyyy-MM-dd HH:ss:mm"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="clear">清空</el-button>
<!--      <el-button type="success" @click="download">下载</el-button>-->
    </el-header>
    <el-main v-loading="loading">
      <el-row>
        <table border="1" width="100%" cellpadding="10">
          <caption>APP使用情况汇总</caption>
          <tr>
            <th colspan="3">APP更新、下载情况</th>
            <th colspan="3">登录情况</th>
          </tr>
          <tr>
            <td>版本</td>
            <td>统计时间范围（次）</td>
            <td>总计（次）</td>
            <td>版本</td>
            <td>统计时间范围（次）</td>
            <td>总计（次）</td>
          </tr>
          <tr>
            <td>业务版</td>
            <td>{{ appData.busWeekDownNum }}</td>
            <td>{{ appData.busTotalDownNum }}</td>
            <td>业务版</td>
            <td>{{ appData.busWeekLoginNum }}</td>
            <td>{{ appData.busTotalLoginNum }}</td>
          </tr>
          <tr>
            <td>客商版</td>
            <td>{{ appData.traWeekDownNum }}</td>
            <td>{{ appData.traTotalDownNum }}</td>
            <td>PC后端</td>
            <td>{{ appData.pcWeekLoginNum }}</td>
            <td>{{ appData.pcTotalLoginNum }}</td>
          </tr>
          <tr>
            <td>决策版</td>
            <td>{{ appData.decWeekDownNum }}</td>
            <td>{{ appData.decTotalDownNum }}</td>
            <!--          <td>PC后端</td>-->
            <!--          <td>{{appData.pcWeekLoginNum}}</td>-->
            <!--          <td>{{appData.pcTotalLoginNum}}</td>-->
          </tr>
        </table>
      </el-row>
      <el-row style="margin-top: 20px">
        <table border="1" width="100%" cellpadding="10" >
          <caption>招商通数据新增情况</caption>
          <tr>
            <th>类别</th>
<!--            <th>本周</th>-->
            <th>累计次数</th>
            <th>当前数量</th>
          </tr>
          <tr>
            <td>系统用户数</td>
<!--            <td>{{appData.userWeekAddNum}}</td>-->
            <td>{{appData.userMonthAddNum}}</td>
            <td>{{appData.userTotalNum}}</td>
          </tr>
          <tr>
            <td>活跃用户数</td>
<!--            <td>{{appData.userWeekActiveNum}}</td>-->
            <td>{{appData.userMonthActiveNum}}</td>
            <td>--</td>
          </tr>
          <tr>
            <td>项目数据</td>
<!--            <td>{{appData.projectWeekAddNum}}</td>-->
            <td>{{appData.projectMonthAddNum}}</td>
            <td>{{appData.projectTotalNum}}</td>
          </tr>
          <tr>
            <td>企业数据</td>
<!--            <td>{{appData.enterpriseWeekAddNum}}</td>-->
            <td>{{appData.enterpriseMonthAddNum}}</td>
            <td>{{appData.enterpriseTotalNum}}</td>
          </tr>
          <tr>
            <td>政策数据</td>
<!--            <td>{{appData.policyWeekAddNum}}</td>-->
            <td>{{appData.policyMonthAddNum}}</td>
            <td>{{appData.policyTotalNum}}</td>
          </tr>
          <tr>
            <td>产业资讯</td>
<!--            <td>{{appData.industryInfoWeekAddNum}}</td>-->
            <td>{{appData.industryInfoMonthAddNum}}</td>
            <td>{{appData.industryInfoTotalNum}}</td>
          </tr>
          <tr>
            <td>学习交流数据</td>
<!--            <td>{{appData.forumWeekAddNum}}</td>-->
            <td>{{appData.forumMonthAddNum}}</td>
            <td>{{appData.forumTotalNum}}</td>
          </tr>
          <tr>
            <td>精准匹配数据</td>
<!--            <td>{{appData.matchWeekAddNum}}</td>-->
            <td>{{appData.matchMonthAddNum}}</td>
            <td>{{appData.matchTotalNum}}</td>
          </tr>
          <tr>
            <td>外出招商</td>
<!--            <td>{{appData.outInvestWeekAddNum}}</td>-->
            <td>{{appData.outInvestMonthAddNum}}</td>
            <td>{{appData.outInvestTotalNum}}</td>
          </tr>
        </table>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import { querySystemStatisticsData, exportCount } from '@/api/admin-server/log'
import downloadfile from '@/api/downloadfile'
import { getCurrWeekTimeRange, getCurrMonthTimeRange } from '@/common/dateutils'

export default {
  name: 'Info',
  data() {
    return {
      loading: false,
      appData: {
        busWeekDownNum: 0,
        busTotalDownNum: 0,
        busWeekLoginNum: 0,
        busTotalLoginNum: 0,
        traWeekDownNum: 0,
        traTotalDownNum: 0,
        pcWeekLoginNum: 0,
        pcTotalLoginNum: 0,
        decWeekDownNum: 0,
        decTotalDownNum: 0,
        userWeekAddNum: 0,
        userMonthAddNum: 0,
        userTotalNum: 0,
        userWeekActiveNum: 0,
        userMonthActiveNum: 0,
        projectWeekAddNum: 0,
        projectMonthAddNum: 0,
        projectTotalNum: 0,
        enterpriseWeekAddNum: 0,
        enterpriseMonthAddNum: 0,
        enterpriseTotalNum: 0,
        policyWeekAddNum: 0,
        policyMonthAddNum: 0,
        policyTotalNum: 0,
        industryInfoWeekAddNum: 0,
        industryInfoMonthAddNum: 0,
        industryInfoTotalNum: 0,
        forumWeekAddNum: 0,
        forumMonthAddNum: 0,
        forumTotalNum: 0,
        matchWeekAddNum: 0,
        matchMonthAddNum: 0,
        matchTotalNum: 0,
        outInvestWeekAddNum: 0,
        outInvestMonthAddNum: 0,
        outInvestTotalNum: 0
      },
      timeRange: '',
      pickerOptions: {
        shortcuts: [{
          text: '本周',
          onClick(picker) {
            const range = getCurrWeekTimeRange()
            // const end = new Date()
            // const start = new Date()
            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', range)
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted() {
    this.init()
    // console.log(getCurrMonthTimeRange())
    this.timeRange = getCurrMonthTimeRange()
  },
  methods: {
    async init(data = { timeRange: getCurrMonthTimeRange() }) {
      // const data = {}
      this.loading = true
      const result = await querySystemStatisticsData(data).finally(() => {
        this.loading = false
      })
      if (result.code === 200) {
        this.appData = result.data
      }
    },
    async download() {
      const result = await exportCount()
      let fileName = ''
      let startTime
      // eslint-disable-next-line no-unused-vars
      let endTime
      let startYear
      let startMonth
      let startDay
      let endYear
      let endMonth
      let endDay
      if (this.timeRange !== null && this.timeRange.length > 0) {
        startTime = new Date(this.timeRange[0])
        endTime = new Date(this.timeRange[1])
        startYear = startTime.getFullYear().toString()
        startMonth = (startTime.getMonth() + 1).toString()
        startDay = startTime.getDate().toString()
        endYear = endTime.getFullYear().toString()
        endMonth = (endTime.getMonth() + 1).toString()
        endDay = endTime.getDate().toString()
        // console.log(new Date(this.timeRange[0]))
        // fileName = `${startYear}年${startMonth}月${startDay}日至${endYear}年${endMonth}月${endDay}日招商通使用情况.docx`
      } else {
        const arr = getCurrMonthTimeRange()
        startTime = new Date(arr[0])
        endTime = new Date(arr[1])
        startYear = startTime.getFullYear().toString()
        startMonth = (startTime.getMonth() + 1).toString()
        startDay = startTime.getDate().toString()
        endYear = endTime.getFullYear().toString()
        endMonth = (endTime.getMonth() + 1).toString()
        endDay = endTime.getDate().toString()
        // fileName = `${arr[0]}至${arr[1]}招商通使用情况.docx`
      }
      fileName = `${startYear}年${startMonth}月${startDay}日至${endYear}年${endMonth}月${endDay}日招商通使用情况.docx`
      downloadfile(fileName, result)
    },
    search() {
      if (this.timeRange !== null && this.timeRange.length > 0) {
        const data = { timeRange: this.timeRange }
        this.init(data)
      }
    },
    clear() {
      this.timeRange = getCurrMonthTimeRange()
      const data = { timeRange: this.timeRange }
      this.init(data)
    }
  }

}
</script>

<style scoped>
.el-button{
  width: 120px;
  margin-left: 20px;
}

caption{
  font-size: 32px;
  font-weight: bold;
}
.el-header {
  /*background-color: #B3C0D1;*/
  color: #333;
  text-align: left;
  line-height: 60px;
}
th{
  margin: 10px 0;
}
table
{
  border-collapse:collapse;
}
table,th, td
{
  border: 1px solid black;
}
td{
  text-align: center;
}
body > .el-container {
  margin-bottom: 40px;
}

</style>
