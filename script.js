// 1. 헤더 스크롤 효과
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

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

// 5. 요금표 원본 이미지 보기 모달
function openPriceBoard(boardName) {
  const modal = document.getElementById('priceBoardModal');
  const modalImg = document.getElementById('modalPriceBoardImg');
  
  // 이미지 매핑 경로
  const imagePaths = {
    '물놀이패키지': '패키지가격표/물놀이패키지.jpg',
    '강습패키지': '패키지가격표/강습패키지.jpg',
    '보팅': '패키지가격표/보팅.jpg',
    '숙박물놀이패키지': '패키지가격표/숙박물놀이패키지.jpg',
    '숙박강습패키지': '패키지가격표/숙박강습패키지.jpg'
  };
  
  if (imagePaths[boardName]) {
    modalImg.src = imagePaths[boardName];
    modal.classList.add('active');
  }
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

// Leaflet 지도는 DOM이 모두 준비된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  
  // 예약 희망일 기본값을 내일 날짜로 기본 세팅
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().substring(0, 10);
  document.getElementById('reserveDate').value = tomorrowStr;
  document.getElementById('reserveDate').min = new Date().toISOString().substring(0, 10);
});

// 11. 예약 문의사항 전송 처리 (가상 제출 및 모달 알림)
function handleFormSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const reserveDate = document.getElementById('reserveDate').value;
  const packageSelect = document.getElementById('packageSelect').value;
  const count = document.getElementById('count').value;
  const message = document.getElementById('message').value;
  
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
}
