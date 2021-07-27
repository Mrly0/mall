<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goods-item="item" class="goods-list"/>
  </div>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";

export default {
  name: "GoodsList",
  components: {GoodsListItem},
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped>
  .goods {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-around;
    overflow: hidden;
    text-align: center;
  }
  .goods-list{
    width: 48%;
    border: 2px solid #eee;
    border-radius: 10px;
    margin-bottom: 5px;
  }
</style>
