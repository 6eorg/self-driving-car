class Road {

    //x = center of the road
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount

        //left / right part of the road
        this.left = x - width / 2;
        this.right = x + width / 2

        //infinity for road movement
        const infinity = 100000000;
        this.top = -infinity;
        this.bottom = infinity;

        //strassenrand
        const topLeft = { x: this.left, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const topRight = { x: this.right, y: this.top }
        const bottomRight = { x: this.right, y: this.bottom }
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + laneIndex * laneWidth;
    }


    //to draw the road
    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        //draw lanes
        for (let i = 1; i <= this.laneCount - 1; i++) {
            //x coordinate of lane (linear interpolation)
            const x = lerp(this.left, this.right, i / this.laneCount);

            // draw line dashes like this (but it will kill browser)
            // ctx.setLineDash([20,20]);

            ctx.beginPath()
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }


        // draw borders (strassenrand)
        ctx.setLineDash([])
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y)
            ctx.lineTo(border[1].x, border[1].y)
            ctx.strokeStyle = "gray"
            ctx.stroke()
        });

    }
}

