// Efeito texto Maragogi
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target); // Para animar só uma vez
    }
  });
});
//++++++++++++++++++++++++++++++++++=CODIGO SEPARADO================================
document.addEventListener("DOMContentLoaded", () => {
  let offset = 0;
  const limit = 5;

  const stars = document.querySelectorAll(".star");
  const notaInput = document.getElementById("nota");
  const ratingText = document.getElementById("rating-text");

  const feedbackList = document.getElementById("feedback-list");
  const loadMoreBtn = document.getElementById("load-more");
  const form = document.getElementById("feedback-form");
  const formMsg = document.getElementById("form-msg");

  const ratingLabels = {
    1: "Ruim",
    2: "Regular",
    3: "Bom",
    4: "Muito bom",
    5: "Excelente",
  };

  let envioEmAndamento = false; // controle para evitar envios simultâneos

  // Controle de clique nas estrelas (click e touch)
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

  // Função para carregar comentários (paginação)
  function carregarComentarios() {
    fetch(`enviar_list.php?offset=${offset}&limit=${limit}`)
      .then((response) => response.text())
      .then((data) => {
        if (
          data.trim() === "" ||
          data.toLowerCase().includes("sem comentários ainda")
        ) {
          loadMoreBtn.style.display = "none"; // esconde botão se não tem mais
        } else {
          if (offset === 0) {
            feedbackList.innerHTML = data; // limpa lista e insere
          } else {
            feedbackList.innerHTML += data; // adiciona ao final
          }
          offset += limit;
        }
      })
      .catch(() => {
        formMsg.textContent = "Erro ao carregar comentários.";
        formMsg.style.color = "red";
      });
  }

  // Evento de envio do formulário
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (envioEmAndamento) return;
      envioEmAndamento = true;

      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      formMsg.textContent = "Enviando feedback...";
      formMsg.style.color = "black";

      fetch("enviar_feedback.php", {
        method: "POST",
        body: formData,
        cache: "no-store",
      })
        .then(async (response) => {
          envioEmAndamento = false;
          submitBtn.disabled = false;

          if (!response.ok) {
            let errData;
            try {
              errData = await response.json();
            } catch {
              throw new Error("Erro desconhecido ao enviar feedback.");
            }

            if (errData.status === "error" && errData.msg) {
              throw new Error(errData.msg);
            } else {
              throw new Error("Erro ao enviar feedback.");
            }
          }
          return response.json();
        })
        .then((data) => {
          formMsg.textContent = data.msg;
          formMsg.style.color = data.status === "success" ? "green" : "red";

          if (data.status === "success") {
            form.reset();
            notaInput.value = "";
            ratingText.textContent = "";
            stars.forEach((s) => s.classList.remove("selected"));
            offset = 0;
            loadMoreBtn.style.display = "inline-block";
            carregarComentarios();
          }
        })
        .catch((error) => {
          envioEmAndamento = false;
          submitBtn.disabled = false;
          formMsg.textContent = error.message || "Erro ao enviar o feedback.";
          formMsg.style.color = "red";
        });
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", carregarComentarios);
  }

  carregarComentarios();
});

// BOTÃO VOLTAR AO TOPO
const btnTopo = document.getElementById("btn-topo");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    btnTopo.classList.add("mostrar");
  } else {
    btnTopo.classList.remove("mostrar");
  }
});

btnTopo.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
