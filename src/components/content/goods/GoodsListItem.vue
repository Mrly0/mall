<template>
  <div class="goods-item-box">
    <div class="goods-list-item" @click="itemClick">
      <img v-lazy="showImg" alt="" @load="imageLoad">
      <div class="goods-info">
        <p>{{products.title }}</p>
        <div class="info">
          <span class="price">{{products.price}}</span>
          <span class="collect">
            <img src="~assets/img/common/collect.svg" alt="">
            {{products.cfav}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    products: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods:{
    imageLoad(){
      //// 通过事件总线 实现图片刷新
      this.$bus.$emit('itemImageLoad')
    },
    itemClick(){
      const productId = this.products.iid || this.products.shop_id
      this.$router.push('/detail/' + productId)
    }
  },
  computed: {
    showImg(){
      return this.products.img || this.products.image || this.products.show.img
    }
  }
}
</script>

<style scoped>
  .goods-list-item img{
    width: 100%;
    border-radius: 10px;
  }
  .goods-info {
    width: 100%;
  }
  .goods-info p{
    width: 100%;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
  }
  .info{
    text-align:left;
    padding:5px 15px;
    width:100%;
  }
  .price {
    font-size: 18px;
    color: var(--color-high-text);
  }
  .collect {
    float: right;
    padding-top: 3px;
  }
  .collect img{
    width: 14px;
    height: 14px;
  }
</style>
