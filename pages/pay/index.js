// 引入
import { getSetting , openSetting , chooseAddress , showModal , showToast } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    address:{},
    // 购物车信息
    cart:[],
    // 是否选中所有
    allChecked:false,
    // 选中的总数量
    totalNum:0,
    // 合计总价
    totalPrice:0
  },

  /**
   * 购物车页面会频繁的被打开，所以显示地址的事件应该存在于onShow中每一次打开
   * 页面加载完毕需要从缓存中获取地址信息
   * 有地址信息就显示地址信息
   * 没有地址信息就显示获取地址按钮
   * 
   * 获取缓存中购物车信息，
   * 将信息加到数据列表中
   */
  onShow(){
    // 获取缓存中的地址信息
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车信息
    const cart = wx.getStorageSync('cart')||[];
    // 判断是否是全选 数组的every方法，遍历数组，所有都满足条件就返回true ,只要有一个不满足条件就结束循环返回false，但是如果是空数组也会返回true
    // const allChecked = cart.length>0?cart.every(e=>e.checked):false;
    // 因为这里又一次循环太消耗性能，所以
    // let allChecked = true;
    // let totalPrice=0;
    // let totalNum=0;
    // cart.forEach(e=>{
    //   if(e.checked){
    //     totalNum += e.num;
    //     totalPrice += e.goods_price * e.num
    //   }else{
    //     allChecked=false;
    //   }
    // })
    // // 当cart为空不会执行上述代码但是allchecked需要设置为false所以需要判断一下
    // allChecked=cart.length!=0?allChecked:false;
    // // 为页面的变量赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalNum,
    //   totalPrice
    // })
    this.setData({
      address
    });
    this.setCart(cart)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击获取地址
  /**
   * 点击事件
   * Api获取用户地址
   * 先获取用户对地址权限的授予情况
   *       // 获取用户权限信息，result.authSetting.scope中存放 ,address属性是地址权限，true为获取确定，false为获取取消
        // 如果重来没有获取过权限那么result.authSetting中没有scope若去获取address则为undefined
   */ 
  async handleChooseAddress(){
    // 在取消权限授权的时候会抛出一个错误，这里使用trycatch来捕获
    try {
      // 获取用户权限状态
      const result = await getSetting();
      const scopeAddress = result.authSetting['scope.address'];
      // 判断权限状态
      if(scopeAddress===false){
        await openSetting();
      }
      // 获取地址信息
      let addressInfo = await chooseAddress();
      addressInfo.all = addressInfo.provinceName+addressInfo.cityName+addressInfo.countyName+addressInfo.detailInfo
      //将获取的地址信息存在缓存中
      wx.setStorageSync('address', addressInfo);
    } catch (error) {
      console.log(error)
    }
  },
  // 全选
  /**
   * 获取缓存中购物车数据
   * 根据购物车数据 选中所有的商品
   */
  handleCheckAll(){
    // 获取购物车列表
    const { cart,allChecked } = this.data;
    // 修改所有商品状态和选中所有状态
    cart.forEach(e=>e.checked=!allChecked);
    // 设置总数，总价，选择数据的绑定，存入数据data存入缓存
    this.setCart(cart);
    this.setData({
      allChecked:!allChecked
    });
  },
  // 总价格总数量的计算
  /**
   * 被选中的才拿来计算
   * 获取购物车数组遍历
   * 判断是否选中
   * 总价 = 单价 * 数量
   * 合计 = 每个商品的总价之和
   * 设置总价和总数量到数据
   */
  
   // 商品的选中
   /**
    * 绑定change事件
    * 获取该商品信息
    * 遍历列表修改对应的商品的选中状态
    * 修改数据data并将列表重新写入缓存
    * 计算新的总价与总数量
    */
  //  点击选择修改
  handleChangeSelect(e){
    // 获取点击的商品Id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车列表
    let { cart } = this.data;
    // cart.forEach(e=>e.goods_id==goods_id?(e.checked=!e.checked):'')
    // 找到对应的列表下标
    let index = cart.findIndex(e=>e.goods_id==goods_id)
    // 修改状态
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
    // // 计算总价格和总数量
    // let allChecked = true;
    // let totalPrice=0;
    // let totalNum=0;
    // cart.forEach(e=>{
    //   if(e.checked){
    //     totalNum += e.num;
    //     totalPrice += e.goods_price * e.num
    //   }else{
    //     allChecked=false;
    //   }
    // })
    // // 当cart为空不会执行上述代码但是allchecked需要设置为false所以需要判断一下
    // allChecked=cart.length!=0?allChecked:false;
    // // 设置数据存入缓存
    // this.setData({
    //   cart,
    //   allChecked,
    //   totalNum,
    //   totalPrice
    // })
    // wx.setStorageSync('cart', cart);
  },
  // 简化代码
  // 设置购物车状态，计算全选，总价总数
  setCart(cart){
    // 计算总价格和总数量
    let allChecked = true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(e=>{
      if(e.checked){
        totalNum += e.num;
        totalPrice += e.goods_price * e.num
      }else{
        allChecked=false;
      }
    })
    // 当cart为空不会执行上述代码但是allchecked需要设置为false所以需要判断一下
    allChecked=cart.length!=0?allChecked:false;
    // 设置数据存入缓存
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync('cart', cart);
  },
  // 商品数量的加减
  /**
   * 点击，传入点击的类型是+还是-，传入商品的id，
   * 遍历商品的数组，修改对应goods_id 的num数量
   * 设置 data 和缓存
   * 需要判断 商品的数量
   * 当数量==1 且为-，列表中直接删除该商品
   * 
   *
   */
  async changeGoodNum(e){
    // 获取传来的参数
    const { operation,id } = e.currentTarget.dataset
    console.log(operation,'operation')
    // 获取商品列表
    const { cart } = this.data;
    // 找到对应的索引
    const index = cart.findIndex(e=>e.goods_id===id);
    // 判断 num的值是否为1
    if(cart[index].num===1&&Number(operation)===-1){
      const result =await showModal({content: '您是否要删除'})
      if(result.confirm){
        cart.splice(index,1)
        this.setCart(cart);
      }
    }else{
      // 修改num
      cart[index].num+=Number(operation);
      // cart.forEach(e=>e.goods_id===id?e.num+Number(operation):'')
      this.setCart(cart)
    }
  },
  // 购物车结算
  /**
   * 点击结算
   * 判断是否有收货
   * 判断是否有选中商品
   * 通过，跳转到下一步
   */
  async handlePay(){
    // 判断收货地址
    const { address,totalNum } = this.data;
    if(!address.userName) return await showToast({title:'您还没有选择收货地址！'})
    // 判断是否选中了商品
    if(totalNum===0) return await showToast({title:'您还没有选择商品！'})
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }

})