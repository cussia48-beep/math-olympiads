/* =========================================================
   OLYMPIAD MATH — RESTORED INTERACTIVE SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     PAGE VISUAL IDENTITY
     ======================================================= */

  const pageName =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase() || "index.html";

  document.body.classList.add(
    "page-" + pageName.replace(".html", "")
  );

  /* =======================================================
     1. THEME SWITCHER
     ======================================================= */

  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("olympiadTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  function updateThemeButton() {
    if (!themeToggle) return;

    themeToggle.textContent =
      document.body.classList.contains("dark")
        ? "☀ Light"
        : "☾ Dark";
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {

      document.body.classList.toggle("dark");

      const theme =
        document.body.classList.contains("dark")
          ? "dark"
          : "light";

      localStorage.setItem("olympiadTheme", theme);

      updateThemeButton();
    });
  }


  /* =======================================================
     2. AUTOMATIC ACTIVE NAVIGATION
     ======================================================= */

  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase() || "index.html";

  document.querySelectorAll(".nav-links a").forEach(link => {

    const href =
      (link.getAttribute("href") || "")
        .split("/")
        .pop()
        .toLowerCase();

    link.classList.remove("active");

    if (href === currentPage) {
      link.classList.add("active");
    }

  });


  /* =======================================================
     3. LOCAL USER PROFILE
     ======================================================= */

  function getCurrentUser() {
    return localStorage.getItem("olympiadUser") || "Guest Scholar";
  }

  function setCurrentUser(name) {
    const cleanName = name.trim();

    if (!cleanName) return;

    localStorage.setItem("olympiadUser", cleanName);
  }

  const currentUserElements =
    document.querySelectorAll("#currentUser");

  currentUserElements.forEach(element => {
    element.textContent = getCurrentUser();
  });


  /* =======================================================
     4. LOGIN / REGISTER
     ======================================================= */

  const authForm = document.getElementById("authForm");
  const authMode = document.getElementById("authMode");
  const authName = document.getElementById("authName");
  const authTitle = document.getElementById("authTitle");
  const authMsg = document.getElementById("authMsg");

  const authTabs =
    document.querySelectorAll(".auth-tabs button");

  function updateAuthMode(mode) {

    if (!authMode) return;

    authMode.value = mode;

    if (authTitle) {
      authTitle.textContent =
        mode === "register"
          ? "Create your scholar profile"
          : "Welcome back";
    }

    authTabs.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.mode === mode
      );
    });

    if (authName) {
      authName.placeholder =
        mode === "register"
          ? "e.g. Emmanuel"
          : "Enter your display name";
    }

  }

  authTabs.forEach(button => {

    button.addEventListener("click", () => {
      updateAuthMode(button.dataset.mode);
    });

  });

  if (authForm) {

    authForm.addEventListener("submit", event => {

      event.preventDefault();

      const name =
        authName?.value.trim();

      if (!name) return;

      setCurrentUser(name);

      if (authMsg) {

        authMsg.style.display = "block";

        authMsg.textContent =
          authMode?.value === "register"
            ? `Welcome, ${name}! Your scholar profile has been created.`
            : `Welcome back, ${name}!`;

      }

      /*
       * Update every current-user element immediately.
       */

      document
        .querySelectorAll("#currentUser")
        .forEach(element => {
          element.textContent = name;
        });

      /*
       * Store a simple account record.
       */

      localStorage.setItem(
        "olympiadAccount",
        JSON.stringify({
          name: name,
          created: new Date().toISOString()
        })
      );

    });

  }


  /* =======================================================
     5. HOME PAGE SEARCH
     ======================================================= */

  const siteSearch =
    document.getElementById("siteSearch");

  const searchCards =
    document.querySelectorAll(".cards .card");

  if (siteSearch && searchCards.length) {

    siteSearch.addEventListener("input", () => {

      const query =
        siteSearch.value
          .trim()
          .toLowerCase();

      searchCards.forEach(card => {

        const searchableText =
          (
            card.dataset.search ||
            card.textContent ||
            ""
          ).toLowerCase();

        const matches =
          searchableText.includes(query);

        card.style.display =
          matches ? "" : "none";

      });

    });

  }


  /* =======================================================
     6. PRACTICE PROBLEM SOLUTION REVEAL
     ======================================================= */

  const revealButtons =
    document.querySelectorAll(".reveal");

  revealButtons.forEach(button => {

    button.addEventListener("click", () => {

      const answer =
        button.nextElementSibling;

      if (!answer) return;

      const currentlyVisible =
        answer.style.display === "block";

      answer.style.display =
        currentlyVisible ? "none" : "block";

      button.textContent =
        currentlyVisible
          ? "Show solution"
          : "Hide solution";

    });

  });


  /* =======================================================
     7. PRACTICAL TEST
     ======================================================= */

  const quizForm =
    document.getElementById("quizForm");

  const timerElement =
    document.getElementById("timer");

  const resultElement =
    document.getElementById("result");

  if (quizForm) {

    const answerKey = {
      q1: "b",
      q2: "c",
      q3: "a",
      q4: "d",
      q5: "b",
      q6: "c",
      q7: "a",
      q8: "d",
      q9: "a",
      q10: "a"
    };

    const totalQuestions =
      Object.keys(answerKey).length;

    const durationSeconds =
      15 * 60;

    let remainingSeconds =
      durationSeconds;

    let submitted = false;

    function formatTime(seconds) {

      const minutes =
        Math.floor(seconds / 60);

      const secs =
        seconds % 60;

      return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
      );

    }

    function updateTimer() {

      if (!timerElement) return;

      timerElement.textContent =
        `⏱ ${formatTime(remainingSeconds)}`;

      if (remainingSeconds <= 60) {

        timerElement.style.background =
          "linear-gradient(135deg,#dc2626,#f97316)";

      }

      if (remainingSeconds <= 0) {

        submitQuiz(true);

      }

    }

    updateTimer();

    const timerInterval =
      setInterval(() => {

        if (submitted) {
          clearInterval(timerInterval);
          return;
        }

        remainingSeconds--;

        updateTimer();

      }, 1000);


    function submitQuiz(autoSubmitted = false) {

      if (submitted) return;

      submitted = true;

      clearInterval(timerInterval);

      let score = 0;

      Object.entries(answerKey)
        .forEach(([question, correctAnswer]) => {

          const selected =
            quizForm.querySelector(
              `input[name="${question}"]:checked`
            );

          if (
            selected &&
            selected.value === correctAnswer
          ) {
            score++;
          }

        });

      const percentage =
        Math.round(
          (score / totalQuestions) * 100
        );

      localStorage.setItem(
        "olympiadLastScore",
        String(percentage)
      );

      localStorage.setItem(
        "olympiadLastRawScore",
        `${score}/${totalQuestions}`
      );

      localStorage.setItem(
        "olympiadLastUser",
        getCurrentUser()
      );

      if (resultElement) {

        const passed =
          percentage >= 75;

        resultElement.innerHTML = `
          <div class="card" style="
            margin-top:20px;
            text-align:center;
            border-top:5px solid ${
              passed ? "#16a34a" : "#db2777"
            };
          ">

            <span class="badge">
              ${autoSubmitted ? "Time finished" : "Test completed"}
            </span>

            <h2 style="margin:15px 0 8px">
              Your score: ${score}/${totalQuestions}
            </h2>

            <p style="
              color:var(--muted);
              font-size:1.15rem;
            ">
              ${percentage}%
            </p>

            <p style="
              font-weight:800;
              color:${
                passed
                  ? "#16a34a"
                  : "#db2777"
              };
            ">
              ${
                passed
                  ? "🎉 Congratulations! You reached the certificate threshold."
                  : "Keep practicing! You need 75% or higher for a certificate."
              }
            </p>

            ${
              passed
                ? `
                  <a
                    class="btn"
                    href="certificate.html"
                  >
                    🏆 View Certificate →
                  </a>
                `
                : `
                  <a
                    class="btn secondary"
                    href="test.html"
                  >
                    Try Again →
                  </a>
                `
            }

          </div>
        `;

      }

      quizForm
        .querySelectorAll("input")
        .forEach(input => {
          input.disabled = true;
        });

    }

    quizForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        submitQuiz(false);

      }
    );

  }


  /* =======================================================
     8. CERTIFICATE PAGE
     ======================================================= */

  const certName =
    document.getElementById("certName");

  const certScore =
    document.getElementById("certScore");

  const lastScore =
    localStorage.getItem("olympiadLastScore");

  const certificateUser =
    localStorage.getItem("olympiadLastUser") ||
    getCurrentUser();

  if (certName) {
    certName.textContent =
      certificateUser;
  }

  if (certScore) {

    certScore.textContent =
      lastScore
        ? `${lastScore}%`
        : "—";

  }


  /* =======================================================
     9. CERTIFICATE PRINTING
     ======================================================= */

  const printCert =
    document.getElementById("printCert");

  if (printCert) {

    printCert.addEventListener("click", () => {

      window.print();

    });

  }


  /* =======================================================
     10. LEADERBOARD
     ======================================================= */

  const leaderboardList =
    document.getElementById("leaderboardList");

  if (leaderboardList) {

    const user =
      getCurrentUser();

    const userScore =
      Number(
        localStorage.getItem(
          "olympiadLastScore"
        ) || 0
      );

    const sampleScores = [
      {
        name: "Math Explorer",
        score: 100
      },
      {
        name: "Olympiad Star",
        score: 95
      },
      {
        name: "Proof Master",
        score: 90
      },
      {
        name: "Number Ninja",
        score: 85
      },
      {
        name: "Geometry Thinker",
        score: 80
      }
    ];

    /*
     * Add the current scholar if a test has been completed.
     */

    if (
      user !== "Guest Scholar" &&
      localStorage.getItem("olympiadLastScore")
    ) {

      sampleScores.push({
        name: user,
        score: userScore,
        current: true
      });

    }

    /*
     * Sort highest score first.
     */

    sampleScores.sort(
      (a, b) => b.score - a.score
    );

    leaderboardList.innerHTML = "";

    sampleScores.forEach((entry, index) => {

      const row =
        document.createElement("div");

      row.className =
        "leaderboard-row";

      row.innerHTML = `
        <div style="
          display:flex;
          align-items:center;
          gap:12px;
        ">

          <span class="leaderboard-rank">
            ${index + 1}
          </span>

          <strong>
            ${escapeHTML(entry.name)}
            ${
              entry.current
                ? " ⭐"
                : ""
            }
          </strong>

        </div>

        <span class="leaderboard-score">
          ${entry.score}%
        </span>
      `;

      leaderboardList.appendChild(row);

    });

  }


  /* =======================================================
     11. FEEDBACK
     ======================================================= */

  const feedbackForm =
    document.getElementById("feedbackForm");

  const feedbackThanks =
    document.getElementById("feedbackThanks");

  if (feedbackForm) {

    feedbackForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const textarea =
          feedbackForm.querySelector("textarea");

        const nameInput =
          feedbackForm.querySelector(
            'input[type="text"]'
          );

        const emailInput =
          feedbackForm.querySelector(
            'input[type="email"]'
          );

        const feedback = {
          user: getCurrentUser(),

          name:
            nameInput?.value.trim() || "",

          email:
            emailInput?.value.trim() || "",

          message:
            textarea?.value.trim() || "",

          date:
            new Date().toISOString()
        };

        localStorage.setItem(
          "olympiadLastFeedback",
          JSON.stringify(feedback)
        );

        if (feedbackThanks) {
          feedbackThanks.style.display =
            "block";
        }

        feedbackForm.reset();

        /*
         * Restore the signed-in display after reset.
         */

        document
          .querySelectorAll("#currentUser")
          .forEach(element => {
            element.textContent =
              getCurrentUser();
          });

      }
    );

  }


  /* =======================================================
     12. SMALL HTML-SAFETY HELPER
     ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     13. RESTORE STORED USER ON LOGIN PAGE
     ======================================================= */

  if (
    authName &&
    getCurrentUser() !== "Guest Scholar"
  ) {

    authName.value =
      getCurrentUser();

  }

});