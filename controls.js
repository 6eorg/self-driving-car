class Controls {

    constructor(){
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        //add keyboard listener

        this.#addKeyBoardListeners();

    }


    //# = private Method
    #addKeyBoardListeners(){
        //when key down set movement
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        }
        

        //when key up, set movement to false again
        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
        

    }

}