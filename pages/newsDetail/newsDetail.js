// pages/newsDetail/newsDetail.js
Page({
  data: {
    wasTouchedNewsDetailId: '',
    readCount:'',
    newsDetailTitle: '',
    newsDetaislSource: "",
    newsDetailTime:'',
    newsDetailContent:"",
    newsDetailContentArray:[],
    newsTypeTitle:""
   
  },
  // 通过options对象把上一页面跳转时传递的被点击新闻的参数——唯一ID，设置到data中
  onLoad(options){
      this.setData({
        wasTouchedNewsDetailId: options.wasTouchedNewsDetailId,
        newsTypeTitle: options.newsTypeTitle
      })
      // console.log(this.data.newsTypeTitle)
      this.getNewsDetail()
  },
  onPullDownRefresh() {
    this.getNewsDetail(() => {
      wx.stopPullDownRefresh()
    }
    )
  },
  // 通过api获取新闻详细内容数据
  getNewsDetail(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      // 设置获取新闻数据的参数——ID
      data: {
        id: this.data.wasTouchedNewsDetailId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let result = res.data.result
        let newsDetailTime = result.date.slice(11, 16)
        let newsDetailTitle = result.title.slice(0, 27)
        let newsDetailSource = result.source
        let newsDetailContent = result.content
        this.setData({
          readCount: result.readCount,
          newsDetailTitle: newsDetailTitle,
          newsDetailSource: newsDetailSource,
          newsDetailTime: newsDetailTime,
          newsDetailContent: result.content
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  // 返回主页面
  onTapNewsList() {
    wx.navigateTo({
      url: `/pages/index/index?newsTypeTitle=${this.data.newsTypeTitle}`
    })
  }
})