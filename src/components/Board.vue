<template>
  <div>
    <h1>Board</h1>
    <canvas id="game" width="600" height="600" @click="onGameClick" ref="boardElement"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import {
  drawBoard,
  initializeBoard,
  getGameElement,
  initializeBoardState,
  getGameContext,
  handleBoardClick,
  IBoard
} from "../game/game";

@Component
export default class Board extends Vue {
  @Prop() private size!: number;

  data() {
    return {
      board: {
          size: this.size,
          boardId: 'game',
          boardState: initializeBoardState(this.size),
          margin: 40
      } as IBoard
    };
  }
  mounted() {
    this.createBoard();
  }
  createBoard() {
    initializeBoard(this.$data.board);
  }

  @Watch("size")
  onSizeChange(value: number, oldValue: number) {
    if (value >= 2 && value <= 99) {
      initializeBoard(this.$data.board);
    }
  }
  onGameClick(e: MouseEvent) {
    console.log(e.offsetX);
    this.$data.board = handleBoardClick(e, this.$data.board);
  }
}
</script>

<style scoped>
canvas {
  border: 1px black solid;
}
</style>