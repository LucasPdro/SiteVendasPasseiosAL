stars.forEach((star, index) => {
  const setRating = (event) => {
    event.preventDefault(); // impede scroll ou comportamento inesperado
    const rating = index + 1;
    notaInput.value = rating;

    stars.forEach((s, i) => {
      s.classList.toggle("selected", i < rating);
    });

    ratingText.textContent = ratingLabels[rating] || "";
  };

  star.addEventListener("click", setRating, { passive: false });
  star.addEventListener("touchend", setRating, { passive: false }); // melhor que touchstart
});
