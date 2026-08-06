import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCopy,
  ExternalLink,
  GraduationCap,
  Heart,
  Home,
  Languages,
  Menu,
  MessageCircle,
  School,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  activities,
  phrases,
  questions,
  type Activity,
  type Language,
} from "./data/content";
import { Button, Card, Chip } from "./components/ui";
import { cn } from "./lib/utils";
import logo from "./assets/linguaflow-family-logo.png";
import familyTutoring from "./assets/family/family-tutoring.jpg";
import academySource from "../content/parent-academy-lessons.md?raw";
import academyFamilyLanguage from "./assets/academy/family-language.jpg";
import academyThinking from "./assets/academy/thinking.jpg";
import academyReading from "./assets/academy/reading.jpg";
import academyConfidence from "./assets/academy/confidence.jpg";
import academyProgress from "./assets/academy/progress.jpg";
import academySchool from "./assets/academy/school.jpg";

type Page =
  | "today"
  | "reading"
  | "writing"
  | "activities"
  | "understand"
  | "academy"
  | "ask"
  | "school"
  | "weekly"
  | "about"
  | "privacy";
const labels: Record<Language, Record<string, string>> = {
  en: {
    today: "Today",
    reading: "Help with reading",
    writing: "Help with writing",
    activities: "Activities",
    understand: "Understand my child",
    academy: "Parent Academy",
    ask: "Find an answer",
    school: "School connection",
    welcome: "One helpful idea for this week.",
    welcomeSub:
      "A small, practical way to support your child—while keeping your home language strong.",
    try: "This week",
    minutes: "minutes",
    start: "Try this activity",
    why: "Why it helps",
    whyText:
      "Everyday conversation builds vocabulary, confidence, and connection. There is no need to correct every word.",
    explore: "Explore activities",
    all: "All",
    search: "Search activities",
    common: "Common parent questions",
    wida: "WIDA, in plain language",
    copy: "Copy phrase",
    copied: "Copied",
    askTitle: "Find a clear answer.",
    askSub:
      "Explore expert-reviewed guidance for common questions from multilingual families.",
    askPlaceholder: "Try “Why is my child quiet at school?”",
    find: "Find an answer",
    schoolTitle: "Feel ready for the next school conversation.",
    schoolSub:
      "Useful questions and phrases for talking with your child’s teacher.",
    meeting: "Questions for a teacher meeting",
    language: "Language",
  },
  zh: {
    today: "今天",
    reading: "阅读支持",
    writing: "写作支持",
    activities: "亲子活动",
    understand: "了解我的孩子",
    academy: "家长课堂",
    ask: "查找答案",
    school: "学校沟通",
    welcome: "本周一个实用想法。",
    welcomeSub: "用一个简单可行的方法支持孩子，同时保持家庭语言的力量。",
    try: "本周推荐",
    minutes: "分钟",
    start: "试试这个活动",
    why: "为什么有帮助",
    whyText: "日常对话可以培养词汇、信心和亲子连接。不需要纠正每一个词。",
    explore: "探索更多活动",
    all: "全部",
    search: "搜索活动",
    common: "家长常见问题",
    wida: "用简单的话了解 WIDA",
    copy: "复制短语",
    copied: "已复制",
    askTitle: "查找清晰答案。",
    askSub: "浏览针对多语言家庭常见问题、经专家审核的指导。",
    askPlaceholder: "例如：“为什么孩子在学校很安静？”",
    find: "寻找答案",
    schoolTitle: "更有准备地与学校沟通。",
    schoolSub: "与孩子老师交流时可以使用的问题和短语。",
    meeting: "家长会可以问的问题",
    language: "语言",
  },
  ko: {
    today: "오늘",
    reading: "읽기 도움",
    writing: "쓰기 도움",
    activities: "가족 활동",
    understand: "우리 아이 이해하기",
    academy: "부모 아카데미",
    ask: "답변 찾기",
    school: "학교와 소통하기",
    welcome: "이번 주에 도움 되는 생각 하나.",
    welcomeSub:
      "가정의 언어를 소중히 지키며 아이를 돕는 작고 실용적인 방법이에요.",
    try: "이번 주",
    minutes: "분",
    start: "이 활동 해보기",
    why: "왜 도움이 되나요?",
    whyText:
      "일상 대화는 어휘, 자신감, 유대감을 키웁니다. 모든 단어를 고칠 필요는 없어요.",
    explore: "활동 둘러보기",
    all: "전체",
    search: "활동 검색",
    common: "부모님이 자주 묻는 질문",
    wida: "쉬운 말로 보는 WIDA",
    copy: "문구 복사",
    copied: "복사됨",
    askTitle: "명확한 답변을 찾아보세요.",
    askSub: "다언어 가정의 일반적인 질문에 대한 전문가 검토 안내를 살펴보세요.",
    askPlaceholder: "예: “왜 아이가 학교에서 말이 없나요?”",
    find: "답변 찾기",
    schoolTitle: "학교와의 다음 대화를 준비하세요.",
    schoolSub: "선생님과 이야기할 때 유용한 질문과 문구입니다.",
    meeting: "선생님과 만날 때 물어볼 질문",
    language: "언어",
  },
};
const nav = [
  { id: "today", icon: Home },
  { id: "activities", icon: Sparkles },
  { id: "understand", icon: Heart },
  { id: "academy", icon: GraduationCap },
  { id: "school", icon: School },
] as const;
const languageNames = { en: "English", zh: "中文", ko: "한국어" };

