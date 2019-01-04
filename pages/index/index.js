// 新闻类别中英文映射
const newsKindsMap = {
  'gn': "国内",
  'gj': "国际",
  'cj': "财经",
  'yl': "娱乐",
  'js': "军事",
  'ty': "体育",
  'other': "其他"
}

Page({
  data: {
    newsKindsTitle: ["gn", "gj", "cj", "yl", "js", "ty", "other"],
    newsTypeTitle:'gn',
    headlinesTitle:"",
    headlinesImage:"",
    headlinesSource:"",
    headlinesTime:"",
    headlinesId: "",
    newslistArray:[],
    newsKindsMap: newsKindsMap,
    wasTouchedNewsDetailId:""
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getNews(() => {
       //api数据获取后立即停止刷新
      wx.stopPullDownRefresh()
    }
    )
  },
  onLoad(options) {
    // 如果options对象不为空，则设置新闻类型
    if (options.newsTypeTitle){
    this.setData({
         newsTypeTitle: options.newsTypeTitle,
    })
  }
    this.getNews()
  },
  // 新闻分类信息侦测调用函数
  onTapCategory(e) {
    const { cat } = e.currentTarget.dataset;
    this.setData({
      newsTypeTitle: cat
    })
    this.getNews();
  },
  // 新闻详细信息内容及页面跳转的调用函数
  onTapNewsDetials(e) {
    // 获取点击的新闻唯一的ID
    const {id} = e.currentTarget;
    this.setData({
      wasTouchedNewsDetailId: id
    })
     // 跳转到新闻详细内容页面，并传递该条新闻的唯一ID
    wx.navigateTo({
      url: `/pages/newsDetail/newsDetail?wasTouchedNewsDetailId=${this.data.wasTouchedNewsDetailId}&newsTypeTitle=${this.data.newsTypeTitle}`,
      // url: '/pages/newsDetail/newsDetail?wasTouchedNewsDetailId=' + this.data.wasTouchedNewsDetailId + '&newsTypeTitle=' + this.data.newsTypeTitle,
    })
  },
   // 获取新闻列表数据
  getNews(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
       // api参数设置
      data: {
        type: this.data.newsTypeTitle
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
         //对获取到的新闻列表数据进行处理
        let result = res.data.result
    let headlinesTime = result[0].date.slice(0, 10) +" "+ result[0].date.slice(11, 16)
        let headlinesTitle = result[0].title.slice(0,26)
        let headlinesId = result[0].id
        let newslistArray = []
        for (let i = 1; i < result.length; i++) {
          newslistArray.push({
             newslistTitle: result[i].title.slice(0, 22),
             newslistSource: result[i].source,
        newslistTime: result[i].date.slice(0, 10) +" "+result[i].date.slice(11,16),
             newslistImage: result[i].firstImage,
             newslistId: result[i].id     
          })
        }
        this.setData({
          headlinesTitle: headlinesTitle,
          headlinesImage: result[0].firstImage,
          headlinesSource: result[0].source,
          headlinesTime: headlinesTime,
          headlinesId: headlinesId,
          newslistArray: newslistArray
        })
      },
      complete: () => {
         // 参数函数不为空则调用该函数
        callback && callback()
      }
    })
  }
})

