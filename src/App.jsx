import { useMemo, useState } from "react";
import "./App.css";
import { uyghurDictionary } from "./data/uyghurDictionary";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function App() {
  const [page, setPage] = useState("home");
  const [level, setLevel] = useState("beginner");
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [englishData, setEnglishData] = useState(null);
  const [quizWord, setQuizWord] = useState(uyghurDictionary[0]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const words = useMemo(() => {
    return uyghurDictionary.filter((item) => {
      const matchesLevel = item.level === level;
      const matchesSearch =
        item.english.toLowerCase().includes(search.toLowerCase()) ||
        item.uyghur.includes(search);
      return matchesLevel && matchesSearch;
    });
  }, [level, search]);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  };

  const searchEnglishDictionary = async (word) => {
    setSelectedWord(word);
    setEnglishData(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.english}`
      );
      const data = await res.json();
      setEnglishData(data[0]);
    } catch {
      setEnglishData(null);
    }
  };

  const checkQuiz = () => {
    if (answer.trim().toLowerCase() === quizWord.english.toLowerCase()) {
      setMessage("Correct! 🎉");
      const levelWords = uyghurDictionary.filter((w) => w.level === level);
      const next = levelWords[Math.floor(Math.random() * levelWords.length)];
      setQuizWord(next);
      setAnswer("");
    } else {
      setMessage("Try again ❌");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Uyghur English Learning</h1>
        <p>Beginner, Intermediate, and Advanced English for Uyghur speakers</p>
      </header>

      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("alphabet")}>Alphabet</button>
        <button onClick={() => setPage("dictionary")}>Dictionary</button>
        <button onClick={() => setPage("sentence")}>Sentences</button>
        <button onClick={() => setPage("quiz")}>Quiz</button>
      </nav>

      <div className="levels">
        <button onClick={() => setLevel("beginner")}>Beginner</button>
        <button onClick={() => setLevel("intermediate")}>Intermediate</button>
        <button onClick={() => setLevel("advanced")}>Advanced</button>
      </div>

      {page === "home" && (
        <section className="card">
          <h2>Welcome 👋</h2>
          <p>
            Choose your level, learn words, listen to pronunciation, build
            sentences, and test yourself.
          </p>
        </section>
      )}

      {page === "alphabet" && (
        <section>
          <h2>Alphabet Sounds</h2>
          <div className="grid">
            {alphabet.map((letter) => (
              <div className="card" key={letter}>
                <h3>{letter}</h3>
                <button onClick={() => speak(letter)}>Listen</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === "dictionary" && (
        <section>
          <h2>Dictionary - {level}</h2>

          <input
            placeholder="Search English or Uyghur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid">
            {words.map((word) => (
              <div className="card" key={word.english}>
                <h3>{word.english}</h3>
                <p className="uyghur">{word.uyghur}</p>
                <p>{word.category}</p>

                <button onClick={() => speak(word.english)}>Listen</button>
                <button onClick={() => searchEnglishDictionary(word)}>
                  Details
                </button>
              </div>
            ))}
          </div>

          {selectedWord && (
            <div className="card">
              <h2>{selectedWord.english}</h2>
              <p className="uyghur">{selectedWord.uyghur}</p>

              <h3>Example</h3>
              <p>{selectedWord.sentence}</p>
              <p className="uyghur">{selectedWord.sentenceUyghur}</p>

              <h3>English Dictionary Data</h3>
              {englishData ? (
                <>
                  <p>
                    <strong>Phonetic:</strong>{" "}
                    {englishData.phonetic || "Not available"}
                  </p>
                  <p>
                    <strong>Definition:</strong>{" "}
                    {englishData.meanings?.[0]?.definitions?.[0]?.definition ||
                      "Not available"}
                  </p>
                </>
              ) : (
                <p>No English dictionary data found yet.</p>
              )}
            </div>
          )}
        </section>
      )}

      {page === "sentence" && (
        <section>
          <h2>Sentence Practice - {level}</h2>

          <div className="grid">
            {words.map((word) => (
              <div className="card" key={word.english}>
                <h3>{word.sentence}</h3>
                <p className="uyghur">{word.sentenceUyghur}</p>
                <button onClick={() => speak(word.sentence)}>Listen</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === "quiz" && (
        <section className="card">
          <h2>Quiz - {level}</h2>
          <p>Type the English meaning:</p>

          <h1 className="uyghur big">{quizWord.uyghur}</h1>

          <input
            placeholder="Type English word..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={checkQuiz}>Check</button>
          <button onClick={() => speak(quizWord.english)}>Hint Sound</button>

          <h3>{message}</h3>
        </section>
      )}
    </div>
  );
}

export default App;