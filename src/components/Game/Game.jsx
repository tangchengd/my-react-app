import { useState } from "react";
import "./Game.css";

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

function Board({ xIsNext, squares, onPlay, winningLine }) {
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

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const gameResult = calculateWinner(currentSquares);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

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
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningLine={gameResult ? gameResult.line : null}
          />
        </div>
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
