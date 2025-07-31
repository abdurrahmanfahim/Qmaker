import React from 'react';
import { 
  DocumentTextIcon,
  PencilSquareIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const TemplateSelector = ({ onSelect, language = 'english' }) => {
  const getTemplates = (language) => {
    const templates = {
      english: [
        {
          id: 'translation',
          name: 'Translation',
          icon: ChatBubbleLeftRightIcon,
          heading: 'Translate the following:',
          content: '<p>Enter text to be translated...</p>',
          answer: 'Translation answer here...',
          marks: 5,
          type: 'translation'
        },
        {
          id: 'fill-blanks',
          name: 'Fill in the Blanks',
          icon: PencilSquareIcon,
          heading: 'Fill in the blanks:',
          content: '<p>The quick _____ fox jumps over the _____ dog.</p>',
          answer: 'brown, lazy',
          marks: 4,
          type: 'fill-blanks'
        },
        {
          id: 'vocabulary',
          name: 'Vocabulary',
          icon: BookOpenIcon,
          heading: 'Define the following terms:',
          content: '<p>1. Democracy<br>2. Constitution<br>3. Parliament</p>',
          answer: '1. Government by the people...\n2. Supreme law of the land...\n3. Legislative body...',
          marks: 6,
          type: 'vocabulary'
        },
        {
          id: 'grammar',
          name: 'Grammar Correction',
          icon: AcademicCapIcon,
          heading: 'Correct the grammatical errors:',
          content: '<p>She don\'t like to goes there everyday.</p>',
          answer: 'She doesn\'t like to go there every day.',
          marks: 3,
          type: 'grammar'
        },
        {
          id: 'essay',
          name: 'Essay Question',
          icon: DocumentTextIcon,
          heading: 'Write an essay on:',
          content: '<p>"The importance of education in modern society"</p><p><em>Write at least 200 words.</em></p>',
          answer: 'Essay should cover: importance, benefits, challenges, conclusion...',
          marks: 15,
          type: 'essay'
        },
        {
          id: 'matching',
          name: 'Matching',
          icon: ClipboardDocumentListIcon,
          heading: 'Match the following:',
          content: '<table><tr><th>Column A</th><th>Column B</th></tr><tr><td>1. Apple</td><td>a) Animal</td></tr><tr><td>2. Dog</td><td>b) Fruit</td></tr><tr><td>3. Car</td><td>c) Vehicle</td></tr></table>',
          answer: '1-b, 2-a, 3-c',
          marks: 3,
          type: 'matching'
        }
      ],
      arabic: [
        {
          id: 'translation',
          name: 'ترجمة',
          icon: ChatBubbleLeftRightIcon,
          heading: 'ترجم ما يلي:',
          content: '<p>أدخل النص المراد ترجمته...</p>',
          answer: 'إجابة الترجمة هنا...',
          marks: 5,
          type: 'translation'
        },
        {
          id: 'fill-blanks',
          name: 'املأ الفراغات',
          icon: PencilSquareIcon,
          heading: 'املأ الفراغات:',
          content: '<p>الثعلب _____ يقفز فوق الكلب _____.</p>',
          answer: 'السريع، الكسول',
          marks: 4,
          type: 'fill-blanks'
        },
        {
          id: 'vocabulary',
          name: 'المفردات',
          icon: BookOpenIcon,
          heading: 'عرّف المصطلحات التالية:',
          content: '<p>١. الديمقراطية<br>٢. الدستور<br>٣. البرلمان</p>',
          answer: '١. حكم الشعب...\n٢. القانون الأساسي...\n٣. الهيئة التشريعية...',
          marks: 6,
          type: 'vocabulary'
        },
        {
          id: 'grammar',
          name: 'تصحيح النحو',
          icon: AcademicCapIcon,
          heading: 'صحح الأخطاء النحوية:',
          content: '<p>هي لا تحب أن تذهب هناك كل يوم.</p>',
          answer: 'هي لا تحب أن تذهب إلى هناك كل يوم.',
          marks: 3,
          type: 'grammar'
        },
        {
          id: 'essay',
          name: 'سؤال مقالي',
          icon: DocumentTextIcon,
          heading: 'اكتب مقالاً عن:',
          content: '<p>"أهمية التعليم في المجتمع الحديث"</p><p><em>اكتب ما لا يقل عن ٢٠٠ كلمة.</em></p>',
          answer: 'يجب أن يغطي المقال: الأهمية، الفوائد، التحديات، الخاتمة...',
          marks: 15,
          type: 'essay'
        },
        {
          id: 'matching',
          name: 'المطابقة',
          icon: ClipboardDocumentListIcon,
          heading: 'طابق ما يلي:',
          content: '<table><tr><th>العمود أ</th><th>العمود ب</th></tr><tr><td>١. التفاحة</td><td>أ) حيوان</td></tr><tr><td>٢. الكلب</td><td>ب) فاكهة</td></tr><tr><td>٣. السيارة</td><td>ج) مركبة</td></tr></table>',
          answer: '١-ب، ٢-أ، ٣-ج',
          marks: 3,
          type: 'matching'
        }
      ],
      bangla: [
        {
          id: 'translation',
          name: 'অনুবাদ',
          icon: ChatBubbleLeftRightIcon,
          heading: 'নিম্নলিখিত অনুবাদ করুন:',
          content: '<p>অনুবাদের জন্য টেক্সট লিখুন...</p>',
          answer: 'অনুবাদের উত্তর এখানে...',
          marks: 5,
          type: 'translation'
        },
        {
          id: 'fill-blanks',
          name: 'শূন্যস্থান পূরণ',
          icon: PencilSquareIcon,
          heading: 'শূন্যস্থান পূরণ করুন:',
          content: '<p>দ্রুত _____ শিয়াল অলস _____ এর উপর দিয়ে লাফ দেয়।</p>',
          answer: 'বাদামী, কুকুর',
          marks: 4,
          type: 'fill-blanks'
        },
        {
          id: 'vocabulary',
          name: 'শব্দভাণ্ডার',
          icon: BookOpenIcon,
          heading: 'নিম্নলিখিত পরিভাষাগুলি সংজ্ঞায়িত করুন:',
          content: '<p>১. গণতন্ত্র<br>২. সংবিধান<br>৩. সংসদ</p>',
          answer: '১. জনগণের শাসন...\n২. দেশের সর্বোচ্চ আইন...\n৩. আইন প্রণয়নকারী সংস্থা...',
          marks: 6,
          type: 'vocabulary'
        },
        {
          id: 'grammar',
          name: 'ব্যাকরণ সংশোধন',
          icon: AcademicCapIcon,
          heading: 'ব্যাকরণগত ত্রুটি সংশোধন করুন:',
          content: '<p>সে প্রতিদিন সেখানে যেতে পছন্দ করে না।</p>',
          answer: 'সে প্রতিদিন সেখানে যেতে পছন্দ করে না।',
          marks: 3,
          type: 'grammar'
        },
        {
          id: 'essay',
          name: 'রচনা প্রশ্ন',
          icon: DocumentTextIcon,
          heading: 'একটি রচনা লিখুন:',
          content: '<p>"আধুনিক সমাজে শিক্ষার গুরুত্ব"</p><p><em>কমপক্ষে ২০০ শব্দ লিখুন।</em></p>',
          answer: 'রচনায় অন্তর্ভুক্ত করুন: গুরুত্ব, সুবিধা, চ্যালেঞ্জ, উপসংহার...',
          marks: 15,
          type: 'essay'
        },
        {
          id: 'matching',
          name: 'মিলকরণ',
          icon: ClipboardDocumentListIcon,
          heading: 'নিম্নলিখিত মিলান করুন:',
          content: '<table><tr><th>কলাম ক</th><th>কলাম খ</th></tr><tr><td>১. আপেল</td><td>ক) প্রাণী</td></tr><tr><td>২. কুকুর</td><td>খ) ফল</td></tr><tr><td>৩. গাড়ি</td><td>গ) যানবাহন</td></tr></table>',
          answer: '১-খ, ২-ক, ৩-গ',
          marks: 3,
          type: 'matching'
        }
      ],
      urdu: [
        {
          id: 'translation',
          name: 'ترجمہ',
          icon: ChatBubbleLeftRightIcon,
          heading: 'مندرجہ ذیل کا ترجمہ کریں:',
          content: '<p>ترجمے کے لیے متن داخل کریں...</p>',
          answer: 'ترجمے کا جواب یہاں...',
          marks: 5,
          type: 'translation'
        },
        {
          id: 'fill-blanks',
          name: 'خالی جگہ بھریں',
          icon: PencilSquareIcon,
          heading: 'خالی جگہ بھریں:',
          content: '<p>تیز _____ لومڑی سست _____ کے اوپر سے چھلانگ لگاتی ہے۔</p>',
          answer: 'بھوری، کتا',
          marks: 4,
          type: 'fill-blanks'
        },
        {
          id: 'vocabulary',
          name: 'لغت',
          icon: BookOpenIcon,
          heading: 'مندرجہ ذیل اصطلاحات کی تعریف کریں:',
          content: '<p>١. جمہوریت<br>٢. آئین<br>٣. پارلیمنٹ</p>',
          answer: '١. عوام کی حکومت...\n٢. ملک کا بنیادی قانون...\n٣. قانون ساز ادارہ...',
          marks: 6,
          type: 'vocabulary'
        },
        {
          id: 'grammar',
          name: 'گرامر کی اصلاح',
          icon: AcademicCapIcon,
          heading: 'گرامر کی غلطیاں درست کریں:',
          content: '<p>وہ روزانہ وہاں جانا پسند نہیں کرتی۔</p>',
          answer: 'وہ روزانہ وہاں جانا پسند نہیں کرتی۔',
          marks: 3,
          type: 'grammar'
        },
        {
          id: 'essay',
          name: 'مضمون کا سوال',
          icon: DocumentTextIcon,
          heading: 'مضمون لکھیں:',
          content: '<p>"جدید معاشرے میں تعلیم کی اہمیت"</p><p><em>کم از کم ٢٠٠ الفاظ لکھیں۔</em></p>',
          answer: 'مضمون میں شامل کریں: اہمیت، فوائد، چیلنجز، خلاصہ...',
          marks: 15,
          type: 'essay'
        },
        {
          id: 'matching',
          name: 'میچنگ',
          icon: ClipboardDocumentListIcon,
          heading: 'مندرجہ ذیل کو ملائیں:',
          content: '<table><tr><th>کالم الف</th><th>کالم ب</th></tr><tr><td>١. سیب</td><td>الف) جانور</td></tr><tr><td>٢. کتا</td><td>ب) پھل</td></tr><tr><td>٣. گاڑی</td><td>ج) گاڑی</td></tr></table>',
          answer: '١-ب، ٢-الف، ٣-ج',
          marks: 3,
          type: 'matching'
        }
      ]
    };
    return templates[language] || templates.english;
  };

  const templates = getTemplates(language);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {templates.map((template) => {
        const IconComponent = template.icon;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="flex flex-col items-center p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <span className={`text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center ${['arabic', 'urdu'].includes(language) ? 'font-arabic' : language === 'bangla' ? 'font-bangla' : ''}`}>
              {template.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {template.marks} marks
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TemplateSelector;