type AcademyLesson = {
  number: number;
  title: string;
  website: string;
  newsletter: string;
};
const academyLessons: AcademyLesson[] = academySource
  .split(/\n(?=# (?:Optional )?Lesson \d+:)/)
  .map((block) => {
    const heading = block.match(/^# (?:Optional )?Lesson (\d+): (.+)$/m);
    const website = block
      .match(/## Website Lesson\n([\s\S]*?)\n---\n\n## Newsletter Version/)?.[1]
      ?.trim();
    const newsletter = block
      .match(/## Newsletter Version\n([\s\S]*?)(?:\n---|$)/)?.[1]
      ?.trim();
    return heading && website
      ? {
          number: Number(heading[1]),
          title: heading[2],
          website,
          newsletter: newsletter ?? "",
        }
      : null;
  })
  .filter((lesson): lesson is AcademyLesson => lesson !== null);
const academyPhotos = [
  {
    image: academyFamilyLanguage,
    alt: "An Asian family supporting a school-age child at home",
  },
  {
    image: academyThinking,
    alt: "Two Asian school-age children writing together",
  },
  {
    image: activities.find((activity) => activity.id === "echo-reading")!.image,
    alt: activities.find((activity) => activity.id === "echo-reading")!
      .imageAlt.en,
  },
  {
    image: academyReading,
    alt: "An Asian mother supporting her daughter with a book",
  },
  {
    image: activities.find((activity) => activity.id === "kitchen-describer")!
      .image,
    alt: activities.find((activity) => activity.id === "kitchen-describer")!
      .imageAlt.en,
  },
  {
    image: academyConfidence,
    alt: "An Asian school-age child writing creatively beside a ukulele",
  },
  {
    image: academyProgress,
    alt: "An Asian family talking together around schoolwork",
  },
  {
    image: activities.find((activity) => activity.id === "family-journal")!
      .image,
    alt: activities.find((activity) => activity.id === "family-journal")!
      .imageAlt.en,
  },
  {
    image: activities.find((activity) => activity.id === "compare-coverage")!
      .image,
    alt: activities.find((activity) => activity.id === "compare-coverage")!
      .imageAlt.en,
  },
  {
    image: academySchool,
    alt: "An Asian father encouraging his daughter during homework",
  },
  {
    image: activities.find((activity) => activity.id === "teach-rules")!.image,
    alt: activities.find((activity) => activity.id === "teach-rules")!.imageAlt
      .en,
  },
  {
    image: activities.find((activity) => activity.id === "picture-talk")!.image,
    alt: activities.find((activity) => activity.id === "picture-talk")!
      .imageAlt.en,
  },
];
const academyPhotoForLesson = (number: number) =>
  academyPhotos[number - 1] ?? academyPhotos[0];

function readRoute() {
  const parts = window.location.hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean);
  if (parts[0] === "activity")
    return {
      page: "activities" as Page,
      activityId: parts[1] ?? null,
      lesson: 0,
    };
  if (parts[0] === "lesson")
    return {
      page: "academy" as Page,
      activityId: null,
      lesson: Number(parts[1]) || 0,
    };
  if (parts[0] === "weekly")
    return { page: "weekly" as Page, activityId: null, lesson: 0 };
  if (parts[0] === "ask")
    return { page: "understand" as Page, activityId: null, lesson: 0 };
  const page = (
    [
      "today",
      "reading",
      "writing",
      "activities",
      "understand",
      "academy",
      "school",
      "about",
      "privacy",
    ].includes(parts[0])
      ? parts[0]
      : "today"
  ) as Page;
  return { page, activityId: null, lesson: 0 };
}

const routeForPage = (page: Page) =>
  page === "today" ? "#/today" : `#/${page}`;

function App() {
  const initialRoute = readRoute();
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem("lf-language") as Language) || "en",
  );
  const [preferredAge, setPreferredAge] = useState(
    () => localStorage.getItem("lf-age") || "all",
  );
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<Activity | null>(
    () => activities.find((a) => a.id === initialRoute.activityId) || null,
  );
  const [lessonNumber, setLessonNumber] = useState(initialRoute.lesson);
  const mainRef = useRef<HTMLElement>(null);
  const t = labels[lang];
  const applyRoute = () => {
    const route = readRoute();
    setPage(route.page);
    setSelected(activities.find((a) => a.id === route.activityId) || null);
    setLessonNumber(route.lesson);
    setMenu(false);
    window.scrollTo(0, 0);
    setTimeout(() => mainRef.current?.focus(), 0);
  };
  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, "", "#/today");
    window.addEventListener("hashchange", applyRoute);
    return () => window.removeEventListener("hashchange", applyRoute);
  }, []);
  useEffect(() => {
    localStorage.setItem("lf-language", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.title = `${t[page] ?? "LinguaFlow Family"} · LinguaFlow Family`;
  }, [lang, page, t]);
  useEffect(() => localStorage.setItem("lf-age", preferredAge), [preferredAge]);
  const navigate = (hash: string) => {
    if (window.location.hash === hash) applyRoute();
    else window.location.hash = hash;
  };
  const go = (next: Page) => navigate(routeForPage(next));
  const selectActivity = (activity: Activity) =>
    navigate(`#/activity/${activity.id}`);
  const openLesson = (number: number) => navigate(`#/lesson/${number}`);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#f7f8fc]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:h-20 md:px-8">
          <button
            onClick={() => go("today")}
            className="flex items-center gap-2.5 rounded-xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
            aria-label="LinguaFlow Family home"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-white shadow-[0_7px_18px_rgba(60,132,205,.16)]">
              <img src={logo} alt="" className="size-10 object-contain" />
            </span>
            <span className="hidden font-extrabold leading-tight text-stone-800 sm:block">
              LinguaFlow
              <br />
              <span className="lf-gradient-text">Family</span>
            </span>
          </button>
          <nav
            className="ml-4 hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {nav.map(({ id, icon: Icon }) => (
              <a
                key={id}
                href={routeForPage(id)}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20",
                  page === id
                    ? "bg-teal-50 text-teal-800"
                    : "text-stone-600 hover:bg-stone-100",
                )}
                aria-current={page === id ? "page" : undefined}
              >
                <Icon size={17} />
                {t[id]}
              </a>
            ))}
          </nav>
          <label className="ml-auto flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 shadow-sm">
            <Languages size={17} className="text-teal-700" />
            <span className="sr-only">{t.language}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="min-h-10 appearance-none rounded-lg bg-transparent pr-5 text-sm font-bold outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
              aria-label={t.language}
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="-ml-6 pointer-events-none" />
          </label>
          <button
            onClick={() => setMenu(!menu)}
            className="grid size-11 place-items-center rounded-full hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20 lg:hidden"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav
            className="border-t border-stone-200 bg-white p-3 lg:hidden"
            aria-label="Mobile navigation"
          >
            {nav.map(({ id, icon: Icon }) => (
              <a
                key={id}
                href={routeForPage(id)}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-left font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20",
                  page === id ? "bg-teal-50 text-teal-800" : "text-stone-700",
                )}
                aria-current={page === id ? "page" : undefined}
              >
                <Icon size={19} />
                {t[id]}
              </a>
            ))}
          </nav>
        )}
      </header>
      <main ref={mainRef} tabIndex={-1} className="outline-none">
        {selected ? (
          <ActivityDetail
            activity={selected}
            lang={lang}
            t={t}
            back={() => go("activities")}
            openLesson={openLesson}
          />
        ) : (
          <PageContent
            page={page}
            lang={lang}
            t={t}
            go={go}
            select={selectActivity}
            preferredAge={preferredAge}
            setPreferredAge={setPreferredAge}
            lessonNumber={lessonNumber}
            openLesson={openLesson}
          />
        )}
      </main>
      <footer className="border-t border-stone-200 bg-white px-5 py-10 text-center text-sm text-stone-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 lg:flex-row">
          <span className="font-bold text-stone-700">
            LinguaFlow <span className="lf-gradient-text">Family</span>
          </span>
          <span>
            Home language is a strength. · 家庭语言是一种力量。 · 가정의 언어는
            힘입니다.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#/about" className="min-h-11 py-3 font-bold text-teal-700">
              {lang === "en"
                ? "About & trust"
                : lang === "zh"
                  ? "关于与内容审核"
                  : "소개 및 신뢰"}
            </a>
            <a
              href="#/privacy"
              className="min-h-11 py-3 font-bold text-teal-700"
            >
              {lang === "en" ? "Privacy" : lang === "zh" ? "隐私" : "개인정보"}
            </a>
            <a
              href="https://www.mymultilingualfamily.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 py-3 font-bold text-teal-700 hover:text-teal-800"
            >
              {lang === "en"
                ? "Full family guide"
                : lang === "zh"
                  ? "完整家庭指南"
                  : "전체 가족 가이드"}
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PageContent({
  page,
  lang,
  t,
  go,
  select,
  preferredAge,
  setPreferredAge,
  lessonNumber,
  openLesson,
}: {
  page: Page;
  lang: Language;
  t: Record<string, string>;
  go: (p: Page) => void;
  select: (a: Activity) => void;
  preferredAge: string;
  setPreferredAge: (age: string) => void;
  lessonNumber: number;
  openLesson: (n: number) => void;
}) {
  if (page === "today")
    return (
      <LaunchToday
        lang={lang}
        t={t}
        go={go}
        select={select}
        preferredAge={preferredAge}
        setPreferredAge={setPreferredAge}
      />
    );
  if (page === "reading")
    return <LiteracyPath kind="reading" lang={lang} select={select} go={go} />;
  if (page === "writing")
    return <LiteracyPath kind="writing" lang={lang} select={select} go={go} />;
  if (page === "activities")
    return (
      <Activities
        lang={lang}
        t={t}
        select={select}
        preferredAge={preferredAge}
        setPreferredAge={setPreferredAge}
      />
    );
  if (page === "understand") return <Understand lang={lang} t={t} />;
  if (page === "academy")
    return (
      <Academy
        lang={lang}
        t={t}
        selectedNumber={lessonNumber}
        openLesson={openLesson}
      />
    );
  if (page === "ask") return <FindAnswers lang={lang} t={t} />;
  if (page === "school") return <SchoolPage lang={lang} t={t} />;
  if (page === "weekly")
    return (
      <WeeklyFeature lang={lang} select={select} openLesson={openLesson} />
    );
  return <TrustPage lang={lang} privacy={page === "privacy"} />;
}

