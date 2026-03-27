/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Maximize, 
  Minimize, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Plane,
  Truck,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Activity,
  Target,
  ArrowLeftRight,
  Move,
  Pause,
  User,
  AlertCircle,
  Phone,
  Building2,
  Users,
  ArrowDown,
  UserX,
  EyeOff,
  Clock,
  Wind,
  X,
  Search,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ComposedChart,
  BarChart, 
  Bar, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import NewsHeadlines from './components/NewsHeadlines';
import AccidentGallery from './components/AccidentGallery';
import { generatePrintWindow, downloadStandaloneHTML } from './utils/exportUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE_URL = import.meta.env.BASE_URL;

// --- Data ---
const occurrenceData = [
  { year: '2020', accidents: 14, converted: 0.27, flights: 518518 },
  { year: '2021', accidents: 17, converted: 0.30, flights: 566666 },
  { year: '2022', accidents: 22, converted: 0.375, flights: 586666 },
  { year: '2023', accidents: 29, converted: 0.455, flights: 637362 },
  { year: '2024', accidents: 36, converted: 0.403, flights: 893300 },
  { year: "2025", accidents: 21, converted: 0.230, flights: 912744 },
];

const typeData = [
  { name: '차량 충돌', value: 40, color: '#f59e0b' }, // Amber
  { name: '항공기 접촉', value: 35, color: '#2563eb' }, // Blue
  { name: '인적 상해', value: 25, color: '#dc2626' }, // Red
];

const majorCases2025 = [
  {
    title: "탑승교(PBB) 하단 충돌",
    cause: "높이 제한 인지 부족 및 전방 주시 태만",
    prevention: "높이 제한 표식 강화 및 서행 의무화"
  },
  {
    title: "급유차 후진 중 날개 접촉",
    cause: "유도자 미배치 및 사각지대 확인 소홀",
    prevention: "후진 시 반드시 2인 1조 유도 절차 준수"
  },
  {
    title: "로더 작업 중 작업자 낙상",
    cause: "안전 고리 미체결 및 작업대 과적",
    prevention: "추락 방지 장구 착용 상태 상시 점검"
  }
];

// --- Components ---

