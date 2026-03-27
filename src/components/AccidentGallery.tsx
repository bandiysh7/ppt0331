import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, AlertTriangle, Calendar, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GalleryItem {
  id: number;
  title: string;
  airport: string;
  date: string;
  cause: string;
  content: string;
  prevention: string;
  imageUrl: string;
}

const BASE_URL = import.meta.env.BASE_URL;

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "탑승교(PBB) 하단 높이 제한 충돌",
    airport: "인천공항",
    date: "2025-01-15",
    cause: "높이 제한 무시 및 전방 주시 태만",
    content: "조업 차량이 탑승교 하단 통과 중 높이 제한을 인지하지 못해 상단부 충돌. 탑승교(PBB) 하단부 높이 제한을 인지하지 못해 발생하는 충돌 사례가 빈번합니다.",
    prevention: "시설물 통과 전 반드시 높이 제한 표지판 확인 및 차량 높이 대조 필수",
    imageUrl: `${BASE_URL}acc_img/01_01.jpg`
  },
  {
    id: 2,
    title: "탑승교(PBB) 하단 충돌 사고",
    airport: "인천공항",
    date: "2025-01-16",
    cause: "높이 제한 인지 부족",
    content: "차량 간 추돌이나 주기장 내 시설물과의 충돌 사례입니다. 특히 탑승교 하단 통과 시 차량 높이와 제한 높이를 반드시 확인해야 합니다.",
    prevention: "익숙한 경로라도 시설물 높이 제한을 상시 확인하고 서행 운전 준수",
    imageUrl: `${BASE_URL}acc_img/01_02.jpg`
  },
  {
    id: 3,
    title: "급유차 후진 중 항공기 날개 접촉",
    airport: "인천공항",
    date: "2025-01-30",
    cause: "유도자 없이 후진 접현",
    content: "급유차 후진 중 유도자 미배치로 항공기 날개 끝단 접촉. 급유차 후진 중 날개 접촉 등으로 기체가 손상되는 전형적인 사례입니다.",
    prevention: "항공기 접현 시 반드시 유도자 배치 및 유도 신호에 따른 정밀 조작",
    imageUrl: `${BASE_URL}acc_img/02_01.jpg`
  },
  {
    id: 4,
    title: "로더 작업 중 작업자 낙상",
    airport: "김해공항",
    date: "2025-03-12",
    cause: "안전 수칙 미준수 및 부주의",
    content: "로더·사다리 작업 중 낙상 사고입니다. 작업 중 발을 헛디디거나 안전 장구 미착용으로 인해 발생하는 부상 사고입니다.",
    prevention: "고소 작업 시 안전모/안전대 착용 철저 및 작업 발판 안전 상태 점검",
    imageUrl: `${BASE_URL}acc_img/03_01.jpg`
  },
  {
    id: 5,
    title: "사다리 작업 중 추락 사고",
    airport: "김해공항",
    date: "2025-03-13",
    cause: "안전거리 미확보 및 부주의",
    content: "로더 및 사다리 위에서 작업 중 균형을 잃고 추락한 사례입니다. 고소 작업 시에는 반드시 2인 1조 작업 및 안전 고리 체결이 필요합니다.",
    prevention: "2인 1조 작업 원칙 준수 및 사다리 전도 방지 조치(아웃트리거 등) 확인",
    imageUrl: `${BASE_URL}acc_img/03_02.jpg`
  },
  {
    id: 6,
    title: "작업대 낙상 부상 사고",
    airport: "김해공항",
    date: "2025-03-14",
    cause: "작업 전 주변 확인 소홀",
    content: "작업대 이동 또는 작업 중 발생하는 낙상 사고는 중대 부상으로 이어질 수 있습니다. 현장 안전 수칙 준수가 무엇보다 중요합니다.",
    prevention: "작업대 이동 전 주변 장애물 확인 및 작업자 승하차 시 안전 손잡이 사용",
    imageUrl: `${BASE_URL}acc_img/03_03.jpg`
  },
  {
    id: 7,
    title: "터그카 출발 시 작업자 끼임",
    airport: "김포공항",
    date: "2025-01-22",
    cause: "출발 전 주변 확인 소홀",
    content: "터그카 출발 시 주변 작업자를 확인하지 못해 발생한 끼임 사고입니다. 터그카 출발 시 끼임 등은 빈번한 부상 사고 유형입니다.",
    prevention: "장비 출발 전 반드시 '360도 회전 확인' 및 주변 작업자에게 신호 전달",
    imageUrl: `${BASE_URL}acc_img/04_01.jpg`
  },
  {
    id: 8,
    title: "터그카 주행 중 협착 사고",
    airport: "김포공항",
    date: "2025-01-23",
    cause: "안일함 및 전방 주시 태만",
    content: "장비 가동 중 사각지대에 위치한 작업자를 인지하지 못해 발생한 사고입니다. 출발 전 반드시 360도 회전 확인이 필요합니다.",
    prevention: "사각지대 확인을 위한 보조 거울 활용 및 유도자와의 긴밀한 소통",
    imageUrl: `${BASE_URL}acc_img/04_02.jpg`
  },
  {
    id: 9,
    title: "이동 중 달리 결박 해제",
    airport: "제주공항",
    date: "2025-02-18",
    cause: "결박 상태 점검 소홀",
    content: "달리 결박 해제로 인해 적재물이 낙하하거나 기체가 손상되는 사고입니다. 출발 전 결박 장치의 이상 유무를 반드시 확인해야 합니다.",
    prevention: "달리 연결 및 적재물 결박 상태 이중 점검(Cross-check) 생활화",
    imageUrl: `${BASE_URL}acc_img/05_01.jpg`
  },
  {
    id: 10,
    title: "달리 분리 및 기체 손상",
    airport: "제주공항",
    date: "2025-02-19",
    cause: "안전 수칙 미준수",
    content: "이동 중 달리가 분리되어 항공기 또는 주변 시설물과 충돌한 사례입니다. 결박 해제는 기체 손상의 주요 원인 중 하나입니다.",
    prevention: "장비 노후화에 따른 결박 고리 마모 상태 정기 점검 및 즉시 교체",
    imageUrl: `${BASE_URL}acc_img/05_02.jpg`
  },
  {
    id: 12,
    title: "토잉 중 탑승교 접촉 사고",
    airport: "인천공항",
    date: "2025-03-01",
    cause: "안전거리 미확보 및 유도 소홀",
    content: "항공기 토잉 중 탑승교와 접촉하여 기체가 손상된 사고입니다. 토잉 중 탑승교 접촉은 정밀한 유도가 필요한 작업에서 발생합니다.",
    prevention: "토잉 작업 시 윙 팁 가이드(Wing-tip guide) 배치 및 안전거리 상시 유지",
    imageUrl: `${BASE_URL}acc_img/07_01.jpg`
  },
  {
    id: 14,
    title: "주행 중 버스와 윙 가드 접촉",
    airport: "제주공항",
    date: "2025-02-20",
    cause: "전방 주시 태만 및 운전 미숙",
    content: "주행 중인 버스가 주기장 내 윙 가드와 접촉한 사고입니다. 주행 중 버스와 윙 가드 접촉은 주기장 내 빈번한 부상 및 파손 사고입니다.",
    prevention: "주기장 내 제한 속도(25km/h 이하) 준수 및 시설물 주변 서행",
    imageUrl: `${BASE_URL}acc_img/08_01.jpg`
  },
  {
    id: 15,
    title: "셔틀버스 시설물 충돌 사고",
    airport: "제주공항",
    date: "2025-02-21",
    cause: "교차로 일단정지 미준수",
    content: "좁은 구역 주행 중 안전거리를 확보하지 못해 발생한 충돌 사고입니다. 서행 및 주변 확인이 필수적입니다.",
    prevention: "교차로 및 합류 지점 '일단 정지' 후 좌우 확인 수칙 준수",
    imageUrl: `${BASE_URL}acc_img/08_02.jpg`
  },
  {
    id: 16,
    title: "차량 간 추돌 사고 (전방 주시 태만)",
    airport: "인천공항",
    date: "2025-01-12",
    cause: "전방 주시 태만 및 안일함",
    content: "차량 간 추돌이나 주기장 내 시설물과의 충돌 사례입니다. 운전 중 휴대전화 사용 등 전방 주시 태만이 주요 원인입니다.",
    prevention: "운전 중 휴대전화 사용 금지 및 전방 상황 상시 주시",
    imageUrl: `${BASE_URL}acc_img/09_01.jpg`
  },
  {
    id: 17,
    title: "조업 차량 후미 추돌 사고",
    airport: "인천공항",
    date: "2025-01-13",
    cause: "안전거리 미확보",
    content: "정차 중인 차량을 미처 발견하지 못하고 추돌한 사고입니다. 주기장 내 제한 속도 준수와 전방 주시가 중요합니다.",
    prevention: "충분한 안전거리 확보 및 야간/악기상 시 등화 장치 활용 철저",
    imageUrl: `${BASE_URL}acc_img/09_02.jpg`
  },
  {
    id: 18,
    title: "강풍에 의한 장비 이동 및 충돌",
    airport: "제주공항",
    date: "2025-02-15",
    cause: "기상 악화 시 결박 누락",
    content: "강풍으로 인해 결박되지 않은 장비가 밀려 항공기와 충돌한 사고입니다. 기상 악화 시 장비 결박은 필수적인 안전 조치입니다.",
    prevention: "기상 특보 시 모든 이동 장비의 고임목 설치 및 결박 상태 전수 점검",
    imageUrl: `${BASE_URL}acc_img/10_01.jpg`
  },
  {
    id: 19,
    title: "악기상 대처 미흡 사고",
    airport: "제주공항",
    date: "2025-02-16",
    cause: "안전 수칙 미준수",
    content: "기상 특보 발효 중 안전 조치를 소홀히 하여 발생한 사고입니다. 기상 상황에 따른 단계별 대응 매뉴얼 준수가 필요합니다.",
    prevention: "기상 상황별 대응 매뉴얼 숙지 및 실시간 기상 정보 공유 체계 강화",
    imageUrl: `${BASE_URL}acc_img/10_02.jpg`
  },
  {
    id: 21,
    title: "장비 유압유 누출 사고",
    airport: "김포공항",
    date: "2025-02-14",
    cause: "장비 점검 소홀 및 노후",
    content: "조업 장비에서 유압유가 누출되어 주기장이 오염된 사례입니다. 작업 전 장비 상태 점검을 통해 누출 사고를 예방해야 합니다.",
    prevention: "작업 전 장비 하부 누유 여부 확인 및 노후 유압 호스 선제적 교체",
    imageUrl: `${BASE_URL}acc_img/12_01.jpg`
  },
  {
    id: 22,
    title: "유압 라인 파손 누출",
    airport: "김포공항",
    date: "2025-02-15",
    cause: "정비 주기 미준수",
    content: "노후 장비의 관리 부실로 인해 작업 중 유압유가 유출된 사고입니다. 정기적인 정비와 부품 교체가 필수적입니다.",
    prevention: "장비 정비 이력 관리 철저 및 이상 징후 발견 시 즉시 가동 중단",
    imageUrl: `${BASE_URL}acc_img/12_02.jpg`
  },
  {
    id: 23,
    title: "급유 작업 중 접지(Grounding) 누락",
    airport: "인천공항",
    date: "2025-03-10",
    cause: "안전 수칙 미숙지 및 안일함",
    content: "항공기 급유 작업 시 정전기 방지 접지(Grounding) 누락. 화재 및 폭발 위험을 초래하는 중대 위반 사항입니다.",
    prevention: "급유 작업 표준 절차(SOP) 준수 및 접지 상태 육안 확인 필수",
    imageUrl: `${BASE_URL}acc_img/13_01.jpg`
  },
  {
    id: 24,
    title: "급유 안전 절차 미준수",
    airport: "인천공항",
    date: "2025-03-11",
    cause: "작업 절차 무시",
    content: "급유 작업 시 필수적인 안전 절차를 생략하여 발생한 위험 사례입니다. 규정된 작업 순서 준수가 생명과 직결됩니다.",
    prevention: "작업 전 안전 체크리스트 작성 및 현장 감독자의 확인 절차 강화",
    imageUrl: `${BASE_URL}acc_img/13_02.jpg`
  },
  {
    id: 25,
    title: "컨베이어 벨트 장비 손상",
    airport: "인천공항",
    date: "2025-01-25",
    cause: "무리한 장비 가동",
    content: "수하물 조업 중 컨베이어 벨트 장비가 파손된 사례입니다. 장비의 한계 용량을 초과하거나 무리하게 가동할 경우 사고가 발생합니다.",
    prevention: "장비별 적정 하중 준수 및 무리한 가동 지양, 정기 점검 실시",
    imageUrl: `${BASE_URL}acc_img/14_01.jpg`
  },
  {
    id: 26,
    title: "낙하물에 의한 차량 유리 파손",
    airport: "김포공항",
    date: "2025-02-05",
    cause: "적재물 결박 불량",
    content: "선행 차량에서 떨어진 물체가 후행 차량의 유리를 타격한 사고입니다. 적재물은 반드시 견고하게 결박해야 합니다.",
    prevention: "적재물 상단 덮개 설치 및 결박 끈 상태 점검, 주기장 FOD 수거 철저",
    imageUrl: `${BASE_URL}acc_img/15_01.jpg`
  },
  {
    id: 27,
    title: "야간 조명 시설 충돌 파손",
    airport: "제주공항",
    date: "2025-03-15",
    cause: "야간 시야 확보 불량 및 부주의",
    content: "야간 조업 중 시야가 제한된 상태에서 조명 시설을 충돌한 사고입니다. 야간에는 더욱 철저한 서행과 주의가 필요합니다.",
    prevention: "야간 작업 시 차량 등화 장치 100% 가동 및 유도자 경광봉 활용",
    imageUrl: `${BASE_URL}acc_img/16_01.jpg`
  },
  {
    id: 28,
    title: "제설 작업 중 차량 간 접촉",
    airport: "인천공항",
    date: "2025-01-05",
    cause: "폭설 시 안전거리 미확보",
    content: "제설 작업 중 시야가 확보되지 않은 상태에서 차량 간 접촉한 사고입니다. 악기상 시에는 평소보다 넓은 안전거리 확보가 필수입니다.",
    prevention: "폭설 시 작업 차량 간 안전거리 2배 확보 및 저속 주행 유지",
    imageUrl: `${BASE_URL}acc_img/17_01.jpg`
  },
  {
    id: 29,
    title: "제설 장비 대열 주행 중 충돌",
    airport: "인천공항",
    date: "2025-01-06",
    cause: "의사소통 미흡 및 부주의",
    content: "제설 작업 차량들이 대열을 지어 이동하던 중 발생한 추돌 사고입니다. 작업 차량 간 긴밀한 무선 교신이 중요합니다.",
    prevention: "대열 주행 시 선두 차량의 상황 공유 및 후속 차량의 즉각 대응 체계",
    imageUrl: `${BASE_URL}acc_img/17_02.jpg`
  },
  {
    id: 30,
    title: "기내식 차량 높이 조절 실패 충돌",
    airport: "인천공항",
    date: "2025-02-28",
    cause: "높이 제한 무시 및 조작 미숙",
    content: "기내식 공급 차량이 항공기 도어에 접현 중 높이 조절에 실패하여 도어를 파손한 사고입니다. 육안 확인이 필수입니다.",
    prevention: "접현 시 센서 의존 지양 및 육안 확인을 통한 정밀 높이 조절",
    imageUrl: `${BASE_URL}acc_img/18_01.jpg`
  },
  {
    id: 31,
    title: "수하물 조업 중 벨트 끼임 사고",
    airport: "인천공항",
    date: "2025-03-05",
    cause: "안전 장구 미착용 및 부주의",
    content: "수하물 조업 중 컨베이어 벨트에 작업자의 옷이나 신체 일부가 끼이는 사고입니다. 벨트 가동 중에는 절대 손을 대지 말아야 합니다.",
    prevention: "벨트 가동 전 주변 작업자 확인 및 헐렁한 복장 착용 금지",
    imageUrl: `${BASE_URL}acc_img/19_01.jpg`
  },
  {
    id: 32,
    title: "지상 조업 중 작업자 전도 사고",
    airport: "김포공항",
    date: "2025-03-08",
    cause: "바닥 오염물 방치 및 부주의",
    content: "주기장 바닥의 기름기나 수분으로 인해 작업자가 미끄러져 넘어진 사고입니다. 바닥 상태를 항상 청결하게 유지해야 합니다.",
    prevention: "바닥 오염 시 즉시 제거 및 미끄럼 방지 안전화 착용 필수",
    imageUrl: `${BASE_URL}acc_img/20_01.jpg`
  },
  {
    id: 33,
    title: "기타 주기장 시설물 접촉 사고",
    airport: "제주공항",
    date: "2025-03-10",
    cause: "운전 미숙 및 주변 확인 소홀",
    content: "주기장 내 각종 표지판이나 소화전 등 기타 시설물과 접촉한 사고입니다. 좁은 공간 이동 시 유도자의 도움을 받아야 합니다.",
    prevention: "좁은 구역 주행 시 반드시 유도자 배치 및 서행 운전 준수",
    imageUrl: `${BASE_URL}acc_img/21_01.jpg`
  }
];

