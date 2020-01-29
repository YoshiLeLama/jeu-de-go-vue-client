<template>
  <div>
    <div id="title">
      <h1>Jeu de Go</h1>
      <h1 class="exposant">Alpha</h1>
    </div>
    <canvas id="game" width="600" height="600" @click="onGameClick" ref="boardElement"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import {
  drawBoard,
  initializeBoard,
  initializeBoardState,
  handleBoardClick,
  IBoard,
  Colors
} from "../game/game";

@Component
export default class Board extends Vue {
  @Prop() private size!: number;

  data() {
    return {
      board: {
        size: this.size,
        boardId: "game",
        boardState: initializeBoardState(this.size),
        groups: new Array(),
        margin: 40,
        colorTurn: Colors.black
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
    this.$data.board = handleBoardClick(e, this.$data.board);
  }
}
</script>

<style scoped>
canvas {
  border: 1px black solid;
}

#title {
  margin-bottom: 10px;
}

.exposant {
  font-size: 0.5em;
  vertical-align: bottom;
}

#title h1 {
  display: inline;
}
</style>