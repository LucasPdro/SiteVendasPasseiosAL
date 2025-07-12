// Funções de ação para os botões
function reservar(destino) {
  alert(`Você escolheu reservar o passeio para: ${destino}`);
  // Aqui você pode redirecionar ou abrir um formulário
}

function comprar(destino) {
  alert(`Você escolheu comprar o passeio para: ${destino}`);
  // Aqui você pode redirecionar para checkout ou integrar com API
}

// Script do Supabase para avaliações -->
// Substitua pelas suas credenciais do Supabase
const SUPABASE_URL = "https://gbtndkjgichrhpcxkzxv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidG5ka2pnaWNocmhwY3hrenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjM4MzEsImV4cCI6MjA2NzU5OTgzMX0.-I88fp30KOP11U8pvx-FDtKTYkqhZ9X2-iqJP-_BCo0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const feedbackList = document.getElementById("feedback-list");
const feedbackForm = document.getElementById("feedback-form");
const formMsg = document.getElementById("form-msg");

async function loadFeedbacks() {
  let { data, error } = await supabase
    .from("avaliacoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    feedbackList.innerHTML = "<p>Erro ao carregar avaliações.</p>";
    console.error(error);
    return;
  }

  if (data.length === 0) {
    feedbackList.innerHTML = "<p>Nenhuma avaliação enviada ainda.</p>";
    return;
  }

  feedbackList.innerHTML = data
    .map(
      (fb) => `
        <div class="feedback-item">
          <strong>${fb.nome_cliente}</strong> - Nota: ${fb.nota}<br />
          <p>${fb.comentario}</p>
        </div>
      `
    )
    .join("");
}

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.style.color = "red";
  formMsg.textContent = "";

  const nome = feedbackForm.nome.value.trim();
  const comentario = feedbackForm.comentario.value.trim();
  const nota = feedbackForm.nota.value;

  if (!nome || !comentario || !nota) {
    formMsg.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  const { error } = await supabase.from("avaliacoes").insert([
    {
      nome_cliente: nome, // <- CAMPO CORRETO
      comentario,
      nota,
    },
  ]);

  if (error) {
    formMsg.textContent = "Erro ao enviar feedback. Tente novamente.";
    console.error(error);
    return;
  }

  formMsg.style.color = "green";
  formMsg.textContent = "Obrigado pelo seu feedback!";
  feedbackForm.reset();
  loadFeedbacks();
});

// Carrega as avaliações quando a página for carregada
loadFeedbacks();
