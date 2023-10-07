class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        //x & y are centered in car object
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2

        this.maxSpeed = maxSpeed;
        //friction makes car slow down and stop
        this.friction = 0.05;

        this.angle = 0;

        this.damaged = false;

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
            console.log("car with sensors initialized")
        }

        this.controls = new Controls(controlType)
        console.log("car initialized. damaged: ", this.damaged)
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move()
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic)
        }


        if (this.sensor) {
            //update sensor as well
            this.sensor.update(roadBorders,traffic);
        }


    }

    //check if road borders collide with car polygon
    //returns boolean
    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }


    //the way the car is rotated with angle, we don't have the coordinates of the actual car
    //therefore we need to find this out with help of car coordinates, car width & hight  and the angle i which the car currently is 
    #createPolygon() {
        const points = [];
        //some math
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        // add 4 points of the car
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });

        return points;
    }



    #move() {
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
                this.angle += 0.03 * flip
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip
            }

        }
        //steering wth unit circle
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed
    }

    draw(ctx, color) {

        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;

        }

        //in contrast to previous we can now draw just the polygon we have
        ctx.beginPath();
        //move to the first point of the polygon
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        //loop over the other points and draw a line
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        //car has the responsibility to draw the context
        if (this.sensor) {
            this.sensor.draw(ctx)
        }

    }
}