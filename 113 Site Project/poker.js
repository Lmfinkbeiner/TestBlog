//4 players 13 cards
// minimum, maximum, and stardard deviation

//DEFINE DECK
var deck = [
        "1c", "1d", "1h", "1s", 
        "2c", "2d", "2h", "2s", 
        "3c", "3d", "3h", "3s", 
        "4c","4d","4h","4s",
        "5c","5d","5h","5s",        
        "6c","6d","6h","6s",
        "7c","7d","7h","7s",
        "8c","8d","8h","8s",
        "9c","9d","9h","9s",
        "10c","10d","10h","10s",
        "11c","11d","11h","11s",
        "12c","12d","12h","12s",
        "13c","13d","13h","13s"
        ];
var scoreData = [0,"20","1","2","3","4","5","6","7","8","10","12","14","16"];
var savedScores = [0];
var savedHands = [0]; //indexes
var group = ["000","111","222","333","123"];
var grouppower = [0,0,0,0,0];
//shuffle deck
function shuffleDeck(array){
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function dealfour(){
    let shuffleddeck = shuffleDeck(deck);
    dealGame(shuffleddeck.slice(0,13));
    dealGame(shuffleddeck.slice(13,26));
    dealGame(shuffleddeck.slice(13,26));
    dealGame(shuffleddeck.slice(-13));
    updateStats();
}

function dealGame(array){
    let i =0;
    let dataSave;
    let hand = [];
    //add to stats
    dataSave = quickScore(array)
    //save scores to local
    savedScores.push(dataSave);
    for (i = 0; i< 13; i++){
        var image = document.getElementById("imageElement"+i);
        image.src = "images/blackjack_images/"+ array[i] + ".png";
        //save indexes 
        hand.push(array[i]); 
    }
    savedHands.push(hand);
};

function multiDeal(){
    let N =  parseInt(document.getElementById("multidealN").value);
    for(let i = 0; i<N-1; i++){
        //shuffle, score first 13, add to stats
        shuffleDeck(deck);
        savedScores.push(quickScore(deck))
    }
    //display last deal (funct auto-adds to stats)
    dealGame(shuffleDeck(deck));
    updateStats();
};
function quickScore(array){ //scores the first 13 elements in array
    if(array.length <13) {return 0;}
    let i = 0;
    let score = 0.0;
    //keep track of 'score groups' (3 of a kind, JQK)
    while(i<13){ //issue here
        if(array[i] == NaN){i++;}
        score += parseFloat(scoreData[parseInt(array[i])]); //add power
        //check for score group, change group var as needed
        i++;
    }
    //add any 'score group' data
    score += addPowerGroups(array);
    //add score to data doc
    return score;
}
function changePower(){
    let selectedCard = parseInt(document.getElementById("cardtype").value);
    let newPower = parseInt(document.getElementById("newvalue").value);
    //change ScoreData value at ScoreData[card]
    scoreData[selectedCard] = newPower;
    document.getElementById("cardvalues").innerHTML = selectedCard + "changed to" + newPower;
    document.getElementById(selectedCard).innerHTML = scoreData[selectedCard];
}
function updateStats() {
    var max = parseFloat(savedScores[1]);
    var min = parseFloat(savedScores[1]);
    var ttl = 0.0;
    var mean;
    var sdcount = 0.0;
    //iterate thru, find max + min, add to 'ttl'
    for (let x = 1.0; x< savedScores.length;x++) {
        ttl += parseFloat(savedScores[x]);
        if (parseFloat(savedScores[x]) > max) {max = parseFloat(savedScores[x]);};
        if (parseFloat(savedScores[x]) < min) {min = parseFloat(savedScores[x]);};
    }
    //divide to find mean
    mean = ttl/savedScores.length;
    //iterate thru again, find SD
    for (let x = 1; x< savedScores.length;x++) {
        sdcount += Math.pow(parseFloat(savedScores[x])- mean, 2);
    }
    sdcount = Math.sqrt(sdcount/savedScores.length);
    //update on pg
    document.getElementById("mean").innerHTML = mean;
    document.getElementById("min").innerHTML = min;
    document.getElementById("max").innerHTML = max;
    document.getElementById("SD").innerHTML = sdcount;
    document.getElementById("ttl").innerHTML = savedScores.length-1;
}
function reScore(){
    savedScores = [0]; //reset scores
    for (let i = 1.0; i< savedHands.length; i++){
        savedScores.push(quickScore(savedHands[i]));
    }
    updateStats();
}
function addPowerGroups(array){
    let ttlPower = 0.0;
    let counters = [0,0,0,0] //ace, j,q,k
    //iterate thru, find sh, tally separate groups
    for(let i = 0; i < 13; i++){
        //counters: 3 ace, j,q,k or jqk
        let check = array[i][1];
        if(array[i][0] == "1"){//ace
            if(check != "0" && check != "1" && check != "2" && check != "3"){
                counters[0]++;
            }
        }
        if(check == "1"){//jack
            counters[1]++;
        }
        if(check == "2"){//queen
            counters[2]++;
        }
        if(check == "3"){//king
            counters[3]++;
        }
    }
    //find groups n stuff
    for(let x = 0; x < group.length -1; x++){
        if(counters[x] >=3){ttlPower += grouppower[x];}
    }
    //check if any jqk
    if(counters[1]!=0 && counters[2]!=0 && counters!=0){ttlPower += grouppower[4];}
    //add value to 'total power score'
    return ttlPower;
}
function CreateGroup(){
    let selectedgroup = document.getElementById("grouptype").value;
    let newpower = parseInt(document.getElementById("power").value);
    if(selectedgroup == "three"){
        for(let i=0;i<4;i++){
            grouppower[i] = newpower;
        }
    }
    else if(selectedgroup == "house"){
        grouppower[4] = newpower;
    }
}