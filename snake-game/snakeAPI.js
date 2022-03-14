const ORIENTATION_VERTICAL = 'ORIENTATION_VERTICAL'
const ORIENTATION_HORIZONTAL = 'ORIENTATION_HORIZONTAL'

const DIRECTION_LEFT = 0
const DIRECTION_UP = 1
const DIRECTION_RIGHT = 2
const DIRECTION_DOWN = 3

class SnakeAPI {
    constructor(canvasNode) {
        this.ctx = canvasNode.getContext('2d')
        this.canvasWidth = canvasNode.width
        this.canvasHeigth = canvasNode.height
        this.speedRunner = 100;
        this.snake = []
    }

    startRunner = (callback) => {
        this.intervalDraw = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeigth);
            callback()
        }, this.speedRunner)
    }

    initSpeed = (speed = 100) => {
        this.speedRunner -= speed;
    }

    getRandomPosition = () => {
        return {
            posX: Math.floor(Math.random() * ((this.canvasWidth - CELL_SIZE) / CELL_SIZE)) * CELL_SIZE,
            posY: Math.floor(Math.random() * ((this.canvasHeigth - CELL_SIZE) / CELL_SIZE)) * CELL_SIZE,
        }
    }

    stopRunner = () => {
        clearInterval(this.intervalDraw)
    }

    getContext = () => {
        return this.ctx
    }

    getSpeed = () => {
        return this.speedRunner
    }

    clearBoard = () => {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeigth);
    }

    obstacle = (posX, posY, size = CELL_SIZE, orientation = ORIENTATION_HORIZONTAL, color = '#808080', onHitObstacleCallback = () => { }) => {
        this.ctx.fillStyle = color

        const { isHitObstacle, affectedSnake } = this.isHittedObstacle(posX * CELL_SIZE, posY * CELL_SIZE, size, orientation)
        if (isHitObstacle) {
            const hitWall = new Audio('assets/hit-wall.wav')
            const { posX, posY } = this.getRandomPosition()
            hitWall.play()
            onHitObstacleCallback(affectedSnake)
            affectedSnake.hp--;
            affectedSnake.posX = posX
            affectedSnake.posY = posY
            affectedSnake.direction = initDirection()
            affectedSnake.body = [{ posX, posY }]
        }

        if (orientation === ORIENTATION_HORIZONTAL) {
            this.ctx.fillRect(posX * CELL_SIZE, posY * CELL_SIZE, size * CELL_SIZE, CELL_SIZE)
        } else {
            this.ctx.fillRect(posX * CELL_SIZE, posY * CELL_SIZE, CELL_SIZE, size * CELL_SIZE)
        }

    }

    isHittedObstacle = (posX, posY, size, orientationObstacle) => {
        let isHitObstacle = false
        let affectedSnake
        if (orientationObstacle === ORIENTATION_VERTICAL) {
            for (let i = 0; i < this.snake?.length; i++) {
                const snake = this.snake[i]
                for (let cell = 0; cell < size; cell++) {
                    if (snake.posX === posX && snake.posY === posY + (cell * CELL_SIZE)) {
                        isHitObstacle = true
                        affectedSnake = snake
                    }
                }
            }

        } else if (orientationObstacle === ORIENTATION_HORIZONTAL) {
            for (let i = 0; i < this.snake?.length; i++) {
                const snake = this.snake[i]
                for (let cell = 0; cell < size; cell++) {
                    if (snake.posX === posX + (cell * CELL_SIZE) && snake.posY === posY) {
                        isHitObstacle = true
                        affectedSnake = snake
                    }
                }
            }
        }
        return { isHitObstacle, affectedSnake }
    }

    createObjectOnBoard = (object, isBlinking, overideOnHitObject) => {
        const { isHitted, affectedSnake } = this.isHittedCell(object)
        if (isBlinking) {
            blinking(() => {
                this.ctx.drawImage(object.image, object.posX, object.posY)
            })
        } else {
            this.ctx.drawImage(object.image, object.posX, object.posY)
        }

        if (isHitted) {
            if (overideOnHitObject) {
                overideOnHitObject(affectedSnake, object)
                return
            }
            const getPoint = new Audio('assets/get-point.wav') 
            object.posX = this.getRandomPosition().posX
            object.posY = this.getRandomPosition().posY
            getPoint.play()
            affectedSnake.score += 1
            affectedSnake.body.push({ posX: affectedSnake.posX, posY: affectedSnake.posY })
        }
    }

    createMovingObstacle = (object, callbackOnHittedMovingObject = () => { }) => {
        this.ctx.drawImage(object.image, object.posX, object.posY)
        this.movingObject(object)
        this.movingPortal(object)

        for (let i = 0; i < this.snake?.length; i++) {
            const snake = this.snake[i]
            for (let j = 0; j < snake.body.length; j++) {
                const bodySnake = snake.body[j]
                if (bodySnake.posX === object.posX && bodySnake.posY === object.posY) {
                    callbackOnHittedMovingObject(snake, object)
                    const { posX, posY } = this.getRandomPosition()
                    snake.hp--;
                    snake.body = [{ posX, posY }]
                    snake.posX = posX
                    snake.posY = posY
                    snake.direction = initDirection()
                }
            }
        }
    }

    isHittedCell = (objectCell) => {
        let isHitted = false
        let affectedSnake;
        for (let i = 0; i < this.snake?.length; i++) {
            const snake = this.snake[i]
            if (snake.posX === objectCell.posX && snake.posY === objectCell.posY) {
                isHitted = true
                affectedSnake = snake
            }
        }
        return { isHitted, affectedSnake }
    }

    createSnake = (snake, overrideControl) => {
        let defaultSnakeColor = 'orange'
        const snakeIDs = this.snake.map(it => it.id)
        if (!snakeIDs.includes(snake.id)) {
            this.snake.push(snake)
        }

        if (snake.color) {
            defaultSnakeColor = snake.color
        }

        if (snake.headImage) {
            this.ctx.drawImage(snake.headImage, snake.posX, snake.posY)
        } else {
            this.ctx.fillStyle = defaultSnakeColor
            this.ctx.fillRect(snake.posX, snake.posY, CELL_SIZE, CELL_SIZE)
        }

        for (let i = 0; i < snake.body.length; i++) {
            const body = snake.body[i]
            if (i !== 0) {
                if (snake.bodyImage) {
                    this.ctx.drawImage(snake.bodyImage, body.posX, body.posY)
                } else {
                    this.ctx.fillRect(body.posX, body.posY, CELL_SIZE, CELL_SIZE)
                }
            }
        }

        // snake creeping direction
        this.movingObject(snake)

        //update body
        snake.body.unshift({ posX: snake.posX, posY: snake.posY })
        snake.body.pop()

        //snake control creeping direction
        document.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowUp' && snake.direction !== DIRECTION_DOWN) {
                snake.direction = DIRECTION_UP
            } else if (event.code === 'ArrowRight' && snake.direction !== DIRECTION_LEFT) {
                snake.direction = DIRECTION_RIGHT
            } else if (event.code === 'ArrowDown' && snake.direction !== DIRECTION_UP) {
                snake.direction = DIRECTION_DOWN
            } else if (event.code === 'ArrowLeft' && snake.direction !== DIRECTION_RIGHT) {
                snake.direction = DIRECTION_LEFT
            }
        })

        //portal snake
        this.movingPortal(snake)


    }

    movingObject = (object) => {
        if (object.direction === DIRECTION_RIGHT) {
            object.posX += 20;
        }

        if (object.direction === DIRECTION_DOWN) {
            object.posY += 20;
        }

        if (object.direction === DIRECTION_LEFT) {
            object.posX -= 20;
        }

        if (object.direction === DIRECTION_UP) {
            object.posY -= 20;
        }
    }

    movingPortal = (object) => {
        if (object.posX > (this.canvasWidth - CELL_SIZE)) {
            object.posX = -20
        } else if (object.posX < 0) {
            object.posX = this.canvasWidth
        } else if (object.posY > (this.canvasHeigth - CELL_SIZE)) {
            object.posY = -20
        } else if (object.posY < 0) {
            object.posY = this.canvasHeigth
        }
    }
}

let counter = 0
function blinking(onBlink = () => { }) {
    counter++
    if (counter % 2 === 0) {
        onBlink()
    }
}


