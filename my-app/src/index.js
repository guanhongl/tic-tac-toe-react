import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  return (
      <button
          className="square"
          onClick={props.onClick}
          style={{backgroundColor: (props.highlight ? 'yellow' : 'white')}} >
        {props.value}
      </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.line.includes(i)}/>;
  }

  renderRow(r) {
    const row = [];
    for (let i = r; i < r + 3; i++) {
      row.push(this.renderSquare(i));
    }
    return row;
  }

  render() {
    const board = [];
    for (let i = 0; i < 9; i+=3) {
      board.push(<div className="board-row" key={i}>{this.renderRow(i)}</div>);
    }
    return (
        <div>
          {board}
        </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNum: 0
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const squaresCopy = current.squares.slice();
    if (calculateWinner(squaresCopy) || squaresCopy[i]) {    // cond. 2 is no overwriting squares
      return;
    }
    squaresCopy[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat({ squares: squaresCopy }),
      xIsNext: !this.state.xIsNext,
      stepNum: history.length
    });
  }

  jumpTo(move) {
    this.setState({
      stepNum: move,
      xIsNext: move % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    let winner;
    let line;
    try {
      winner = calculateWinner(current.squares).winner;
      line = calculateWinner(current.squares).line;
    } catch (error) {
      winner = null;
      line = [9, 9, 9];
    }

    const moves = history.map((element, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
          <li key={move}>
            <button
                onClick={() => this.jumpTo(move)}
                style={{fontWeight: (this.state.stepNum === move ? 'bold' : 'normal')}}
            >
              {desc}
            </button>
          </li>
      );
    });

    let status;
    //winner ? status = 'Winner: ' + winner : status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    if (winner) {
      status = 'Winner: ' + winner;
    } else
      if (current.squares.every(e => e)) {
        status = 'Draw!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} line={line}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
    );
  }
}

const calculateWinner = (squares) => {
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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
