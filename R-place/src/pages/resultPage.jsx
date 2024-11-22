import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./resultPage.scss";
import emailjs from "emailjs-com";

function ResultPage() {
  const location = useLocation();
  const { totalScore, setScores, selectedItems } = location.state || {};

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    comment: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの状態を管理

  // モーダルの開閉処理
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  // フォーム送信処理とバリデーション
  const handleSendEmail = (e) => {
    e.preventDefault();

    // バリデーションチェック
    if (!validateForm()) {
      return; // バリデーションに失敗した場合は送信を中断
    }

    const templateParams = {
      to_email: formData.email,
      totalScore: totalScore,
      companyName: formData.companyName,
      name: formData.name,
      email: formData.email,
      comment: formData.comment,
      ...allScores,
    };

    emailjs
      .send(
        "service_yn7c5qz", // Service ID
        "template_8tzcvm6", // Email Template ID
        templateParams,
        "cRd4jUP7T_Lm6aTnu" // Public ID
      )
      .then((response) => {
        console.log("メールが送信されました", response.status, response.text);
        closeModal(); // モーダルを閉じる
        navigate("https://timerex.net/s/h2c0402_a46e/43384cd4/");
      })
      .catch((error) => {
        console.error("メールの送信に失敗しました", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // 入力があった場合、エラーメッセージをクリア
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.companyName) errors.companyName = "会社名を入力してください";
    if (!formData.name) errors.name = "氏名を入力してください";
    if (!formData.email) errors.email = "メールアドレスを入力してください";
    if (!formData.comment) errors.comment = "コメントを入力してください";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // エラーがなければ true を返す
  };

  const getFeedbackMessage = (score) => {
    if (score >= 70 && score <= 80) {
      return "採用力は非常に高く、優れた採用プロセスが整備されています。求人内容の充実、迅速な応募者対応、入社後のフォローまで、すべての要素が高水準で機能しており、求職者からも高評価を得やすい状況です。この体制を維持しつつ、さらに社内の魅力を発信し続けることで、今後も優秀な人材を引き寄せ、定着させることができます。さらに他社との差別化をする採用戦略で更に採用に課題がなくなります。";
    } else if (score >= 40 && score <= 69) {
      return "採用力は良好な水準にあり、全体的にスムーズな採用プロセスが確立されています。求人情報や面接対応、フォローアップなど、各プロセスがしっかりと機能しているため、優秀な人材を惹きつける基盤が整っています。さらに定着率を上げるために、入社後のフォロー体制や成長機会の提供を強化することで、今後も持続的な改善が可能です。現状の体制を継続しつつ、細部を強化していきましょう。";
    } else if (score >= 20 && score <= 39) {
      return "採用力は平均的なレベルですが、成長の余地が十分にあります。基本的なプロセスは整っていますが、求人内容の更なる工夫や、面接における求職者へのフィードバックの充実が推奨されます。特に、内定から入社までのフォローアップに力を入れることで、内定辞退のリスクを減らし、定着率の向上が期待できます。引き続き改善に取り組むことで、採用力の安定した向上が図れます。";
    } else if (score >= 15 && score <= 19) {
      return "採用力はやや低い水準です。基本的な採用活動は実施していますが、いくつかのポイントでの改善が必要です。特に、求人情報の具体性や、応募者への対応のスピードアップが重要です。また、面接時に会社の魅力を伝える工夫をすることで、求職者に強い印象を与えることができます。少しずつプロセスを見直し、求職者にとって魅力的な対応を強化することで採用力が向上します。";
    } else if (score < 15) {
      return "採用力に様々な改善できる課題があり、採用プロセス全体の見直しが必要です。求人内容の充実、応募者対応のスピード改善、面接やフォロー体制の強化など、多方面にわたる改善が求められます。まずは、求人情報をより具体的で魅力的にすることや、応募者の迅速な対応ができる体制づくりから取り組むと効果的です。企業の魅力を最大限に引き出し、求職者にしっかりと伝える施策を導入していきましょう。";
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
        <div className="result__heading--box">
          <h3 className="result__heading-">
            回答お疲れ様でした！
            <br />
            下記が採用力診断結果です。
          </h3>
        </div>
        <div className="result__score-container">
          <div className="result__score--box result__score--box__red">
            <p className="result__score--txt">求人情報力</p>
            <p className="result__score--txt">
              <span className="result__score__red">{setScores[0]}</span> / 20点
            </p>
          </div>
          <div className="result__score--box result__score--box__green">
            <p className="result__score--txt">応募者対応力</p>
            <p className="result__score--txt">
              <span className="result__score__green">{setScores[1]}</span> /
              20点
            </p>
          </div>
          <div className="result__score--box result__score--box__orange">
            <p className="result__score--txt">面接プロセス力</p>
            <p className="result__score--txt">
              <span className="result__score__orange">{setScores[2]}</span> /
              20点
            </p>
          </div>
          <div className="result__score--box result__score--box__blue">
            <p className="result__score--txt">フォローアップ力</p>
            <p className="result__score--txt">
              <span className="result__score__blue">{setScores[3]}</span> / 20点
            </p>
          </div>
          <div className="result__score--box result__score--box__purple">
            <p className="result__score--txt">定着政策力</p>
            <p className="result__score--txt">
              <span className="result__score__purple">{setScores[4]}</span> /
              20点
            </p>
          </div>
        </div>
        <div className="result__total-score--box">
          <h3 className="result__total-score">
            御社の採用力は: <span className="result__score">{totalScore}</span>
            点です。
          </h3>{" "}
          <div className="result__msg--box">
            <h3 className="result__msg">{getFeedbackMessage(totalScore)}</h3>
          </div>
        </div>

        {/* モーダルを開くボタン */}
        <div className="result__btn-box">
          <button className="result__btn" onClick={openModal}>
            採用にお困りの方はこちら <br />
            上記分析を結果をもとに無料採用コンサルティングを行います。
          </button>
        </div>

        {/* モーダル */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal__content">
              <h2 className="modal__close-text" onClick={closeModal}>
                閉じる
              </h2>
              <form onSubmit={handleSendEmail}>
                <label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="会社名"
                  />
                  {formErrors.companyName && <p>{formErrors.companyName}</p>}
                </label>
                <label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="氏名"
                  />
                  {formErrors.name && <p>{formErrors.name}</p>}
                </label>
                <label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  {formErrors.email && <p>{formErrors.email}</p>}
                </label>
                <label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="何か抱えている課題を教えてください。"
                  />
                  {formErrors.comment && <p>{formErrors.comment}</p>}
                </label>
                <button type="submit" className="result__btn">
                  送信する
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultPage;
