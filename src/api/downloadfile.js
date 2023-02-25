const downloadfile = (filename, arraybuffer) => {
  const blob = new Blob([arraybuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
  // const filename = row.name + '.docx'
  if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
    navigator.msSaveBlob(blob, filename)
  } else {
    // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
    const elink = document.createElement('a')
    elink.download = filename
    elink.style.display = filename
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
    // loading.close()
  }
}

export default downloadfile
