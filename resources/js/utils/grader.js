export function dynamicProgressStyle(score) {
  const gradient = (() => {
    if (score <= 20) {
      return "linear-gradient(to right, #f43f5e, #f43f5e)" // rose-500
    } else if (score <= 40) {
      return "linear-gradient(to right, #f43f5e, #f97316)" // rose → orange
    } else if (score <= 60) {
      return "linear-gradient(to right, #f97316, #facc15)" // orange → yellow
    } else if (score <= 80) {
      return "linear-gradient(to right, #facc15, #14b8a6)" // yellow → teal
    } else {
      return "linear-gradient(to right, #0d9488, #0d9488)" // teal-600 solid
    }
  })()

  return {
    background: gradient,
    width: score + "%",    
    transition: "width 0.7s ease"
  }
}

export function gradeComment (score) {
if (score >= 90) return 'Excellent🏆';
if (score >= 70) return 'Good Job! 💪';
if (score >= 50) return 'Try again';
if (score >= 30) return 'try harder';
return 'Failed!';
};

export function gradeColor (score) {
  if (score >= 90) return 'text-teal-600';
if (score >= 80) return 'text-teal-500';
if (score >= 70) return 'text-teal-400';
if (score >= 50) return 'text-yellow-500';
if (score >= 30) return 'text-orange-500';
return 'text-red-600';
};
