import { useState } from 'react';
import './App.css';

// 单个棋子方块组件
// @param {string} value - 方块中的值（'X', 'O' 或 null）
// @param {function} onSquareClick - 点击事件处理函数
// @param {boolean} isWinning - 是否为获胜方块
function Square({ value, onSquareClick, isWinning }) {
  return (
    <button 
      className={`square ${isWinning ? 'winning' : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// 游戏棋盘组件
// @param {boolean} xIsNext - 是否轮到X下棋
// @param {Array} squares - 当前棋盘状态
// @param {function} onPlay - 下棋完成后的回调函数
// @param {Array} winningLine - 获胜线的索引数组
function Board({ xIsNext, squares, onPlay, winningLine }) {
  // 处理方块点击事件
  // @param {number} i - 被点击方块的索引（0-8）
  function handleClick(i) {
    // 如果游戏已结束或该方块已有棋子，则不处理点击
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // 创建棋盘状态的副本
    const nextSquares = squares.slice();
    // 根据当前轮到谁下棋来设置棋子
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // 调用父组件的回调函数更新游戏状态
    onPlay(nextSquares);
  }

  // 检查游戏结果
  const result = calculateWinner(squares);
  let status;
  // 根据游戏结果显示不同的状态信息
  if (result) {
    status = 'Winner: ' + result.winner;  // 有获胜者
  } else if (squares.every(square => square !== null)) {
    status = 'Draw!';  // 平局（棋盘已满且无获胜者）
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');  // 继续游戏
  }

  // 使用双重循环动态生成棋盘
  const board = [];
  for (let row = 0; row < 3; row++) {
    // 存储当前行的所有方块
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      // 计算一维数组中的索引
      const index = row * 3 + col;
      // 判断当前方块是否在获胜线上
      const isWinning = winningLine && winningLine.includes(index);
      squaresInRow.push(
        <Square 
          key={index} 
          value={squares[index]} 
          onSquareClick={() => handleClick(index)}
          isWinning={isWinning}
        />
      );
    }
    // 将当前行的方块添加到棋盘中
    board.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  // 游戏历史记录 - 存储每一步的棋盘状态
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // 当前移动的步数索引
  const [currentMove, setCurrentMove] = useState(0);
  // 历史记录排序顺序：true=升序，false=降序
  const [isAscending, setIsAscending] = useState(true);
  // 判断当前轮到谁下棋：true=X，false=O
  const xIsNext = currentMove % 2 === 0;
  // 当前棋盘状态
  const currentSquares = history[currentMove];
  // 当前游戏结果（获胜者和获胜线）
  const gameResult = calculateWinner(currentSquares);

  // 处理玩家下棋操作
  // @param {Array} nextSquares - 下一步的棋盘状态
  function handlePlay(nextSquares) {
    // 创建新的历史记录：保留当前步数之前的历史，添加新的棋盘状态
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    // 设置当前步数为最新步数
    setCurrentMove(nextHistory.length - 1);
  }

  // 跳转到指定的历史步数
  // @param {number} nextMove - 要跳转到的步数索引
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 切换历史记录的排序顺序
  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  // 获取指定步数的棋子位置
  // @param {number} move - 步数索引
  // @returns {string|null} 位置坐标格式(行,列)或null
  function getMovePosition(move) {
    // 第一步（游戏开始）没有位置信息
    if (move === 0) return null;
    
    // 获取上一步和当前步的棋盘状态
    const prevSquares = history[move - 1];
    const currentSquares = history[move];
    
    // 遍历9个格子，找到发生变化的格子
    for (let i = 0; i < 9; i++) {
      if (prevSquares[i] !== currentSquares[i]) {
        // 计算行列坐标（从1开始计数）
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        return `(${row}, ${col})`;
      }
    }
    return null;
  }

  // 生成历史记录列表项
  let moves = history.map((squares, move) => {
    // 获取当前步数的位置信息
    const position = getMovePosition(move);
    // 生成描述文本：包含步数和位置坐标
    const description = move > 0 
      ? `Go to move #${move}${position ? ` - ${position}` : ''}`
      : 'Go to game start';
    
    // 如果是当前步数，显示为文本而非按钮
    if (move === currentMove) {
      return (
        <li key={move}>
          <span>You are at move #{move}</span>
        </li>
      );
    }
    
    // 其他步数显示为可点击的跳转按钮
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // 如果设置为降序，反转历史记录列表
  if (!isAscending) {
    moves = moves.slice().reverse();
  }

  return (
    <div className="game">
      {/* 游戏棋盘区域 */}
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay}
          winningLine={gameResult ? gameResult.line : null}
        />
      </div>
      {/* 游戏信息区域：包含排序按钮和历史记录 */}
      <div className="game-info">
        {/* 排序切换按钮 */}
        <button onClick={toggleSortOrder}>
          Sort: {isAscending ? 'Ascending' : 'Descending'}
        </button>
        {/* 历史记录列表 */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 计算游戏获胜者
// @param {Array} squares - 当前棋盘状态
// @returns {Object|null} 获胜者信息对象或null
//   Object格式: { winner: 'X'|'O', line: [number, number, number] }
function calculateWinner(squares) {
  // 所有可能的获胜线：横3条、竖3条、对角线2条
  const lines = [
    [0, 1, 2], // 第一行
    [3, 4, 5], // 第二行
    [6, 7, 8], // 第三行
    [0, 3, 6], // 第一列
    [1, 4, 7], // 第二列
    [2, 5, 8], // 第三列
    [0, 4, 8], // 左上到右下对角线
    [2, 4, 6], // 右上到左下对角线
  ];
  // 检查每一条获胜线
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 如果三个位置都有相同的棋子，则返回获胜者信息
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  // 没有获胜者
  return null;
}





