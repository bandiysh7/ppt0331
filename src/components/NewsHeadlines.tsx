import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, AlertCircle, Clock, MapPin } from 'lucide-react';

interface HeadlineData {
  text: string;
  airport: string;
  date: string;
  cause: string;
  content: string;
  category: '속보' | '단독' | '현장' | '안전' | '사건' | '경보';
}

interface NewsHeadlinesProps {
  onHeadlineClick: (headline: HeadlineData) => void;
}

const NewsHeadlines: React.FC<NewsHeadlinesProps> = ({ onHeadlineClick }) => {
  const headlines: HeadlineData[] = [
    { 
      text: "인천공항 주기장 내 차량 간 추돌 사고 발생... 전방 주시 태만이 원인", 
      airport: "인천공항", 
      date: "2025-01-15 14:30", 
      cause: "전방 주시 태만", 
      content: "조업 차량이 이동 중 앞서 가던 차량을 추돌하여 범퍼 및 전면부 파손 발생. 특히 혼잡한 시간대 주기장 내 서행 규정 미준수가 주요 원인으로 파악됨.",
      category: '속보'
    },
    { 
      text: "급유차 후진 중 항공기 날개 접촉... 기체 손상으로 운항 지연 사태", 
      airport: "인천공항", 
      date: "2025-01-30 22:10", 
      cause: "유도자 미배치", 
      content: "유도자 없이 급유차가 후진하던 중 항공기 엔진 카울링과 접촉하여 파손 발생. 야간 작업 시 시야 확보가 제한적인 상황에서 단독 작업 강행이 원인.",
      category: '단독'
    },
    { 
      text: "로더 작업 중 낙상 사고로 인명 피해... 안전 수칙 준수 여부 조사 중", 
      airport: "김해공항", 
      date: "2025-03-12 08:50", 
      cause: "안전 수칙 미준수", 
      content: "작업자가 이동 중인 장비에서 뛰어내리다 발을 헛디뎌 골절상 입음. 장비 정지 전 하차 금지 규정을 무시한 조급한 작업 수행이 원인임.",
      category: '현장'
    },
    { 
      text: "탑승교 하단부 높이 제한 무시한 조업 차량 충돌... 시설물 파손 심각", 
      airport: "김해공항", 
      date: "2025-01-22 11:45", 
      cause: "높이 제한 인지 부족", 
      content: "탑승교 하단 통과 시 높이 제한을 확인하지 않아 차량 상단부와 탑승교 하단 충돌. 장비 교체 후 변경된 제원을 숙지하지 못한 상태에서 발생함.",
      category: '경보'
    },
    { 
      text: "달리 결박 해제로 인한 적재물 낙하... 주변 차량 파손 및 안전 우려", 
      airport: "제주공항", 
      date: "2025-02-18 10:05", 
      cause: "결박 상태 점검 소홀", 
      content: "이동 중 달리의 결박이 해제되어 적재물이 낙하하고 주변 차량에 손상 입힘. 출발 전 최종 점검 리스트 확인 절차 누락이 확인됨.",
      category: '안전'
    },
    { 
      text: "토잉카 조작 미숙으로 항공기 노즈 기어 부위 손상... 부품 교체 불가피", 
      airport: "김포공항", 
      date: "2025-02-25 13:40", 
      cause: "조작 미숙", 
      content: "토잉카 조작 실수로 항공기 노즈 기어 부위에 과도한 하중이 가해져 부품 손상. 숙련도 부족 및 긴급 상황 시 대처 매뉴얼 미숙지로 인한 사고.",
      category: '사건'
    },
    { 
      text: "셔틀버스 조업 구역 차선 이탈... 주차된 조업 장비 측면 접촉 사고", 
      airport: "인천공항", 
      date: "2025-03-01 12:00", 
      cause: "차선 미준수", 
      content: "셔틀버스가 조업 구역 차선을 이탈하여 주차된 조업 장비 측면을 긁음. 커브 구간에서 무리한 속도로 진입하며 회전 반경을 확보하지 못함.",
      category: '현장'
    },
    { 
      text: "야간 작업 중 피로 누적으로 인한 졸음 운전... 유도로 경계석 충돌", 
      airport: "제주공항", 
      date: "2025-02-20 15:40", 
      cause: "졸음 운전", 
      content: "야간 작업 후 피로 누적으로 인한 졸음 운전으로 유도로 경계석 충돌. 작업자 피로도 관리 미흡 및 무리한 연장 근무가 근본적인 원인으로 지목됨.",
      category: '속보'
    },
    { 
      text: "교차로 일단정지 무시한 조업 차량 충돌... 교통 법규 위반 사례 빈번", 
      airport: "인천공항", 
      date: "2025-01-12 16:50", 
      cause: "교통 법규 위반", 
      content: "교차로에서 일단정지 표지판을 무시하고 진입하다 교차 주행 차량과 충돌. 바쁜 조업 일정으로 인해 일시정지 규정을 상습적으로 무시한 결과임.",
      category: '경보'
    },
    { 
      text: "강풍으로 인한 수하물 카트 밀림... 주기된 항공기 엔진과 충돌 사고", 
      airport: "제주공항", 
      date: "2025-02-15 14:00", 
      cause: "강풍", 
      content: "강풍으로 인해 수하물 카트가 밀려나면서 주기된 항공기 엔진과 충돌 사고. 강풍 경보 발령 시 장비 결박 및 실내 이동 조치를 지연하여 발생한 사고.",
      category: '안전'
    },
    { 
      text: "항공기 토잉 중 유도원 사인 불일치... 날개 끝단 지상 장비 접촉", 
      airport: "인천공항", 
      date: "2025-03-05 16:20", 
      cause: "토잉 절차 미준수", 
      content: "항공기 토잉 중 유도원과의 사인 불일치로 인해 날개 끝단이 지상 장비와 접촉. 표준 무선 통신 절차를 생략하고 수신호에만 의존한 결과임.",
      category: '사건'
    },
    { 
      text: "신입 직원 장비 조작 미숙... 주기장 내 안전 펜스 충돌 사고", 
      airport: "김포공항", 
      date: "2025-02-14 11:10", 
      cause: "경험 부족", 
      content: "신입 직원의 장비 조작 미숙으로 주기장 내 안전 펜스 충돌. 충분한 현장 실습 없이 실전에 투입되어 장비의 특성을 파악하지 못한 상태였음.",
      category: '현장'
    },
    { 
      text: "급유 작업 중 정전기 방지 접지 미실시... 화재 위험 아찔한 순간", 
      airport: "인천공항", 
      date: "2025-03-10 09:30", 
      cause: "안전 절차 무시", 
      content: "급유 작업 중 필수 절차인 접지(Grounding)를 실시하지 않은 채 작업을 진행하다 적발됨. 사소한 부주의가 대형 화재로 이어질 수 있는 위험한 상황이었음.",
      category: '경보'
    },
    { 
      text: "조업 장비 정비 불량으로 인한 유압유 누출... 활주로 일시 폐쇄", 
      airport: "인천공항", 
      date: "2025-01-25 15:20", 
      cause: "정비 소홀", 
      content: "이동 중인 조업 장비에서 유압유가 대량 누출되어 유도로 및 활주로 일부가 오염됨. 긴급 방제 작업으로 인해 항공기 이착륙이 일시적으로 지연됨.",
      category: '사건'
    },
    { 
      text: "수하물 조업 중 컨베이어 벨트 끼임 사고... 작업자 부상 발생", 
      airport: "김포공항", 
      date: "2025-02-05 17:45", 
      cause: "부주의", 
      content: "수하물 분류 작업 중 컨베이어 벨트 구동부에 작업자의 장갑이 끼이면서 손가락 부상 발생. 비상 정지 버튼 위치 미숙지 및 안전 가드 미설치가 원인.",
      category: '현장'
    },
    { 
      text: "항공기 견인 중 통신 장비 결함... 관제탑 지시 오인으로 충돌 위기", 
      airport: "제주공항", 
      date: "2025-03-15 20:10", 
      cause: "통신 불량", 
      content: "항공기 견인 중 무전기 결함으로 관제탑의 정지 지시를 듣지 못하고 진행하다 타 항공기와 근접 조우. 장비 사전 점검 미흡이 대형 사고로 이어질 뻔함.",
      category: '단독'
    },
    { 
      text: "폭설 대비 제설 작업 중 차량 간 접촉... 시야 확보 불량 원인", 
      airport: "인천공항", 
      date: "2025-01-05 04:30", 
      cause: "기상 악화", 
      content: "폭설 상황에서 제설 작업을 수행하던 차량끼리 시야 확보 불량으로 접촉 사고 발생. 악천후 시 안전 거리 확보 및 서행 규정 준수가 절실함.",
      category: '속보'
    },
    { 
      text: "기내식 공급 차량 상단부 항공기 도어 접촉... 도어 씰 파손", 
      airport: "인천공항", 
      date: "2025-02-28 12:50", 
      cause: "접현 미숙", 
      content: "기내식 공급 차량이 항공기 도어에 접현하던 중 높이 조절 실패로 도어 하단부와 접촉. 센서 오작동 및 작업자의 육안 확인 소홀이 복합적으로 작용함.",
      category: '사건'
    },
    { 
      text: "조업 구역 내 과속 주행 차량 단속 강화... 사고 예방 캠페인 실시", 
      airport: "인천공항", 
      date: "2025-03-18 10:00", 
      cause: "과속 주행", 
      content: "주기장 내 제한 속도를 초과하여 주행하는 차량들에 대한 집중 단속 실시. 과속은 제동 거리 증가로 이어져 대형 추돌 사고의 주범이 됨.",
      category: '안전'
    },
    { 
      text: "항공기 유도 중 수신호 오인... 윙팁 가드와 지상 시설물 접촉", 
      airport: "김포공항", 
      date: "2025-01-18 13:25", 
      cause: "의사소통 오류", 
      content: "항공기 입고 유도 중 유도원과 조종사 간의 수신호 오인으로 윙팁 가드가 시설물과 접촉. 표준화된 수신호 사용 및 확인 절차의 중요성 재확인.",
      category: '사건'
    },
    { 
      text: "화물 적재 작업 중 지게차 전복 사고... 작업자 긴급 후송", 
      airport: "인천공항", 
      date: "2025-02-12 09:15", 
      cause: "과적 및 급회전", 
      content: "화물 터미널에서 지게차가 과적 상태로 급회전하다 전복되는 사고 발생. 장비별 최대 적재 하중 준수 및 안전 운행 수칙 무시가 원인.",
      category: '현장'
    },
    { 
      text: "주기장 내 무단 보행자 조업 차량과 충돌 위기... 안전 구역 준수 강조", 
      airport: "제주공항", 
      date: "2025-03-08 15:50", 
      cause: "보행자 부주의", 
      content: "지정된 보행로를 벗어나 무단 횡단하던 작업자가 이동 중인 조업 차량과 충돌할 뻔한 아찔한 상황 발생. 주기장 내 보행 안전 수칙 철저 준수 당부.",
      category: '경보'
    },
    { 
      text: "급유 호스 커플링 체결 불량으로 인한 유류 소량 누출... 즉각 조치 완료", 
      airport: "인천공항", 
      date: "2025-01-10 10:20", 
      cause: "작업 부주의", 
      content: "급유 작업 중 호스 연결 부위 체결 불량으로 항공유 소량이 주기장 바닥에 누출됨. 흡착포 등을 이용한 신속한 방제 작업으로 추가 오염 방지.",
      category: '안전'
    },
    { 
      text: "토잉카 견인봉(Tow-bar) 파손 사고... 노후 장비 점검 주기 단축 결정", 
      airport: "김포공항", 
      date: "2025-02-22 14:15", 
      cause: "장비 노후", 
      content: "항공기 견인 중 견인봉의 연결 부위가 파손되어 작업이 중단됨. 장비 노후화가 원인으로 밝혀졌으며, 전 조업 장비에 대한 특별 전수 점검 실시 예정.",
      category: '사건'
    },
    { 
      text: "조업 구역 내 개인 보호구(PPE) 미착용 적발 건수 증가... 안전 의식 해이 우려", 
      airport: "인천공항", 
      date: "2025-03-05 08:00", 
      cause: "안전 의식 부족", 
      content: "현장 점검 결과 고반사 조끼 및 안전화 미착용 사례가 다수 적발됨. 기본 안전 수칙 준수가 대형 사고 예방의 시작임을 강조하며 교육 강화.",
      category: '경보'
    },
    { 
      text: "수하물 카트 연결 고리 이탈로 인한 장비 분리 사고... 유도로 상 위험 요소 제거", 
      airport: "제주공항", 
      date: "2025-01-15 11:30", 
      cause: "결박 불량", 
      content: "주행 중이던 수하물 카트 열차에서 마지막 카트가 연결 고리 이탈로 분리되어 유도로에 방치됨. 뒤따르던 차량이 발견하여 즉시 제거, 사고 예방.",
      category: '현장'
    },
    { 
      text: "야간 조업 중 조명 타워 결함으로 인한 시야 확보 불량... 작업 일시 중단", 
      airport: "인천공항", 
      date: "2025-03-12 21:00", 
      cause: "시설 결함", 
      content: "야간 조업 중 일부 조명 타워가 소등되어 작업 구역 시야 확보가 불가능해짐. 안전 사고 예방을 위해 즉시 작업을 중단하고 긴급 복구 작업 실시.",
      category: '안전'
    },
    { 
      text: "조업 차량 타이어 마모 상태 불량 적발... 현장 즉시 교체 지시", 
      airport: "김포공항", 
      date: "2025-02-10 14:30", 
      cause: "정비 미흡", 
      content: "정기 점검 중 타이어 마모 한계선을 초과한 조업 차량 다수 적발. 빗길 미끄러짐 사고 위험이 높아 즉시 운행 중단 및 타이어 교체 조치.",
      category: '경보'
    },
    { 
      text: "항공기 엔진 시동 중 주변 이물질(FOD) 흡입 사고... 엔진 블레이드 손상", 
      airport: "인천공항", 
      date: "2025-01-20 16:40", 
      cause: "FOD 관리 소홀", 
      content: "엔진 시동 중 주기장에 방치된 이물질이 엔진으로 흡입되어 블레이드 손상 발생. 조업 전 주변 청소 및 FOD 확인 절차 미준수가 원인.",
      category: '사건'
    },
    { 
      text: "탑승교 조작 중 오작동으로 인한 항공기 동체 근접 조우... 비상 정지 작동", 
      airport: "인천공항", 
      date: "2025-03-02 10:15", 
      cause: "기기 오작동", 
      content: "탑승교 접현 중 센서 오작동으로 항공기 동체와 충돌할 뻔한 상황 발생. 비상 정지 버튼이 즉각 작동하여 사고는 면했으나 정밀 점검 필요.",
      category: '속보'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '속보': return 'bg-red-600 text-white';
      case '단독': return 'bg-blue-700 text-white';
      case '현장': return 'bg-emerald-600 text-white';
      case '안전': return 'bg-amber-500 text-white';
      case '사건': return 'bg-neutral-800 text-white';
      case '경보': return 'bg-orange-600 text-white';
      default: return 'bg-neutral-500 text-white';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-12">
          {headlines.map((item, index) => {
            // Make some items featured
            const isFeatured = index === 0 || index === 5 || index === 10 || index === 15;
            const isWide = index === 2 || index === 8 || index === 14 || index === 20;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.01, y: -2 }}
                onClick={() => onHeadlineClick(item)}
                className={cn(
                  "group cursor-pointer bg-white border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col",
                  isFeatured ? "lg:col-span-2 lg:row-span-2" : "",
                  isWide ? "md:col-span-2" : ""
                )}
              >
                <div className={cn(
                  "p-5 flex-1 flex flex-col",
                  isFeatured ? "bg-neutral-50" : ""
                )}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-1.5 py-0.5 text-[11px] font-black rounded uppercase tracking-tighter ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <div className="h-px flex-1 bg-neutral-100" />
                    <span className="text-[11px] font-bold text-neutral-400 font-mono italic">{item.date.split(' ')[0]}</span>
                  </div>
                  
                  <h3 className={cn(
                    "font-black text-neutral-900 leading-[1.15] mb-3 group-hover:text-blue-600 transition-colors",
                    isFeatured ? "text-5xl" : "text-2xl",
                    !isFeatured && !isWide ? "line-clamp-4" : "line-clamp-3"
                  )}>
                    {item.text}
                  </h3>

                  {isFeatured && (
                    <p className="text-lg text-neutral-500 line-clamp-3 mb-4 leading-relaxed">
                      {item.content}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-neutral-400">
                        <MapPin size={10} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{item.airport}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <AlertCircle size={10} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{item.cause}</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-1 w-0 bg-neutral-900 group-hover:w-full transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* News Ticker */}
      <div className="mt-4 bg-neutral-900 text-white py-3 px-6 flex items-center gap-6 overflow-hidden whitespace-nowrap border-t-4 border-blue-600">
        <div className="flex items-center gap-2 text-blue-400 font-black italic text-sm shrink-0">
          <Clock size={16} />
          <span>LATEST UPDATES</span>
        </div>
        <div className="flex gap-12 animate-marquee group-hover:[animation-play-state:paused]">
          {headlines.map((h, i) => (
            <span key={i} className="text-sm font-bold tracking-tight">
              <span className="text-blue-400 mr-2">[{h.airport}]</span>
              {h.text}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {headlines.map((h, i) => (
            <span key={`dup-${i}`} className="text-sm font-bold tracking-tight">
              <span className="text-blue-400 mr-2">[{h.airport}]</span>
              {h.text}
            </span>
          ))}
        </div>
      </div>
      
      {/* Newspaper texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 200s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Helper for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default NewsHeadlines;
