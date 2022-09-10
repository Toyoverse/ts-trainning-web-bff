export function compareArrays(arr1: any[], arr2: any[]) {
  const combination = {
    correct: arr2,
    user: arr1,
    result: [],
  };

  for (const blow of combination.user) {
    const blowResult = { includes: false, position: false, blow };
    if (combination.correct.includes(blow)) {
      blowResult.includes = true;
    }

    if (combination.correct.indexOf(blow) === combination.user.indexOf(blow)) {
      blowResult.position = true;
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
