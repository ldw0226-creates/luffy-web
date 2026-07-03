// 1. 헤더 스크롤 효과 (requestAnimationFrame 및 passive 옵션 적용으로 INP 최적화)
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      const header = document.getElementById('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// 2. 모바일 메뉴 토글
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.classList.replace('fa-bars', 'fa-xmark');
  } else {
    icon.classList.replace('fa-xmark', 'fa-bars');
  }
});

// 모바일 메뉴 링크 클릭 시 자동 닫힘
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.replace('fa-xmark', 'fa-bars');
  });
});

// 3. 루피소개 이미지 슬라이더
const sliderImages = document.querySelectorAll('#introSlider img');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
let currentSliderIndex = 0;
let sliderInterval;

function showSliderImage(index) {
  sliderImages.forEach(img => img.classList.remove('active'));
  currentSliderIndex = (index + sliderImages.length) % sliderImages.length;
  sliderImages[currentSliderIndex].classList.add('active');
}

function startSliderTimer() {
  stopSliderTimer();
  sliderInterval = setInterval(() => {
    showSliderImage(currentSliderIndex + 1);
  }, 4000);
}

function stopSliderTimer() {
  if (sliderInterval) clearInterval(sliderInterval);
}

if (sliderPrev && sliderNext && sliderImages.length > 0) {
  sliderPrev.addEventListener('click', () => {
    showSliderImage(currentSliderIndex - 1);
    startSliderTimer();
  });
  
  sliderNext.addEventListener('click', () => {
    showSliderImage(currentSliderIndex + 1);
    startSliderTimer();
  });
  
  // 최초 슬라이드 타이머 구동
  startSliderTimer();
}

// 4. 패키지 가격 탭 전환
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabTarget = btn.getAttribute('data-tab');
    
    // 탭 버튼 활성화 상태 제거 및 추가
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // 탭 콘텐츠 활성화 상태 제거 및 추가
    tabPanes.forEach(pane => {
      if (pane.id === tabTarget) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  });
});

