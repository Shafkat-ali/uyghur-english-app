import { useEffect, useState } from "react";
import "./App.css";

const starterWords = {
  greetings: ["hello", "goodbye", "yes", "no", "please", "thanks"],
  family: ["mother", "father", "sister", "brother", "child", "baby"],
  food: ["water", "food", "bread", "rice", "apple", "milk"],
  school: ["book", "pen", "teacher", "student", "school", "lesson"],
  home: ["house", "room", "door", "chair", "table", "bed"],
};

const uyghurMap = {
  hello: "ياخشىمۇسىز",
  goodbye: "خەير خوش",
  yes: "ھەئە",
  no: "ياق",
  please: "ئىلتىماس",
  thanks: "رەھمەت",
  mother: "ئانا",
  father: "دادا",
  sister: "ئاچا / سىڭىل",
  brother: "ئاكا / ئىنى",
  child: "بالا",
  baby: "بوۋاق",
  water: "سۇ",
  food: "تاماق",
  bread: "نان",
  rice: "گۈرۈچ",
  apple: "ئالما",
  milk: "سۈت",
  book: "كىتاب",
  pen: "قەلەم",
  teacher: "ئوقۇتقۇچى",
  student: "ئوقۇغۇچى",
  school: "مەكتەپ",
  lesson: "دەرس",
  house: "ئۆي",
  room: "ياتاق / ئۆي",
  door: "ئىشىك",
  chair: "ئورۇندۇق",
  table: "جەدۋەل / ئۈستەل",
  bed: "كارىۋات",
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function App() {
  const [page, setPage] = useState("home");
  const [category, setCategory] = useState("greetings");
  const [words, setWords] = useState(starterWords.greetings);
  const [selectedWord, setSelectedWord] = useState("hello");
  const [definition, setDefinition] = useState(null);
  const [quizWord, setQuizWord] = useState("water");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setWords(starterWords[category]);
    setSelectedWord(starterWords[category][0]);
  }, [category]);

  useEffect(() => {
    getDefinition(selectedWord);
  }, [selectedWord]);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  };

  const getDefinition = async (word) => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await res.json();
      setDefinition(data[0]);
    } catch {
      setDefinition(null);
    }
  };

  const getMoreWords = async () => {
    try {
      const res = await fetch(
        `https://api.datamuse.com/words?ml=${category}&max=20`
      );
      const data = await res.json();
      const newWords = data.map((item) => item.word).slice(0, 12);
      setWords(newWords);
      setSelectedWord(newWords[0]);
    } catch {
      alert("Could not load more words.");
    }
  };

  const checkQuiz = () => {
    if (answer.trim().toLowerCase() === quizWord.toLowerCase()) {
      setMessage("Correct! 🎉");
      const allWords = Object.values(starterWords).flat();
      setQuizWord(allWords[Math.floor(Math.random() * allWords.length)]);
      setAnswer("");
    } else {
      setMessage("Try again ❌");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Uyghur English Learning</h1>
        <p>Beginner English for Uyghur speakers</p>
      </header>

      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("alphabet")}>Alphabet</button>
        <button onClick={() => setPage("vocab")}>Vocabulary</button>
        <button onClick={() => setPage("sentences")}>Sentences</button>
        <button onClick={() => setPage("quiz")}>Quiz</button>
      </nav>

      {page === "home" && (
        <section className="card">
          <h2>Welcome 👋</h2>
          <p>
            Learn English letters, sounds, beginner words, definitions,
            sentence building, and quizzes.
          </p>
        </section>
      )}

      {page === "alphabet" && (
        <section>
          <h2>Alphabet & Sounds</h2>
          <div className="grid">
            {alphabet.map((letter) => (
              <div className="card" key={letter}>
                <h3>{letter}</h3>
                <button onClick={() => speak(letter)}>Hear Sound</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === "vocab" && (
        <section>
          <h2>Vocabulary</h2>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {Object.keys(starterWords).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <button onClick={getMoreWords}>Load More Words From API</button>

          <div className="grid">
            {words.map((word) => (
              <div
                className={`card ${selectedWord === word ? "active" : ""}`}
                key={word}
                onClick={() => setSelectedWord(word)}
              >
                <h3>{word}</h3>
                <p className="uyghur">{uyghurMap[word] || "Uyghur coming soon"}</p>
                <button onClick={() => speak(word)}>Listen</button>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Word Detail</h2>
            <h3>{selectedWord}</h3>
            <p className="uyghur">{uyghurMap[selectedWord] || "Uyghur coming soon"}</p>

            {definition ? (
              <>
                <p>
                  <strong>Phonetic:</strong>{" "}
                  {definition.phonetic || "Not available"}
                </p>

                <p>
                  <strong>Definition:</strong>{" "}
                  {definition.meanings?.[0]?.definitions?.[0]?.definition ||
                    "No definition found."}
                </p>

                <p>
                  <strong>Example:</strong>{" "}
                  {definition.meanings?.[0]?.definitions?.[0]?.example ||
                    "No example found."}
                </p>
              </>
            ) : (
              <p>No dictionary data found.</p>
            )}
          </div>
        </section>
      )}

      {page === "sentences" && (
        <section className="card">
          <h2>Sentence Making</h2>

          <p>Pattern:</p>
          <h3>I like ____.</h3>

          {words.map((word) => (
            <button key={word} onClick={() => speak(`I like ${word}`)}>
              I like {word}.
            </button>
          ))}

          <hr />

          <h3>More examples</h3>
          <p>I drink water.</p>
          <p>I read a book.</p>
          <p>I go to school.</p>
          <p>This is my mother.</p>
        </section>
      )}

      {page === "quiz" && (
        <section className="card">
          <h2>Quiz Game</h2>
          <p>Type the English word for:</p>

          <h1 className="uyghur big">{uyghurMap[quizWord]}</h1>

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type English word"
          />

          <button onClick={checkQuiz}>Check</button>
          <button onClick={() => speak(quizWord)}>Hint Sound</button>

          <h3>{message}</h3>
        </section>
      )}
    </div>
  );
}

export default App;