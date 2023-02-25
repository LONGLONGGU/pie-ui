/**
 * 获取本周的起始时间和最后一天的时间
 * @returns {*[]}
 */
const getCurrWeekTimeRange = () => {
  // 起止日期数组
  const startStop = []
  // 获取当前时间
  const currentDate = new Date()
  // 返回date是一周中的某一天
  const week = currentDate.getDay()

  // 一天的毫秒数
  const millisecond = 1000 * 60 * 60 * 24
  // 减去的天数
  const minusDay = week !== 0 ? week - 1 : 6
  // alert(minusDay);
  // 本周 周一
  const monday = new Date(currentDate.getTime() - (minusDay * millisecond))
  // 本周 周日
  const sunday = new Date(monday.getTime() + (6 * millisecond))
  // 添加本周时间
  startStop.push(monday) // 本周起始时间
  // 添加本周最后一天时间
  startStop.push(sunday) // 本周终止时间
  // 返回
  return startStop
}

const getCurrMonthTimeRange = () => {
  // 起止日期数组
  const startStop = []
  // 获取当前时间
  const currentDate = new Date()
  // 获得当前月份1-12
  let currentMonth = currentDate.getMonth()
  // 获得当前年份4位年
  let currentYear = currentDate.getFullYear()
  // 求出本月第一天
  const firstDay = new Date(currentYear, currentMonth, 1)

  // 当为12月的时候年份需要加1
  // 月份需要更新为0 也就是下一年的第一个月
  if (currentMonth === 11) {
    currentYear++
    currentMonth = 0 // 就为
  } else {
    // 否则只是月份增加,以便求的下一月的第一天
    currentMonth++
  }

  // 一天的毫秒数
  const millisecond = 1000 * 60 * 60 * 24
  // 下月的第一天
  const nextMonthDayOne = new Date(currentYear, currentMonth, 1)
  // 求出上月的最后一天
  const lastDay = new Date(nextMonthDayOne.getTime() - millisecond)

  // 添加至数组中返回
  startStop.push(firstDay)
  startStop.push(lastDay)
  // 返回
  return startStop
}

export {
  getCurrWeekTimeRange,
  getCurrMonthTimeRange
}
