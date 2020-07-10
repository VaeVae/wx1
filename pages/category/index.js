import { request } from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 右侧商品数据
    rightContent:[],
    // 分类列表
    categoryList:[],
    // 当前选中的菜单
    currentIndex:0,
    // 右侧标签的距离
    scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /** 
     * 因为数据量过大，所以
     * 1先判断本地存储是否有数据
     *  { 当清存储时间，存储数据}
     * 2没有直接发送请求
     * 3有，且旧数据没有过期就用本地存储中的数据
     * 
     * 1.获取本地存储中的数据
     * 2.判断
     * 小程序中存储数据不需要类型转换
    */
    const cates = wx.getStorageSync('cates');
    if(!cates){
      this.getCategoryList();
    }else{
      // 过期的时间长度（时间戳）
      let time = 10000;
      // 存储数据的时间
      let storeTime=cates.time;
      // 时间差
      let timeDistance = Date.now() - storeTime;
      // 判断存储的时间是否过期
      if(time<timeDistance){
        // 过期
        this.getCategoryList()
      }else{
        this.setData({
          categoryList:cates.data
        })
          // 左侧初始数据
        let leftData=this.data.categoryList.map(item=>{
          return item.cat_name
        })
        // 右侧初始数据
        let rightData=this.data.categoryList[0].children
        this.setData({
          leftMenuList:leftData,
          rightContent:rightData
        })
      }
    }

  },
  // 获取分类数据
  async getCategoryList(){
    // request({
    //   url:'/categories',
    //   method:'GET'
    // }).then(res=>{
    //   this.setData({
    //     categoryList:res.data.message
    //   })
    //   // 将返回的数据存储到本地存储
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.data.categoryList});
    //   // 左侧初始数据
    //   let leftData=this.data.categoryList.map(item=>{
    //     return item.cat_name
    //   })
    //   // 右侧初始数据
    //   let rightData=this.data.categoryList[0].children
    //   this.setData({
    //     leftMenuList:leftData,
    //     rightContent:rightData
    //   })
    // })
    // 1.使用 async await 发送异步请求
    const res = await request({url:'/categories',method:'GET'});
    this.setData({
      categoryList:res
    })
    // 将返回的数据存储到本地存储
    wx.setStorageSync('cates', {time:Date.now(),data:this.data.categoryList});
    // 左侧初始数据
    let leftData=this.data.categoryList.map(item=>{
      return item.cat_name
    })
    // 右侧初始数据
    let rightData=this.data.categoryList[0].children
    this.setData({
      leftMenuList:leftData,
      rightContent:rightData
    })

  },
  // 点击左侧菜单时
  handleMenuItem(e){
    const {index} = e.currentTarget.dataset;
    let rightData = this.data.categoryList[index].children
    this.setData({
      currentIndex:index,
      rightContent:rightData,
      // 重新设置scrollTop的高度
      scrollTop:0
    })
  }
})