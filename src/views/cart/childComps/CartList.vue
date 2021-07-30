<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="item in cartList"
                      :key="item.iid"
                      :item-info="item">
      </cart-list-item>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import {mapGetters} from 'vuex'
  import CartListItem from './CartListItem'

	export default {
		name: "CartList",
    components: {
		  Scroll, CartListItem
    },
    computed: {
      ...mapGetters([
        'cartLength','cartList'
      ])
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .content {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 93px;
    overflow: hidden;
  }
</style>
