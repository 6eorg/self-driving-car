

const canvas = document.getElementById("myCanvas")

// canvas settings
canvas.height = window.innerHeight
canvas.width = 200;

//setup road and car
//drawing context
const ctx = canvas.getContext("2d");
//road center = half of the canvas, and  canvas width, a bit smaller
const road = new Road(canvas.width / 2, canvas.width * 0.9)

//3 options: "KEYS", "DUMMY", "AI"

// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI",3);

const N = 100;
const cars = generateCars(N)
console.log("aaray of cars: ", cars)

let bestCar = cars[0];

//load neuronal network of best car if its in local storage
if (localStorage.getItem("bestBrain")){
    bestCar.brain = JSON.parse(
        localStorage.getItem("bestBrain")
    );
}


const traffic = [
    new Car(road.getLaneCenter(1), -200, 30, 50, "DUMMY", 2)
];


animate();

function generateCars(N){
    const cars = [];
    for (let i = 1; i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30,50, "AI"))
    }
    return cars;
}


//function to save / remove neuronal network of the current best car in the local storage
function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function animate() {

    //update traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    //update all cars
    for (let i = 0; i< cars.length;i++){
        cars[i].update(road.borders, traffic);
    }

    //set the best car to the one that has the lowest y coordinate (the most up one)
    bestCar = cars.find(car => 
        car.y == Math.min(...cars.map(c => c.y))
    );
    console.log("bestCar", bestCar)

    
    //this clears the canvas
    canvas.height = window.innerHeight

    //make road move
    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.7);

    road.draw(ctx);

    //draw traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "red");
    }


    //draw cars
    ctx.globalAlpha = 0.2;
    for(let i = 0; i< cars.length; i++){
         cars[i].draw(ctx, "blue");
    }
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "blue", true)
   

    //restore context again
    ctx.restore();

    //calls the animate method again
    requestAnimationFrame(animate)
}