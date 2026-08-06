import pictureTalk from '../assets/activities/picture-talk.webp'
import wordHunt from '../assets/activities/word-hunt.webp'
import wouldYouRather from '../assets/activities/would-you-rather.webp'
import echoReading from '../assets/activities/echo-reading.webp'
import kitchenDescriber from '../assets/activities/kitchen-describer.webp'
import familyJournal from '../assets/activities/family-journal.webp'

export type Language = 'en' | 'zh' | 'ko'
export type LocalText = Record<Language, string>

export type Activity = {
  id: string; icon: string; image: string; imageAlt: LocalText; title: LocalText; summary: LocalText; time: string;
  skill: LocalText; steps: LocalText[]; phrase: LocalText
}

const activityContent: Omit<Activity, 'image' | 'imageAlt'>[] = [
  { id: 'picture-talk', icon: '🖼️', title: { en: 'Picture Talk', zh: '看图说话', ko: '그림 이야기' }, summary: { en: 'Use any family photo to start a relaxed conversation.', zh: '用一张家庭照片轻松开启对话。', ko: '가족사진으로 편안하게 대화를 시작해요.' }, time: '10 min', skill: { en: 'Speaking', zh: '口语', ko: '말하기' }, steps: [{ en: 'Choose a photo your child likes.', zh: '选择一张孩子喜欢的照片。', ko: '아이가 좋아하는 사진을 골라요.' }, { en: 'Ask: What do you notice?', zh: '问：“你注意到了什么？”', ko: '“무엇이 보이니?”라고 물어보세요.' }, { en: 'Follow their answer with one curious question.', zh: '根据孩子的回答再问一个好奇的问题。', ko: '아이의 대답에 호기심 어린 질문을 하나 더 해요.' }], phrase: { en: 'Tell me more about that.', zh: '再多告诉我一点吧。', ko: '그것에 대해 더 이야기해 줘.' } },
  { id: 'word-hunt', icon: '🔎', title: { en: 'Word Hunt', zh: '单词寻宝', ko: '단어 찾기' }, summary: { en: 'Find everyday words around your home or neighborhood.', zh: '在家里或社区寻找日常词汇。', ko: '집이나 동네에서 일상 단어를 찾아요.' }, time: '15 min', skill: { en: 'Vocabulary', zh: '词汇', ko: '어휘' }, steps: [{ en: 'Pick a letter or theme, like food.', zh: '选择一个字母或主题，比如食物。', ko: '글자나 음식 같은 주제를 정해요.' }, { en: 'Find five matching things together.', zh: '一起找出五个相关的东西。', ko: '함께 관련된 것 다섯 개를 찾아요.' }, { en: 'Name them in both languages.', zh: '用两种语言说出它们。', ko: '두 언어로 이름을 말해요.' }], phrase: { en: 'What else can we find?', zh: '我们还能找到什么？', ko: '또 무엇을 찾을 수 있을까?' } },
  { id: 'would-you-rather', icon: '💭', title: { en: 'Would You Rather?', zh: '你会选哪个？', ko: '어느 쪽이 좋아?' }, summary: { en: 'Build longer answers through playful choices.', zh: '通过有趣的选择练习更完整的回答。', ko: '재미있는 선택으로 긴 대답을 연습해요.' }, time: '10 min', skill: { en: 'Conversation', zh: '对话', ko: '대화' }, steps: [{ en: 'Offer two funny choices.', zh: '给出两个有趣的选择。', ko: '재미있는 선택지 두 개를 말해요.' }, { en: 'Ask your child to choose and explain why.', zh: '请孩子选择并说明原因。', ko: '아이가 선택하고 이유를 말하게 해요.' }, { en: 'Take your turn and compare answers.', zh: '轮到你选择，然后比较答案。', ko: '부모님도 선택하고 답을 비교해요.' }], phrase: { en: 'Why did you choose that?', zh: '你为什么这样选？', ko: '왜 그것을 골랐어?' } },
  { id: 'echo-reading', icon: '📖', title: { en: 'Echo Reading', zh: '回声阅读', ko: '메아리 읽기' }, summary: { en: 'Take turns reading one short line at a time.', zh: '轮流读一句简短的文字。', ko: '짧은 문장을 한 줄씩 번갈아 읽어요.' }, time: '10 min', skill: { en: 'Reading', zh: '阅读', ko: '읽기' }, steps: [{ en: 'Choose a short, familiar book.', zh: '选择一本简短、熟悉的书。', ko: '짧고 익숙한 책을 골라요.' }, { en: 'Read one line with expression.', zh: '有感情地读一句。', ko: '한 문장을 실감 나게 읽어요.' }, { en: 'Invite your child to echo you.', zh: '请孩子像回声一样跟读。', ko: '아이가 그대로 따라 읽게 해요.' }], phrase: { en: 'Let’s read this part together.', zh: '我们一起读这一段吧。', ko: '이 부분을 함께 읽자.' } },
  { id: 'kitchen-describer', icon: '🥕', title: { en: 'Kitchen Describer', zh: '厨房描述家', ko: '주방 묘사 놀이' }, summary: { en: 'Describe ingredients while making a snack together.', zh: '一起做点心时描述食材。', ko: '간식을 만들며 재료를 묘사해요.' }, time: '15 min', skill: { en: 'Describing', zh: '描述', ko: '묘사하기' }, steps: [{ en: 'Choose three safe ingredients.', zh: '选择三种安全的食材。', ko: '안전한 재료 세 가지를 골라요.' }, { en: 'Describe color, shape, smell, and texture.', zh: '描述颜色、形状、气味和质感。', ko: '색, 모양, 냄새, 촉감을 말해요.' }, { en: 'Make a silly comparison.', zh: '做一个有趣的比喻。', ko: '재미있는 비교를 해봐요.' }], phrase: { en: 'How does it feel?', zh: '摸起来感觉怎么样？', ko: '만지면 어떤 느낌이야?' } },
  { id: 'family-journal', icon: '✏️', title: { en: 'Family Journal', zh: '家庭日记', ko: '가족 일기' }, summary: { en: 'Write or draw one small moment from the day.', zh: '写下或画出今天的一个小瞬间。', ko: '오늘의 작은 순간 하나를 쓰거나 그려요.' }, time: '15 min', skill: { en: 'Writing', zh: '写作', ko: '쓰기' }, steps: [{ en: 'Let your child choose one moment.', zh: '让孩子选择一个瞬间。', ko: '아이가 한 순간을 고르게 해요.' }, { en: 'Draw first, then add words or labels.', zh: '先画画，再添加词语或标签。', ko: '먼저 그리고 단어나 이름을 더해요.' }, { en: 'Read it aloud and celebrate the idea.', zh: '大声读出来，并肯定孩子的想法。', ko: '소리 내어 읽고 아이의 생각을 칭찬해요.' }], phrase: { en: 'Your idea matters.', zh: '你的想法很重要。', ko: '네 생각은 소중해.' } },
]

