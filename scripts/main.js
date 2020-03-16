

// quiz questions and correlating answers
const quiz = [
	{ name: "Superman" ,realName: "clark kent"},
	{ name: "Wonder woman" ,realName: "diana prince"},
	{ name: "batman" ,realName: "bruce wayne"},
	{ name: "iron man" ,realName: "tony stark"},
	{ name: "Dare Devil" ,realName: "matt murdoch"},
	{ name: "flash" ,realName: "barry allen"},
	{ name: "Aquaman" ,realName: "arthur curry"},
	{ name: "The Hulk",realName: "bruce banner" },
	{ name: "Wolverine",realName: "logan howlett" },
	{ name: "Deadpool",realName: "wade wilson" },
	{ name: "Spider-man",realName: "peter parker" },
	{ name: "Gambit",realName: "gambit" },
	{ name: "Nick Fury",realName: "nicolas joseph fury" },
	{ name: "Dr. Strange",realName: "stephen strange" },
	{ name: "Professor x",realName: "charles xavier" },
	{ name: "Mr Fantastic",realName: "reed richards" },
	{ name: "Black Widow",realName: "natasha romanova" },
	{ name: "Hawk Eye",realName: "clint barton" },
	{ name: "Storm",realName: "ororo monroe" },
	{ name: "Black panther",realName: "tchalla" },
	{ name: "Ant man",realName: "scott lang" },
	{ name: "Wasp",realName: "janet van dyne" },
	{ name: "Captain Marvel",realName: "carol danvers" },
	{ name: "John",realName: "handel" },
	{ name: "Vision",realName: "vision" },
	{ name: "Cyclops",realName: "scott summers" },
	{ name: "Sola",realName: "Akdox" }
];

function random(a, b=1){
	//if only 1 argument is provided, we need to swap the values of a and b
	if(b===1){
		[a,b] = [b,a];
	}
	return Math.floor((b-a+1) * Math.random())+ a;
}
	
function shuffle(array){ //this shuffles the questions to be asked.
	for(let i = array.length; i; i--){
			let j = random(i)-1;
			[array[i-1], array[j]] = [array[j], array[i-1]];
	}
}

//View Object
const view = {
	begin: document.getElementById('start'),
	score: document.querySelector('#score strong'),
	question: document.getElementById('question'),
	response: document.querySelector('#response'),
	result: document.getElementById('result'),
	information: document.getElementById('info'),
	timer: document.querySelector('#timer strong'),

	render(target,content,attributes){ //updates the content of an element on the page.
		for(const key in attributes){
			target.setAttribute(key, attributes[key]); //updates attributes to the values provided
		}
		target.innerHTML = content; //updates the HTML with the content provided.
	},

	show(element){ //makes the question, response and result <div> elements visible
		element.style.display = 'block';
	},
	hide(element){ // hides the start button.
		element.style.display = 'none';
	},
	setup(){ //helper function used to set up the view when the game starts.
		this.show(this.question);
		this.show(this.response);
		this.show(this.result);
		this.hide(this.begin);
		this.render(this.score,game.score);
		this.render(this.result,'');
		this.render(this.information,'');
		// this.resetForm();
	},
	// resetForm(){ //resets the input field to an empty field and gives it focus, which improves usability as it means the player is left to concentrate on just answering the next question.
	// 	this.response.answer.value ='';
	// 	this.response.answer.focus();
	// },
	teardown(){ //responsible for hiding any elements that aren’t required and making the start button visible again.
		this.hide(this.question);
		this.hide(this.response);
		this.show(this.begin);
	},
	buttons(array){ //creates the HTML to be rendered
		return array.map(value => `<button>${value}</button>`).join(''); //joins each element of the array together to produce a string of HTML
	}
	
};

const game = {
	start(quiz){
		console.log('start() invoked');
		this.score = 0;
		this.questions = [...quiz];
		view.hide(view.begin);
		console.log('im still working');
		view.setup();
		this.ask();
		this.secondsRemaining = 60;
		this.timer = setInterval( this.countdown , 1000 );
	},

	ask(name){ //renders the question in the HTML
		console.log('ask() invoked');
		if(this.questions.length > 0) { // checks if there are any questions left to ask.
			shuffle(this.questions);
			this.question = this.questions.pop(); //removes the last element of the array and assign it to this.question
			const options = [this.questions[0].realName, this.questions[1].realName, this.question.realName];
			shuffle(options);
			const question = `What is ${this.question.name}:s real name?`;
			view.render(view.question,question);
			view.render(view.response,view.buttons(options));
		}
		else {
			this.gameOver();
		}
	},

	check(event){ //used to check if the answer submitted by the player is correct and update score 
		console.log('check(event) invoked');
		const response = event.target.textContent; //assigns chosen option to variable response
		const answer = this.question.realName; //gets corresponding answer to question
		if(response === answer){
			view.render(view.result,'Correct!',{'class':'correct'});
			this.score++;
			view.render(view.score,this.score);
		} else {
			view.render(view.result,`Wrong! The correct answer was ${answer}`,{'class':'wrong'});
		}
		this.ask();
	},

	gameOver(){
		console.log('gameOver() invoked');
		view.show(view.begin);
		view.render(view.information,`Game Over, you scored ${this.score} point${this.score !== 1 ? 's' : ''} out of ${quiz.length}`);
		view.teardown();
		clearInterval(this.timer);
	},

	countdown() {
		game.secondsRemaining--; //decreases the secondsRemaining variable that we initialized earlier by 1 using the -- operator,
		view.render(view.timer,game.secondsRemaining); //displays the number of seconds remaining in the header
		if(game.secondsRemaining === 0) { 
			game.gameOver();  //we check to see if the time has fallen below zero and, if it has, we call the gameOver() function as time has run out!
		}
	}

}

// game.start(quiz);
view.begin.addEventListener('click', () => game.start(quiz), false);
view.response.addEventListener('click', (event) => game.check(event), false);
// view.hide(view.response);