function LiteracyPath({
  kind,
  lang,
  select,
  go,
}: {
  kind: "reading" | "writing";
  lang: Language;
  select: (a: Activity) => void;
  go: (p: Page) => void;
}) {
  const writing = kind === "writing";
  const activity = activities.find((item) =>
    item.id === (writing ? "family-journal" : "picture-walk"),
  )!;
  const copy = {
    eyebrow:
      lang === "en"
        ? writing
          ? "Help with writing"
          : "Help with reading"
        : lang === "zh"
          ? writing
            ? "写作支持"
            : "阅读支持"
          : writing
            ? "쓰기 도움"
            : "읽기 도움",
    title:
      lang === "en"
        ? writing
          ? "Good writing can begin with talking."
          : "Start with one good conversation."
        : lang === "zh"
          ? writing
            ? "好的写作可以从说一说开始。"
            : "从一次有意义的对话开始。"
          : writing
            ? "좋은 글쓰기는 말하기에서 시작할 수 있어요."
            : "좋은 대화 하나로 시작하세요.",
    subtitle:
      lang === "en"
        ? writing
          ? "You do not need to correct every mistake. Help your child talk, draw, and discover what they want to say before worrying about perfect English."
          : "You do not have to teach English. Talking about a book in the language that feels natural helps your child understand and enjoy reading."
        : lang === "zh"
          ? writing
            ? "您不需要纠正每一个错误。先帮助孩子说一说、画一画，找到自己想表达的内容，再考虑英语是否完美。"
            : "您不需要教英语。用最自然的语言聊一聊书，可以帮助孩子理解阅读并享受阅读。"
          : writing
            ? "모든 실수를 고칠 필요는 없어요. 완벽한 영어보다 먼저 말하고, 그리고, 표현할 생각을 찾도록 도와주세요."
            : "영어를 가르칠 필요는 없어요. 가장 자연스러운 언어로 책 이야기를 나누면 아이가 읽기를 이해하고 즐기는 데 도움이 돼요.",
    start:
      lang === "en"
        ? "Start here · Ages 6–8"
        : lang === "zh"
          ? "从这里开始 · 6–8 岁"
          : "여기서 시작 · 6–8세",
    promise:
      lang === "en"
        ? writing
          ? "Let your child tell one small moment aloud, draw it, and add a few words. The idea matters more than perfect spelling."
          : "Before reading the words, explore the pictures together. Five thoughtful minutes is enough."
        : lang === "zh"
          ? writing
            ? "让孩子先说出一个小瞬间，再画下来并加上几个词。想法比拼写完美更重要。"
            : "读文字之前，先一起看看图画。认真陪伴五分钟就已经足够。"
          : writing
            ? "작은 순간을 먼저 말하고, 그림으로 그리고, 단어 몇 개를 더해 보세요. 완벽한 철자보다 생각이 중요해요."
            : "글을 읽기 전에 그림을 함께 살펴보세요. 마음을 나눈 5분이면 충분해요.",
    button:
      lang === "en"
        ? writing
          ? "Try the family journal"
          : "Try the picture walk"
        : lang === "zh"
          ? writing
            ? "试试家庭日记"
            : "试试阅读前看图"
          : writing
            ? "가족 일기 해보기"
            : "그림 산책 해보기",
    reassurance:
      lang === "en"
        ? writing
          ? "Your child can plan and talk in your home language, then write in English, the home language, or both. Rich thinking comes first."
          : "Your home language is not a workaround. It is the language your child can use to think, wonder, and connect."
        : lang === "zh"
          ? writing
            ? "孩子可以先用家庭语言构思和表达，再用英语、家庭语言或两种语言来写。丰富的思考最重要。"
            : "家庭语言不是替代方案，而是孩子用来思考、好奇和建立联系的语言。"
          : writing
            ? "가족 언어로 계획하고 말한 뒤 영어, 가족 언어, 또는 두 언어로 쓸 수 있어요. 풍부한 생각이 먼저예요."
            : "가족 언어는 임시방편이 아니에요. 아이가 생각하고 궁금해하고 연결하는 언어예요.",
    all:
      lang === "en"
        ? "Explore all family activities"
        : lang === "zh"
          ? "浏览所有亲子活动"
          : "모든 가족 활동 보기",
  };
  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
    >
      <div className="grid items-stretch gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="overflow-hidden border-teal-100 bg-white">
          <img
            src={activity.image}
            alt={activity.imageAlt[lang]}
            className="h-56 w-full object-cover md:h-72"
          />
          <div className="p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[.14em] text-teal-700">
              {copy.start}
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold text-stone-800">
              {activity.title[lang]}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-stone-600">
              {copy.promise}
            </p>
            <Button className="mt-6" onClick={() => select(activity)}>
              {copy.button}
              <ArrowRight size={18} />
            </Button>
          </div>
        </Card>
        <div className="flex flex-col justify-between rounded-[2rem] bg-teal-800 p-6 text-white shadow-sm md:p-8">
          <div>
            <span className="grid size-12 place-items-center rounded-2xl bg-white/12">
              <Languages size={23} />
            </span>
            <h2 className="font-display mt-6 text-3xl font-bold">
              {lang === "en"
                ? writing
                  ? "Ideas first. Correctness can come later."
                  : "Use the language that brings out the best ideas."
                : lang === "zh"
                  ? writing
                    ? "先有想法，再考虑是否正确。"
                    : "使用最能表达丰富想法的语言。"
                  : writing
                    ? "생각이 먼저예요. 정확함은 나중에 다듬어도 돼요."
                    : "가장 풍부한 생각이 나오는 언어를 사용하세요."}
            </h2>
            <p className="mt-4 leading-7 text-teal-50">{copy.reassurance}</p>
          </div>
          <button
            onClick={() => go("activities")}
            className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            {copy.all}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function Today({
  lang,
  t,
  go,
  select,
}: {
  lang: Language;
  t: Record<string, string>;
  go: (p: Page) => void;
  select: (a: Activity) => void;
}) {
  const featured = activities[1];
  return (
    <>
      <section className="overflow-hidden px-4 pb-12 pt-10 md:px-8 md:pb-20 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <Chip className="mb-5 bg-teal-50 text-teal-800">
              <Sparkles size={14} className="mr-1.5" />
              {t.try}
            </Chip>
            <h1 className="font-display max-w-3xl text-balance text-4xl font-bold leading-[1.04] tracking-[-.035em] text-stone-800 md:text-6xl">
              {t.welcome}
            </h1>
            <p className="mt-5 max-w-2xl text-balance text-lg leading-8 text-stone-600 md:text-xl">
              {t.welcomeSub}
            </p>
          </div>
          <Card className="lf-hero relative overflow-hidden border-0 text-white shadow-[0_25px_60px_rgba(62,91,174,.24)]">
            <div className="relative h-48 overflow-hidden md:h-56">
              <img
                src={featured.image}
                alt={featured.imageAlt[lang]}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f638d]/80 via-transparent to-transparent" />
              <Chip className="absolute right-5 top-5 bg-white/90 text-stone-700 shadow-sm">
                {featured.time}
              </Chip>
            </div>
            <div className="relative p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-[.14em] text-white/75">
                {t.try}
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold">
                {featured.title[lang]}
              </h2>
              <p className="mt-3 leading-7 text-white/85">
                {featured.summary[lang]}
              </p>
              <Button
                onClick={() => select(featured)}
                className="mt-7 w-full bg-white !bg-none text-stone-800 shadow-sm hover:bg-white/90"
              >
                {t.start}
                <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        </div>
      </section>
      <section className="px-4 pb-12 md:px-8 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[.14em] text-teal-700">
            {lang === "en"
              ? "Start with what you need"
              : lang === "zh"
                ? "从您现在需要的开始"
                : "지금 필요한 것부터 시작하세요"}
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold text-stone-800">
            {lang === "en"
              ? "What would help today?"
              : lang === "zh"
                ? "今天什么最能帮助您？"
                : "오늘 어떤 도움이 필요하신가요?"}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <button
              onClick={() => select(featured)}
              className="group flex min-h-24 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <Sparkles size={21} />
              </span>
              <span className="flex-1">
                <strong className="block text-stone-800">
                  {lang === "en"
                    ? "Something to do tonight"
                    : lang === "zh"
                      ? "今晚可以做的活动"
                      : "오늘 저녁에 할 활동"}
                </strong>
                <span className="mt-1 block text-sm text-stone-500">
                  {t.try}
                </span>
              </span>
              <ChevronRight className="text-stone-300 transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => go("ask")}
              className="group flex min-h-24 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <MessageCircle size={21} />
              </span>
              <span className="flex-1">
                <strong className="block text-stone-800">
                  {lang === "en"
                    ? "A question about my child"
                    : lang === "zh"
                      ? "关于孩子的问题"
                      : "아이에 관한 질문"}
                </strong>
                <span className="mt-1 block text-sm text-stone-500">
                  {t.ask}
                </span>
              </span>
              <ChevronRight className="text-stone-300 transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => go("school")}
              className="group flex min-h-24 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <School size={21} />
              </span>
              <span className="flex-1">
                <strong className="block text-stone-800">
                  {lang === "en"
                    ? "Help talking with school"
                    : lang === "zh"
                      ? "帮助我与学校沟通"
                      : "학교와 대화하는 데 도움"}
                </strong>
                <span className="mt-1 block text-sm text-stone-500">
                  {t.school}
                </span>
              </span>
              <ChevronRight className="text-stone-300 transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
      <section className="px-4 pb-12 md:px-8 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 shadow-[0_18px_50px_rgba(52,63,99,.08)] backdrop-blur md:grid-cols-[.9fr_1.1fr]">
            <div className="grid min-h-64 grid-cols-2 gap-1 bg-stone-100 md:min-h-72">
              <img
                src={familyTutoring}
                alt={
                  lang === "en"
                    ? "A school-age child learning with a trusted adult at home"
                    : lang === "zh"
                      ? "一名学龄儿童在家与可信赖的成年人一起学习"
                      : "학령기 아이가 집에서 믿을 수 있는 어른과 함께 배우는 모습"
                }
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <img
                src={activities[2].image}
                alt={activities[2].imageAlt[lang]}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="text-sm font-black uppercase tracking-[.14em] text-teal-700">
                {lang === "en"
                  ? "Every family belongs"
                  : lang === "zh"
                    ? "每个家庭都属于这里"
                    : "모든 가족을 위한 공간"}
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-stone-800 md:text-4xl">
                {lang === "en"
                  ? "Your language. Your stories. Your strength."
                  : lang === "zh"
                    ? "您的语言、您的故事、您的力量。"
                    : "우리의 언어, 이야기, 그리고 힘."}
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-stone-600">
                {lang === "en"
                  ? "Children grow when families talk, read, laugh, and wonder together—in any language. LinguaFlow Family starts with what you already do well."
                  : lang === "zh"
                    ? "当家人用任何语言一起交谈、阅读、欢笑和探索时，孩子都会成长。LinguaFlow Family 从您已经做得很好的事情开始。"
                    : "가족이 어떤 언어로든 함께 이야기하고, 읽고, 웃고, 궁금해할 때 아이는 자랍니다. LinguaFlow Family는 이미 잘하고 계신 것에서 시작해요."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-stone-200/70 bg-white/55 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="font-bold text-teal-700">10–15 {t.minutes}</p>
              <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-stone-800">
                {t.explore}
              </h2>
            </div>
            <button
              onClick={() => go("activities")}
              className="hidden items-center gap-1 font-bold text-teal-700 sm:flex"
            >
              {t.all}
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {activities.slice(1, 4).map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                lang={lang}
                onClick={() => select(a)}
              />
            ))}
          </div>
          <Button
            onClick={() => go("activities")}
            className="mt-6 w-full sm:hidden"
          >
            {t.explore}
          </Button>
        </div>
      </section>
    </>
  );
}

