import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./resultPage.scss";
import emailjs from "emailjs-com";

function ResultPage() {
  const location = useLocation();
  const { totalScore, setScores, selectedItems } = location.state || {};
  console.log("setScores", setScores);

  // const [formIsOpen, setformIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
  });

  // 各質問セットのスコアをまとめて取得
  let allScores = {};
  Object.keys(selectedItems).forEach((setIndex) => {
    const questionSet = selectedItems[setIndex];
    Object.keys(questionSet).forEach((questionId) => {
      allScores[`question${setIndex}_${questionId}`] =
        questionSet[questionId] !== undefined
          ? questionSet[questionId]
          : "未回答";
    });
  });

  const handleSendEmail = () => {
    const templateParams = {
      to_email: formData.email, // 入力された送信先のメールアドレス
      totalScore: totalScore, // メールテンプレートで使用する点数を追加
      companyName: formData.companyName,
      name: formData.name,
      ...allScores, // 全ての質問のスコアをテンプレートに追加
    };

    emailjs.send(
      "service_yn7c5qz", // Service ID
      "template_8tzcvm6", // Email Template ID
      templateParams,
      "cRd4jUP7T_Lm6aTnu" // Public ID
    );
    // .then(
    //   (response) => {
    //     console.log("メールが送信されました", response.status, response.text);
    //     setformIsOpen(false); // モーダルを閉じる
    //   },
    //   (error) => {
    //     console.error("メールの送信に失敗しました", error);
    //   }
    // );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getFeedbackMessage = (score) => {
    if (score >= 70 && score <= 80) {
      return "採用力が非常に高く、現在の施策を継続すべきです。";
    } else if (score >= 40 && score <= 69) {
      return "採用力は十分ありますが、一部改善が必要です。";
    } else if (score >= 20 && score <= 39) {
      return "採用力は平均的ですが、複数の改善点があります。";
    } else if (score >= 15 && score <= 19) {
      return "採用力が低く、採用プロセスの全面的な見直しが必要です。";
    } else if (score < 15) {
      return "採用力が非常に低く、緊急の改善が求められます。";
    }
    return "";
  };

  const getFeedbackImage = (score) => {
    if (score >= 70 && score <= 80) {
      return "high_score.png";
    } else if (score >= 40 && score <= 69) {
      return "good_score.png";
    } else if (score >= 20 && score <= 39) {
      return "average_score.png";
    } else if (score >= 15 && score <= 19) {
      return "low_score.png";
    } else if (score < 15) {
      return "very_low_score.png";
    }
    return "";
  };

  return (
    <div className="result">
      <div className="result__container">
        <h2 className="result__heading">結果ページ</h2>

        <div className="result__total-score--box">
          <h3 className="result__total-score">
            御社の採用力は:{" "}
            <span className="result__score"> {totalScore} </span>
            点です。
          </h3>
        </div>
        <div className="result__msg--box">
          <h3 className="result__msg">{getFeedbackMessage(totalScore)}</h3>
        </div>
        <div className="result__score-container">
          <div className="result__score--box result__score--box__red">
            <p className="result__txt">求人情報力</p>
            <p>
              <span className="result__score__red">{setScores[0]}</span> / 20点
            </p>
          </div>
          <div className="result__score--box result__score--box__green">
            <p className="result__txt">応募者対応力</p>
            <p>
              <span className="result__score__green">{setScores[1]}</span> /
              20点
            </p>
          </div>
          <div className="result__score--box result__score--box__orange">
            <p className="result__txt">面接プロセス力</p>
            <p>
              <span className="result__score__orange">{setScores[2]}</span> /
              20点
            </p>
          </div>
          <div
            className="result__score--box result__score--box__blue
      "
          >
            <p className="result__txt">フォローアップ力</p>
            <p>
              <span className="result__score__blue">{setScores[3]}</span> / 20点
            </p>
          </div>
          <div className="result__score--box result__score--box__purple">
            <p className="result__txt">定着政策力</p>
            <p>
              <span className="result__score__purple">{setScores[4]}</span> /
              20点
            </p>
          </div>
        </div>
        <img
          className="result__feedback__image"
          src={getFeedbackImage(totalScore)}
          alt="フィードバック画像"
        />
        {/* <button onClick={() => setformIsOpen(true)} className="result__btn">
        より詳細な採用手法を希望の方はこちらをクリック
      </button> */}
        <div className="result__form">
          <div className="result__form__container">
            <h2 className="result__form__title">
              {" "}
              最適な採用手法を知りたい方はこちら
            </h2>
            <form className="result__form__form">
              <label className="result__form--label">
                <input
                  className="result__form--input"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="会社名"
                />
              </label>
              <label className="result__form--label">
                <input
                  className="result__form--input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="氏名"
                />
              </label>
              <label className="result__form--label">
                <input
                  className="result__form--input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </label>
              <label className="result__form--label ">
                <input
                  className="result__form--input result__form--input__comment"
                  type="comment"
                  name="comment"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="現在の採用手法(例：求人広告、人材紹介、自社HPなど)"
                />
              </label>
            </form>{" "}
            <div className="result__msg-box">
              <p>市野の方から、メールにてご連絡差し上げます。</p>
            </div>
            <div className="result__btn__container">
              {/* <button
              onClick={() => setformIsOpen(false)}
              className="result__form--btn"
            >
              キャンセル
            </button> */}
              <Link
                to="https://timerex.net/s/h2c0402_a46e/43384cd4/"
                className="result__btn-link"
              >
                <button
                  onClick={handleSendEmail}
                  className="result__btn result__btn__left"
                >
                  オンラインで相談する
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
