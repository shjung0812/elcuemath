import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Video,
  Users,
  GraduationCap,
  Edit3,
  FileText,
  ExternalLink,
  Globe,
  Server,
  Sparkles,
  LayoutGrid,
  TrendingUp
} from 'lucide-react';

function Home() {
  const routes = [
    {
      title: 'Mentor Center (선생님 대시보드)',
      path: '/mentor',
      description: '실시간 세션 감독, 학생 학습 진행도 점검 및 캔버스 피드백 제어를 위한 교육자 통합 대시보드입니다.',
      icon: Users,
      color: 'from-indigo-500 to-purple-600',
      shadowColor: 'hover:shadow-indigo-500/20',
      badge: 'Teacher App'
    },
    {
      title: 'Student Center (학생 학습 캔버스)',
      path: '/student',
      description: '인터랙티브 캔버스를 활용한 문제 풀이 및 선생님과의 원격 화상 오디오 연결 학습 시스템입니다.',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
      shadowColor: 'hover:shadow-emerald-500/20',
      badge: 'Student App'
    },
    {
      title: 'Math CMS (교과 과정 및 문제 관리)',
      path: '/cms',
      description: '수학 교육과정 대단원/중단원 트리 탐색 및 문제 은행 데이터베이스를 연동 관리하는 핵심 관리 시스템입니다.',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-600',
      shadowColor: 'hover:shadow-blue-500/20',
      badge: 'Admin CMS'
    },
    {
      title: 'Editor Page (수식 및 문제 에디터)',
      path: '/editor',
      description: '풍부한 수학 수식 입력, 레이텍 렌더링, 그리기 기능 및 다양한 템플릿의 문항 저작용 편집기입니다.',
      icon: Edit3,
      color: 'from-rose-500 to-pink-600',
      shadowColor: 'hover:shadow-rose-500/20',
      badge: 'Author Tool'
    },
    {
      title: 'Quill Page (리치 텍스트 편집기)',
      path: '/quill',
      description: '블록 기반 리치 텍스트 작성 및 정밀 이미지 에디터를 지원하여 설명글 작성을 돕는 경량 편집 도구입니다.',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      shadowColor: 'hover:shadow-amber-500/20',
      badge: 'Editor Util'
    },
    {
      title: 'Mentor Call (실시간 원격 화상 세션)',
      path: '/mentor/call/test-student',
      description: '선택한 학생과의 실시간 WebRTC 기반 양방향 화상/음성 통화 및 캔버스 동기화용 원격 개별 세션입니다.',
      icon: Video,
      color: 'from-fuchsia-500 to-pink-600',
      shadowColor: 'hover:shadow-fuchsia-500/20',
      badge: 'WebRTC Popup'
    }
  ];

  const apiHost = import.meta.env.VITE_API_HOST || 'https://ai.elcue.org';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-950/20 blur-[100px] pointer-events-none" />

      {/* Main Header Container */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutGrid className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ELCUE MATH
              </h1>
              <p className="text-[10px] text-indigo-400 font-medium tracking-widest uppercase">
                Integrated Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <Globe className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Basename: <strong className="text-indigo-300 font-semibold">/renv</strong></span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-900 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="h-3 w-3" />
            <span>엘큐 수학 개발 통합 포털</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            플랫폼 모든 서비스로의 <br className="md:hidden" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              신속하고 통합된 연결
            </span>
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            리액트 어플리케이션 내의 다양한 교육자 및 학습자 전용 웹 모듈, 문항 저작 툴 및 관리자 도구 모음입니다.
            각 카드의 연결을 통해 새 탭이나 SPA 내부 페이지로 이동할 수 있습니다.
          </p>
        </div>

        {/* Dynamic Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {routes.map((route, index) => {
            const Icon = route.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700/50 hover:bg-slate-900/90 shadow-xl ${route.shadowColor}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${route.color} flex items-center justify-center shadow-md shadow-black/40`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                      {route.badge}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors duration-200 mb-2">
                    {route.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {route.description}
                  </p>
                </div>

                {/* Navigation CTA Buttons */}
                <div className="space-y-2 mt-auto">
                  {/* SPA Internal Link */}
                  <Link
                    to={route.path}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md shadow-indigo-600/10 group-hover:shadow-indigo-600/20"
                  >
                    <span>이동하기 (SPA)</span>
                  </Link>

                  {/* External Tab Link */}
                  <a
                    href={`/renv${route.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 border border-slate-700/50 transition-all duration-200"
                  >
                    <span>새 창으로 열기</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Environment Info Panel */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-slate-600" />
            <span>
              Connected API Host:{' '}
              <strong className="text-slate-400 font-semibold">{apiHost}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
              <span>Version: <strong className="text-slate-400 font-semibold">1.0.0 (Production)</strong></span>
            </span>
            <span>&copy; {new Date().getFullYear()} Elcue Math. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;