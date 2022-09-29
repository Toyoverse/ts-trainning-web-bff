export function compareArrays(arr1: any[], arr2: any[]) {
  const combination = {
    correct: arr2,
    user: arr1,
    result: [],
  };

  const userCombination = [...combination.correct];

  for (const [index, blow] of combination.user.entries()) {
    const blowResult = { includes: false, position: false, blow };

    if (combination.correct[index] === blow) {
      blowResult.position = true;
      blowResult.includes = true;
    } else if (userCombination.includes(blow)) {
      blowResult.includes = true;
      userCombination.splice(userCombination.indexOf(blow), 1);
    }

    combination.result.push(blowResult);
  }

  return {
    user: combination.user,
    result: combination.result,
    isCombinationCorrect: isCombinationCorrect(arr1, arr2),
  };
}

function isCombinationCorrect(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function convertToTimestamp(date: Date) {
  if (!date) {
    return;
  }

  const seconds = Math.floor(date.getTime() / 1000);
  return seconds;
}
