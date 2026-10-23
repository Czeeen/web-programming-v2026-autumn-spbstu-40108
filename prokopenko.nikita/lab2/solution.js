function check(s) {
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      k = k + 1;
    } else {
      k = k - 1;
    }
    if (k < 0) {
      return false;
    }
  }
  return k === 0;
}

export function generateParentheses(n) {
  let all = [''];

  for (let step = 0; step < n * 2; step++) {
    const next = [];
    for (let i = 0; i < all.length; i++) {
      next.push(`${all[i]}(`);
      next.push(`${all[i]})`);
    }
    all = next;
  }

  const result = [];
  for (let i = 0; i < all.length; i++) {
    if (check(all[i])) {
      result.push(all[i]);
    }
  }
  return result;
}
