import { useState } from "react";
import "./App.css";

const alphabet = [
  { letter: "A", sound: "ay", uyghur: "ئا", word: "Apple", meaning: "ئالما" },
  { letter: "B", sound: "bee", uyghur: "ب", word: "Book", meaning: "كىتاب" },
  { letter: "C", sound: "see", uyghur: "ك", word: "Cat", meaning: "مۈشۈك" },
  { letter: "D", sound: "dee", uyghur: "د", word: "Dog", meaning: "ئىت" },
  { letter: "E", sound: "ee", uyghur: "ئە", word: "Egg", meaning: "تۇخۇم" },
  { letter: "F", sound: "ef", uyghur: "ف", word: "Fish", meaning: "بېلىق" },
  { letter: "G", sound: "jee", uyghur: "گ", word: "Girl", meaning: "قىز" },
  { letter: "H", sound: "aych", uyghur: "ھ", word: "House", meaning: "ئۆي" },
];

const vocabulary = [
  { english: "Hello", uyghur: "ياخشىمۇسىز", category: "Greeting" },
  { english: "Goodbye", uyghur: "خەير خوش", category: "Greeting" },
  { english: "Water", uyghur: "سۇ", category: "Food" },
  { english: "Food", uyghur: "تاماق", category: "Food" },
  { english: "Mother", uyghur: "ئانا", category: "Family" },
  { english: "Father", uyghur: "دادا", category: "Family" },
  { english: "School", uyghur: "مەكتەپ", category: "Place" },
  { english: "Friend", uyghur: "دوست", category: "People" },
];

const quizQuestions = [
  {
    question: "What does Water mean in Uyghur?",
    options: ["سۇ", "نان", "كىتاب"],
    answer: "سۇ",
  },
  {
    question: "What does Book mean in Uyghur?",
    options: ["ئالما", "كىتاب", "ئۆي"],
    answer: "كىتاب",
  },
  {
    question: "What does Mother mean in Uyghur?",
    options: ["دادا", "دوست", "ئانا"],
    answer: "ئانا",
  },
];

const subjects = ["I", "You", "We", "They"];
const verbs = ["like", "eat", "drink", "read"];
const objects = ["apple", "food", "water", "book"];

function App() {
  const [page, setPage] = useState("home");
  const [subject, setSubject] = useState("I");
  const [verb, setVerb] = useState("like");
  const [object, setObject] = useState("apple");
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameWord, setGameWord] = useState(vocabulary[0]);
  const [gameAnswer, setGameAnswer] = useState("");

  const speak = (text) => {
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = "en-US";
    speechSynthesis.speak(voice);
  };

  const checkQuiz = (option) => {
    if (option === quizQuestions[quizIndex].answer) {
      setScore(score + 1);
      setMessage("Correct! 🎉");
    } else {
      setMessage("Try again ❌");
    }

    setTimeout(() => {
      setMessage("");
      setQuizIndex((quizIndex + 1) % quizQuestions.length);
    }, 1000);
  };

  const checkGame = () => {
    if (gameAnswer.trim().toLowerCase() === gameWord.english.toLowerCase()) {
      setMessage("Great job! 🎉");
      const random = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      setGameWord(random);
      setGameAnswer("");
    } else {
      setMessage("Not yet. Try again!");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Uyghur English Learning</h1>
        <p>Learn English step by step in Uyghur</p>
      </header>

      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("alphabet")}>Alphabet</button>
        <button onClick={() => setPage("vocab")}>Vocabulary</button>
        <button onClick={() => setPage("sentence")}>Sentences</button>
        <button onClick={() => setPage("quiz")}>Quiz</button>
        <button onClick={() => setPage("game")}>Game</button>
      </nav>

      {page === "home" && (
        <section className="card">
          <h2>Welcome 👋</h2>
          <p>
            This app helps Uyghur-speaking beginners learn English alphabet,
            sounds, vocabulary, sentence making, quizzes, and games.
          </p>
        </section>
      )}

      {page === "alphabet" && (
        <section>
          <h2>Alphabet & Sounds</h2>
          <div className="grid">
            {alphabet.map((item) => (
              <div className="card" key={item.letter}>
                <h3>{item.letter}</h3>
                <p>Sound: {item.sound}</p>
                <p>Uyghur: {item.uyghur}</p>
                <p>
                  {item.word} = {item.meaning}
                </p>
                <button onClick={() => speak(item.letter)}>Hear Letter</button>
                <button onClick={() => speak(item.word)}>Hear Word</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === "vocab" && (
        <section>
          <h2>Vocabulary</h2>
          <div className="grid">
            {vocabulary.map((item) => (
              <div className="card" key={item.english}>
                <h3>{item.english}</h3>
                <p className="uyghur">{item.uyghur}</p>
                <p>Category: {item.category}</p>
                <button onClick={() => speak(item.english)}>Listen</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === "sentence" && (
        <section className="card">
          <h2>Sentence Builder</h2>

          <label>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <label>Verb</label>
          <select value={verb} onChange={(e) => setVerb(e.target.value)}>
            {verbs.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>

          <label>Object</label>
          <select value={object} onChange={(e) => setObject(e.target.value)}>
            {objects.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <h3 className="sentence">
            {subject} {verb} {object}.
          </h3>

          <button onClick={() => speak(`${subject} ${verb} ${object}`)}>
            Listen
          </button>
        </section>
      )}

      {page === "quiz" && (
        <section className="card">
          <h2>Quiz</h2>
          <p>Score: {score}</p>
          <h3>{quizQuestions[quizIndex].question}</h3>

          {quizQuestions[quizIndex].options.map((option) => (
            <button key={option} onClick={() => checkQuiz(option)}>
              {option}
            </button>
          ))}

          <h3>{message}</h3>
        </section>
      )}

      {page === "game" && (
        <section className="card">
          <h2>Guess the English Word</h2>
          <p className="uyghur big">{gameWord.uyghur}</p>

          <input
            value={gameAnswer}
            onChange={(e) => setGameAnswer(e.target.value)}
            placeholder="Type English word"
          />

          <button onClick={checkGame}>Check</button>
          <button onClick={() => speak(gameWord.english)}>Hint Sound</button>

          <h3>{message}</h3>
        </section>
      )}
    </div>
  );
}

export default App;