function LaunchToday({
  lang,
  t,
  go,
  select,
  preferredAge,
  setPreferredAge,
}: {
  lang: Language;
  t: Record<string, string>;
  go: (p: Page) => void;
  select: (a: Activity) => void;
  preferredAge: string;
  setPreferredAge: (age: string) => void;
}) {
  const activityByAge: Record<string, string> = {
    "6–8": "picture-talk",
    "9–11": "explain-it",
    "12–14": "teach-rules",
  };
  const featured =
    activities.find(
      (a) => a.id === (activityByAge[preferredAge] || "explain-it"),
    ) ?? activities[0];
  const ageLabel =
    lang === "en"
      ? "Your child’s age"
      : lang === "zh"
        ? "孩子的年龄"
        : "아이의 나이";
  return (
    <>
      <section className="px-4 pb-10 pt-10 md:px-8 md:pb-16 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_.95fr]">
          <div>
            <Chip className="mb-5 bg-teal-50 text-teal-800">
              <Sparkles size={14} className="mr-1.5" />
              {lang === "en"
                ? "Free support for multilingual families"
                : lang === "zh"
                  ? "为多语言家庭提供的免费支持"
                  : "다언어 가정을 위한 무료 지원"}
            </Chip>
            <h1 className="font-display max-w-3xl text-balance text-4xl font-bold leading-[1.04] tracking-[-.035em] text-stone-800 md:text-6xl">
              {lang === "en"
                ? "Help your child grow—without leaving your home language behind."
                : lang === "zh"
                  ? "帮助孩子成长，同时珍惜您的家庭语言。"
                  : "가족의 언어를 지키며 아이의 성장을 도와주세요."}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600 md:text-xl">
              {lang === "en"
                ? "Practical activities, clear guidance, and help with school conversations—for families of children ages 6–14."
                : lang === "zh"
                  ? "为 6–14 岁孩子的家庭提供实用活动、清晰指导和学校沟通支持。"
                  : "6–14세 자녀를 둔 가족을 위한 실용적인 활동, 쉬운 안내, 학교 대화 도움을 만나보세요."}
            </p>
            <button
              onClick={() => go("activities")}
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-stone-800 px-5 font-black text-white shadow-sm transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/25"
            >
              {lang === "en"
                ? "Find an activity for tonight"
                : lang === "zh"
                  ? "寻找今晚可以做的活动"
                  : "오늘 저녁 활동 찾기"}
              <ArrowRight size={18} />
            </button>
          </div>
          <Card className="overflow-hidden">
            <img
              src={featured.image}
              alt={featured.imageAlt[lang]}
              className="h-52 w-full object-cover"
            />
            <div className="p-6 md:p-7">
              <div className="flex flex-wrap gap-2">
                <Chip>{featured.ages.join(", ")}</Chip>
                <Chip>{featured.time}</Chip>
              </div>
              <h2 className="font-display mt-4 text-3xl font-bold text-stone-800">
                {featured.title[lang]}
              </h2>
              <p className="mt-3 leading-7 text-stone-600">
                {featured.summary[lang]}
              </p>
              <Button onClick={() => select(featured)} className="mt-6">
                {t.start}
                <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        </div>
      </section>
      <section className="px-4 pb-10 md:px-8 md:pb-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:flex md:items-center md:justify-between md:p-6">
          <div>
            <p className="font-black text-stone-800">{ageLabel}</p>
            <p className="mt-1 text-sm text-stone-500">
              {lang === "en"
                ? "Choose once. We will remember on this device."
                : lang === "zh"
                  ? "只需选择一次，我们会在此设备上记住。"
                  : "한 번만 선택하면 이 기기에 기억해 둘게요."}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
            {["6–8", "9–11", "12–14"].map((age) => (
              <button
                key={age}
                onClick={() => setPreferredAge(age)}
                className={cn(
                  "min-h-11 rounded-full border px-5 font-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20",
                  preferredAge === age
                    ? "border-teal-700 bg-teal-50 text-teal-800"
                    : "border-stone-200 bg-white text-stone-600 hover:border-teal-300",
                )}
                aria-pressed={preferredAge === age}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-stone-200/70 bg-white/55 px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[.14em] text-teal-700">
            {lang === "en"
              ? "Start with what you need"
              : lang === "zh"
                ? "从您需要的开始"
                : "필요한 것부터 시작하세요"}
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold text-stone-800">
            {lang === "en"
              ? "How can we help today?"
              : lang === "zh"
                ? "今天我们能如何帮助您？"
                : "오늘 어떤 도움을 드릴까요?"}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <PathButton
              icon={BookOpen}
              title={
                lang === "en"
                  ? "Help with reading"
                  : lang === "zh"
                    ? "帮助孩子阅读"
                    : "읽기 도와주기"
              }
              detail={
                lang === "en"
                  ? "Start with ages 6–8"
                  : lang === "zh"
                    ? "从 6–8 岁开始"
                    : "6–8세부터 시작"
              }
              onClick={() => go("reading")}
            />
            <PathButton
              icon={GraduationCap}
              title={
                lang === "en"
                  ? "Help with writing"
                  : lang === "zh"
                    ? "帮助孩子写作"
                    : "쓰기 도와주기"
              }
              detail={
                lang === "en"
                  ? "Start with ages 6–8"
                  : lang === "zh"
                    ? "从 6–8 岁开始"
                    : "6–8세부터 시작"
              }
              onClick={() => go("writing")}
            />
            <PathButton
              icon={Heart}
              title={
                lang === "en"
                  ? "Understand my child"
                  : lang === "zh"
                    ? "了解我的孩子"
                    : "우리 아이 이해하기"
              }
              detail={t.understand}
              onClick={() => go("understand")}
            />
            <PathButton
              icon={School}
              title={
                lang === "en"
                  ? "Prepare for school"
                  : lang === "zh"
                    ? "准备学校沟通"
                    : "학교 대화 준비하기"
              }
              detail={t.school}
              onClick={() => go("school")}
            />
          </div>
        </div>
      </section>
      <section className="px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-5 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr_.9fr] md:p-9">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-teal-700">
              {lang === "en"
                ? "Made to feel safe and useful"
                : lang === "zh"
                  ? "安心、实用的家庭支持"
                  : "안심하고 쓸 수 있는 실용적인 도움"}
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold text-stone-800">
              {lang === "en"
                ? "No account. No judgment. No need for perfect English."
                : lang === "zh"
                  ? "无需账户，不作评判，也不需要完美的英语。"
                  : "계정도, 평가도, 완벽한 영어도 필요하지 않아요."}
            </h2>
            <div className="mt-5 grid gap-3 text-sm font-bold text-stone-600 sm:grid-cols-3">
              {[
                lang === "en" ? "Private by design" : lang === "zh" ? "隐私优先" : "개인정보 우선",
                lang === "en" ? "Research-informed" : lang === "zh" ? "以研究为基础" : "연구를 바탕으로",
                lang === "en" ? "Home language welcome" : lang === "zh" ? "欢迎使用家庭语言" : "가족 언어 환영",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check size={17} className="shrink-0 text-teal-700" />
                  {item}
                </span>
              ))}
            </div>
            <a
              href="#/about"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg font-black text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
            >
              {lang === "en" ? "How we create and review guidance" : lang === "zh" ? "了解内容如何创建与审核" : "콘텐츠 제작과 검토 방식"}
              <ArrowRight size={17} />
            </a>
          </div>
          <div className="rounded-2xl bg-stone-50 p-5 md:p-6">
            <p className="font-black text-stone-800">
              {lang === "en" ? "Two companion pieces" : lang === "zh" ? "两个相互配合的资源" : "서로 이어지는 두 가지 자료"}
            </p>
            <p className="mt-3 leading-7 text-stone-600">
              {lang === "en"
                ? "My Multilingual Family shares the why. LinguaFlow Family helps you put it into practice."
                : lang === "zh"
                  ? "My Multilingual Family 讲述为什么；LinguaFlow Family 帮助您付诸实践。"
                  : "My Multilingual Family는 이유를 나누고, LinguaFlow Family는 실천을 돕습니다."}
            </p>
            <a
              href="https://www.mymultilingualfamily.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg font-black text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
            >
              {lang === "en" ? "Read My Multilingual Family" : lang === "zh" ? "阅读 My Multilingual Family" : "My Multilingual Family 읽기"}
              <ExternalLink size={17} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function PathButton({
  icon: Icon,
  title,
  detail,
  onClick,
}: {
  icon: typeof Sparkles;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex min-h-24 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
        <Icon size={21} />
      </span>
      <span className="flex-1">
        <strong className="block text-stone-800">{title}</strong>
        <span className="mt-1 block text-sm text-stone-500">{detail}</span>
      </span>
      <ChevronRight className="text-stone-300" />
    </button>
  );
}

function ActivityCard({
  activity,
  lang,
  onClick,
}: {
  activity: Activity;
  lang: Language;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full overflow-hidden rounded-[1.5rem] border border-stone-200/80 bg-white/95 text-left shadow-[0_12px_36px_rgba(52,63,99,.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(52,63,99,.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
    >
      <div className="relative h-44 overflow-hidden bg-stone-100">
        <img
          src={activity.image}
          alt={activity.imageAlt[lang]}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-3 grid size-10 place-items-center rounded-xl bg-white/90 text-xl shadow-sm backdrop-blur"
        >
          {activity.icon}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black text-stone-800">
            {activity.title[lang]}
          </h3>
          <ArrowRight className="shrink-0 text-stone-300 transition group-hover:translate-x-1 group-hover:text-teal-700" />
        </div>
        <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">
          {activity.summary[lang]}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>{activity.ages.join(", ")}</Chip>
          <Chip>{activity.time}</Chip>
          <Chip className="bg-teal-50 text-teal-800">
            {activity.skill[lang]}
          </Chip>
        </div>
      </div>
    </button>
  );
}

function ActivityFilter({label,value,onChange,children}:{label:string;value:string;onChange:(value:string)=>void;children:React.ReactNode}) {
  return <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">{label}</span><select value={value} onChange={(event)=>onChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-stone-200 bg-white px-3 font-bold text-stone-700 outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20">{children}</select></label>
}

function Activities({
  lang,
  t,
  select,
  preferredAge,
  setPreferredAge,
}: {
  lang: Language;
  t: Record<string, string>;
  select: (a: Activity) => void;
  preferredAge: string;
  setPreferredAge: (age: string) => void;
}) {
  const [age, setAge] = useState(preferredAge);
  const [time, setTime] = useState("all");
  const [goal, setGoal] = useState("all");
  const copy = {
    age: lang === "en" ? "Age" : lang === "zh" ? "年龄" : "나이",
    time: lang === "en" ? "Time" : lang === "zh" ? "时间" : "시간",
    goal: lang === "en" ? "Goal" : lang === "zh" ? "目标" : "목표",
    all: lang === "en" ? "Any" : lang === "zh" ? "不限" : "전체",
    quick:
      lang === "en"
        ? "10 min or less"
        : lang === "zh"
          ? "10 分钟以内"
          : "10분 이내",
    talk:
      lang === "en"
        ? "Talk & explain"
        : lang === "zh"
          ? "交流与表达"
          : "대화와 설명",
    read:
      lang === "en"
        ? "Read & understand"
        : lang === "zh"
          ? "阅读与理解"
          : "읽기와 이해",
    write: lang === "en" ? "Write" : lang === "zh" ? "写作" : "쓰기",
    words:
      lang === "en" ? "Build vocabulary" : lang === "zh" ? "积累词汇" : "어휘",
    school:
      lang === "en"
        ? "School confidence"
        : lang === "zh"
          ? "学校信心"
          : "학교 자신감",
    identity:
      lang === "en"
        ? "Family language"
        : lang === "zh"
          ? "家庭语言"
          : "가족 언어",
    found:
      lang === "en"
        ? `${activities.length} carefully chosen activities`
        : lang === "zh"
          ? `${activities.length} 个精心挑选的活动`
          : `엄선한 활동 ${activities.length}개`,
    noMatch:
      lang === "en"
        ? "No activities match those choices. Try clearing one filter."
        : lang === "zh"
          ? "没有符合这些条件的活动，请尝试取消一个筛选条件。"
          : "조건에 맞는 활동이 없어요. 필터 하나를 해제해 보세요.",
    clear:
      lang === "en"
        ? "Clear filters"
        : lang === "zh"
          ? "清除筛选"
          : "필터 지우기",
    tonight:
      lang === "en"
        ? "Not sure? Try this tonight."
        : lang === "zh"
          ? "不知道选什么？今晚试试这个。"
          : "무엇을 고를지 모르겠다면 오늘 저녁 이것부터 해 보세요.",
    curated:
      lang === "en"
        ? "Start with one. Five or ten good minutes is enough."
        : lang === "zh"
          ? "从一个开始。认真陪伴五到十分钟就已经足够。"
          : "하나만 시작하세요. 좋은 5분이나 10분이면 충분해요.",
  };
  const list = useMemo(
    () =>
      activities.filter(
        (a) =>
          (age === "all" || a.ages.includes(age)) &&
          (time === "all" || a.minutes <= 10) &&
          (goal === "all" || a.goal === goal),
      ),
    [age, time, goal],
  );
  const featured =
    activities.find((a) => a.id === "picture-talk") ?? activities[0];
  return (
    <PageShell
      eyebrow={t.activities}
      title={
        lang === "en"
          ? "Easy ways to learn together."
          : lang === "zh"
            ? "一起学习，可以很简单。"
            : "함께 배우는 쉬운 방법이에요."
      }
      subtitle={
        lang === "en"
          ? "No worksheets. No English expertise needed. Choose one activity and make it your own."
          : lang === "zh"
            ? "不需要练习册，也不要求您精通英语。选择一个活动，用适合自己家庭的方式来做。"
            : "학습지도, 뛰어난 영어 실력도 필요 없어요. 활동 하나를 골라 우리 가족답게 해보세요."
      }
    >
      <Card className="mb-8 overflow-hidden border-teal-100 bg-teal-800 text-white">
        <div className="grid md:grid-cols-[.9fr_1.1fr]">
          <img
            src={featured.image}
            alt={featured.imageAlt[lang]}
            className="h-52 w-full object-cover md:h-full"
          />
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[.12em] text-teal-200">
              {copy.tonight}
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold">
              {featured.title[lang]}
            </h2>
            <p className="mt-3 leading-7 text-teal-50">
              {featured.summary[lang]}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip className="bg-white/12 text-white">{featured.ages[0]}</Chip>
              <Chip className="bg-white/12 text-white">{featured.time}</Chip>
            </div>
            <button
              onClick={() => select(featured)}
              className="mt-6 flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-5 font-black text-teal-800 transition hover:bg-teal-50"
            >
              {t.start}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </Card>
      <div className="mb-8 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <ActivityFilter
            label={copy.age}
            value={age}
            onChange={(value) => {
              setAge(value);
              setPreferredAge(value);
            }}
          >
            <option value="all">{copy.all}</option>
            <option value="6–8">6–8</option>
            <option value="9–11">9–11</option>
            <option value="12–14">12–14</option>
          </ActivityFilter>
          <ActivityFilter label={copy.time} value={time} onChange={setTime}>
            <option value="all">{copy.all}</option>
            <option value="quick">{copy.quick}</option>
          </ActivityFilter>
          <ActivityFilter label={copy.goal} value={goal} onChange={setGoal}>
            <option value="all">{copy.all}</option>
            <option value="talk">{copy.talk}</option>
            <option value="read">{copy.read}</option>
            <option value="write">{copy.write}</option>
            <option value="words">{copy.words}</option>
            <option value="school">{copy.school}</option>
            <option value="identity">{copy.identity}</option>
          </ActivityFilter>
        </div>
      </div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-800">{copy.found}</h2>
          <p className="mt-1 text-sm text-stone-500">{copy.curated}</p>
        </div>
        {(age !== "all" || time !== "all" || goal !== "all") && (
          <button
            onClick={() => {
              setAge("all");
              setTime("all");
              setGoal("all");
            }}
            className="min-h-11 shrink-0 font-bold text-teal-700"
          >
            {copy.clear}
          </button>
        )}
      </div>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              lang={lang}
              onClick={() => select(a)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-stone-600">{copy.noMatch}</Card>
      )}
    </PageShell>
  );
}

function ActivityDetail({
  activity,
  lang,
  t,
  back,
  openLesson,
}: {
  activity: Activity;
  lang: Language;
  t: Record<string, string>;
  back: () => void;
  openLesson: (n: number) => void;
}) {
  const c = {
    try:
      lang === "en"
        ? "Try saying"
        : lang === "zh"
          ? "可以这样说"
          : "이렇게 말해 보세요",
    home:
      lang === "en"
        ? "Your home language belongs here"
        : lang === "zh"
          ? "欢迎使用家庭语言"
          : "가족 언어를 사용하세요",
    adjust:
      lang === "en"
        ? "Make it fit your child"
        : lang === "zh"
          ? "根据孩子情况调整"
          : "아이에게 맞게 조절하세요",
    easier:
      lang === "en" ? "Make it easier" : lang === "zh" ? "更简单" : "더 쉽게",
    stretch:
      lang === "en"
        ? "Add a challenge"
        : lang === "zh"
          ? "增加挑战"
          : "도전 더하기",
    steps:
      lang === "en"
        ? "Three simple steps"
        : lang === "zh"
          ? "三个简单步骤"
          : "간단한 세 단계",
    related:
      lang === "en"
        ? "Learn more in Parent Academy"
        : lang === "zh"
          ? "在家长课堂中了解更多"
          : "부모 아카데미에서 더 알아보기",
    success:
      lang === "en"
        ? "What success looks like"
        : lang === "zh"
          ? "成功可以是什么样子"
          : "이 정도면 충분해요",
    pictureWalkSuccess:
      lang === "en"
        ? "Not a perfect prediction—just your child noticing the pictures and wanting to know what happens next."
        : lang === "zh"
          ? "不需要猜得完全正确。孩子愿意观察图画，并想知道接下来会发生什么，就已经很好。"
          : "완벽하게 예상할 필요는 없어요. 아이가 그림을 살펴보고 다음 이야기를 궁금해하면 충분해요.",
    familyJournalSuccess:
      lang === "en"
        ? "A drawing, one label, or one sentence is enough. Success is your child finding something they want to say."
        : lang === "zh"
          ? "一幅画、一个标签或一句话就已经足够。孩子找到自己想表达的内容，就是成功。"
          : "그림 하나, 이름표 하나, 문장 하나면 충분해요. 아이가 표현하고 싶은 것을 찾았다면 성공이에요.",
  };
  const lesson =
    activity.goal === "read"
      ? 3
      : activity.goal === "school"
        ? 8
        : activity.goal === "identity"
          ? 1
          : 2;
  return (
    <PageShell
      eyebrow={`${activity.ages.join(", ")} · ${activity.skill[lang]}`}
      title={activity.title[lang]}
      subtitle={activity.summary[lang]}
    >
      <button
        onClick={back}
        className="mb-7 flex min-h-11 items-center gap-2 rounded-lg font-bold text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
      >
        <ArrowLeft size={18} />
        {t.activities}
      </button>
      <div className="grid gap-6 lg:grid-cols-[1fr_.58fr]">
        <Card className="overflow-hidden">
          <img
            src={activity.image}
            alt={activity.imageAlt[lang]}
            className="h-56 w-full object-cover md:h-72"
          />
          <div className="p-6 md:p-8">
            <div className="mb-7 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-2xl"
              >
                {activity.icon}
              </span>
              <div>
                <div className="flex flex-wrap gap-2">
                  <Chip>{activity.ages.join(", ")}</Chip>
                  <Chip>{activity.time}</Chip>
                </div>
                <p className="mt-2 font-bold text-stone-500">
                  {activity.skill[lang]}
                </p>
              </div>
            </div>
            <h2 className="mb-5 text-xl font-black text-stone-800">
              {c.steps}
            </h2>
            <ol className="space-y-5">
              {activity.steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 leading-7 text-stone-700">{s[lang]}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl bg-teal-50 p-5">
              <p className="text-xs font-black uppercase tracking-wider text-teal-700">
                {c.home}
              </p>
              <p className="mt-2 leading-7 text-stone-700">
                {activity.homeOption[lang]}
              </p>
            </div>
            {(activity.id === "picture-walk" ||
              activity.id === "family-journal") && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                  {c.success}
                </p>
                <p className="mt-2 leading-7 text-stone-700">
                  {activity.id === "picture-walk"
                    ? c.pictureWalkSuccess
                    : c.familyJournalSuccess}
                </p>
              </div>
            )}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="bg-amber-50 p-6">
            <p className="text-sm font-black uppercase tracking-wider text-amber-900">
              {t.why}
            </p>
            <p className="mt-3 leading-7 text-stone-700">
              {activity.why[lang]}
            </p>
            <div className="mt-6 rounded-2xl bg-white p-5">
              <MessageCircle size={20} className="text-teal-700" />
              <p className="mt-2 text-xs font-black uppercase tracking-wider text-stone-400">
                {c.try}
              </p>
              <p className="mt-2 text-lg font-black text-stone-800">
                “{activity.phrase[lang]}”
              </p>
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-black uppercase tracking-wider text-teal-700">
              {c.adjust}
            </p>
            <div className="mt-4 border-l-2 border-teal-200 pl-4">
              <p className="font-black text-stone-800">{c.easier}</p>
              <p className="mt-1 leading-6 text-stone-600">
                {activity.easier[lang]}
              </p>
            </div>
            <div className="mt-5 border-l-2 border-violet-200 pl-4">
              <p className="font-black text-stone-800">{c.stretch}</p>
              <p className="mt-1 leading-6 text-stone-600">
                {activity.stretch[lang]}
              </p>
            </div>
            <button
              onClick={() => openLesson(lesson)}
              className="mt-6 flex min-h-11 items-center gap-2 rounded-lg font-black text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
            >
              {c.related}
              <ArrowRight size={17} />
            </button>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function Understand({
  lang,
  t,
}: {
  lang: Language;
  t: Record<string, string>;
}) {
  return (
    <PageShell
      eyebrow={t.understand}
      title={
        lang === "en"
          ? "Language growth is a journey, not a race."
          : lang === "zh"
            ? "语言成长是一段旅程，不是一场比赛。"
            : "언어 성장은 경주가 아니라 여정입니다."
      }
      subtitle={
        lang === "en"
          ? "Clear, reassuring explanations for the questions families ask most."
          : lang === "zh"
            ? "为家长最关心的问题提供清晰、安心的解释。"
            : "가족들이 가장 많이 묻는 질문에 명확하고 안심되는 설명을 드려요."
      }
    >
      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <Card className="h-fit overflow-hidden bg-teal-800 text-white">
          <img
            src={activities[3].image}
            alt={activities[3].imageAlt[lang]}
            loading="lazy"
            className="h-48 w-full object-cover object-center"
          />
          <div className="p-6 md:p-8">
            <BookOpen size={28} />
            <h2 className="mt-5 text-2xl font-black">{t.wida}</h2>
            <p className="mt-4 leading-7 text-teal-50">
              {questions[3].a[lang]}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Listening", "Speaking", "Reading", "Writing"].map((x) => (
                <Chip key={x} className="bg-white/12 text-white">
                  {x}
                </Chip>
              ))}
            </div>
          </div>
        </Card>
        <div>
          <h2 className="mb-4 text-2xl font-black text-stone-800">
            {t.common}
          </h2>
          <Accordion lang={lang} />
        </div>
      </div>
    </PageShell>
  );
}
function Accordion({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {questions.map((item, i) => {
        const answerId = `answer-${i}`;
        return (
          <Card key={i} className="overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex min-h-16 w-full items-center justify-between gap-4 p-5 text-left font-black text-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-teal-700/20"
              aria-expanded={open === i}
              aria-controls={answerId}
            >
              <span>{item.q[lang]}</span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "shrink-0 transition",
                  open === i && "rotate-180",
                )}
              />
            </button>
            {open === i && (
              <p
                id={answerId}
                className="border-t border-stone-100 px-5 py-5 leading-7 text-stone-600"
              >
                {item.a[lang]}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Academy({
  lang,
  t,
  selectedNumber,
  openLesson,
}: {
  lang: Language;
  t: Record<string, string>;
  selectedNumber: number;
  openLesson: (n: number) => void;
}) {
  const selectedLesson =
    academyLessons.find((x) => x.number === selectedNumber) || null;
  const visibleLessons = academyLessons.filter((x) => x.number <= 12);
  if (selectedLesson) {
    const photo = academyPhotoForLesson(selectedLesson.number);
    return (
      <PageShell
        eyebrow={`${t.academy} · ${lang === "en" ? `Lesson ${selectedLesson.number}` : lang === "zh" ? `第 ${selectedLesson.number} 课` : `${selectedLesson.number}강`}`}
        title={selectedLesson.title}
        subtitle={
          lang === "en"
            ? "One useful idea and one small action for this week."
            : lang === "zh"
              ? "本周一个实用想法和一个小行动。"
              : "이번 주를 위한 유용한 생각 하나와 작은 실천 하나."
        }
      >
        <a
          href="#/academy"
          className="mb-7 flex min-h-11 w-fit items-center gap-2 rounded-lg font-bold text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
        >
          <ArrowLeft size={18} />
          {lang === "en"
            ? "All Parent Academy lessons"
            : lang === "zh"
              ? "所有家长课堂课程"
              : "모든 부모 아카데미 수업"}
        </a>
        {lang !== "en" && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
            {lang === "zh"
              ? "本课程目前提供英文版本。中文翻译正在准备中。"
              : "이 수업은 현재 영어로 제공됩니다. 번역을 준비하고 있습니다."}
          </div>
        )}
        <Card className="mx-auto max-w-3xl overflow-hidden">
          <img
            src={photo.image}
            alt={photo.alt}
            className="h-56 w-full object-cover md:h-72"
          />
          <div className="p-6 md:p-10">
            <LessonContent body={selectedLesson.website} />
            <RelatedActivity lang={lang} lesson={selectedLesson.number} />
          </div>
        </Card>
      </PageShell>
    );
  }
  return (
    <PageShell
      eyebrow={t.academy}
      title={
        lang === "en"
          ? "Short lessons. Lasting confidence."
          : lang === "zh"
            ? "简短课程，带来长久信心。"
            : "짧은 배움으로 오래가는 자신감을."
      }
      subtitle={
        lang === "en"
          ? "Choose one question that matters to your family today. You can come back for the rest later."
          : lang === "zh"
            ? "选择一个今天对您家庭最重要的问题，其余内容可以以后再看。"
            : "오늘 우리 가족에게 중요한 질문 하나를 골라보세요. 나머지는 나중에 다시 볼 수 있어요."
      }
    >
      <Card className="mb-8 grid overflow-hidden md:grid-cols-[.85fr_1.15fr]">
        <img
          src={activities[4].image}
          alt={activities[4].imageAlt[lang]}
          loading="lazy"
          className="h-56 w-full object-cover md:h-full"
        />
        <div className="flex flex-col justify-center p-6 md:p-8">
          <Chip className="w-fit bg-teal-50 text-teal-800">
            {lang === "en"
              ? "Made for real family life"
              : lang === "zh"
                ? "为真实的家庭生活而设计"
                : "실제 가족의 일상을 위해"}
          </Chip>
          <h2 className="font-display mt-4 text-3xl font-bold text-stone-800">
            {lang === "en"
              ? "You do not have to become the teacher."
              : lang === "zh"
                ? "您不必成为老师。"
                : "부모님이 선생님이 될 필요는 없어요."}
          </h2>
          <p className="mt-3 leading-7 text-stone-600">
            {lang === "en"
              ? "Your role is connection: noticing, listening, asking, and encouraging. Each lesson ends with one small thing to try."
              : lang === "zh"
                ? "您的角色是建立连接：观察、倾听、提问和鼓励。每节课最后都有一个可以尝试的小行动。"
                : "부모님의 역할은 연결입니다. 살펴보고, 듣고, 질문하고, 격려해 주세요. 각 수업은 작은 실천 하나로 끝납니다."}
          </p>
        </div>
      </Card>
      {lang !== "en" && (
        <p className="mb-5 text-sm font-bold text-stone-500">
          {lang === "zh"
            ? "完整课程目前为英文版；中文翻译正在准备中。"
            : "전체 수업은 현재 영어로 제공되며 번역을 준비하고 있습니다."}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleLessons.map((lesson) => {
          const photo = academyPhotoForLesson(lesson.number);
          return (
            <Card
              key={lesson.number}
              className="group flex min-h-72 flex-col overflow-hidden"
            >
              <div className="h-36 overflow-hidden bg-stone-100">
                <img
                  src={photo.image}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-black uppercase tracking-wider text-teal-700">
                  {lang === "en"
                    ? `Lesson ${lesson.number}`
                    : lang === "zh"
                      ? `第 ${lesson.number} 课`
                      : `${lesson.number}강`}
                </p>
                <h2 className="mt-2 text-xl font-black text-stone-800">
                  {lesson.title}
                </h2>
                <button
                  onClick={() => openLesson(lesson.number)}
                  className="mt-auto flex min-h-11 items-center gap-2 rounded-lg pt-5 font-bold text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
                >
                  {lang === "en"
                    ? "Read lesson"
                    : lang === "zh"
                      ? "阅读英文课程"
                      : "영어 수업 읽기"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

function RelatedActivity({ lang, lesson }: { lang: Language; lesson: number }) {
  const ids: Record<number, string> = {
    1: "language-legacy",
    2: "explain-it",
    3: "echo-reading",
    8: "practice-the-ask",
  };
  const activity = activities.find(
    (a) => a.id === (ids[lesson] || "picture-talk"),
  )!;
  return (
    <div className="mt-10 border-t border-stone-200 pt-7">
      <p className="text-xs font-black uppercase tracking-wider text-teal-700">
        {lang === "en"
          ? "Try this next"
          : lang === "zh"
            ? "接下来试试"
            : "다음으로 해 보세요"}
      </p>
      <a
        href={`#/activity/${activity.id}`}
        className="mt-3 flex min-h-16 items-center justify-between gap-3 rounded-2xl bg-teal-50 p-4 font-black text-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
      >
        <span>{activity.title[lang]}</span>
        <ArrowRight className="text-teal-700" />
      </a>
    </div>
  );
}

function LessonContent({ body }: { body: string }) {
  const clean = (text: string) =>
    text.replace(/\*\*/g, "").replace(/^\*|\*$/g, "");
  return (
    <article className="academy-copy">
      {body
        .split("\n")
        .filter(Boolean)
        .map((line, i) => {
          if (line.startsWith("### ")) return <h2 key={i}>{line.slice(4)}</h2>;
          if (line.startsWith("- "))
            return (
              <p key={i} className="academy-example">
                <Check size={17} />
                <span>{clean(line.slice(2))}</span>
              </p>
            );
          if (line.startsWith("> "))
            return <blockquote key={i}>{clean(line.slice(2))}</blockquote>;
          if (line.startsWith("**") && line.endsWith("**"))
            return (
              <p key={i} className="academy-lead">
                {clean(line)}
              </p>
            );
          return <p key={i}>{clean(line)}</p>;
        })}
    </article>
  );
}

function Ask({ lang, t }: { lang: Language; t: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<(typeof questions)[0] | null>(null);
  const find = (question = query) => {
    setQuery(question);
    const words = question.toLowerCase().split(/\s+/);
    setAnswer(
      questions.find((x) =>
        words.some(
          (w) =>
            w.length > 2 &&
            `${x.q[lang]} ${x.a[lang]}`.toLowerCase().includes(w),
        ),
      ) ?? questions[0],
    );
  };
  return (
    <PageShell eyebrow={t.ask} title={t.askTitle} subtitle={t.askSub}>
      <div className="mx-auto max-w-3xl">
        <Card className="p-5 md:p-8">
          <p className="text-sm font-black uppercase tracking-[.12em] text-teal-700">
            {lang === "en"
              ? "Start with one question"
              : lang === "zh"
                ? "从一个问题开始"
                : "질문 하나로 시작하세요"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {questions.slice(0, 3).map((item) => (
              <button
                key={item.q.en}
                onClick={() => find(item.q[lang])}
                className="min-h-11 rounded-full border border-stone-200 bg-white px-4 text-left text-sm font-bold text-stone-700 transition hover:border-teal-700 hover:text-teal-800"
              >
                {item.q[lang]}
              </button>
            ))}
          </div>
          <label
            className="mt-7 block font-black text-stone-800"
            htmlFor="parent-question"
          >
            {lang === "en"
              ? "Or search in your own words"
              : lang === "zh"
                ? "或者用您自己的话搜索"
                : "또는 직접 검색해 보세요"}
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="parent-question"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && find()}
              placeholder={t.askPlaceholder}
              className="min-h-13 flex-1 rounded-2xl border border-stone-200 px-4 outline-none focus:ring-4 focus:ring-teal-700/15"
            />
            <Button onClick={() => find()}>
              <Search size={18} />
              {t.find}
            </Button>
          </div>
          {answer && (
            <div className="mt-7 rounded-2xl bg-teal-50 p-5 md:p-6">
              <div className="flex gap-3">
                <CircleHelp className="mt-1 shrink-0 text-teal-700" />
                <div>
                  <h2 className="text-lg font-black text-stone-800">
                    {answer.q[lang]}
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    {answer.a[lang]}
                  </p>
                  <p className="mt-4 text-sm font-bold text-teal-800">
                    {lang === "en"
                      ? "A helpful next step: share this question with your child’s teacher."
                      : lang === "zh"
                        ? "下一步建议：也可以把这个问题告诉孩子的老师。"
                        : "도움이 되는 다음 단계: 이 질문을 아이의 선생님과 나눠보세요."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
        <a
          href="https://www.mymultilingualfamily.com/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex min-h-20 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-stone-700 shadow-sm transition hover:border-teal-700"
        >
          <BookOpen className="shrink-0 text-teal-700" />
          <span className="flex-1">
            <strong className="block text-stone-800">
              {lang === "en"
                ? "Explore the full family guide"
                : lang === "zh"
                  ? "浏览完整的家庭指南"
                  : "전체 가족 가이드 살펴보기"}
            </strong>
            <span className="mt-1 block text-sm text-stone-500">
              My Multilingual Family
            </span>
          </span>
          <ExternalLink size={18} />
        </a>
      </div>
    </PageShell>
  );
}

function FindAnswers({
  lang,
  t,
}: {
  lang: Language;
  t: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<(typeof questions)[0] | null>(null);
  const [searched, setSearched] = useState(false);
  const find = (text = query) => {
    setQuery(text);
    setSearched(true);
    const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
    const words = normalized.split(/\s+/).filter((w) => w.length > 2);
    const ranked = questions
      .map((item) => {
        const hay = `${item.q[lang]} ${item.a[lang]}`.toLowerCase();
        const score = words.reduce(
          (sum, word) => sum + (hay.includes(word) ? 1 : 0),
          0,
        );
        return { item, score };
      })
      .sort((a, b) => b.score - a.score);
    setAnswer(ranked[0]?.score >= 2 ? ranked[0].item : null);
  };
  const noResult =
    lang === "en"
      ? "We don’t have a reviewed answer for that yet."
      : lang === "zh"
        ? "我们暂时还没有针对此问题的审核答案。"
        : "아직 검토된 답변이 없어요.";
  return (
    <PageShell eyebrow={t.ask} title={t.askTitle} subtitle={t.askSub}>
      <div className="mx-auto max-w-3xl">
        <Card className="p-5 md:p-8">
          <p className="text-sm font-black uppercase tracking-[.12em] text-teal-700">
            {lang === "en"
              ? "Choose a common question"
              : lang === "zh"
                ? "选择一个常见问题"
                : "자주 묻는 질문을 골라보세요"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {questions.map((item) => (
              <button
                key={item.q.en}
                onClick={() => find(item.q[lang])}
                className="min-h-11 rounded-full border border-stone-200 bg-white px-4 text-left text-sm font-bold text-stone-700 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
              >
                {item.q[lang]}
              </button>
            ))}
          </div>
          <label
            className="mt-7 block font-black text-stone-800"
            htmlFor="parent-question"
          >
            {lang === "en"
              ? "Or search in your own words"
              : lang === "zh"
                ? "或者用您自己的话搜索"
                : "또는 직접 검색해 보세요"}
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="parent-question"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && find()}
              placeholder={t.askPlaceholder}
              className="min-h-13 flex-1 rounded-2xl border border-stone-200 px-4 outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
            />
            <Button onClick={() => find()}>
              <Search size={18} />
              {t.find}
            </Button>
          </div>
          {answer ? (
            <div
              className="mt-7 rounded-2xl bg-teal-50 p-5 md:p-6"
              role="status"
            >
              <div className="flex gap-3">
                <CircleHelp className="mt-1 shrink-0 text-teal-700" />
                <div>
                  <h2 className="text-lg font-black text-stone-800">
                    {answer.q[lang]}
                  </h2>
                  <p className="mt-3 leading-7 text-stone-700">
                    {answer.a[lang]}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href="#/activities" className="font-black text-teal-800">
                      {lang === "en"
                        ? "Find a related activity →"
                        : lang === "zh"
                          ? "查找相关活动 →"
                          : "관련 활동 찾기 →"}
                    </a>
                    <a href="#/school" className="font-black text-teal-800">
                      {lang === "en"
                        ? "Prepare a teacher question →"
                        : lang === "zh"
                          ? "准备一个教师问题 →"
                          : "교사 질문 준비하기 →"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            searched && (
              <div className="mt-7 rounded-2xl bg-amber-50 p-5" role="status">
                <h2 className="font-black text-stone-800">{noResult}</h2>
                <p className="mt-2 leading-7 text-stone-600">
                  {lang === "en"
                    ? "Try one of the reviewed questions above, explore the family guide, or bring a school-specific concern to your child’s teacher."
                    : lang === "zh"
                      ? "请尝试上方经审核的问题、浏览家庭指南，或向孩子的老师咨询学校相关问题。"
                      : "위의 검토된 질문을 선택하거나 가족 가이드를 살펴보고, 학교 관련 문제는 아이의 선생님과 나눠 주세요."}
                </p>
              </div>
            )
          )}
        </Card>
        <p className="mt-4 px-2 text-sm leading-6 text-stone-500">
          {lang === "en"
            ? "General educational guidance only. Please do not enter names, assessment records, or other identifying information."
            : lang === "zh"
              ? "本页面仅提供一般教育指导。请勿输入姓名、评估记录或其他身份信息。"
              : "일반적인 교육 안내만 제공합니다. 이름, 평가 기록 등 개인을 식별할 수 있는 정보는 입력하지 마세요."}
        </p>
      </div>
    </PageShell>
  );
}

function SchoolPage({
  lang,
  t,
}: {
  lang: Language;
  t: Record<string, string>;
}) {
  const [copied, setCopied] = useState("");
  const meeting: Record<Language, string[]> = {
    en: [
      "What is my child doing well?",
      "When does my child feel most confident?",
      "What is one thing we can practice at home?",
    ],
    zh: [
      "我的孩子在哪些方面做得很好？",
      "孩子什么时候最有信心？",
      "我们可以在家练习哪一件事？",
    ],
    ko: [
      "우리 아이가 잘하고 있는 것은 무엇인가요?",
      "아이가 언제 가장 자신감을 보이나요?",
      "집에서 연습할 수 있는 한 가지는 무엇인가요?",
    ],
  };
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1600);
  };
  const phraseHeading =
    lang === "en"
      ? "Useful questions to copy"
      : lang === "zh"
        ? "可以复制使用的实用问题"
        : "복사해서 사용할 수 있는 질문";
  const category: Record<Language, Record<string, string>> = {
    en: {
      Progress: "Progress",
      Participation: "Participation",
      "Language support": "Language support",
      Strengths: "Strengths",
      "Next step": "Next step",
      Communication: "Communication",
    },
    zh: {
      Progress: "学习进展",
      Participation: "课堂参与",
      "Language support": "语言支持",
      Strengths: "优势",
      "Next step": "下一步",
      Communication: "沟通",
    },
    ko: {
      Progress: "학습 진전",
      Participation: "수업 참여",
      "Language support": "언어 지원",
      Strengths: "강점",
      "Next step": "다음 단계",
      Communication: "소통",
    },
  };
  return (
    <PageShell eyebrow={t.school} title={t.schoolTitle} subtitle={t.schoolSub}>
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <Card className="h-fit bg-amber-50 p-6">
          <School className="text-amber-800" />
          <h2 className="mt-4 text-xl font-black text-stone-800">
            {t.meeting}
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            {lang === "en"
              ? "Choose two or three. You do not need to ask everything."
              : lang === "zh"
                ? "选择两三个即可，不需要每个都问。"
                : "두세 가지만 골라보세요. 모두 물어볼 필요는 없어요."}
          </p>
          <ul className="mt-5 space-y-4">
            {meeting[lang].map((x) => (
              <li key={x} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-teal-700">
                  <Check size={14} />
                </span>
                <span className="leading-6 text-stone-700">{x}</span>
              </li>
            ))}
          </ul>
        </Card>
        <div>
          <h2 className="mb-4 text-xl font-black text-stone-800">
            {phraseHeading}
          </h2>
          <div className="space-y-3">
            {phrases.map((p) => {
              const text = p[lang];
              return (
                <Card key={p.en} className="flex items-center gap-4 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-50">
                    <Languages size={19} className="text-teal-700" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-wider text-stone-400">
                      {category[lang][p.category]}
                    </p>
                    <p className="mt-1 font-bold text-stone-800">{text}</p>
                    {lang !== "en" && (
                      <p className="mt-1 text-sm text-stone-500">{p.en}</p>
                    )}
                  </div>
                  <button
                    onClick={() => copy(text)}
                    className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-stone-100"
                    aria-label={t.copy}
                  >
                    {copied === text ? (
                      <Check className="text-teal-700" size={19} />
                    ) : (
                      <ClipboardCopy size={19} />
                    )}
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function WeeklyFeature({
  lang,
  select,
  openLesson,
}: {
  lang: Language;
  select: (a: Activity) => void;
  openLesson: (n: number) => void;
}) {
  const activity = activities.find((a) => a.id === "explain-it")!;
  const copy = {
    eyebrow:
      lang === "en"
        ? "This week for multilingual families"
        : lang === "zh"
          ? "本周多语言家庭主题"
          : "이번 주 다언어 가정을 위한 이야기",
    title:
      lang === "en"
        ? "You do not have to become the English teacher."
        : lang === "zh"
          ? "您不必成为英语老师。"
          : "영어 선생님이 될 필요는 없어요.",
    sub:
      lang === "en"
        ? "Your strongest family language is one of the best tools you already have."
        : lang === "zh"
          ? "您最熟悉的家庭语言，就是您已经拥有的最好工具之一。"
          : "가족이 가장 잘 쓰는 언어는 이미 가지고 있는 가장 좋은 도구 중 하나예요.",
    body:
      lang === "en"
        ? "Children use language to think, explain, tell stories, and stay connected to who they are. When those abilities grow in the home language, they create a strong foundation for learning English too. Your role is not to correct every word. It is to listen, wonder, and invite your child to say a little more."
        : lang === "zh"
          ? "孩子通过语言思考、解释、讲故事，并保持与自身身份的连接。当这些能力在家庭语言中发展时，也会为英语学习打下坚实基础。您的角色不是纠正每一个词，而是倾听、好奇，并邀请孩子多说一点。"
          : "아이는 언어로 생각하고, 설명하고, 이야기를 만들며 자신의 정체성과 연결됩니다. 이런 능력이 가족 언어로 자라면 영어 학습에도 든든한 기초가 됩니다. 부모님의 역할은 모든 단어를 고치는 것이 아니라 듣고, 궁금해하고, 아이가 조금 더 말하도록 초대하는 것입니다.",
  };
  return (
    <PageShell eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.sub}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="overflow-hidden">
          <img
            src={academyFamilyLanguage}
            alt="An Asian family supporting a school-age child at home"
            className="h-60 w-full object-cover md:h-80"
          />
          <div className="p-6 md:p-9">
            <p className="text-lg leading-8 text-stone-700">{copy.body}</p>
            <blockquote className="mt-7 rounded-2xl bg-teal-50 p-5 font-display text-2xl font-bold leading-9 text-stone-800">
              {lang === "en"
                ? "“Tell me more—in any language.”"
                : lang === "zh"
                  ? "“再多告诉我一点吧——用任何语言都可以。”"
                  : "“어떤 언어로든 조금 더 이야기해 줘.”"}
            </blockquote>
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-6">
            <p className="text-xs font-black uppercase tracking-wider text-teal-700">
              {lang === "en"
                ? "Try this together"
                : lang === "zh"
                  ? "一起试试"
                  : "함께 해 보세요"}
            </p>
            <h2 className="mt-3 text-2xl font-black text-stone-800">
              {activity.title[lang]}
            </h2>
            <p className="mt-3 leading-7 text-stone-600">
              {activity.summary[lang]}
            </p>
            <Button onClick={() => select(activity)} className="mt-6">
              {lang === "en"
                ? "Open activity"
                : lang === "zh"
                  ? "打开活动"
                  : "활동 열기"}
              <ArrowRight size={18} />
            </Button>
          </Card>
          <Card className="p-6">
            <p className="text-xs font-black uppercase tracking-wider text-violet-700">
              {lang === "en"
                ? "Learn a little more"
                : lang === "zh"
                  ? "进一步了解"
                  : "조금 더 알아보기"}
            </p>
            <h2 className="mt-3 text-xl font-black text-stone-800">
              {lang === "en"
                ? "Your home language is a superpower"
                : lang === "zh"
                  ? "家庭语言是一种超能力"
                  : "가족 언어는 강점이에요"}
            </h2>
            <button
              onClick={() => openLesson(1)}
              className="mt-5 flex min-h-11 items-center gap-2 rounded-lg font-black text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
            >
              {lang === "en"
                ? "Read Parent Academy lesson"
                : lang === "zh"
                  ? "阅读家长课堂"
                  : "부모 아카데미 읽기"}
              <ArrowRight size={17} />
            </button>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function TrustPage({ lang, privacy }: { lang: Language; privacy: boolean }) {
  if (privacy)
    return (
      <PageShell
        eyebrow={
          lang === "en" ? "Privacy" : lang === "zh" ? "隐私" : "개인정보"
        }
        title={
          lang === "en"
            ? "Private by design."
            : lang === "zh"
              ? "以隐私为设计原则。"
              : "개인정보를 먼저 생각합니다."
        }
        subtitle={
          lang === "en"
            ? "LinguaFlow Family currently works without accounts, advertising, or a database."
            : lang === "zh"
              ? "LinguaFlow Family 目前无需账户、广告或数据库即可使用。"
              : "LinguaFlow Family는 현재 계정, 광고, 데이터베이스 없이 작동합니다."
        }
      >
        <Card className="max-w-3xl p-6 md:p-9">
          <div className="space-y-6 leading-7 text-stone-700">
            <p>
              {lang === "en"
                ? "Your selected language and age band are stored only in this browser so the site can remember your preferences. They are not sent to us."
                : lang === "zh"
                  ? "您选择的语言和年龄段只保存在此浏览器中，用于记住偏好，不会发送给我们。"
                  : "선택한 언어와 연령대는 이 브라우저에만 저장되며 저희에게 전송되지 않습니다."}
            </p>
            <p>
              {lang === "en"
                ? "The current answer finder searches a small, reviewed library on your device. It does not send questions to an AI service. Please do not enter names, assessment records, or identifying information."
                : lang === "zh"
                  ? "目前的答案查找功能只在设备上的小型审核内容库中搜索，不会把问题发送给 AI 服务。请勿输入姓名、评估记录或身份信息。"
                  : "현재 답변 찾기는 기기의 작은 검토 자료만 검색하며 AI 서비스로 질문을 보내지 않습니다. 이름이나 평가 기록 등 식별 정보는 입력하지 마세요."}
            </p>
          </div>
        </Card>
      </PageShell>
    );
  return (
    <PageShell
      eyebrow={
        lang === "en"
          ? "About LinguaFlow Family"
          : lang === "zh"
            ? "关于 LinguaFlow Family"
            : "LinguaFlow Family 소개"
      }
      title={
        lang === "en"
          ? "Practical support. Calm guidance."
          : lang === "zh"
            ? "实用支持，安心指导。"
            : "실용적인 지원과 편안한 안내."
      }
      subtitle={
        lang === "en"
          ? "Created for multilingual families in international-school communities."
          : lang === "zh"
            ? "为国际学校社区中的多语言家庭而创建。"
            : "국제학교 공동체의 다언어 가정을 위해 만들었습니다."
      }
    >
      <div className="grid gap-5 md:grid-cols-3">
        <TrustCard
          title={
            lang === "en"
              ? "Our promise"
              : lang === "zh"
                ? "我们的承诺"
                : "우리의 약속"
          }
          text={
            lang === "en"
              ? "You do not need perfect English or teaching expertise. We offer one small, useful next step."
              : lang === "zh"
                ? "您不需要完美的英语或教学经验，我们只提供一个小而实用的下一步。"
                : "완벽한 영어와 교육 전문 지식은 필요하지 않아요. 작고 유용한 다음 단계를 제안합니다."
          }
        />
        <TrustCard
          title={
            lang === "en"
              ? "Editorial approach"
              : lang === "zh"
                ? "内容审核方式"
                : "콘텐츠 원칙"
          }
          text={
            lang === "en"
              ? "Content is written in plain language, informed by EAL practice and research, and reviewed before publication."
              : lang === "zh"
                ? "内容使用通俗语言撰写，以 EAL 实践和研究为基础，并在发布前审核。"
                : "쉬운 말로 작성하고 EAL 실천과 연구를 참고해 게시 전에 검토합니다."
          }
        />
        <TrustCard
          title={
            lang === "en"
              ? "Clear limits"
              : lang === "zh"
                ? "明确边界"
                : "명확한 한계"
          }
          text={
            lang === "en"
              ? "This is general educational guidance, not medical, diagnostic, safeguarding, or school-specific advice."
              : lang === "zh"
                ? "本网站提供一般教育指导，不替代医疗、诊断、儿童保护或学校具体建议。"
                : "일반 교육 안내이며 의료, 진단, 아동 보호, 학교별 조언을 대신하지 않습니다."
          }
        />
      </div>
      <Card className="mt-6 p-6 md:p-8">
        <h2 className="text-xl font-black text-stone-800">
          {lang === "en"
            ? "Part of the LinguaFlow ecosystem"
            : lang === "zh"
              ? "LinguaFlow 生态系统的一部分"
              : "LinguaFlow 생태계의 일부"}
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          {lang === "en"
            ? "LinguaFlow Family connects family-friendly activities, parent learning, and school conversations. For more multilingual-family writing and resources, visit My Multilingual Family."
            : lang === "zh"
              ? "LinguaFlow Family 连接亲子活动、家长学习和学校沟通。更多多语言家庭文章与资源，请访问 My Multilingual Family。"
              : "LinguaFlow Family는 가족 활동, 부모 학습, 학교 대화를 연결합니다. 더 많은 자료는 My Multilingual Family에서 확인하세요."}
        </p>
        <a
          href="https://www.mymultilingualfamily.com/"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg font-black text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20"
        >
          My Multilingual Family
          <ExternalLink size={17} />
        </a>
      </Card>
    </PageShell>
  );
}

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <Card className="p-6">
      <Check className="text-teal-700" />
      <h2 className="mt-4 text-xl font-black text-stone-800">{title}</h2>
      <p className="mt-3 leading-7 text-stone-600">{text}</p>
    </Card>
  );
}

function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-black text-teal-700">{eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-balance text-4xl font-bold tracking-[-.03em] text-stone-800 md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 mb-10 max-w-2xl text-lg leading-8 text-stone-600">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
}

// Retained temporarily while newsletter launch components replace the earlier prototypes.
void Today;
void Ask;

export default App;
