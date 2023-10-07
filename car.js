class Car {
    constructor(x, y, width, height) {
        //x & y are centered in car object
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2

        this.maxSpeed = 3;
        //friction makes car slow down and stop
        this.friction = 0.05;

        this.angle = 0;

        this.controls = new Controls()
    }

    update() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed
        }
        // dived by 2 -> car maxSpeed reverse is half as fast
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2
        }

        //friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // prevent continous small mouvments because friction meanders around 0
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }


        //only be able to steer when car is moving
        if (this.speed != 0) {

            //when reverse movment we have to flip speed for right unit circle behavoir
            const flip = this.speed > 0 ? 1 : -1;

            //Left & right
            if (this.controls.left) {
                this.angle += 0.03* flip
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip
            }

        }





        //steering wth unit circle
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed
    }

    draw(ctx) {
        //rotation (car steers)
        ctx.save();
        //set center of rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle)

        ctx.beginPath();
        //draw rectangle
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height

        );
        ctx.fill();

        //restore the previous saved context
        ctx.restore();
    }
}