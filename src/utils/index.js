import { Message } from 'element-ui'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * 防抖函数
 * @param {*} func 防抖后要执行的回调
 * @param {*} wait 等待时间
 * @param {*} immediate
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
/**
 * 将数组转化成树结构 array to tree
 * @param {*} array 数据源
 * @param {*} options 字段名配置项
 */
export function arrayToTree(
  array = [],
  options = { id: 'id', pid: 'pid', children: 'children' }
) {
  const array_ = [] // 创建储存剔除叶子节点后的骨架节点数组
  const unique = {} // 创建盒子辅助本轮children合并去重
  const root_pid = [
    0,
    '0',
    undefined,
    'undefined',
    null,
    'null',
    '00000000-0000-0000-0000-000000000000'
  ] // 可能存在的根节点pid形式
  array.forEach(item => {
    // 筛选可以插入当前节点的所有子节点
    const children_array = array.filter(
      it => it[options.pid] === item[options.id]
    )
    if (item[options.children] && item[options.children] instanceof Array && item[options.children].length > 0) {
      // 去重合并数组
      item[options.children].map(i => (unique[i[options.id]] = 1))
      item[options.children].push(
        ...children_array.filter(i => unique[i[options.id]] !== 1)
      )
    } else {
      item[options.children] = children_array
    }
    // 当children_array有数据时插入下一轮array_，当无数据时将最后留下来的根节点树形插入数组
    const has_children = children_array.length > 0
    if (
      has_children ||
      (!has_children && root_pid.includes(item[options.pid]))
    ) {
      array_.push(item)
    }
  })
  // 当数组内仅有根节点时退出，否组继续处理 最终递归深度次
  if (!array_.every(item => root_pid.includes(item[options.pid]))) {
    return arrayToTree(array_, options)
  } else {
    return array_
  }
}
/**
 * 关闭其他弹出类视图函数
 * 用于切换侧滑区域内容
 * data:object 要求为该页面layout字段
 * key:string 需要打开的视图
 */
export function closeOtherLayout(data = {}, key) {
  for (const item in data) {
    data[item] = false
  }
  if (key) data[key] = true
}
/**
 * 从坐标值拼接指定字段到祖先元素
 * @param {*} data 一维数据源
 * @param {*} coordinate 坐标值数据
 * @param {*} options 配置项
 */
export function splicParentsUntil(data, coordinate, options = {
  pathName: 'name', // 所要拼接字段
  pathConnector: '\\', // 连接符
  pathId: 'id', // 数据源匹配字段
  pathParents: 'parents',
  pathIdentityId: 'identityId'
}) {
  const coordinate_item = data.find(i => i[options.pathId] === coordinate[options.pathId])
  if (!coordinate_item) return ''
  if (!coordinate_item[options.pathParents]) return coordinate_item[options.pathName]
  const _parents = coordinate_item[options.pathParents]
    .substring(1, coordinate_item[options.pathParents].length - 1)
    .split(',')
    .filter(i => !!i)
  let splic_parents = ''
  _parents.forEach(i => {
    const _parent = data.find(t => t[options.pathIdentityId] == i)
    splic_parents += `${_parent[options.pathName]}${options.pathConnector}`
  })
  return splic_parents + coordinate_item[options.pathName]
}
export function getFileViewType(suffix) {
  let fileViewType = ''
  if (['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.gif', '.GIF', '.bmp'].includes(suffix)) {
    fileViewType = 'img'
  } else if (
    ['.avi', '.mp4', '.rmvb', '.mov', '.mkv'].includes(suffix)
  ) {
    fileViewType = 'video'
  } else if (['.mp3'].includes(suffix)
  ) {
    fileViewType = 'audio'
  } else if (['.xls', '.xlsx', '.doc', '.docx', '.pdf', '.ppt', '.txt'].includes(suffix)) {
    fileViewType = 'iframe'
  }
  return fileViewType
}

export function memoryTurned(fileSize) {
  const value = fileSize
  if (value === null || value === '') {
    return '0 Bytes'
  }
  var unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  //  保留的小数位数
  size = size.toFixed(2)
  return size + unitArr[index]
}
