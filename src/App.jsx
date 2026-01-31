import { useState } from "react";
import Square from "./components/Square";

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay, index }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    if (index < 0 || index === undefined) {  
      status = 'Next player: ' + (xIsNext ? 'X' : 'O') + " move: " + 0;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O') + " move: " + index;
    }
  }
  // Chunk flat squares into 3 rows of 3 cols: [[0,1,2], [3,4,5], [6,7,8]]
  const rows = [0, 1, 2].map((rowIndex) =>
    squares.slice(rowIndex * 3, rowIndex * 3 + 3)
  );

  return (
    <>
      <div className="status">{status}</div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cellValue, colIndex) => {
            const squareIndex = rowIndex * 3 + colIndex;
            return (
              <Square
                key={squareIndex}
                value={cellValue}
                onSquareClick={() => handleClick(squareIndex)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const isCurrentMove = move === currentMove;
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {isCurrentMove ? (
          move === 0 ? 'You are at game start' : 'You are at move #' + move
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} index={currentMove} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

