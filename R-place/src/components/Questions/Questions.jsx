import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ページ遷移用に追加
import "./Questions.scss";
import questionList from "../../_data/questionsList.json"; // JSONファイルの読み込み
import SmoothScroll from "smooth-scroll";

function Questions() {
  const [currentIndex, setCurrentIndex] = useState(0); // 現在表示している質問集のインデックスを管理
  const [selectedItems, setSelectedItems] = useState({}); // 各質問集ごとの選択状態を保存
  const [totalScore, setTotalScore] = useState(0); // 全体の合計点を保存
  const [setScores, setSetScores] = useState({}); // 各質問セットごとのスコアを保存
  const navigate = useNavigate(); // ページ遷移用のフック
  const questionRefs = useRef([]);

  // 質問集のリスト
  const questionSets = [
    questionList.questions_data_1,
    questionList.questions_data_2,
    questionList.questions_data_3,
    questionList.questions_data_4,
    questionList.questions_data_5,
  ];

  const scroll = new SmoothScroll();

  // 現在の質問集を取得
  const currentData = questionSets[currentIndex] || [];
  const currentSelectedItems = selectedItems[currentIndex] || {};

  // スコアを更新し、選択状態を保存する
  const handleScore = (questionId, value, index) => {
    const numericValue = parseInt(value);

    // すでに同じスコアが選ばれている場合はそのスコアを削除
    if (currentSelectedItems[questionId] === numericValue) {
      setTotalScore((prevTotal) => prevTotal - numericValue);

      setSetScores((prevSetScores) => ({
        ...prevSetScores,
        [currentIndex]: (prevSetScores[currentIndex] || 0) - numericValue,
      }));

      setSelectedItems((prevSelected) => ({
        ...prevSelected,
        [currentIndex]: {
          ...currentSelectedItems,
          [questionId]: null, // 選択状態を解除
        },
      }));
    } else {
      // 違うスコアが選ばれている場合は更新
      const previousScore = currentSelectedItems[questionId] || 0;
      setTotalScore((prevTotal) => prevTotal - previousScore + numericValue);

      setSetScores((prevSetScores) => ({
        ...prevSetScores,
        [currentIndex]:
          (prevSetScores[currentIndex] || 0) - previousScore + numericValue,
      }));

      setSelectedItems((prevSelected) => ({
        ...prevSelected,
        [currentIndex]: {
          ...currentSelectedItems,
          [questionId]: numericValue,
        },
      }));
    }

    // 次の質問にスクロール
    if (index + 1 < currentData.length) {
      questionRefs.current[index + 1]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 次の質問集に移動し、ページトップにスクロール
  const handleNext = () => {
    if (currentIndex < questionSets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scroll.animateScroll(0); // ページトップにスムーズスクロール
    } else {
      navigate("/result", { state: { totalScore, setScores, selectedItems } });
    }
  };

  // 前の質問集に戻る
  const handleBefore = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // ページトップにスムーズスクロール
    }
  };

  return (
    <div className="question">
      {currentData.length > 0 ? (
        currentData.map((item, index) => (
          <div
            key={item.id}
            className="question__container"
            ref={(el) => (questionRefs.current[index] = el)}
          >
            <p className="question__genre">{item.questionGenre}</p>
            <p className="question__title">{item.question}</p>
            <div className="question__answer">
              <div className="question__score-box">
                <ul className="question__list">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <li
                      key={value}
                      className={`question__list-item ${
                        currentSelectedItems[item.id] === value &&
                        "question__list-item--selected"
                      }`}
                      onClick={() => handleScore(item.id, value, index)}
                    >
                      {value}.&nbsp; {item.scoreDescriptions[value - 1]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>データがありません</p> // データが存在しない場合の表示
      )}
      <div className="question__btn-box">
        <button
          className="question__btn"
          onClick={handleBefore}
          disabled={currentIndex === 0}
        >
          Back
        </button>
        <button className="question__btn" onClick={handleNext}>
          {currentIndex === questionSets.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Questions;
