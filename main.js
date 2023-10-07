

const canvas = document.getElementById("myCanvas")

// canvas settings
canvas.height = window.innerHeight
canvas.width = 200;

//setup road and car
//drawing context
const ctx = canvas.getContext("2d");
//road center = half of the canvas, and  canvas width, a bit smaller
const road = new Road(canvas.width/2, canvas.width*0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 50)


animate();

function animate(){
    car.update();
    //this clears the canvas
    canvas.height = window.innerHeight
    
    //make road move
    ctx.save();
    ctx.translate(0, -car.y+ canvas.height*0.7);

    road.draw(ctx);
    car.draw(ctx);

    //restore context again
    ctx.restore();

    //calls the animate method again
    requestAnimationFrame(animate)
}