
function lerp(A,B,t){
    //when t is 0 or 1 we have the two endpoints
    //move from left to right
    return A+(B-A)*t;
}

//get intersection between 4 points (2 vectors)
function getIntersection(A,B,C,D){
    const tTop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);

    if(bottom != 0){
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x: lerp(A.x, B.x,t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null
}

//checks if two shapes (polygons/lines) intersects
function polysIntersect(poly1, poly2) {
    console.log("poly1: ", poly1, "poly2: ", poly2)
    for(let i = 0; i<poly1.length;i++){
        for(let j = 0; j<poly2.length; j++){
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length], //if there is no next one it just takes the 0th position (1st corner) again (4%4 = 0). this works perfect bc the last point (eg. 4th in car) is then connected with the first one
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;

}