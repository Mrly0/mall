<template>
  <div class="goods-item-box">
    <div class="goods-list-item">
      <img :src="goodsItem.show.img" alt="">
      <div class="goods-info">
        <p>{{goodsItem.title }}</p>
        <div class="info">
          <span class="price">{{goodsItem.price}}</span>
          <span class="collect">
            <img src="~assets/img/common/collect.svg" alt="">
            {{goodsItem.cfav}}
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
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
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
  }
  .collect {
    float: right;
  }
  .collect img{
    width: 14px;
    height: 14px;
  }
</style>
