/**
 * iPadOS Dashboard Script
 * - Real-time Clock (Updated every second)
 * - Final Exam D-Day Countdown (Target: December 2nd)
 * - Dynamic Theme Switcher
 * - Spotlight Search Interaction
 */

document.addEventListener("DOMContentLoaded", () => {
  initClock();
  initDDay();
  initThemeToggle();
  initEqualizerAnimation();
});

/* ==========================================================================
   1. Real-Time Clock Engine (Updates every 1000ms)
   ========================================================================== */
function initClock() {
  const daysKorean = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  function updateClock() {
    const now = new Date();

    // Time Components
    let rawHours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = rawHours >= 12 ? "PM" : "AM";

    // 12-Hour format for widget, 24-hour for status bar
    const displayHours12 = String(rawHours % 12 || 12).padStart(2, "0");
    const displayHours24 = String(rawHours).padStart(2, "0");

    // Date Components
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayName = daysKorean[now.getDay()];

    // 1) Update Widget Digital Clock
    const hoursElem = document.getElementById("clock-hours");
    const minsElem = document.getElementById("clock-minutes");
    const secsElem = document.getElementById("clock-seconds");
    const ampmElem = document.getElementById("clock-ampm");
    const fullDateElem = document.getElementById("full-date-korean");

    if (hoursElem) hoursElem.textContent = displayHours12;
    if (minsElem) minsElem.textContent = minutes;
    if (secsElem) secsElem.textContent = seconds;
    if (ampmElem) ampmElem.textContent = ampm;
    if (fullDateElem) fullDateElem.textContent = `${year}년 ${month}월 ${date}일 ${dayName}`;

    // 2) Update iPadOS Top Status Bar
    const statusTimeElem = document.getElementById("status-time");
    const statusDateElem = document.getElementById("status-date");

    if (statusTimeElem) statusTimeElem.textContent = `${displayHours24}:${minutes}`;
    if (statusDateElem) statusDateElem.textContent = `${month}월 ${date}일 ${dayName}`;
  }

  // Initial call and 1-second interval
  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. 12월 2일 기말시험 D-Day Countdown Engine
   ========================================================================== */
function initDDay() {
  const ddayBadge = document.getElementById("dday-badge");
  const ddayMsg = document.getElementById("dday-status-message");
  const daysCount = document.getElementById("days-count");
  const hoursCount = document.getElementById("hours-count");
  const minsCount = document.getElementById("mins-count");
  const secsCount = document.getElementById("secs-count");
  const progressBar = document.getElementById("dday-progress-bar");
  const percentText = document.getElementById("dday-percent");

  function getTargetExamDate(now) {
    const currentYear = now.getFullYear();
    let target = new Date(currentYear, 11, 2, 0, 0, 0); // 11 is December (0-indexed)

    // If current date has already passed December 2nd of this year, target next year
    if (now.getTime() > target.getTime() + (24 * 60 * 60 * 1000)) {
      target = new Date(currentYear + 1, 11, 2, 0, 0, 0);
    }
    return target;
  }

  function updateDDay() {
    const now = new Date();
    const target = getTargetExamDate(now);
    const diffMs = target.getTime() - now.getTime();

    if (diffMs > 0) {
      // Future: Countdown
      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Update badge
      if (ddayBadge) ddayBadge.textContent = `D-${days}`;

      // Update motivational quote based on remaining days
      if (ddayMsg) {
        if (days > 60) {
          ddayMsg.textContent = "기초를 다지며 꾸준한 학습 루틴을 만들 때입니다!";
        } else if (days > 30) {
          ddayMsg.textContent = "본격적인 시험 대비와 핵심 요약 정리를 시작하세요!";
        } else if (days > 7) {
          ddayMsg.textContent = "집중력을 최대로 높여 기출과 핵심 정리를 완성하세요!";
        } else {
          ddayMsg.textContent = "마지막 스퍼트! 컨디션 관리와 총복습에 힘쓰세요!";
        }
      }

      // Update timers
      if (daysCount) daysCount.textContent = String(days).padStart(2, "0");
      if (hoursCount) hoursCount.textContent = String(hours).padStart(2, "0");
      if (minsCount) minsCount.textContent = String(minutes).padStart(2, "0");
      if (secsCount) secsCount.textContent = String(seconds).padStart(2, "0");

      // Semester Progress (approx 100-day countdown to exam)
      const semesterStart = new Date(target.getTime() - (100 * 24 * 60 * 60 * 1000));
      const totalPeriod = target.getTime() - semesterStart.getTime();
      const elapsed = Math.max(0, now.getTime() - semesterStart.getTime());
      let percentage = Math.min(100, Math.round((elapsed / totalPeriod) * 100));

      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (percentText) percentText.textContent = `${percentage}%`;

    } else {
      // D-Day or Past
      const pastDays = Math.floor(Math.abs(diffMs) / (1000 * 3600 * 24));
      if (pastDays === 0) {
        if (ddayBadge) ddayBadge.textContent = "D-DAY";
        if (ddayMsg) ddayMsg.textContent = "기말시험 당일입니다! 최고의 실력을 발휘하세요!";
      } else {
        if (ddayBadge) ddayBadge.textContent = `D+${pastDays}`;
        if (ddayMsg) ddayMsg.textContent = "기말시험 기간이 진행 중이거나 완료되었습니다.";
      }
      if (daysCount) daysCount.textContent = "00";
      if (hoursCount) hoursCount.textContent = "00";
      if (minsCount) minsCount.textContent = "00";
      if (secsCount) secsCount.textContent = "00";
      if (progressBar) progressBar.style.width = "100%";
      if (percentText) percentText.textContent = "100%";
    }
  }

  updateDDay();
  setInterval(updateDDay, 1000);
}

/* ==========================================================================
   3. Theme Mode Toggle (iPad Wallpapers)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const themes = ["theme-default", "theme-sunset", "theme-forest"];
  let currentThemeIndex = 0;

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      // Remove current theme class
      document.body.classList.remove(themes[currentThemeIndex]);
      
      // Cycle to next theme
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const nextTheme = themes[currentThemeIndex];
      
      if (nextTheme !== "theme-default") {
        document.body.classList.add(nextTheme);
      }

      // Add feedback bump effect
      toggleBtn.style.transform = "scale(1.25) rotate(45deg)";
      setTimeout(() => {
        toggleBtn.style.transform = "";
      }, 300);
    });
  }
}

/* ==========================================================================
   4. Equalizer Visual Effect for YouTube Music
   ========================================================================== */
function initEqualizerAnimation() {
  const bars = document.querySelectorAll(".eq-bar");
  if (!bars || bars.length === 0) return;

  // Randomize heights slightly for organic audio feel
  setInterval(() => {
    bars.forEach((bar) => {
      const randomHeight = Math.floor(Math.random() * 12) + 4;
      bar.style.height = `${randomHeight}px`;
    });
  }, 350);
}