const activityMedia: Record<string, { image: string; imageAlt: LocalText }> = {
  'picture-talk': { image: pictureTalk, imageAlt: { en: 'A father and daughter looking through a family photo album', zh: '父亲和女儿一起翻看家庭相册', ko: '아버지와 딸이 함께 가족 사진첩을 보는 모습' } },
  'word-hunt': { image: wordHunt, imageAlt: { en: 'Two children drawing and exploring ideas together at a table', zh: '两个孩子在桌边一起画画和探索想法', ko: '두 아이가 탁자에서 함께 그림을 그리고 생각을 탐색하는 모습' } },
  'would-you-rather': { image: wouldYouRather, imageAlt: { en: 'A mother and daughter sharing a joyful conversation at home', zh: '母亲和女儿在家中开心地交谈', ko: '엄마와 딸이 집에서 즐겁게 대화하는 모습' } },
  'echo-reading': { image: echoReading, imageAlt: { en: 'A father and daughter reading a colorful book together', zh: '父亲和女儿一起阅读彩色图书', ko: '아버지와 딸이 함께 알록달록한 책을 읽는 모습' } },
  'kitchen-describer': { image: kitchenDescriber, imageAlt: { en: 'A mother and daughter preparing vegetables together in a kitchen', zh: '母亲和女儿在厨房一起准备蔬菜', ko: '엄마와 딸이 주방에서 함께 채소를 준비하는 모습' } },
  'family-journal': { image: familyJournal, imageAlt: { en: 'A parent and child drawing together at a table', zh: '家长和孩子在桌边一起画画', ko: '부모와 아이가 탁자에서 함께 그림을 그리는 모습' } },
}

