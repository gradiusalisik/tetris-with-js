import '../styles/app.styl'

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const selectors = {
  play: document.getElementById('play'),
  playAgain: document.getElementById('play-again'),
  end: document.getElementById('end'),
  close: document.getElementById('close')
}

const classes = {
  playHide: 'play_hide',
  gameOver: 'wrap-end_show'
}

let stopGame = false;

const createPiece = type => {
  if (type === 'T') {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ];
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2]
    ];
  } else if (type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3]
    ];
  } else if (type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0]
    ];
  } else if (type === 'I') {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ]
  } else if (type === 'Z') {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ]
  }
}

const colors = [
  null,
  '#ff0d72',
  '#0dc2ff',
  '#0dff72',
  '#f538ff',
  '#ff8e0d',
  '#ffe138',
  '#3877ff'
]

const player = {
  position: { x: 0, y: 0 },
  matrix: null,
  score: 0
};

const arenaSweep = () => {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);

    arena.unshift(row);
    ++y;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

const collide = (arena, player) => {
  const [matrix, offset] = [player.matrix, player.position];
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[y].length; ++x) {
      if (
        matrix[y][x] !== 0 &&
        (arena[y + offset.y] &&
        arena[y + offset.y][x + offset.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

const createMatrix = (width, height) => {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0))
  }

  return matrix;
}

const arena = createMatrix(16, 27);

const draw = () => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });

  drawMatrix(player.matrix, player.position);
}

const drawMatrix = (matrix, offset) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

const merge = (arena, player) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.position.y][x + player.position.x] = value;
      }
    })
  })
}

const playerDrop = () => {
  player.position.y++;
  if (collide(arena, player)) {
    player.position.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

const playerMove = dir => {
  player.position.x += dir;
  if (collide(arena, player)) {
    player.position.x -= dir;
  }
}

const playerReset = () => {
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
  player.position.y = 0;
  player.position.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

  if (collide(arena, player)) {
    // Очистка поля при проигрыше.
    selectors.end.classList.add(classes.gameOver);
    stopGame = true;
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

const playerRotate = dir => {
  const position = player.position.x;
  let offset = 1;

  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.position.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1))

    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.position.x = position;
      return;
    }
  }
}

const rotate = (matrix, dir) => {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ]
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  if (!stopGame) {
    requestAnimationFrame(update);
  }
}

const updateScore = () => {
  document.getElementById('score').innerText = player.score;
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
});

const startGame = () => {
  stopGame = false;
  playerReset();
  updateScore();
  update();
}

selectors.play.addEventListener('click', () => {
  selectors.play.classList.add(classes.playHide);
  startGame();
})

selectors.playAgain.addEventListener('click', () => {
  selectors.end.classList.remove(classes.gameOver);
  startGame();
})

selectors.close.addEventListener('click', () => {
  selectors.end.classList.remove(classes.gameOver);
  selectors.play.classList.remove(classes.playHide);
})
