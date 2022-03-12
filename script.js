const CANVAS_HEIGTH = 600
const CANVAS_WIDTH = 900
const CELL_SIZE = 20
const MAX_HP = 3

function initRandomPostition() {
    return {
        posX: Math.floor(Math.random() * ((CANVAS_WIDTH - CELL_SIZE) / CELL_SIZE)) * CELL_SIZE,
        posY: Math.floor(Math.random() * ((CANVAS_HEIGTH - CELL_SIZE) / CELL_SIZE)) * CELL_SIZE,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4)
}


function getInitObject() {
    const snake = {
        id: 1,
        posX: 460,
        posY: 300,
        direction: initDirection(),
        body: [{ posX: 460, posY: 300 }],
        bodyImage: document.getElementById('snakeBody'),
        headImage: document.getElementById('snakeHead'),
        score: 0,
        hp: 3
    }

    const apple = {
        posX: initRandomPostition().posX,
        posY: initRandomPostition().posY,
        image: document.getElementById('apple')
    }

    const apple2 = {
        posX: initRandomPostition().posX,
        posY: initRandomPostition().posY,
        image: document.getElementById('apple')
    }

    const medicine = {
        posX: initRandomPostition().posX,
        posY: initRandomPostition().posY,
        image: document.getElementById('medicine'),
        isEaten: false
    }
    return { snake, apple, apple2, medicine }
}

function main() {

    const { snake, apple, apple2, medicine } = getInitObject()

    INIT_LEVEL_1(snake, apple, apple2, medicine)

}

function INIT_LEVEL_1(snake, apple, apple2, medicine) {
    const snakeBoard = document.getElementById('snakeBoard');
    const boardGame = new SnakeAPI(snakeBoard)

    document.getElementById('labelLevel').textContent = "LEVEL 1"

    const cactus = {
        posX: initRandomPostition().posX,
        posY: initRandomPostition().posY,
        direction: initDirection(),
        image: document.getElementById('cactus')
    }

    const cactusInterval = setInterval(() => {
        cactus.direction = initDirection()
    }, 2000)

    boardGame.initSpeed(35)
    boardGame.startRunner(() => {
        boardGame.createSnake(snake)
        boardGame.createObjectOnBoard(apple)
        boardGame.createObjectOnBoard(apple2)
        medicineAtPrimeNumber(boardGame, medicine, snake.score)
        observeHealthPoint(boardGame, snake)
        updateScore(snake)
        updateSpeed(35)

        //TODO:
        //BUAT OBSTACLE ATAU DINDING DISINI
        boardGame.createMovingObstacle(cactus, onHitByCactus)

        if (snake.score === 5) {
            boardGame.stopRunner()
            boardGame.clearBoard()
            INIT_LEVEL_2(snake, apple, apple2, medicine)
            clearInterval(cactusInterval)
        }

    })
}

function INIT_LEVEL_2(snake, apple, apple2, medicine) {
    const snakeBoard = document.getElementById('snakeBoard');
    const boardGame = new SnakeAPI(snakeBoard)

    document.getElementById('labelLevel').textContent = "LEVEL 2"

    boardGame.initSpeed(40)
    boardGame.startRunner(() => {
        boardGame.createSnake(snake)
        boardGame.createObjectOnBoard(apple)
        boardGame.createObjectOnBoard(apple2)
        medicineAtPrimeNumber(boardGame, medicine, snake.score)
        observeHealthPoint(boardGame, snake)
        updateScore(snake)
        updateSpeed(40)

        //TODO:
        //BUAT OBSTACLE ATAU DINDING DISINI

        if (snake.score === 10) {
            boardGame.stopRunner()
            boardGame.clearBoard()
            INIT_LEVEL_3(snake, apple, apple2, snakeBoard, medicine)
        }
    })
}

