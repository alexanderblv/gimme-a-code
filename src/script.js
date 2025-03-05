var memberArray = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'];
var score = 0;
var startTime;
var gameEnd = true;
window.addEventListener('DOMContentLoaded', initialisation());
function initialisation() {
    document.getElementById('game-field').addEventListener('click', function(data){
        console.log(getRandomMember());
        if (memberArray.indexOf(data.target.id) !== -1) {
            removeMember(data.target.id);
            changeScore(++score);
            setTimeout(addMember, 300, getRandomMember());
        }
    })
    document.getElementsByClassName('start-button')[0].addEventListener('mouseup', startGame);
    document.getElementsByClassName('start-button')[1].addEventListener('mouseup', startGame);
}
function getRandomMember() {
    return memberArray[Math.floor(Math.random() * Math.floor(9))];
}
function addMember(id) {
    document.getElementById(id).style.display = 'block';
    if (!gameEnd) {
        setTimeout(function(){
            if (document.getElementById(id).style.display != 'none') {
                removeMember(id);
                setTimeout(addMember, Math.random() * Math.floor(300) + 100, getRandomMember());
            } 
        }, Math.round(Math.random() * Math.floor(800)) + 300);
    }
}
function removeMember(id) {
    document.getElementById(id).style.display = 'none';
}
function changeScore() {
    document.getElementById('score').getElementsByTagName('span')[0].innerHTML =  'Codes: ' + score;
}
function startTimer() {
    startTime = Date.now();
    changeTimer();
}
function changeTimer() {
    if ((Date.now() - startTime) >= 20000) {
        console.log('END GAME');
        endGame();
    } else {
        console.log();
        setTimeout(changeTimer, 50);
        console.log(Math.round(100 - (Date.now() - startTime) * 0.005));
        document.getElementById('progress').style.width = 100 - (Date.now() - startTime) * 0.005 + '%';
        document.getElementById('timer').getElementsByTagName('span')[0].innerHTML = 'Time left: ' + Math.round(20 - (Date.now() - startTime) / 1000) + ' seconds';
    }
}
function clearField() {
    let members = document.getElementsByClassName('member-img');
    for (let i = 0; i < members.length; i++) {
        members[i].style.display = 'none';
    }
}
function startGame() {
    score = 0;
    changeScore();
    
    clearField();
    document.getElementById('game-info').style.display = 'none';
    document.getElementById('game-end').classList.add('hidden');
    gameEnd = false;
    startTimer();
    setTimeout(addMember, 300, getRandomMember());
}
function endGame() {
    gameEnd = true;
    
    let h1 = document.getElementById('game-end').getElementsByTagName('h1')[0];
    let h2 = document.getElementById('game-end').getElementsByTagName('h2')[0];
    if (score >= 20) {
        h1.innerHTML = 'At this rate, Yinger will hire you as an assistant, DM him bro';
        h2.innerHTML = 'Given ' + score + ' codes. Great result Prover, you are just a SP1 dream!';
    } else if (score < 20 && score > 8) {
        h1.innerHTML = 'Cool, but ETH requires more!';
        h2.innerHTML = 'You gave out ' + score + ' codes. Try working like a Yinger next time!';
    } else {
        h1.innerHTML = 'ARE YOU GOING TO PROVE SOMETHING???';
        h2.innerHTML = 'Given only ' + score + ' codes. You either didn\'t figure out how to do it, or you fell asleep...';
    }
    document.getElementById('game-end').classList.remove('hidden');    
}
