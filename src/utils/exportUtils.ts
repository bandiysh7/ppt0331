// PDF 출력용 HTML 생성
export const generatePrintWindow = () => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }

  const printHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>지상조업 안전사고예방 간담회 - 인쇄</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      background: white;
    }
    
    .print-container {
      width: 100%;
    }
    
    .print-slide {
      width: 100%;
      height: 50vh;
      page-break-inside: avoid;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      position: relative;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .print-slide:nth-child(2n) {
      page-break-after: always;
    }
    
    .print-slide h1 {
      font-size: 2rem;
      color: #1e293b;
      margin-bottom: 1rem;
    }
    
    .print-slide p {
      font-size: 1.2rem;
      color: #64748b;
    }
    
    @media screen {
      .print-slide {
        margin-bottom: 0.5rem;
      }
      body {
        padding: 1rem;
        background: #f5f5f5;
      }
    }
  </style>
</head>
<body>
  <div class="print-container" id="slides"></div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 1500);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(printHTML);
  printWindow.document.close();

  // 슬라이드 복제
  setTimeout(() => {
    const container = printWindow.document.getElementById('slides');
    if (!container) return;

    // 원본 페이지의 숨겨진 슬라이드 복제
    const slides = document.querySelectorAll('.slide-container .web-slide');
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true) as HTMLElement;
      clone.className = 'print-slide';
      container.appendChild(clone);
    });
  }, 100);
};

// Standalone HTML 다운로드
export const downloadStandaloneHTML = () => {
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>지상조업 안전사고예방 간담회</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
      overflow: hidden;
      background: white;
    }
    
    .presentation {
      width: 100vw;
      height: 100vh;
      position: relative;
      background: white;
    }
    
    .slide {
      display: none;
      width: 100%;
      height: 100%;
      padding: 4rem;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .slide.active {
      display: flex;
    }
    
    .slide h1 {
      font-size: 4rem;
      margin-bottom: 2rem;
      color: #1e293b;
      font-weight: 900;
    }
    
    .slide h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      color: #3b82f6;
      font-weight: 700;
    }
    
    .slide p {
      font-size: 1.5rem;
      color: #64748b;
      max-width: 800px;
      line-height: 1.6;
    }
    
    .nav {
      position: fixed;
      bottom: 3rem;
      right: 3rem;
      display: flex;
      gap: 1rem;
      z-index: 100;
    }
    
    .nav button {
      padding: 1rem 2rem;
      border: 2px solid #cbd5e1;
      background: white;
      cursor: pointer;
      border-radius: 0.75rem;
      font-weight: bold;
      font-size: 1.125rem;
      transition: all 0.3s;
      font-family: inherit;
    }
    
    .nav button:hover {
      background: #f1f5f9;
      border-color: #3b82f6;
      transform: translateY(-2px);
    }
    
    .counter {
      position: fixed;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Courier New', monospace;
      font-weight: bold;
      font-size: 1.25rem;
      background: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      border: 2px solid #e2e8f0;
    }
    
    .label {
      display: inline-block;
      background: #1e293b;
      color: white;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="presentation">
    <div class="slide active">
      <span class="label">Introduction</span>
      <h1>지상조업 안전사고예방 간담회</h1>
      <p>국토교통부 공항운영과 | 2026.3.31.(화) | 한국공항공사 6층 컨퍼런스룸</p>
    </div>
    
    <div class="slide">
      <span class="label">Contents</span>
      <h1>목차</h1>
      <p>총 17개 슬라이드로 구성된 안전교육 자료입니다</p>
    </div>
    
    <div class="slide">
      <span class="label">01. Overview</span>
      <h2>간담회 개요</h2>
      <p>지상조업 안전강화를 위한 소통형 교육 및 자발적 안전문화 확산</p>
    </div>
    
    <div class="slide">
      <span class="label">02. System</span>
      <h2>추진체계</h2>
      <p>유관기관 협업을 통한 체계적인 안전관리</p>
    </div>
    
    <div class="slide">
      <span class="label">03. Definition</span>
      <h2>지상안전사고란?</h2>
      <p>공항 내에서 발생하는 각종 지상조업 관련 사고</p>
    </div>
    
    <div class="slide">
      <span class="label">04. Types</span>
      <h2>사고 유형</h2>
      <p>차량충돌, 항공기 손상, 인적사고 등 다양한 유형</p>
    </div>
    
    <div class="slide">
      <span class="label">05. Report</span>
      <h2>사고 신고</h2>
      <p>즉시 신고 및 보고 체계 확립</p>
    </div>
    
    <div class="slide">
      <span class="label">06. Penalty</span>
      <h2>행정처분 기준</h2>
      <p>사고 유형별 처분 기준 안내</p>
    </div>
    
    <div class="slide">
      <span class="label">07. Statistics</span>
      <h2>사고 발생 현황</h2>
      <p>2020년 ~ 2025년 연도별 통계</p>
    </div>
    
    <div class="slide">
      <span class="label">08. By Airport</span>
      <h2>공항별 사고 현황</h2>
      <p>주요 공항별 발생 현황 분석</p>
    </div>
    
    <div class="slide">
      <span class="label">09. Goals - National</span>
      <h2>예방 목표 달성 현황 (전국)</h2>
      <p>2025년 목표 대비 달성률</p>
    </div>
    
    <div class="slide">
      <span class="label">10. Goals - By Corp</span>
      <h2>예방 목표 달성 현황 (공사별)</h2>
      <p>공항공사별 세부 현황</p>
    </div>
    
    <div class="slide">
      <span class="label">11. Causes</span>
      <h2>주요 사고 원인</h2>
      <p>운전자 부주의가 주요 원인</p>
    </div>
    
    <div class="slide">
      <span class="label">12. Cases 2025</span>
      <h2>2025년 주요 사례</h2>
      <p>실제 발생 사례 분석</p>
    </div>
    
    <div class="slide">
      <span class="label">13. Gallery</span>
      <h2>사고 갤러리</h2>
      <p>사진으로 보는 주요 사고 현장</p>
    </div>
    
    <div class="slide">
      <span class="label">14. Platform</span>
      <h2>웹사이트 소개</h2>
      <p>공항 지상안전사고 예방 포털</p>
    </div>
    
    <div class="slide">
      <span class="label">Conclusion</span>
      <h1>감사합니다</h1>
      <h2>하늘 위 안전은 지상에서부터 시작합니다</h2>
    </div>
  </div>
  
  <div class="nav">
    <button onclick="prevSlide()">◀ 이전</button>
    <button onclick="nextSlide()">다음 ▶</button>
  </div>
  <div class="counter" id="counter"></div>
  
  <script>
    let current = 0;
    const slides = document.querySelectorAll('.slide');
    const total = slides.length;
    
    function updateCounter() {
      document.getElementById('counter').textContent = 
        String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }
    
    function showSlide(n) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === n);
      });
      updateCounter();
    }
    
    function nextSlide() {
      current = (current + 1) % total;
      showSlide(current);
    }
    
    function prevSlide() {
      current = (current - 1 + total) % total;
      showSlide(current);
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F11') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    });
    
    updateCounter();
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '지상조업_안전사고예방_간담회.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