function INIT_LEVEL_3(snake, apple, apple2, medicine) {
    const snakeBoard = document.getElementById('snakeBoard');
    const boardGame = new SnakeAPI(snakeBoard)

    document.getElementById('labelLevel').textContent = "LEVEL 3"

    const cactus = {
        posX: initRandomPostition().posX,
        posY: initRandomPostition().posY,
        direction: initDirection(),
        image: document.getElementById('cactus')
    }

    const cactusInterval = setInterval(() => {
        cactus.direction = initDirection()
    }, 2000)

    boardGame.initSpeed(45)
    boardGame.startRunner(() => {
        boardGame.createSnake(snake)
        boardGame.createObjectOnBoard(apple)
        boardGame.createObjectOnBoard(apple2)
        medicineAtPrimeNumber(boardGame, medicine, snake.score)
        observeHealthPoint(boardGame, snake)
        updateScore(snake)
        updateSpeed(45)

        //TODO:
        //BUAT OBSTACLE ATAU DINDING DISINI
        boardGame.createMovingObstacle(cactus, onHitByCactus)

        if (snake.score === 15) {
            boardGame.stopRunner()
            boardGame.clearBoard()
            INIT_LEVEL_4(snake, apple, apple2, snakeBoard)
            clearInterval(cactusInterval)
        }

    })
}

function INIT_LEVEL_4(snake, apple, apple2, medicine) {
    const snakeBoard = document.getElementById('snakeBoard');
    const boardGame = new SnakeAPI(snakeBoard)

    document.getElementById('labelLevel').textContent = "LEVEL 4"

    boardGame.initSpeed(50)
    boardGame.startRunner(() => {
        boardGame.createSnake(snake)
        boardGame.createObjectOnBoard(apple)
        boardGame.createObjectOnBoard(apple2)
        medicineAtPrimeNumber(boardGame, medicine, snake.score)
        observeHealthPoint(boardGame, snake)
        updateScore(snake)
        updateSpeed(50)

        //TODO:
        //BUAT OBSTACLE ATAU DINDING DISINI

        if (snake.score === 20) {
            boardGame.stopRunner()
            boardGame.clearBoard()
            INIT_LEVEL_5(snake, apple, apple2, snakeBoard)
        }

    })
}

function INIT_LEVEL_5(snake, apple, apple2, medicine) {
    const snakeBoard = document.getElementById('snakeBoard');
    const boardGame = new SnakeAPI(snakeBoard)

    document.getElementById('labelLevel').textContent = "LEVEL 5"

    boardGame.initSpeed(55)
    boardGame.startRunner(() => {
        boardGame.createSnake(snake)
        boardGame.createObjectOnBoard(apple)
        boardGame.createObjectOnBoard(apple2)
        medicineAtPrimeNumber(boardGame, medicine, snake.score)
        observeHealthPoint(boardGame, snake)
        updateScore(snake)
        updateSpeed(55)

        //TODO:
        //BUAT OBSTACLE ATAU DINDING DISINI
    })
}

function medicineAtPrimeNumber(gameAPI, medicine, score) {

    if (isPrime(score)) {
        gameAPI.createObjectOnBoard(medicine, true, onEatMedicine)
        console.log('score', score)
    }
}

function onEatMedicine(snake, medicine) {
    if (snake.hp < 3) {
        snake.hp++
    }
    const { posX, posY } = initRandomPostition()
    medicine.posX = posX
    medicine.posY = posY
    snake.score++
}

function observeHealthPoint(game, snake) {
    const hpStatus = document.getElementsByClassName('hp')
    if (snake.hp === 0) {
        game.stopRunner()
        setTimeout(() => {
            alert('Game Over.. You Lose..')
            const { snake, apple, apple2, medicine } = getInitObject()
            INIT_LEVEL_1(snake, apple, apple2, medicine)
        }, game.getSpeed());
    }

    for (let i = 0; i < MAX_HP; i++) {
        hpStatus[i].src = 'assets/hp-empty.png'
        for (let j = 0; j < snake.hp; j++) {
            hpStatus[j].src = 'assets/hp-full.png'
        }
    }
}

function onHitByCactus(snake, cactus) {
    const { posX, posY } = initRandomPostition()
    snake.body = [{ posX, posY }]
    snake.score--
    snake.posX = posX
    snake.posY = posY
}

const isPrime = num => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
}

function updateScore(snake){
    document.getElementById('statusScore').textContent = snake.score
}

function updateSpeed(speed){
    document.getElementById('statusSpeed').textContent = speed
}