<template>
  <div class="game">
    <Board size="13"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Board from '@/components/Board.vue'

export default {
  name: 'game',
  components: {
    Board
  }
}
</script>
