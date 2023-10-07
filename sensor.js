class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 200;
        //angles where Sensors are (Pi/4 = 180 degree / 4 = 45 degree)
        this.raySpread = Math.PI / 2

        //to store the rays§
        this.rays = []

        //array to store the intersections/obstacles read by the sensors
        this.readings = []
    }


    update(roadBorders, traffic) {
        this.#castRays();

        this.readings = []
        //loop over array
        for (let i = 0; i < this.rays.length; i++) {
            const reading = this.#getReading(
                this.rays[i],
                roadBorders,
                traffic)
            this.readings.push(reading)
        }
    }


    #getReading(ray, roadBorders, traffic) {
        //check to see whre the ray touches the road border resp. the nearest object
        //find all touches and return the closest one (as a real sensor only detects the nearest object)
        const touches = [];
        for (let i = 0; i < roadBorders.length; i++) {
            //pass 4 points (2 lines to the method to see wether and where they touch)
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);

            if (touch) {
                touches.push(touch);
            }
        }


        //loop over traffic
        for (let i = 0; i < traffic.length; i++) {
            //get the polygon
            const poly = traffic[i].polygon;

            //loop over points in polygon and check for intersection
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length]
                );
                if (value){
                    touches.push(value);
                }
            }
    

        }




        //if we have no touches, there are no readings
        if (touches.length == 0) {
            //return null. we have to return something to push to the array
            //when we return null, the null gets pushed. (the readings array have to be same length as rays array resp. indx of readings has to correspond with index of ray)
            return null;
        } else {
            //return point of intersection which is nearest to the car
            const offsets = touches.map(touch => touch.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(touch => touch.offset == minOffset);
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            //angle of specific ray
            const rayAngle = lerp(this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)) + this.car.angle;

            //startPoint & endPoint of Ray
            const start = { x: this.car.x, y: this.car.y };
            const end = {
                //end is car + the length of the ray in the angle of the ray
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }
            this.rays.push([start, end])
        }
    }

    draw(ctx) {
        //loop over array with rays
        for (let i = 0; i < this.rayCount; i++) {
            //endpoint 
            let end = this.rays[i][1];
            //if the ray has a reading, we replace the endpoint with this point 
            // (so we can change the color to draw at this point)
            if (this.readings[i]) {
                end = this.readings[i];
            }

            //draw ray from car to the touching point
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow"
            //move to start location (1. point in array)
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            //line to end location (2. point in array)
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();


            //draw ray from its end point to the touching point
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "blue"
            //move to start location (1. point in array)
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            //line to end location (2. point in array)
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

        }
    }
}