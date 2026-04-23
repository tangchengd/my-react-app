import { useState } from "react";
import "./Game.css";

// 功能：渲染棋盘上的单个格子按钮。
// 参数：
// - value: 当前格子显示的棋子，可能是 X、O 或 null。
// - onSquareClick: 点击格子时触发的回调函数。
// - isWinning: 当前格子是否位于获胜连线中。
// 返回：单个格子按钮 JSX。
function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "winning" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// 功能：渲染井字棋棋盘，并处理单步落子逻辑。
// 参数：
// - xIsNext: boolean，表示当前是否轮到 X 下棋。
// - squares: Array，当前棋盘 9 个格子的状态。
// - onPlay: function，落子完成后通知父组件更新历史记录。
// - winningLine: Array|null，获胜连线的索引数组。
// 返回：棋盘区域 JSX。
function Board({ xIsNext, squares, onPlay, winningLine }) {
  // 功能：处理某个格子的点击事件。
  // 参数：
  // - index: number，被点击格子的下标。
  // 返回：无返回值，副作用是生成下一步棋盘并调用 onPlay。
  function handleClick(index) {
    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  let status;

  if (result) {
    status = `Winner: ${result.winner}`;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  const board = [];

  // 双重循环：动态生成 3x3 棋盘，而不是手写 9 个按钮。
  for (let row = 0; row < 3; row += 1) {
    const squaresInRow = [];

    for (let col = 0; col < 3; col += 1) {
      const index = row * 3 + col;
      const isWinning = winningLine && winningLine.includes(index);

      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinning={isWinning}
        />,
      );
    }

    board.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>,
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-grid">{board}</div>
    </>
  );
}

// 功能：渲染井字棋完整页面，负责历史记录、步数切换和排序切换。
// 参数：无。
// 返回：井字棋页面 JSX。
export default function Game() {
  // 功能：保存每一步的棋盘历史记录。
  // 参数：初始值为只包含空棋盘的数组。
  // 返回：历史记录状态和更新函数。
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // 功能：记录当前查看到历史中的第几步。
  // 参数：初始值为 0，表示游戏开始状态。
  // 返回：当前步数状态和更新函数。
  const [currentMove, setCurrentMove] = useState(0);

  // 功能：控制历史记录列表是升序还是降序显示。
  // 参数：初始值为 true，表示升序。
  // 返回：排序状态和更新函数。
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const gameResult = calculateWinner(currentSquares);

  // 功能：处理一次新的落子，并把该步加入历史记录。
  // 参数：
  // - nextSquares: Array，落子后的新棋盘状态。
  // 返回：无返回值，副作用是更新历史记录和当前步数。
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 功能：跳转到历史记录中的某一步。
  // 参数：
  // - nextMove: number，要跳转到的目标步数。
  // 返回：无返回值，副作用是更新当前步数。
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 功能：切换历史记录排序方式。
  // 参数：无。
  // 返回：无返回值，副作用是反转 isAscending。
  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  // 功能：根据当前步数，找出该步新增棋子的位置。
  // 参数：
  // - move: number，当前要分析的历史步数。
  // 返回：位置字符串，例如 (2, 3)；如果是起始状态则返回 null。
  function getMovePosition(move) {
    if (move === 0) return null;

    const previousSquares = history[move - 1];
    const nextSquares = history[move];

    for (let index = 0; index < 9; index += 1) {
      if (previousSquares[index] !== nextSquares[index]) {
        const row = Math.floor(index / 3) + 1;
        const col = (index % 3) + 1;
        return `(${row}, ${col})`;
      }
    }

    return null;
  }

  // 功能：把历史记录数组映射成可渲染的步骤列表。
  // 参数：history.map 的每一项分别是 squares 和 move。
  // 返回：步骤列表项 JSX 数组。
  let moves = history.map((squares, move) => {
    const position = getMovePosition(move);
    const description =
      move > 0
        ? `Go to move #${move}${position ? ` - ${position}` : ""}`
        : "Go to game start";

    if (move === currentMove) {
      return (
        <li key={move}>
          <span>You are at move #{move}</span>
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!isAscending) {
    moves = moves.slice().reverse();
  }

  return (
    <section className="game-page">
      <div className="game-card">
        {/* 左侧棋盘区域。 */}
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningLine={gameResult ? gameResult.line : null}
          />
        </div>

        {/* 右侧信息区域：排序按钮和历史记录列表。 */}
        <div className="game-info">
          <button onClick={toggleSortOrder}>
            Sort: {isAscending ? "Ascending" : "Descending"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    </section>
  );
}

// 功能：判断当前棋盘是否已经出现获胜者。
// 参数：
// - squares: Array，当前棋盘状态。
// 返回：
// - { winner, line }：存在获胜者时返回获胜信息对象。
// - null：没有获胜者时返回 null。
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let index = 0; index < lines.length; index += 1) {
    const [a, b, c] = lines[index];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[index] };
    }
  }

  return null;
}