// 5. 요금표 원본 이미지 보기 모달 (HTML 기반 고화질 모달로 전면 동기화)
function openPriceBoard(boardName) {
  const modal = document.getElementById('priceBoardModal');
  const modalImg = document.getElementById('modalPriceBoardImg');
  const modalCustomContent = document.getElementById('modalCustomContent');
  
  // 모든 패키지의 최신 수정한 가격표 원본 데이터 정의
  const boardData = {
    '물놀이패키지': {
      title: '물놀이 패키지',
      sub: 'SELECT POPULAR RIDES',
      icon: 'fa-water',
      tickets: [
        { name: '놀이기구 선택 2종 + 워터파크', desc: '인기 놀이기구중 2종 선택 • 워터파크 무료 포함', orig: '40,000', sale: '20,000', discount: '50%' },
        { name: '놀이기구 선택 3종 + 워터파크', desc: '인기 놀이기구중 3종 선택 • 워터파크 무료 포함', orig: '60,000', sale: '30,000', discount: '50%' },
        { name: '놀이기구 선택 5종 + 워터파크', desc: '인기 놀이기구중 5종 선택 • 워터파크 무료 포함', orig: '100,000', sale: '40,000', discount: '60%' }
      ]
    },
    '강습패키지': {
      title: '스키/보드 강습 패키지',
      sub: 'PROFESSIONAL LESSONS',
      icon: 'fa-graduation-cap',
      tickets: [
        { name: '체험 2회 + 워터파크', desc: '선출 코치 1:1 강습 [지상1회 + 수상2회] • 워터파크 포함', orig: '70,000', sale: '50,000', discount: '28%' },
        { name: '체험 2회 + 놀이기구 3종 + 워터파크', desc: '선출 강습 2회 + 놀이기구 3종 + 워터파크 포함', orig: '120,000', sale: '70,000', discount: '41%' },
        { name: '체험 2회 + 놀이기구 5종 + 워터파크', desc: '선출 강습 2회 + 놀이기구 5종 + 워터파크 포함', orig: '160,000', sale: '90,000', discount: '43%' }
      ]
    },
    '보팅': {
      title: '모터보트 보팅',
      sub: 'SUMMER MOTORBOAT',
      icon: 'fa-ship',
      tickets: [
        { name: '홍천강 일주 모터보트 보팅', desc: '탑승정원 5인 • 시그니처 음료 5잔 제공', orig: '300,000', sale: '200,000', discount: '33%' },
        { name: '남이섬 일주 모터보트 보팅', desc: '탑승정원 5인 • 시그니처 음료 5잔 제공', orig: '500,000', sale: '400,000', discount: '20%' }
      ]
    },
    '숙박물놀이패키지': {
      title: '숙박+물놀이 패키지',
      sub: 'LODGING & WATERPLAY',
      icon: 'fa-hotel',
      tickets: [
        { name: '펜션 + 놀이기구 3종 + 워터파크', desc: '제휴/직영 펜션 1박 • 놀이기구 3종 • 워터파크 포함', orig: '110,000', sale: '50,000', discount: '54%' },
        { name: '펜션 + 놀이기구 5종 + 워터파크', desc: '제휴/직영 펜션 1박 • 놀이기구 5종 • 워터파크 포함', orig: '150,000', sale: '60,000', discount: '60%' }
      ]
    },
    '숙박강습패키지': {
      title: '숙박+강습 패키지',
      sub: 'LODGING & LESSON',
      icon: 'fa-hotel',
      tickets: [
        { name: '펜션 + 강습 2회 + 워터파크', desc: '펜션 1박 • 선출 맞춤강습 2회 • 워터파크 무료 포함', orig: '110,000', sale: '80,000', discount: '27%' },
        { name: '펜션 + 강습 2회 + 놀이기구 3종 + 워터파크', desc: '펜션 1박 • 선출 강습 2회 • 놀이기구 3종 • 워터파크', orig: '190,000', sale: '100,000', discount: '47%' },
        { name: '펜션 + 강습 2회 + 놀이기구 5종 + 워터파크', desc: '펜션 1박 • 선출 강습 2회 • 놀이기구 5종 • 워터파크', orig: '210,000', sale: '110,000', discount: '48%' }
      ]
    }
  };
  
  if (boardData[boardName]) {
    const data = boardData[boardName];
    modalImg.style.display = 'none';
    modalCustomContent.style.display = 'block';
    
    let ticketsHtml = '';
    data.tickets.forEach(ticket => {
      ticketsHtml += `
        <div class="custom-ticket">
          <div class="ticket-left">
            <h4>${ticket.name}</h4>
            <p>${ticket.desc}</p>
          </div>
          <div class="ticket-right">
            <div class="ticket-badge">${ticket.discount}</div>
            <div class="ticket-price-box">
              <span class="ticket-original">${ticket.orig}</span>
              <span class="ticket-sale">${ticket.sale}<span>원</span></span>
            </div>
          </div>
        </div>
      `;
    });
    
    modalCustomContent.innerHTML = `
      <div class="custom-ticket-board">
        <div class="ticket-board-header">
          <span class="ticket-sub">${data.sub}</span>
          <h3><i class="fa-solid ${data.icon}"></i> ${data.title}</h3>
        </div>
        ${ticketsHtml}
      </div>
    `;
  }
  
  modal.classList.add('active');
}

// 6. 포토 갤러리 라이트박스 모달
const galleryItems = document.querySelectorAll('.gallery-item');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
let currentLightboxIndex = 0;
const galleryImagesSrc = Array.from(galleryItems).map(item => item.querySelector('img').src);

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const index = parseInt(item.getAttribute('data-index'));
    currentLightboxIndex = index;
    updateLightboxImage();
    lightboxModal.classList.add('active');
  });
});

function updateLightboxImage() {
  lightboxImg.src = galleryImagesSrc[currentLightboxIndex];
}

function prevLightboxImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryImagesSrc.length) % galleryImagesSrc.length;
  updateLightboxImage();
}

function nextLightboxImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryImagesSrc.length;
  updateLightboxImage();
}

// 7. 모달 닫기 공통 함수
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// 모달 바깥 어두운 배경 클릭 시 닫기 처리
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

// 키보드 Esc 누를 시 활성화된 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// 8. 패키지 카드에서 '예약하기' 클릭 시 폼 연결
function selectPackage(packageName) {
  const selectElement = document.getElementById('packageSelect');
  if (selectElement) {
    selectElement.value = packageName;
  }
}

