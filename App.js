import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState } from 'react';

const questions = [
  {
    text: "Чи легко ви адаптуєтеся до нових умов?",
    scores: { sanguine: 2, choleric: 1, phlegmatic: 0, melancholic: 0 }
  },
  {
    text: "Чи швидко ви втомлюєтеся від спілкування?",
    scores: { sanguine: 0, choleric: 1, phlegmatic: 1, melancholic: 2 }
  },
  {
    text: "Чи легко ви заводите нові знайомства?",
    scores: { sanguine: 2, choleric: 1, phlegmatic: 0, melancholic: 0 }
  },
  {
    text: "Чи часто у вас змінюється настрій?",
    scores: { sanguine: 1, choleric: 2, phlegmatic: 0, melancholic: 2 }
  },
  {
    text: "Чи довго ви обдумуєте рішення перед тим, як діяти?",
    scores: { sanguine: 0, choleric: 0, phlegmatic: 2, melancholic: 1 }
  }
];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [scores, setScores] = useState({
    sanguine: 0,
    choleric: 0,
    phlegmatic: 0,
    melancholic: 0
  });

  const startTest = () => {
    setCurrentQuestion(0);
    setScores({
      sanguine: 0,
      choleric: 0,
      phlegmatic: 0,
      melancholic: 0
    });
    showQuestion(0);
  };

  const showQuestion = (index) => {
    if (index >= questions.length) {
      showResult();
      return;
    }

    Alert.alert(
      `Питання ${index + 1}/${questions.length}`,
      questions[index].text,
      [
        {
          text: "Ні",
          onPress: () => nextQuestion(index)
        },
        {
          text: "Так",
          onPress: () => {
            const newScores = { ...scores };
            const questionScores = questions[index].scores;
            Object.keys(questionScores).forEach(type => {
              newScores[type] += questionScores[type];
            });
            setScores(newScores);
            nextQuestion(index);
          }
        }
      ]
    );
  };

  const nextQuestion = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    setCurrentQuestion(nextIndex);
    if (nextIndex < questions.length) {
      showQuestion(nextIndex);
    } else {
      showResult();
    }
  };

  const showResult = () => {
    const temperaments = {
      sanguine: "Сангвінік",
      choleric: "Холерик",
      phlegmatic: "Флегматик",
      melancholic: "Меланхолік"
    };

    const maxScore = Math.max(...Object.values(scores));
    const dominantTemperament = Object.keys(scores).find(key => scores[key] === maxScore);

    Alert.alert(
      "Результат тесту",
      `Ваш темперамент: ${temperaments[dominantTemperament]}\n\nСангвінік: ${scores.sanguine}\nХолерик: ${scores.choleric}\nФлегматик: ${scores.phlegmatic}\nМеланхолік: ${scores.melancholic}`,
      [{ text: "OK" }]
    );
    setCurrentQuestion(-1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Визначення темпераменту</Text>
      {currentQuestion === -1 && (
        <Button
          title="Почати тест"
          onPress={startTest}
        />
      )}
      {currentQuestion !== -1 && (
        <Text style={styles.progress}>
          Питання {currentQuestion + 1} з {questions.length}
        </Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  progress: {
    fontSize: 16,
    marginTop: 20,
  },
});
