class PerlinNoise {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.interpolationMethod = 1
        this.vectorsMap = {}
        this.updateVectorMap(16, 16)
        this.drawNoise()
    }

    updateVectorMap(v, h) {
        for (let x = 0; x <= v; x++) {
            for (let y = 0; y <= h; y++) {
                this.vectorsMap[`${x}:${y}`] = this.getRandomVector()
            }
        }
    }

    interpolation(A, B, T) {
        return A + (B - A) * T
    }

    getRandomVector() {
        // const vectors = [
        //     [1,0],
        //     [-1,0],
        //     [0,1],
        //     [0,-1],
        // ]
        // return vectors[Math.trunc(Math.random() * 4)]
        return [Math.trunc(Math.random() * 3 - 2), Math.trunc(Math.random() * 3 - 2)]
    }

    multipVectors(vA, vB) {
        // console.log(vA)
        // console.log(vB)
        return vA[0] * vB[0] + vA[1] * vB[1]
    }

    getPoint(X, Y) {
        // Вреняя левая точка - метка на карте векторов
        const AX = Math.trunc(X)
        const AY = Math.trunc(Y)

        // Относительная координата точки для метки на карте векторов
        let dX = X - AX
        let dY = Y - AY
        // console.log(`dX = ${dX}; dY = ${dY}`)

        // Вершины квадрата на карте векторов
        const point = this.vectorsMap[`${AX}:${AY}`]
        const Rpoint = this.vectorsMap[`${AX + 1}:${AY}`]
        const Bpoint = this.vectorsMap[`${AX}:${AY + 1}`]
        const RBpoint = this.vectorsMap[`${AX + 1}:${AY + 1}`]
        // console.log(`AX = ${AX}; AY = ${AY}`)
        // console.log('1', point)
        // console.log('2', Rpoint)
        // console.log('3', Bpoint)
        // console.log('4', RBpoint)

        // Дистанции от точки до вершин квадрата
        const dTL = [dX, dY]
        const dTR = [1 - dX, dY]
        const dBL = [dX, 1 - dY]
        const dBR = [1 - dX, 1 - dY]


        const tx1 = this.multipVectors(dTL, point)
        const tx2 = this.multipVectors(dTR, Rpoint)
        const bx1 = this.multipVectors(dBL, Bpoint)
        const bx2 = this.multipVectors(dBR, RBpoint)

        dX = this.modT(dX)
        dY = this.modT(dY)

        const tX = this.interpolation(tx1, tx2, dX)
        const bx = this.interpolation(bx1, bx2, dX)
        const tB = this.interpolation(tX, bx, dY)
        // console.log(`tX = ${tX}; bX = ${bx}; tB = ${tB}`)
        return tB
    }

    modT(t) {
        switch (this.interpolationMethod) {
            case 0:
                return t * t * t * (t * (t * 6 - 15) + 10)
            case 1:
                return (1 - Math.cos(t * Math.PI)) / 2
            case 2:
                return -2 * t * t * t + 3 * t * t
            default:
                return t
        }
    }

    setMethod(N) {
        this.interpolationMethod = N
        this.drawNoise()
    }

    clearCanvas() {
        this.ctx.beginPath()
        this.ctx.clearRect(0, 0, 800, 800)
        this.ctx.stroke()
    }

    getColor(N) {
        const octave = Math.trunc(N * 256).toString(16)
        return `#${octave}${octave}${octave}`
    }

    drawNoise() {
        for (let x = 0; x < 120; x++) {
            for (let y = 0; y < 120; y++) {
                const gradient = -this.getPoint(x / 8, y / 8) / 0.875
                this.ctx.beginPath()
                this.ctx.fillStyle = this.getColor(gradient)
                this.ctx.fillRect(x*4, y*4, 4, 4)
            }
        }
    }
}

window.app = new PerlinNoise()