const AccidentGallery: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<GalleryItem | null>(null);

  // Random focus effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hoveredItem) {
        setFocusedIndex(Math.floor(Math.random() * galleryData.length));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [hoveredItem]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-6 p-4 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 flex-1 overflow-y-auto custom-scrollbar p-4">
          {galleryData.map((item, index) => (
            <motion.div
              key={item.id}
              onMouseEnter={() => {
                setHoveredItem(item);
                setFocusedIndex(null);
              }}
              onMouseLeave={() => setHoveredItem(null)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: focusedIndex === index ? 2.0 : 1,
                zIndex: focusedIndex === index ? 10 : 1,
                boxShadow: focusedIndex === index ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" : "none",
                borderColor: focusedIndex === index ? "#3b82f6" : "transparent"
              }}
              whileHover={{ scale: 1.5, zIndex: 50 }}
              className="relative aspect-auto rounded-2xl overflow-hidden cursor-pointer border-2 transition-all bg-neutral-100 group"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title}
                referrerPolicy="no-referrer"
                className={cn(
                  "w-full h-full object-contain transition-all duration-700",
                  focusedIndex === index ? "grayscale-0 scale-100" : "grayscale group-hover:grayscale-0 group-hover:scale-105"
                )}
              />
              {focusedIndex === index && (
                <div className="absolute inset-0 border-4 border-blue-500/50 rounded-2xl pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tooltip on hover - Display original image at full size */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-10 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              className="relative max-w-[95vw] max-h-[95vh] p-1 bg-white rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <img 
                src={hoveredItem.imageUrl} 
                alt={hoveredItem.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccidentGallery;
