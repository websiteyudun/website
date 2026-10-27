// 獨居蜂探索館 - 互動與學習進度腳本
const STORAGE_KEY = "solitary_bee_learned_topics_v1";
const ALL_TOPICS = ["classification", "species", "foraging", "nesting", "offspring"];

function getLearnedTopics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function markTopicLearned(topicId) {
  if (!ALL_TOPICS.includes(topicId)) return;
  const learned = getLearnedTopics();
  if (!learned.includes(topicId)) {
    learned.push(topicId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(learned));
    } catch (e) {}
  }
}

function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  updateProgressUI();
}

function updateProgressUI() {
  const learned = getLearnedTopics();

  // 更新頂部導覽列已完成圓點
  document.querySelectorAll(".nav-links a[data-topic]").forEach((link) => {
    const topic = link.getAttribute("data-topic");
    if (learned.includes(topic)) {
      link.classList.add("completed");
    } else {
      link.classList.remove("completed");
    }
  });

  // 更新目錄頁卡片狀態
  document.querySelectorAll(".topic-card[data-topic]").forEach((card) => {
    const topic = card.getAttribute("data-topic");
    const statusEl = card.querySelector(".topic-status");
    if (learned.includes(topic)) {
      card.classList.add("is-read");
      if (statusEl) statusEl.textContent = "✓ 已完成學習";
    } else {
      card.classList.remove("is-read");
      if (statusEl) statusEl.textContent = "尚未閱讀";
    }
  });

  // 更新目錄頁進度條
  const countEl = document.getElementById("progress-count");
  const fillEl = document.getElementById("progress-fill");
  if (countEl && fillEl) {
    const count = learned.length;
    const pct = Math.round((count / ALL_TOPICS.length) * 100);
    countEl.textContent = `${count} / ${ALL_TOPICS.length} 主題已完成 (${pct}%)`;
    fillEl.style.width = `${pct}%`;
  }
}

// 互動式小測驗通用綁定
function initQuizzes() {
  document.querySelectorAll(".quiz-box").forEach((box) => {
    const options = box.querySelectorAll(".quiz-option");
    const feedback = box.querySelector(".quiz-feedback");
    options.forEach((btn) => {
      btn.addEventListener("click", () => {
        options.forEach((b) => {
          b.classList.remove("correct", "wrong");
        });
        const isCorrect = btn.getAttribute("data-correct") === "true";
        const explain = btn.getAttribute("data-explain") || "";
        if (isCorrect) {
          btn.classList.add("correct");
          if (feedback) {
            feedback.style.display = "block";
            feedback.style.background = "#dcfce7";
            feedback.style.color = "#14532d";
            feedback.innerHTML = `🎉 <strong>答對了！</strong> ${explain}`;
          }
        } else {
          btn.classList.add("wrong");
          if (feedback) {
            feedback.style.display = "block";
            feedback.style.background = "#fee2e2";
            feedback.style.color = "#7f1d1d";
            feedback.innerHTML = `💡 <strong>再想一下：</strong> ${explain}`;
          }
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const currentTopic = document.body.getAttribute("data-page-topic");
  if (currentTopic && ALL_TOPICS.includes(currentTopic)) {
    markTopicLearned(currentTopic);
  }
  updateProgressUI();
  initQuizzes();

  const resetBtn = document.getElementById("reset-progress-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetProgress();
    });
  }
});
