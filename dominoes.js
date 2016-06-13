var newWord = document.getElementById("word-new")
var demo = document.getElementById("demo")
var list = document.getElementById("word-list")
var count = document.getElementById("word-count")
var wordArray = []
var phrasalVerbs = []

function updateCount(){
	document.getElementById('instructions').innerHTML = ''
	if (list.children.length > 1) count.innerHTML = list.children.length + ' words'
	else if (list.children.length == 0) count.innerHTML = 'hit enter to add word'
	else count.innerHTML = list.children.length + ' word'
}
window.onload = function() {
	var req = new XMLHttpRequest()
	req.open('GET', 'phrasalverbscommon.json', true)
	req.onload = function () {
		phrasalVerbs = JSON.parse(req.responseText)
	}
	req.send()
}
list.addEventListener("click", function(event) {
    if (event.target !== event.currentTarget) {
        if (event.target.className == "destroy")
		{
			wordArray.splice(wordArray.indexOf(event.target.parentElement.getElementsByTagName("LABEL")[0].innerHTML), 1)
			event.target.parentElement.parentNode.removeChild(event.target.parentElement)
			updateCount()
		}
    }
    event.stopPropagation()
})

var completedExamples = 0
var startExamples = []
var endExamples = []
function getExamples(word, totalExamples) {
	var req = new XMLHttpRequest()
	req.open('GET', 'https://vocab.today/sentence/' + word, true)
	req.onload = function () {
		sentences = JSON.parse(req.responseText)
		if (sentences[0]) {
			var sentenceOriginal = sentences[0].sentence
			sentenceOriginal = sentenceOriginal.replace(word, '<b>' + word + '</b>')
			var sentence = sentenceOriginal.toLowerCase()
			var splitPoint = sentence.indexOf(word) + sentence.substr(sentence.indexOf(word)).indexOf(' ')
			var part1 = sentenceOriginal.substr(0, splitPoint) + '</b>'
			var part2 = '<b>' + sentenceOriginal.substr(splitPoint).trim()
			startExamples.push(part1)
			endExamples.push(part2)
			completedExamples ++
			console.log('#' + completedExamples + ' == ' + sentenceOriginal)
			if (completedExamples == totalExamples) {
				for (i=0;i<startExamples.length;i++) {
					var entry = document.createElement('div')
					entry.className = "card"
					var id = 'card' + newWord.value
					if (i == startExamples.length-1) entry.innerHTML = '<ul class="cardList""><li>' + endExamples[0] + '</li><li>' + startExamples[i] + '</li></ul>'
					else entry.innerHTML = '<ul class="cardList""><li>' + endExamples[i+1] + '</li><li>' + startExamples[i] + '</li></ul>'
					var cards = document.getElementById('dominoes')
					cards.insertBefore(entry, cards.childNodes[0])
				}
			}
		}
	}
	req.onerror = function () {
		console.log('zonk')
	}
	req.send()
}
demo.addEventListener("click", function(event) {
	document.getElementById('instructions').innerHTML = ''
	completedExamples = 0
	startExamples = []
	endExamples = []
	var maxCards = 10
	var samplePhrasals = []
	var samplePhrasalsSentences = []
	for (i=0;i<maxCards;i++) {
		samplePhrasals.push(phrasalVerbs[Math.floor(Math.random() * phrasalVerbs.length)])
		getExamples(samplePhrasals[samplePhrasals.length-1],maxCards)
	}
})

newWord.addEventListener("keypress", function(event) {
    if (event.keyCode == 13 && newWord.value.trim() !== '')
	{
		var entry = document.createElement('li')
		entry.innerHTML = '<label>' + newWord.value + '</label><button class="destroy"></button>'
		list.insertBefore(entry, list.childNodes[0])
		wordArray.push(newWord.value)
		
		newWord.value = ''
		updateCount()
	}
})