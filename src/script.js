var memberArray = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'];
var score = 0;
var startTime;
var gameEnd = true;

window.addEventListener('DOMContentLoaded', initialisation());

function initialisation() {
    document.getElementById('game-field').addEventListener('click', function(data){
        if (memberArray.indexOf(data.target.id) !== -1) {
            removeMember(data.target.id);
            changeScore(++score);
            playHitSound();
            triggerHitAnimation(data.target);
            setTimeout(addMember, 300, getRandomMember());
        }
    })
    document.getElementsByClassName('start-button')[0].addEventListener('mouseup', startGame);
    document.getElementsByClassName('start-button')[1].addEventListener('mouseup', startGame);
}

function triggerHitAnimation(target) {
    target.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => {
        target.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
}

function playHitSound() {
    const hitSounds = [
        new Audio('sound/hit1.mp3'),
        new Audio('sound/hit2.mp3'),
        new Audio('sound/hit3.mp3')
    ];
    const randomSound = hitSounds[Math.floor(Math.random() * hitSounds.length)];
    randomSound.volume = 0.5;
    randomSound.play();
}

function getRandomMember() {
    return memberArray[Math.floor(Math.random() * Math.floor(9))];
}

function addMember(id) {
    const memberElement = document.getElementById(id);
    memberElement.style.display = 'block';
    memberElement.style.animation = 'pulse 0.5s ease-in-out';
    
    if (!gameEnd) {
        setTimeout(function(){
            if (memberElement.style.display != 'none') {
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
    const scoreElement = document.getElementById('score').getElementsByTagName('span')[0];
    scoreElement.innerHTML = 'Codes: ' + score;
    scoreElement.style.transform = 'scale(1.1) rotateX(20deg)';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1) rotateX(0deg)';
    }, 200);
}

function startTimer() {
    startTime = Date.now();
    changeTimer();
}

function changeTimer() {
    if ((Date.now() - startTime) >= 20000) {
        endGame();
    } else {
        setTimeout(changeTimer, 50);
        const remainingTime = Math.round(20 - (Date.now() - startTime) / 1000);
        const progressPercentage = 100 - (Date.now() - startTime) * 0.005;
        
        document.getElementById('progress').style.width = progressPercentage + '%';
        document.getElementById('timer').getElementsByTagName('span')[0].innerHTML = 'Time left: ' + remainingTime + ' seconds';
        
        // Add visual intensity as time runs low
        if (remainingTime <= 5) {
            document.getElementById('timer').style.animation = 'shake 0.5s infinite';
        }
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

function typeWriter(element, text, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function endGame() {
    gameEnd = true;
    
    const h1 = document.getElementById('game-end').getElementsByTagName('h1')[0];
    const h2 = document.getElementById('game-end').getElementsByTagName('h2')[0];
    
    h1.classList.add('glitch-text');
    h2.classList.add('typing-text');
    
    let resultText, subText;
    if (score >= 20) {
        resultText = 'At this rate, Yinger will hire you as an assistant, DM him bro';
        subText = `Given ${score} codes. Great result Prover, you are just a SP1 dream!`;
    } else if (score < 20 && score > 8) {
        resultText = 'Cool, but ETH requires more!';
        subText = `You gave out ${score} codes. Try working like a Yinger next time!`;
    } else {
        resultText = 'ARE YOU GOING TO PROVE SOMETHING???';
        subText = `Given only ${score} codes. You either didn't figure out how to do it, or you fell asleep...`;
    }
    
    h1.setAttribute('data-text', resultText);
    h1.innerHTML = resultText;
    typeWriter(h2, subText);
    
    document.getElementById('game-end').classList.remove('hidden');
}
