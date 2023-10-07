

const canvas = document.getElementById("myCanvas")

// canvas settings
canvas.height = window.innerHeight
canvas.width = 200;

//setup car
//drawing context
const ctx = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50)


animate();

function animate(){
    car.update();
    //this clears the parent canvas
    canvas.height = window.innerHeight

    car.draw(ctx);
    //calls the animate method again
    requestAnimationFrame(animate)
}