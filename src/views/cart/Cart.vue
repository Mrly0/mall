<template>
  <div class="cart">
<!--    导航-->
    <nav-bar class="cart-nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>

<!--    商品列表-->
    <cart-list></cart-list>
<!--    底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartBottomBar from "./childComps/CartBottomBar";
import {mapGetters} from 'vuex'

import CartList from "./childComps/CartList";

export default {
  name: "Cart",
  components: {
    NavBar,CartList,CartBottomBar
  },
  computed:{
    ...mapGetters([
      'cartLength','cartList'
    ])
    // length => 计算属性
    // ...mapGetters({
    //   length: 'cartLength'
    // })
  }
}
</script>

<style scoped>
  .cart{
    height: calc(100% - 98px);
  }
  .cart-nav-bar{
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 500;
  }
</style>
