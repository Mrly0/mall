import {ADD_COUNTER,ADD_TO_CART} from "./mutation-types";

export default {
  // addCart(context,payload){
  //   let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
  //   if(oldProduct){
  //     context.commit(ADD_COUNTER,oldProduct)
  //   }else {
  //     payload.count = 1
  //     context.commit(ADD_TO_CART,payload)
  //   }
  // }

  // 对象的解构
  addCart({state,commit},payload){
    return new Promise((resolve,reject) => {
      let oldProduct = state.cartList.find(item => item.iid === payload.iid)
      if(oldProduct){
        commit(ADD_COUNTER,oldProduct)
        resolve('当前商品数量+1')
      }else {
        payload.count = 1
        commit(ADD_TO_CART,payload)
        resolve('添加了新商品')
      }
    })
  }
}
