let speech = new SpeechSynthesisUtterance();
speech.text = "the cat in the hat";
speech.rate = .8;
const voices = speechSynthesis.getVoices();
console.log(voices);
document.querySelector("button").addEventListener("click", () => {
    window.speechSynthesis.speak(speech);
})
    