// 9. FAQ 아코디언 구현
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // 이전 활성화된 FAQ들 접기
    faqItems.forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });
    
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// 10. Leaflet.js를 이용한 인터랙티브 가평 지도 로드
let map;
function initMap() {
  const luffyCoords = [37.7305028, 127.5670831]; // 홍천 마곡리 210-2 실사업장 좌표
  
  map = L.map('map', {
    scrollWheelZoom: false // 스크롤 줌 비활성화로 페이지 스크롤 방해 방지
  }).setView(luffyCoords, 14);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  const customIcon = L.divIcon({
    html: '<div style="background-color: #0076ff; color: #fff; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #fff;"><i class="fa-solid fa-anchor" style="transform: rotate(45deg); font-size: 1.1rem;"></i></div>',
    className: 'custom-map-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
  
  L.marker(luffyCoords, { icon: customIcon }).addTo(map)
    .bindPopup('<div style="font-family:\'Noto Sans KR\'; text-align:center; padding:5px;"><h4 style="margin:0 0 5px 0; color:#0076ff;">루피수상레저</h4><p style="margin:0; font-size:0.85rem; color:#666;">강원도 홍천군 서면 마곡길 394-40</p></div>')
    .openPopup();
}

// Leaflet 지도는 DOM이 모두 준비되고 사용자가 해당 영역 근처로 스크롤했을 때 지연 로드 (Intersection Observer로 INP 성능 최적화)
document.addEventListener('DOMContentLoaded', () => {
  // 예약 희망일 기본값을 내일 날짜로 기본 세팅
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().substring(0, 10);
  const reserveDateEl = document.getElementById('reserveDate');
  if (reserveDateEl) {
    reserveDateEl.value = tomorrowStr;
    reserveDateEl.min = new Date().toISOString().substring(0, 10);
  }
  
  // Intersection Observer를 활용한 지도 지연 로딩
  const mapElement = document.getElementById('map');
  if (mapElement) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            initMap();
            observerInstance.disconnect(); // 한 번 로드되면 감시 중단
          }
        });
      }, { rootMargin: '200px' }); // 화면 진입 200px 전에 미리 로드 시작
      observer.observe(mapElement);
    } else {
      // IntersectionObserver 미지원 구형 브라우저 대응 (폴백)
      setTimeout(initMap, 500);
    }
  }
});

// 11. 예약 문의사항 전송 처리 (Web3Forms API 연동으로 실시간 이메일 수신)
function handleFormSubmit(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  
  // 로딩 상태 표시
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 전송 중...';
  
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const reserveDate = document.getElementById('reserveDate').value;
  const packageSelect = document.getElementById('packageSelect').value;
  const count = document.getElementById('count').value;
  const message = document.getElementById('message').value;
  
  // Web3Forms 전송 데이터 생성
  const formData = {
    access_key: 'f252c2eb-8a57-4f7e-9bd5-82aa120f1ba2',
    subject: `[루피수상레저] ${name}님의 새로운 예약 상담 신청`,
    name: name,
    '연락처 (Phone)': phone,
    '예약 희망일 (Date)': reserveDate,
    '이용 희망 패키지 (Package)': packageSelect,
    '이용 예상 인원 (Guests)': count,
    '추가 문의 사항 및 요청': message || '없음'
  };

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(async (response) => {
    const json = await response.json();
    if (response.status === 200) {
      // 성공 팝업 모달에 전화번호 삽입
      document.getElementById('submittedPhone').innerText = phone;
      // 모달 띄우기
      document.getElementById('successModal').classList.add('active');
      // 폼 리셋
      document.getElementById('inquiryForm').reset();
      // 내일 날짜 기본 세팅 복원
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('reserveDate').value = tomorrow.toISOString().substring(0, 10);
    } else {
      console.log(response);
      alert('오류가 발생했습니다: ' + (json.message || '다시 시도해 주세요.'));
    }
  })
  .catch(error => {
    console.log(error);
    alert('서버 전송 중 인터넷 연결 오류가 발생했습니다. 다시 시도해 주세요.');
  })
  .then(() => {
    // 버튼 복원
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  });
}