const PenaltyTable = ({ data }: { data: any[] }) => {
  const formatText = (text: string) => {
    if (!text || text === '-') return text;
    // "0일" 패턴 찾기 (10일, 20일, 40일 등)
    const match = text.match(/(\d+일)/g);
    if (match) {
      let result = text;
      match.forEach(dayText => {
        result = result.replace(
          dayText,
          `<span class="text-[14px] text-blue-600 font-bold">${dayText}</span>`
        );
      });
      return <span dangerouslySetInnerHTML={{ __html: result }} />;
    }
    return text;
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 h-full flex flex-col">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr className="bg-neutral-900 text-white text-base uppercase tracking-wider">
            <th className="py-4 px-4 text-center border-r border-white/10 w-[8%]">구분</th>
            <th className="py-4 px-8 text-center border-r border-white/10 w-[52%]">위반사항</th>
            <th className="py-4 px-2 text-center border-r border-white/10 w-[13.3%]">1차</th>
            <th className="py-4 px-2 text-center border-r border-white/10 w-[13.3%]">2차</th>
            <th className="py-4 px-2 text-center w-[13.3%]">3차</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <td className="py-2 px-4 font-mono text-sm text-neutral-400 border-r border-neutral-100 text-center align-middle">{row.id}</td>
              <td className="py-2 px-10 font-bold border-r border-neutral-100 leading-[1.1] text-[28px] align-middle text-neutral-900">
                <div className="line-clamp-2 break-keep">{row.title}</div>
              </td>
              <td className="py-2 px-2 text-center border-r border-neutral-100 text-neutral-600 text-xs align-middle font-bold whitespace-pre-line">{formatText(row.c1 || row.first)}</td>
              <td className="py-2 px-2 text-center border-r border-neutral-100 text-neutral-600 text-xs align-middle font-bold whitespace-pre-line">{formatText(row.c2 || row.second)}</td>
              <td className="py-2 px-2 text-center text-neutral-600 text-xs align-middle font-bold whitespace-pre-line">{formatText(row.c3 || row.third)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SectionHeader = ({ label, title, description }: { label: string, title: string, description?: string }) => (
  <div className="absolute top-12 left-12 right-12 z-10">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-block px-3 py-1 bg-black text-white text-[18px] font-mono uppercase tracking-widest mb-2"
    >
      {label}
    </motion.span>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-4"
    >
      {title}
    </motion.h1>
    {description && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-neutral-500 max-w-3xl leading-tight"
      >
        {description}
      </motion.p>
    )}
  </div>
);

const WebSlide = ({ children, className, overflowHidden = true }: { children: React.ReactNode, className?: string, overflowHidden?: boolean }) => (
  <div className={cn("web-slide h-full w-full flex flex-col p-8 md:p-12 bg-white text-black font-sans selection:bg-black selection:text-white relative", className)}>
    <div className={cn("flex-1 flex flex-col pt-32", overflowHidden && "overflow-hidden")}>
      {children}
    </div>
    <div className="mt-6 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest border-t border-black/10 pt-4">
      <div className="flex gap-8">
        <span>MOLIT Safety Portal</span>
        <span className="opacity-30">Ground Safety Education</span>
      </div>
      <div className="flex gap-4">
        <span>2026 Edition</span>
      </div>
    </div>
  </div>
);

const penaltyData1 = [
  { id: "가", title: "사전 승인 없이 차량 운전/장비 사용", c1: "업무정지 10일", c2: "업무정지 20일", c3: "업무정지 40일" },
  { id: "가-2", title: "거짓·부정한 방법으로 사전 승인", c1: "운전업무승인 취소", c2: "-", c3: "-" },
  { id: "나", title: "승차정원·화물적재량 초과", first: "업무정지 1일", second: "업무정지 2일", third: "업무정지 4일" },
  { id: "다-1", title: "제한속도 10km/h 미만 초과", c1: "운전업무정지 1일", c2: "운전업무정지 2일", c3: "운전업무정지 4일" },
  { id: "다-2", title: "제한속도 10km/h 이상 초과", c1: "운전업무정지 2일", c2: "운전업무정지 4일", c3: "운전업무정지 8일" },
  { id: "라", title: "주행 중 차량 추월", c1: "운전업무정지 2일", c2: "운전업무정지 4일", c3: "운전업무정지 8일" },
  { id: "마", title: "이동 중 항공기 앞 가로지르기/주기 항공기 밑 운행", c1: "업무정지 5일", c2: "업무정지 7일", c3: "업무정지 15일" },
  { id: "바", title: "지정 구역 외 주차·정차", c1: "운전업무정지 1일", c2: "운전업무정지 2일", c3: "운전업무정지 4일" },
  { id: "사", title: "운행 중 전방 주시 불이행", c1: "운전업무정지 2일", c2: "운전업무정지 4일", c3: "운전업무정지 8일" },
  { id: "아", title: "운행 중 휴대폰 사용", c1: "운전업무정지 2일", c2: "운전업무정지 4일", c3: "운전업무정지 8일" },
];

const penaltyData2 = [
  { id: "자", title: "교통안전 시설·표지 훼손", c1: "업무정지 1일", c2: "업무정지 3일", c3: "업무정지 7일" },
  { id: "차-1", title: "활주로·유도로 등에 장비·이물질 방치", c1: "업무정지 3일", c2: "업무정지 5일", c3: "업무정지 10일" },
  { id: "차-2", title: "지정 구역 외 위험물 보관·저장", first: "업무정지 1일", second: "업무정지 3일", third: "업무정지 5일" },
  { id: "카", title: "사고 발생 시 즉시 신고 불이행", c1: "업무정지 5일", c2: "업무정지 10일", c3: "업무정지 20일" },
  { id: "타-1", title: "흡연·음주·환각제 (운전 외 업무)", c1: "업무정지 3일", c2: "업무정지 5일", c3: "업무정지 10일" },
  { id: "타-2", title: "흡연·음주·환각제 (운전 업무)", c1: "운전업무승인 취소", c2: "-", c3: "-" },
  { id: "파", title: "연료 유출 시 미신고·조치 불이행", c1: "업무정지 3일", c2: "업무정지 5일", c3: "업무정지 10일" },
  { id: "하", title: "차량·장비 견인 규정 미준수", c1: "운전업무정지 1일", c2: "운전업무정지 2일", c3: "운전업무정지 4일" },
  { id: "거", title: "통행방법 미준수", c1: "운전업무정지 1일", c2: "운전업무정지 2일", c3: "운전업무정지 4일" },
];

const airportData = [
  { name: "인천", y20: 9, y21: 7, y22: 7, y23: 12, y24: 12, y25: 12, total: 59 },
  { name: "김포", y20: 3, y21: 4, y22: 12, y23: 8, y24: 4, y25: 3, total: 34 },
  { name: "김해", y20: 1, y21: 1, y22: 1, y23: 2, y24: 10, y25: 2, total: 17 },
  { name: "제주", y20: 0, y21: 3, y22: 1, y23: 4, y24: 5, y25: 1, total: 14 },
  { name: "청주", y20: 0, y21: 1, y22: 0, y23: 2, y24: 1, y25: 2, total: 6 },
  { name: "대구", y20: 0, y21: 0, y22: 0, y23: 1, y24: 3, y25: 0, total: 4 },
  { name: "광주", y20: 1, y21: 1, y22: 0, y23: 0, y24: 1, y25: 0, total: 3 },
  { name: "양양", y20: 0, y21: 0, y22: 1, y23: 0, y24: 0, y25: 0, total: 1 },
  { name: "울산", y20: 0, y21: 0, y22: 0, y23: 0, y24: 0, y25: 1, total: 1 },
];

const annualTotals = {
  y20: 14, y21: 17, y22: 22, y23: 29, y24: 36, y25: 21, total: 139
};

const totalGoalData = [
  { category: "항공기간 접촉", goal: "0", performance: "0", count: "0" },
  { category: "항공기-장비·차량과 접촉", goal: "0.004", performance: "0", count: "0" },
  { category: "항공기-장비·차량과 접촉", goal: "0.036", performance: "0", count: "0" },
  { category: "차량·차량·장비·시설간 접촉", goal: "0.248", performance: "0.175", percent: "70.6%", count: "16" },
  { category: "조업자 상해", goal: "0.064", performance: "0.055", percent: "85.9%", count: "5" },
];

const kacGoalData = [
  { category: "항공기간 접촉", goal: "0", performance: "0", count: "0" },
  { category: "항공기-장비·차량과 접촉", goal: "0", performance: "0", count: "0" },
  { category: "항공기-장비·차량과 접촉", goal: "0", performance: "0", count: "0" },
  { category: "차량·차량·장비·시설간 접촉", goal: "0.291", performance: "0.164", percent: "56.4%", count: "8" },
  { category: "조업자 상해", goal: "0.027", performance: "0.021", percent: "77.8%", count: "1" },
];

const iiacGoalData = [
  { category: "항공기간 접촉", goal: "0", performance: "0", count: "0" },
  { category: "항공기-장비·차량과 접촉", goal: "0.008", performance: "0", count: "0" },
  { category: "항공기-장비·차량과 접촉", goal: "0.068", performance: "0", count: "0" },
  { category: "차량·차량·장비·시설간 접촉", goal: "0.179", performance: "0.188", percent: "105.0%", count: "8", warning: true },
  { category: "조업자 상해", goal: "0.139", performance: "0.094", percent: "67.6%", count: "4" },
];

const GoalTable = ({ title, flights, data, total, isSmall = false }: { title: string, flights: string, data: any[], total: any, isSmall?: boolean }) => (
  <div className={cn("bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-xl flex flex-col", isSmall ? "p-6" : "p-8")}>
    <div className="flex items-center justify-between mb-6">
      <h3 className={cn("font-bold flex items-center gap-3", isSmall ? "text-xl" : "text-3xl")}>
        <div className={cn("bg-blue-600 rounded-full", isSmall ? "w-1.5 h-6" : "w-2 h-8")} />
        {title}
      </h3>
      <span className={cn("font-mono text-neutral-400 font-bold", isSmall ? "text-xs" : "text-lg")}>운항횟수: {flights}</span>
    </div>
    <table className={cn("w-full border-collapse", isSmall ? "text-lg" : "text-xl")}>
      <thead>
        <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-100">
          <th className={cn("text-left", isSmall ? "py-3 px-3" : "py-5 px-5")}>세부지표</th>
          <th className={cn("text-center text-orange-600", isSmall ? "py-3 px-3" : "py-5 px-5")}>안전목표</th>
          <th className={cn("text-center text-orange-600", isSmall ? "py-3 px-3" : "py-5 px-5")}>실적</th>
          <th className={cn("text-center text-orange-600", isSmall ? "py-3 px-3" : "py-5 px-5")}>사고건수</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-50">
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
            <td className={cn("font-bold text-neutral-800", isSmall ? "py-3 px-3" : "py-5 px-5")}>{row.category}</td>
            <td className={cn("text-center text-neutral-400 font-mono", isSmall ? "py-3 px-3" : "py-5 px-5")}>{row.goal}</td>
            <td className={cn("text-center font-black", isSmall ? "py-3 px-3" : "py-5 px-5", row.warning ? "bg-red-50 text-red-600" : "text-neutral-700")}>
              {row.performance} {row.percent && <span className="text-[0.8em] font-normal opacity-60 ml-1">({row.percent})</span>}
            </td>
            <td className={cn("text-center font-black text-neutral-900", isSmall ? "py-3 px-3" : "py-5 px-5")}>{row.count}</td>
          </tr>
        ))}
        <tr className="bg-neutral-900 text-white font-bold">
          <td className={cn(isSmall ? "py-4 px-3" : "py-6 px-5")}>{total.label}</td>
          <td className={cn("text-center opacity-30", isSmall ? "py-4 px-3" : "py-6 px-5")}>-</td>
          <td className={cn("text-center text-blue-400 font-black", isSmall ? "py-4 px-3 text-2xl" : "py-6 px-5 text-3xl")}>{total.performance}</td>
          <td className={cn("text-center font-black", isSmall ? "py-4 px-3 text-2xl" : "py-6 px-5 text-3xl")}>{total.count}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const AirportTable = () => (
  <div className="w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-100 h-full flex flex-col">
    <table className="w-full border-collapse text-xl flex-1">
      <thead>
        <tr className="bg-neutral-900 text-white">
          <th className="py-6 px-4 text-center border-r border-white/10">구분</th>
          <th className="py-6 px-2 text-center border-r border-white/10">20년</th>
          <th className="py-6 px-2 text-center border-r border-white/10">21년</th>
          <th className="py-6 px-2 text-center border-r border-white/10">22년</th>
          <th className="py-6 px-2 text-center border-r border-white/10">23년</th>
          <th className="py-6 px-2 text-center border-r border-white/10">24년</th>
          <th className="py-6 px-2 text-center border-r border-white/10">'25년</th>
          <th className="py-6 px-4 text-center bg-blue-600">합계</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {airportData.map((row, i) => (
          <tr key={i} className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-4 text-center font-bold border-r border-neutral-100">{row.name}</td>
            <td className="py-4 px-2 text-center border-r border-neutral-100">{row.y20 || "-"}</td>
            <td className="py-4 px-2 text-center border-r border-neutral-100">{row.y21 || "-"}</td>
            <td className="py-4 px-2 text-center border-r border-neutral-100">{row.y22 || "-"}</td>
            <td className="py-4 px-2 text-center border-r border-neutral-100">{row.y23 || "-"}</td>
            <td className="py-4 px-2 text-center border-r border-neutral-100">{row.y24 || "-"}</td>
            <td className="py-4 px-2 text-center border-r border-neutral-100">{row.y25 || "-"}</td>
            <td className="py-4 px-4 text-center font-bold text-blue-600 bg-blue-50/30">{row.total}</td>
          </tr>
        ))}
        <tr className="bg-neutral-100 font-bold text-2xl">
          <td className="py-6 px-4 text-center border-r border-white">합계</td>
          <td className="py-6 px-2 text-center border-r border-white">{annualTotals.y20}</td>
          <td className="py-6 px-2 text-center border-r border-white">{annualTotals.y21}</td>
          <td className="py-6 px-2 text-center border-r border-white">{annualTotals.y22}</td>
          <td className="py-6 px-2 text-center border-r border-white">{annualTotals.y23}</td>
          <td className="py-6 px-2 text-center border-r border-white">{annualTotals.y24}</td>
          <td className="py-6 px-2 text-center border-r border-white">{annualTotals.y25}</td>
          <td className="py-6 px-4 text-center text-white bg-blue-700">{annualTotals.total}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ text: string, content: string, airport?: string, date?: string, cause?: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = [
    // Slide 1: Hero / Title
    <WebSlide>
      <div className="h-full flex flex-col justify-center">
        <div className="mb-4">
          <span className="text-sm font-mono uppercase tracking-widest opacity-40">Introduction</span>
        </div>
        <h1 className="text-8xl font-black tracking-tighter leading-none mb-12">
          지상조업 <span className="text-blue-600">안전사고예방</span> 간담회
        </h1>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-12 mt-12"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase opacity-40 mb-2">Department</span>
            <span className="text-xl font-medium">국토교통부 공항운영과</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase opacity-40 mb-2">DATE</span>
            <span className="text-xl font-medium">2026.3.31.(화)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase opacity-40 mb-2">PLACE</span>
            <span className="text-xl font-medium">한국공항공사 6층 컨퍼런스룸</span>
          </div>
        </motion.div>
      </div>
    </WebSlide>,

    // Slide 2: 목차
    <WebSlide>
      <div className="h-full flex flex-col justify-center">
        <SectionHeader 
          label="Contents" 
          title="목차" 
        />
        <div className="mt-12 grid grid-cols-2 gap-x-20 gap-y-6 max-w-7xl mx-auto">
          {[
            { num: "01", title: "간담회 개요" },
            { num: "02", title: "추진체계" },
            { num: "03", title: "지상안전사고란?" },
            { num: "04", title: "지상안전사고 유형" },
            { num: "05", title: "지상안전 사고 신고" },
            { num: "06", title: "지상안전 사고 행정처분 기준" },
            { num: "07", title: "지상안전 사고 발생 현황" },
            { num: "08", title: "공항별 사고 발생 현황" },
            { num: "09", title: "'25년 지상안전사고 예방 목표 달성 현황" },
            { num: "10", title: "지상안전 사고 원인" },
            { num: "11", title: "25년 주요 사고 사례 및 갤러리" },
            { num: "12", title: "'공항 지상안전사고 예방' 웹사이트 소개" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-neutral-100 hover:border-blue-600 hover:shadow-lg transition-all group min-w-0"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 transition-transform shrink-0">
                {item.num}
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </WebSlide>,

    // Slide 1-1: 첨부1 - 교육 및 간담회 개최 계획
    <WebSlide>
      <div className="h-full flex flex-col justify-center">
        <SectionHeader 
          label="Attachment 1" 
          title="지상조업 안전사고 예방 간담회 개요" 
        />
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 shadow-sm">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                배경
              </h3>
              <p className="text-2xl text-neutral-700 leading-relaxed">
                지상조업 안전강화를 위해 종사자와 <span className="font-bold text-blue-700">소통형 교육</span>을 강화하고 작업환경, 처우개선 등 동기부여를 통한 <span className="font-bold text-blue-700">자발적 안전문화 확산</span> 필요
              </p>
            </div>
            <div className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-200 shadow-sm">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                주요내용
              </h3>
              <p className="text-2xl text-neutral-700 leading-relaxed">
                공항내 지상조업 안전사고 예방 교육, 장비·시설 개선 등 안전을 위한 <span className="font-bold">작업 환경 및 근로자 처우 개선 과제 발굴</span> 등
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-4 flex items-center gap-4">
              <Clock className="text-blue-600" size={32} />
              세부일정
            </h3>
            <div className="overflow-hidden rounded-[2rem] border border-neutral-200 shadow-md bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white">
                    <th className="p-3 px-6 text-[20px] font-bold">구분</th>
                    <th className="p-3 px-6 text-[20px] font-bold">내용</th>
                    <th className="p-3 px-6 text-[20px] font-bold">비고</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    { time: "14:00 ~ 14:05 (5')", content: "인사 말씀", note: "공항운영과" },
                    { time: "14:05 ~ 14:15 (10')", content: "'25년 지상조업 사고현황 및 사례 교육", note: "" },
                    { time: "14:15 ~ 14:35 (20')", content: "양 공항공사 사고현황 및 사고예방 계획", note: "" },
                    { time: "14:35 ~ 14:55 (20')", content: "지상조업 사고 예방 제안사항 검토", note: "" },
                    { time: "14:55 ~ 15:15 (20')", content: "종사자 근로환경 개선 제안사항 검토", note: "" },
                    { time: "15:15 ~ 15:30 (15')", content: "마무리 말씀", note: "공항정책관" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3 px-6 font-mono text-[16px] text-neutral-500">{row.time}</td>
                      <td className="p-3 px-6 text-[24px] font-semibold text-neutral-900">{row.content}</td>
                      <td className="p-3 px-6 text-[16px] text-neutral-500 font-medium">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 1-2: 첨부2 - 추진체계
    <WebSlide>
      <div className="h-full flex flex-col justify-center">
        <SectionHeader 
          label="Attachment 2" 
          title="지상안전사고 예방 추진체계" 
        />
        <div className="mt-6 flex flex-col gap-12">
        <div className="flex gap-6 p-6 bg-white border border-neutral-200 rounded-[2.5rem] shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-100">
            <Building2 size={48} />
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <h3 className="text-3xl font-black text-blue-600">국토교통부</h3>
            <ul className="space-y-2 text-[26px] text-neutral-700 font-medium leading-relaxed">
              <li className="flex items-start gap-4">
                <ChevronRight className="mt-1.5 shrink-0 text-blue-500" size={24} />
                간담회 개최, 지상조업사고 통계·교육자료 작성
              </li>
              <li className="flex items-start gap-4">
                <ChevronRight className="mt-1.5 shrink-0 text-blue-500" size={24} />
                지상조업 사고 예방, 근로환경 개선 아이디어 발굴 및 이행여부 점검
              </li>
            </ul>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-lg text-amber-900 font-semibold italic">
              * 개선 아이디어는 웹설문 조사 실시(설문 생성 후 URL을 생성하여 공항공사 전달 → 공항공사에서 항공사·지상조업사 및 근로자에게 SMS로 전파(참여자 20명 커피쿠폰 제공 예정)
            </div>
          </div>
        </div>

        <div className="flex gap-6 p-6 bg-white border border-neutral-200 rounded-[2.5rem] shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="w-24 h-24 bg-neutral-800 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-neutral-100">
            <Users size={48} />
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <h3 className="text-3xl font-black text-neutral-800">공항 공사</h3>
            <ul className="space-y-2 text-[26px] text-neutral-700 font-medium leading-relaxed">
              <li className="flex items-start gap-4">
                <ChevronRight className="mt-1.5 shrink-0 text-neutral-500" size={24} />
                항공사, 지상조업사 간담회 참석 및 개선 아이디어 제출 협조 요청
              </li>
              <li className="flex items-start gap-4">
                <ChevronRight className="mt-1.5 shrink-0 text-neutral-500" size={24} />
                공항공사별 사고현황 및 사고예방 계획 발표
              </li>
              <li className="flex items-start gap-4">
                <ChevronRight className="mt-1.5 shrink-0 text-neutral-500" size={24} />
                사고예방 및 근로환경 개선 아이디어 검토
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-6 p-6 bg-white border border-neutral-200 rounded-[2.5rem] shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-100">
            <Truck size={48} />
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <h3 className="text-3xl font-black text-emerald-600">지상조업사</h3>
            <ul className="space-y-2 text-[26px] text-neutral-700 font-medium leading-relaxed">
              <li className="flex items-start gap-4">
                <ChevronRight className="mt-1.5 shrink-0 text-emerald-500" size={24} />
                지상조업 근로자 교육, 안전 장비 확충, 근로환경 및 처우 개선 등
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </WebSlide>,

    // Slide 2: 지상안전사고란?
    <WebSlide>
      <div className="h-full flex flex-col justify-center">
        <SectionHeader 
          label="01. Definition" 
          title="지상안전사고란?" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="space-y-8">
            <div className="p-8 bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl">
              <h3 className="text-2xl font-bold mb-4">정의</h3>
              <p className="text-2xl text-neutral-800 leading-relaxed">
                "지상안전사고"란 공항 보호구역에서 사람, 시설, 차량 및 장비 등으로 인하여 <span className="font-bold text-black text-[1.1em]">인명피해가 발생하거나</span> <span className="font-bold text-black text-[1.1em]">항공기,</span> <span className="font-bold text-black text-[1.1em]">시설, 차량등에 물적피해가 발생한 것</span>을 말한다. 다만, 항공기 사고, 준사고, 항공안전장애는 제외한다.
              </p>
            </div>
            <div className="p-8 bg-neutral-50 border-l-4 border-neutral-400 rounded-r-2xl">
              <h3 className="text-2xl font-bold mb-4">법적 근거</h3>
              <ul className="space-y-2 text-lg text-neutral-600">
                <li>• 공항시설법 제31조의2, 제31조의3</li>
                <li>• 공항안전운영기준(국토교통부 고시)</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center bg-neutral-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
            <div className="text-center relative z-10">
              <AlertTriangle size={100} className="mx-auto mb-8 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
              <p className="text-5xl font-black mb-6 leading-tight tracking-tight">
                하늘 위의 안전!<br />
                <span className="text-amber-400">지상에서 시작</span>됩니다.
              </p>
              <div className="w-24 h-1 bg-amber-500 mx-auto mt-6" />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <img src={`${BASE_URL}images/con-05.jpg`} alt="Ground Safety Information Banner" className="w-full h-auto rounded-xl" referrerPolicy="no-referrer" />
        </div>
      </div>
    </WebSlide>,

    // Slide 3: 사고 유형
    <WebSlide>
      <SectionHeader 
        label="02. Accident Types" 
        title="지상안전사고 유형" 
      />
      <div className="flex-1 flex items-center justify-center mt-4">
        <img src={`${BASE_URL}images/con-03.jpg`} alt="Ground Safety Accident Types" className="max-w-full max-h-full object-contain rounded-2xl shadow-lg scale-110" referrerPolicy="no-referrer" />
      </div>
    </WebSlide>,

    // Slide 4: 지상안전사고 신고
    <WebSlide>
      <SectionHeader 
        label="03. Reporting" 
        title="지상안전사고 신고" 
      />
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 items-center">
          {/* Step 1: 발생 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white border border-neutral-200 p-6 rounded-3xl shadow-sm relative z-10 w-full flex flex-col justify-center"
          >
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
              <AlertTriangle size={24} />
            </div>
            <div className="text-[10px] font-mono text-red-600 font-bold mb-2 uppercase tracking-widest">Step 01</div>
            <h3 className="text-2xl font-bold text-neutral-900 leading-tight">지상안전사고<br/>발생</h3>
          </motion.div>

          <ArrowRight className="hidden lg:block text-blue-600 shrink-0" size={32} />
          <ArrowDown className="lg:hidden text-blue-600 my-4" size={24} />
          
          {/* Step 2: 신고 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-white border border-neutral-200 p-6 rounded-3xl shadow-sm relative z-10 w-full flex flex-col justify-center"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Phone size={24} />
            </div>
            <div className="text-[10px] font-mono text-blue-600 font-bold mb-2 uppercase tracking-widest">Step 02</div>
            <h3 className="text-2xl font-bold text-neutral-900 leading-tight mb-2">즉시 신고</h3>
            <p className="text-base text-neutral-500 leading-snug">
              사고 당사자, 소속 조업사<br/>또는 목격자
            </p>
          </motion.div>

          <ArrowRight className="hidden lg:block text-blue-600 shrink-0" size={32} />
          <ArrowDown className="lg:hidden text-blue-600 my-4" size={24} />

          {/* Step 3: 보고 (공항/지방청) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-white border border-neutral-200 p-10 rounded-[2.5rem] shadow-sm relative z-10 w-full flex flex-col justify-center"
          >
            <div className="w-16 h-16 bg-neutral-50 text-neutral-600 rounded-2xl flex items-center justify-center mb-8">
              <Building2 size={32} />
            </div>
            <div className="text-sm font-mono text-neutral-400 font-bold mb-3 uppercase tracking-widest">Step 03</div>
            <h3 className="text-3xl font-bold text-neutral-900 leading-tight mb-4">즉시 보고</h3>
            <p className="text-lg text-neutral-500 leading-snug">
              공항운영자 및<br/>지방항공청
            </p>
          </motion.div>

          <ArrowRight className="hidden lg:block text-blue-600 shrink-0" size={48} />
          <ArrowDown className="lg:hidden text-blue-600 my-4" size={32} />

          {/* Step 4: 최종 보고 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 bg-blue-600 p-10 rounded-[2.5rem] shadow-xl relative z-10 text-white w-full flex flex-col justify-center"
          >
            <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-8">
              <Target size={32} />
            </div>
            <div className="text-sm font-mono text-white/60 font-bold mb-3 uppercase tracking-widest">Final Step</div>
            <h3 className="text-3xl font-bold leading-tight mb-4">국토교통부<br/>공항운영과</h3>
            <p className="text-lg text-white/60 leading-snug">
              최종 보고 및<br/>후속 조치 시행
            </p>
          </motion.div>
        </div>

        <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4">
          <Info className="text-red-600" />
          <p className="text-2xl font-medium text-red-900">
            허위 보고 또는 보고 누락 시 관련 법령에 따라 엄중한 처벌을 받을 수 있습니다.
          </p>
        </div>
      </div>
    </WebSlide>,

    // Slide 5: 행정처분 기준
    <WebSlide>
      <SectionHeader 
        label="04. Penalties" 
        title="지상안전사고 행정처분 기준" 
      />
      <div className="grid grid-cols-2 gap-10 mt-20 h-[calc(100%-200px)]">
        <PenaltyTable data={penaltyData1} />
        <PenaltyTable data={penaltyData2} />
      </div>
    </WebSlide>,

    // Slide 6: 사고 발생 현황 (차트)
    <WebSlide>
      <SectionHeader 
        label="05. Statistics" 
        title="지상안전사고 발생 현황" 
      />
      
      <div className="flex flex-col h-full mt-20">
        {/* Legend */}
        <div className="flex justify-center gap-8 mb-12 text-sm font-bold">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#f1f5f9] border border-neutral-200" />
            <span>운항횟수</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
            <span>발생건수</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#f97316]" />
            <span>환산건수 <span className="text-neutral-400 font-normal">(운항 1만건당)</span></span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[340px] w-full bg-white rounded-3xl p-4 border-2 border-neutral-200">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={occurrenceData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 16, fontWeight: 700 }}
                dy={15}
              />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right-acc" hide domain={[0, 60]} />
              <YAxis yAxisId="right-conv" hide domain={[0, 4]} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              
              {/* Flights Bar */}
              <Bar 
                yAxisId="left"
                dataKey="flights" 
                radius={[8, 8, 0, 0]} 
                barSize={70} 
              >
                {occurrenceData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.year === "2025" ? '#fee2e2' : '#f1f5f9'} 
                  />
                ))}
                <LabelList 
                  dataKey="flights" 
                  position="top" 
                  fill="#94a3b8" 
                  fontSize={12} 
                  fontWeight={500}
                  formatter={(value: number) => value.toLocaleString()} 
                  offset={10}
                />
              </Bar>
              
              {/* Accidents Line */}
              <Line 
                yAxisId="right-acc"
                type="monotone" 
                dataKey="accidents" 
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 8, fill: '#ef4444', strokeWidth: 3, stroke: '#fff' }}
                label={{ 
                  position: 'top', 
                  fill: '#ef4444', 
                  fontSize: 20, 
                  fontWeight: 800, 
                  offset: 15,
                  formatter: (value: number) => value
                }}
              />
              
              {/* Converted Line */}
              <Line 
                yAxisId="right-conv"
                type="monotone" 
                dataKey="converted" 
                stroke="#f97316" 
                strokeWidth={3} 
                dot={{ r: 6, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                label={{ 
                  position: 'top', 
                  fill: '#f97316', 
                  fontSize: 16, 
                  fontWeight: 700, 
                  offset: 15,
                  formatter: (value: number) => value.toFixed(3).replace(/\.?0+$/, '')
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-6 text-neutral-800">최근 3개년 사고 추이</h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              { year: '2023년', count: '29건', rate: '0.455', active: false },
              { year: '2024년', count: '36건', rate: '0.403', active: false },
              { year: "2025년", count: '21건', rate: '0.230', active: true },
            ].map((item, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-8 rounded-[2rem] border flex flex-col items-center justify-center text-center transition-all",
                  item.active 
                    ? "bg-[#fff1f2] border-[#ffe4e6] shadow-sm" 
                    : "bg-[#f8fafc] border-[#f1f5f9] shadow-none"
                )}
              >
                <span className={cn("text-lg font-bold mb-3", item.active ? "text-[#f43f5e]" : "text-[#94a3b8]")}>
                  {item.year}
                </span>
                <span className={cn("text-4xl font-black mb-2", item.active ? "text-[#e11d48]" : "text-[#1e293b]")}>
                  {item.count}
                </span>
                <span className={cn("text-lg font-bold", item.active ? "text-[#fb7185]" : "text-[#f97316]")}>
                  {item.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 7: 공항별 사고 발생 현황
    <WebSlide>
      <SectionHeader 
        label="06. Airport Statistics" 
        title="공항별 사고 발생 현황" 
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20 h-[calc(100%-180px)]">
        <AirportTable />
        <div className="flex flex-col h-full">
          <div className="flex-1 bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
              공항별 누적 사고 발생 비중 (20~25년)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={airportData.sort((a, b) => b.total - a.total).slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <defs>
                  <linearGradient id="airportBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 18, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 14 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}
                />
                <Bar dataKey="total" fill="url(#airportBarGradient)" radius={[12, 12, 0, 0]} barSize={60}>
                  <LabelList dataKey="total" position="top" fill="#1e40af" fontSize={20} fontWeight={800} offset={15} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 8: 예방 목표 달성 현황 (전국 공항)
    <WebSlide>
      <SectionHeader 
        label="07. Goals" 
        title="'25년 지상안전사고 예방 목표 달성 현황" 
      />
      <div className="flex flex-col items-center justify-center h-[calc(100%-160px)]">
        <div className="w-full max-w-6xl">
          <GoalTable 
            title="전국 공항" 
            flights="912,744" 
            data={totalGoalData} 
            total={{ label: "전국 합계", performance: "0.230", count: "21" }} 
          />
        </div>
      </div>
    </WebSlide>,

    // Slide 9: 예방 목표 달성 현황 (공사별)
    <WebSlide>
      <SectionHeader 
        label="08. Goals" 
        title="'25년 지상안전사고 예방 목표 달성 현황" 
      />
      <div className="flex flex-col items-center justify-center h-full pt-40">
        <div className="grid grid-cols-2 gap-8 w-full">
          <GoalTable 
            title="한국공항공사" 
            flights="486,984" 
            data={kacGoalData} 
            total={{ label: "소계", performance: "0.185", count: "9" }}
            isSmall={true}
          />
          <GoalTable 
            title="인천공항공사" 
            flights="425,760" 
            data={iiacGoalData} 
            total={{ label: "소계", performance: "0.282", count: "12" }}
            isSmall={true}
          />
        </div>
      </div>
    </WebSlide>,

    // Slide 11: 주요 사고 원인
    <WebSlide>
      <SectionHeader 
        label="10. Causes" 
        title="주요 사고 원인" 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 h-[calc(100%-140px)]">
        {/* 강조: 운전자 부주의 (Left Hero Section) */}
        <div className="lg:col-span-7 relative group overflow-hidden bg-neutral-900 rounded-[2.5rem] shadow-2xl flex flex-col border border-white/5">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/30 blur-[80px] rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10 p-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <UserX size={48} className="text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-1 text-white tracking-tighter">운전자 부주의</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-md uppercase tracking-widest">Critical Factor</span>
                    <p className="text-lg text-blue-400 font-medium italic">집중력 저하 및 안일함</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-7xl font-black text-blue-600 leading-none">85<span className="text-3xl">%</span></span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-1">Human Error Rate</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[34px] leading-[3] text-neutral-200 font-medium mb-4 tracking-tight">
                지상안전사고의 대부분은 <span className="text-white font-bold border-b-4 border-blue-600 pb-1">인적 요인</span>에 의해 발생하며,<br />
                특히 <span className="text-blue-400 font-bold text-[44px]">운전자 및 작업자의 부주의</span>가<br />
                사고의 결정적인 원인이 되고 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <EyeOff size={24} className="text-blue-400" />
                  </div>
                  <h4 className="font-bold text-2xl text-white">전방 주시 태만</h4>
                </div>
                <p className="text-[20px] text-neutral-400 leading-relaxed">이동 중 주변 상황 확인 소홀 및<br />스마트폰 사용 등 집중력 분산</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <Activity size={24} className="text-blue-400" />
                  </div>
                  <h4 className="font-bold text-2xl text-white">운전 미숙</h4>
                </div>
                <p className="text-[20px] text-neutral-400 leading-relaxed">익숙한 작업 환경에서의 긴장감 완화 및<br />기본 조작 절차 누락</p>
              </div>
            </div>
          </div>
        </div>

        {/* 기타 요인들 (Right Section) */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          {[
            { title: "사주경계 미흡", desc: "출발 전 주변 확인 소홀, 교차로/유도로 진입 전 일단정지 규정 미준수", color: "bg-amber-500", icon: <Move className="text-amber-500" /> },
            { title: "안전 수칙 미준수", desc: "통과 높이 제한 무시, 안전거리 미확보, 유도자 없이 후진 접현 시도", color: "bg-red-500", icon: <ShieldCheck className="text-red-500" /> },
            { title: "조급한 작업 수행", desc: "항공기 지연 및 스케줄 압박으로 인한 무리한 조업 진행", color: "bg-blue-500", icon: <Clock className="text-blue-500" /> },
            { title: "환경적 요인", desc: "강풍에 의한 장비 이동, 빗물로 인한 노면 미끄러움 등", color: "bg-neutral-400", icon: <Wind className="text-neutral-400" /> }
          ].map((item, idx) => (
            <div key={idx} className="group bg-white p-5 rounded-[2rem] border border-neutral-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-start gap-5">
              <div className="mt-1 w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-2xl mb-1 text-neutral-900 flex items-center gap-3">
                  <div className={cn("w-1.5 h-6 rounded-full", item.color)} />
                  {item.title}
                </h4>
                <p className="text-[22px] text-neutral-500 leading-snug font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WebSlide>,

    // Slide 12: 25년 주요 사례
    <WebSlide>
      <div className="flex flex-col h-full -mt-4">
        <div className="flex items-end justify-between mb-4">
          <SectionHeader 
            label="11. Case Studies" 
            title="'25년 주요 사고 사례" 
          />
          <div className="mb-6 hidden lg:block">
            <div className="text-right">
              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Global Safety Network</div>
              <div className="text-sm font-bold text-neutral-900 italic">Real-time Ground Incident Monitoring</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-[1rem] p-4 border border-neutral-200 shadow-2xl relative overflow-hidden group flex flex-col">
          {/* News Portal Header */}
          <div className="flex items-center justify-between mb-4 border-b-2 border-neutral-900 pb-3">
            <div className="flex items-center gap-4">
              <div className="bg-neutral-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter italic">
                Breaking News
              </div>
              <span className="text-xs font-black text-neutral-400 font-mono">2025 GROUND SAFETY REPORT</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-400">
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                LIVE
              </div>
              <Search size={14} />
              <Menu size={14} />
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <NewsHeadlines onHeadlineClick={(headline) => setSelectedWord(headline)} />
          </div>
        </div>
      </div>
    </WebSlide>,

    <WebSlide>
      <div className="h-full flex flex-col">
        <SectionHeader 
          label="13. Gallery" 
          title="2025년 주요 지상안전사고 갤러리" 
        />
        <div className="flex-1 min-h-0">
          <AccidentGallery />
        </div>
      </div>
    </WebSlide>,

    // Slide 14: 설문조사 개요
    <WebSlide>
      <SectionHeader 
        label="14. Survey" 
        title="지상조업 사고예방 및 근무환경 개선 설문조사" 
      />
      <div className="flex flex-col justify-center h-[calc(100%-180px)] px-20">
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-16 bg-blue-600 rounded-full" />
            <div>
              <h3 className="text-4xl font-black text-neutral-900 mb-2">(목적) 지상조업 현장 사고 예방 아이디어 발굴 및 근무환경 개선 방안 검토</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-blue-50 p-8 rounded-3xl border-l-8 border-blue-600">
              <h4 className="text-2xl font-black text-blue-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-lg font-black">①</span>
                조사내용
              </h4>
              <p className="text-xl text-neutral-700 leading-relaxed">
                근로자가 체감하는 지상조업 현장 위험도 및 ②사고 예방 아이디어, ③작업환경 만족도 및 ④개선 아이디어 등
              </p>
            </div>

            <div className="bg-neutral-50 p-8 rounded-3xl border-l-8 border-neutral-400">
              <h4 className="text-2xl font-black text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 bg-neutral-600 text-white rounded-full text-lg font-black">대상</span>
                기간 및 대상
              </h4>
              <p className="text-xl text-neutral-700 leading-relaxed mb-3">
                <strong className="text-neutral-900">(대상·기간)</strong> 공항공사·항공사·지상조업사 / '26.3.20~3.25 * 참여자 74명
              </p>
              <p className="text-xl text-neutral-700 leading-relaxed">
                <strong className="text-neutral-900">(기타)</strong> 사고예방 아이디어, 근무환경 개선 방안 의견 제출자 각 10명에게 커피 쿠폰 제공
              </p>
            </div>
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 15: 설문조사 결과 - 위험도 인식
    <WebSlide>
      <SectionHeader 
        label="15. Survey Results" 
        title="설문조사 결과" 
      />
      <div className="flex flex-col justify-center h-[calc(100%-180px)] px-12">
        <div className="space-y-10">
          {/* 위험도 인식 */}
          <div className="bg-white p-8 rounded-3xl border-2 border-neutral-200 shadow-xl">
            <h3 className="text-3xl font-black text-neutral-900 mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">⚠</span>
              </div>
              (위험도 인식) 현장 근로자 <span className="text-red-600">47%</span>(35명)는 지상조업환경이 위험하다고 생각하고 있으며, <span className="text-blue-600">27%</span>(20명)만 비교적 안전하다고 생각하고 있음
            </h3>
            
            <div className="grid grid-cols-2 gap-10">
              {/* 테이블 */}
              <div className="bg-neutral-50 p-6 rounded-2xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-300">
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">매우 위험</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">위험</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">보통</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">조금 안전</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">안전</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-200">
                      <td className="py-4 px-4 text-center text-2xl font-black text-red-600">9명<div className="text-sm text-neutral-500">(12%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-red-500">26명<div className="text-sm text-neutral-500">(36%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-neutral-600">19명<div className="text-sm text-neutral-500">(26%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-blue-500">5명<div className="text-sm text-neutral-500">(7%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-blue-600">15명<div className="text-sm text-neutral-500">(20%)</div></td>
                      <td className="py-4 px-4 text-center text-lg font-bold text-neutral-700">74명</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 그래프 */}
              <div className="flex items-center justify-center">
                <div className="relative w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '매우\n위험', value: 12, color: '#dc2626' },
                      { name: '위험', value: 36, color: '#ef4444' },
                      { name: '보통', value: 26, color: '#737373' },
                      { name: '조금\n안전', value: 7, color: '#3b82f6' },
                      { name: '안전', value: 20, color: '#2563eb' }
                    ]} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: 700 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {[
                          { name: '매우위험', value: 12, color: '#dc2626' },
                          { name: '위험', value: 36, color: '#ef4444' },
                          { name: '보통', value: 26, color: '#737373' },
                          { name: '조금안전', value: 7, color: '#3b82f6' },
                          { name: '안전', value: 20, color: '#2563eb' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList dataKey="value" position="top" formatter={(value: number) => `${value}%`} style={{ fontSize: 16, fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 근무환경 만족도 */}
          <div className="bg-white p-8 rounded-3xl border-2 border-neutral-200 shadow-xl">
            <h3 className="text-3xl font-black text-neutral-900 mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">📋</span>
              </div>
              (근무환경 만족도) <span className="text-amber-600">77%</span>(57명)는 평균 이상의 만족을 표시하였으며, <span className="text-neutral-600">23%</span>(17명)는 휴게공간, 근무시간, 상벌제도 등 불만족 반응
            </h3>
            
            <div className="grid grid-cols-2 gap-10">
              {/* 테이블 */}
              <div className="bg-neutral-50 p-6 rounded-2xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-300">
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">매우 불만족</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">불만족</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">보통</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">조금 만족</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">만족</th>
                      <th className="py-3 px-4 text-center text-base font-bold text-neutral-700">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-200">
                      <td className="py-4 px-4 text-center text-2xl font-black text-red-600">5명<div className="text-sm text-neutral-500">(7%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-red-500">12명<div className="text-sm text-neutral-500">(16%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-neutral-600">29명<div className="text-sm text-neutral-500">(39%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-blue-500">14명<div className="text-sm text-neutral-500">(19%)</div></td>
                      <td className="py-4 px-4 text-center text-2xl font-black text-blue-600">14명<div className="text-sm text-neutral-500">(19%)</div></td>
                      <td className="py-4 px-4 text-center text-lg font-bold text-neutral-700">74명</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 그래프 */}
              <div className="flex items-center justify-center">
                <div className="relative w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '매우\n불만족', value: 7, color: '#dc2626' },
                      { name: '불만족', value: 16, color: '#ef4444' },
                      { name: '보통', value: 39, color: '#737373' },
                      { name: '조금\n만족', value: 19, color: '#3b82f6' },
                      { name: '만족', value: 19, color: '#2563eb' }
                    ]} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: 700 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {[
                          { name: '매우불만족', value: 7, color: '#dc2626' },
                          { name: '불만족', value: 16, color: '#ef4444' },
                          { name: '보통', value: 39, color: '#737373' },
                          { name: '조금만족', value: 19, color: '#3b82f6' },
                          { name: '만족', value: 19, color: '#2563eb' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList dataKey="value" position="top" formatter={(value: number) => `${value}%`} style={{ fontSize: 16, fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 16: 지상조업 안전사고 예방 아이디어
    <WebSlide>
      <SectionHeader 
        label="16. Safety Ideas" 
        title="지상조업 안전사고 예방 아이디어" 
      />
      <div className="flex items-center justify-center h-[calc(100%-180px)]">
        <div className="w-full max-w-6xl">
          <table className="w-full border-collapse bg-white rounded-3xl overflow-hidden shadow-2xl">
            <thead>
              <tr className="bg-neutral-900 text-white">
                <th className="py-6 px-6 text-center text-xl font-black w-1/4 border-r border-white/10">구분</th>
                <th className="py-6 px-6 text-left text-xl font-black">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-neutral-200 hover:bg-blue-50 transition-colors">
                <td className="py-6 px-6 align-top border-r border-neutral-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">🚗</span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">차량·장비</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <ul className="space-y-3 text-xl text-neutral-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-black">•</span>
                      <span>터그카 후진 시 후진등·경광등 설치 의무화</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-black">•</span>
                      <span>항공기 접현 경비 유도수 배치 및 시행 문행</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-black">•</span>
                      <span>화물터미널 터그카·지게차 단속 강화, 인도·항공기 주변 달리 적재 금지</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b-2 border-neutral-200 hover:bg-amber-50 transition-colors">
                <td className="py-6 px-6 align-top border-r border-neutral-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">🛡️</span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">안전 인프라</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <ul className="space-y-3 text-xl text-neutral-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>브릿지 계단 논슬립(고정착 미끄럼방지 테이프·타공형 매트) 강화</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>BSA 구역·GSE 도로 3거리 등 반사경·블라드콘·반사띠 설치</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>장비정치장 확대 및 장비별(버스, 벨트, 터그카) 구역 지정</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>원격주기장 승객 동선 등체, 차량 진출입 시 경광등·차벨 적용</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>야간 리모트 주기장 조도 향상 대책 마련</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>장비정치장에 항공기 무어링포인트 방식의 장비 무어링포인트 설치</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="py-6 px-6 align-top border-r border-neutral-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">⚙️</span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">제도</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <ul className="space-y-3 text-xl text-neutral-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-black">•</span>
                      <span>낙뢰 발생 시 공항기관 주도 작업중단 권한 명확화</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-black">•</span>
                      <span>운전석·조수석 휴대폰 사용 전면 금지 및 처벌규정 신설</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </WebSlide>,

    // Slide 17: 근무환경 개선 아이디어
    <WebSlide>
      <SectionHeader 
        label="17. Work Environment" 
        title="근무환경 개선 아이디어" 
      />
      <div className="flex items-center justify-center h-[calc(100%-180px)]">
        <div className="w-full max-w-6xl">
          <table className="w-full border-collapse bg-white rounded-3xl overflow-hidden shadow-2xl">
            <thead>
              <tr className="bg-neutral-900 text-white">
                <th className="py-6 px-6 text-center text-xl font-black w-1/4 border-r border-white/10">구분</th>
                <th className="py-6 px-6 text-left text-xl font-black">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-neutral-200 hover:bg-purple-50 transition-colors">
                <td className="py-6 px-6 align-top border-r border-neutral-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">🏢</span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">휴게시설</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <ul className="space-y-3 text-xl text-neutral-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-black">•</span>
                      <span>야외 근무자 폭염·강추위 시 열 식히거나 추위 피할 휴게공간 확대</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-black">•</span>
                      <span>대기실·휴게실 정결 및 냉난방 개선</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b-2 border-neutral-200 hover:bg-blue-50 transition-colors">
                <td className="py-6 px-6 align-top border-r border-neutral-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">🔧</span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">장비지원</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <ul className="space-y-3 text-xl text-neutral-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-black">•</span>
                      <span>BSA·주기장 먼저 제거 출입 차량 도입 및 주기적 점소</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-black">•</span>
                      <span>국제선 BSA 출발 벨트 수 확대 및 공간 확장</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b-2 border-neutral-200 hover:bg-rose-50 transition-colors">
                <td className="py-6 px-6 align-top border-r border-neutral-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">👔</span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">위생</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <ul className="space-y-3 text-xl text-neutral-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-black">•</span>
                      <span>하절실 환절 개선 및 상추지원 확장실 주기적인 청소</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-black">•</span>
                      <span>작업자 개인우의 건조 공간 및 탈의실 청결</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-600 font-black">•</span>
                      <span>팜프사이드 스맷볼 휴게 컨테이너 관리 구역 지정 (에어컨·히터·청결)</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-amber-50 transition-colors">
                <td className="py-6 px-6 align-top border-r border-neutral-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">📱</span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">운영체계<br/>등 기타</span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <ul className="space-y-3 text-xl text-neutral-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>상주기관 공용 회의·교육·인터뷰실 운영</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>대기실·교육장 분리 또는 확장(재주공항)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-black">•</span>
                      <span>QR 건의 후 조치 완료 시 결과 회신 (카카오톡 방식 복원 등)</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </WebSlide>,

    // Slide 18: 빈 슬라이드 (5페이지)
    <WebSlide>
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-8">📋</div>
          <h2 className="text-5xl font-black text-neutral-900 mb-4">설문조사 추가 자료</h2>
          <p className="text-2xl text-neutral-500">Additional Survey Materials</p>
        </div>
      </div>
    </WebSlide>,

    // Slide 19: 웹사이트 소개
    <WebSlide>
      <SectionHeader 
        label="19. Platform" 
        title="'공항 지상안전사고 예방' 웹사이트" 
      />
      <div 
        className="flex-1 min-h-0 mt-4 rounded-3xl overflow-hidden border border-neutral-200 shadow-2xl relative bg-neutral-50 flex items-center justify-center group"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          const img = e.currentTarget.querySelector('img.website-img') as HTMLImageElement;
          if (img) {
            img.style.transformOrigin = `${x}% ${y}%`;
          }
        }}
      >
        <img 
          src={`${BASE_URL}images/batang.jpg`} 
          alt="Ground Safety Website" 
          className="website-img w-full h-full object-contain scale-110 transition-transform duration-300 group-hover:scale-125"
          style={{ transformOrigin: '50% 50%' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl flex items-center gap-6">
          <div>
            <p className="text-2xl font-black text-neutral-900 mb-2">지금 바로 접속하세요</p>
            <p className="text-lg font-bold text-blue-600">bandinuguri.github.io/safe/</p>
          </div>
          <div className="group/qr relative">
            <img 
              src={`${BASE_URL}images/qr-code.jpg`} 
              alt="QR Code" 
              className="w-24 h-24 rounded-lg border-2 border-neutral-200 transition-all duration-300 group-hover/qr:scale-[3] group-hover/qr:shadow-2xl group-hover/qr:z-50"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 15: 설문조사 개요
    <WebSlide>
      <SectionHeader 
        label="15. Survey" 
        title="지상조업 사고예방 및 근무환경 개선 설문조사" 
      />
      <div className="flex flex-col justify-center h-full pt-32 px-12">
        <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-2xl">
            <h3 className="text-2xl font-bold mb-4 text-blue-900">목적</h3>
            <p className="text-xl text-neutral-700 leading-relaxed">
              지상조업 현장 사고 예방 아이디어 발굴 및 근무환경 개선 방안 검토
            </p>
          </div>
          
          <div className="bg-neutral-50 border-l-4 border-neutral-600 p-8 rounded-r-2xl">
            <h3 className="text-2xl font-bold mb-4 text-neutral-900">조사내용</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">①</span>
                <p className="text-xl text-neutral-700">근로자가 체감하는 지상조업 현장 위험도 및</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">②</span>
                <p className="text-xl text-neutral-700">사고 예방 아이디어,</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">③</span>
                <p className="text-xl text-neutral-700">작업환경 만족도 및</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">④</span>
                <p className="text-xl text-neutral-700">개선 아이디어 등</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-lg">
              <h4 className="text-lg font-bold mb-3 text-neutral-700">대상·기간</h4>
              <p className="text-xl text-neutral-900">
                공항공사·항공사·지상조업사 / '26.3.20~3.25 
                <span className="text-blue-600 font-bold ml-2">* 참여자 74명</span>
              </p>
            </div>
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-lg">
              <h4 className="text-lg font-bold mb-3 text-neutral-700">기타</h4>
              <p className="text-xl text-neutral-900">
                사고예방 아이디어, 근무환경 개선 방안 의견 제출자 각 10명에게 커피 쿠폰 제공
              </p>
            </div>
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 16: 설문조사 결과 1 (위험도 인식)
    <WebSlide>
      <SectionHeader 
        label="16. Survey Results" 
        title="설문조사 결과 - 위험도 인식" 
      />
      <div className="flex flex-col justify-center h-full pt-32 px-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 p-8 rounded-3xl mb-8">
            <p className="text-2xl font-bold text-neutral-800 leading-relaxed">
              <span className="text-red-600 text-3xl font-black">위험도 인식</span> 현장 근로자 
              <span className="text-red-600 font-black text-3xl">47%</span>(35명)는 지상조업환경이 
              <span className="text-red-600 font-black">위험하다</span>고 생각하고 있으며, 
              <span className="text-orange-600 font-black text-3xl">27%</span>(20명)만 
              <span className="text-orange-600 font-black">비교적 안전하다</span>고 생각하고 있음
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* 표 */}
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">위험도 인식 분포</h3>
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-neutral-900 text-white">
                    <th className="py-3 px-2 text-sm">매우 위험</th>
                    <th className="py-3 px-2 text-sm">위험</th>
                    <th className="py-3 px-2 text-sm">보통</th>
                    <th className="py-3 px-2 text-sm">조금 안전</th>
                    <th className="py-3 px-2 text-sm">안전</th>
                    <th className="py-3 px-2 text-sm">비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 font-bold text-lg">9명<br/><span className="text-sm text-neutral-500">(12%)</span></td>
                    <td className="py-4 font-bold text-lg">26명<br/><span className="text-sm text-neutral-500">(36%)</span></td>
                    <td className="py-4 font-bold text-lg">19명<br/><span className="text-sm text-neutral-500">(26%)</span></td>
                    <td className="py-4 font-bold text-lg">5명<br/><span className="text-sm text-neutral-500">(7%)</span></td>
                    <td className="py-4 font-bold text-lg">15명<br/><span className="text-sm text-neutral-500">(20%)</span></td>
                    <td className="py-4 font-bold text-lg">74명</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 그래프 */}
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-lg flex items-center justify-center">
              <div className="w-full h-64 flex items-end justify-around gap-2 px-4">
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-red-600 rounded-t-lg transition-all hover:bg-red-700" style={{width: '100%', height: '48%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">매우위험<br/>12%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600" style={{width: '100%', height: '100%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">위험<br/>36%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-yellow-400 rounded-t-lg transition-all hover:bg-yellow-500" style={{width: '100%', height: '72%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">보통<br/>26%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-green-400 rounded-t-lg transition-all hover:bg-green-500" style={{width: '100%', height: '28%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">조금안전<br/>7%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{width: '100%', height: '56%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">안전<br/>20%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 17: 설문조사 결과 2 (근로환경 만족도)
    <WebSlide>
      <SectionHeader 
        label="17. Survey Results" 
        title="설문조사 결과 - 근로환경 만족도" 
      />
      <div className="flex flex-col justify-center h-full pt-32 px-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-8 rounded-3xl mb-8">
            <p className="text-2xl font-bold text-neutral-800 leading-relaxed">
              <span className="text-blue-600 text-3xl font-black">근로환경 만족도</span> 
              <span className="text-blue-600 font-black text-3xl">77%</span>(57명)는 
              <span className="text-blue-600 font-black">평균 이상</span>의 만족을 표시하였으며, 
              <span className="text-orange-600 font-black text-3xl">23%</span>(17명)는 휴게공간, 근무시간, 상벌제도 등 
              <span className="text-orange-600 font-black">불만족 반응</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* 표 */}
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">근로환경 만족도 분포</h3>
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-neutral-900 text-white">
                    <th className="py-3 px-2 text-sm">매우 불만족</th>
                    <th className="py-3 px-2 text-sm">불만족</th>
                    <th className="py-3 px-2 text-sm">보통</th>
                    <th className="py-3 px-2 text-sm">조금 만족</th>
                    <th className="py-3 px-2 text-sm">만족</th>
                    <th className="py-3 px-2 text-sm">비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 font-bold text-lg">5명<br/><span className="text-sm text-neutral-500">(7%)</span></td>
                    <td className="py-4 font-bold text-lg">12명<br/><span className="text-sm text-neutral-500">(16%)</span></td>
                    <td className="py-4 font-bold text-lg">29명<br/><span className="text-sm text-neutral-500">(39%)</span></td>
                    <td className="py-4 font-bold text-lg">14명<br/><span className="text-sm text-neutral-500">(19%)</span></td>
                    <td className="py-4 font-bold text-lg">14명<br/><span className="text-sm text-neutral-500">(19%)</span></td>
                    <td className="py-4 font-bold text-lg">74명</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 그래프 */}
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-lg flex items-center justify-center">
              <div className="w-full h-64 flex items-end justify-around gap-2 px-4">
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-red-600 rounded-t-lg transition-all hover:bg-red-700" style={{width: '100%', height: '28%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">매우불만족<br/>7%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600" style={{width: '100%', height: '64%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">불만족<br/>16%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-yellow-400 rounded-t-lg transition-all hover:bg-yellow-500" style={{width: '100%', height: '100%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">보통<br/>39%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-green-400 rounded-t-lg transition-all hover:bg-green-500" style={{width: '100%', height: '76%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">조금만족<br/>19%</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{width: '100%', height: '76%'}}></div>
                  <div className="text-xs font-bold mt-2 text-center">만족<br/>19%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebSlide>,

    // Slide 18: 안전사고 예방 아이디어
    <WebSlide>
      <SectionHeader 
        label="18. Prevention Ideas" 
        title="지상조업 안전사고 예방 아이디어" 
      />
      <div className="flex flex-col justify-center h-full pt-32 px-8">
        <div className="max-w-6xl mx-auto w-full">
          <table className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-200">
            <thead>
              <tr className="bg-neutral-900 text-white">
                <th className="py-4 px-6 text-left w-1/4 text-lg">구분</th>
                <th className="py-4 px-6 text-left text-lg">내용</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              <tr className="border-b border-neutral-200 hover:bg-blue-50 transition-colors">
                <td className="py-5 px-6 font-bold text-neutral-700">차량·장비</td>
                <td className="py-5 px-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>터그카 후진 시 후진등·경광등 설치 의무화</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>항공기 접현 경비 유도수 배치 및 시행 문햄</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>화물터미널 터그카·지게차 단속 강화, 인도·항공기 주변 달리 적재 금지</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b border-neutral-200 hover:bg-blue-50 transition-colors">
                <td className="py-5 px-6 font-bold text-neutral-700">안전 인프라</td>
                <td className="py-5 px-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>브릿지 계단 논슬립(고정식 미끄럼방지 테이프·타공형 매트) 강화</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>BSA 구역·GSE 도로 3거리 등 반사경·블라드·반사띠 설치</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>장비경치장 확대 및 장비별(버스, 벨트, 터그카) 구역 지정</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>원격주기장 승객 동선 등재, 차량 진출입 시 경광등·차별색 적용</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>야간 리모트 주기장 조도 향상 대책 마련</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>장비경치장에 항공기 무어링포인트 방식의 장비 무어링포인트 설치</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-5 px-6 font-bold text-neutral-700">제도</td>
                <td className="py-5 px-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>낙뢰 발생 시 공공기관 주도 작업중단 권한 명확화</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>운전석·조수석 휴대폰 사용 전면 금지 및 처벌규정 신설</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </WebSlide>,

    // Slide 19: 근로환경 개선 아이디어
    <WebSlide>
      <SectionHeader 
        label="19. Work Environment Ideas" 
        title="근로환경 개선 아이디어" 
      />
      <div className="flex flex-col justify-center h-full pt-32 px-8">
        <div className="max-w-6xl mx-auto w-full">
          <table className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-200">
            <thead>
              <tr className="bg-neutral-900 text-white">
                <th className="py-4 px-6 text-left w-1/4 text-lg">구분</th>
                <th className="py-4 px-6 text-left text-lg">내용</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              <tr className="border-b border-neutral-200 hover:bg-green-50 transition-colors">
                <td className="py-5 px-6 font-bold text-neutral-700">휴게시설</td>
                <td className="py-5 px-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>야외 근무자 폭염·강추위 시 열 식히거나 추위 피할 휴게공간 확대</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>대기실·휴게실 정결 및 냉난방 개선</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b border-neutral-200 hover:bg-green-50 transition-colors">
                <td className="py-5 px-6 font-bold text-neutral-700">장비지원</td>
                <td className="py-5 px-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>BSA·주기장 먼지 제거 출입 차량 도입 및 주기적 청소</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>국제선 BSA 출발 벨트 수 확대 및 공간 확장</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b border-neutral-200 hover:bg-green-50 transition-colors">
                <td className="py-5 px-6 font-bold text-neutral-700">위생</td>
                <td className="py-5 px-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>화장실 환경 개선 및 상주직원 확장실 주기적인 청소</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>작업자 개인우의 건조 공간 및 탈의실 청도</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>랜프사이드 스맷볼 휴게 컨테이너 관리 구역 지정 (에어컨·히터·청결)</span>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="py-5 px-6 font-bold text-neutral-700">운영체계 등 기타</td>
                <td className="py-5 px-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>상주기관 공용 회의·교육·인터뷰실 운영</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>대기실·교육장 물리 또는 확장(제주공항)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>QR 건의 후 조치 완료 시 결과 회신 (카카오톡 방식 복원 등)</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </WebSlide>,

    
    // Slide 20: Thank You
    <WebSlide>
      <div className="h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
        {/* Background Gradient Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900/10 blur-[100px] rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Main Thank You Message */}
          <div className="mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block"
            >
              <AlertTriangle size={80} className="mx-auto mb-8 text-blue-600" />
            </motion.div>
            
            <h2 className="text-[10vw] font-black tracking-tighter leading-none mb-6">
              감사합니다
            </h2>
            
            <div className="w-32 h-1.5 bg-blue-600 mx-auto mb-8 rounded-full" />
            
            <p className="text-3xl text-neutral-600 font-medium">
              지상조업 안전사고예방 간담회
            </p>
          </div>

          {/* Safety Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="bg-blue-50/50 backdrop-blur-sm px-12 py-6 rounded-3xl border border-blue-100 inline-block"
          >
            <p className="text-2xl font-bold text-blue-900 italic">
              "하늘 위 안전은 지상에서부터 시작합니다"
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Action Buttons */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={() => setCurrentSlide(0)}
            className="group flex items-center gap-3 px-6 py-3 bg-white border-2 border-neutral-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            <span className="text-lg font-bold text-neutral-700 group-hover:text-blue-600">처음으로</span>
            <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={generatePrintWindow}
            className="group flex items-center gap-3 px-6 py-3 bg-blue-600 text-white border-2 border-blue-600 rounded-xl hover:bg-blue-700 hover:border-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <span className="text-lg font-bold">PDF 저장</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            onClick={downloadStandaloneHTML}
            className="group flex items-center gap-3 px-6 py-3 bg-green-600 text-white border-2 border-green-600 rounded-xl hover:bg-green-700 hover:border-green-700 transition-all shadow-lg hover:shadow-xl"
          >
            <span className="text-lg font-bold">HTML 다운</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </motion.button>
        </div>
      </div>
    </WebSlide>
  ];

  // Debug: 슬라이드 개수 확인
  console.log('Total slides:', slides.length);
  React.useEffect(() => {
    console.log('Slides array initialized with', slides.length, 'slides');
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'f') toggleFullscreen();
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [nextSlide, prevSlide]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-white overflow-hidden select-none cursor-default"
      onClick={nextSlide}
    >
      {/* 화면 표시용 슬라이드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full print:hidden"
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>

      {/* 프린트용 모든 슬라이드 (화면에서는 숨김) */}
      <div className="hidden print:block slide-container">
        {slides.map((slide, idx) => (
          <div key={idx} className="web-slide">
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div 
        className="absolute bottom-12 right-12 flex items-center gap-6 z-50 no-print"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 flex items-center justify-center border border-black/10 hover:bg-black hover:text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-sm font-mono font-bold tracking-widest">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </div>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 flex items-center justify-center border border-black/10 hover:bg-black hover:text-white transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <button 
          onClick={toggleFullscreen}
          className="w-12 h-12 flex items-center justify-center bg-black text-white hover:scale-110 transition-transform"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      {/* Progress Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black/5 z-50">
        <motion.div 
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-12 left-12 opacity-20 hover:opacity-100 transition-opacity z-50 hidden md:block">
        <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest">
          <div className="flex flex-col">
            <span className="opacity-40">Next</span>
            <span>Click / Space / →</span>
          </div>
          <div className="flex flex-col">
            <span className="opacity-40">Prev</span>
            <span>Right Click / ←</span>
          </div>
          <div className="flex flex-col">
            <span className="opacity-40">View</span>
            <span>F for Fullscreen</span>
          </div>
        </div>
      </div>

      {/* Word Detail Modal */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedWord(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              className="bg-white rounded-[4rem] p-16 max-w-5xl w-full shadow-[0_48px_96px_-12px_rgba(0,0,0,0.4)] relative border border-neutral-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedWord(null)}
                className="absolute top-10 right-10 p-4 hover:bg-neutral-100 rounded-full transition-all hover:rotate-90 active:scale-90"
              >
                <X size={40} />
              </button>
              
              <div className="mb-12">
                <span className="text-sm font-black text-blue-600 font-mono uppercase tracking-[0.3em] mb-6 block">Case Study Analysis</span>
                <h2 className="text-7xl font-black tracking-tighter leading-[1.1] mb-10 text-neutral-900">{selectedWord.text}</h2>
                
                <div className="flex flex-wrap gap-6">
                  {selectedWord.airport && (
                    <div className="px-8 py-4 bg-neutral-50 rounded-3xl border border-neutral-100 shadow-sm">
                      <span className="text-[10px] font-black text-neutral-400 block uppercase tracking-[0.2em] mb-1">Airport</span>
                      <span className="text-2xl font-black text-neutral-900">{selectedWord.airport}</span>
                    </div>
                  )}
                  {selectedWord.date && (
                    <div className="px-8 py-4 bg-neutral-50 rounded-3xl border border-neutral-100 shadow-sm">
                      <span className="text-[10px] font-black text-neutral-400 block uppercase tracking-[0.2em] mb-1">Date & Time</span>
                      <span className="text-2xl font-black text-neutral-900">{selectedWord.date}</span>
                    </div>
                  )}
                  {selectedWord.cause && (
                    <div className="px-8 py-4 bg-blue-50/50 rounded-3xl border border-blue-100 shadow-sm">
                      <span className="text-[10px] font-black text-blue-400 block uppercase tracking-[0.2em] mb-1">Root Cause</span>
                      <span className="text-2xl font-black text-blue-600">{selectedWord.cause}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-16 bg-neutral-900 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
                <span className="text-[10px] font-black text-neutral-500 block uppercase tracking-[0.3em] mb-6">Accident Description</span>
                <p className="text-2xl text-white leading-[1.7] font-medium break-keep tracking-tight">
                  {selectedWord.content}
                </p>
              </div>

              <div className="mt-16 flex justify-end">
                <button 
                  onClick={() => setSelectedWord(null)}
                  className="px-12 py-6 bg-black text-white text-xl font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
                >
                  확인 및 닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
