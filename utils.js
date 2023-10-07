
function lerp(A,B,t){
    //when t is 0 or 1 we have the two endpoints
    //move from left to right
    return A+(B-A)*t;
}