export const activities: Activity[] = activityContent.map(activity => ({ ...activity, ...activityMedia[activity.id] }))

export const questions = [
  { q: { en: 'Should we stop using our home language?', zh: '我们应该停止使用家庭语言吗？', ko: '집에서 모국어 사용을 멈춰야 하나요?' }, a: { en: 'No. A strong home language supports thinking, identity, and learning English. Use the language in which your family can share the richest ideas.', zh: '不需要。扎实的家庭语言有助于思考、身份认同和英语学习。请使用最能让家人充分交流想法的语言。', ko: '아니요. 탄탄한 모국어는 사고력, 정체성, 영어 학습을 돕습니다. 가족이 가장 풍부하게 생각을 나눌 수 있는 언어를 사용하세요.' } },
  { q: { en: 'Why is my child quiet at school?', zh: '为什么孩子在学校很安静？', ko: '왜 아이가 학교에서 말이 없나요?' }, a: { en: 'Listening quietly can be an active stage of language learning. Give your child time, low-pressure chances to speak, and ask the teacher what they communicate nonverbally.', zh: '安静地倾听可能是语言学习中的积极阶段。给孩子时间和低压力的表达机会，并询问老师孩子如何用非语言方式交流。', ko: '조용히 듣는 것도 언어 학습의 적극적인 단계일 수 있어요. 아이에게 시간과 부담 없는 말하기 기회를 주고, 비언어적으로 어떻게 소통하는지 선생님께 물어보세요.' } },
  { q: { en: 'How long does learning English take?', zh: '学好英语需要多长时间？', ko: '영어를 배우는 데 얼마나 걸리나요?' }, a: { en: 'Every child is different. Social English often grows before the academic language used for explaining, comparing, and writing. Look for steady growth, not a deadline.', zh: '每个孩子都不一样。日常社交英语通常先于解释、比较和写作所需的学术语言发展。关注持续进步，而不是某个期限。', ko: '아이마다 다릅니다. 일상 영어는 설명, 비교, 쓰기에 필요한 학업 영어보다 먼저 자라는 경우가 많아요. 기한보다 꾸준한 성장을 살펴보세요.' } },
  { q: { en: 'What does a WIDA level mean?', zh: 'WIDA 等级是什么意思？', ko: 'WIDA 레벨은 무엇을 뜻하나요?' }, a: { en: 'It is a snapshot of how your child currently uses English for listening, speaking, reading, and writing. It is not a grade, an intelligence score, or a limit on what they can learn.', zh: '它反映孩子目前在听、说、读、写方面使用英语的情况。它不是成绩、智力分数，也不会限制孩子能学到什么。', ko: '듣기, 말하기, 읽기, 쓰기에서 아이가 현재 영어를 사용하는 모습을 보여주는 자료입니다. 성적이나 지능 점수도, 아이의 가능성을 제한하는 기준도 아닙니다.' } },
]

export const phrases = [
  { category: 'Progress', en: 'Could you show me an example of my child’s work?', zh: '您可以给我看一个孩子的作业示例吗？', ko: '우리 아이가 한 과제의 예를 보여 주실 수 있나요?' },
  { category: 'Participation', en: 'How does my child participate during class?', zh: '我的孩子在课堂上是怎样参与的？', ko: '우리 아이는 수업에 어떻게 참여하나요?' },
  { category: 'Language support', en: 'What language support is my child receiving?', zh: '我的孩子目前正在接受哪些语言支持？', ko: '우리 아이는 어떤 언어 지원을 받고 있나요?' },
  { category: 'Strengths', en: 'When does my child communicate most confidently?', zh: '我的孩子在什么时候最有信心地交流？', ko: '우리 아이는 언제 가장 자신 있게 의사소통하나요?' },
  { category: 'Next step', en: 'What is one goal we can support at home?', zh: '我们可以在家支持孩子实现哪一个目标？', ko: '집에서 도울 수 있는 한 가지 목표는 무엇인가요?' },
  { category: 'Communication', en: 'Who should I contact when I have a question?', zh: '如果我有问题，应该联系谁？', ko: '질문이 있을 때 누구에게 연락하면 되나요?' },
]
