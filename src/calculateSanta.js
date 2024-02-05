import fs from 'fs';

let count = 0

function question1(){

    fs.readFile('./file.txt',(err,data) => {
        const directions = data.toString()
        const directionsArray = directions.split('')
        for(let i=0; i<directionsArray.length; i++){
            if(directionsArray[i] === "(" ){
                count += 1
            }if(directionsArray[i] === ')'){
                count -=1
            }
        }
        console.log(count)
    })
}
/* question1() */

function question2(){
    fs.readFile('./file.txt',(err,data) => {
        const directions = data.toString()
        const directionsArray = directions.split('')
        let accumulator = 0
        const answer = directionsArray.some((currentItem) => {
            if(currentItem ==='('){
                accumulator+=1
            }
            if(currentItem ===')'){
                accumulator-=1
            }
            count++
            return accumulator<0;
        })
        console.log(count)
    })

}
question2()